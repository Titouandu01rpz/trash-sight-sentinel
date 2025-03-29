
import React, { useState, useEffect } from 'react';
import Camera from './Camera';
import DetectionOverlay from './DetectionOverlay';
import AcceptanceSelector from './AcceptanceSelector';
import detectionService, { Detection } from '@/services/DetectionService';
import audioService from '@/services/AudioService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [frameSize, setFrameSize] = useState({ width: 640, height: 480 });
  const [trashType, setTrashType] = useState('dark');
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>(['metal']);
  const [showRejection, setShowRejection] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  const [rejectionCount, setRejectionCount] = useState(0);

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Trash Sight Sentinel</h1>
        <p className="text-muted-foreground">Real-time waste detection and sorting system</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Camera Feed</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    Detections: {detectionCount}
                  </Badge>
                  <Badge variant="outline" className="bg-red-50">
                    Rejections: {rejectionCount}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Camera 
                  onFrame={handleFrame} 
                  showRejection={showRejection}
                  isPaused={isPaused}
                />
                <DetectionOverlay 
                  detections={detections} 
                  width={frameSize.width} 
                  height={frameSize.height} 
                />
              </div>
            </CardContent>
          </Card>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>How It Works</AlertTitle>
            <AlertDescription>
              The system detects waste items and classifies them into six categories. 
              When items not matching your acceptance criteria are detected close to the camera,
              a red X and warning sound will appear, and detection will pause for 2 seconds.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <AcceptanceSelector 
                trashType={trashType}
                onTrashTypeChange={setTrashType}
                acceptedCategories={acceptedCategories}
                onAcceptedCategoriesChange={setAcceptedCategories}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Trash Type:</span> {trashType}
                </div>
                <div>
                  <span className="font-semibold">Accepted Categories:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {acceptedCategories.map(category => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
