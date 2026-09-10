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
- Homepage (`app/page.js`) with Navbar, Hero, product grid (mock data), Footer
- `/api/products` — GET (list) and POST (create)
- `/api/products/[id]` — GET, PUT, DELETE for a single product
- `Product`, `Order`, `User` Mongoose models
- Tailwind configured with the brand palette (navy, ivory, gold) and Fraunces/Inter fonts

## What's next
- Connect the homepage to the real `/api/products` endpoint instead of mock data
- Add products to MongoDB (either via a script or by building the admin product form)
- Build the admin dashboard (`app/admin/`) — layout, auth guard, product table, inventory page
- Wire up NextAuth for admin login
- Add Stripe checkout

Ask Claude for any of these pieces next, one at a time, and they'll be generated as real files the same way this batch was.
