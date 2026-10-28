export type BPCategory =
  | 'OPTIMAL'
  | 'NORMAL'
  | 'HIGH_NORMAL'
  | 'HTA_GRADE_1'
  | 'HTA_GRADE_2'
  | 'CRISIS'
  | 'HYPOTENSION';

export interface BPCategoryInfo {
  category: BPCategory;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  recommendation: string;
}

export type MeasurementMoment = 'morning' | 'midday' | 'evening';
export type BodyPosition = 'sitting' | 'lying' | 'standing';
export type ArmSide = 'left' | 'right';

export interface BloodPressureMeasurement {
  id: string;
  timestamp: string; // ISO string
  systolic: number; // mmHg
  diastolic: number; // mmHg
  pulse: number; // bpm
  moment: MeasurementMoment;
  position: BodyPosition;
  arm: ArmSide;
  note?: string;
  isDemo?: boolean;
}

export type SaltLevel = 'low' | 'moderate' | 'high';

export interface HabitEntry {
  id: string;
  date: string; // YYYY-MM-DD
  sleepHours: number; // 0-14
  sleepQuality: number; // 1-5
  steps: number; // 0-30000
  stressLevel: number; // 1-5 (1: très zen, 5: très stressé)
  saltIntake: SaltLevel;
  physicalActivityMinutes: number; // 0-180
  caffeineCups: number; // 0-10
  waterLiters: number; // e.g. 1.5
  notes?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Autre';
  occupation: string;
  targetSys: number;
  targetDia: number;
  doctorName?: string;
  hasMedicalFollowup: boolean;
  morningReminderTime: string;
  eveningReminderTime: string;
  remindersActive: boolean;
}

export interface PeriodStats {
  periodDays: number;
  totalMeasurements: number;
  avgSys: number;
  avgDia: number;
  avgPulse: number;
  minSys: number;
  maxSys: number;
  minDia: number;
  maxDia: number;
  morningAvgSys: number;
  morningAvgDia: number;
  eveningAvgSys: number;
  eveningAvgDia: number;
  optimalPercentage: number;
  highPercentage: number;
  standardDeviationSys: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  source?: 'gemini' | 'local';
}
