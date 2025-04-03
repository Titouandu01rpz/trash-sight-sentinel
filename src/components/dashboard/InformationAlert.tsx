
import React from 'react';
import { InfoIcon, Recycle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const InformationAlert: React.FC = () => {
  return (
    <Alert className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <div className="flex items-center gap-2">
        <InfoIcon className="h-4 w-4 text-primary" />
        <AlertTitle className="font-semibold">Smart Recycling System</AlertTitle>
      </div>
      <AlertDescription className="mt-2 space-y-2">
        <p>
          This system detects and classifies waste into different categories, helping you sort items 
          into the correct recycling bins. Each colored bin accepts specific types of waste:
        </p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-bin-green"></div>
            <span>Green: Glass items</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-bin-yellow"></div>
            <span>Yellow: Plastic & packaging</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-bin-blue"></div>
            <span>Blue: Paper & cardboard</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-bin-red"></div>
            <span>Red: Metal items</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-bin-gray"></div>
            <span>Gray: General waste</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-bin-brown"></div>
            <span>Brown: Organic waste</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-bin-purple"></div>
            <span>Purple: Batteries</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-bin-white border"></div>
            <span>White: Cups</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-3 pt-2 border-t border-primary/20">
          <Recycle size={14} className="text-primary mr-1" />
          <span className="text-xs text-center italic">
            Proper recycling helps reduce landfill waste and conserves natural resources
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default InformationAlert;
