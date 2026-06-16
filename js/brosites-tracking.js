// BroSites visit tracking — session ID + pageview pixel (all pages)

(function () {
  'use strict';

  var STORAGE_KEY = '_bs_session_id';
  var cfg = window.SITE_CONFIG || {};
  var siteId = cfg.forms && cfg.forms.siteId;

  function getOrCreateSessionId() {
    var id;
    try {
      id = sessionStorage.getItem(STORAGE_KEY);
      if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem(STORAGE_KEY, id);
      }
    } catch (err) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
    window.__bs_session_id = id;
    return id;
  }

  function firePageviewPixel(sessionId) {
    if (!siteId) return;

    var path = location.pathname + location.search;
    var referrer = document.referrer || '';
    var url =
      'https://brosites.lovable.app/api/public/px/' +
      encodeURIComponent(siteId) +
      '.gif?p=' + encodeURIComponent(path) +
      '&r=' + encodeURIComponent(referrer) +
      '&s=' + encodeURIComponent(sessionId) +
      '&t=' + Date.now();

    var img = new Image();
    img.src = url;
  }

  var sessionId = getOrCreateSessionId();
  firePageviewPixel(sessionId);
}());
