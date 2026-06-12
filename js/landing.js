/* small p club — landing page motion
   Editorial parallax + scroll reveals. Calm easing, no bounce.
   Respects prefers-reduced-motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav: solidify on scroll ---------- */
  var nav = document.getElementById("nav");
  function onNavScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  onNavScroll();
  window.addEventListener("scroll", onNavScroll, { passive: true });

  /* ---------- Hero entrance: staggered words + lede ---------- */
  (function heroIn() {
    if (reduce) return;
    var words = document.querySelectorAll("#heroTitle .word");
    words.forEach(function (w, i) {
      w.style.opacity = "0";
      w.style.transform = "translateY(0.5em)";
      w.style.transition = "opacity 0.7s cubic-bezier(0.2,0.7,0.2,1), transform 0.7s cubic-bezier(0.2,0.7,0.2,1)";
      w.style.transitionDelay = (0.12 + i * 0.075) + "s";
    });
    ["heroLede", "heroCta"].forEach(function (id, k) {
      var el = document.getElementById(id);
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      el.style.transitionDelay = (0.45 + k * 0.12) + "s";
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        words.forEach(function (w) { w.style.opacity = ""; w.style.transform = ""; });
        ["heroLede", "heroCta"].forEach(function (id) {
          var el = document.getElementById(id);
          el.style.opacity = ""; el.style.transform = "";
        });
      });
    });
  })();

  /* ---------- Marquee: build + infinite scroll ---------- */
  (function marquee() {
    var track = document.getElementById("marquee");
    if (!track) return;
    var claims = [
      "size does not define value",
      "stop counting, start living",
      "confidence has no scale",
      "more knowing, less measuring",
      "small p, big club",
      "no measure, no pressure"
    ];
    function buildItem(text, alt) {
      var span = document.createElement("span");
      span.className = "marquee__item" + (alt ? " alt" : "");
      span.innerHTML = text + ' <span class="star">✳</span>';
      return span;
    }
    // two copies for seamless loop
    for (var pass = 0; pass < 2; pass++) {
      claims.forEach(function (c, i) { track.appendChild(buildItem(c, i % 2 === 1)); });
    }
    if (reduce) return;
    var x = 0, half = 0, last = performance.now();
    function measure() { half = track.scrollWidth / 2; }
    measure();
    window.addEventListener("resize", measure);
    function tick(now) {
      var dt = Math.min(now - last, 50); last = now;
      x -= dt * 0.045; // px per ms
      if (half && -x >= half) x += half;
      track.style.transform = "translateX(" + x + "px)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  /* ---------- Scroll reveals (rAF + rect; robust in embedded previews) ---------- */
  var revealEls = [];
  (function reveals() {
    var els = [].slice.call(document.querySelectorAll(".reveal"));
    if (reduce) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    els.forEach(function (el) {
      var from = el.getAttribute("data-from");
      if (from === "left") { el.style.transform = "translateX(-40px)"; }
      else if (from === "right") { el.style.transform = "translateX(40px)"; }
    });
    revealEls = els;
  })();

  function checkReveals() {
    if (!revealEls.length) return;
    var trigger = window.innerHeight * 0.9;
    for (var i = revealEls.length - 1; i >= 0; i--) {
      var el = revealEls[i];
      var rect = el.getBoundingClientRect();
      if (rect.top < trigger && rect.bottom > 0) {
        el.style.transform = "";
        el.classList.add("in");
        revealEls.splice(i, 1);
      }
    }
  }

  /* ---------- Animated counters (rAF + rect) ---------- */
  var countEls = [];
  (function counters() {
    countEls = [].slice.call(document.querySelectorAll("[data-count]"));
  })();
  function fmtNum(n) { return n >= 1000 ? n.toLocaleString("en-US") : String(n); }
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduce || target === 0) { el.textContent = fmtNum(target); return; }
    var dur = 1500, start = performance.now();
    function step(now) {
      var t = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmtNum(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function checkCounters() {
    if (!countEls.length) return;
    var trigger = window.innerHeight * 0.85;
    for (var i = countEls.length - 1; i >= 0; i--) {
      var rect = countEls[i].getBoundingClientRect();
      if (rect.top < trigger && rect.bottom > 0) {
        runCounter(countEls[i]);
        countEls.splice(i, 1);
      }
    }
  }

  /* ---------- Parallax (rAF, transform only) ---------- */
  (function parallax() {
    if (reduce) return;
    var items = [].map.call(document.querySelectorAll("[data-parallax]"), function (el) {
      return { el: el, speed: parseFloat(el.getAttribute("data-parallax")), base: "" };
    });
    var bands = [].map.call(document.querySelectorAll("[data-parallax-bg]"), function (el) {
      return { el: el, speed: parseFloat(el.getAttribute("data-parallax-bg")), parent: el.closest(".band") };
    });
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      items.forEach(function (it) {
        var rect = it.el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - vh / 2) * it.speed;
        it.el.style.transform = "translate3d(0," + (-offset).toFixed(1) + "px,0)";
      });
      bands.forEach(function (b) {
        if (!b.parent) return;
        var rect = b.parent.getBoundingClientRect();
        var progress = (rect.top + rect.height / 2 - vh / 2);
        b.el.style.transform = "translate3d(0," + (-progress * b.speed).toFixed(1) + "px,0)";
      });
      checkReveals();
      checkCounters();
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  })();

  /* ---------- Master scroll loop: reveals + counters (always on, synchronous) ---------- */
  (function scrollWatch() {
    function run() { checkReveals(); checkCounters(); }
    // Synchronous on scroll so it still fires if rAF is throttled (e.g. background/preview).
    window.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run);
    run();
    setTimeout(run, 120);
    setTimeout(run, 400);
  })();

  /* ---------- Signup mock ---------- */
  (function signup() {
    var form = document.getElementById("signup");
    var btn = document.getElementById("joinBtn");
    if (!form) return;
    form.addEventListener("submit", function () {
      var input = form.querySelector("input");
      if (!input.value) { input.focus(); return; }
      form.innerHTML = '<div style="font-family:var(--font-body);font-size:18px;color:var(--spc-turquoise);display:flex;align-items:center;gap:10px;padding:6px 0;">' +
        '<img src="../../assets/logo/smallpclub-mark-turquoise.svg" alt="" style="width:24px;height:21px;"> you\'re in. welcome to the club.</div>';
    });
  })();
})();
