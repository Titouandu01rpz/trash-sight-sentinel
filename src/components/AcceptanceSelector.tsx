
import React from 'react';
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RecyclingBin from './RecyclingBin';
import { binTypes } from '@/hooks/useTrashCategories';

interface AcceptanceSelectorProps {
  selectedBin: string;
  onBinChange: (value: string) => void;
  acceptedCategories: string[];
  onAcceptedCategoriesChange: (categories: string[]) => void;
}

const AcceptanceSelector: React.FC<AcceptanceSelectorProps> = ({ 
  selectedBin, 
  onBinChange, 
  acceptedCategories, 
}) => {
  return (
    <div className="space-y-6 p-4 bg-muted/50 rounded-lg">
      <div className="space-y-2">
        <Label className="text-lg font-semibold">Select a Recycling Bin</Label>
        <p className="text-muted-foreground text-sm">Choose the type of waste you want to collect</p>

        <ScrollArea className="w-full" orientation="horizontal">
          <div className="flex space-x-4 py-4 px-1">
            {binTypes.map(bin => (
              <RecyclingBin 
                key={bin.id} 
                bin={bin} 
                isSelected={selectedBin === bin.id}
                onClick={() => onBinChange(bin.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Selected Bin Info</CardTitle>
        </CardHeader>
        <CardContent>
          {binTypes.find(bin => bin.id === selectedBin)?.description}
          <div className="mt-2">
            <span className="font-semibold">Accepts:</span>{" "}
            <span className="italic">{acceptedCategories.join(', ')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptanceSelector;
