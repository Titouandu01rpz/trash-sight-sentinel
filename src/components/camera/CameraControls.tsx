
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CameraControlsProps {
  onSwitchCamera: () => void;
  isVisible: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({ onSwitchCamera, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <Button 
      variant="outline" 
      size="icon"
      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
      onClick={onSwitchCamera}
    >
      <RefreshCw size={20} />
    </Button>
  );
};

export default CameraControls;
