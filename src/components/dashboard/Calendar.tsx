import type { Reservation } from '../../types/reservation';
import CalendarHeatmapOriginal from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useState } from 'react';

// Data point type
export interface CalendarDay {
  date: string; // ISO yyyy-MM-dd
  count: number;
  reservations: Reservation[];
}

interface CalendarProps {
  reservations: Reservation[];
}

const Heatmap: any = CalendarHeatmapOriginal;

export default function Calendar({ reservations }: CalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Convert reservations to CalendarDay format
  const reservationsByDate: { [key: string]: Reservation[] } = {};
  
  reservations.forEach(r => {
    const dateStr = r.parsedDate.toISOString().split('T')[0]; // yyyy-MM-dd format
    if (!reservationsByDate[dateStr]) {
      reservationsByDate[dateStr] = [];
    }
    reservationsByDate[dateStr].push(r);
  });

  const data: CalendarDay[] = Object.entries(reservationsByDate).map(([date, dayReservations]) => ({
    date,
    count: dayReservations.length,
    reservations: dayReservations,
  }));

  // Find the year with most reservations
  const yearCounts: { [year: number]: number } = {};
  reservations.forEach(r => {
    const year = r.parsedDate.getFullYear();
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });

  const primaryYear = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0]?.[0] 
    ? parseInt(Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0][0])
    : new Date().getFullYear();

  const startDate = new Date(primaryYear, 0, 1); // January 1st of primary year
  const today = new Date();
  const endDate = primaryYear === today.getFullYear() 
    ? today 
    : new Date(primaryYear, 11, 31); // December 31st if not current year

  const handleMouseOver = (event: React.MouseEvent, value: CalendarDay | undefined) => {
    if (value && value.count > 0) {
      setHoveredDay(value);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    } else {
      setHoveredDay(null);
      setTooltipPosition(null);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredDay) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
    setTooltipPosition(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Activitat anual</h2>
      
      <div 
        className="overflow-x-auto md:overflow-visible p-4 relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="md:hidden">
          <Heatmap
            startDate={startDate}
            endDate={endDate}
            values={data}
            horizontal={false}
            classForValue={(value: CalendarDay | undefined) => {
              if (!value) {
                return 'color-empty';
              }
              if (value.count === 0) return 'color-scale-1';
              if (value.count === 1) return 'color-scale-3';
              return 'color-scale-4';
            }}
            showWeekdayLabels={false}
            tooltipDataAttrs={{
              'data-tooltip': (value: CalendarDay | undefined) => {
                if (!value || value.count === 0) return 'No activity';
                return `${value.count} reservation${value.count > 1 ? 's' : ''}`;
              },
            }}
            onMouseOver={(event: React.MouseEvent, value: CalendarDay | undefined) => handleMouseOver(event, value)}
          />
        </div>
        <div className="hidden md:block">
          <Heatmap
            startDate={startDate}
            endDate={endDate}
            values={data}
            classForValue={(value: CalendarDay | undefined) => {
              if (!value) {
                return 'color-empty';
              }
              if (value.count === 0) return 'color-scale-1';
              if (value.count === 1) return 'color-scale-3';
              return 'color-scale-4';
            }}
            showWeekdayLabels={false}
            tooltipDataAttrs={{
              'data-tooltip': (value: CalendarDay | undefined) => {
                if (!value || value.count === 0) return 'No activity';
                return `${value.count} reservation${value.count > 1 ? 's' : ''}`;
              },
            }}
            onMouseOver={(event: React.MouseEvent, value: CalendarDay | undefined) => handleMouseOver(event, value)}
          />
        </div>
      </div>

      {/* Custom tooltip */}
      {hoveredDay && tooltipPosition && (
        <div
          className="fixed z-50 bg-gray-900 text-white rounded-lg shadow-xl p-3 max-w-xs pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
          }}
        >
          <div className="text-xs font-semibold mb-2">
            {new Date(hoveredDay.date).toLocaleDateString('ca-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          {hoveredDay.count > 0 && (
            <div className="text-xs space-y-1">
              {hoveredDay.reservations.map((res, idx) => (
                <div key={idx} className="border-t border-gray-700 pt-1">
                  <div className="font-medium">{res.nom}</div>
                  <div className="text-gray-300">{res.horari}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
