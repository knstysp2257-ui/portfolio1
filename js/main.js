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

  function show(el) {
    el.classList.add("in");
    var bars = el.querySelectorAll(".bar i");
    for (var j = 0; j < bars.length; j++) bars[j].style.width = bars[j].getAttribute("data-w") + "%";
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

  // Move focus into <main> after using the skip link (Safari needs this).
  var skip = document.querySelector(".skip");
  var main = document.getElementById("main");
  if (skip && main) skip.addEventListener("click", function () { main.focus(); });
})();
