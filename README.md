# StoreFMS — Store & Facility Management System

A comprehensive **procurement and inventory management system** built with React, TypeScript, and Vite. StoreFMS manages the complete purchase lifecycle — from indent (requisition) creation through purchase order generation, item receipt, and store-out (issuance) to departments — using **Google Sheets as its backend**.

---

## Features

### Procurement Workflow
1. **Create Indent** — Raise requisitions for multiple products with department, category, quantity, UOM, area of use, and attachments.
2. **Approve Indent** — Managers classify indents as Regular (single vendor), Three Party (competitive bidding), or Reject.
3. **Vendor Rate Update** — Assign vendors, rates, and payment terms for regular indents.
4. **Three Party Approval** — Compare three vendor quotes and select the winning vendor.
5. **Create Purchase Order** — Generate formal PO PDFs with company details, supplier info, line items, GST, discount, terms, and signatures.
6. **PO History** — Full audit trail of all purchase orders with status tracking (Revised / Not Received / Received).

### Inventory & Receiving
7. **Receive Items** — Log received goods: quantity, product photos, warranty status, bill details, transporter info.
8. **Store Out Approval** — Approve issuance of items from stock to requesting departments.
9. **Inventory Management** — Track stock levels with computed status indicators (Out of Stock, Low Stock, In Stock, Excess).

### Admin & Analytics
10. **Dashboard** — Analytics with date/vendor/product filters, KPI cards, top products/vendors charts, and stock alerts.
11. **Administration** — Full user management with granular permission control (16+ permission keys).

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 18 + TypeScript + Vite |
| **Routing** | react-router-dom v7 |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Icons** | Lucide React, Ant Design Icons |
| **Forms** | react-hook-form + Zod validation |
| **Tables** | TanStack Table v8 |
| **Charts** | Recharts |
| **PDF** | @react-pdf/renderer |
| **Notifications** | Sonner (toast) |
| **Loading** | react-spinners |
| **Backend** | Google Sheets via Google Apps Script API |
| **File Storage** | Google Drive |
| **Deploy** | Vercel |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

```env
VITE_APP_SCRIPT_URL=           # Google Apps Script API endpoint
VITE_IDENT_ATTACHMENT_FOLDER=  # Google Drive folder for indent attachments
VITE_COMPARISON_SHEET_FOLDER=  # Google Drive folder for vendor comparison sheets
VITE_PURCHASE_ORDERS_FOLDER=   # Google Drive folder for PO PDFs
VITE_BILL_PHOTO_FOLDER=        # Google Drive folder for bill photos
VITE_PRODUCT_PHOTO_FOLDER=     # Google Drive folder for product photos
```

---

## Project Structure

```
src/
├── components/
│   ├── element/          # Custom app-specific components (DataTable, Heading, Sidebar, POPdf, Logo)
│   └── ui/               # shadcn/ui component library
├── views/                # Page-level view components (Dashboard, Login, CreateIndent, etc.)
├── context/
│   ├── AuthContext.tsx   # Authentication & session management
│   └── SheetsContext.tsx # Google Sheets data fetching & caching
├── lib/
│   ├── fetchers.ts       # API layer for Google Sheets & Drive uploads
│   ├── filter.ts         # Analytics & data analysis utilities
│   └── utils.ts          # Helper functions (formatDate, calculateTotal, etc.)
├── types/
│   ├── sheets.ts         # Data model types (IndentSheet, PoMasterSheet, etc.)
│   ├── indentForm.ts     # Form schema types
│   └── routes.ts         # Route definition types
├── hooks/                # Custom React hooks
├── App.tsx               # Main app layout with sidebar and routing
└── main.tsx              # Entry point with route definitions
```

---

## Google Sheets Integration

StoreFMS uses Google Sheets as its database. The following sheets are utilized:

| Sheet Name | Purpose |
|---|---|
| `INDENT` | Core procurement workflow data (60+ fields tracking all stages) |
| `RECEIVED` | Item receipt records with photos and warranty info |
| `PO MASTER` | Purchase order records with PDF URLs |
| `INVENTORY` | Stock level tracking and status |
| `USER` | User accounts and permissions |
| `MASTER` | Master configuration (vendors, departments, categories, company details) |

Data is fetched and updated via a Google Apps Script web app endpoint (`VITE_APP_SCRIPT_URL`). Files (attachments, photos, PDFs) are uploaded to Google Drive.

---

## User Permissions

The system supports granular role-based access control:

| Permission Key | Description |
|---|---|
| `administrate` | User management and permission control |
| `createIndent` | Create new indents/requisitions |
| `createPo` | Create/revise purchase orders |
| `indentApprovalView` / `indentApprovalAction` | View / Action on indent approvals |
| `updateVendorView` / `updateVendorAction` | View / Action on vendor rate updates |
| `threePartyApprovalView` / `threePartyApprovalAction` | View / Action on 3-party approvals |
| `receiveItemView` / `receiveItemAction` | View / Action on item receiving |
| `storeOutApprovalView` / `storeOutApprovalAction` | View / Action on store-out approvals |
| `pendingIndentsView` | View pending purchase orders |
| `ordersView` | View PO history |
| `poMaster` | Access PO Master sheet |

---

## License

Private — Proprietary
