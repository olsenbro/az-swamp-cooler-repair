// AZ Swamp Cooler Repair — Main JS

(function () {
  'use strict';

  var config = window.SITE_CONFIG || {};
  var STORAGE_PREFIX = 'azscr_';
  var TRACKING_FIELDS = [
    'page_url',
    'landing_page',
    'city_page',
    'service',
    'timestamp',
    'referrer',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'gbraid',
    'wbraid'
  ];

  // --- Sticky header shadow ---
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --- Mobile hamburger ---
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target === mobileNav) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Desktop cities dropdown ---
  var dropdowns = document.querySelectorAll('.has-dropdown');
  dropdowns.forEach(function (dd) {
    dd.addEventListener('mouseenter', function () { dd.classList.add('open'); });
    dd.addEventListener('mouseleave', function () { dd.classList.remove('open'); });
    var link = dd.querySelector('a');
    if (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth < 768) return;
        if (!dd.classList.contains('open')) {
          e.preventDefault();
          dropdowns.forEach(function (d) { d.classList.remove('open'); });
          dd.classList.add('open');
        }
      });
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      dropdowns.forEach(function (d) { d.classList.remove('open'); });
    }
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var offset = header ? header.offsetHeight + 12 : 72;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- Site config: phone + mailto from central config ---
  applySiteContact(config);
  applyFormEndpoints(config);

  // --- Lead forms: tracking fields + routing metadata ---
  var forms = document.querySelectorAll('.lead-form');
  forms.forEach(function (form) {
    ensureLeadTrackingFields(form);
    form.addEventListener('submit', function () {
      populateLeadTrackingFields(form);
      applyLeadRoutingFields(form, config);
      ensureThankYouRedirect(form, config);
    });
  });

  function applySiteContact(cfg) {
    if (!cfg.phone) return;

    var tel = cfg.phone.tel;
    var display = cfg.phone.display;
    var e164 = cfg.phone.e164;

    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.setAttribute('href', 'tel:' + tel);
      if (link.classList.contains('header-phone')) {
        link.innerHTML = '&#128222; ' + display;
      } else if (containsPhoneText(link.textContent)) {
        link.textContent = display;
      }
    });

    if (cfg.contactEmail) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
        link.setAttribute('href', 'mailto:' + cfg.contactEmail);
        if (link.textContent.indexOf('@') !== -1) {
          link.textContent = cfg.contactEmail;
        }
      });
    }

    document.querySelectorAll('script[type="application/ld+json"]').forEach(function (script) {
      try {
        var data = JSON.parse(script.textContent.trim());
        if (data.telephone) {
          data.telephone = e164;
          script.textContent = JSON.stringify(data);
        }
      } catch (err) {
        /* ignore invalid JSON-LD blocks */
      }
    });
  }

  function containsPhoneText(text) {
    return /(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/.test(text || '');
  }

  function applyFormEndpoints(cfg) {
    if (!cfg.forms || !cfg.forms.formspreeFormId) return;
    var action = 'https://formspree.io/f/' + cfg.forms.formspreeFormId;
    document.querySelectorAll('.lead-form').forEach(function (form) {
      if (!form.getAttribute('action') || form.getAttribute('action').indexOf('formspree.io') !== -1) {
        form.setAttribute('action', action);
        form.setAttribute('method', 'POST');
      }
    });
  }

  function ensureLeadTrackingFields(form) {
    TRACKING_FIELDS.forEach(function (name) {
      if (!form.querySelector('input[name="' + name + '"]')) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.className = 'lead-tracking-field';
        form.appendChild(input);
      }
    });

    ['lead_owner_email', 'lead_renter_email', 'renter_forwarding_enabled', 'forwarding_note', 'call_tracking_note'].forEach(function (name) {
      if (!form.querySelector('input[name="' + name + '"]')) {
        var meta = document.createElement('input');
        meta.type = 'hidden';
        meta.name = name;
        meta.className = 'lead-routing-field';
        form.appendChild(meta);
      }
    });
  }

  function captureAttribution() {
    var params = new URLSearchParams(window.location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'];
    keys.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        try {
          sessionStorage.setItem(STORAGE_PREFIX + key, value);
        } catch (err) {
          /* storage unavailable */
        }
      }
    });

    if (document.referrer) {
      try {
        sessionStorage.setItem(STORAGE_PREFIX + 'referrer', document.referrer);
      } catch (err) {
        /* storage unavailable */
      }
    }

    try {
      if (!sessionStorage.getItem(STORAGE_PREFIX + 'landing_page')) {
        sessionStorage.setItem(STORAGE_PREFIX + 'landing_page', window.location.href);
      }
    } catch (err) {
      /* storage unavailable */
    }
  }

  captureAttribution();

  function getStored(key) {
    try {
      return sessionStorage.getItem(STORAGE_PREFIX + key) || '';
    } catch (err) {
      return '';
    }
  }

  function detectCityPage() {
    var match = window.location.pathname.match(/\/swamp-cooler-repair-([a-z-]+)-az\/?/i);
    if (match) {
      return match[1].replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) + ', AZ';
    }
    return '';
  }

  function detectService() {
    var path = window.location.pathname;
    if (path.indexOf('evaporative-cooler-repair-east-valley') !== -1) {
      return 'Evaporative cooler repair — East Valley AZ';
    }
    if (path.indexOf('swamp-cooler-repair-') !== -1) {
      return 'Swamp cooler repair — ' + (detectCityPage() || 'East Valley AZ');
    }
    return (config.site && config.site.defaultService) || 'Swamp cooler / evaporative cooler repair';
  }

  function setHiddenValue(form, name, value) {
    var input = form.querySelector('input[name="' + name + '"]');
    if (input) input.value = value || '';
  }

  function populateLeadTrackingFields(form) {
    setHiddenValue(form, 'page_url', window.location.href);
    setHiddenValue(form, 'landing_page', getStored('landing_page') || window.location.href);
    setHiddenValue(form, 'city_page', detectCityPage());
    setHiddenValue(form, 'service', detectService());
    setHiddenValue(form, 'timestamp', new Date().toISOString());
    setHiddenValue(form, 'referrer', getStored('referrer') || document.referrer || '');

    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'].forEach(function (key) {
      setHiddenValue(form, key, getStored(key));
    });
  }

  function applyLeadRoutingFields(form, cfg) {
    var leads = cfg.leads || {};
    var phone = cfg.phone || {};
    var callTracking = phone.callTracking || {};

    setHiddenValue(form, 'lead_owner_email', leads.ownerEmail || cfg.contactEmail || '');
    setHiddenValue(form, 'lead_renter_email', leads.renterForwardEmail || '');
    setHiddenValue(form, 'renter_forwarding_enabled', leads.renterForwardingEnabled ? 'yes' : 'no');
    setHiddenValue(form, 'forwarding_note', leads.forwardingNote || '');
    setHiddenValue(form, 'call_tracking_note', callTracking.forwardingDestinationNote || '');

    if (leads.renterForwardingEnabled && leads.renterForwardEmail) {
      var cc = form.querySelector('input[name="_cc"]');
      if (!cc) {
        cc = document.createElement('input');
        cc.type = 'hidden';
        cc.name = '_cc';
        form.appendChild(cc);
      }
      cc.value = leads.renterForwardEmail;
    } else {
      var existingCc = form.querySelector('input[name="_cc"]');
      if (existingCc) existingCc.remove();
    }
  }

  function ensureThankYouRedirect(form, cfg) {
    var thankYou = (cfg.site && cfg.site.domain ? cfg.site.domain : window.location.origin) +
      ((cfg.forms && cfg.forms.thankYouPath) || '/thank-you/');
    var nextInput = form.querySelector('input[name="_next"]');
    if (!nextInput) {
      nextInput = document.createElement('input');
      nextInput.type = 'hidden';
      nextInput.name = '_next';
      form.appendChild(nextInput);
    }
    nextInput.value = thankYou;
  }

  // Populate tracking fields on load so values exist even if JS submit hooks fail
  forms.forEach(function (form) {
    populateLeadTrackingFields(form);
    applyLeadRoutingFields(form, config);
  });

}());
