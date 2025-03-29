
import React, { useState, useEffect, useRef } from 'react';
import { CameraRef } from './Camera';
import CameraPermissionDialog from './CameraPermissionDialog';
import detectionService, { Detection } from '@/services/DetectionService';
import audioService from '@/services/AudioService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import refactored components
import CameraSection from './dashboard/CameraSection';
import StatisticsSection from './dashboard/StatisticsSection';
import SettingsCard from './dashboard/SettingsCard';
import SettingsDisplay from './dashboard/SettingsDisplay';
import InformationAlert from './dashboard/InformationAlert';

const Dashboard: React.FC = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [frameSize, setFrameSize] = useState({ width: 640, height: 480 });
  const [trashType, setTrashType] = useState('dark');
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>(['metal']);
  const [showRejection, setShowRejection] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  const [rejectionCount, setRejectionCount] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  
  // Create a ref to the camera component
  const cameraRef = useRef<CameraRef>(null);

  // Reset system after rejection
  useEffect(() => {
    if (showRejection) {
      setIsPaused(true);
      const timer = setTimeout(() => {
        setShowRejection(false);
        setIsPaused(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showRejection]);

  const handleFrame = async (imageData: ImageData) => {
    if (isPaused) return;
    
    // Update frame size
    if (imageData.width !== frameSize.width || imageData.height !== frameSize.height) {
      setFrameSize({ width: imageData.width, height: imageData.height });
    }
    
    // Process frame with detection service
    try {
      const newDetections = await detectionService.detectObjects(imageData);
      
      if (newDetections.length > 0) {
        setDetectionCount(prev => prev + 1);
        
        // Check for rejection conditions
        const rejectionDetected = newDetections.some(detection => {
          // Check if this category is not accepted
          const isAccepted = acceptedCategories.includes(detection.class);
          
          // Check if object is close enough to trigger rejection
          const isClose = detectionService.isObjectClose(
            detection.bbox, 
            imageData.width, 
            imageData.height
          );
          
          return !isAccepted && isClose;
        });
        
        if (rejectionDetected) {
          setRejectionCount(prev => prev + 1);
          setShowRejection(true);
          audioService.playBeep();
        }
      }
      
      setDetections(newDetections);
    } catch (error) {
      console.error('Error processing frame:', error);
    }
  };

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
  }, [trashType]);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Camera Feed</CardTitle>
                <StatisticsSection 
                  detectionCount={detectionCount}
                  rejectionCount={rejectionCount}
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
