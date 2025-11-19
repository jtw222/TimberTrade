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

export enum AppTab {
  MARKET = 'MARKET',
  CALCULATOR = 'CALCULATOR',
  GUIDE = 'GUIDE',
  TEMPLATES = 'TEMPLATES',
  SUPPLIERS = 'SUPPLIERS',
  STORE = 'STORE',
}