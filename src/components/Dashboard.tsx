import type { Reservation } from '../types/reservation';
import { calculateStats } from '../utils/statsCalculator';
import Calendar from './dashboard/Calendar';
import { BarChart3, Clock, Calendar as CalendarIcon, Dumbbell, Upload, Flame, TrendingUp } from 'lucide-react';
import { TimeDensity } from './dashboard/ViolinPlot';
import DownloadSection from './dashboard/DownloadSection';
import { useRef } from 'react';

interface DashboardProps {
  reservations: Reservation[];
  onReset: () => void;
}

export default function Dashboard({ reservations, onReset }: DashboardProps) {
  const stats = calculateStats(reservations);
  const statsRef = useRef<HTMLDivElement>(null!);
  const calendarRef = useRef<HTMLDivElement>(null!);
  const topRoomsRef = useRef<HTMLDivElement>(null!);
  const streakRef = useRef<HTMLDivElement>(null!);
  const violinRef = useRef<HTMLDivElement>(null!);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              El teu SAF Wrapped
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" ref={statsRef}>
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label="Reserves Totals"
            value={stats.totalReservations}
            color="blue"
          />
          <StatCard
            icon={<CalendarIcon className="w-6 h-6" />}
            label="Dies Únics"
            value={stats.uniqueDays}
            color="green"
          />
          <StatCard
            icon={<Dumbbell className="w-6 h-6" />}
            label="Tipus de Reserva Més Utilitzat"
            value={stats.topRooms[0]?.name.substring(0, 15) || 'N/A'}
            color="purple"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Franja Horària Més Utilitzada"
            value={stats.topTimeSlots[0]?.time || 'N/A'}
            color="orange"
          />
        </div>

        <div className="mb-8" ref={calendarRef}>
          <Calendar reservations={reservations} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100" ref={topRoomsRef}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top de Reserves Més Utilitzades</h2>
            <div className="space-y-4">
              {stats.topRooms.map((room, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {room.name}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {room.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(room.count / stats.topRooms[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100" ref={streakRef}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Estadístiques de Ratxes</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">Ratxa més llarga (dies)</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{stats.longestDayStreak}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Ratxa més llarga (setmanes)</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.longestWeekStreak}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Mediana d'hores per setmana*</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{stats.medianHoursPerWeek.toFixed(1)}h</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Mitjana d'hores per setmana*</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">{stats.meanHoursPerWeek.toFixed(1)}h</span>
              </div>
              <hr className="border-gray-200" />
              <p className="text-xs text-gray-500 mt-2">*Només computa les setmanes dels mesos amb activitat</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:col-span-2" ref={violinRef}>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Densitat d'Ús per Minut del Dia</h2>
            <div className="flex justify-center">
              <TimeDensity data={stats.timeDensity} />
            </div>
          </div>
        </div>

        <DownloadSection
          stats={stats}
        />

        <div className="mt-8 flex justify-center">
          <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300"
            >
              <Upload className="w-4 h-4" />
              Analitza un altre fitxer
          </button>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0">
        <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} md:mb-4 flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
