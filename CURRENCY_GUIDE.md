# Currency Display Guide

## ✅ Automatic Currency Symbol Detection

The pricing module **automatically** displays the correct currency symbol based on the selected country:

### Currency Mapping

| Country            | Currency Symbol | Currency Code | FX Rate (PKR to)   |
| ------------------ | --------------- | ------------- | ------------------ |
| **United States**  | **$**           | USD           | 277.78 PKR = 1 USD |
| **United Kingdom** | **£**           | GBP           | 357.14 PKR = 1 GBP |
| **European Union** | **€**           | EUR           | 303.03 PKR = 1 EUR |

---

## 🎯 How It Works

### 1. Country Selection

When you select a country in the Configuration section:

```typescript
// Configuration
Country: US → Currency: USD → Symbol: $
Country: UK → Currency: GBP → Symbol: £
Country: EU → Currency: EUR → Symbol: €
```

### 2. Results Display

All monetary values automatically show the correct symbol:

#### US Market (USD - $)

```
Base PKR: 1100.00
Base USD: $3.96
Freight:  $1.50
CIF:      $5.57
Landed:   $6.49
Sell:     $9.98
```

#### UK Market (GBP - £)

```
Base PKR: 1100.00
Base GBP: £3.08
Freight:  £1.50
CIF:      £4.92
Landed:   £8.07
Sell:     £12.99
```

#### EU Market (EUR - €)

```
Base PKR: 1100.00
Base EUR: €3.63
Freight:  €1.50
CIF:      €5.35
Landed:   €6.95
Sell:     €10.69
```

---

## 📊 Where Currency Symbols Appear

### 1. Summary Cards

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Total SKUs      │  │ Avg Landed Cost │  │ Avg Margin      │
│      45         │  │     $16.87      │  │    36.4%        │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         ↑ Changes based on country: $ or £ or €
```

### 2. Results Table

All price columns show the correct symbol:

- Base (destination currency)
- Freight
- Insurance
- CIF
- Duty
- Fees
- Tax
- Landed Cost
- Sell Price

**Note:** Base PKR column shows numbers without currency symbol (e.g., `1100.00`)

### 3. FX Rate Snapshot

```
US: 277.78 PKR = 1 USD
UK: 357.14 PKR = 1 GBP
EU: 303.03 PKR = 1 EUR
```

### 4. Explain Modal

Complete breakdown with correct symbols throughout:

```
FX Conversion
Rate: 357.14 PKR = 1 GBP
           £3.08

+ Freight:      £1.50
+ Insurance:    £0.06
= CIF Value:    £4.92
+ Duty:         £0.52
+ Fees:         £0.06
+ Tax:          £1.35
= Landed Cost:  £8.07
→ Sell Price:   £12.99
```

---

## 🧪 Testing All Three Markets

### Test Scenario 1: US Market

1. Select **Country: United States**
2. Configure pricing (35% margin, etc.)
3. Click **Calculate Pricing**
4. ✅ Verify: All prices show **$** symbol

**Expected Output:**

```
FNV-1001: $9.98
FNV-1010: $15.99
FNV-1045: $37.72
```

### Test Scenario 2: UK Market

1. Select **Country: United Kingdom**
2. Keep same configuration
3. Click **Calculate Pricing**
4. ✅ Verify: All prices show **£** symbol

**Expected Output:**

```
FNV-1001: £12.99
FNV-1010: £15.99
FNV-1045: £29.30
```

### Test Scenario 3: EU Market

1. Select **Country: European Union**
2. Keep same configuration
3. Click **Calculate Pricing**
4. ✅ Verify: All prices show **€** symbol

**Expected Output:**

```
FNV-1001: €10.69
FNV-1010: €13.14
FNV-1045: €34.09
```

---

## 🔧 Technical Implementation

The system uses these mappings (in `/src/types/pricing.ts`):

```typescript
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
```

### Flow:

1. User selects country → `config.country = 'US'`
2. System determines currency → `currency = 'USD'`
3. FX rate fetched → `PKR to USD`
4. Results calculated → All values in USD
5. Display uses symbol → `CURRENCY_SYMBOLS['US']` = `$`

---

## ✅ Automatic Features

- ✨ **No manual configuration needed**
- ✨ **Consistent across all components**
- ✨ **Updates in real-time** when country changes
- ✨ **Export maintains currency** in file name
- ✨ **Explain modal** always matches main display

---

## 🎯 Quick Reference

| Need to...            | Do this...                                               |
| --------------------- | -------------------------------------------------------- |
| See prices in USD ($) | Select **United States**                                 |
| See prices in GBP (£) | Select **United Kingdom**                                |
| See prices in EUR (€) | Select **European Union**                                |
| Compare markets       | Calculate once per country, use "Duplicate" to save each |
| Export with currency  | Currency symbol included in CSV export                   |

---

## 📝 Notes

- Base PKR column always shows plain numbers (no symbol)
- FX column shows decimal rate (e.g., 0.0028)
- All other monetary columns use destination currency symbol
- Symbol appears before the amount (e.g., $10.99, £8.50, €9.75)
- Margin % column never has currency (it's a percentage)

---

## 🐛 Troubleshooting

**Problem:** Seeing wrong currency symbol  
**Solution:** Make sure you clicked "Calculate Pricing" after changing country

**Problem:** All showing $ even when selecting UK  
**Solution:** Refresh browser and try again. Mock system should auto-detect.

**Problem:** Want to add more countries  
**Solution:** Edit `/src/types/pricing.ts` and add to `CURRENCY_SYMBOLS` mapping

---

## ✨ Summary

The system is **already configured** to show:

- ✅ **$** for United States (USD)
- ✅ **£** for United Kingdom (GBP)
- ✅ **€** for European Union (EUR)

Just select your country and everything updates automatically! 🎉
