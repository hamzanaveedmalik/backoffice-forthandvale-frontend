# Pricing Module - Quick Start Guide

## 🚀 Getting Started

### 1. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 2. Login & Navigate

1. Log in to the dashboard
2. Click **"Pricing"** in the sidebar (Calculator icon)

## 📝 Testing the Module

### Step 1: Upload Sample Data

1. Click **"Upload & Map"** tab
2. Click **"Select File"**
3. Choose `/public/sample-pricing-data.csv`
4. Column mapping should auto-populate:
   - SKU → SKU
   - Product Name → Product Name
   - HS Code → HS Code
   - Purchase Price PKR → Purchase Price PKR
   - Units Per Order → Units Per Order
   - Weight Kg → Weight Kg
   - Volume M3 → Volume M3
5. Click **"Validate & Upload"**
6. You should see: "✓ 15 items uploaded successfully"

### Step 2: Configure Pricing

1. Click **"Configuration"** tab
2. Set your parameters:

   **Basic Settings:**

   - Destination Country: **US** (or UK/EU)
   - Incoterm: **CIF**
   - FX Date: Leave blank for latest rate

   **Margin:**

   - Mode: **Margin**
   - Value: **35%**

   **Freight:**

   - Model: **PER_KG**
   - Value: **5** (USD/kg)

   **Insurance:**

   - Model: **% of cargo**
   - Value: **2** (%)

   **Options:**

   - ✓ Apply Thresholds
   - Rounding: **None**

3. Click **"Calculate Pricing"**

### Step 3: Review Results

1. You'll automatically be taken to the **"Results"** tab
2. Check the summary cards:

   - Total SKUs: **15**
   - Avg Landed Cost: ~$XX.XX
   - Avg Margin: ~35%

3. Scroll through the virtualized table
4. Find **SKU FNV-1001** and verify:

   - ✓ Base PKR: 12,500
   - ✓ FX Rate: ~0.0035
   - ✓ Base USD: ~43.75
   - ✓ Freight: ~4.00
   - ✓ Insurance: ~0.95
   - ✓ CIF: ~48.70
   - ✓ Duty: Calculated based on HS 4202.21
   - ✓ Tax: Calculated
   - ✓ Landed Cost: Sum of all costs
   - ✓ Sell Price: Based on 35% margin

5. Click **"Explain"** on FNV-1001 row

### Step 4: Verify Explain Modal

The modal should show:

1. **Cost Flow Diagram** with visual arrows
2. **Base Cost** (PKR 12,500)
3. **FX Conversion** (→ USD)
4. **Freight & Insurance** added
5. **CIF Value**
6. **Duties & Taxes** breakdown
7. **Landed Cost** total
8. **Sell Price** (with margin)

Check the **Rules & Rates Applied** section:

- Each rule should show type badge
- Rate percentages
- Calculated amounts
- Effective dates (if available)

### Step 5: Test Margin Mode Toggle

1. Close the modal
2. Go back to **"Configuration"** tab
3. Change Margin Mode to **"Markup"**
4. Keep value at **35%**
5. Click **"Calculate Pricing"** again
6. Go to **"Results"** tab
7. Find FNV-1001 again
8. **Verify:** Sell price is different (higher with Markup mode)

**Expected Behavior:**

- **Margin mode:** Sell = Landed Cost / (1 - 0.35) ≈ Landed Cost × 1.54
- **Markup mode:** Sell = Landed Cost × (1 + 0.35) ≈ Landed Cost × 1.35

### Step 6: Test Export & Actions

1. Click **"Export CSV"** → Should download CSV file
2. Click **"Save Run"** → Enter a name → Verify success message
3. Click **"Duplicate"** → Verify new run ID message
4. Click **"Create Quote"** → Verify integration message

## 🧪 Smoke Test Checklist

- [ ] Upload sample CSV successfully
- [ ] Column auto-mapping works
- [ ] Validation detects errors (try invalid data)
- [ ] Configuration saves to localStorage (refresh page)
- [ ] FX rate displays correctly
- [ ] Calculate button creates run
- [ ] Results table displays all 15 SKUs
- [ ] Summary cards show correct totals
- [ ] SKU FNV-1001 has all computed values
- [ ] Virtualized scrolling is smooth
- [ ] Explain modal opens with full breakdown
- [ ] Rules section shows duty/tax rules
- [ ] Margin/Markup toggle updates sell price
- [ ] Currency symbols display correctly ($/£/€)
- [ ] Threshold badges appear if applicable
- [ ] Export CSV works
- [ ] Mobile view is responsive

## 🐛 Testing Error Scenarios

### Invalid Upload Data

Create a test CSV with errors:

```csv
SKU,Product Name,HS Code,Purchase Price PKR,Units Per Order,Weight Kg,Volume M3
TEST-001,Test Product,INVALID,not-a-number,100,0.5,0.01
TEST-002,,4202.21,5000,100,0.5,0.01
```

**Expected:**

- Row 2: Invalid HS Code format
- Row 2: Invalid numeric value for Purchase Price
- Row 3: Missing Product Name

### API Errors

If API endpoints are not available:

- Should show error messages
- Should not crash the application
- Should allow retry

## 📊 Performance Test

1. Create a CSV with 1000+ rows
2. Upload and calculate
3. Verify:
   - Upload completes in <5 seconds
   - Calculation completes in <10 seconds
   - Table scrolling remains smooth
   - No UI freezing

## 🎯 Browser Compatibility

Test in:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## ✅ Acceptance Criteria

The module is working correctly if:

1. ✅ All uploads complete without errors
2. ✅ Column mapping is intuitive and accurate
3. ✅ Validation catches common errors
4. ✅ Configuration persists across sessions
5. ✅ Calculations complete successfully
6. ✅ All 14 columns display in results
7. ✅ Summary cards show correct aggregations
8. ✅ FNV-1001 values match expectations
9. ✅ Explain modal provides clear breakdown
10. ✅ Margin/Markup modes calculate differently
11. ✅ Export functionality works
12. ✅ UI is responsive and performant

## 🔧 Development Notes

### API Proxy

The app uses Vite proxy to forward `/api` requests to `http://localhost:8787`. Make sure your backend is running on that port.

### Environment Variables

Create `.env` file if needed:

```
VITE_API_URL=http://localhost:8787/api
```

### Mock Data

If backend is not ready, you can modify API functions to return mock data:

```typescript
// In src/api/pricing.ts
export async function calculatePricingRun(runId: string) {
  // Return mock data instead of fetch
  return mockPricingResults;
}
```

## 📞 Need Help?

1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check network tab for failed requests
4. Review `PRICING_MODULE_README.md` for details
5. Check `IMPLEMENTATION_SUMMARY.md` for architecture

## 🎉 Success!

If all tests pass, the Pricing Module is working correctly and ready for production use!

---

**Next Steps:**

- Connect to production API
- Add automated tests
- Customize branding/styling
- Add advanced features (history, comparisons, etc.)
