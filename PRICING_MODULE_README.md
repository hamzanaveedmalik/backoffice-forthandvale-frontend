# Pricing / Cost Module

A comprehensive pricing calculator for international trade, built with React, TypeScript, shadcn/ui, and Tailwind CSS.

## Features

### 1. Upload & Map Section

- **File Upload**: Support for Excel (.xlsx, .xls) and CSV files
- **SheetJS Integration**: Automatic parsing of spreadsheet data
- **Column Mapping UI**: Intelligent auto-mapping with manual override
- **Required Fields**:
  - SKU
  - Product Name
  - HS Code
  - Purchase Price (PKR)
  - Units Per Order
  - Weight (kg)
  - Volume (m³)
- **Validation**:
  - Missing field detection
  - Numeric value validation
  - HS Code format validation
  - Real-time error reporting

### 2. Configuration Section

#### Country & Currency Settings

- **Destination Country**: UK / US / EU
- **Incoterm**: FOB / CIF / DDP (default: CIF)
- **FX Date**: Date picker with latest rate default
- **Live FX Rate Display**: Shows current exchange rate for PKR to destination currency

#### Margin Configuration

- **Margin Mode**:
  - Margin: (Sell - Cost) / Sell
  - Markup: (Sell - Cost) / Cost
- **Margin Value**: Percentage input (default: 35%)

#### Freight Model

Three calculation methods:

- **PER_KG**: Cost per kilogram
- **PER_UNIT**: Cost per unit
- **PER_ORDER**: Fixed cost per order

#### Insurance Model

Two calculation methods:

- **Percentage**: % of cargo value
- **Fixed per Unit**: Fixed amount per unit

#### Additional Options

- **Threshold Toggles**: Apply de-minimis thresholds (e.g., US Section 321)
- **Rounding Rules**:
  - None
  - Nearest 0.05
  - Nearest 0.50
  - End with .99

#### Local Storage

- Configuration is automatically saved to localStorage
- Last used settings are restored on page load

### 3. Results Table (Virtualized)

#### Performance

- React Window for efficient rendering of large datasets
- Smooth scrolling with 500px viewport
- Mobile-responsive fallback view

#### Columns

1. **SKU**: Product identifier
2. **Base PKR**: Original purchase price
3. **FX**: Exchange rate applied
4. **Base (dest)**: Price in destination currency
5. **Freight**: Freight cost
6. **Insurance**: Insurance cost
7. **CIF**: Cost + Insurance + Freight
8. **Duty**: Customs duty
9. **Fees**: Additional fees
10. **Tax**: VAT/Sales tax
11. **Landed Cost**: Total cost to deliver
12. **Sell**: Recommended selling price
13. **Margin%**: Profit margin percentage
14. **Notes**: Special notes and threshold badges

#### Summary Cards

- **Total SKUs**: Count of products
- **Avg Landed Cost**: Average cost per product
- **Avg Margin%**: Average profit margin

#### Row Actions

- **Explain**: Opens detailed breakdown modal

#### Table Actions

- **Export CSV**: Download results as CSV file
- **Save Run**: Save calculation for future reference
- **Duplicate**: Create a copy for what-if analysis
- **Create Quote**: Generate quote from results

### 4. Explain Modal

Detailed cost breakdown visualization:

1. **Cost Flow Diagram**: Step-by-step visual breakdown

   - Base Cost (PKR)
   - FX Conversion
   - Freight & Insurance
   - CIF Value
   - Duties & Taxes
   - Landed Cost
   - Sell Price

2. **Rules & Rates Applied**: Shows which duty/VAT/fee rules were used

   - Rule type (DUTY, VAT, FEE, THRESHOLD)
   - Rate percentage
   - Amount
   - Effective date
   - Description

3. **Thresholds Applied**: Displays any de-minimis or threshold rules

4. **Summary**: Key metrics
   - Total Landed Cost
   - Recommended Sell Price
   - Profit per Unit
   - Margin Percentage

## API Integration

### Endpoints

#### Import Management

```typescript
POST /api/imports
POST /api/imports/:importId/items
```

#### Pricing Runs

```typescript
POST /api/pricing/runs
POST /api/pricing/runs/:id/calculate
PATCH /api/pricing/runs/:id
POST /api/pricing/runs/:id/duplicate
GET /api/pricing/runs/:id/export
```

#### FX Rates

```typescript
GET /api/fx-rates/latest?source={currency}&target={currency}
GET /api/fx-rates?source={currency}&target={currency}&date={date}
```

