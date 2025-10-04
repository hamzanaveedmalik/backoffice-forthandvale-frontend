import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface UploadResult {
  success: boolean
  message: string
  results: {
    processed: number
    leadsCreated: number
    leadsUpdated: number
    actionsCreated: number
    priorityBreakdown: {
      URGENT?: number
      HIGH?: number
      MEDIUM?: number
      LOW?: number
    }
    errors: string[]
  }
}

interface ExcelUploadProps {
  onSuccess?: () => void
  orgId?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function ExcelUpload({ onSuccess, orgId = 'default' }: ExcelUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]
    if (!validTypes.includes(file.type) && 
        !file.name.endsWith('.xlsx') && 
        !file.name.endsWith('.xls')) {
      return 'Please upload a valid Excel file (.xlsx or .xls)'
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
    }

    return null
  }

  const handleUpload = async (file: File) => {
    setError(null)
    setResult(null)

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('orgId', orgId)

      const API_BASE_URL =
        (import.meta as any).env?.VITE_API_URL ||
        'https://backoffice-forthandvale-backend.vercel.app/api'

      const response = await fetch(`${API_BASE_URL}/leads/upload-excel`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult(data)
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
            setIsOpen(false)
            setResult(null)
          }, 3000)
        }
      } else {
        setError(data.message || 'Upload failed. Please try again.')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Network error. Please try again.'
      )
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const resetDialog = () => {
    setError(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <Button
        onClick={() => {
          resetDialog()
          setIsOpen(true)
        }}
        variant="outline"
        size="sm"
        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
      >
        <Upload className="h-4 w-4 mr-1" />
        Upload Excel
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              Upload Excel File
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload Area */}
            {!result && (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-400'
                } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                  id="excel-file-input"
                />

                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
                    <p className="text-sm font-medium text-gray-700">
                      Processing Excel file...
                    </p>
                    <p className="text-xs text-gray-500">
                      Creating leads and priority actions
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Drag and drop your Excel file here
                      </p>
                      <p className="text-xs text-gray-500 mb-3">or</p>
                      <Button
                        type="button"
                        onClick={() =>
                          document.getElementById('excel-file-input')?.click()
                        }
                        size="sm"
                      >
                        Browse Files
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported: .xlsx, .xls (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Result */}
            {result && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-1">
                        Upload Successful!
                      </h3>
                      <p className="text-sm text-green-700">
                        {result.message}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-xs text-gray-600 mb-1">
                          Leads Processed
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {result.results.processed}
                        </p>
                        <p className="text-xs text-green-600">
                          {result.results.leadsCreated} new,{' '}
                          {result.results.leadsUpdated} updated
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-xs text-gray-600 mb-1">
                          Actions Created
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {result.results.actionsCreated}
                        </p>
                        <p className="text-xs text-green-600">
                          Priority actions
                        </p>
                      </div>
                    </div>

                    {/* Priority Breakdown */}
                    {result.results.priorityBreakdown && (
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Priority Breakdown
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {result.results.priorityBreakdown.URGENT! > 0 && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                              🔥 {result.results.priorityBreakdown.URGENT} Urgent
                            </span>
                          )}
                          {result.results.priorityBreakdown.HIGH! > 0 && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                              ⚡ {result.results.priorityBreakdown.HIGH} High
                            </span>
                          )}
                          {result.results.priorityBreakdown.MEDIUM! > 0 && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                              📊 {result.results.priorityBreakdown.MEDIUM} Medium
                            </span>
                          )}
                          {result.results.priorityBreakdown.LOW! > 0 && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              📋 {result.results.priorityBreakdown.LOW} Low
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Errors */}
                    {result.results.errors.length > 0 && (
                      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <p className="text-xs font-semibold text-yellow-800 mb-2">
                          ⚠️ {result.results.errors.length} Warning(s)
                        </p>
                        <ul className="text-xs text-yellow-700 space-y-1">
                          {result.results.errors.slice(0, 3).map((err, idx) => (
                            <li key={idx}>• {err}</li>
                          ))}
                          {result.results.errors.length > 3 && (
                            <li>
                              • ... and {result.results.errors.length - 3} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-xs text-gray-600 text-center">
                      Page will refresh automatically...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Help Text */}
            {!result && !uploading && (
              <div className="text-xs text-gray-500 space-y-1">
                <p className="font-semibold">Expected Excel format:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Company</li>
                  <li>Website</li>
                  <li>Visitor Count (MW)</li>
                  <li>LinkedIn Company</li>
                  <li>Suggested Buyer Roles</li>
                  <li>Example Contacts (LinkedIn)</li>
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

