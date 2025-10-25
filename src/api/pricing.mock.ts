/**
 * Mock API for Pricing Module - Development Only
 * This file provides mock data for testing the pricing module
 * when the backend endpoints are not yet available.
 */

import {
  ImportResponse,
  PricingItem,
  PricingRunRequest,
  PricingRunResponse,
  PricingCalculationResponse,
  FXRate,
  PricingResultItem,
  BreakdownRule,
} from '@/types/pricing';

// Enable/disable mock mode
// Set to false to use real backend (data persists in database)
// Set to true to use mock data (resets on refresh)
export const USE_MOCK_API = true; // ← DEMO MODE: Using mock data, no real API calls

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock FX rates
const mockFXRates: Record<string, number> = {
  'PKR-USD': 0.0036,
  'PKR-GBP': 0.0028,
  'PKR-EUR': 0.0033,
};

export async function mockCreateImport(
  _tenantId: string
): Promise<{ importId: string }> {
  await delay(500);
  return {
    importId: `import-${Date.now()}`,
  };
}

export async function mockUploadImportItems(
  importId: string,
  items: PricingItem[]
): Promise<ImportResponse> {
  await delay(1000);

  // Simulate some validation
  const validationErrors = items
    .filter((item) => !item.hsCode || item.hsCode.length < 4)
    .map((item, index) => ({
      row: index + 2,
      sku: item.sku,
      field: 'HS Code',
      message: 'HS Code is too short',
    }));

  return {
    importId,
    itemsCount: items.length,
    validationErrors,
  };
}

