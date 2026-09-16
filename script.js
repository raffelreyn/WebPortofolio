/* ================================================================
   RAFFEL — personal branding site — interactions
   Vanilla JS. No dependencies.
   ================================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.documentElement.classList.add("js");

  /* ------------------------------------------------------------
     1. STICKY NAV — opaque on scroll
  ------------------------------------------------------------ */
  var nav = document.getElementById("nav");
  function onScrollNav() {
    nav.classList.toggle("is-scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* Publish the real nav height so the hero caption (pinned under the nav)
     and scroll offsets stay correct at every breakpoint. */
  function measureNav() {
    var h = nav ? Math.round(nav.getBoundingClientRect().height) : 72;
    document.documentElement.style.setProperty("--nav-h", h + "px");
  }
  measureNav();
  window.addEventListener("resize", measureNav);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureNav);

  /* ------------------------------------------------------------
       2. MOBILE MENU
  ------------------------------------------------------------ */
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu");

  // Build the mobile menu links from the desktop nav for easy maintenance.
  var navLinks = document.querySelectorAll(".nav__links a");
  mobileMenu.innerHTML = "";
  navLinks.forEach(function (a, i) {
    var el = document.createElement("a");
    var num = String(i + 1).padStart(2, "0");
    el.textContent = num + " / " + a.textContent;
    el.href = a.getAttribute("href");
    el.addEventListener("click", closeMenu);
    mobileMenu.appendChild(el);
  });

  function closeMenu() {
    mobileMenu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
  }
  function openMenu() {
    mobileMenu.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
  }
  burger.addEventListener("click", function () {
    var open = burger.getAttribute("aria-expanded") === "true";
    open ? closeMenu() : openMenu();
  });

  // Close the mobile menu if the viewport grows wide again.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 820) closeMenu();
  });

  /* ------------------------------------------------------------
     3. SCROLL REVEAL — IntersectionObserver
  ------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ------------------------------------------------------------
     4. HERO / PARALLAX — subtle vertical shift (no motion if reduced)
        The shift is applied to the IMG inside a static, overflow-hidden
        box, and clamped to the image's slack — so it can never bleed
        past the hero edge into the next section.
  ------------------------------------------------------------ */
  if (!reduceMotion) {
    var heroImg = document.querySelector(".hero__img");
    var heroSection = document.querySelector(".hero");
    if (heroImg && heroSection) {
      var ticking = false;
      function updateParallax() {
        ticking = false;
        var h = heroSection.offsetHeight || window.innerHeight;
        // travel only while the hero is on screen
        var y = Math.min(Math.max(window.scrollY, 0), h);
        // 12.5% of the hero height is the slack built into .hero__img
        var shift = Math.min(y * 0.25, h * 0.125);
        heroImg.style.setProperty("--py", shift.toFixed(1));
      }
      window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(updateParallax); }
      }, { passive: true });
      window.addEventListener("resize", updateParallax);
      updateParallax();
    }
  }

  /* ------------------------------------------------------------
     5. GENTLE MEDIA TILT — projects / outside images
         subtle 3D follow of the cursor, returns on leave
  ------------------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-tilt-media]").forEach(function (wrap) {
      var img = wrap.querySelector("img");
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (img) img.style.transform =
          "scale(1.04) rotateX(" + (-py * 4).toFixed(2) + "deg) rotateY(" + (px * 4).toFixed(2) + "deg)";
      });
      wrap.addEventListener("mouseleave", function () {
        if (img) img.style.transform = "scale(1) rotateX(0) rotateY(0)";
      });
    });
  }

  /* ------------------------------------------------------------
     6. VINYL / RECORDS — interactive album collection
         On hover: cover tilts with cursor, vinyl slides out & spins.
         On touch / reduced motion: simple tap toggle.
  ------------------------------------------------------------ */
  var records = document.querySelectorAll("[data-record]");
  function resetRecord(r) {
    r.classList.remove("hover");
    r.style.setProperty("--rx", "0deg");
    r.style.setProperty("--ry", "0deg");
  }
  if (finePointer && !reduceMotion) {
    records.forEach(function (r) {
      var mode = "normal";
      r.addEventListener("mouseenter", function () { mode = "hover"; r.classList.add("hover"); });
      r.addEventListener("mouseleave", function () { mode = "normal"; resetRecord(r); });
      r.addEventListener("mousemove", function (e) {
        if (mode !== "hover") return;
        var rect = r.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        r.style.setProperty("--rx", (-py * 12).toFixed(2) + "deg");
        r.style.setProperty("--ry", (px * 14).toFixed(2) + "deg");
      });
    });
  } else {
    // touch / reduced-motion: tapping the cover toggles the vinyl reveal
    records.forEach(function (r) {
      r.addEventListener("click", function () {
        r.classList.toggle("hover");
        if (!r.classList.contains("hover")) {
          r.style.setProperty("--rx", "0deg");
          r.style.setProperty("--ry", "0deg");
        }
      });
    });
  }

  /* ------------------------------------------------------------
     7. AUTOMOTIVE — garage image tilt
         Cursor moves the photo, specs shift slightly, all subtle.
  ------------------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".car .car__media").forEach(function (media) {
      var img = media.querySelector("img");
      var spec = media.querySelector(".car__spec");
      media.addEventListener("mousemove", function (e) {
        var r = media.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (img) img.style.transform =
          "scale(1.06) translate3d(" + (px * 10).toFixed(1) + "px," + (py * 8).toFixed(1) + "px,0)";
        if (spec) spec.style.transform = "translate(" + (px * -8).toFixed(1) + "px," + (py * -6).toFixed(1) + "px)";
      });
      media.addEventListener("mouseleave", function () {
        if (img) img.style.transform = "scale(1) translate3d(0,0,0)";
        if (spec) spec.style.transform = "translate(0,0)";
      });
    });
  }

  /* ------------------------------------------------------------
     8. CUSTOM CURSOR — very subtle; desktop only
  ------------------------------------------------------------ */
  if (finePointer) {
    var cursor = document.getElementById("cursor");
    var dot = document.getElementById("cursorDot");
    var cursorShown = false;

    // Keep the custom cursor hidden (and the native cursor visible) until the
    // pointer actually moves. Otherwise it sits parked at the top-left corner
    // (position: fixed) with cursor:none applied — looking like a stray circle
    // that never goes away when scrolling.
    cursor.style.visibility = "hidden";
    dot.style.visibility = "hidden";

    window.addEventListener("mousemove", function (e) {
      if (!cursorShown) {
        cursorShown = true;
        cursor.style.visibility = "visible";
        dot.style.visibility = "visible";
        document.body.classList.add("has-cursor");
      }
      dot.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
      cursor.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
    }, { passive: true });

    // enlarge + label on interactive / interesting regions
    var interactive = "a, button, .record, .car__media, [data-tilt-media]";
    var labels = {
      ".record": "EXPLORE",
      ".car__media": "MOVE",
      ".project__media": "VIEW"
    };
    function pickLabel(el) {
      for (var sel in labels) {
        if (el && el.closest && el.closest(sel)) return labels[sel];
      }
      return null;
    }
    document.addEventListener("mouseover", function (e) {
      var t = e.target;
      if (t.closest && t.closest(interactive)) {
        cursor.classList.add("is-hover");
        var lbl = pickLabel(t.closest(interactive));
        cursor.style.setProperty("--lbl", lbl ? '"' + lbl + '"' : '"EXPLORE"');
      } else {
        cursor.classList.remove("is-hover");
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && !e.target.closest(interactive)) {
        cursor.classList.remove("is-hover");
      }
    });
  }

  /* ------------------------------------------------------------
     9. PLACEHOLDER / SOCIAL LINKS — don't let them break / jump
  ------------------------------------------------------------ */
  document.querySelectorAll('a[data-placeholder], a[data-social], .contact__link').forEach(function (a) {
    a.addEventListener("click", function (e) {
      // Real links (href bukan "#") dibiarkan jalan normal;
      // placeholder ("#") tetap dicegah biar nggak jump ke atas.
      if (a.getAttribute("href") === "#") e.preventDefault();
    });
  });

  /* ------------------------------------------------------------
     10. EDU TICKER — duplicate inner content for a seamless -50% loop
  ------------------------------------------------------------ */
  var tickerTrack = document.querySelector(".edu__ticker-track");
  if (tickerTrack) {
    tickerTrack.innerHTML = tickerTrack.innerHTML + tickerTrack.innerHTML;
  }
})();
