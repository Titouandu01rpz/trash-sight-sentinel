
import React, { useState, useRef } from 'react';
import { CameraRef } from './Camera';
import CameraPermissionDialog from './CameraPermissionDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import custom hooks
import { useModelLoader } from '@/hooks/useModelLoader';
import { useTrashCategories } from '@/hooks/useTrashCategories';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { useObjectDetection } from '@/hooks/useObjectDetection';

// Import refactored components
import CameraSection from './dashboard/CameraSection';
import StatisticsSection from './dashboard/StatisticsSection';
import SettingsCard from './dashboard/SettingsCard';
import SettingsDisplay from './dashboard/SettingsDisplay';
import InformationAlert from './dashboard/InformationAlert';
import ModelUploader from './dashboard/ModelUploader';

const Dashboard: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  // Create a ref to the camera component
  const cameraRef = useRef<CameraRef>(null);
  
  // Use custom hooks
  const { isModelLoaded, isCheckingStorage, handleModelLoaded } = useModelLoader();
  const { trashType, setTrashType, acceptedCategories, setAcceptedCategories } = useTrashCategories();
  const { 
    hasPermission, 
    showPermissionDialog, 
    setShowPermissionDialog, 
    handlePermissionChange, 
    handleRequestPermission 
  } = useCameraPermission();
  
  const { 
    detections,
    activeDetection,
    frameSize,
    showRejection,
    setShowRejection,
    detectionCount,
    rejectionCount,
    handleFrame
  } = useObjectDetection({
    isPaused,
    acceptedCategories,
    isModelLoaded
  });

  // When rejection is detected, pause processing briefly
  React.useEffect(() => {
    if (showRejection) {
      setIsPaused(true);
      const timer = setTimeout(() => {
        setShowRejection(false);
        setIsPaused(false);
      }, 3000); // 3 seconds rejection timeout
      
      return () => clearTimeout(timer);
    }
  }, [showRejection, setShowRejection]);

  const handleRequestPermissionWithRef = () => {
    handleRequestPermission(cameraRef);
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
        onRequestPermission={handleRequestPermissionWithRef}
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
