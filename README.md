# Burdah Boutique and Fashions

## Setup (in VS Code terminal)

1. Unzip this folder and open it in VS Code.
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the env template and fill in real values:
   ```
   cp .env.local.example .env.local
   ```
   - `MONGODB_URI`: create a free cluster at mongodb.com/atlas, then copy the connection string.
   - `NEXTAUTH_SECRET`: run `openssl rand -base64 32` and paste the output.
   - Stripe and Cloudinary keys can be added later — the homepage runs fine without them for now.
4. Run the dev server:
   ```
   npm run dev
   ```
5. Open http://localhost:3000 — you should see the homepage with mock product data.

## What's built so far
- Homepage (`app/page.js`) with Navbar, Hero, five category sections (Abayas, Scarves, Shoes, Perfumes, Bags) using mock data
- `/api/products` — GET (list) and POST (create)
- `/api/products/[id]` — GET, PUT, DELETE for a single product
- `Product`, `Order`, `User` Mongoose models
- Tailwind configured with the brand palette (navy, ivory, gold) and Fraunces/Inter fonts
- **Admin dashboard** at `/admin` — protected by login, shows product/stock stats
- **Admin login** at `/admin/login` (NextAuth, credentials-based)
- **Admin products** at `/admin/products` — list, add, edit, delete products with size/color/stock variants
- **Admin inventory** at `/admin/inventory` — every variant across all products, low-stock sorted to the top

## Setting up your first admin login
1. Make sure `MONGODB_URI` is set in `.env.local` and your dev server has connected to it at least once.
2. In a terminal, run:
   ```
   npm install
   npm run create-admin -- "Your Name" you@example.com yourpassword
   ```
3. Go to `http://localhost:3000/admin/login` and sign in with that email and password.

## What's next
- Connect the public homepage to the real `/api/products` endpoint instead of mock data (now that you can add real products via the admin panel)
- Add Stripe checkout
- Build out orders and customers admin pages

Ask Claude for any of these pieces next, one at a time, and they'll be generated as real files the same way this batch was.
