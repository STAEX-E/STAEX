/* ============================================================
   Sentinel Dynamics — Compare Systems
   Select 2-4 platforms and compare category, status, price and
   every spec attribute across the selection.
   ============================================================ */

(function () {
  "use strict";

  const pickersEl = document.getElementById("compare-pickers");
  if (!pickersEl) return;

  const products = window.SENTINEL_PRODUCTS || [];
  const emptyEl = document.getElementById("compare-empty");
  const tableWrap = document.getElementById("compare-table-wrap");
  const tableEl = document.getElementById("compare-table");

  const SLOT_COUNT = 4;
  const slots = new Array(SLOT_COUNT).fill("");

  function optionsMarkup(selected) {
    const byCategory = {};
    products.forEach((p) => {
      byCategory[p.category] = byCategory[p.category] || [];
      byCategory[p.category].push(p);
    });
    let html = `<option value="">— Select a platform —</option>`;
    Object.keys(byCategory).forEach((cat) => {
      html += `<optgroup label="${window.escapeHtml(window.SENTINEL_CATEGORY_LABELS[cat] || cat)}">`;
      html += byCategory[cat]
        .map((p) => `<option value="${p.id}"${p.id === selected ? " selected" : ""}>${window.escapeHtml(p.name)}</option>`)
        .join("");
      html += "</optgroup>";
    });
    return html;
  }

  function renderPickers() {
    pickersEl.innerHTML = slots
      .map(
        (val, i) => `<div class="forge-field">
          <label for="compare-slot-${i}">Platform ${i + 1}</label>
          <div class="select-field"><select id="compare-slot-${i}" data-slot="${i}">${optionsMarkup(val)}</select></div>
        </div>`
      )
      .join("");
    pickersEl.querySelectorAll("select").forEach((sel) => {
      sel.addEventListener("change", () => {
        slots[Number(sel.dataset.slot)] = sel.value;
        renderTable();
      });
    });
  }

  function labelize(key) {
    const spaced = key.replace(/([A-Z])/g, " $1");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  function renderTable() {
    const selected = slots.map((id) => products.find((p) => p.id === id)).filter(Boolean);

    if (selected.length < 2) {
      emptyEl.style.display = "";
      tableWrap.style.display = "none";
      return;
    }
    emptyEl.style.display = "none";
    tableWrap.style.display = "";

    const specKeys = [];
    selected.forEach((p) => {
      Object.keys(p.specs || {}).forEach((k) => {
        if (!specKeys.includes(k)) specKeys.push(k);
      });
    });

    let html = "<thead><tr><th>Attribute</th>";
    html += selected
      .map(
        (p, i) =>
          `<th><span class="compare-name">${window.escapeHtml(p.name)}</span><button class="compare-remove" type="button" data-clear="${slots.indexOf(p.id)}" title="Remove">✕</button></th>`
      )
      .join("");
    html += "</tr></thead><tbody>";

    const rows = [
      ["Category", (p) => window.SENTINEL_CATEGORY_LABELS[p.category] || p.category],
      ["Status", (p) => (p.status === "concept" ? "CONCEPT" : "ACTIVE")],
      ["Estimated Price", (p) => window.formatINR(p.priceINR)],
      ["Configurable", (p) => (p.configurable ? "Yes — via Forge Lab" : "No — Request Info")],
    ];
    specKeys.forEach((k) => rows.push([labelize(k), (p) => (p.specs && p.specs[k] != null ? String(p.specs[k]) : "—")]));

    html += rows
      .map(
        ([label, fn]) =>
          `<tr><th scope="row">${window.escapeHtml(label)}</th>${selected.map((p) => `<td${label === "Estimated Price" ? ' class="compare-name"' : ""}>${window.escapeHtml(fn(p))}</td>`).join("")}</tr>`
      )
      .join("");

    html += "</tbody>";
    tableEl.innerHTML = html;

    tableEl.querySelectorAll("[data-clear]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.clear);
        slots[idx] = "";
        renderPickers();
        renderTable();
      });
    });
  }

  function init() {
    const params = new URLSearchParams(window.location.search);
    const ids = (params.get("ids") || "").split(",").filter(Boolean);
    ids.slice(0, SLOT_COUNT).forEach((id, i) => { slots[i] = id; });
    renderPickers();
    renderTable();
  }

  init();
})();
