# AZ Swamp Cooler Repair — azswampcoolerrepair.com

A static lead-generation website connecting East Valley AZ homeowners with local evaporative cooler repair technicians.

---

## Before You Go Live — Two Things You Must Do

### 1. Replace the Phone Number
Search every HTML file for `(480) 270-4423` and replace with your real phone number.
Also update `+14802704423` (the tel: link format) to match.

Quick command to find all instances:
```bash
grep -r "555-0100" ~/projects/az-swamp-cooler-repair/
```

### 2. Set Up Formspree (Lead Form)
1. Go to [formspree.io](https://formspree.io) and sign up with ryano72@gmail.com
2. Create a new form — name it "AZ Swamp Cooler Repair Leads"
3. Copy the 8-character form ID (e.g. `xyzabcde`)
4. Replace `PLACEHOLDER` in every form's action URL with your real ID:
```bash
grep -r "PLACEHOLDER" ~/projects/az-swamp-cooler-repair/
```
Replace `https://formspree.io/f/PLACEHOLDER` with `https://formspree.io/f/YOUR_REAL_ID`

Free plan: 50 submissions/month. Upgrade for unlimited.

---

## Set Up Email Forwarding (ImprovMX)

So that `leads@azswampcoolerrepair.com` forwards to `ryano72@gmail.com`:

1. Go to [improvmx.com](https://improvmx.com) — free plan works
2. Add your domain `azswampcoolerrepair.com`
3. Set up forwarding: `leads` → `ryano72@gmail.com`
4. Add these DNS records at Vercel (Domain Settings → DNS):
   - `MX` record: `@` → `mx1.improvmx.com` — Priority: `10`
   - `MX` record: `@` → `mx2.improvmx.com` — Priority: `20`
5. Wait 1–24 hours for DNS to propagate
6. Test by sending an email to `leads@azswampcoolerrepair.com`

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
5. No build command needed — it's pure HTML
6. Deploy

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
/thank-you/                 Form submission confirmation (noindexed)
/blog/                      Blog listing
/blog/[post-slug]/          5 blog posts
/404.html                   404 page
/sitemap.xml                XML sitemap (submit to Google Search Console)
/robots.txt                 Crawler instructions
/vercel.json                Clean URLs config
/css/style.css              All styles
/js/main.js                 Mobile menu, smooth scroll, header scroll
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
