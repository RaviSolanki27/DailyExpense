# Daily Business Expense, Income & Khata Tracker (PWA)

A mobile-first Progressive Web Application (PWA) built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **PostgreSQL (NeonDB)**. Designed for multi-business owners to rapidly track daily expenses, income, payment modes (Cash / UPI), and credit/debt ledger (Khata).

---

## 🌟 Key Features

1. **4-Digit Passcode Protection Screen**
   - Locked upon opening; default passcode is **`0000`**.
   - Verified directly against the database (`AppConfig` table).
   - Can be changed from the in-app settings or updated manually in database via:
     ```sql
     UPDATE "AppConfig" SET passcode = '1234' WHERE id = 'default';
     ```
   - Quick lock button in the header and settings.

2. **Multiple Business Profiles**
   - Manage distinct businesses (e.g., **Plywood Business**, **Restaurant**, **Car Rental**).
   - Profile-specific income, expenses, frequent expense buttons, and customer khata ledgers.
   - Switch active business in 1 tap from the top bar dropdown.
   - Add, edit theme color/currency, or delete business profiles.

3. **Streamlined Quick Add UI (Mobile-Optimized)**
   - **Income Entry**:
     - 1-tap payment mode toggle: `Online / UPI`, `Cash`, `Other`.
     - Fast auto-fill suggestions for income categories.
   - **Expense Entry**:
     - **Horizontal Suggestion Slider**: Frequently used expense chips (e.g., *Vegetables*, *Diesel*, *Dairy*, *Labor*, *Timber*).
     - **1-Tap Population**: Tapping any chip immediately types it into the input field!
     - Custom input field for typing any expense + `+ Add Button` to add custom chips to the slider.
     - 1-tap payment mode toggle: `Online / UPI`, `Cash`, `Other`.
   - **Built-In Number Pad / Calculator**:
     - Direct numeric keypad with arithmetic calculation (`+`, `-`, `×`, `÷`, `=`).
     - Real-time expression evaluation (e.g., `45 * 12 + 100 = 640`).
     - Quick increment chips (`+100`, `+500`, `+1,000`, `+2,000`, `+5,000`).
     - Celebration confetti effect upon saving!

4. **Khata Book / Ledger (Borrow & Lend / Udhar)**
   - **You Will Get (लेना है)**: Total amount people borrowed from you (Maine Diye).
   - **You Will Give (देना है)**: Total amount you owe vendors/suppliers (Maine Liye).
   - Party management (Name, Phone, Notes).
   - Individual ledger breakdown with `+ Maine Diye` and `+ Maine Liye` entries.
   - **1-Tap WhatsApp Reminder**: Generates polite balance reminder messages directly to WhatsApp.

5. **Reports & Filter Page**
   - Filter by period: **Today**, **This Week**, **This Month**, **This Year**, **All Time**.
   - Filter by type: *Income Only*, *Expense Only*, *All*.
   - Filter by payment mode: *Online / UPI*, *Cash*, *Other*.
   - Summary cards: Total Inflow, Total Outflow, Net Profit / Cashflow.
   - Payment method breakdown (Cash vs UPI split).
   - Grouped transaction feed by date with search and delete options.
   - **Export CSV**: 1-click download of filtered accounting records.

6. **PWA (Progressive Web App)**
   - Standalone installable on **Android** (Chrome Add to Home screen) and **iOS** (Safari Share > Add to Home screen).
   - Offline caching service worker (`/sw.js`) and web app manifest (`/manifest.json`).
   - Inter font typography (`next/font/google`).
   - Dark / Light mode toggle with persistent preference.

---

## 🚀 Connecting Your NeonDB Database

When you are ready to connect your Neon PostgreSQL database:

1. Open `.env` in the root directory.
2. Replace `DATABASE_URL` with your NeonDB connection string:
   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-YOUR-PROJECT.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
3. Push the schema to your Neon database:
   ```bash
   npm run db:push
   ```
4. Seed default business profiles ("Plywood", "Restaurant", "Car Rental") and default passcode (`0000`):
   ```bash
   npm run db:seed
   ```
5. *(Optional)* View your database in GUI:
   ```bash
   npm run db:studio
   ```

> **Note**: While you are setting up your NeonDB URL, the application automatically runs in a smooth **Local Storage Fallback Mode**, allowing you to preview and use all features immediately!

---

## 🛠️ Development & Production

- Run Development Server:
  ```bash
  npm run dev
  ```
  App will be accessible at: `http://localhost:3000`

- Build for Production:
  ```bash
  npm run build
  npm run start
  ```
