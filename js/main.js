/* ===================================================
   Faisal Bin Ashraf — Main JavaScript
   =================================================== */
(function () {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav-overlay');
  const body = document.body;

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      const isActive = menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      body.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', isActive);
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 68;
        window.scrollTo({ top: top, behavior: 'smooth' });
        if (history.pushState) history.pushState(null, null, targetId);
      }
    });
  });

  /* Mark active nav link based on current page */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.desktop-nav a, .mobile-nav-overlay a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var linkPage = href.split('/').pop().split('#')[0] || 'index.html';
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  if (window.location.hash) {
    var target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(function () {
        var top = target.getBoundingClientRect().top + window.pageYOffset - 68;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }, 100);
    }
  }
})();
