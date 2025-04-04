
import { useState } from 'react';

export type WasteCategory = 'glass' | 'plastic' | 'cardboard' | 'paper' | 'metal' | 'trash' | 'organic' | 'battery' | 'clothes' | 'shoes' | 'cups';

export type BinType = {
  id: string;
  name: string;
  color: string;
  description?: string;
};

export const BINS: BinType[] = [
  { id: 'green', name: 'Glass', color: '#4CAF50', description: 'For glass items without caps or lids.' },
  { id: 'yellow', name: 'Plastic & Packaging', color: '#FFEB3B', description: 'For plastic and cardboard packaging. You can leave bottle caps on.' },
  { id: 'blue', name: 'Paper', color: '#2196F3', description: 'For paper, newspapers, magazines, and flyers.' },
  { id: 'red', name: 'Metal', color: '#F44336', description: 'For metal waste and containers.' },
  { id: 'gray', name: 'Regular Waste', color: '#9E9E9E', description: 'For general non-recyclable waste.' },
  { id: 'brown', name: 'Organic Waste', color: '#795548', description: 'For food scraps and biodegradable waste.' },
  { id: 'purple', name: 'Batteries', color: '#9C27B0', description: 'For used batteries and similar items.' },
  { id: 'pink', name: 'Clothes', color: '#EC407A', description: 'For clothing and textile items.' },
  { id: 'black', name: 'Shoes', color: '#212121', description: 'For footwear.' },
  { id: 'white', name: 'Cups', color: '#FFFFFF', description: 'For disposable cups and similar items.' },
];

// Export BINS as binTypes for backward compatibility
export const binTypes = BINS;

const DEFAULT_CATEGORIES: Record<string, WasteCategory[]> = {
  green: ['glass'],
  yellow: ['plastic', 'cardboard'],
  blue: ['paper'],
  red: ['metal'],
  gray: ['trash'],
  brown: ['organic'],
  purple: ['battery'],
  pink: ['clothes'],
  black: ['shoes'],
  white: ['cups'],
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
