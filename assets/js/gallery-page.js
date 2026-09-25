/* ============================================================
   Sentinel Dynamics — Gallery
   Placeholder tiles (icon + gradient) ready to swap for real
   photography — full filtering, hover reveal and lightbox viewer
   are fully functional now.
   ============================================================ */

(function () {
  "use strict";

  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const CATEGORY_ICON = {
    aircraft: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    fpv: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    vtol: '<path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"/><path d="M9 12l2 2 4-4"/>',
    development: '<path d="M12 2v14M12 2l4 4M12 2 8 6"/><path d="M5 14a7 7 0 0 0 14 0"/>',
    testing: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><path d="M9 12l2 2 4-4"/>',
    exhibition: '<path d="M12 2 2 8h20L12 2Z"/><path d="M4 8v12M20 8v12M9 8v12M15 8v12"/><path d="M2 20h20"/>',
    events: '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4a3 3 0 0 0 3 3M17 5h3a3 3 0 0 1-3 3"/>',
  };

  const CATEGORY_LABEL = {
    aircraft: "Aircraft",
    fpv: "FPV",
    vtol: "VTOL",
    development: "Development",
    testing: "Testing",
    exhibition: "Exhibition",
    events: "Events",
  };

  const ITEMS = [
    { id: 1, category: "aircraft", title: "10-Inch Tactical Drone — Airframe" },
    { id: 2, category: "aircraft", title: "15-Inch Surveillance Platform" },
    { id: 3, category: "aircraft", title: "Tailsitter VTOL — Full Assembly" },
    { id: 4, category: "fpv", title: "7-Inch FPV Interceptor Build" },
    { id: 5, category: "fpv", title: "5-Inch FPV Interceptor — Close-Up" },
    { id: 6, category: "fpv", title: "FPV Bench Setup" },
    { id: 7, category: "vtol", title: "ANIKETRA VTOL — Spatian Aviation Collaboration" },
    { id: 8, category: "vtol", title: "VTOL Transition Test" },
    { id: 9, category: "vtol", title: "VTOL Payload Bay" },
    { id: 10, category: "development", title: "Airframe Design Review" },
    { id: 11, category: "development", title: "Avionics Bench Integration" },
    { id: 12, category: "development", title: "Prototype Fabrication" },
    { id: 13, category: "testing", title: "Flight-Control Validation" },
    { id: 14, category: "testing", title: "High-Speed Interceptor Test Run" },
    { id: 15, category: "testing", title: "Thermal Payload Field Test" },
    { id: 16, category: "exhibition", title: "HITEX Drone Expo, 2025" },
    { id: 17, category: "exhibition", title: "Static Display — Fleet Lineup" },
    { id: 18, category: "events", title: "DPS IT Fest Drone Competition, 2025" },
    { id: 19, category: "events", title: "Team on the Show Floor" },
  ];

  function svg(cat) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (CATEGORY_ICON[cat] || "") + "</svg>";
  }

  const filtersEl = document.getElementById("gallery-filters");
  const categories = ["all", "aircraft", "fpv", "vtol", "development", "testing", "exhibition", "events"];
  let active = "all";
  let visibleItems = ITEMS;
  let lightboxIndex = 0;

  function renderFilters() {
    filtersEl.innerHTML = categories
      .map((c) => `<button type="button" class="forge-pill${c === active ? " is-selected" : ""}" data-cat="${c}">${c === "all" ? "All" : CATEGORY_LABEL[c]}</button>`)
      .join("");
    filtersEl.querySelectorAll(".forge-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        active = btn.dataset.cat;
        renderFilters();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    visibleItems = active === "all" ? ITEMS : ITEMS.filter((i) => i.category === active);
    grid.innerHTML = visibleItems
      .map(
        (item, i) => `<div class="gallery-tile reveal" data-index="${i}">
          <div class="gallery-tile__bg">${svg(item.category)}</div>
          <div class="gallery-tile__overlay">
            <span class="gallery-tile__cat">${CATEGORY_LABEL[item.category]}</span>
            <span class="gallery-tile__title">${window.escapeHtml(item.title)}</span>
          </div>
        </div>`
      )
      .join("");
    grid.querySelectorAll(".gallery-tile").forEach((tile) => {
      tile.addEventListener("click", () => openLightbox(Number(tile.dataset.index)));
    });
  }

  const lightbox = document.getElementById("gallery-lightbox");
  const stage = document.getElementById("lightbox-stage");
  const caption = document.getElementById("lightbox-caption");

  function renderLightbox() {
    const item = visibleItems[lightboxIndex];
    if (!item) return;
    stage.innerHTML = svg(item.category);
    caption.textContent = CATEGORY_LABEL[item.category] + " — " + item.title;
  }

  function openLightbox(index) {
    lightboxIndex = index;
    renderLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  function step(delta) {
    lightboxIndex = (lightboxIndex + delta + visibleItems.length) % visibleItems.length;
    renderLightbox();
  }

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => step(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  renderFilters();
  renderGrid();
})();
