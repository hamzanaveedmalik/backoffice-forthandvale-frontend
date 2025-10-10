import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PricingResultItem } from '@/types/pricing';
import { ArrowRight, Info } from 'lucide-react';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PricingResultItem;
  currencySymbol: string;
}

export default function ExplainModal({
  isOpen,
  onClose,
  item,
  currencySymbol,
}: ExplainModalProps) {
  const formatCurrency = (value: number) => {
    return `${currencySymbol}${value.toFixed(2)}`;
  };

  const breakdown = item.breakdown_json;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Pricing Breakdown: {item.sku}
          </DialogTitle>
          <DialogDescription>{item.productName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Cost Flow Diagram */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-4">Cost Flow</h3>
              <div className="space-y-3">
                {/* Base Cost */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium">Base Cost (PKR)</div>
                    <div className="text-xs text-muted-foreground">
                      Purchase price in Pakistan Rupees
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    PKR {breakdown.basePKR.toFixed(2)}
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* FX Conversion */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <div className="font-medium">FX Conversion</div>
                    <div className="text-xs text-muted-foreground">
                      Rate: {(1 / breakdown.fxRate).toFixed(2)} PKR = 1{' '}
                      {breakdown.currency}
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    {formatCurrency(breakdown.baseDest)}
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Freight & Insurance */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">+ Freight</span>
                    <span className="font-medium">
                      {formatCurrency(breakdown.freight)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">+ Insurance</span>
                    <span className="font-medium">
                      {formatCurrency(breakdown.insurance)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* CIF Value */}
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div>
                    <div className="font-medium">CIF Value</div>
                    <div className="text-xs text-muted-foreground">
                      Cost + Insurance + Freight
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    {formatCurrency(breakdown.cif)}
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Duties & Taxes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">+ Customs Duty</span>
                    <span className="font-medium">
                      {formatCurrency(breakdown.duty)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">+ Fees</span>
                    <span className="font-medium">
                      {formatCurrency(breakdown.fees)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">+ Tax (VAT/Sales Tax)</span>
                    <span className="font-medium">
                      {formatCurrency(breakdown.tax)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Landed Cost */}
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <div className="font-medium">Landed Cost</div>
                    <div className="text-xs text-muted-foreground">
                      Total cost to deliver to customer
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    {formatCurrency(breakdown.landedCost)}
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Sell Price */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
                  <div>
                    <div className="font-medium">Sell Price</div>
                    <div className="text-xs text-muted-foreground">
                      Margin: {breakdown.marginPercent.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {formatCurrency(breakdown.sell)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rules Applied */}
          {breakdown.rules && breakdown.rules.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-sm mb-4">
                  Rules & Rates Applied
                </h3>
                <div className="space-y-2">
                  {breakdown.rules.map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              rule.type === 'DUTY'
                                ? 'default'
                                : rule.type === 'VAT'
                                ? 'secondary'
                                : rule.type === 'THRESHOLD'
                                ? 'outline'
                                : 'default'
                            }
                          >
                            {rule.type}
                          </Badge>
                          <span className="font-medium text-sm">
                            {rule.name}
                          </span>
                        </div>
                        {rule.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {rule.description}
                          </div>
                        )}
                        {rule.effectiveDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Effective:{' '}
                            {new Date(rule.effectiveDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        {rule.rate !== undefined && (
                          <div className="text-sm font-medium">
                            {rule.rate}%
                          </div>
                        )}
                        <div className="text-sm font-bold">
                          {formatCurrency(rule.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Thresholds Applied */}
          {breakdown.thresholdsApplied &&
            breakdown.thresholdsApplied.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-sm mb-4">
                    Thresholds Applied
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.thresholdsApplied.map((threshold, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {threshold}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    These thresholds may exempt or reduce certain duties and
                    taxes based on shipment value or quantity.
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Summary */}
          <Card className="border-2 border-primary">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Landed Cost
                  </div>
                  <div className="text-xl font-bold">
                    {formatCurrency(breakdown.landedCost)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Recommended Sell Price
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(breakdown.sell)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Profit per Unit
                  </div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(breakdown.sell - breakdown.landedCost)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Margin</div>
                  <div className="text-lg font-semibold">
                    {breakdown.marginPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
