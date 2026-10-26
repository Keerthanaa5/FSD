

**BILLFLOW** is an enterprise-grade Billing and Invoice Management web application designed for modern businesses, retail stores, and service providers. It delivers a complete end-to-end financial billing workflow with GST compliance, real-time calculation engines, printable tax invoices, payment settlement tracking, and business analytics.



The application runs locally using Vite & React:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## 🌟 Key Features & Workflow

### 1. 🔐 Authentication & Session
- **Brand:** BILLFLOW — *Smart Billing & Invoice Management*
- **Split-Screen SaaS Layout** with enterprise feature highlights and bank-grade security badges.
- **1-Click Quick Demo Login** for **Admin** and **Billing Staff** roles.
- Remember Me and Password Reset modal.

### 2. 📊 Executive Dashboard
- **Greeting:** *"Good morning, Admin 👋 — Here's what's happening with your business today."*
- **4 Key Financial Metric Cards:**
  - **Total Revenue:** ₹2,48,500 (+12.5%)
  - **Total Invoices:** 128 (+8.2%)
  - **Paid Invoices:** ₹1,92,300 (92 invoices)
  - **Pending / Overdue:** ₹56,200 (36 invoices)
- **Monthly Revenue Chart:** Interactive Recharts area chart with Billed vs Collected trends.
- **Invoice Status Donut:** Visual breakdown of Paid, Pending, and Overdue receivables.
- **Recent Invoices Table:** Quick status badges and 1-click preview.

### 3. 👥 Customer Management
- Manage client databases with full GSTIN, addresses, and contact info.
- **Customer Metrics:** Total Billed, Total Paid, and Outstanding balances.
- **Customer Details Modal:** Detailed customer breakdown with invoice history and 1-click "Create Invoice for this Customer".
- **Add Customer Modal:** GSTIN format validation, address, and contact fields.

### 4. 📦 Products & Services Catalog
- Catalog items with HSN/SAC codes, categorized by Electronics, Accessories, Services, and Hardware.
- Real-time tax rates (0%, 5%, 12%, 18%, 28% GST).
- Add & Edit Product Modals with unit measurements (Unit, Pcs, Year).

### 5. ✍️ Create Invoice (Dynamic Calculation Engine)
- **Invoice Metadata:** Auto-incrementing Invoice # (e.g. `INV-0129`), Issue Date, and Due Date.
- **Customer Auto-fill:** Dropdown with quick-select and automatic address/GSTIN binding.
- **Interactive Line Items:**
  - Add/remove items dynamically.
  - Dropdown product selection with instant price & GST auto-population.
  - Custom line items supported.
- **Real-Time Tax Calculation:**
  - **Subtotal:** Sum of items (e.g. ₹52,000)
  - **Discount:** Flat ₹ or % discount (e.g. ₹2,000)
  - **Taxable Amount:** ₹50,000
  - **GST Breakdown:** Automatically splits into CGST 9% (₹4,500) + SGST 9% (₹4,500) for intrastate or IGST 18% (₹9,000) for interstate.
  - **Grand Total:** ₹59,000 with INR Number-to-Words translation (*"Fifty-Nine Thousand Rupees Only"*).
- **Payment Status:** Default Pending, Paid, or Partial.

### 6. 📄 Tax Invoice Preview & Print
- Professional, corporate A4-styled **Tax Invoice**.
- Includes Company details (ABC Electronics), Buyer details (Rahul Traders), HSN codes, Tax breakups, Bank NEFT details, and UPI QR code simulation.
- **Actions:**
  - **Download PDF**
  - **Print Invoice** (optimized `@media print` CSS)
  - **Send Invoice via Email** modal
  - **Mark as Paid** direct action

### 7. 💳 Payments & Receivables Tracking
- **Summary Cards:** Total Receivable (₹56,200), Paid This Month (₹1,92,300), Pending (₹38,500), Overdue (₹17,700).
- **"MARK AS PAID" Interaction:**
  - Interactive payment confirmation modal with payment channel selection (NEFT, UPI, Cheque, Cash).
  - Triggers **confetti celebration**.
  - **Instantly synchronizes Dashboard statistics, customer balances, and invoice history!**

### 8. 📈 Financial Reports & Analytics
- Monthly sales trends, realization ratios, and tax collections.
- **Top Customers by Revenue** ranking with progress bars.
- **Export to CSV** function for accounting & audits.

### 9. ⚙️ Settings & Company Profile
- Configure Business Legal Name, GSTIN, PAN, Address, Bank details, and UPI ID.
- Default terms & conditions.
- **Reset Demo Data** button to quickly restore baseline prototype state during review demonstrations.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Tailwind CSS v3, Lucide React Icons
- **Charts & Visualizations:** Recharts
- **Effects:** Canvas-Confetti
- **State Management:** React Context API with LocalStorage sync
- **Tooling:** Vite
