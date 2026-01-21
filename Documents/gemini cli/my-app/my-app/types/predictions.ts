export interface AIPrediction {
  id: string;
  match_name: string;
  league: string;
  prediction_type: string;
  confidence: number;
  reasoning: string;
  predicted_value: string;
  odds?: string;
  start_time: string;
  status: 'pending' | 'won' | 'lost' | 'void';
}

export interface BettingStrategy {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  confidence: number;
  odds?: string;
  stake: number;
  potential_win: number;
  status: 'active' | 'completed' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface UserStrategy {
  id: string;
  user_id: string;
  strategy_id: string;
  stake: number;
  active: boolean;
  created_at: string;
}

export interface MatchDetails {
  id: string;
  home_team: string;
  away_team: string;
  league: string;
  start_time: string;
  status: string;
  odds?: {
    home_win: string;
    draw: string;
    away_win: string;
  };
}

export interface StrategyPerformance {
  strategy_id: string;
  total_predictions: number;
  successful_predictions: number;
  win_rate: number;
  profit: number;
  roi: number;
}

export interface PredictionRequest {
  match_id: string;
  prediction_type: string;
  stake: number;
}