
import { useState, useEffect } from 'react';
import audioService from '@/services/AudioService';

export const useRejectionStatus = () => {
  const [showRejection, setShowRejection] = useState(false);
  
  // Reset rejection status after timeout
  useEffect(() => {
    if (showRejection) {
      const timer = setTimeout(() => {
        setShowRejection(false);
      }, 3000); // 3 seconds rejection timeout
      
      return () => clearTimeout(timer);
    }
  }, [showRejection]);
  
  const triggerRejection = () => {
    setShowRejection(true);
    audioService.playBeep();
  };
  
  return {
    showRejection,
    setShowRejection,
    triggerRejection
  };
};
