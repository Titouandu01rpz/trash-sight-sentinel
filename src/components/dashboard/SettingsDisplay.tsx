
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SettingsDisplayProps {
  trashType: string;
  acceptedCategories: string[];
}

const SettingsDisplay: React.FC<SettingsDisplayProps> = ({
  trashType,
  acceptedCategories
}) => {
  return (
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
  );
};

export default SettingsDisplay;
