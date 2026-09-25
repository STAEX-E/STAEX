/* ============================================================
   STAEX — Core interactions: nav state, scroll progress, reveals
   ============================================================ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".nav");
    const progress = document.getElementById("scroll-progress");

    function onScroll() {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (nav) nav.classList.toggle("scrolled", scrollY > 24);
      if (progress && docH > 0) {
        progress.style.width = `${Math.min(100, (scrollY / docH) * 100)}%`;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Reveal-on-scroll
    const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("in-view"));
    }

    // Smooth in-page anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href").slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  });
})();
