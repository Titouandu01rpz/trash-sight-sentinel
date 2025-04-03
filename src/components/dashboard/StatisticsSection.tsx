
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Recycle, Trash2, Ban, CheckCircle } from 'lucide-react';

interface StatisticsSectionProps {
  detectionCount: number;
  rejectionCount: number;
  isModelLoaded: boolean;
  activeCategory?: string | null;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  detectionCount,
  rejectionCount,
  isModelLoaded,
  activeCategory
}) => {
  const acceptanceRate = detectionCount > 0 
    ? Math.round(((detectionCount - rejectionCount) / detectionCount) * 100) 
    : 0;

  // Get category color for badge
  const getCategoryColor = (category?: string | null) => {
    if (!category) return "";
    
    switch (category) {
      case 'cardboard': return 'bg-cardboard text-black';
      case 'glass': return 'bg-glass text-black';
      case 'metal': return 'bg-metal text-white';
      case 'paper': return 'bg-paper text-black';
      case 'plastic': return 'bg-plastic text-black';
      case 'organic': return 'bg-organic text-white';
      case 'battery': return 'bg-battery text-white';
      case 'cups': return 'bg-cups text-black';
      default: return 'bg-trash text-white';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge variant="outline" className="flex items-center gap-1 bg-muted">
        <Recycle size={14} className="text-primary" />
        <span>Items: {detectionCount}</span>
      </Badge>
      
      <Badge variant="outline" className="flex items-center gap-1 bg-destructive/10">
        <Ban size={14} className="text-destructive" />
        <span>Rejected: {rejectionCount}</span>
      </Badge>
      
      <Badge variant="outline" className="flex items-center gap-1 bg-primary/10">
        <CheckCircle size={14} className="text-primary" />
        <span>Accepted: {acceptanceRate}%</span>
      </Badge>
      
      {isModelLoaded && (
        <Badge variant="secondary" className="ml-2 bg-secondary/80">
          ML Active
        </Badge>
      )}
      
      {activeCategory && (
        <Badge variant="outline" className={`ml-2 ${getCategoryColor(activeCategory)}`}>
          <span className="capitalize">{activeCategory}</span>
        </Badge>
      )}
    </div>
  );
};

export default StatisticsSection;
