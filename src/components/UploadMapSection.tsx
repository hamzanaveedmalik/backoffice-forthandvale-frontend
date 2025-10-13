import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  PricingItem,
  ColumnMapping,
  ValidationError,
  ImportResponse,
} from '@/types/pricing';
import { createImport, uploadImportItems } from '@/api/pricing';
import { USE_MOCK_API } from '@/api/pricing.mock';
import { usePricingBackend } from '@/api/pricing.adapter';

interface UploadMapSectionProps {
  onImportComplete: (importId: string, items: PricingItem[]) => void;
}

const REQUIRED_FIELDS = [
  { key: 'sku', label: 'SKU' },
  { key: 'productName', label: 'Product Name' },
  { key: 'hsCode', label: 'HS Code' },
  { key: 'purchasePricePKR', label: 'Purchase Price (PKR)' },
  { key: 'unitsPerOrder', label: 'Units Per Order' },
  { key: 'weightKg', label: 'Weight (kg)' },
  { key: 'volumeM3', label: 'Volume (m³)' },
];

export default function UploadMapSection({
  onImportComplete,
}: UploadMapSectionProps) {
  const backendAdapter = usePricingBackend('default'); // Use default org like ExcelUpload

  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [rawData, setRawData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadSuccess(false);
    setValidationErrors([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
      }) as any[][];

      if (jsonData.length > 0) {
        const headerRow = jsonData[0] as string[];
        setHeaders(headerRow);
        setRawData(jsonData.slice(1));

        // Try to auto-map columns
        const autoMapping: ColumnMapping = {};
        REQUIRED_FIELDS.forEach((field) => {
          const matchingHeader = headerRow.find(
            (h) =>
              h.toLowerCase().replace(/\s+/g, '') === field.key.toLowerCase()
          );
          if (matchingHeader) {
            autoMapping[field.key as keyof ColumnMapping] = matchingHeader;
          }
        });
        setMapping(autoMapping);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleMappingChange = (fieldKey: string, headerValue: string) => {
    setMapping((prev) => ({
      ...prev,
      [fieldKey]: headerValue === 'none' ? undefined : headerValue,
    }));
  };

  const validateAndPrepareItems = (): PricingItem[] | null => {
    const errors: ValidationError[] = [];
    const items: PricingItem[] = [];

    rawData.forEach((row, index) => {
      const rowData: any = {};
      headers.forEach((header, colIndex) => {
        rowData[header] = row[colIndex];
      });

      const item: any = {};
      let hasError = false;

      REQUIRED_FIELDS.forEach((field) => {
        const mappedHeader = mapping[field.key as keyof ColumnMapping];
        const value = mappedHeader ? rowData[mappedHeader] : undefined;

        if (!value && value !== 0) {
          errors.push({
            row: index + 2,
            sku: rowData[mapping.sku || ''] || `Row ${index + 2}`,
            field: field.label,
            message: `Missing ${field.label}`,
          });
          hasError = true;
          return;
        }

        // Validate numeric fields
        if (
          [
            'purchasePricePKR',
            'unitsPerOrder',
            'weightKg',
            'volumeM3',
          ].includes(field.key)
        ) {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            errors.push({
              row: index + 2,
              sku: rowData[mapping.sku || ''] || `Row ${index + 2}`,
              field: field.label,
              message: `Invalid numeric value: ${value}`,
            });
            hasError = true;
            return;
          }
          item[field.key] = numValue;
        } else {
          item[field.key] = String(value);
        }
      });

      // Validate HS Code format (basic check)
      if (item.hsCode && !/^\d{4,10}$/.test(item.hsCode.replace(/\./g, ''))) {
        errors.push({
          row: index + 2,
          sku: item.sku || `Row ${index + 2}`,
          field: 'HS Code',
          message: `Invalid HS Code format: ${item.hsCode}`,
        });
      }

      if (!hasError) {
        items.push(item as PricingItem);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0 ? items : null;
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      if (USE_MOCK_API) {
        // Mock mode: Parse Excel and send items
        const items = validateAndPrepareItems();
        if (!items) {
          setIsUploading(false);
          return;
        }

        const { importId } = await createImport('default');
        const response: ImportResponse = await uploadImportItems(
          importId,
          items
        );

        if (response.validationErrors && response.validationErrors.length > 0) {
          setValidationErrors(response.validationErrors);
        } else {
          setUploadSuccess(true);
          onImportComplete(importId, items);
        }
      } else {
        // Real backend: Send raw Excel file
        const result = await backendAdapter.uploadFile(file, file.name);

        // For real backend, we need to parse to show items count
        // But backend has already validated and stored the data
        const items = validateAndPrepareItems();

        setUploadSuccess(true);
        onImportComplete(result.importId, items || []);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setValidationErrors([
        {
          row: 0,
          sku: '',
          field: 'Upload',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to upload items. Please try again.',
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  const isMappingComplete = REQUIRED_FIELDS.every(
    (field) => mapping[field.key as keyof ColumnMapping]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload & Map Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Excel or CSV File</Label>
          <div className="flex gap-2">
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {file ? 'Change File' : 'Select File'}
            </Button>
            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileSpreadsheet className="h-4 w-4" />
                {file.name}
              </div>
            )}
          </div>
        </div>

        {/* Column Mapping */}
        {headers.length > 0 && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-4">
                Map Columns to Fields
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REQUIRED_FIELDS.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={`map-${field.key}`}>
                      {field.label} <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={
                        mapping[field.key as keyof ColumnMapping] || 'none'
                      }
                      onValueChange={(value) =>
                        handleMappingChange(field.key, value)
                      }
                    >
                      <SelectTrigger id={`map-${field.key}`}>
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          -- Select Column --
                        </SelectItem>
                        {headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-2">
                Preview ({rawData.length} rows)
              </h3>
              <div className="text-xs text-muted-foreground">
                First 3 rows will be validated
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!isMappingComplete || isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  'Uploading...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Validate & Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <div className="ml-2">
              <strong>Success!</strong> {rawData.length} items uploaded
              successfully.
            </div>
          </Alert>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert className="bg-red-50 text-red-900 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <div className="ml-2">
              <strong>Validation Errors ({validationErrors.length})</strong>
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {validationErrors.slice(0, 10).map((error, index) => (
                  <div key={index} className="text-sm">
                    Row {error.row}, {error.sku}: {error.field} -{' '}
                    {error.message}
                  </div>
                ))}
                {validationErrors.length > 10 && (
                  <div className="text-sm font-medium">
                    ...and {validationErrors.length - 10} more errors
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
