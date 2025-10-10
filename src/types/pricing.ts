export interface PricingItem {
  sku: string;
  productName: string;
  hsCode: string;
  purchasePricePKR: number;
  unitsPerOrder: number;
  weightKg: number;
  volumeM3: number;
}

export interface ValidationError {
  row: number;
  sku: string;
  field: string;
  message: string;
}

export interface ImportResponse {
  importId: string;
  itemsCount: number;
  validationErrors: ValidationError[];
}

export type Country = 'UK' | 'US' | 'EU';
export type Incoterm = 'FOB' | 'CIF' | 'DDP';
export type MarginMode = 'MARGIN' | 'MARKUP';
export type FreightModel = 'PER_KG' | 'PER_UNIT' | 'PER_ORDER';
export type InsuranceModel = 'PERCENTAGE' | 'FIXED_PER_UNIT';
export type RoundingRule = 'NONE' | 'NEAREST_0_05' | 'NEAREST_0_50' | 'END_99';

export interface PricingConfiguration {
  country: Country;
  incoterm: Incoterm;
  fxDate?: string; // ISO date string
  marginMode: MarginMode;
  marginValue: number; // percentage
  freightModel: FreightModel;
  freightValue: number;
  insuranceModel: InsuranceModel;
  insuranceValue: number;
  applyThresholds: boolean;
  roundingRule: RoundingRule;
}

export interface FXRate {
  date: string;
  rate: number;
  sourceCurrency: string;
  targetCurrency: string;
}

export interface PricingRunRequest {
  importId: string;
  config: PricingConfiguration;
}

export interface PricingRunResponse {
  runId: string;
  status: 'PENDING' | 'CALCULATING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface BreakdownRule {
  name: string;
  type: 'DUTY' | 'VAT' | 'FEE' | 'THRESHOLD';
  rate?: number;
  amount: number;
  effectiveDate?: string;
  description?: string;
}

export interface PricingBreakdown {
  basePKR: number;
  fxRate: number;
  baseDest: number;
  freight: number;
  insurance: number;
  cif: number;
  duty: number;
  fees: number;
  tax: number;
  landedCost: number;
  sell: number;
  marginPercent: number;
  currency: string;
  thresholdsApplied: string[];
  rules: BreakdownRule[];
}

export interface PricingResultItem {
  sku: string;
  productName: string;
  basePKR: number;
  fxRate: number;
  baseDest: number;
  freight: number;
  insurance: number;
  cif: number;
  duty: number;
  fees: number;
  tax: number;
  landedCost: number;
  sell: number;
  marginPercent: number;
  notes: string;
  breakdown_json: PricingBreakdown;
}

export interface PricingCalculationResponse {
  runId: string;
  items: PricingResultItem[];
  summary: {
    totalSKUs: number;
    avgLandedCost: number;
    avgMarginPercent: number;
    currency: string;
  };
  fxRateSnapshot: FXRate;
}

export interface ColumnMapping {
  sku?: string;
  productName?: string;
  hsCode?: string;
  purchasePricePKR?: string;
  unitsPerOrder?: string;
  weightKg?: string;
  volumeM3?: string;
}

export const CURRENCY_SYMBOLS: Record<Country, string> = {
  UK: '£',
  US: '$',
  EU: '€',
};

export const COUNTRY_CURRENCIES: Record<Country, string> = {
  UK: 'GBP',
  US: 'USD',
  EU: 'EUR',
};

