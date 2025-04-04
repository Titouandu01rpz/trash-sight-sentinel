
import { pipeline, type Pipeline } from '@huggingface/transformers';
import { WasteCategory } from '@/hooks/useTrashCategories';
import { Detection, BoundingBox } from './DetectionService';

// Map model output labels to our application's waste categories
const LABEL_TO_CATEGORY_MAP: Record<string, WasteCategory> = {
  'Battery': 'battery',
  'Biological': 'organic',
  'Cardboard': 'cardboard',
  'Glass': 'glass',
  'Metal': 'metal',
  'Paper': 'paper',
  'Plastic': 'plastic',
  'Trash': 'trash',
  // Add mappings for other categories as needed
};

class HuggingFaceService {
  private classificationPipeline: Pipeline | null = null;
  private isModelLoading: boolean = false;
  private modelLoadPromise: Promise<Pipeline> | null = null;

  constructor() {
    console.log('HuggingFace service initialized');
  }

  // Initialize the model
  public async initModel(): Promise<boolean> {
    try {
      if (this.classificationPipeline) return true;
      if (this.isModelLoading) {
        return this.modelLoadPromise!.then(() => true);
      }

      this.isModelLoading = true;
      console.log('Loading HuggingFace model...');

      // Create the classification pipeline
      this.modelLoadPromise = pipeline(
        'image-classification',
        'prithivMLmods/Augmented-Waste-Classifier-SigLIP2'
      );
      
      this.classificationPipeline = await this.modelLoadPromise;
      this.isModelLoading = false;
      console.log('HuggingFace model loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading HuggingFace model:', error);
      this.isModelLoading = false;
      return false;
    }
  }

  // Process an image and return detections
  public async detectObjects(imageData: ImageData): Promise<Detection[]> {
    if (!this.classificationPipeline) {
      const initialized = await this.initModel();
      if (!initialized) {
        return [];
      }
    }

    try {
      // Create a canvas to convert ImageData to an image URL
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return [];
      
      ctx.putImageData(imageData, 0, 0);
      const imageUrl = canvas.toDataURL();

      // Run prediction
      const results = await this.classificationPipeline!(imageUrl);
      
      if (!results.length) return [];

      // Convert results to our Detection format
      const detections: Detection[] = results
        .filter(result => result.score > 0.4) // Filter by confidence threshold
        .map((result) => {
          const label = result.label;
          const wasteCategory = LABEL_TO_CATEGORY_MAP[label] || 'trash';
          
          // Create a bounding box positioned in the middle of the frame
          const width = imageData.width * 0.5;
          const height = imageData.height * 0.5;
          const x = (imageData.width - width) / 2;
          const y = (imageData.height - height) / 2;
          
          const bbox: BoundingBox = { x, y, width, height };
          
          return {
            class: wasteCategory as any, // Type assertion to match the Detection type
            confidence: result.score,
            bbox
          };
        });
      
      return detections;
    } catch (error) {
      console.error('Error detecting objects with HuggingFace:', error);
      return [];
    }
  }

  // Check if model is loaded
  public isModelLoaded(): boolean {
    return this.classificationPipeline !== null;
  }
}

export default new HuggingFaceService();
