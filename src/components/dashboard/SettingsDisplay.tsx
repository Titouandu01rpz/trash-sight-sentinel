
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BinType, binTypes } from '@/hooks/useTrashCategories';
import { Recycle } from 'lucide-react';

interface SettingsDisplayProps {
  selectedBin: string;
  acceptedCategories: string[];
}

const SettingsDisplay: React.FC<SettingsDisplayProps> = ({
  selectedBin,
  acceptedCategories
}) => {
  const currentBin = binTypes.find(bin => bin.id === selectedBin) as BinType;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Recycle className="h-5 w-5 text-primary recycling-icon" />
          <span>Active Recycling Bin</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div 
              className="h-8 w-8 rounded-full" 
              style={{ backgroundColor: currentBin.color }}
            ></div>
            <span className="font-medium text-lg">{currentBin.name}</span>
          </div>
          
          <div>
            <span className="text-muted-foreground">{currentBin.description}</span>
          </div>
          
          <div>
            <span className="font-medium">Accepted Categories:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {acceptedCategories.map(category => {
                // Find category color
                let color;
                switch (category) {
                  case 'cardboard': color = 'bg-cardboard text-black'; break;
                  case 'glass': color = 'bg-glass text-black'; break;
                  case 'metal': color = 'bg-metal text-white'; break;
                  case 'paper': color = 'bg-paper text-black'; break;
                  case 'plastic': color = 'bg-plastic text-black'; break;
                  case 'organic': color = 'bg-organic text-white'; break;
                  case 'battery': color = 'bg-battery text-white'; break;
                  case 'cups': color = 'bg-cups text-black'; break;
                  case 'trash': default: color = 'bg-trash text-white';
                }
                
                return (
                  <Badge key={category} className={color}>
                    {category}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsDisplay;
