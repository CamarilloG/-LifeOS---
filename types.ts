
// Generic App Types
export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  path: string;
  isAI?: boolean;
}

// Pomodoro Types
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  pomodoros: number; // Actual completed
  estimated: number; // Estimated needed
  lastActive?: string;
}

export interface PomoSession {
  date: string; // YYYY-MM-DD
  minutes: number;
}

export interface PomoSettings {
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  autoStart: boolean;
  soundEnabled: boolean;
  ambientSound: 'none' | 'rain' | 'forest' | 'cafe';
  notificationEnabled: boolean;
}

// Finance Types
export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note: string;
}

export interface Budget {
    limit: number;
    warningThreshold: number; // percentage
}

// Recipe Types
export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id?: string; // Optional for AI generated
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: string;
  calories: number;
}

export interface SavedRecipe extends Recipe {
    id: string;
    savedAt: string;
}

// Travel Types
export interface TravelActivity {
  time: string;
  activity: string;
  description: string;
  budget: string;
}

export interface TravelDay {
  day: number;
  theme: string;
  activities: {
    morning: TravelActivity;
    afternoon: TravelActivity;
    evening: TravelActivity;
  };
}

export interface TravelItinerary {
  city: string;
  days: TravelDay[];
}

// Flashcard Types
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  // SM-2 Algorithm Fields
  interval: number; // Days
  repetition: number; 
  efactor: number; // Easiness factor
  nextReviewDate: string; // ISO String
}

// Settings
export interface UserSettings {
  theme: 'light' | 'dark';
  syncEnabled: boolean;
  username: string;
}
