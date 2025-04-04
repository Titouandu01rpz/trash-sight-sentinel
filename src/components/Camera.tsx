
import React from 'react';
import CameraFeed from './camera/CameraFeed';
import CameraControls from './camera/CameraControls';
import { useCamera } from '@/hooks/useCamera';

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
  const {
    videoRef,
    canvasRef,
    hasPermission,
    errorMessage,
    startCamera,
    switchCamera,
    isMobile
  } = useCamera(onFrame, isPaused);

  // Update parent component when permission changes
  React.useEffect(() => {
    if (onPermissionChange) {
      onPermissionChange(hasPermission);
    }
  }, [hasPermission, onPermissionChange]);

  // Make startCamera accessible to parent components via a ref
  React.useImperativeHandle(ref, () => ({
    startCamera
  }), [startCamera]);

  if (hasPermission === false) {
    return (
      <div className="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-red-500 text-center p-4">{errorMessage || 'Unable to access camera'}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <CameraFeed 
        videoRef={videoRef} 
        canvasRef={canvasRef} 
        showRejection={showRejection} 
      />
      <CameraControls 
        onSwitchCamera={switchCamera}
        isVisible={hasPermission && isMobile()}
      />
    </div>
  );
});

Camera.displayName = "Camera";

export default Camera;
