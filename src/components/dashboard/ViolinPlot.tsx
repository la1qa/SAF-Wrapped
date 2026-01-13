import { scaleLinear } from "d3-scale";
import { area, curveCatmullRom } from "d3-shape";
import { useState, useEffect } from "react";

type TimeDensityPoint = {
  minute: number;
  count: number;
};

export function TimeDensity({
  data,
}: {
  data: TimeDensityPoint[];
}) {
  const [hoverPos, setHoverPos] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const width = isMobile ? Math.min(window.innerWidth - 64, 400) : 600;
  const height = isMobile ? 600 : 150;
  const padding = isMobile 
    ? { left: 50, right: 50, top: 60, bottom: 60 }
    : { left: 60, right: 20, top: 20, bottom: 40 };

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

  if (isMobile) {
    // Vertical: minute maps to Y, count maps to X
    const yScale = scaleLinear()
      .domain([420, 1260])
      .range([padding.top, height - padding.bottom]);

    const xScale = scaleLinear()
      .domain([0, maxCount])
      .range([0, (width - padding.left - padding.right) / 2]);

    const centerX = width / 2;

    const areaGen = area<TimeDensityPoint>()
      .y(d => yScale(d.minute))
      .x0(d => centerX - xScale(d.count))
      .x1(d => centerX + xScale(d.count))
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
      const y = e.clientY - rect.top;
      if (y >= padding.top && y <= height - padding.bottom) {
        setHoverPos(y);
      }
    };

    const handleMouseLeave = () => {
      setHoverPos(null);
    };

    const hoverMinute = hoverPos ? Math.round(yScale.invert(hoverPos)) : null;
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
        {/* Vertical axis line */}
        <line
          x1={centerX}
          y1={padding.top}
          x2={centerX}
          y2={height - padding.bottom}
          stroke="#d1d5db"
          strokeWidth={1}
        />
        
        {/* Time labels */}
        {timeLabels.map(minute => (
          <g key={minute}>
            <line
              x1={centerX - 5}
              y1={yScale(minute)}
              x2={centerX + 5}
              y2={yScale(minute)}
              stroke="#9ca3af"
              strokeWidth={1}
            />
            <text
              x={5}
              y={yScale(minute)}
              textAnchor="start"
              fontSize={10}
              fill="#6b7280"
              dominantBaseline="middle"
            >
              {formatTime(minute)}
            </text>
            <text
              x={width - 5}
              y={yScale(minute)}
              textAnchor="end"
              fontSize={10}
              fill="#6b7280"
              dominantBaseline="middle"
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
        {hoverPos && hoverMinute && (
          <>
            <line
              x1={padding.left}
              y1={hoverPos}
              x2={width - padding.right}
              y2={hoverPos}
              stroke="#374151"
              strokeWidth={2}
              strokeDasharray="4 2"
              opacity={0.7}
            />
            <rect
              x={width - 75}
              y={hoverPos - 16}
              width={70}
              height={32}
              fill="#374151"
              rx={4}
            />
            <text
              x={width - 40}
              y={hoverPos - 3}
              textAnchor="middle"
              fontSize={11}
              fill="white"
              fontWeight="500"
            >
              {formatTime(hoverMinute)}
            </text>
            <text
              x={width - 40}
              y={hoverPos + 11}
              textAnchor="middle"
              fontSize={10}
              fill="white"
              opacity={0.9}
            >
              {hoverCount} reserves
            </text>
          </>
        )}
        
        {/* X-axis label */}
        <text
          x={centerX}
          y={height - 10}
          textAnchor="middle"
          fontSize={11}
          fill="#6b7280"
          fontWeight="500"
        >
          Activitat
        </text>
      </svg>
    );
  }

  // Horizontal (desktop) layout
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
      setHoverPos(x);
    }
  };

  const handleMouseLeave = () => {
    setHoverPos(null);
  };

  const hoverMinute = hoverPos ? Math.round(xScale.invert(hoverPos)) : null;
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
      {hoverPos && hoverMinute && (
        <>
          <line
            x1={hoverPos}
            y1={padding.top}
            x2={hoverPos}
            y2={height - padding.bottom}
            stroke="#374151"
            strokeWidth={2}
            strokeDasharray="4 2"
            opacity={0.7}
          />
          <rect
            x={hoverPos - 35}
            y={5}
            width={70}
            height={32}
            fill="#374151"
            rx={4}
          />
          <text
            x={hoverPos}
            y={18}
            textAnchor="middle"
            fontSize={11}
            fill="white"
            fontWeight="500"
          >
            {formatTime(hoverMinute)}
          </text>
          <text
            x={hoverPos}
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
