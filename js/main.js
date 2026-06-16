// East Valley Swamp Cooler Repair — Main JS

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
    'wbraid',
    'session_id'
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
  applyFooterNap(config);

  // --- Lead forms: BroSites AJAX submit (never native POST) ---
  var forms = document.querySelectorAll('form[data-bs-form]');
  forms.forEach(function (form) {
    form.setAttribute('action', '/__bs_submit');
    form.setAttribute('method', 'post');
    ensureLeadTrackingFields(form);
    form.addEventListener('submit', function (e) {
      handleLeadFormSubmit(e, form);
    }, true);
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
        patchJsonLd(data, cfg);
        script.textContent = JSON.stringify(data);
      } catch (err) {
        /* ignore invalid JSON-LD blocks */
      }
    });
  }

  function patchJsonLd(data, cfg) {
    var e164 = cfg.phone && cfg.phone.e164;
    var nap = cfg.nap || {};

    function walk(node) {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (node.telephone && e164) node.telephone = e164;
      if (node.email && cfg.contactEmail) node.email = cfg.contactEmail;
      if (node['@type'] === 'LocalBusiness' && node.address) {
        if (nap.streetAddress) node.address.streetAddress = nap.streetAddress;
        if (nap.addressLocality) node.address.addressLocality = nap.addressLocality;
        if (nap.addressRegion) node.address.addressRegion = nap.addressRegion;
        if (nap.postalCode) node.address.postalCode = nap.postalCode;
        if (nap.addressCountry) node.address.addressCountry = nap.addressCountry;
      }
      if (node.provider && node.provider['@type'] === 'LocalBusiness' && node.provider.telephone && e164) {
        node.provider.telephone = e164;
      }
      Object.keys(node).forEach(function (key) {
        if (key === '@context') return;
        walk(node[key]);
      });
    }

    walk(data);
  }

  function applyFooterNap(cfg) {
    var nap = cfg.nap;
    var brand = cfg.site && cfg.site.brandName;
    var phone = cfg.phone;
    if (!nap || !brand || !phone) return;

    document.querySelectorAll('.footer-nap').forEach(function (el) {
      var addressLine;
      if (nap.streetAddress) {
        addressLine = nap.streetAddress + '<br>' +
          (nap.addressLocality || 'Mesa') + ', ' + (nap.addressRegion || 'AZ') + ' ' + (nap.postalCode || '');
      } else {
        addressLine = 'Service area: East Valley, Arizona<br>Mailing locality: Mesa, AZ';
      }

      el.innerHTML =
        '<p class="footer-nap-title">Contact</p>' +
        '<p class="footer-nap-name">' + brand + '</p>' +
        '<p class="footer-nap-address">' + addressLine + '</p>' +
        '<p class="footer-nap-phone"><a href="tel:' + phone.tel + '">' + phone.display + '</a></p>' +
        '<p class="footer-nap-email"><a href="mailto:' + cfg.contactEmail + '">' + cfg.contactEmail + '</a></p>';
    });
  }

  function containsPhoneText(text) {
    return /(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/.test(text || '');
  }

  function getBroSitesSiteId() {
    return (window.SITE_CONFIG && window.SITE_CONFIG.forms && window.SITE_CONFIG.forms.siteId) || '';
  }

  function getThankYouUrl() {
    var cfg = window.SITE_CONFIG || {};
    return (cfg.forms && cfg.forms.thankYouPath) || '/thank-you/';
  }

  function getFormValue(form, name) {
    var input = form.querySelector('[name="' + name + '"]');
    return input ? (input.value || '').trim() : '';
  }

  function buildLeadMessage(form, cfg) {
    var lines = [];
    var city = getFormValue(form, 'city');
    var coolerType = getFormValue(form, 'cooler_type');
    var problem = getFormValue(form, 'problem');
    var urgency = getFormValue(form, 'urgency');
    var leads = cfg.leads || {};

    if (city) lines.push('City: ' + city);
    if (coolerType) lines.push('Cooler type: ' + coolerType);
    if (problem) lines.push('Problem: ' + problem);
    if (urgency) lines.push('Urgency: ' + urgency);

    if (leads.ownerEmail) lines.push('Owner email: ' + leads.ownerEmail);
    if (leads.renterForwardingEnabled && leads.renterForwardEmail) {
      lines.push('Renter forward email: ' + leads.renterForwardEmail);
    }
    if (leads.forwardingNote) lines.push('Forwarding note: ' + leads.forwardingNote);

    var phoneCfg = cfg.phone || {};
    var callTracking = phoneCfg.callTracking || {};
    if (callTracking.forwardingDestinationNote) {
      lines.push('Call tracking note: ' + callTracking.forwardingDestinationNote);
    }

    TRACKING_FIELDS.forEach(function (key) {
      var value = getFormValue(form, key);
      if (value) lines.push(key + ': ' + value);
    });

    return lines.join('\n');
  }

  function buildLeadPayload(form) {
    var cfg = window.SITE_CONFIG || config;
    populateLeadTrackingFields(form);
    applyLeadRoutingFields(form, cfg);

    var firstName = getFormValue(form, 'first_name');
    var lastName = getFormValue(form, 'last_name');
    var name = (firstName + ' ' + lastName).trim();

    return {
      name: name,
      email: getFormValue(form, 'email'),
      phone: getFormValue(form, 'phone'),
      message: buildLeadMessage(form, cfg),
      session_id: (typeof window !== 'undefined' && window.__bs_session_id) ? window.__bs_session_id : null
    };
  }

  function ensureFormToast() {
    var toast = document.getElementById('form-toast');
    if (toast) return toast;

    toast = document.createElement('div');
    toast.id = 'form-toast';
    toast.className = 'form-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    document.body.appendChild(toast);
    return toast;
  }

  var toastHideTimer;

  function showFormError(message) {
    var toast = ensureFormToast();
    toast.textContent = message || 'Something went wrong. Please try again or call us directly.';
    toast.classList.add('is-visible');
    clearTimeout(toastHideTimer);
    toastHideTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 5000);
  }

  function setSubmitting(form, isSubmitting) {
    var button = form.querySelector('button[type="submit"]');
    if (!button) return;
    if (isSubmitting) {
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent;
      }
      button.disabled = true;
      button.textContent = 'Sending…';
    } else {
      button.disabled = false;
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
      }
    }
  }

  function handleLeadFormSubmit(e, form) {
    e.preventDefault();
    e.stopPropagation();

    var siteId = getBroSitesSiteId();
    if (!siteId) {
      showFormError('Lead form is not configured yet. Please call us instead.');
      return;
    }

    if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
      return;
    }

    var payload = buildLeadPayload(form);
    var endpoint = 'https://brosites.lovable.app/api/public/leads/' + encodeURIComponent(siteId);
    setSubmitting(form, true);

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Lead submission failed with status ' + response.status);
        }
        form.reset();
        populateLeadTrackingFields(form);
        applyLeadRoutingFields(form, window.SITE_CONFIG || config);
        window.location.href = getThankYouUrl();
      })
      .catch(function () {
        showFormError('We could not send your request. Please try again or call us directly.');
      })
      .finally(function () {
        setSubmitting(form, false);
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

    setHiddenValue(form, 'session_id', window.__bs_session_id || '');
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
  }

  // Populate tracking fields on load so values exist even if JS submit hooks fail
  forms.forEach(function (form) {
    populateLeadTrackingFields(form);
    applyLeadRoutingFields(form, config);
  });

}());
