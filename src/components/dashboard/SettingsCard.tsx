
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AcceptanceSelector from '../AcceptanceSelector';

interface SettingsCardProps {
  trashType: string;
  onTrashTypeChange: (value: string) => void;
  acceptedCategories: string[];
  onAcceptedCategoriesChange: (categories: string[]) => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  trashType,
  onTrashTypeChange,
  acceptedCategories,
  onAcceptedCategoriesChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acceptance Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <AcceptanceSelector 
          trashType={trashType}
          onTrashTypeChange={onTrashTypeChange}
          acceptedCategories={acceptedCategories}
          onAcceptedCategoriesChange={onAcceptedCategoriesChange}
        />
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
