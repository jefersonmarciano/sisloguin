import React, { useRef } from 'react';
import { WheelSegment } from '../types';

interface WheelProps {
  segments: WheelSegment[];
  spinDegrees: number;
  isSpinning: boolean;
}

const Wheel: React.FC<WheelProps> = ({ segments, spinDegrees, isSpinning }) => {
  const wheelRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-[min(80vw,320px)] h-[min(80vw,320px)] mx-auto">
      {/* Wheel pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#f97316]"></div>
      </div>
      {/* Wheel */}
      <div
        ref={wheelRef}
        className="w-full h-full rounded-full overflow-hidden shadow-lg will-change-transform"
        style={{
          transform: `rotate(${spinDegrees}deg)`,
          transition: isSpinning ? "transform 8s cubic-bezier(0.17, 0.67, 0.24, 1)" : "",
          boxShadow: isSpinning ? "0 0 20px rgba(249, 115, 22, 0.5)" : "",
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, index) => {
            const angle = 360 / segments.length;
            const startAngle = index * angle;
            const endAngle = (index + 1) * angle;

            // Calculate SVG path coordinates
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;

            const x1 = 50 + 50 * Math.cos(startRad);
            const y1 = 50 + 50 * Math.sin(startRad);
            const x2 = 50 + 50 * Math.cos(endRad);
            const y2 = 50 + 50 * Math.sin(endRad);

            const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

            // Text positioning
            const labelRad = (startAngle + angle / 2 - 90) * Math.PI / 180;
            const labelX = 50 + 35 * Math.cos(labelRad);
            const labelY = 50 + 35 * Math.sin(labelRad);

            const rotateDeg = startAngle + angle / 2;

            return (
              <g key={index}>
                <path
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  fill="white"
                  fontWeight="bold"
                  fontSize="6"
                  transform={`rotate(${rotateDeg}, ${labelX}, ${labelY})`}
                >
                  {segment.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {/* Center button - Fixed to be properly centered */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center shadow-md z-10 border-2 border-[#f97316]">
        <span className="font-bold text-[#f97316] text-xl tracking-wider">TEMU</span>
      </div>
    </div>
  );
};

export default Wheel;
