
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useTrashCategories = () => {
  const [trashType, setTrashType] = useState('dark');
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>(['metal', 'trash']);
  const { toast } = useToast();

  // Map trash type to expected categories
  useEffect(() => {
    // Default mappings based on trash type
    switch (trashType) {
      case 'dark':
        setAcceptedCategories(['metal', 'trash']);
        break;
      case 'light':
        setAcceptedCategories(['paper', 'cardboard']);
        break;
      case 'colorful':
        setAcceptedCategories(['plastic', 'glass']);
        break;
      default:
        setAcceptedCategories(['metal']);
    }
    
    toast({
      title: `Trash type changed: ${trashType}`,
      description: `Now accepting: ${acceptedCategories.join(', ')}`,
    });
  }, [trashType]);

  return {
    trashType,
    setTrashType,
    acceptedCategories,
    setAcceptedCategories
  };
};
