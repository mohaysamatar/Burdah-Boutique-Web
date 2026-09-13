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
- `/product/[slug]` — product detail page: image gallery with thumbnails, variant picker (size/volume + optional color, sold-out variants greyed out), live stock status, breadcrumb navigation
- KES currency formatting throughout (`lib/format.js`)

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

## Troubleshooting Log

A record of real issues hit during this build, what was tried, and what actually fixed them — kept here so the same mistakes aren't repeated and so the reasoning is traceable later.

### Environment setup

| Issue | Cause | Fix |
|---|---|---|
| `npm install` failed with `PSSecurityException` | Windows PowerShell blocks running scripts by default | `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` in an admin PowerShell, or use Command Prompt instead |
| `npm error ENOENT ... package.json` | Terminal was open in the outer unzipped wrapper folder, not the inner `burdah-boutique` project folder | `cd burdah-boutique` before running npm commands |
| `Module not found: Can't resolve '@/components/...'` | `jsconfig.json` (defines the `@/` import alias) was missing from the initial scaffold | Added `jsconfig.json` with `"@/*": ["./*"]` |
| `npm error ERESOLVE` on `eslint-config-next` | Peer dependency conflict — `eslint-config-next` required `eslint >=9`, project had `eslint ^8.57.0` | `npm install --legacy-peer-deps` |
| `npm error ... To see a list of scripts, run: npm run` when running `create-admin` | The admin dashboard batch added `scripts/createAdmin.js` but the corresponding entry in `package.json`'s `"scripts"` section was never mentioned as also needing an update | Manually added `"create-admin": "node scripts/createAdmin.js"` to `package.json` |
| MongoDB Atlas "IP Access List Entry" rejected | Typed the literal placeholder text `(0.0.0.0/0)`, including the parentheses shown as an example | Enter `0.0.0.0/0` with no parentheses |
| "Can't type in the terminal" | That terminal tab was busy running `npm run dev` (streaming logs), not frozen | Open a second terminal tab, or `Ctrl+C` to stop the dev server first |
| `warning: ... LF will be replaced by CRLF` during `git add` | Harmless — Git normalizing line endings for Windows | No action needed, not an error |

### The Edit / Delete / "View all" bug — the long one

**Symptom:** Clicking Edit on a product showed a 404 page. Clicking Delete asked for confirmation but the product was never actually removed. Clicking "View all" under a category scrolled to the top of the page instead of navigating anywhere.

**What was tried first (real fixes, but not the root cause):**
1. Added `try/catch` error handling around the save and delete `fetch` calls, since they had no error surfacing at all — a real bug (a failed request would leave the UI silently stuck), but not what was causing the 404.
2. Found that the `Product` model required `color` on every variant, which silently blocked saving a perfume (no meaningful color) via the browser's native form validation with no visible error. Fixed by making `color` optional. Also a real bug, but still not the 404's cause.
3. **Wrong theory:** suspected a folder-naming mistake from manually copying files in Windows Explorer (e.g. `[id]` or `(dashboard)` folders not created correctly, since bracket/parenthesis folder names are easy to fumble). Did a full delete-and-replace of `app`, `components`, `lib`, `models`. This did not fix it — the folders were actually fine.

**Actual root cause, found by inspecting the real `package-lock.json`:** `package.json` said `"next": "^14.2.5"`, but the lock file showed `"next": "16.3.4"` was what had actually been installed the whole time — an earlier attempt to pin the version back to 14 never fully took effect. This mattered because **Next.js 15+ changed dynamic route `params` from a plain object into a `Promise` that must be `await`ed**. All the code was written the pre-15 way (`params.id` read directly), which silently returns `undefined` under Next 16 — explaining both the 404 (product lookup got `undefined`, found nothing, triggered the not-found page) and the failed delete (same issue in the API route).

**The fix:** rather than keep fighting npm to force a downgrade (already failed twice), updated the three affected files to `await params` instead — which works correctly on both old and new Next.js, so it can't drift out of sync again:
- `app/api/products/[id]/route.js`
- `app/admin/(dashboard)/products/[id]/edit/page.js`
- `app/shop/[category]/page.js`

Also realigned `package.json` to `"next": "^16.3.4"` to match what's actually installed, instead of continuing to contradict the lock file.

**Complication after that fix was described:** verifying the fix required uploading the real project files, which surfaced two more things:
- The wrong `route.js` was uploaded for comparison — Next.js's App Router has *multiple different files all named `route.js` and `page.js`* living in different folders (e.g. `app/api/products/route.js` vs. `app/api/products/[id]/route.js` are two separate files with the same filename). Easy to mix up when asked to "upload route.js."
- The two `page.js` files uploaded still had the **old, unfixed code** — the `await params` fix had been described but never actually got pasted into the real files.

**Resolution:** gave exact, unambiguous instructions — find each file by its full path (`Ctrl+P` then type enough of the path to disambiguate, e.g. `products/[id]/route`), select all, delete, and paste the complete corrected file content directly, for all three files.

**Status:** ✅ Confirmed fixed — edit, delete, and category "View all" pages all tested working after the direct full-file replacement.

### Other notable fixes
- `NEXTAUTH_SECRET` in `.env.local` was literally set to the text `openssl rand -base64 32` — the *command*, not its *output*. A working secret needs to actually be generated and pasted.
- Stripe was the original plan for checkout, but Kenya isn't a directly supported Stripe country (a Kenyan business can't open a native Stripe account). Decision: use **Paystack** instead (owned by Stripe, but a separate platform that does support Kenya, including M-Pesa). Not yet implemented.

### The "product page 404" that was actually a database outage

**Symptom:** Right after building `/product/[slug]`, clicking a product card gave a 404. Looked identical to the earlier params bug, so that was the first suspicion.

**What it actually was:** while editing `.env.local` to paste in the corrected `NEXTAUTH_SECRET`, the `MONGODB_URI` line got affected too (either the password changed on the Atlas side, or the line was disturbed while editing next to it). The real error, visible in the browser overlay and terminal, was:
```
MongoServerError: bad auth : authentication failed
```
Since the database couldn't authenticate, *every* page that queries MongoDB was broken — including the homepage (`GET / 500`), not just the new product page. The product page happened to be the one being tested at the time, which made it look like a routing problem specific to that page.

**Fix:** reset the database user's password in MongoDB Atlas (Database Access → Edit → Edit Password), updated `MONGODB_URI` in `.env.local` with the new password, restarted the dev server.

**Status:** ✅ Confirmed fixed — database reconnected, product detail pages working correctly.

**Lesson:** a 404 or 500 error doesn't always mean what it looks like at first glance. When multiple unrelated pages break at the same time (not just the one just built), check infrastructure (database connection, env vars) before assuming the newest code is at fault.

### Key lesson for future work
Next.js App Router reuses filenames (`page.js`, `route.js`, `layout.js`) across many different folders — the folder path is what makes each one unique, not the filename. When debugging or asking for a specific file, always reference the *full path*, not just the filename.

This project runs on **Next.js 16**, where dynamic route `params` must always be `await`ed. Any new `[bracket]` route should follow this pattern:
```js
export async function GET(request, { params }) {
  const { id } = await params
  // ...
}
```

## What's next
- Cart and checkout (Paystack — supports M-Pesa)
- Customer accounts
- Orders and customers admin pages
- Deploy to Vercel

Ask Claude for any of these pieces next, one at a time, and they'll be generated as real files the same way this batch was.
