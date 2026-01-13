export function StatsStory({ stats }) {
  return (
    <div className="h-full flex flex-col justify-center gap-12 px-20">
      <h1 className="text-5xl font-extrabold text-center">
        El teu SAF Wrapped 📊
      </h1>

      <div className="grid grid-cols-2 gap-12">
        <Stat label="Reserves totals" value={stats.totalReservations} />
        <Stat label="Dies únics" value={stats.uniqueDays} />
        <Stat label="Espai favorit" value={stats.topRooms[0].name} />
        <Stat label="Hora preferida" value={stats.topTimeSlots[0].time} />
      </div>

      <p className="text-center text-gray-400 mt-16">
        SAF Wrapped · 2025
      </p>
    </div>
  );
}