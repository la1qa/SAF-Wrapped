import { scaleLinear } from "d3-scale";
import { area, curveCatmullRom } from "d3-shape";
import { useState } from "react";

type TimeDensityPoint = {
  minute: number;
  count: number;
};

export function TimeDensity({
  data,
}: {
  data: TimeDensityPoint[];
}) {
  const [hoverX, setHoverX] = useState<number | null>(null);
  
  const width = 600;
  const height = 150;
  const padding = { left: 60, right: 20, top: 20, bottom: 40 };

  // Fill in missing time slots with count 0
  const filledData: TimeDensityPoint[] = [];
  for (let minute = 420; minute <= 1260; minute += 5) {
    const existing = data.find(d => d.minute === minute);
    filledData.push({
      minute,
      count: existing ? existing.count : 0
    });
  }

  const maxCount = Math.max(...filledData.map(d => d.count));

  // Horizontal: minute maps to X, count maps to Y (7:00 to 21:20)
  const xScale = scaleLinear()
    .domain([420, 1260])
    .range([padding.left, width - padding.right]);

  const yScale = scaleLinear()
    .domain([0, maxCount])
    .range([0, (height - padding.top - padding.bottom) / 2]);

  const centerY = height / 2;

  const areaGen = area<TimeDensityPoint>()
    .x(d => xScale(d.minute))
    .y0(d => centerY - yScale(d.count))
    .y1(d => centerY + yScale(d.count))
    .curve(curveCatmullRom);

  const pathData = areaGen(filledData) ?? undefined;

  // Time labels (every 2 hours from 7:00 to 21:00)
  const timeLabels = [420, 540, 660, 780, 900, 1020, 1140, 1260];
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x >= padding.left && x <= width - padding.right) {
      setHoverX(x);
    }
  };

  const handleMouseLeave = () => {
    setHoverX(null);
  };

  const hoverMinute = hoverX ? Math.round(xScale.invert(hoverX)) : null;
  const hoverCount = hoverMinute 
    ? filledData.find(d => Math.abs(d.minute - hoverMinute) < 3)?.count || 0
    : 0;

  return (
    <svg 
      width={width} 
      height={height} 
      className="overflow-visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Horizontal axis line */}
      <line
        x1={padding.left}
        y1={centerY}
        x2={width - padding.right}
        y2={centerY}
        stroke="#d1d5db"
        strokeWidth={1}
      />
      
      {/* Time labels */}
      {timeLabels.map(minute => (
        <g key={minute}>
          <line
            x1={xScale(minute)}
            y1={centerY - 5}
            x2={xScale(minute)}
            y2={centerY + 5}
            stroke="#9ca3af"
            strokeWidth={1}
          />
          <text
            x={xScale(minute)}
            y={height - 10}
            textAnchor="middle"
            fontSize={10}
            fill="#6b7280"
          >
            {formatTime(minute)}
          </text>
        </g>
      ))}

      {/* Violin shape */}
      <path
        d={pathData}
        fill="#e31139"
        opacity={0.8}
        stroke="#e31139"
        strokeWidth={1}
      />
      
      {/* Hover line and label */}
      {hoverX && hoverMinute && (
        <>
          <line
            x1={hoverX}
            y1={padding.top}
            x2={hoverX}
            y2={height - padding.bottom}
            stroke="#374151"
            strokeWidth={2}
            strokeDasharray="4 2"
            opacity={0.7}
          />
          <rect
            x={hoverX - 35}
            y={5}
            width={70}
            height={32}
            fill="#374151"
            rx={4}
          />
          <text
            x={hoverX}
            y={18}
            textAnchor="middle"
            fontSize={11}
            fill="white"
            fontWeight="500"
          >
            {formatTime(hoverMinute)}
          </text>
          <text
            x={hoverX}
            y={32}
            textAnchor="middle"
            fontSize={10}
            fill="white"
            opacity={0.9}
          >
            {hoverCount} reserves
          </text>
        </>
      )}
      
      {/* Y-axis label */}
      <text
        x={10}
        y={centerY}
        textAnchor="start"
        fontSize={11}
        fill="#6b7280"
        fontWeight="500"
      >
        Activitat
      </text>
    </svg>
  );
}
