> **Purpose:** This document serves as the absolute **Single Source of Truth (SSOT)** for this project. Feed this context into any AI assistant to ensure code generation, architecture advice, and features align strictly with system requirements without hallucinations.
> 

---

## 1. Problem Statement

Field sales operations in developing markets like Bangladesh face significant operational friction:

- **Time Waste:** Sales Representatives (SRs) and Delivery Sales Representatives (DSRs) spend 2+ hours every evening (often after returning at 10:00 PM) doing manual calculations.
- **Network Instability:** Field staff work in areas (e.g., tin-roof shops, remote markets) with poor or zero 3G/4G connectivity.
- **Financial Discrepancies:** Manual ledger recording leads to uncounted stock, untracked damaged goods, unpaid balances, and disputed daily cash collections.
- **Data Duplication:** Redundant reporting across separate mobile apps creates technical debt and inconsistent database records.

---

## 2. Core Solution & Technical Constraints

- **Unified App Architecture:** A **single cross-platform app** built with **React SPA**, wrapped natively via **Capacitor**, using **Role-Based Access Control (RBAC)** to serve SRs, Managers, and DSRs.
- **Local-First Architecture:** Embedded **SQLite** database via **Drizzle ORM**. All operations are written locally first and queued in a `sync_queue` table to push asynchronously when internet connection is available.
- **Normalized Database (Zero Duplication):** Strictly normalized relational database design to maintain a single source of truth for items, orders, deliveries, and cash metrics.

---

## 3. User Roles & Workflows

### Role 1: Sales Representative (SR)

1. **Shop Registration:** Adds new shops with owner name, photo URL, phone number, and address.
2. **Order Creation:** Selects products, enters ordered quantities, and generates an order summary offline.

### Role 2: Inventory Manager

1. **Stock Review & Approval:** Reviews SR orders against actual warehouse stock.
2. **Quantity Adjustment:** If stock is lower than requested (e.g., requested 300 packs, stock has 250), adjusts the approved quantity.
3. **Market Allocation:** Re-calculates expected market monetary value based on approved stock.

### Role 3: Delivery Sales Representative (DSR)

1. **Order Delivery:** Takes approved products to market for shop distribution.
2. **Field Adjustments:**
    - **Rejections:** Logs shop rejections (full or partial).
    - **Damages:** Logs damaged items with loss values (e.g., expected $1,500, but collected $1,300 due to $200 damaged products).
3. **Daily Settlement & Day Closing:**
    - Logs operational expenses (meals, transport, fuel, unexpected costs).
    - Views daily summary (Expected Cash vs. Actual Cash).
    - Triggers "Complete Day" to lock session and hand over physical cash to the dealer.

---

## 4. Single Source of Truth Database Schema

### Table Index & Descriptions

| Table Name | Entity Purpose | Key Relationships |
| --- | --- | --- |
| `shops` | Stores shop profile data | Foreign Key to `users.id` (SR) |
| `categories` | Product categorization | Referenced by `products` |
| `products` | Item master, price, & stock | Referenced by `order_items`, `delivery_item_issues` |
| `orders` | SR order header | Foreign Keys to `shops`, `users` (SR) |
| `order_items` | Products attached to order | Foreign Keys to `orders`, `products` |
| `order_item_approvals` | Manager stock adjustments | Foreign Keys to `order_items`, `users` (Manager) |
| `deliveries` | DSR delivery status | Foreign Keys to `orders`, `users` (DSR), `dsr_daily_sessions` |
| `delivery_item_issues` | Damaged or rejected items | Foreign Keys to `deliveries`, `products` |
| `dsr_daily_sessions` | Day closing & cash records | Foreign Keys to `users` (DSR), `users` (Dealer) |
| `operational_expenses` | Daily DSR expenses | Foreign Key to `dsr_daily_sessions` |
| `sync_queue` | Local SQLite offline sync queue | Client-side engine |

---

### SQL DDL Specifications

