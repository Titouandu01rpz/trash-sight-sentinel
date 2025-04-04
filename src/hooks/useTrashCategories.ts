
import { useState } from 'react';

export type WasteCategory = 'glass' | 'plastic' | 'cardboard' | 'paper' | 'metal' | 'trash' | 'organic' | 'battery' | 'clothes' | 'shoes' | 'cups';

export type BinType = {
  id: string;
  name: string;
  color: string;
  description: string;
};

// Simplified bins - just 3 as requested
export const BINS: BinType[] = [
  { 
    id: 'yellow', 
    name: 'Recyclables', 
    color: '#FFEB3B', 
    description: 'All packaging that can be recycled including plastic bottles, cardboard, paper, metal cans, and glass.' 
  },
  { 
    id: 'purple', 
    name: 'Reusable Cups', 
    color: '#9C27B0', 
    description: 'Specific reusable cups that will be washed and reused, not thrown away.' 
  },
  { 
    id: 'black', 
    name: 'General Waste', 
    color: '#212121', 
    description: 'Food scraps, tissues, and items that cannot be recycled.' 
  },
];

// Export BINS as binTypes for backward compatibility
export const binTypes = BINS;

// Default categories for each bin
const DEFAULT_CATEGORIES: Record<string, WasteCategory[]> = {
  yellow: ['plastic', 'cardboard', 'paper', 'metal', 'glass'],
  purple: ['cups'],
  black: ['trash', 'organic', 'battery', 'clothes', 'shoes'],
};

export const useTrashCategories = () => {
  const [selectedBin, setSelectedBin] = useState<string>(BINS[0].id);
  const [acceptedCategories, setAcceptedCategories] = useState<WasteCategory[]>(DEFAULT_CATEGORIES[BINS[0].id]);

  const handleBinChange = (binId: string) => {
    setSelectedBin(binId);
    // Set default accepted categories for the selected bin
    setAcceptedCategories(DEFAULT_CATEGORIES[binId]);
  };

  return {
    bins: BINS,
    selectedBin,
    setSelectedBin: handleBinChange,
    acceptedCategories,
    setAcceptedCategories
  };
};