### API Configuration

Set your API base URL in `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

## Usage

### Basic Workflow

1. **Upload Data**

   - Click "Select File" and choose Excel/CSV
   - Map columns to required fields
   - Click "Validate & Upload"

2. **Configure Pricing**

   - Select destination country
   - Choose incoterm
   - Set margin/markup
   - Configure freight and insurance
   - Click "Calculate Pricing"

3. **Review Results**
   - View summary cards
   - Scroll through results table
   - Click "Explain" on any row for details
   - Export or save results

### Sample Data

A sample CSV file is available at `/public/sample-pricing-data.csv` with test data including SKU FNV-1001 for smoke testing.

## Smoke Test Instructions

After uploading sample data:

1. Verify SKU **FNV-1001** appears in results
2. Check computed values:

   - ✓ CIF value (Base + Freight + Insurance)
   - ✓ Duty amount (based on HS code 4202.21)
   - ✓ VAT/Tax amount
   - ✓ Landed Cost (sum of all costs)
   - ✓ Sell Price (based on margin/markup)

3. Toggle margin mode (Margin ↔ Markup)
4. Verify Sell price updates consistently

## Dependencies

### Core

- react: ^18.2.0
- react-dom: ^18.2.0
- typescript: ^5.0.2

### UI Components

- @radix-ui/react-dialog: ^1.1.15
- @radix-ui/react-label: ^2.1.7
- @radix-ui/react-select: ^2.2.6
- @radix-ui/react-radio-group: ^1.2.3
- @radix-ui/react-tabs: ^1.1.3
- lucide-react: ^0.263.1

### Data Processing

- xlsx: ^0.18.5 (SheetJS)
- react-window: ^1.8.10

### Styling

- tailwindcss: ^3.3.0
- class-variance-authority: ^0.7.1
- tailwind-merge: ^1.14.0

## File Structure

```
src/
├── pages/
│   └── Pricing.tsx              # Main pricing page
├── components/
│   ├── UploadMapSection.tsx     # File upload & mapping
│   ├── ConfigurationSection.tsx # Pricing configuration
│   ├── ResultsTable.tsx         # Virtualized results table
│   ├── ExplainModal.tsx         # Breakdown modal
│   └── ui/                      # Reusable UI components
│       ├── radio-group.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       └── skeleton.tsx
├── api/
│   └── pricing.ts               # API functions
└── types/
    └── pricing.ts               # TypeScript types
```

## Types Reference

### Main Types

```typescript
interface PricingItem {
  sku: string;
  productName: string;
  hsCode: string;
  purchasePricePKR: number;
  unitsPerOrder: number;
  weightKg: number;
  volumeM3: number;
}

interface PricingConfiguration {
  country: Country; // 'UK' | 'US' | 'EU'
  incoterm: Incoterm; // 'FOB' | 'CIF' | 'DDP'
  fxDate?: string;
  marginMode: MarginMode; // 'MARGIN' | 'MARKUP'
  marginValue: number;
  freightModel: FreightModel; // 'PER_KG' | 'PER_UNIT' | 'PER_ORDER'
  freightValue: number;
  insuranceModel: InsuranceModel; // 'PERCENTAGE' | 'FIXED_PER_UNIT'
  insuranceValue: number;
  applyThresholds: boolean;
  roundingRule: RoundingRule;
}

interface PricingResultItem {
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
```

## UX Features

- **Loading States**: Skeleton loaders during calculation
- **Currency Symbols**: Automatic display based on destination (£, $, €)
- **Inline Badges**: Visual indicators for thresholds
- **Responsive Design**: Mobile-friendly with adaptive layouts
- **Tab Navigation**: Guided workflow through upload, config, results
- **Auto-save Configuration**: Settings persist across sessions
- **Validation Feedback**: Real-time error messages
- **Visual Cost Flow**: Easy-to-understand breakdown diagrams

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus management in modals
- Color contrast compliance

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance Optimization

- Virtualized table rendering for large datasets
- Lazy loading of modal content
- Debounced validation
- Memoized calculations
- Code splitting by route

## Future Enhancements

Potential additions:

- Bulk import from multiple files
- Historical pricing comparisons
- PDF export with branding
- Multi-currency quote generation
- Automated HS code lookup
- Duty rate database integration
- Freight cost API integration
- Real-time FX rate updates

## Support

For issues or questions, please contact the development team or file an issue in the repository.

## License

Proprietary - FORTH & VALE Business Dashboard
