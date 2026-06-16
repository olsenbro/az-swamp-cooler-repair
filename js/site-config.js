/**
 * East Valley Swamp Cooler Repair — site configuration
 *
 * Edit this file to change phone routing, form routing, and lead delivery
 * without rewriting page copy. The public site stays branded as
 * East Valley Swamp Cooler Repair even when calls/forms are leased to one renter.
 *
 * CALL TRACKING SETUP
 * -------------------
 * 1. Buy or port a tracking number in CallRail, CallTrackingMetrics, WhatConverts,
 *    or your preferred provider.
 * 2. Set the tracking number below as `phone.display` / `phone.tel` / `phone.e164`.
 * 3. In the call-tracking dashboard, set the forwarding destination to your
 *    owner intake line OR the current renter's business line.
 * 4. Update `phone.callTracking.forwardingDestinationNote` so you remember
 *    where calls are going during the current lease period.
 * 5. Do NOT put the renter's company name on the public website.
 *
 * LEAD FORM SETUP
 * ---------------
 * 1. Set `forms.siteId` to your BroSites site ID (or set NEXT_PUBLIC_SITE_ID in Vercel;
 *    the build script injects it before deploy).
 * 2. Public contact email is `contactEmail` (info@) — route via Cloudflare Email Routing.
 * 3. Lead delivery is handled by BroSites; use `leads.*` fields for internal routing notes.
 */
window.SITE_CONFIG = {
  site: {
    brandName: 'East Valley Swamp Cooler Repair',
    domain: 'https://www.azswampcoolerrepair.com',
    defaultService: 'Swamp cooler / evaporative cooler repair',
    /** 'lead_generation' = connects homeowners with independent local pros (this site). */
    businessModel: 'lead_generation'
  },

  /** Mailing address for footer NAP and schema. PO Box is fine for service-area / lead-gen sites. */
  nap: {
    streetAddress: 'PO Box 30092',
    addressLocality: 'Mesa',
    addressRegion: 'AZ',
    postalCode: '85275',
    addressCountry: 'US'
  },

  phone: {
    /** Shown on the website (use your call-tracking number, not the renter's direct line). */
    display: '(480) 690-1843',
    /** Used in tel: links — digits only, no +1. */
    tel: '4806901843',
    /** Used in schema.org JSON-LD. */
    e164: '+14806901843',
    callTracking: {
      provider: 'Set up in CallRail, CallTrackingMetrics, or similar',
      forwardingDestinationNote: 'Owner intake line — update when leasing to a renter'
    }
  },

  contactEmail: 'info@azswampcoolerrepair.com',

  forms: {
    /** BroSites site ID — overridden at build time from NEXT_PUBLIC_SITE_ID on Vercel. */
    siteId: '',
    thankYouPath: '/thank-you/'
  },

  leads: {
    /** Primary owner inbox for your records. */
    ownerEmail: 'info@azswampcoolerrepair.com',
    /** Optional renter inbox when site is leased. Leave blank when not leased. */
    renterForwardEmail: '',
    /** When true, renter email is included in the lead message payload. */
    renterForwardingEnabled: false,
    /** Internal note stored on each submission for your records. */
    forwardingNote: 'Owner intake only — no active renter lease'
  }
};
