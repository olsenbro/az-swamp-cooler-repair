/**
 * Copy to js/site-config.js and customize for your deployment.
 * js/site-config.js is the live config used by the site.
 */
window.SITE_CONFIG = {
  site: {
    brandName: 'AZ Swamp Cooler Repair',
    domain: 'https://www.azswampcoolerrepair.com',
    defaultService: 'Swamp cooler / evaporative cooler repair',
    businessModel: 'lead_generation'
  },
  nap: {
    streetAddress: 'PO Box 1234',
    addressLocality: 'Mesa',
    addressRegion: 'AZ',
    postalCode: '85210',
    addressCountry: 'US'
  },
  phone: {
    display: '(480) 555-0100',
    tel: '4805550100',
    e164: '+14805550100',
    callTracking: {
      provider: 'CallRail / CallTrackingMetrics / WhatConverts',
      forwardingDestinationNote: 'Owner cell — change in call-tracking dashboard when renter changes'
    }
  },
  contactEmail: 'info@azswampcoolerrepair.com',
  forms: {
    siteId: 'YOUR_BROSITES_SITE_ID',
    thankYouPath: '/thank-you/'
  },
  leads: {
    ownerEmail: 'info@azswampcoolerrepair.com',
    renterForwardEmail: 'renter@example.com',
    renterForwardingEnabled: true,
    forwardingNote: 'Leased to Example Cooler Co through 2026-12-31'
  }
};
