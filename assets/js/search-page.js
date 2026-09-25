/* ============================================================
   Sentinel Dynamics — Product Search
   Free-text requirement matching + category/status/price/spec filters
   ============================================================ */

(function () {
  "use strict";

  const resultsEl = document.getElementById("search-results");
  if (!resultsEl) return;

  const products = window.SENTINEL_PRODUCTS || [];
  const countEl = document.getElementById("search-count");
  const queryEl = document.getElementById("search-query");
  const categoryEl = document.getElementById("filter-category");
  const statusEl = document.getElementById("filter-status");
  const priceEl = document.getElementById("filter-price");
  const specsEl = document.getElementById("filter-specs");
  const resetBtn = document.getElementById("search-reset");

  const STOPWORDS = new Set(["i", "a", "an", "the", "need", "for", "with", "and", "or", "of", "to", "want", "looking", "system", "platform"]);

  const activeSpecTags = new Set();

  function buildSpecTags() {
    const tags = new Set();
    products.forEach((p) => (p.highlights || []).forEach((h) => tags.add(h)));
    return Array.from(tags).sort();
  }

  function renderSpecPills() {
    const tags = buildSpecTags();
    specsEl.innerHTML = tags
      .map((tag) => `<button type="button" class="forge-pill" data-tag="${window.escapeHtml(tag)}">${window.escapeHtml(tag)}</button>`)
      .join("");
    specsEl.querySelectorAll(".forge-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = btn.dataset.tag;
        if (activeSpecTags.has(tag)) {
          activeSpecTags.delete(tag);
          btn.classList.remove("is-selected");
        } else {
          activeSpecTags.add(tag);
          btn.classList.add("is-selected");
        }
        runSearch();
      });
    });
  }

  function score(product, words) {
    if (words.length === 0) return 1;
    const haystackName = product.name.toLowerCase();
    const haystackCategory = (window.SENTINEL_CATEGORY_LABELS[product.category] || "").toLowerCase() + " " + product.category;
    const haystackRest = (product.short + " " + product.description + " " + product.tag + " " + (product.highlights || []).join(" ")).toLowerCase();
    let s = 0;
    words.forEach((w) => {
      if (haystackCategory.includes(w)) s += 3;
      if (haystackName.includes(w)) s += 2;
      if (haystackRest.includes(w)) s += 1;
    });
    return s;
  }

  function runSearch() {
    const rawQuery = queryEl.value.trim().toLowerCase();
    const words = rawQuery.split(/\s+/).filter((w) => w && !STOPWORDS.has(w));
    const category = categoryEl.value;
    const status = statusEl.value;
    const priceRange = priceEl.value;

    let filtered = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (status !== "all" && p.status !== status) return false;
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        if (p.priceINR < min || p.priceINR > max) return false;
      }
      if (activeSpecTags.size > 0) {
        const has = (p.highlights || []).some((h) => activeSpecTags.has(h));
        if (!has) return false;
      }
      return true;
    });

    if (words.length > 0) {
      filtered = filtered
        .map((p) => ({ p, s: score(p, words) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.p);
    }

    resultsEl.innerHTML = filtered.map((p) => window.renderProductTile(p)).join("");
    countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      resultsEl.innerHTML = '<p class="lead" style="grid-column:1/-1;">No platforms match that combination. Try clearing a filter or rephrasing your requirement.</p>';
    }
  }

  queryEl.addEventListener("input", runSearch);
  categoryEl.addEventListener("change", runSearch);
  statusEl.addEventListener("change", runSearch);
  priceEl.addEventListener("change", runSearch);
  resetBtn.addEventListener("click", () => {
    queryEl.value = "";
    categoryEl.value = "all";
    statusEl.value = "all";
    priceEl.value = "all";
    activeSpecTags.clear();
    specsEl.querySelectorAll(".forge-pill").forEach((b) => b.classList.remove("is-selected"));
    runSearch();
  });

  renderSpecPills();
  runSearch();
})();
