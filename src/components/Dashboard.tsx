
import React, { useState, useRef } from 'react';
import { CameraRef } from './Camera';
import CameraPermissionDialog from './CameraPermissionDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recycle, Trash2 } from 'lucide-react';

// Import custom hooks
import { useTrashCategories, WasteCategory } from '@/hooks/useTrashCategories';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { useObjectDetection } from '@/hooks/useObjectDetection';

// Import refactored components
import CameraSection from './dashboard/CameraSection';
import StatisticsSection from './dashboard/StatisticsSection';
import SettingsCard from './dashboard/SettingsCard';
import SettingsDisplay from './dashboard/SettingsDisplay';
import InformationAlert from './dashboard/InformationAlert';

const Dashboard: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  // Create a ref to the camera component
  const cameraRef = useRef<CameraRef>(null);
  
  // Use custom hooks
  const { selectedBin, setSelectedBin, acceptedCategories, setAcceptedCategories } = useTrashCategories();
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
    handleFrame,
    useHuggingFace
  } = useObjectDetection({
    isPaused,
    acceptedCategories
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

  const handleAcceptedCategoriesChange = (categories: string[]) => {
    setAcceptedCategories(categories as WasteCategory[]);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <header className="text-center mb-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 opacity-10">
          <Recycle size={150} className="text-primary animate-float" />
        </div>
        <div className="flex justify-center items-center gap-2">
          <Recycle size={32} className="text-primary recycling-icon" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            EcoSort Guardian
          </h1>
          <Trash2 size={28} className="text-accent" />
        </div>
        <p className="text-muted-foreground mt-2">
          Smart recycling detection and sorting assistant
          {useHuggingFace && <span className="ml-1 text-primary">(using AI)</span>}
        </p>
      </header>

      <CameraPermissionDialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
        onRequestPermission={handleRequestPermissionWithRef}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <div className="flex justify-between items-center flex-wrap">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-full">
                    <Recycle size={20} className="text-primary" />
                  </div>
                  Camera Feed
                </CardTitle>
                <StatisticsSection 
                  detectionCount={detectionCount}
                  rejectionCount={rejectionCount}
                  isModelLoaded={useHuggingFace}
                  activeCategory={activeDetection}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
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
            selectedBin={selectedBin}
            onBinChange={setSelectedBin}
            acceptedCategories={acceptedCategories}
            onAcceptedCategoriesChange={handleAcceptedCategoriesChange}
          />

          <SettingsDisplay 
            selectedBin={selectedBin}
            acceptedCategories={acceptedCategories}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
