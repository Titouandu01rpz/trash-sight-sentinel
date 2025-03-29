
import React from 'react';
import { Detection } from '@/services/DetectionService';

interface DetectionOverlayProps {
  detections: Detection[];
  width: number;
  height: number;
}

const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ detections, width, height }) => {
  if (!detections.length) return null;

  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none" 
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {detections.map((detection, index) => {
        const { bbox, class: category, confidence } = detection;
        
        // Get color based on waste category
        let color;
        switch (category) {
          case 'cardboard': color = '#C68E17'; break;
          case 'glass': color = '#86C3D0'; break;
          case 'metal': color = '#71797E'; break;
          case 'paper': color = '#F1E4C3'; break;
          case 'plastic': color = '#FFCC00'; break;
          case 'trash': 
          default: color = '#3A4035'; break;
        }

        return (
          <g key={index}>
            {/* Bounding box */}
            <rect
              x={bbox.x}
              y={bbox.y}
              width={bbox.width}
              height={bbox.height}
              stroke={color}
              strokeWidth="3"
              fill="none"
            />
            
            {/* Label background */}
            <rect
              x={bbox.x}
              y={bbox.y - 20}
              width={140}
              height={20}
              fill={color}
              fillOpacity="0.8"
            />
            
            {/* Label text */}
            <text
              x={bbox.x + 5}
              y={bbox.y - 5}
              fill="white"
              fontSize="14"
              fontWeight="bold"
            >
              {category} ({Math.round(confidence * 100)}%)
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default DetectionOverlay;
