
export interface JournalEntry {
  id: string;
  date: string;
  weight: number;
  content: string;
  mood: 'feliz' | 'cansado' | 'determinado' | 'desanimado';
}

export interface UserData {
  name: string;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  dailyWaterGoal: number; // in ml
  waterRemindersEnabled: boolean;
  waterReminderInterval: number; // in minutes
  dietaryPreferences: string;
  dietaryRestrictions: string;
}

export interface ExerciseLog {
  id: string;
  date: string;
  type: string;
  duration: number; // in minutes
  intensity: 'Leve' | 'Moderada' | 'Intensa';
  caloriesBurned: number;
}

export interface DailyLog {
  date: string;
  waterIntake: number; // in ml
  caloriesConsumed?: number;
  caloriesBurned: number;
}

export interface Recipe {
  name: string;
  calories: string;
  ingredients: string[];
  instructions: string[];
  type: 'cafe-da-manha' | 'almoco' | 'janta' | 'lanche';
}

export interface Workout {
  title: string;
  duration: string;
  intensity: 'Baixa' | 'Média' | 'Alta';
  description: string;
  exercises: string[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  recipeName?: string;
}