```sql
-----------------------------------------------------------------------
-- 1. BETTER AUTH REQUIRED CORE TABLES
-----------------------------------------------------------------------
CREATE TABLE user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    image TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMP NOT NULL,
    token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE account (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at TIMESTAMP,
    refresh_token_expires_at TIMESTAMP,
    scope TEXT,
    password TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-----------------------------------------------------------------------
-- 2. BETTER AUTH ORGANIZATION PLUGIN TABLES (Your Multi-Tenancy Core)
-----------------------------------------------------------------------
-- Maps 1:1 to a "Dealer Company"
CREATE TABLE organization (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT -- Can store dealer specific configs like local BDT currency formatting
);

-- Handles the Dealer staff (Managers, SRs, DSRs) and their roles
CREATE TABLE member (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'admin' (Dealer), 'manager', 'sr', 'dsr'
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Handles invitations sent by the Dealer
CREATE TABLE invitation (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL, -- Role the user will get upon accepting
    status TEXT NOT NULL, -- 'pending', 'accepted', 'rejected', 'canceled'
    expires_at TIMESTAMP NOT NULL,
    inviter_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
);

-----------------------------------------------------------------------
-- 3. YOUR BUSINESS LOGIC TABLES (Fully Isolated Multi-Tenant)
-----------------------------------------------------------------------
CREATE TABLE shops (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE, -- Moat isolation
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    owner_photo_url TEXT,
    address TEXT NOT NULL,
    phone TEXT,
    created_by_sr_id TEXT NOT NULL REFERENCES user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE, -- Moat isolation
    name TEXT NOT NULL
);

CREATE TABLE products (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE, -- Moat isolation
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    image_url TEXT,
    unit_price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0
);

CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE, -- Moat isolation
    shop_id TEXT REFERENCES shops(id) ON DELETE CASCADE,
    sr_id TEXT REFERENCES user(id),
    status TEXT CHECK(status IN ('pending', 'approved', 'delivering', 'completed', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    ordered_quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE order_item_approvals (
    id TEXT PRIMARY KEY,
    order_item_id TEXT REFERENCES order_items(id) ON DELETE CASCADE,
    approved_quantity INT NOT NULL,
    manager_id TEXT REFERENCES user(id),
    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dsr_daily_sessions (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE, -- Moat isolation
    dsr_id TEXT REFERENCES user(id),
    date DATE NOT NULL,
    total_expected_cash DECIMAL(10,2) DEFAULT 0.00,
    total_collected_cash DECIMAL(10,2) DEFAULT 0.00,
    total_expenses DECIMAL(10,2) DEFAULT 0.00,
    handover_cash DECIMAL(10,2) DEFAULT 0.00,
    is_completed BOOLEAN DEFAULT FALSE,
    verified_by_dealer_id TEXT REFERENCES user(id)
);

CREATE TABLE deliveries (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    dsr_id TEXT REFERENCES user(id),
    session_id TEXT REFERENCES dsr_daily_sessions(id) ON DELETE CASCADE,
    delivery_status TEXT CHECK(delivery_status IN ('delivered', 'partially_delivered', 'rejected')),
    expected_amount DECIMAL(10,2) NOT NULL,
    collected_amount DECIMAL(10,2) NOT NULL,
    delivered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delivery_item_issues (
    id TEXT PRIMARY KEY,
    delivery_id TEXT REFERENCES deliveries(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    issue_type TEXT CHECK(issue_type IN ('damaged', 'shop_rejected')),
    quantity INT NOT NULL,
    loss_amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE operational_expenses (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES dsr_daily_sessions(id) ON DELETE CASCADE,
    expense_type TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    note TEXT,
    receipt_photo_url TEXT
);

-----------------------------------------------------------------------
-- 4. SYNC QUEUE (Local Native Engine Only)
-----------------------------------------------------------------------
CREATE TABLE sync_queue (
    id TEXT PRIMARY KEY,
    action_type TEXT NOT NULL, -- e.g., 'CREATE_ORDER', 'UPDATE_DELIVERY'
    payload TEXT NOT NULL,       -- JSON format payload stringified
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_synced BOOLEAN DEFAULT FALSE,
    synced_at TIMESTAMP NULL     -- Useful for time tracing conflicts
);

```