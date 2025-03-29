
import React, { useState, useEffect, useRef } from 'react';
import { CameraRef } from './Camera';
import CameraPermissionDialog from './CameraPermissionDialog';
import detectionService, { Detection } from '@/services/DetectionService';
import tensorflowService from '@/services/TensorflowService';
import audioService from '@/services/AudioService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Import refactored components
import CameraSection from './dashboard/CameraSection';
import StatisticsSection from './dashboard/StatisticsSection';
import SettingsCard from './dashboard/SettingsCard';
import SettingsDisplay from './dashboard/SettingsDisplay';
import InformationAlert from './dashboard/InformationAlert';
import ModelUploader from './dashboard/ModelUploader';

const Dashboard: React.FC = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [activeDetection, setActiveDetection] = useState<string | null>(null);
  const [frameSize, setFrameSize] = useState({ width: 640, height: 480 });
  const [trashType, setTrashType] = useState('dark');
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>(['metal', 'trash']);
  const [showRejection, setShowRejection] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  const [rejectionCount, setRejectionCount] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  
  const { toast } = useToast();

  // Create a ref to the camera component
  const cameraRef = useRef<CameraRef>(null);

  // Check if model is already in browser storage
  useEffect(() => {
    const checkModelInStorage = async () => {
      try {
        const loaded = await tensorflowService.loadModelFromStorage();
        if (loaded) {
          setIsModelLoaded(true);
          toast({
            title: "ML Model loaded from storage",
            description: "Using the previously saved model for object detection"
          });
        }
      } catch (error) {
        console.error('Error checking for model in storage:', error);
      } finally {
        setIsCheckingStorage(false);
      }
    };

    checkModelInStorage();
  }, [toast]);

  // Reset system after rejection, but continue monitoring other objects
  useEffect(() => {
    if (showRejection) {
      // We're pausing all detections briefly
      setIsPaused(true);
      const timer = setTimeout(() => {
        setShowRejection(false);
        setIsPaused(false);
      }, 3000); // 3 seconds rejection timeout
      
      return () => clearTimeout(timer);
    }
  }, [showRejection]);

  // Map trash type to expected categories
  useEffect(() => {
    // Default mappings based on trash type
    switch (trashType) {
      case 'dark':
        setAcceptedCategories(['metal', 'trash']);
        break;
      case 'light':
        setAcceptedCategories(['paper', 'cardboard']);
        break;
      case 'colorful':
        setAcceptedCategories(['plastic', 'glass']);
        break;
      default:
        setAcceptedCategories(['metal']);
    }
    
    toast({
      title: `Trash type changed: ${trashType}`,
      description: `Now accepting: ${acceptedCategories.join(', ')}`,
    });
  }, [trashType]);

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

  const handlePermissionChange = (newPermissionState: boolean | null) => {
    setHasPermission(newPermissionState);
  };

  const handleRequestPermission = () => {
    setShowPermissionDialog(false);
    
    // Use the ref to call startCamera on the Camera component
    if (cameraRef.current) {
      cameraRef.current.startCamera().catch(error => {
        console.error('Failed to start camera:', error);
        // Show the permission dialog again if there was an error
        setShowPermissionDialog(true);
      });
    }
  };

  const handleModelLoaded = () => {
    setIsModelLoaded(true);
    toast({
      title: "ML Model loaded successfully",
      description: "Now using machine learning for object detection"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Trash Sight Sentinel</h1>
        <p className="text-muted-foreground">Real-time waste detection and sorting system</p>
      </header>

      <CameraPermissionDialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
        onRequestPermission={handleRequestPermission}
      />

      {!isModelLoaded && !isCheckingStorage && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ML Model Required</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelUploader onModelLoaded={handleModelLoaded} />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center flex-wrap">
                <CardTitle>Camera Feed {isModelLoaded ? '(ML Active)' : '(Mock Data)'}</CardTitle>
                <StatisticsSection 
                  detectionCount={detectionCount}
                  rejectionCount={rejectionCount}
                  isModelLoaded={isModelLoaded}
                  activeCategory={activeDetection}
                />
              </div>
            </CardHeader>
            <CardContent>
              <CameraSection 
                cameraRef={cameraRef}
                onFrame={handleFrame}
                showRejection={showRejection}
                isPaused={isPaused}
                hasPermission={hasPermission}
                onPermissionChange={handlePermissionChange}
                detections={detections}
                frameSize={frameSize}
                onRetryPermission={() => setShowPermissionDialog(true)}
              />
            </CardContent>
          </Card>

          <InformationAlert />
        </div>

        <div className="space-y-6">
          <SettingsCard 
            trashType={trashType}
            onTrashTypeChange={setTrashType}
            acceptedCategories={acceptedCategories}
            onAcceptedCategoriesChange={setAcceptedCategories}
          />

          <SettingsDisplay 
            trashType={trashType}
            acceptedCategories={acceptedCategories}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
