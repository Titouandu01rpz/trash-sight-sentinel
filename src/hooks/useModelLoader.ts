
import { useState, useEffect } from 'react';
import tensorflowService from '@/services/TensorflowService';
import { useToast } from '@/hooks/use-toast';

export const useModelLoader = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const { toast } = useToast();

  // Check if model is already in browser storage on initial load
  useEffect(() => {
    const checkModelInStorage = async () => {
      try {
        const loaded = await tensorflowService.loadModelFromStorage();
        if (loaded) {
          setIsModelLoaded(true);
          toast({
            title: "ML Model loaded from storage",
            description: "Using the previously saved model for object detection"
          });
        }
      } catch (error) {
        console.error('Error checking for model in storage:', error);
      } finally {
        setIsCheckingStorage(false);
      }
    };

    checkModelInStorage();
  }, [toast]);

  const handleModelLoaded = () => {
    setIsModelLoaded(true);
    toast({
      title: "ML Model loaded successfully",
      description: "Now using machine learning for object detection"
    });
  };

  return {
    isModelLoaded,
    isCheckingStorage,
    handleModelLoaded
  };
};
