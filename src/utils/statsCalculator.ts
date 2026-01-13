import type { Reservation, ReservationStats } from '../types/reservation';

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function expandHorari(horari: string, step = 5): number[] {
  const [start, end] = horari.split("-");
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);

  const minutes: number[] = [];
  for (let m = startMin; m < endMin; m += step) {
    minutes.push(m);
  }
  return minutes;
}


export function calculateStats(reservations: Reservation[]): ReservationStats {
  const uniqueDaysSet = new Set<string>();
  const roomCounts = new Map<string, number>();
  const timeSlotCounts = new Map<string, number>();
  const monthCounts = new Map<string, number>();
  const minuteCounts = new Map<number, number>();
  const reservationsByDate = new Map<string, Reservation[]>();
  const hoursPerWeek: number[] = [];

  reservations.forEach(reservation => {
    const dateStr = reservation.parsedDate.toISOString().split('T')[0];
    uniqueDaysSet.add(dateStr);

    if (!reservationsByDate.has(dateStr)) {
      reservationsByDate.set(dateStr, []);
    }
    reservationsByDate.get(dateStr)!.push(reservation);

    const room = reservation.nom;
    roomCounts.set(room, (roomCounts.get(room) || 0) + 1);

    const timeSlot = reservation.horari;
    timeSlotCounts.set(timeSlot, (timeSlotCounts.get(timeSlot) || 0) + 1);

    expandHorari(timeSlot).forEach(min => {
      minuteCounts.set(min, (minuteCounts.get(min) || 0) + 1);
    });

    const monthYear = reservation.parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    monthCounts.set(monthYear, (monthCounts.get(monthYear) || 0) + 1);
  });

  // Calculate longest day streak
  const sortedDates = Array.from(reservationsByDate.keys()).sort();
  let longestDayStreak = 0;
  let currentDayStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      currentDayStreak++;
    } else {
      longestDayStreak = Math.max(longestDayStreak, currentDayStreak);
      currentDayStreak = 1;
    }
  }
  longestDayStreak = Math.max(longestDayStreak, currentDayStreak);

  // Calculate longest week streak (consecutive weeks with at least 1 reservation)
  const weeksWithActivity = new Set<string>();
  reservationsByDate.forEach((_, dateStr) => {
    const date = new Date(dateStr);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    weeksWithActivity.add(weekKey);
  });

  const sortedWeeks = Array.from(weeksWithActivity).sort();
  let longestWeekStreak = 0;
  let currentWeekStreak = 1;
  for (let i = 1; i < sortedWeeks.length; i++) {
    const prevWeek = new Date(sortedWeeks[i - 1]);
    const currWeek = new Date(sortedWeeks[i]);
    const diffWeeks = (currWeek.getTime() - prevWeek.getTime()) / (1000 * 60 * 60 * 24 * 7);
    if (diffWeeks === 1) {
      currentWeekStreak++;
    } else {
      longestWeekStreak = Math.max(longestWeekStreak, currentWeekStreak);
      currentWeekStreak = 1;
    }
  }
  longestWeekStreak = Math.max(longestWeekStreak, currentWeekStreak);

  // Calculate hours per week
  const weeksHours = new Map<string, number>();
  const monthsWithActivity = new Set<string>();
  
  reservations.forEach(reservation => {
    const date = new Date(reservation.parsedDate);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    const [start, end] = reservation.horari.split('-');
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);
    const durationHours = (endMin - startMin) / 60;
    
    weeksHours.set(weekKey, (weeksHours.get(weekKey) || 0) + durationHours);
    
    // Track months with activity
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthsWithActivity.add(monthKey);
  });

  // Calculate total weeks and all weeks in months with activity
  let totalWeeksInActiveMonths = 0;
  const allWeeksInActiveMonths: string[] = [];
  
  monthsWithActivity.forEach(monthKey => {
    const [year, month] = monthKey.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    const firstWeekStart = new Date(firstDay);
    firstWeekStart.setDate(firstDay.getDate() - firstDay.getDay());
    const lastWeekStart = new Date(lastDay);
    lastWeekStart.setDate(lastDay.getDate() - lastDay.getDay());
    
    const weeksInMonth = Math.ceil((lastWeekStart.getTime() - firstWeekStart.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
    totalWeeksInActiveMonths += weeksInMonth;
    
    // Add all weeks from this month
    for (let w = 0; w < weeksInMonth; w++) {
      const weekStart = new Date(firstWeekStart);
      weekStart.setDate(weekStart.getDate() + w * 7);
      const weekKey = weekStart.toISOString().split('T')[0];
      allWeeksInActiveMonths.push(weekKey);
    }
  });

  // Create hours array including 0 for weeks with no activity
  const hoursArray = allWeeksInActiveMonths.map(weekKey => weeksHours.get(weekKey) || 0).sort((a, b) => a - b);
  
  const medianHoursPerWeek = hoursArray.length > 0
    ? hoursArray[Math.floor(hoursArray.length / 2)]
    : 0;
  
  const totalHours = hoursArray.reduce((a, b) => a + b, 0);
  const meanHoursPerWeek = totalWeeksInActiveMonths > 0 ? totalHours / totalWeeksInActiveMonths : 0;

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

  const timeDensity = Array.from(minuteCounts.entries())
    .map(([minute, count]) => ({ minute, count }))
    .sort((a, b) => a.minute - b.minute);

  return {
    totalReservations: reservations.length,
    uniqueDays: uniqueDaysSet.size,
    topRooms,
    topTimeSlots,
    reservationsByMonth,
    timeDensity,
    longestWeekStreak,
    longestDayStreak,
    medianHoursPerWeek,
    meanHoursPerWeek,
  };
}
