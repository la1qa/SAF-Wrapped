export interface Reservation {
  codi: string;
  data: string;
  horari: string;
  dummy: string;
  nom: string;
  informacio: string;
  parsedDate: Date;
}

export interface TimeDensityPoint {
  minute: number;
  count: number;
}

export interface ReservationStats {
  totalReservations: number;
  uniqueDays: number;
  topRooms: { name: string; count: number }[];
  topTimeSlots: { time: string; count: number }[];
  reservationsByMonth: { month: string; count: number }[];
  timeDensity: TimeDensityPoint[];
  longestWeekStreak: number;
  longestDayStreak: number;
  medianHoursPerWeek: number;
  meanHoursPerWeek: number;
}
