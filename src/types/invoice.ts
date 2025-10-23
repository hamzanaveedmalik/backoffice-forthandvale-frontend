export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  company?: string;
  taxId?: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: Customer;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes?: string;
  terms?: string;
  paymentTerms?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'bank_transfer' | 'credit_card' | 'check' | 'cash' | 'other';
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface BillingStats {
  totalRevenue: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  draftAmount: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  draftInvoices: number;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

export interface CreateInvoiceRequest {
  customerId: string;
  items: Omit<InvoiceItem, 'id' | 'total'>[];
  issueDate: string;
  dueDate: string;
  taxRate: number;
  discountAmount?: number;
  notes?: string;
  terms?: string;
  paymentTerms?: string;
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  id: string;
  status?: InvoiceStatus;
}

export interface PaymentRequest {
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: Payment['paymentMethod'];
  reference?: string;
  notes?: string;
}
