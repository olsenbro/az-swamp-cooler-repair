// AZ Swamp Cooler Repair — Main JS

(function () {
  'use strict';

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
    // Close on overlay click
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
    // Touch/click toggle
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

  // Close dropdowns on outside click
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

  // --- Form: redirect to thank-you ---
  var forms = document.querySelectorAll('.lead-form');
  forms.forEach(function (form) {
    if (!form.getAttribute('action') || form.getAttribute('action').includes('PLACEHOLDER')) return;
    form.addEventListener('submit', function () {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = '_next';
      input.value = window.location.origin + '/thank-you/';
      form.appendChild(input);
    });
  });

}());
