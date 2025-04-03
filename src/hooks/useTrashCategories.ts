
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define bin types with their descriptions
export interface BinType {
  id: string;
  name: string;
  color: string;
  description: string;
  accepts: string[];
}

export const binTypes: BinType[] = [
  {
    id: 'green',
    name: 'Green Bin',
    color: '#4CAF50',
    description: 'For glass items (without caps or lids)',
    accepts: ['glass'],
  },
  {
    id: 'yellow',
    name: 'Yellow Bin',
    color: '#FFEB3B',
    description: 'For plastic, cardboard and packaging',
    accepts: ['plastic', 'cardboard'],
  },
  {
    id: 'blue',
    name: 'Blue Bin',
    color: '#2196F3',
    description: 'For paper, newspapers, directories, flyers, etc.',
    accepts: ['paper'],
  },
  {
    id: 'red',
    name: 'Red Bin',
    color: '#F44336',
    description: 'For metal waste items',
    accepts: ['metal'],
  },
  {
    id: 'gray',
    name: 'Gray/Black Bin',
    color: '#9E9E9E',
    description: 'For general waste that doesn\'t go in other bins',
    accepts: ['trash'],
  },
  {
    id: 'brown',
    name: 'Brown Bin',
    color: '#795548',
    description: 'For organic waste and biodegradable items',
    accepts: ['organic'],
  },
  {
    id: 'purple',
    name: 'Purple Bin',
    color: '#9C27B0',
    description: 'For batteries and electronic waste',
    accepts: ['battery'],
  },
  {
    id: 'white',
    name: 'White Bin',
    color: '#FFFFFF',
    description: 'For disposable cups',
    accepts: ['cups'],
  },
];

export const useTrashCategories = () => {
  const [selectedBin, setSelectedBin] = useState<string>('green');
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>(['glass']);
  const { toast } = useToast();

  // Update accepted categories when bin changes
  useEffect(() => {
    const bin = binTypes.find(bin => bin.id === selectedBin);
    if (bin) {
      setAcceptedCategories(bin.accepts);
      
      toast({
        title: `Selected bin: ${bin.name}`,
        description: `${bin.description}. Accepting: ${bin.accepts.join(', ')}`,
      });
    }
  }, [selectedBin, toast]);

  return {
    selectedBin,
    setSelectedBin,
    acceptedCategories,
    setAcceptedCategories,
    binTypes
  };
};
