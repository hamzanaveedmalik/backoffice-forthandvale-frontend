import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings, Calculator } from 'lucide-react';
import {
  PricingConfiguration,
  Country,
  Incoterm,
  MarginMode,
  FreightModel,
  InsuranceModel,
  RoundingRule,
  FXRate,
} from '@/types/pricing';
import { getLatestFXRate, getFXRateByDate } from '@/api/pricing';

interface ConfigurationSectionProps {
  onCalculate: (config: PricingConfiguration) => void;
  isCalculating: boolean;
  disabled: boolean;
}

const DEFAULT_CONFIG: PricingConfiguration = {
  country: 'US',
  incoterm: 'CIF',
  marginMode: 'MARGIN',
  marginValue: 35,
  freightModel: 'PER_KG',
  freightValue: 5,
  insuranceModel: 'PERCENTAGE',
  insuranceValue: 2,
  applyThresholds: true,
  roundingRule: 'NONE',
};

const LOCAL_STORAGE_KEY = 'pricing_config';

export default function ConfigurationSection({
  onCalculate,
  isCalculating,
  disabled,
}: ConfigurationSectionProps) {
  const [config, setConfig] = useState<PricingConfiguration>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [fxRate, setFxRate] = useState<FXRate | null>(null);
  const [loadingFxRate, setLoadingFxRate] = useState(false);

  useEffect(() => {
    fetchFxRate();
  }, [config.country, config.fxDate]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const fetchFxRate = async () => {
    setLoadingFxRate(true);
    try {
      const targetCurrency =
        config.country === 'UK'
          ? 'GBP'
          : config.country === 'EU'
          ? 'EUR'
          : 'USD';
      const rate = config.fxDate
        ? await getFXRateByDate('PKR', targetCurrency, config.fxDate)
        : await getLatestFXRate('PKR', targetCurrency);
      setFxRate(rate);
    } catch (error) {
      console.error('Failed to fetch FX rate:', error);
      // Set a fallback rate
      setFxRate({
        date: new Date().toISOString().split('T')[0],
        rate: 0.0035,
        sourceCurrency: 'PKR',
        targetCurrency:
          config.country === 'UK'
            ? 'GBP'
            : config.country === 'EU'
            ? 'EUR'
            : 'USD',
      });
    } finally {
      setLoadingFxRate(false);
    }
  };

  const updateConfig = <K extends keyof PricingConfiguration>(
    key: K,
    value: PricingConfiguration[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleCalculate = () => {
    onCalculate(config);
  };

  const getCurrencySymbol = () => {
    switch (config.country) {
      case 'UK':
        return '£';
      case 'EU':
        return '€';
      case 'US':
      default:
        return '$';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Destination Country</Label>
            <Select
              value={config.country}
              onValueChange={(value) =>
                updateConfig('country', value as Country)
              }
              disabled={disabled}
            >
              <SelectTrigger id="country">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="EU">European Union</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Incoterm */}
          <div className="space-y-2">
            <Label htmlFor="incoterm">Incoterm</Label>
            <Select
              value={config.incoterm}
              onValueChange={(value) =>
                updateConfig('incoterm', value as Incoterm)
              }
              disabled={disabled}
            >
              <SelectTrigger id="incoterm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FOB">FOB</SelectItem>
                <SelectItem value="CIF">CIF</SelectItem>
                <SelectItem value="DDP">DDP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* FX Date */}
          <div className="space-y-2">
            <Label htmlFor="fx-date">
              FX Date {fxRate && `(Rate: ${fxRate.rate.toFixed(4)})`}
            </Label>
            <Input
              id="fx-date"
              type="date"
              value={config.fxDate || ''}
              onChange={(e) =>
                updateConfig('fxDate', e.target.value || undefined)
              }
              placeholder="Latest"
              disabled={disabled || loadingFxRate}
            />
            {!config.fxDate && (
              <p className="text-xs text-muted-foreground">
                Defaults to latest rate
              </p>
            )}
          </div>
        </div>

        {/* Margin Configuration */}
        <div className="border-t pt-4 space-y-4">
          <h3 className="text-sm font-semibold">Margin Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Margin Mode</Label>
              <RadioGroup
                value={config.marginMode}
                onValueChange={(value) =>
                  updateConfig('marginMode', value as MarginMode)
                }
                disabled={disabled}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MARGIN" id="margin" />
                  <Label
                    htmlFor="margin"
                    className="font-normal cursor-pointer"
                  >
                    Margin (Sell - Cost) / Sell
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MARKUP" id="markup" />
                  <Label
                    htmlFor="markup"
                    className="font-normal cursor-pointer"
                  >
                    Markup (Sell - Cost) / Cost
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin-value">Margin/Markup %</Label>
              <Input
                id="margin-value"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={config.marginValue}
                onChange={(e) =>
                  updateConfig('marginValue', parseFloat(e.target.value))
                }
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* Freight Model */}
        <div className="border-t pt-4 space-y-4">
          <h3 className="text-sm font-semibold">Freight Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Freight Calculation</Label>
              <RadioGroup
                value={config.freightModel}
                onValueChange={(value) =>
                  updateConfig('freightModel', value as FreightModel)
                }
                disabled={disabled}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PER_KG" id="freight-kg" />
                  <Label
                    htmlFor="freight-kg"
                    className="font-normal cursor-pointer"
                  >
                    Per Kilogram
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PER_UNIT" id="freight-unit" />
                  <Label
                    htmlFor="freight-unit"
                    className="font-normal cursor-pointer"
                  >
                    Per Unit
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PER_ORDER" id="freight-order" />
                  <Label
                    htmlFor="freight-order"
                    className="font-normal cursor-pointer"
                  >
                    Per Order
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="freight-value">
                Freight Value ({getCurrencySymbol()})
              </Label>
              <Input
                id="freight-value"
                type="number"
                min="0"
                step="0.01"
                value={config.freightValue}
                onChange={(e) =>
                  updateConfig('freightValue', parseFloat(e.target.value))
                }
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* Insurance Model */}
        <div className="border-t pt-4 space-y-4">
          <h3 className="text-sm font-semibold">Insurance Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Insurance Calculation</Label>
              <RadioGroup
                value={config.insuranceModel}
                onValueChange={(value) =>
                  updateConfig('insuranceModel', value as InsuranceModel)
                }
                disabled={disabled}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PERCENTAGE" id="insurance-pct" />
                  <Label
                    htmlFor="insurance-pct"
                    className="font-normal cursor-pointer"
                  >
                    % of Cargo Value
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FIXED_PER_UNIT" id="insurance-unit" />
                  <Label
                    htmlFor="insurance-unit"
                    className="font-normal cursor-pointer"
                  >
                    Fixed per Unit
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance-value">
                Insurance Value (
                {config.insuranceModel === 'PERCENTAGE'
                  ? '%'
                  : getCurrencySymbol()}
                )
              </Label>
              <Input
                id="insurance-value"
                type="number"
                min="0"
                step="0.01"
                value={config.insuranceValue}
                onChange={(e) =>
                  updateConfig('insuranceValue', parseFloat(e.target.value))
                }
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="border-t pt-4 space-y-4">
          <h3 className="text-sm font-semibold">Additional Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rounding">Rounding Rule</Label>
              <Select
                value={config.roundingRule}
                onValueChange={(value) =>
                  updateConfig('roundingRule', value as RoundingRule)
                }
                disabled={disabled}
              >
                <SelectTrigger id="rounding">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None</SelectItem>
                  <SelectItem value="NEAREST_0_05">Nearest 0.05</SelectItem>
                  <SelectItem value="NEAREST_0_50">Nearest 0.50</SelectItem>
                  <SelectItem value="END_99">End with .99</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 h-10">
                <input
                  id="thresholds"
                  type="checkbox"
                  checked={config.applyThresholds}
                  onChange={(e) =>
                    updateConfig('applyThresholds', e.target.checked)
                  }
                  disabled={disabled}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="thresholds"
                  className="font-normal cursor-pointer"
                >
                  Apply Thresholds (e.g., US Section 321 de-minimis)
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="border-t pt-4">
          <Button
            onClick={handleCalculate}
            disabled={disabled || isCalculating}
            size="lg"
            className="w-full md:w-auto flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            {isCalculating ? 'Calculating...' : 'Calculate Pricing'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
