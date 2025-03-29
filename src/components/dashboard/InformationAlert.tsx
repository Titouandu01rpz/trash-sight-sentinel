
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const InformationAlert: React.FC = () => {
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>How It Works</AlertTitle>
      <AlertDescription>
        The system detects waste items and classifies them into six categories. 
        When items not matching your acceptance criteria are detected close to the camera,
        a red X and warning sound will appear, and detection will pause for 2 seconds.
      </AlertDescription>
    </Alert>
  );
};

export default InformationAlert;
