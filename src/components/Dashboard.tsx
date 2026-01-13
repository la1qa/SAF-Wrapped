import type { Reservation } from '../types/reservation';
import { calculateStats } from '../utils/statsCalculator';
import Calendar from './Calendar';
import { BarChart3, Clock, Calendar as CalendarIcon, MapPin, Upload } from 'lucide-react';

interface DashboardProps {
  reservations: Reservation[];
  onReset: () => void;
}

export default function Dashboard({ reservations, onReset }: DashboardProps) {
  const stats = calculateStats(reservations);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              El teu SAF Wrapped
            </h1>
            <p className="text-gray-600">
              Insights from {stats.totalReservations} reservations
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300"
          >
            <Upload className="w-4 h-4" />
            Analitza un altre fitxer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label="Total Reservations"
            value={stats.totalReservations}
            color="blue"
          />
          <StatCard
            icon={<CalendarIcon className="w-6 h-6" />}
            label="Unique Days"
            value={stats.uniqueDays}
            color="green"
          />
          <StatCard
            icon={<MapPin className="w-6 h-6" />}
            label="Top Room"
            value={stats.topRooms[0]?.name.substring(0, 15) || 'N/A'}
            color="purple"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Top Time Slot"
            value={stats.topTimeSlots[0]?.time || 'N/A'}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Calendar reservations={reservations} />

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Rooms</h2>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Time Slots</h2>
            <div className="space-y-4">
              {stats.topTimeSlots.map((slot, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {slot.time}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {slot.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(slot.count / stats.topTimeSlots[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Reserves per mesos
            </h2>
            <div className="space-y-4">
              {stats.reservationsByMonth.map((month, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {month.month}
                    </span>
                    <span className="text-sm font-bold text-cyan-600">
                      {month.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (month.count /
                            Math.max(...stats.reservationsByMonth.map(m => m.count))) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
