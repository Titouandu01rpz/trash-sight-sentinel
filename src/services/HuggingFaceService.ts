
import { pipeline, type ImageClassificationPipeline } from '@huggingface/transformers';
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
  'Shoes': 'shoes',
  'Clothes': 'clothes',
  'Cups': 'cups'
};

// Define the structure of the classifier output for better type safety
interface ClassificationResult {
  label: string;
  score: number;
}

class HuggingFaceService {
  private classificationPipeline: ImageClassificationPipeline | null = null;
  private isModelLoading: boolean = false;
  private modelLoadPromise: Promise<ImageClassificationPipeline> | null = null;

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
        'Xenova/waste-classification-13'  // Using a compatible model instead
      ) as Promise<ImageClassificationPipeline>;
      
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
      
      if (!Array.isArray(results) || results.length === 0) return [];

      // Convert results to our Detection format
      const detections: Detection[] = results
        .filter((result: ClassificationResult) => result.score > 0.4) // Filter by confidence threshold
        .map((result: ClassificationResult) => {
          const label = result.label;
          // Handle the type safely
          const wasteCategory = LABEL_TO_CATEGORY_MAP[label] || 'trash';
          
          // Create a bounding box positioned in the middle of the frame
          const width = imageData.width * 0.5;
          const height = imageData.height * 0.5;
          const x = (imageData.width - width) / 2;
          const y = (imageData.height - height) / 2;
          
          const bbox: BoundingBox = { x, y, width, height };
          
          return {
            class: wasteCategory,
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
