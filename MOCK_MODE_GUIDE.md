# Mock Mode Guide - Testing Without Backend

## 🎯 Overview

Since the pricing module backend endpoints are not yet deployed on Vercel, I've added a **Mock Mode** that allows you to fully test the frontend immediately!

## ✅ What's Working Now

The pricing module will now work **completely** with realistic mock data:

- ✅ Upload Excel/CSV files
- ✅ Column mapping and validation
- ✅ Full pricing calculations
- ✅ FX rate conversion (PKR → USD/GBP/EUR)
- ✅ Duty, tax, and fee calculations
- ✅ Margin/Markup modes
- ✅ All freight and insurance models
- ✅ Results table with all columns
- ✅ Explain modal with full breakdown
- ✅ Export, Save, Duplicate actions

## 🔧 How to Enable/Disable Mock Mode

### Enable Mock Mode (Default)

Mock mode is **ENABLED by default** for development.

In `/src/api/pricing.mock.ts`:

```typescript
export const USE_MOCK_API = true; // ✅ Mock mode ON
```

### Disable Mock Mode (Use Real Backend)

When your backend endpoints are ready:

In `/src/api/pricing.mock.ts`:

```typescript
export const USE_MOCK_API = false; // ❌ Mock mode OFF
```

## 📊 Mock Calculations

The mock system provides realistic pricing calculations:

### FX Rates

- PKR → USD: 0.0036
- PKR → GBP: 0.0028
- PKR → EUR: 0.0033

### Duty Rates

- HS 4202.xx (Leather goods): 8.5%
- Other HS codes: 5.0%

### Tax Rates

- UK: 20% VAT
- EU: 21% VAT
- US: 6.5% Sales Tax

### Fees

- Customs processing: 1% of CIF value

### Thresholds

- US Section 321: Applied when CIF < $800

## 🧪 Testing Guide

### Step 1: Upload Sample Data

1. Go to Pricing module
2. Upload `/public/sample-pricing-data.csv`
3. Columns will auto-map
4. Click "Validate & Upload"
5. ✅ Should see success message

### Step 2: Configure Pricing

1. Select destination country (US/UK/EU)
2. Set margin: 35% (Margin mode)
3. Freight: $5 per KG
4. Insurance: 2% of cargo
5. Click "Calculate Pricing"

### Step 3: View Results

After ~2 seconds (simulated API delay):

- Results table appears with all 15 products
- Summary cards show aggregated data
- FX rate snapshot displays

### Step 4: Test Features

- Click "Explain" on any row → See full breakdown
- Try different margin modes → Sell price changes
- Export CSV → Downloads mock data
- Save Run → Simulates save
- Duplicate → Creates new run ID

## 🎨 Mock Data Features

### Realistic Calculations

```typescript
CIF = Base (dest currency) + Freight + Insurance
Duty = CIF × Duty Rate
Tax = (CIF + Duty + Fees) × Tax Rate
Landed Cost = CIF + Duty + Fees + Tax
Sell Price = Landed Cost / (1 - Margin%) [Margin mode]
            = Landed Cost × (1 + Markup%) [Markup mode]
```

### Variable Data

- Historical FX rates vary ±5%
- Different duty rates by HS code
- Country-specific tax rates
- Threshold rules by country

### Breakdown Details

Each item includes:

- Complete cost flow diagram
- Applied rules with effective dates
- Threshold information
- Per-unit profit calculation

## 🔄 Switching to Real Backend

When backend endpoints are ready:

### 1. Disable Mock Mode

```typescript
// In src/api/pricing.mock.ts
export const USE_MOCK_API = false;
```

### 2. Verify Backend Endpoints

Required endpoints:

```
POST   /api/imports
POST   /api/imports/:id/items
POST   /api/pricing/runs
POST   /api/pricing/runs/:id/calculate
GET    /api/fx-rates/latest
GET    /api/fx-rates (with date param)
GET    /api/pricing/runs/:id/export
PATCH  /api/pricing/runs/:id
POST   /api/pricing/runs/:id/duplicate
```

### 3. Test Backend Integration

1. Upload a file → Should create real import
2. Calculate → Should use real calculations
3. Check browser console for any errors

## 📝 Backend Implementation Guide

When implementing the backend, use these contracts:

### POST /api/imports

**Request:**

```json
{
  "tenantId": "default"
}
```

**Response:**

```json
{
  "importId": "import-123456"
}
```

### POST /api/imports/:id/items

**Request:**

```json
{
  "items": [
    {
      "sku": "FNV-1001",
      "productName": "Leather Messenger Bag",
      "hsCode": "4202.21",
      "purchasePricePKR": 12500,
      "unitsPerOrder": 100,
      "weightKg": 0.8,
      "volumeM3": 0.025
    }
  ]
}
```

**Response:**

```json
{
  "importId": "import-123456",
  "itemsCount": 1,
  "validationErrors": []
}
```

### POST /api/pricing/runs

**Request:**

```json
{
  "importId": "import-123456",
  "config": {
    "country": "US",
    "incoterm": "CIF",
    "marginMode": "MARGIN",
    "marginValue": 35,
    "freightModel": "PER_KG",
    "freightValue": 5,
    "insuranceModel": "PERCENTAGE",
    "insuranceValue": 2,
    "applyThresholds": true,
    "roundingRule": "NONE"
  }
}
```

**Response:**

```json
{
  "runId": "run-123456",
  "status": "PENDING",
  "createdAt": "2024-10-09T21:00:00Z"
}
```

### POST /api/pricing/runs/:id/calculate

**Response:** See `PricingCalculationResponse` type in `/src/types/pricing.ts`

## 🐛 Troubleshooting

### Mock Mode Not Working?

1. Check `/src/api/pricing.mock.ts` → `USE_MOCK_API = true`
2. Clear browser cache
3. Check browser console for errors
4. Verify sample CSV file exists

### Want to Test Backend?

1. Set `USE_MOCK_API = false`
2. Ensure backend is running
3. Check backend URL in `/src/api/pricing.ts`
4. Verify CORS headers on backend

### Need Different Mock Data?

Edit `/src/api/pricing.mock.ts`:

- Change `mockFXRates` for different rates
- Modify duty/tax rates in calculations
- Adjust threshold values

## 📚 Files Modified

1. **Created:**

   - `/src/api/pricing.mock.ts` - Mock implementation

2. **Modified:**

   - `/src/api/pricing.ts` - Added mock mode toggle

3. **Documentation:**
   - `/MOCK_MODE_GUIDE.md` - This file

## ✨ Benefits of Mock Mode

- ✅ Test frontend immediately
- ✅ No backend dependency
- ✅ Realistic calculations
- ✅ Fast iteration
- ✅ Demo-ready
- ✅ Easy to switch to real API

## 🚀 Ready to Test!

The pricing module is now **fully functional** with mock data. Just:

1. Refresh your browser
2. Go to Pricing module
3. Upload the sample CSV
4. Start testing!

All features work exactly as they will with the real backend! 🎉
