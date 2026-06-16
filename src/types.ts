export interface Exercise {
  name: string;
  description: string;
  reps: string;
  sets: number;
  restTime: number; // in seconds
  completed?: boolean;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  goal: string;
  focus: string;
  exercises: Exercise[];
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  timeSlot: string;
  goal: string;
  confirmed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  role: string;
  beforeWeight: number;
  afterWeight: number;
  result: string;
  quote: string;
  beforeImage: string;
  afterImage: string;
}
