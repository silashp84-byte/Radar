export type ProfitLevel = 'baixo' | 'médio' | 'alto';
export type Difficulty = 'fácil' | 'médio' | 'difícil';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  profitLevel: ProfitLevel;
  difficulty: Difficulty;
  executionPlan: string[];
  estimatedGain: string;
  category: 'local' | 'global' | 'crypto' | 'trends';
  timestamp: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
