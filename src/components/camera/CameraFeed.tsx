
import React, { useRef } from 'react';
import { X } from 'lucide-react';

interface CameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  showRejection: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ 
  videoRef, 
  canvasRef, 
  showRejection 
}) => {
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

export default CameraFeed;
