export type Position = 'Attack' | 'Midfielder' | 'Defender' | 'Goalie' | 'LSM' | 'FOGO';
export type Level = 'Freshman' | 'JV' | 'Varsity';

export type Timeframe = 'per_game' | 'season' | 'per_week' | 'per_month';
export type MetricType = 'count' | 'percent' | 'rate' | 'max'; 
// count/rate = numeric up; percent 0..1; max = must be <= target

export interface GoalTemplate {
  id: string;
  position: Position | 'Skills';
  level: Level | 'All';
  title: string;
  metricType: MetricType;
  target: number;                // store percent as 0..1
  unit: string;                  // 'goals', '%', 'GBs'...
  timeframe: Timeframe;
  trackingKey: string;           // e.g. 'goals', 'save_pct', 'faceoff_win_pct'
  description?: string;
}