export async function mockCreatePricingRun(
  _request: PricingRunRequest
): Promise<PricingRunResponse> {
  await delay(500);
  return {
    runId: `run-${Date.now()}`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
}

export async function mockCalculatePricingRun(
  runId: string,
  items: PricingItem[],
  config: PricingRunRequest['config']
): Promise<PricingCalculationResponse> {
  await delay(2000); // Simulate calculation time

  const fxRateKey = `PKR-${config.country === 'UK' ? 'GBP' : config.country === 'EU' ? 'EUR' : 'USD'}`;
  const fxRate = mockFXRates[fxRateKey] || 0.0036;

  const resultItems: PricingResultItem[] = items.map((item) => {
    // Calculate base cost in destination currency
    const baseDest = item.purchasePricePKR * fxRate;

    // Calculate freight based on model
    let freight = 0;
    if (config.freightModel === 'PER_KG') {
      freight = item.weightKg * config.freightValue;
    } else if (config.freightModel === 'PER_UNIT') {
      freight = config.freightValue;
    } else {
      freight = config.freightValue / item.unitsPerOrder;
    }

    // Calculate insurance
    let insurance = 0;
    if (config.insuranceModel === 'PERCENTAGE') {
      insurance = (baseDest * config.insuranceValue) / 100;
    } else {
      insurance = config.insuranceValue;
    }

    // CIF value
    const cif = baseDest + freight + insurance;

    // Mock duty calculation (simplified - normally based on HS code)
    const dutyRate = item.hsCode.startsWith('4202') ? 8.5 : 5.0;
    const duty = (cif * dutyRate) / 100;

    // Mock fees (customs processing, etc.)
    const fees = cif * 0.01; // 1% processing fee

    // Mock tax (VAT/Sales Tax)
    const taxRate = config.country === 'UK' ? 20 : config.country === 'EU' ? 21 : 6.5;
    const taxableValue = cif + duty + fees;
    const tax = (taxableValue * taxRate) / 100;

    // Convert custom packaging from PKR to destination currency
    const customPackaging = (item.customPackagingPKR || 0) * fxRate;

    // Landed cost
    const landedCost = cif + duty + fees + tax + customPackaging;

    // Calculate sell price based on margin mode
    let sell = 0;
    if (config.marginMode === 'MARGIN') {
      // Sell = Cost / (1 - Margin%)
      sell = landedCost / (1 - config.marginValue / 100);
    } else {
      // Sell = Cost * (1 + Markup%)
      sell = landedCost * (1 + config.marginValue / 100);
    }

    // Apply rounding
    if (config.roundingRule === 'NEAREST_0_05') {
      sell = Math.round(sell * 20) / 20;
    } else if (config.roundingRule === 'NEAREST_0_50') {
      sell = Math.round(sell * 2) / 2;
    } else if (config.roundingRule === 'END_99') {
      sell = Math.floor(sell) + 0.99;
    }

    // Calculate actual margin percentage
    const marginPercent = ((sell - landedCost) / sell) * 100;

    // Mock rules
    const rules: BreakdownRule[] = [
      {
        name: `Customs Duty - HS ${item.hsCode}`,
        type: 'DUTY',
        rate: dutyRate,
        amount: duty,
        effectiveDate: '2024-01-01',
        description: `Duty rate for HS Code ${item.hsCode}`,
      },
      {
        name: config.country === 'UK' ? 'VAT' : config.country === 'EU' ? 'VAT' : 'Sales Tax',
        type: 'VAT',
        rate: taxRate,
        amount: tax,
        effectiveDate: '2024-01-01',
        description: `${config.country} tax on imported goods`,
      },
      {
        name: 'Customs Processing Fee',
        type: 'FEE',
        amount: fees,
        effectiveDate: '2024-01-01',
        description: 'Standard customs clearance fee',
      },
    ];

    // Mock thresholds
    const thresholdsApplied: string[] = [];
    if (config.applyThresholds && config.country === 'US' && cif < 800) {
      thresholdsApplied.push('Section 321 (De-minimis)');
    }

    const notes = thresholdsApplied.length > 0 ? 'Threshold exemptions applied' : '';

    return {
      sku: item.sku,
      productName: item.productName,
      basePKR: item.purchasePricePKR,
      fxRate,
      baseDest,
      freight,
      insurance,
      cif,
      duty,
      fees,
      tax,
      customPackaging,
      landedCost,
      sell,
      marginPercent,
      notes,
      breakdown_json: {
        basePKR: item.purchasePricePKR,
        fxRate,
        baseDest,
        freight,
        insurance,
        cif,
        duty,
        fees,
        tax,
        landedCost,
        sell,
        marginPercent,
        currency: config.country === 'UK' ? 'GBP' : config.country === 'EU' ? 'EUR' : 'USD',
        thresholdsApplied,
        rules,
      },
    };
  });

  // Calculate summary
  const totalSKUs = resultItems.length;
  const avgLandedCost =
    resultItems.reduce((sum, item) => sum + item.landedCost, 0) / totalSKUs;
  const avgMarginPercent =
    resultItems.reduce((sum, item) => sum + item.marginPercent, 0) / totalSKUs;

  // Determine currency based on country
  const currencyCode = config.country === 'UK' ? 'GBP' : config.country === 'EU' ? 'EUR' : 'USD';

  return {
    runId,
    items: resultItems,
    summary: {
      totalSKUs,
      avgLandedCost,
      avgMarginPercent,
      currency: currencyCode,
    },
    fxRateSnapshot: {
      date: new Date().toISOString().split('T')[0],
      rate: fxRate,
      sourceCurrency: 'PKR',
      targetCurrency: currencyCode,
    },
  };
}

export async function mockGetLatestFXRate(
  sourceCurrency: string,
  targetCurrency: string
): Promise<FXRate> {
  await delay(300);
  const key = `${sourceCurrency}-${targetCurrency}`;
  const rate = mockFXRates[key] || 0.0036;

  return {
    date: new Date().toISOString().split('T')[0],
    rate,
    sourceCurrency,
    targetCurrency,
  };
}

export async function mockGetFXRateByDate(
  sourceCurrency: string,
  targetCurrency: string,
  date: string
): Promise<FXRate> {
  await delay(300);
  const key = `${sourceCurrency}-${targetCurrency}`;
  const rate = mockFXRates[key] || 0.0036;

  return {
    date,
    rate: rate * (0.95 + Math.random() * 0.1), // Slight variation for historical rates
    sourceCurrency,
    targetCurrency,
  };
}

export async function mockExportPricingResults(): Promise<Blob> {
  await delay(500);
  const csvContent = 'SKU,Product,Landed Cost,Sell Price\nMOCK-001,Mock Product,100.00,150.00';
  return new Blob([csvContent], { type: 'text/csv' });
}

export async function mockSavePricingRun(): Promise<void> {
  await delay(500);
}

export async function mockDuplicatePricingRun(_runId: string): Promise<PricingRunResponse> {
  await delay(500);
  return {
    runId: `run-${Date.now()}-duplicate`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
}

