# CHERRY JEWELRY — Premium Luxury E-Commerce

A modern, high-end e-commerce platform for handcrafted luxury jewelry, inspired by minimal brutalist and editorial fashion aesthetics (Farfetch, Dior). Built on Next.js 16, TypeScript, Tailwind CSS, and Framer Motion, with a persistent MariaDB/MySQL database integration.

---

## Key Features

- **Luxury Product Detail Page (PDP)**: Farfetch-inspired interactive image gallery with vertical thumbnail selection columns, smooth active-image crossfades, and mouse-hover image zoom. Includes product details, shipping guides, and care instruction accordions.
- **Interactive Slide-Out Shopping Bag**: A Framer Motion animated drawer that stores and manages quantities in real-time, persisting items automatically via localStorage.
- **Premium Checkout Journey**: Spacious Cash on Delivery (COD) shipping form, real-time input status styling, order summary breakdowns, and automatic database persistence.
- **Responsive Navigation**: Enchanced top sticky menu with white-gold transitions, responsive layouts, a full-screen mobile menu drawer, and custom-styled brand identity.
- **Receipt & Confirmation**: Centered order completion screen with a receipt card, dynamic order numbers, and animated checkmarks.
- **Database Integration**: Fully integrated with MariaDB/MySQL databases using Drizzle ORM to record transactions.

---

## Tech Stack

- **Core**: Next.js 16 (App Router with Turbopack), React 19
- **Logic & Types**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database Connection**: Drizzle ORM & mysql2 driver
- **Local DB Service**: XAMPP MySQL (MariaDB)

---

## Database Setup

Transactions are logged in a local MySQL/MariaDB database. Use the following schema definitions to initialize your local table structure:

```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_slug VARCHAR(100) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (id)
);
```

### Environment Variables

Configure your database connection credentials in a `.env` file at the root of the project:

```env
DATABASE_URL=mysql://root:@localhost:3306/jewelry_db
```

---

## Getting Started

Follow these steps to run the application locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Build for Production
```bash
npm run build
npm run start
```