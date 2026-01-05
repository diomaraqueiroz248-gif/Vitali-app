
// MET values (Metabolic Equivalent of Task)
// Source: Compendium of Physical Activities
const MET_VALUES: Record<string, Record<string, number>> = {
  'Caminhada': { 'Leve': 3.0, 'Moderada': 4.0, 'Intensa': 5.0 },
  'Corrida': { 'Leve': 8.0, 'Moderada': 10.0, 'Intensa': 12.5 },
  'Pedalada': { 'Leve': 6.0, 'Moderada': 8.0, 'Intensa': 10.0 },
  'Ciclismo': { 'Leve': 6.0, 'Moderada': 8.0, 'Intensa': 10.0 },
  'Musculação': { 'Leve': 3.5, 'Moderada': 5.0, 'Intensa': 6.0 },
  'Natação': { 'Leve': 6.0, 'Moderada': 8.0, 'Intensa': 11.0 },
  'Dança': { 'Leve': 3.5, 'Moderada': 5.0, 'Intensa': 7.0 },
  'Yoga': { 'Leve': 2.0, 'Moderada': 3.0, 'Intensa': 4.0 },
  'Outro': { 'Leve': 3.0, 'Moderada': 5.0, 'Intensa': 7.0 },
};

export const calculateCalories = (
  weight: number,
  type: string,
  intensity: 'Leve' | 'Moderada' | 'Intensa',
  durationMinutes: number
): number => {
  const met = MET_VALUES[type]?.[intensity] || MET_VALUES['Outro'][intensity];
  // Formula: kcal = MET * weight_kg * duration_hours
  const calories = met * weight * (durationMinutes / 60);
  return Math.round(calories);
};

export const EXERCISE_TYPES = Object.keys(MET_VALUES);
