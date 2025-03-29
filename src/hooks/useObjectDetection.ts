
import { useState, useEffect } from 'react';
import { Detection } from '@/services/DetectionService';
import detectionService from '@/services/DetectionService';
import tensorflowService from '@/services/TensorflowService';
import audioService from '@/services/AudioService';
import { useToast } from '@/hooks/use-toast';

interface UseObjectDetectionProps {
  isPaused: boolean;
  acceptedCategories: string[];
  isModelLoaded: boolean;
}

export const useObjectDetection = ({ 
  isPaused, 
  acceptedCategories, 
  isModelLoaded 
}: UseObjectDetectionProps) => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [activeDetection, setActiveDetection] = useState<string | null>(null);
  const [frameSize, setFrameSize] = useState({ width: 640, height: 480 });
  const [showRejection, setShowRejection] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  const [rejectionCount, setRejectionCount] = useState(0);
  
  const handleFrame = async (imageData: ImageData) => {
    if (isPaused) return;
    
    // Update frame size
    if (imageData.width !== frameSize.width || imageData.height !== frameSize.height) {
      setFrameSize({ width: imageData.width, height: imageData.height });
    }
    
    // Process frame with detection service
    try {
      // Use TensorFlow model if loaded, otherwise fall back to mock service
      let newDetections: Detection[];
      
      if (isModelLoaded) {
        newDetections = await tensorflowService.detectObjects(imageData);
      } else {
        newDetections = await detectionService.detectObjects(imageData);
      }
      
      if (newDetections.length > 0) {
        // Track active detection
        if (newDetections.length > 0) {
          const largest = newDetections.reduce((prev, current) => {
            const prevArea = prev.bbox.width * prev.bbox.height;
            const currentArea = current.bbox.width * current.bbox.height;
            return currentArea > prevArea ? current : prev;
          });
          setActiveDetection(largest.class);
        } else {
          setActiveDetection(null);
        }
        
        setDetectionCount(prev => prev + 1);
        
        // Check for rejection conditions - only closest object should trigger rejection
        let closestRejectionDetected = false;
        
        // Sort detections by size (largest first - assuming closer to camera)
        const sortedDetections = [...newDetections].sort((a, b) => {
          const areaA = a.bbox.width * a.bbox.height;
          const areaB = b.bbox.width * b.bbox.height;
          return areaB - areaA; // Largest first
        });
        
        // Only check the largest object for rejection
        const largestDetection = sortedDetections[0];
        if (largestDetection) {
          const isAccepted = acceptedCategories.includes(largestDetection.class);
          const isClose = detectionService.isObjectClose(
            largestDetection.bbox, 
            imageData.width, 
            imageData.height
          );
          
          if (!isAccepted && isClose) {
            closestRejectionDetected = true;
            setRejectionCount(prev => prev + 1);
            setShowRejection(true);
            audioService.playBeep();
          }
        }
      }
      
      setDetections(newDetections);
    } catch (error) {
      console.error('Error processing frame:', error);
    }
  };

  // Reset rejection status after timeout
  useEffect(() => {
    if (showRejection) {
      const timer = setTimeout(() => {
        setShowRejection(false);
      }, 3000); // 3 seconds rejection timeout
      
      return () => clearTimeout(timer);
    }
  }, [showRejection]);

  return {
    detections,
    activeDetection,
    frameSize,
    showRejection,
    setShowRejection,
    detectionCount,
    rejectionCount,
    handleFrame
  };
};
