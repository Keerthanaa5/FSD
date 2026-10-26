// Clean empty initial data (Zero dummy records)
export const INITIAL_COMPANY = {
  name: "My Business",
  tagline: "Billing & Invoicing",
  gstin: "",
  pan: "",
  email: "contact@mybusiness.com",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  bankName: "",
  accountNo: "",
  ifscCode: "",
  branch: "",
  upiId: "",
  invoicePrefix: "INV-",
  defaultTaxRate: 18,
  terms: "1. Goods once sold will not be taken back.\n2. Payment due within specified due date.\n3. Subject to local jurisdiction only."
};

export const INITIAL_CUSTOMERS = [];

export const INITIAL_PRODUCTS = [];

export const INITIAL_INVOICES = [];

export const MONTHLY_REVENUE_DATA = [
  { month: "Jan", revenue: 0, paid: 0, pending: 0 },
  { month: "Feb", revenue: 0, paid: 0, pending: 0 },
  { month: "Mar", revenue: 0, paid: 0, pending: 0 },
  { month: "Apr", revenue: 0, paid: 0, pending: 0 },
  { month: "May", revenue: 0, paid: 0, pending: 0 },
  { month: "Jun", revenue: 0, paid: 0, pending: 0 }
];
