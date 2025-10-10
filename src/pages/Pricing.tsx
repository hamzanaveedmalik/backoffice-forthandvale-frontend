import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator } from 'lucide-react';
import { USE_MOCK_API } from '@/api/pricing.mock';
import UploadMapSection from '@/components/UploadMapSection';
import ConfigurationSection from '@/components/ConfigurationSection';
import ResultsTable from '@/components/ResultsTable';
import {
  PricingItem,
  PricingConfiguration,
  PricingCalculationResponse,
} from '@/types/pricing';
import {
  createPricingRun,
  calculatePricingRun,
  exportPricingResults,
  savePricingRun,
  duplicatePricingRun,
} from '@/api/pricing';

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('upload');
  const [importId, setImportId] = useState<string | null>(null);
  const [uploadedItems, setUploadedItems] = useState<PricingItem[]>([]);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [results, setResults] = useState<PricingCalculationResponse | null>(
    null
  );
  const [isCalculating, setIsCalculating] = useState(false);

  const handleImportComplete = (newImportId: string, items: PricingItem[]) => {
    setImportId(newImportId);
    setUploadedItems(items);
    setActiveTab('config');
  };

  const handleCalculate = async (config: PricingConfiguration) => {
    if (!importId) return;

    setIsCalculating(true);
    try {
      // Create pricing run
      const runResponse = await createPricingRun({
        importId,
        config,
      });

      setCurrentRunId(runResponse.runId);

      // Calculate pricing
      const calculationResponse = await calculatePricingRun(runResponse.runId);
      setResults(calculationResponse);
      setActiveTab('results');
    } catch (error) {
      console.error('Calculation failed:', error);
      alert('Failed to calculate pricing. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleExport = async () => {
    if (!currentRunId) return;

    try {
      const blob = await exportPricingResults(currentRunId, 'csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pricing-results-${currentRunId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export results. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!currentRunId) return;

    const name = prompt('Enter a name for this pricing run:');
    if (!name) return;

    try {
      await savePricingRun(currentRunId, name);
      alert('Pricing run saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save pricing run. Please try again.');
    }
  };

  const handleDuplicate = async () => {
    if (!currentRunId) return;

    try {
      const duplicateResponse = await duplicatePricingRun(currentRunId);
      alert(`Pricing run duplicated! New run ID: ${duplicateResponse.runId}`);
      // Optionally, you could load the duplicate run immediately
    } catch (error) {
      console.error('Duplicate failed:', error);
      alert('Failed to duplicate pricing run. Please try again.');
    }
  };

  const handleCreateQuote = () => {
    if (!results) return;

    // Navigate to quotes page with pre-filled data
    // This would require integration with your quotes system
    alert(
      'Create Quote functionality would integrate with your quotes system. ' +
        `Ready to create quote for ${results.items.length} items.`
    );
    // Example: navigate('/quotes/new', { state: { pricingResults: results } })
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-8 w-8" />
            Pricing / Cost Module
          </h1>
          {USE_MOCK_API && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-300"
            >
              🧪 Mock Mode
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-1">
          Upload product data, configure pricing parameters, and calculate
          landed costs
        </p>
        {USE_MOCK_API && (
          <p className="text-xs text-blue-600 mt-1">
            Using mock data for testing. Backend endpoints not yet available.
          </p>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="upload">Upload & Map</TabsTrigger>
          <TabsTrigger value="config" disabled={!importId}>
            Configuration
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!results}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <UploadMapSection onImportComplete={handleImportComplete} />
          {uploadedItems.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-900 font-medium">
                ✓ {uploadedItems.length} items uploaded successfully
              </div>
              <div className="text-green-700 text-sm mt-1">
                Click "Configuration" tab to continue
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <ConfigurationSection
            onCalculate={handleCalculate}
            isCalculating={isCalculating}
            disabled={!importId}
          />
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <ResultsTable
            results={results}
            isLoading={isCalculating}
            onExport={handleExport}
            onSave={handleSave}
            onDuplicate={handleDuplicate}
            onCreateQuote={handleCreateQuote}
          />
        </TabsContent>
      </Tabs>

      {/* Smoke Test Instructions (Development Only) */}
      {(import.meta as any).env?.DEV && uploadedItems.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">🧪 Smoke Test</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              After upload, verify that SKU <strong>FNV-1001</strong> appears
              with computed values:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>CIF value (Base + Freight + Insurance)</li>
              <li>Duty amount (based on HS code)</li>
              <li>VAT/Tax amount</li>
              <li>Landed Cost (sum of all costs)</li>
              <li>Sell Price (based on margin/markup mode)</li>
            </ul>
            <p className="mt-2">
              Toggle margin mode (Margin ↔ Markup) and verify Sell price updates
              consistently.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
