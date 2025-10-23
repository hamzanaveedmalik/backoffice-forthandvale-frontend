import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Calendar,
  ArrowLeft,
  MoreHorizontal,
  X,
  Save,
  FileDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

// Invoice interface
interface Invoice {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  issueDate: string;
  items: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  subtotal: number;
  subtotalAfterDiscount: number;
  taxAmount: number;
}

const statusColors = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
  draft: 'bg-gray-100 text-gray-800',
};

const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    taxRate: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    notes: '',
    terms: 'Payment due within 30 days of invoice date.',
  });

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );
  const paidAmount = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = invoices
    .filter((inv) => inv.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  // Calculate invoice totals
  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateSubtotal = () => {
    return invoiceForm.items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    if (invoiceForm.discountType === 'percentage') {
      return (subtotal * invoiceForm.discountValue) / 100;
    } else {
      return Math.min(invoiceForm.discountValue, subtotal); // Don't allow discount > subtotal
    }
  };

  const calculateSubtotalAfterDiscount = () => {
    return calculateSubtotal() - calculateDiscountAmount();
  };

  const calculateTaxAmount = () => {
    return (calculateSubtotalAfterDiscount() * invoiceForm.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotalAfterDiscount() + calculateTaxAmount();
  };

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setInvoiceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...invoiceForm.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = calculateItemTotal(
        field === 'quantity' ? value : newItems[index].quantity,
        field === 'unitPrice' ? value : newItems[index].unitPrice
      );
    }

    setInvoiceForm((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoiceForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: '', quantity: 1, unitPrice: 0, total: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (invoiceForm.items.length > 1) {
      setInvoiceForm((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const invoiceData = {
      ...invoiceForm,
      subtotal: calculateSubtotal(),
      discountAmount: calculateDiscountAmount(),
      subtotalAfterDiscount: calculateSubtotalAfterDiscount(),
      taxAmount: calculateTaxAmount(),
      total: calculateTotal(),
      invoiceNumber: `INV-${Date.now()}`,
    };

    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const primaryColor = [147, 51, 234] as const; // Purple color
    const textColor = [31, 41, 55] as const; // Gray-800
    const lightGray = [156, 163, 175] as const; // Gray-400

    // Simple Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FORTH & VALE', 20, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('EST. 2025', 20, 28);
    doc.text('Lahore, Punjab, Pakistan', 20, 35);
    doc.text('+92 300 1234567', 20, 42);

    // Invoice details
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 60, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, pageWidth - 60, 28);
    doc.text(`Date: ${invoiceData.issueDate}`, pageWidth - 60, 35);
    doc.text(`Due: ${invoiceData.dueDate || 'N/A'}`, pageWidth - 60, 42);

    // Bill To section
    let yPosition = 70;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Bill To:', 20, yPosition);

    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.customerName, 20, yPosition);
    yPosition += 8;
    doc.text(invoiceData.customerEmail, 20, yPosition);
    if (invoiceData.customerPhone) {
      yPosition += 8;
      doc.text(invoiceData.customerPhone, 20, yPosition);
    }
    if (invoiceData.customerAddress) {
      yPosition += 8;
      doc.text(invoiceData.customerAddress, 20, yPosition);
    }

    // Simple Items table
    yPosition = Math.max(yPosition + 20, 120);

    // Table header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(20, yPosition - 8, pageWidth - 40, 12, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, yPosition);
    doc.text('Qty', pageWidth - 120, yPosition);
    doc.text('Unit Price', pageWidth - 90, yPosition);
    doc.text('Total', pageWidth - 50, yPosition);

    // Table rows
    yPosition += 15;
    invoiceData.items.forEach((item, index) => {
      if (yPosition > pageHeight - 80) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      // Item description (with word wrapping)
      const description = item.description || `Item ${index + 1}`;
      const maxWidth = pageWidth - 150;
      const splitDescription = doc.splitTextToSize(description, maxWidth);
      doc.text(splitDescription, 25, yPosition);

      // Quantity, unit price, and total
      doc.text(item.quantity.toString(), pageWidth - 120, yPosition);
      doc.text(`$${item.unitPrice.toFixed(2)}`, pageWidth - 90, yPosition);
      doc.text(`$${item.total.toFixed(2)}`, pageWidth - 50, yPosition);

      yPosition += Math.max(splitDescription.length * 4, 12);
    });

    // Simple Totals section
    yPosition += 20;
    const totalsX = pageWidth - 80;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    // Subtotal
    doc.text('Subtotal:', totalsX - 30, yPosition);
    doc.text(`$${(invoiceData.subtotal || 0).toFixed(2)}`, totalsX, yPosition);
    yPosition += 8;

    // Discount (if applicable)
    if (invoiceData.discountValue > 0) {
      doc.setTextColor(34, 197, 94); // Green-500
      doc.text(
        `Discount (${
          invoiceData.discountType === 'percentage'
            ? `${invoiceData.discountValue}%`
            : 'Fixed'
        }):`,
        totalsX - 30,
        yPosition
      );
      doc.text(
        `-$${(invoiceData.discountAmount || 0).toFixed(2)}`,
        totalsX,
        yPosition
      );
      yPosition += 8;

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text('After discount:', totalsX - 30, yPosition);
      doc.text(
        `$${(invoiceData.subtotalAfterDiscount || 0).toFixed(2)}`,
        totalsX,
        yPosition
      );
      yPosition += 8;
    }

    // Tax
    doc.text(`Tax (${invoiceData.taxRate || 0}%):`, totalsX - 30, yPosition);
    doc.text(`$${(invoiceData.taxAmount || 0).toFixed(2)}`, totalsX, yPosition);
    yPosition += 8;

    // Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Total:', totalsX - 30, yPosition);
    doc.text(`$${(invoiceData.total || 0).toFixed(2)}`, totalsX, yPosition);

    // Notes and Terms
    yPosition += 20;
    if (invoiceData.notes) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Notes:', 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      const notes = doc.splitTextToSize(invoiceData.notes, pageWidth - 40);
      doc.text(notes, 20, yPosition);
      yPosition += notes.length * 4 + 10;
    }

    if (invoiceData.terms) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Payment Terms:', 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      const terms = doc.splitTextToSize(invoiceData.terms, pageWidth - 40);
      doc.text(terms, 20, yPosition);
    }

    // Footer
    const footerY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('Thank you for your business!', 20, footerY);
    doc.text('Powered by Intelliwave.co', pageWidth - 60, footerY);

    // Save the PDF
    doc.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
  };

  // Save invoice
  const saveInvoice = () => {
    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      customer: invoiceForm.customerName,
      email: invoiceForm.customerEmail,
      amount: calculateTotal(),
      status: 'draft' as const,
      dueDate: invoiceForm.dueDate,
      issueDate: invoiceForm.issueDate,
      items: invoiceForm.items.length,
      discountType: invoiceForm.discountType,
      discountValue: invoiceForm.discountValue,
      discountAmount: calculateDiscountAmount(),
      subtotal: calculateSubtotal(),
      subtotalAfterDiscount: calculateSubtotalAfterDiscount(),
      taxAmount: calculateTaxAmount(),
    };

    setInvoices((prev) => [...prev, newInvoice]);
    setShowCreateForm(false);
    setInvoiceForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
      taxRate: 0,
      discountType: 'percentage',
      discountValue: 0,
      notes: '',
      terms: 'Payment due within 30 days of invoice date.',
    });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Billing & Invoices
            </h1>
            <p className="text-muted-foreground">
              Manage invoices, payments, and customer billing.
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${paidAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter((inv) => inv.status === 'paid').length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${pendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter((inv) => inv.status === 'pending').length}{' '}
              invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${overdueAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter((inv) => inv.status === 'overdue').length}{' '}
              invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
          <CardDescription>Search and filter your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Invoices</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by customer or invoice ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="status">Filter by Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
          <CardDescription>
            Manage your customer invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No invoices found
              </h3>
              <p className="text-gray-500 mb-4">
                {invoices.length === 0
                  ? "You haven't created any invoices yet. Get started by creating your first invoice."
                  : 'No invoices match your current search or filter criteria.'}
              </p>
              {invoices.length === 0 && (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Invoice
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">
                      Invoice ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Items</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{invoice.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{invoice.customer}</div>
                          <div className="text-sm text-muted-foreground">
                            {invoice.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            statusColors[
                              invoice.status as keyof typeof statusColors
                            ]
                          }
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{invoice.dueDate}</td>
                      <td className="py-3 px-4">{invoice.items}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Invoice Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Create New Invoice</CardTitle>
                <CardDescription>
                  Fill in the details to create a new invoice
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={invoiceForm.customerName}
                      onChange={(e) =>
                        handleFormChange('customerName', e.target.value)
                      }
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={invoiceForm.customerEmail}
                      onChange={(e) =>
                        handleFormChange('customerEmail', e.target.value)
                      }
                      placeholder="customer@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone</Label>
                    <Input
                      id="customerPhone"
                      value={invoiceForm.customerPhone}
                      onChange={(e) =>
                        handleFormChange('customerPhone', e.target.value)
                      }
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerAddress">Address</Label>
                    <Input
                      id="customerAddress"
                      value={invoiceForm.customerAddress}
                      onChange={(e) =>
                        handleFormChange('customerAddress', e.target.value)
                      }
                      placeholder="123 Main Street, Lahore, Punjab 54000, Pakistan"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issueDate">Issue Date *</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={invoiceForm.issueDate}
                      onChange={(e) =>
                        handleFormChange('issueDate', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceForm.dueDate}
                      onChange={(e) =>
                        handleFormChange('dueDate', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <Button onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {invoiceForm.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 items-end"
                    >
                      <div className="col-span-5">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              'description',
                              e.target.value
                            )
                          }
                          placeholder="Item description"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Qty</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              'quantity',
                              parseInt(e.target.value) || 1
                            )
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              'unitPrice',
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Total</Label>
                        <Input
                          value={`$${item.total.toFixed(2)}`}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="col-span-1">
                        {invoiceForm.items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Discount</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discountType">Discount Type</Label>
                    <select
                      id="discountType"
                      value={invoiceForm.discountType}
                      onChange={(e) =>
                        handleFormChange('discountType', e.target.value)
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="discountValue">
                      Discount Value
                      {invoiceForm.discountType === 'percentage'
                        ? ' (%)'
                        : ' ($)'}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      step={
                        invoiceForm.discountType === 'percentage'
                          ? '0.01'
                          : '0.01'
                      }
                      min="0"
                      max={
                        invoiceForm.discountType === 'percentage'
                          ? '100'
                          : undefined
                      }
                      value={invoiceForm.discountValue}
                      onChange={(e) =>
                        handleFormChange(
                          'discountValue',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder={
                        invoiceForm.discountType === 'percentage'
                          ? '10'
                          : '50.00'
                      }
                    />
                  </div>
                </div>
                {invoiceForm.discountValue > 0 && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-600">
                      Discount Amount: ${calculateDiscountAmount().toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* Tax and Totals */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tax & Totals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={invoiceForm.taxRate}
                      onChange={(e) =>
                        handleFormChange(
                          'taxRate',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    {invoiceForm.discountValue > 0 && (
                      <>
                        <div className="flex justify-between text-green-600">
                          <span>
                            Discount (
                            {invoiceForm.discountType === 'percentage'
                              ? `${invoiceForm.discountValue}%`
                              : 'Fixed'}
                            ):
                          </span>
                          <span>-${calculateDiscountAmount().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Subtotal after discount:</span>
                          <span>
                            ${calculateSubtotalAfterDiscount().toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span>Tax ({invoiceForm.taxRate}%):</span>
                      <span>${calculateTaxAmount().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                      id="notes"
                      value={invoiceForm.notes}
                      onChange={(e) =>
                        handleFormChange('notes', e.target.value)
                      }
                      placeholder="Additional notes for the customer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="terms">Payment Terms</Label>
                    <textarea
                      id="terms"
                      value={invoiceForm.terms}
                      onChange={(e) =>
                        handleFormChange('terms', e.target.value)
                      }
                      placeholder="Payment terms and conditions"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={generatePDF}
                  className="flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Generate PDF
                </Button>
                <Button
                  onClick={saveInvoice}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Billing;
