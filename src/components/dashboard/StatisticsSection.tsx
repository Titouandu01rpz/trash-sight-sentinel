
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatisticsSectionProps {
  detectionCount: number;
  rejectionCount: number;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  detectionCount,
  rejectionCount
}) => {
  return (
    <div className="flex gap-2">
      <Badge variant="outline">
        Detections: {detectionCount}
      </Badge>
      <Badge variant="outline" className="bg-red-50">
        Rejections: {rejectionCount}
      </Badge>
    </div>
  );
};

export default StatisticsSection;
