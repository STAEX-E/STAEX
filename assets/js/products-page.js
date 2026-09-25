/* ============================================================
   Sentinel Dynamics — Products page: render + category filter
   Runs synchronously at parse time (script sits after #products-grid
   in the DOM) so the grid is populated before main.js's
   DOMContentLoaded reveal-observer runs.
   ============================================================ */

(function () {
  "use strict";

  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const countEl = document.getElementById("products-count");
  const select = document.getElementById("category-filter");
  const products = window.SENTINEL_PRODUCTS || [];

  function paramCategory() {
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || "all";
  }

  function render(category) {
    const filtered = category === "all" ? products : products.filter((p) => p.category === category);
    grid.innerHTML = filtered.map((p) => window.renderProductTile(p)).join("");
    if (countEl) countEl.textContent = filtered.length;
  }

  const initial = paramCategory();
  if (select) {
    select.value = initial;
    select.addEventListener("change", () => render(select.value));
  }
  render(initial);
})();
