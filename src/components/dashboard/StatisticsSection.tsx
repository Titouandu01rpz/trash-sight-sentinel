
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clipboard, CheckCircle, XCircle } from 'lucide-react';

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

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge variant="outline" className="flex items-center gap-1">
        <Clipboard size={14} />
        Detections: {detectionCount}
      </Badge>
      
      <Badge variant="outline" className="bg-red-50 flex items-center gap-1">
        <XCircle size={14} className="text-red-500" />
        Rejections: {rejectionCount}
      </Badge>
      
      <Badge variant="outline" className="bg-green-50 flex items-center gap-1">
        <CheckCircle size={14} className="text-green-500" />
        Acceptance: {acceptanceRate}%
      </Badge>
      
      {isModelLoaded && (
        <Badge variant="secondary" className="ml-2 bg-purple-100">
          ML Active
        </Badge>
      )}
      
      {activeCategory && (
        <Badge variant="outline" className="ml-2 bg-blue-100">
          Tracking: {activeCategory}
        </Badge>
      )}
    </div>
  );
};

export default StatisticsSection;
