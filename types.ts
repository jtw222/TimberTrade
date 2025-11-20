
export interface ManufacturingInputs {
  workers: number;
  hoursPerWeek: number;
  hourlyWage: number;
  minutesPerUnit: number;
  materialCost: number;
  salesPrice: number;
  monthlyOverhead: number; // Rent, electricity, etc.
}

export interface ProjectionResult {
  maxUnitsMonthly: number;
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
  marginPercent: number;
}

export interface TrendData {
  title: string;
  description: string;
  sourceUrl?: string;
}

export interface TrendItem {
  title: string;
  description: string;
  priceRange: string;
}

export interface SavedItem {
  id: string;
  type: 'TREND' | 'PLAN' | 'LEAD';
  title: string;
  content: string; // Description for trend, Markdown for plan
  image?: string | null;
  date: string;
  tags?: string[];
}

export interface Lead {
  id: string;
  platform: 'Reddit' | 'Twitter' | 'Forum' | 'Other';
  user: string;
  request: string;
  budget?: string;
  postedDate: string;
  url?: string;
  compatibilityScore: number; // 1-100 based on keywords
}

export enum AppTab {
  MARKET = 'MARKET',
  CALCULATOR = 'CALCULATOR',
  GUIDE = 'GUIDE',
  TEMPLATES = 'TEMPLATES',
  SUPPLIERS = 'SUPPLIERS',
  STORE = 'STORE',
  GALLERY = 'GALLERY',
  STAIN_VISUALIZER = 'STAIN_VISUALIZER',
  COMMISSIONS = 'COMMISSIONS',
}
