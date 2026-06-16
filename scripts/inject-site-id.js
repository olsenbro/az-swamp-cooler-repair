'use strict';

const fs = require('fs');
const path = require('path');

const siteConfigPath = path.join(__dirname, '..', 'js', 'site-config.js');
const siteId = (process.env.NEXT_PUBLIC_SITE_ID || '').trim();

if (process.env.VERCEL === '1' && !siteId) {
  console.error('NEXT_PUBLIC_SITE_ID is required on Vercel (Production and Preview).');
  process.exit(1);
}

let content = fs.readFileSync(siteConfigPath, 'utf8');

if (!/siteId:\s*'[^']*'/.test(content)) {
  console.error('Could not find forms.siteId in js/site-config.js');
  process.exit(1);
}

content = content.replace(
  /siteId:\s*'[^']*'/,
  "siteId: '" + siteId.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"
);

fs.writeFileSync(siteConfigPath, content);

if (siteId) {
  console.log('Injected BroSites site ID into js/site-config.js');
} else {
  console.warn('No NEXT_PUBLIC_SITE_ID set — forms.siteId left empty for local dev.');
}
