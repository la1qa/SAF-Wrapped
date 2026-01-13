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
    
    // Normalize room names to remove day-specific suffixes and pista numbers
    const normalizedNom = nom
      .replace(/\s*\((dl-dv|ds-dg)[^)]*\)\s*$/i, '') // Remove day suffixes
      .replace(/\s*-\s*PISTA\s+\d+/i, '') // Remove pista numbers
      .trim();

    reservations.push({
      codi,
      data,
      horari,
      dummy,
      nom: normalizedNom,
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
