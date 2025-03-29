
import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CameraProps {
  onFrame: (imageData: ImageData) => void;
  showRejection: boolean;
  isPaused: boolean;
}

const Camera: React.FC<CameraProps> = ({ onFrame, showRejection, isPaused }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasPermission(false);
        setErrorMessage('Camera access denied. Please allow camera permissions and refresh the page.');
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
      
      {/* Rejection overlay */}
      {showRejection && (
        <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center pointer-events-none">
          <X className="text-red-500 animate-pulse-red" size={120} strokeWidth={4} />
        </div>
      )}
    </div>
  );
};

export default Camera;
