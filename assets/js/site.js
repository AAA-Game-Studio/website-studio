/* AAA Game Studio site behaviour: hero slider and EN/VI language switch.
   Every browser-storage access is wrapped in try/catch, so the page works
   when storage is blocked. */
(function () {
  "use strict";

  /* Hero slider (only on pages that have one) */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var dotsEl = document.getElementById("dots");
  if (slides.length && dotsEl) {
    var cur = 0;
    var timer = null;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var show = function (i) {
      cur = i;
      slides.forEach(function (s, k) { s.classList.toggle("on", k === i); });
      Array.prototype.forEach.call(dotsEl.children, function (d, k) {
        d.setAttribute("aria-current", k === i ? "true" : "false");
      });
    };
    var restart = function () {
      if (reduce) return;
      clearInterval(timer);
      timer = setInterval(function () { show((cur + 1) % slides.length); }, 6500);
    };

    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dot";
      b.setAttribute("aria-label", "Slide " + (i + 1));
      b.addEventListener("click", function () { show(i); restart(); });
      dotsEl.appendChild(b);
    });
    show(0);
    restart();
  }

  /* Language switch: elements carry data-en and data-vi; a missing data-vi keeps the English text. */
  function setLang(l) {
    document.documentElement.lang = l;
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var t = el.getAttribute("data-" + l) || el.getAttribute("data-en");
      if (el.hasAttribute("data-html")) el.innerHTML = t; else el.textContent = t;
    });
    var en = document.getElementById("l-en");
    var vi = document.getElementById("l-vi");
    if (en) en.setAttribute("aria-pressed", String(l === "en"));
    if (vi) vi.setAttribute("aria-pressed", String(l === "vi"));
    try { localStorage.setItem("lang", l); } catch (e) { /* storage blocked: language still switches for this visit */ }
  }

  var btnEn = document.getElementById("l-en");
  var btnVi = document.getElementById("l-vi");
  if (btnEn) btnEn.addEventListener("click", function () { setLang("en"); });
  if (btnVi) btnVi.addEventListener("click", function () { setLang("vi"); });
  try {
    if (localStorage.getItem("lang") === "vi") setLang("vi");
  } catch (e) { /* storage blocked: stay on English */ }
})();
