
import { useState } from 'react';

export type WasteCategory = 'glass' | 'plastic' | 'cardboard' | 'paper' | 'metal' | 'trash' | 'organic' | 'battery' | 'cups';

export type BinType = {
  id: string;
  name: string;
  color: string;
};

export const BINS: BinType[] = [
  { id: 'green', name: 'Glass', color: '#4CAF50' },
  { id: 'yellow', name: 'Plastic & Packaging', color: '#FFEB3B' },
  { id: 'blue', name: 'Paper', color: '#2196F3' },
  { id: 'red', name: 'Metal', color: '#F44336' },
  { id: 'gray', name: 'Regular Waste', color: '#9E9E9E' },
  { id: 'brown', name: 'Organic Waste', color: '#795548' },
  { id: 'purple', name: 'Batteries', color: '#9C27B0' },
  { id: 'white', name: 'Cups', color: '#FFFFFF' },
];

const DEFAULT_CATEGORIES: Record<string, WasteCategory[]> = {
  green: ['glass'],
  yellow: ['plastic', 'cardboard'],
  blue: ['paper'],
  red: ['metal'],
  gray: ['trash'],
  brown: ['organic'],
  purple: ['battery'],
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
