/* Konstantin Yessipchuk — portfolio: language, theme, reveal animations.
   Texts live in i18n/ko.js, i18n/ru.js, i18n/en.js (window.I18N.<lang>). */
(function () {
  "use strict";

  var root = document.documentElement;
  var DICT = window.I18N || {};
  var LANGS = ["ko", "ru", "en"];
  var DEFAULT_LANG = "ko";

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { /* storage blocked (private mode, file://) — ignore */ }
    return null;
  }

  /* ---------- i18n ---------- */

  // Remember the Korean fallback that ships in the HTML, so a key missing
  // from one language never leaves text from a previously chosen language.
  var textEls = Array.prototype.slice.call(document.querySelectorAll("[data-i]"));
  var ariaEls = Array.prototype.slice.call(document.querySelectorAll("[data-i-aria]"));
  var altEls = Array.prototype.slice.call(document.querySelectorAll("[data-i-alt]"));
  textEls.forEach(function (el) { el._fb = el.innerHTML; });
  ariaEls.forEach(function (el) { el._fb = el.getAttribute("aria-label") || ""; });
  altEls.forEach(function (el) { el._fb = el.getAttribute("alt") || ""; });

  var metaDesc = document.querySelector('meta[name="description"]');
  var fallbackTitle = document.title;
  var fallbackDesc = metaDesc ? metaDesc.getAttribute("content") : "";

  function lookup(lang, key) {
    var d = DICT[lang];
    return d && typeof d[key] === "string" ? d[key] : undefined;
  }

  function plain(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || "").trim();
  }

  // Callbacks that must re-run when the language changes (e.g. built aria-labels).
  var onLang = [];
  function t(key) {
    var v = lookup(root.getAttribute("lang"), key);
    if (v === undefined) v = lookup(DEFAULT_LANG, key);
    return v === undefined ? "" : plain(v);
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;
    root.setAttribute("lang", lang);

    textEls.forEach(function (el) {
      var v = lookup(lang, el.getAttribute("data-i"));
      el.innerHTML = v !== undefined ? v : el._fb;
    });
    ariaEls.forEach(function (el) {
      var v = lookup(lang, el.getAttribute("data-i-aria"));
      el.setAttribute("aria-label", v !== undefined ? plain(v) : el._fb);
    });
    altEls.forEach(function (el) {
      var v = lookup(lang, el.getAttribute("data-i-alt"));
      el.setAttribute("alt", v !== undefined ? plain(v) : el._fb);
    });

    var t = lookup(lang, "meta.title");
    document.title = t !== undefined ? plain(t) : fallbackTitle;
    if (metaDesc) {
      var d = lookup(lang, "meta.desc");
      metaDesc.setAttribute("content", d !== undefined ? plain(d) : fallbackDesc);
    }

    var btns = document.querySelectorAll(".lang button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", btns[i].getAttribute("data-l") === lang ? "true" : "false");
    }
    store("lang", lang);
    onLang.forEach(function (fn) { fn(lang); });
  }

  function initialLang() {
    var fromUrl = null;
    try {
      fromUrl = new URLSearchParams(window.location.search).get("lang");
    } catch (e) {
      var m = /[?&]lang=([a-z]{2})/i.exec(window.location.search);
      fromUrl = m ? m[1] : null;
    }
    if (fromUrl) fromUrl = fromUrl.toLowerCase();
    if (LANGS.indexOf(fromUrl) !== -1) return fromUrl;
    var saved = store("lang");
    if (LANGS.indexOf(saved) !== -1) return saved;
    return DEFAULT_LANG;
  }

  var langBtns = document.querySelectorAll(".lang button");
  for (var i = 0; i < langBtns.length; i++) {
    langBtns[i].addEventListener("click", function () {
      var lang = this.getAttribute("data-l");
      setLang(lang);
      // Keep a shared link in sync if it carried ?lang=
      try {
        var url = new URL(window.location.href);
        if (url.searchParams.has("lang")) {
          url.searchParams.set("lang", lang);
          window.history.replaceState(null, "", url.toString());
        }
      } catch (e) { /* file:// or old browser — ignore */ }
    });
  }

  setLang(initialLang());

  /* ---------- Theme ---------- */

  var themeBtn = document.querySelector(".theme");
  var darkMQ = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return !!(darkMQ && darkMQ.matches);
  }
  function syncThemeBtn() {
    if (themeBtn) themeBtn.setAttribute("aria-pressed", isDark() ? "true" : "false");
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store("theme", next);
      syncThemeBtn();
    });
  }
  if (darkMQ) {
    var onChange = function () { syncThemeBtn(); };
    if (darkMQ.addEventListener) darkMQ.addEventListener("change", onChange);
    else if (darkMQ.addListener) darkMQ.addListener(onChange);
  }
  syncThemeBtn();

  /* ---------- Reveal + language bars ---------- */

  var reveal = Array.prototype.slice.call(document.querySelectorAll(".rv"));
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Stagger elements that appear together (siblings inside the same parent).
  if (!reduce) {
    reveal.forEach(function (el) {
      var i = 0, s = el.previousElementSibling;
      while (s) { if (s.classList.contains("rv")) i++; s = s.previousElementSibling; }
      if (i) el.style.transitionDelay = Math.min(i, 5) * 90 + "ms";
    });
  }

  function countUp(node) {
    var to = parseInt(node.getAttribute("data-to"), 10);
    if (!to || reduce || !window.requestAnimationFrame) { node.textContent = String(to || node.textContent); return; }
    var start = null, dur = 1400;
    node.textContent = "0";
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      node.textContent = String(Math.round(to * eased));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  function show(el) {
    el.classList.add("in");
    var bars = el.querySelectorAll(".bar i");
    for (var j = 0; j < bars.length; j++) bars[j].style.width = bars[j].getAttribute("data-w") + "%";
    var counts = el.querySelectorAll(".count");
    for (var c = 0; c < counts.length; c++) countUp(counts[c]);
  }

  if (reduce || !("IntersectionObserver" in window)) {
    reveal.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    reveal.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Scroll progress, active nav link, back-to-top ---------- */

  var bar = document.querySelector(".progress i");
  var toTop = document.querySelector(".to-top");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".links a"));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  var ticking = false;

  function onScroll() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.setProperty("--p", max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
    if (toTop) toTop.classList.toggle("show", y > window.innerHeight * 0.9);

    var line = y + window.innerHeight * 0.35, current = -1;
    sections.forEach(function (sec, i) { if (sec && sec.offsetTop <= line) current = i; });
    if (max > 0 && y >= max - 4) current = sections.length - 1;
    navLinks.forEach(function (a, i) {
      var on = i === current;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Copy e-mail ---------- */

  var copyBtn = document.querySelector(".copy");
  var copied = document.querySelector(".copied");
  var copiedTimer;
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-copy");
      var done = function () {
        if (!copied) return;
        copied.textContent = t("ct.copied");
        clearTimeout(copiedTimer);
        copiedTimer = setTimeout(function () { copied.textContent = ""; }, 2500);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { window.location.href = "mailto:" + text; });
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ }
        document.body.removeChild(ta);
      }
    });
  }
  onLang.push(function () { if (copied) copied.textContent = ""; });

  /* ---------- Gallery viewer ---------- */

  var lb = document.querySelector(".lightbox");
  var zooms = Array.prototype.slice.call(document.querySelectorAll(".gallery .zoom"));
  if (lb && zooms.length && typeof lb.showModal === "function") {
    var lbImg = lb.querySelector(".lb-img");
    var lbCap = lb.querySelector(".lb-cap");
    var lbCount = lb.querySelector(".lb-count");
    var idx = 0, opener = null;

    var caption = function (i) {
      var cap = zooms[i].parentNode.querySelector("figcaption");
      return cap ? cap.textContent.trim() : "";
    };
    var labelZooms = function () {
      zooms.forEach(function (z, i) { z.setAttribute("aria-label", t("lb.open") + ": " + caption(i)); });
    };
    var render = function () {
      var img = zooms[idx].querySelector("img");
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || caption(idx);
      lbCap.textContent = caption(idx);
      lbCount.textContent = (idx + 1) + " / " + zooms.length;
    };
    var go = function (d) { idx = (idx + d + zooms.length) % zooms.length; render(); };

    zooms.forEach(function (z, i) {
      z.addEventListener("click", function () { idx = i; opener = z; render(); lb.showModal(); });
    });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { go(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { go(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    });
    lb.addEventListener("close", function () { if (opener) opener.focus(); });

    // Swipe on touch screens
    var sx = null;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      sx = null;
    });

    labelZooms();
    onLang.push(function () { labelZooms(); if (lb.open) render(); });
  } else {
    // No <dialog> support: show photos as plain images, not dead buttons.
    zooms.forEach(function (z) { z.setAttribute("tabindex", "-1"); z.style.cursor = "default"; });
  }

  // Move focus into <main> after using the skip link (Safari needs this).
  var skip = document.querySelector(".skip");
  var main = document.getElementById("main");
  if (skip && main) skip.addEventListener("click", function () { main.focus(); });

  /* ---------- Motion: hero spotlight + 3D tilt ---------- */

  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!reduce && finePointer) {
    var hero = document.querySelector(".hero");
    if (hero) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
        hero.style.setProperty("--my", (e.clientY - r.top) + "px");
        hero.classList.add("lit");
      });
      hero.addEventListener("pointerleave", function () { hero.classList.remove("lit"); });
    }

    var tilts = document.querySelectorAll(".hero .photo, .st, .edu .card");
    Array.prototype.forEach.call(tilts, function (el) {
      var max = el.classList.contains("photo") ? 7 : 5;
      el.classList.add("tilt");
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.classList.add("tilting");
        el.style.transform = "perspective(900px) rotateX(" + (-y * max).toFixed(2) + "deg) rotateY(" + (x * max).toFixed(2) + "deg) translateY(-4px)";
      });
      el.addEventListener("pointerleave", function () {
        el.classList.remove("tilting");
        el.style.transform = "";
      });
    });
  }
})();
