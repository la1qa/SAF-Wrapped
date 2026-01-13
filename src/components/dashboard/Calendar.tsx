import type { Reservation } from '../../types/reservation';
import CalendarHeatmapOriginal from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

// Data point type
export interface CalendarDay {
  date: string; // ISO yyyy-MM-dd
  count: number;
}

interface CalendarProps {
  reservations: Reservation[];
}

const Heatmap: any = CalendarHeatmapOriginal;

export default function Calendar({ reservations }: CalendarProps) {
  // Convert reservations to CalendarDay format
  const reservationCounts: { [key: string]: number } = {};
  
  reservations.forEach(r => {
    const dateStr = r.parsedDate.toISOString().split('T')[0]; // yyyy-MM-dd format
    reservationCounts[dateStr] = (reservationCounts[dateStr] || 0) + 1;
  });

  const data: CalendarDay[] = Object.entries(reservationCounts).map(([date, count]) => ({
    date,
    count,
  }));

  // Get date range (last year from today)
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Activitat anual</h2>
      
      <div className="overflow-x-auto md:overflow-visible">
        <div className="md:hidden">
          <Heatmap
            startDate={oneYearAgo}
            endDate={today}
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
          />
        </div>
        <div className="hidden md:block">
          <Heatmap
            startDate={oneYearAgo}
            endDate={today}
            values={data}
            classForValue={(value: CalendarDay | undefined) => {
              if (!value) {
                return 'color-empty';
              }
              if (value.count === 0) return 'color-scale-1';
              if (value.count === 1) return 'color-scale-3';
              return 'color-scale-4';
            }}
            showWeekdayLabels={true}
            tooltipDataAttrs={{
              'data-tooltip': (value: CalendarDay | undefined) => {
                if (!value || value.count === 0) return 'No activity';
                return `${value.count} reservation${value.count > 1 ? 's' : ''}`;
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
