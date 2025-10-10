import {
  ImportResponse,
  PricingItem,
  PricingRunRequest,
  PricingRunResponse,
  PricingCalculationResponse,
  FXRate,
} from '@/types/pricing';
import {
  USE_MOCK_API,
  mockCreateImport,
  mockUploadImportItems,
  mockCreatePricingRun,
  mockCalculatePricingRun,
  mockGetLatestFXRate,
  mockGetFXRateByDate,
  mockExportPricingResults,
  mockSavePricingRun,
  mockDuplicatePricingRun,
} from './pricing.mock';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://backoffice-forthandvale-backend.vercel.app/api';

// Store uploaded items for mock calculation
let mockUploadedItems: PricingItem[] = [];
let mockConfig: PricingRunRequest['config'] | null = null;

export async function createImport(tenantId: string): Promise<{ importId: string }> {
  if (USE_MOCK_API) {
    return mockCreateImport(tenantId);
  }

  const response = await fetch(`${API_BASE_URL}/imports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ tenantId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create import');
  }

  return response.json();
}

export async function uploadImportItems(
  importId: string,
  items: PricingItem[]
): Promise<ImportResponse> {
  if (USE_MOCK_API) {
    mockUploadedItems = items; // Store for later calculation
    return mockUploadImportItems(importId, items);
  }

  const response = await fetch(`${API_BASE_URL}/imports/${importId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error('Failed to upload items');
  }

  return response.json();
}

export async function createPricingRun(
  request: PricingRunRequest
): Promise<PricingRunResponse> {
  if (USE_MOCK_API) {
    mockConfig = request.config; // Store config for calculation
    return mockCreatePricingRun(request);
  }

  const response = await fetch(`${API_BASE_URL}/pricing/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to create pricing run');
  }

  return response.json();
}

export async function calculatePricingRun(
  runId: string
): Promise<PricingCalculationResponse> {
  if (USE_MOCK_API && mockConfig) {
    return mockCalculatePricingRun(runId, mockUploadedItems, mockConfig);
  }

  const response = await fetch(`${API_BASE_URL}/pricing/runs/${runId}/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to calculate pricing run');
  }

  return response.json();
}

export async function getLatestFXRate(
  sourceCurrency: string,
  targetCurrency: string
): Promise<FXRate> {
  if (USE_MOCK_API) {
    return mockGetLatestFXRate(sourceCurrency, targetCurrency);
  }

  const response = await fetch(
    `${API_BASE_URL}/fx-rates/latest?source=${sourceCurrency}&target=${targetCurrency}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch FX rate');
  }

  return response.json();
}

export async function getFXRateByDate(
  sourceCurrency: string,
  targetCurrency: string,
  date: string
): Promise<FXRate> {
  if (USE_MOCK_API) {
    return mockGetFXRateByDate(sourceCurrency, targetCurrency, date);
  }

  const response = await fetch(
    `${API_BASE_URL}/fx-rates?source=${sourceCurrency}&target=${targetCurrency}&date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch FX rate');
  }

  return response.json();
}

export async function exportPricingResults(
  runId: string,
  format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> {
  if (USE_MOCK_API) {
    return mockExportPricingResults();
  }

  const response = await fetch(
    `${API_BASE_URL}/pricing/runs/${runId}/export?format=${format}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to export results');
  }

  return response.blob();
}

export async function savePricingRun(runId: string, name: string): Promise<void> {
  if (USE_MOCK_API) {
    return mockSavePricingRun();
  }

  const response = await fetch(`${API_BASE_URL}/pricing/runs/${runId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ name, saved: true }),
  });

  if (!response.ok) {
    throw new Error('Failed to save pricing run');
  }
}

export async function duplicatePricingRun(runId: string): Promise<PricingRunResponse> {
  if (USE_MOCK_API) {
    return mockDuplicatePricingRun(runId);
  }

  const response = await fetch(`${API_BASE_URL}/pricing/runs/${runId}/duplicate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to duplicate pricing run');
  }

  return response.json();
}

