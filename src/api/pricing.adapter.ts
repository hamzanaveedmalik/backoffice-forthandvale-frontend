/**
 * Pricing Backend Adapter
 * Connects the pricing module to the existing backend
 * Matches the same patterns as ExcelUpload component
 */

import {
  PricingConfiguration,
  PricingCalculationResponse,
  PricingResultItem,
} from '@/types/pricing';

// Use same API base URL as rest of app
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ||
  'https://backoffice-forthandvale-backend.vercel.app/api';

export class PricingBackendAdapter {
  private orgId: string;
  private userId: string;

  constructor(orgId: string = 'default', userId?: string) {
    this.orgId = orgId;
    // Get userId from localStorage (same as auth context)
    if (userId) {
      this.userId = userId;
    } else {
      const savedUser = localStorage.getItem('current_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          this.userId = user.id;
        } catch {
          this.userId = 'default-user';
        }
      } else {
        this.userId = 'default-user';
      }
    }
  }

  /**
   * Upload Excel file directly to backend
   * Same pattern as ExcelUpload component in dashboard
   */
  async uploadFile(file: File, name?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (name) {
      formData.append('name', name);
    }
    formData.append('orgId', this.orgId);

    const response = await fetch(`${API_BASE_URL}/pricing/imports`, {
      method: 'POST',
      headers: {
        'x-user-id': this.userId,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();

    return {
      importId: data.import?.id || data.importId,
      itemsCount: data.import?.itemsCount || data.itemsCount || 0,
      fileName: file.name,
    };
  }

  /**
   * Create pricing run with configuration
   * Transforms frontend config to backend format
   */
  async createPricingRun(importId: string, config: PricingConfiguration) {
    const backendConfig = this.transformConfigForBackend(config);

    const response = await fetch(`${API_BASE_URL}/pricing/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': this.userId,
      },
      body: JSON.stringify({
        importId,
        ...backendConfig,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create pricing run');
    }

    const data = await response.json();

    return {
      runId: data.pricingRun?.id || data.runId,
    };
  }

  /**
   * Calculate pricing and get results
   * Transforms backend response to frontend format
   */
  async calculatePricing(
    runId: string,
    page = 1,
    limit = 1000
  ): Promise<PricingCalculationResponse> {
    const response = await fetch(
      `${API_BASE_URL}/pricing/runs/${runId}/calculate?page=${page}&limit=${limit}`,
      {
        method: 'POST',
        headers: {
          'x-user-id': this.userId,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Calculation failed');
    }

    const data = await response.json();

    // Transform backend response to match frontend expectations
    return this.transformBackendResponse(data, runId);
  }

  /**
   * Get FX rate
   */
  async getFxRate(source = 'PKR', target = 'GBP') {
    const response = await fetch(
      `${API_BASE_URL}/fx-rates/latest?source=${source}&target=${target}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch FX rate');
    }

    return response.json();
  }

  /**
   * Export results as CSV
   */
  exportResults(runId: string) {
    window.open(
      `${API_BASE_URL}/pricing/runs/${runId}/export?format=csv`,
      '_blank'
    );
  }

  /**
   * Save pricing run with a name
   */
  async savePricingRun(runId: string, name: string) {
    const response = await fetch(`${API_BASE_URL}/pricing/runs/${runId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': this.userId,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to save pricing run');
    }

    return response.json();
  }

  /**
   * Duplicate pricing run
   */
  async duplicatePricingRun(runId: string) {
    const response = await fetch(
      `${API_BASE_URL}/pricing/runs/${runId}/duplicate`,
      {
        method: 'POST',
        headers: {
          'x-user-id': this.userId,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to duplicate pricing run');
    }

    const data = await response.json();
    return { runId: data.runId };
  }

  /**
   * Transform frontend config to backend format
   * Handles all the differences in structure and values
   */
  private transformConfigForBackend(config: PricingConfiguration) {
    return {
      destination: config.country, // country → destination
      incoterm: config.incoterm,
      fxDate: config.fxDate || 'latest',
      marginMode: config.marginMode,
      marginValue: config.marginValue / 100, // 35 → 0.35

      freightModel: {
        type: config.freightModel,
        value: config.freightValue,
      },

      insuranceModel: {
        type:
          config.insuranceModel === 'PERCENTAGE'
            ? 'PCT'
            : config.insuranceModel,
        value:
          config.insuranceModel === 'PERCENTAGE'
            ? config.insuranceValue / 100
            : config.insuranceValue,
      },

      rounding:
        config.roundingRule && config.roundingRule !== 'NONE'
          ? {
              mode: config.roundingRule,
              value: 0.99, // Default ending
            }
          : null,
    };
  }

  /**
   * Transform backend response to frontend format
   * Handles nested structures, string→number conversions, etc.
   */
  private transformBackendResponse(
    backendData: any,
    runId: string
  ): PricingCalculationResponse {
    const items: PricingResultItem[] = backendData.items.map((item: any) => {
      const breakdown = item.breakdownJson?.calculations || {};

      return {
        sku: item.importItem?.product?.sku || item.sku,
        productName: item.importItem?.product?.name || item.productName,
        basePKR: parseFloat(item.basePkr || '0'),
        fxRate: breakdown.fxRate || 0.0028,
        baseDest: breakdown.base || 0,
        freight: breakdown.freight || 0,
        insurance: breakdown.insurance || 0,
        cif: breakdown.cif || 0,
        duty: breakdown.duty || 0,
        fees: breakdown.fees || 0,
        tax: breakdown.tax || 0,
        landedCost: parseFloat(item.landedCost || '0'),
        sell: parseFloat(item.sellingPrice || '0'),
        marginPercent: parseFloat(item.marginPct || '0') * 100, // 0.35 → 35
        notes: item.notes || '',
        breakdown: item.breakdownJson,
      };
    });

    const totals = backendData.totals || {};
    const pagination = backendData.pagination || { total: items.length };

    // Determine currency from first item or default
    const currency = this.getCurrency(
      backendData.items[0]?.breakdownJson?.config?.destination
    );

    return {
      runId,
      items,
      summary: {
        totalSKUs: pagination.total,
        avgLandedCost:
          pagination.total > 0
            ? totals.totalLandedCost / pagination.total
            : 0,
        avgMarginPercent: (totals.averageMarginPct || 0) * 100, // 0.35 → 35
        currency,
      },
      fxRateSnapshot: {
        date: new Date().toISOString().split('T')[0],
        rate: items[0]?.fxRate || 0.0028,
        sourceCurrency: 'PKR',
        targetCurrency: currency,
      },
    };
  }

  /**
   * Map destination to currency code
   */
  private getCurrency(destination?: string): string {
    if (destination === 'UK') return 'GBP';
    if (destination === 'EU') return 'EUR';
    return 'USD';
  }
}

/**
 * Hook to use pricing backend in components
 * Gets orgId from AuthContext automatically
 */
export function usePricingBackend(orgId?: string) {
  return new PricingBackendAdapter(orgId || 'default');
}

