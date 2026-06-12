/**
 * AZ Swamp Cooler Repair — site configuration
 *
 * Edit this file to change phone routing, form routing, and lead delivery
 * without rewriting page copy. The public site stays branded as
 * AZ Swamp Cooler Repair even when calls/forms are leased to one renter.
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
 * FORM ROUTING SETUP
 * ------------------
 * 1. Set Formspree's primary notification email to `leads.ownerEmail`.
 * 2. When leasing to a renter, set `leads.renterForwardEmail` and enable
 *    `leads.renterForwardingEnabled`.
 * 3. On Formspree paid plans, CC forwarding uses the `_cc` field injected by main.js.
 *    On free plans, forward manually from owner inbox or use a Formspree workflow.
 */
window.SITE_CONFIG = {
  site: {
    brandName: 'AZ Swamp Cooler Repair',
    domain: 'https://www.azswampcoolerrepair.com',
    defaultService: 'Swamp cooler / evaporative cooler repair'
  },

  phone: {
    /** Shown on the website (use your call-tracking number, not the renter's direct line). */
    display: '(480) 270-4423',
    /** Used in tel: links — digits only, no +1. */
    tel: '4802704423',
    /** Used in schema.org JSON-LD. */
    e164: '+14802704423',
    callTracking: {
      provider: 'Set up in CallRail, CallTrackingMetrics, or similar',
      forwardingDestinationNote: 'Owner intake line — update when leasing to a renter'
    }
  },

  contactEmail: 'leads@azswampcoolerrepair.com',

  forms: {
    /** Formspree form ID — https://formspree.io/f/{formId} */
    formspreeFormId: 'xykanzba',
    thankYouPath: '/thank-you/'
  },

  leads: {
    /** Always receives lead notifications (Formspree primary inbox). */
    ownerEmail: 'leads@azswampcoolerrepair.com',
    /** Optional renter inbox when site is leased. Leave blank when not leased. */
    renterForwardEmail: '',
    /** When true, main.js adds Formspree _cc to renterForwardEmail if set. */
    renterForwardingEnabled: false,
    /** Internal note stored on each submission for your records. */
    forwardingNote: 'Owner intake only — no active renter lease'
  }
};
