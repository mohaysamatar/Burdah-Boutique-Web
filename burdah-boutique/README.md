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
   - `NEXTAUTH_SECRET`: run `openssl rand -base64 32` and paste the actual output (not the command itself).
   - `CLOUDINARY_*`: sign up free at cloudinary.com, values are on your dashboard homepage.
   - Stripe keys are unused (this project uses Paystack instead) — safe to leave as placeholders or remove.
4. Run the dev server:
   ```
   npm run dev
   ```
5. Open http://localhost:3000 — you should see the homepage (empty categories until you add products).

## What's built so far

**Public storefront**
- Homepage (`app/page.js`) — five category sections (Abayas, Scarves, Shoes, Perfumes, Bags), pulling real products from MongoDB
- `/shop/[category]` — full listing page per category ("View all" destination)
- KES currency formatting throughout

**Backend**
- `/api/products` — GET (list), POST (create)
- `/api/products/[id]` — GET, PUT, DELETE for a single product
- `/api/upload` — accepts an image file, uploads it to Cloudinary, returns the URL
- `Product`, `Order`, `User` Mongoose models
- `lib/categories.js`, `lib/products.js` — shared category metadata and product-fetching logic used by both the homepage and category pages

**Admin dashboard** (all under `/admin`, protected by login)
- `/admin/login` — NextAuth credentials login
- `/admin` — dashboard overview with live product/stock stats
- `/admin/products` — list, add, edit, delete products; dynamic size/volume + optional color + SKU + stock per variant; photo upload
- `/admin/inventory` — every variant across all products, low-stock sorted to the top
- `/admin/analytics` — revenue, orders, units sold, category breakdown chart, revenue trend chart, top products table

**Scripts**
- `npm run create-admin -- "Name" email password` — creates your first admin login
- `npm run seed-test-orders` — inserts ~24 fake orders across the last 5 months, for testing the analytics page

## Setting up your first admin login
1. Make sure `MONGODB_URI` is set in `.env.local` and your dev server has connected to it at least once.
2. In a terminal, run:
   ```
   npm run create-admin -- "Your Name" you@example.com yourpassword
   ```
3. Go to `http://localhost:3000/admin/login` and sign in with that email and password.

## Important version note
This project runs on **Next.js 16**. Dynamic route params (`params`) must be `await`ed in every API route and page under a `[bracket]` folder — this is different from Next.js 14 and earlier. If you add a new dynamic route, follow the pattern already used in `app/api/products/[id]/route.js`:
```js
export async function GET(request, { params }) {
  const { id } = await params
  // ...
}
```
Forgetting to await `params` is what caused the Edit-page-404 and delete-failure bugs earlier in this build — worth remembering for anything new.

## What's next
- Product detail pages (`/product/[slug]`)
- Cart and checkout (Paystack — supports M-Pesa)
- Customer accounts
- Orders and customers admin pages
- Deploy to Vercel

Ask Claude for any of these pieces next, one at a time, and they'll be generated as real files the same way this batch was.
