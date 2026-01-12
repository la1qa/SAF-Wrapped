import type { Reservation } from '../types/reservation';

export function parseCSV(csvContent: string): Reservation[] {
  const lines = csvContent.trim().split('\n');

  if (lines.length < 2) {
    throw new Error('CSV file is empty or invalid');
  }

  const reservations: Reservation[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const matches = line.match(/"([^"]*)"/g);
    if (!matches || matches.length < 6) continue;

    const values = matches.map(m => m.slice(1, -1));

    const [codi, data, horari, dummy, nom, informacio] = values;

    const parsedDate = parseDate(data);

    reservations.push({
      codi,
      data,
      horari,
      dummy,
      nom,
      informacio,
      parsedDate,
    });
  }

  return reservations;
}

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}
