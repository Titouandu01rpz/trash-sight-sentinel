
import React, { useRef, useEffect, useState } from 'react';
import { X, CameraIcon, RefreshCw } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CameraProps {
  onFrame: (imageData: ImageData) => void;
  showRejection: boolean;
  isPaused: boolean;
  onPermissionChange?: (hasPermission: boolean | null) => void;
}

// Create a type to properly use the ref
export type CameraRef = {
  startCamera: () => Promise<void>;
};

const Camera = React.forwardRef<CameraRef, CameraProps>(({ 
  onFrame, 
  showRejection, 
  isPaused,
  onPermissionChange 
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Make startCamera accessible to parent components via a ref
  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        setHasPermission(true);
        if (onPermissionChange) onPermissionChange(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      setErrorMessage('Camera access denied. Please allow camera permissions and try again.');
      if (onPermissionChange) onPermissionChange(false);
    }
  };

  // Function to switch camera between front and back
  const switchCamera = async () => {
    // Toggle facing mode
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacingMode);
    
    // Restart camera with new facing mode
    if (hasPermission) {
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        const newStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: newFacingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        
        setStream(newStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (error) {
        console.error('Error switching camera:', error);
      }
    }
  };

  // Expose startCamera method to parent using React.forwardRef
  React.useImperativeHandle(ref, () => ({
    startCamera
  }), [stream, facingMode]);

  useEffect(() => {
    // Don't automatically start camera on component mount
    // This will be triggered by the permission dialog
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (!hasPermission || !videoRef.current || !canvasRef.current) return;

    const processFrame = () => {
      if (isPaused) {
        requestAnimationFrame(processFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== 4) {
        requestAnimationFrame(processFrame);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        requestAnimationFrame(processFrame);
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Extract image data and pass to parent
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      onFrame(imageData);
      
      requestAnimationFrame(processFrame);
    };

    videoRef.current.onloadedmetadata = () => {
      requestAnimationFrame(processFrame);
    };

  }, [hasPermission, onFrame, isPaused]);

  // Check if we're on a mobile device
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  if (hasPermission === false) {
    return (
      <div className="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-red-500 text-center p-4">{errorMessage || 'Unable to access camera'}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gray-900">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full h-full object-contain"
      />
      <canvas 
        ref={canvasRef} 
        className="hidden" 
      />
      
      {/* Camera switch button - only shown on mobile devices */}
      {hasPermission && isMobile() && (
        <Button 
          variant="outline" 
          size="icon"
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
          onClick={switchCamera}
        >
          <RefreshCw size={20} />
        </Button>
      )}
      
      {/* Rejection overlay */}
      {showRejection && (
        <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center pointer-events-none">
          <X className="text-red-500 animate-pulse-red" size={120} strokeWidth={4} />
        </div>
      )}
    </div>
  );
});

Camera.displayName = "Camera";

export default Camera;
