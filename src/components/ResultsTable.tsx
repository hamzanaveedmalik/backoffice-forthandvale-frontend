import { useState } from 'react';
import { FixedSizeList } from 'react-window';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileDown, Save, Copy, FileText, Info } from 'lucide-react';
import {
  PricingCalculationResponse,
  PricingResultItem,
  CURRENCY_SYMBOLS,
} from '@/types/pricing';
import ExplainModal from './ExplainModal';

interface ResultsTableProps {
  results: PricingCalculationResponse | null;
  isLoading: boolean;
  onExport: () => void;
  onSave: () => void;
  onDuplicate: () => void;
  onCreateQuote: () => void;
}

export default function ResultsTable({
  results,
  isLoading,
  onExport,
  onSave,
  onDuplicate,
  onCreateQuote,
}: ResultsTableProps) {
  const [selectedItem, setSelectedItem] = useState<PricingResultItem | null>(
    null
  );
  const [showExplainModal, setShowExplainModal] = useState(false);

  // Get currency symbol from results, with proper mapping
  const getCurrencySymbol = () => {
    if (!results) return '$';

    const currency = results.summary.currency;

    // Map currency code to country for symbol lookup
    if (currency === 'GBP') return '£';
    if (currency === 'EUR') return '€';
    if (currency === 'USD') return '$';

    // Fallback to direct lookup
    return CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || '$';
  };

  const currencySymbol = getCurrencySymbol();

  const handleExplain = (item: PricingResultItem) => {
    setSelectedItem(item);
    setShowExplainModal(true);
  };

  const formatCurrency = (value: number) => {
    return `${currencySymbol}${value.toFixed(2)}`;
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    if (!results) return null;
    const item = results.items[index];

    return (
      <div
        style={style}
        className="flex items-center border-b hover:bg-muted/50 text-sm"
      >
        <div className="w-32 px-4 py-2 font-medium truncate">{item.sku}</div>
        <div className="w-24 px-4 py-2 text-right">
          {item.basePKR.toFixed(2)}
        </div>
        <div className="w-24 px-4 py-2 text-right">
          {item.fxRate.toFixed(4)}
        </div>
        <div className="w-24 px-4 py-2 text-right">
          {formatCurrency(item.baseDest)}
        </div>
        <div className="w-24 px-4 py-2 text-right">
          {formatCurrency(item.freight)}
        </div>
        <div className="w-24 px-4 py-2 text-right">
          {formatCurrency(item.insurance)}
        </div>
        <div className="w-24 px-4 py-2 text-right font-medium">
          {formatCurrency(item.cif)}
        </div>
        <div className="w-24 px-4 py-2 text-right">
          {formatCurrency(item.duty)}
        </div>
        <div className="w-24 px-4 py-2 text-right">
          {formatCurrency(item.fees)}
        </div>
        <div className="w-24 px-4 py-2 text-right">
          {formatCurrency(item.tax)}
        </div>
        <div className="w-28 px-4 py-2 text-right font-semibold">
          {formatCurrency(item.landedCost)}
        </div>
        <div className="w-24 px-4 py-2 text-right font-semibold text-green-600">
          {formatCurrency(item.sell)}
        </div>
        <div className="w-20 px-4 py-2 text-right">
          <Badge variant={item.marginPercent >= 30 ? 'default' : 'secondary'}>
            {item.marginPercent.toFixed(1)}%
          </Badge>
        </div>
        <div className="flex-1 px-4 py-2 text-muted-foreground text-xs truncate">
          {item.notes}
          {item.breakdown_json.thresholdsApplied.length > 0 && (
            <span className="ml-2">
              {item.breakdown_json.thresholdsApplied.map((t) => (
                <Badge key={t} variant="outline" className="ml-1 text-xs">
                  {t}
                </Badge>
              ))}
            </span>
          )}
        </div>
        <div className="w-24 px-4 py-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleExplain(item)}
            className="flex items-center gap-1"
          >
            <Info className="h-3 w-3" />
            Explain
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pricing Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-96" />
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pricing Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Upload data and configure settings to calculate pricing
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pricing Results
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onExport}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Export CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onSave}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Run
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onDuplicate}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </Button>
              <Button
                size="sm"
                onClick={onCreateQuote}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Create Quote
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-sm text-blue-600 font-medium">
                  Total SKUs
                </div>
                <div className="text-3xl font-bold text-blue-900 mt-2">
                  {results.summary.totalSKUs}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="pt-6">
                <div className="text-sm text-green-600 font-medium">
                  Avg Landed Cost
                </div>
                <div className="text-3xl font-bold text-green-900 mt-2">
                  {formatCurrency(results.summary.avgLandedCost)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="pt-6">
                <div className="text-sm text-purple-600 font-medium">
                  Avg Margin
                </div>
                <div className="text-3xl font-bold text-purple-900 mt-2">
                  {results.summary.avgMarginPercent.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FX Rate Info */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <strong>FX Rate Snapshot:</strong>{' '}
            {(1 / results.fxRateSnapshot.rate).toFixed(2)} PKR = 1{' '}
            {results.fxRateSnapshot.targetCurrency} (as of{' '}
            {new Date(results.fxRateSnapshot.date).toLocaleDateString()})
          </div>

          {/* Virtualized Table */}
          <div className="border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center bg-muted font-medium text-sm border-b">
              <div className="w-32 px-4 py-3">SKU</div>
              <div className="w-24 px-4 py-3 text-right">Base PKR</div>
              <div className="w-24 px-4 py-3 text-right">FX</div>
              <div className="w-24 px-4 py-3 text-right">
                Base {results.summary.currency}
              </div>
              <div className="w-24 px-4 py-3 text-right">Freight</div>
              <div className="w-24 px-4 py-3 text-right">Insurance</div>
              <div className="w-24 px-4 py-3 text-right">CIF</div>
              <div className="w-24 px-4 py-3 text-right">Duty</div>
              <div className="w-24 px-4 py-3 text-right">Fees</div>
              <div className="w-24 px-4 py-3 text-right">Tax</div>
              <div className="w-28 px-4 py-3 text-right">Landed Cost</div>
              <div className="w-24 px-4 py-3 text-right">Sell</div>
              <div className="w-20 px-4 py-3 text-right">Margin%</div>
              <div className="flex-1 px-4 py-3">Notes</div>
              <div className="w-24 px-4 py-3">Actions</div>
            </div>

            {/* Virtualized Rows */}
            <FixedSizeList
              height={500}
              itemCount={results.items.length}
              itemSize={50}
              width="100%"
            >
              {Row}
            </FixedSizeList>
          </div>

          {/* Mobile View (Non-virtualized fallback) */}
          <div className="md:hidden">
            <div className="space-y-4">
              {results.items.slice(0, 20).map((item) => (
                <Card key={item.sku} className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-semibold">
                      <span>{item.sku}</span>
                      <Badge
                        variant={
                          item.marginPercent >= 30 ? 'default' : 'secondary'
                        }
                      >
                        {item.marginPercent.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Landed:</span>{' '}
                        {formatCurrency(item.landedCost)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sell:</span>{' '}
                        {formatCurrency(item.sell)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExplain(item)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
              {results.items.length > 20 && (
                <div className="text-center text-sm text-muted-foreground">
                  Showing 20 of {results.items.length} items. Use desktop for
                  full view.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explain Modal */}
      {selectedItem && (
        <ExplainModal
          isOpen={showExplainModal}
          onClose={() => setShowExplainModal(false)}
          item={selectedItem}
          currencySymbol={currencySymbol}
        />
      )}
    </>
  );
}
