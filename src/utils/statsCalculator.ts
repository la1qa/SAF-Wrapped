import type { Reservation, ReservationStats } from '../types/reservation';

export function calculateStats(reservations: Reservation[]): ReservationStats {
  const uniqueDaysSet = new Set<string>();
  const roomCounts = new Map<string, number>();
  const timeSlotCounts = new Map<string, number>();
  const monthCounts = new Map<string, number>();

  reservations.forEach(reservation => {
    uniqueDaysSet.add(reservation.data);

    const room = reservation.nom;
    roomCounts.set(room, (roomCounts.get(room) || 0) + 1);

    const timeSlot = reservation.horari;
    timeSlotCounts.set(timeSlot, (timeSlotCounts.get(timeSlot) || 0) + 1);

    const monthYear = reservation.parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    monthCounts.set(monthYear, (monthCounts.get(monthYear) || 0) + 1);
  });

  const topRooms = Array.from(roomCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topTimeSlots = Array.from(timeSlotCounts.entries())
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const reservationsByMonth = Array.from(monthCounts.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });

  return {
    totalReservations: reservations.length,
    uniqueDays: uniqueDaysSet.size,
    topRooms,
    topTimeSlots,
    reservationsByMonth,
  };
}
