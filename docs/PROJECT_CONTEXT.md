# Project Context: Offline-First Field Sales Automation (FSA) App

## 1. Project Overview
- **Product Type:** B2B Field Sales & Distribution Management System (DMS)
- **Target Audience:** Sales Representatives (SR) and Delivery Sales Representatives (DSR) in FMCG/wholesale distribution.
- **Primary Platform:** Android Mobile App (built with Capacitor).
- **Core Architecture:** 100% Offline-First operation for field work, with cloud synchronization when internet connection is available.

---

## 2. Technical Stack
- **Frontend / Framework:** Astro + React
- **Mobile Runtime:** Capacitor (Android target)
- **Local Database (Offline):** SQLite (`@capacitor-community/sqlite` or local ORM driver)
- **Authentication:** Better Auth (using the Organization Plugin for multi-tenancy)
- **Backend / Remote DB:** Cloudflare Workers / D1 (or Node.js / PostgreSQL)
- **UI & Styling:** Tailwind CSS + Lucide Icons

---

## 3. User Workflows & Core Features

### A. Initial Setup (Online Phase)
- SR/DSR logs in using internet connection via Better Auth.
- Selects or assigns their active Organization (Distributor/Agency).
- Initial sync downloads product catalogs, shop lists, and active pricing.

### B. SR Workflow (Order Booking - Fully Offline)
1. **Product Selection:** SR browses products, views unit prices, and adds items with quantities to the cart.
2. **Cart & Notes:** SR reviews cart totals and adds notes/special instructions if applicable.
3. **Shop Selection / Instant Creation:**
   - Selects a pre-saved shop from the local SQLite database.
   - If the shop is not listed, SR can instantly create a new shop offline (assigned a temporary UUID).
4. **Order Confirmation:** SR confirms the order, saving it directly to local SQLite.
5. **Daily Summary & Reports:**
   - SR views today's taken orders inside the Order tab.
   - SR clicks a **Summary** button to calculate total market value and total item quantities.
   - **Receipt Printing:** SR generates and prints a summary PDF or connects via Bluetooth thermal printer to hand a report to the manager.

### C. DSR Workflow (Delivery & Cash Collection - Fully Offline)
1. DSR opens today's delivery queue.
2. DSR delivers products to shops and takes cash payments.
3. **Damages & Returns Handling:**
   - DSR inputs damaged products or shop returns directly in the app.
   - App automatically calculates damage costs, deducts them from the total payable amount, and updates the final net balance.
4. Updates order status (e.g., `Delivered`, `Partial Return`, `Paid`) and saves locally.

### D. Data Sync Workflow (Online Phase)
- App monitors network status using Capacitor Network API.
- When online, an offline sync queue sends newly created shops, orders, returns, and payment updates to the server.
- Temporary client UUIDs are mapped to permanent server IDs with conflict resolution strategy.

---

## 4. Key Data Entities (SQLite Schema Concepts)
- **`organizations`**: `id`, `name`, `created_at`
- **`users`**: `id`, `org_id`, `name`, `role` (`SR` | `DSR` | `Manager`)
- **`products`**: `id`, `org_id`, `name`, `price`, `stock_qty`, `unit`
- **`shops`**: `id` (UUID), `org_id`, `name`, `owner_name`, `phone`, `address`, `is_synced`
- **`orders`**: `id` (UUID), `org_id`, `sr_id`, `shop_id`, `total_amount`, `notes`, `status`, `created_at`, `is_synced`
- **`order_items`**: `id`, `order_id`, `product_id`, `quantity`, `unit_price`, `total_price`
- **`deliveries`**: `id`, `order_id`, `dsr_id`, `paid_amount`, `return_amount`, `damage_amount`, `net_collected`, `delivered_at`, `is_synced`
- **`sync_queue`**: `id`, `action`, `payload`, `attempts`, `status`

---

## 5. Primary Strategic Goals
1. Deliver a fast, resilient offline-first MVP within **4 to 6 weeks**.
2. Support low-cost Android hardware used by field sales teams.
3. Provide reliable Bluetooth thermal printing and offline PDF generation.
4. Enable multi-tenant SaaS monetization charging per SR/DSR account per month.