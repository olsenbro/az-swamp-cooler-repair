# AZ Swamp Cooler Repair — azswampcoolerrepair.com

A static lead-generation website connecting East Valley AZ homeowners with local evaporative cooler repair technicians.

---

## Before You Go Live — Two Things You Must Do

### 1. Configure Phone, Forms, and Lead Routing
Edit **`js/site-config.js`** — this is the single source of truth for:

- **Call-tracking number** shown on the site (`phone.display`, `phone.tel`, `phone.e164`)
- **BroSites site ID** (`forms.siteId`) — or set `NEXT_PUBLIC_SITE_ID` in Vercel (injected at build)
- **Owner lead email** (`leads.ownerEmail`) — public `info@`; route via Cloudflare Email Routing
- **Renter forwarding** (`leads.renterForwardEmail`, `leads.renterForwardingEnabled`)
- **Forwarding note** for your records (`leads.forwardingNote`, `phone.callTracking.forwardingDestinationNote`)

Do **not** hardcode a renter's direct phone number in HTML. Change the tracking number in `site-config.js` and update the forwarding destination in your call-tracking provider dashboard (CallRail, CallTrackingMetrics, etc.).

Copy `js/site-config.example.js` as a reference template.

### 2. Set Up BroSites (Lead Form)
1. In your BroSites dashboard, copy the **site ID** for this property.
2. In Vercel → Project → Settings → Environment Variables, set:
   - **`NEXT_PUBLIC_SITE_ID`** = your BroSites site ID (Production **and** Preview)
3. On deploy, `npm run build` injects that value into **`js/site-config.js`** (`forms.siteId`).

For local testing without Vercel, set `forms.siteId` directly in `js/site-config.js` (see `.env.example`).

Lead forms POST to `https://brosites.lovable.app/api/public/leads/{siteId}` via `js/main.js`. On success, visitors are redirected to `/thank-you/`.

**Lead tracking fields** (page URL, landing page, city page, UTM params, gclid, etc.) are included in the lead payload automatically on every `.lead-form` submit.

**When leasing to a renter:** set `renterForwardEmail`, enable `renterForwardingEnabled`, and update `forwardingNote`. Renter routing metadata is included in the lead message sent to BroSites.

---

## Set Up Email (Cloudflare Email Routing)

Public contact address: **`info@azswampcoolerrepair.com`**

Inbound mail is handled by **Cloudflare Email Routing** (domain DNS in Cloudflare):

1. Cloudflare dashboard → **Email** → **Email Routing** → enable for `azswampcoolerrepair.com`
2. **Routing rules** → create address: `info` → forward to your personal inbox (e.g. `ryano72@gmail.com`)
3. Cloudflare adds the required MX records automatically — remove any old ImprovMX/other MX records if present
4. Send a test email to `info@azswampcoolerrepair.com` and confirm delivery

For additional niche sites, repeat the same pattern: one `info@` (or `contact@`) alias per domain in Cloudflare, all forwarding to the same owner inbox.

---

## Deploy to Vercel

The site is already connected to your Vercel account via the domain purchase. To deploy:

1. Push this folder to a GitHub repo:
```bash
cd ~/projects/az-swamp-cooler-repair
git add .
git commit -m "Initial site build"
git remote add origin https://github.com/olsenbro/az-swamp-cooler-repair.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Select the `az-swamp-cooler-repair` repo
4. Framework: Other (static site)
5. Build command: `npm run build` (injects `NEXT_PUBLIC_SITE_ID` into config — see `.env.example`)
6. Set **`NEXT_PUBLIC_SITE_ID`** in Vercel environment variables before the first deploy
7. Deploy

Vercel auto-deploys every time you push to the main branch.

---

## Google Search Console Setup

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → URL prefix → `https://www.azswampcoolerrepair.com`
3. Verify using the HTML file method:
   - Download the verification HTML file (e.g. `google1234abcd.html`)
   - Place it in the root of this project
   - Push to GitHub → Vercel deploys it
   - Click Verify in Search Console
4. Submit sitemap: `https://www.azswampcoolerrepair.com/sitemap.xml`

---

## How to Update Content

Since this is a static site, updating content means editing the HTML files directly.

**To update text on a page:**
- Open the relevant `index.html` file
- Find the text you want to change (Cmd+F)
- Edit and save
- Commit and push to GitHub — Vercel deploys automatically

**To add a new blog post:**
1. Create a new folder: `blog/your-post-slug/`
2. Copy an existing blog post's `index.html` as a starting point
3. Update the title, meta description, H1, and body content
4. Add a card for it in `blog/index.html`
5. Add it to `sitemap.xml`
6. Push to GitHub

---

## File Structure

```
/                           Homepage
/evaporative-cooler-repair-east-valley-az/   Main service page
/swamp-cooler-repair-[city]-az/              7 city landing pages
/faq/                       FAQ (15 Q&As, accordion)
/how-it-works/              How the referral service works
/contact/                   Contact / lead form
/privacy-policy/            Privacy policy
/terms/                     Terms of service
/thank-you/                 Form submission confirmation (noindexed)
/blog/                      Blog listing
/blog/[post-slug]/          5 blog posts
/404.html                   404 page
/sitemap.xml                XML sitemap (submit to Google Search Console)
/robots.txt                 Crawler instructions
/vercel.json                Clean URLs config
/css/style.css              All styles
/js/site-config.js          Phone, BroSites site ID, owner/renter lead routing config
/js/site-config.example.js  Config template
/js/main.js                 Mobile menu, BroSites lead submit, tracking fields, phone from config
/scripts/inject-site-id.js  Injects NEXT_PUBLIC_SITE_ID at Vercel build time
/.env.example               Documents NEXT_PUBLIC_SITE_ID for local/Vercel setup
```

---

## Ongoing SEO Tasks (Months 1–3)

- [ ] Submit sitemap to Google Search Console
- [ ] Verify domain ownership in Google Search Console  
- [ ] Set up Google Analytics 4 (add GA4 script to every page's `<head>`)
- [ ] Build 15+ local citations: Yelp, Angi, Yellow Pages, Manta, Foursquare, Apple Maps, Facebook
- [ ] Set up Google Business Profile (Service Area Business covering East Valley)
- [ ] Publish 2–3 new blog posts per month
- [ ] Monitor Search Console for keyword impressions and click-through rates
- [ ] Begin partner outreach once first leads arrive (see lead-gen-project/08-outreach-scripts.md)
