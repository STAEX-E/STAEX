/* ============================================================
   Sentinel Dynamics — FORGE LAB configurator logic
   ============================================================ */

(function () {
  "use strict";

  const root = document.getElementById("forge");
  if (!root) return;

  const F = window.SentinelForge;

  const PLATFORM_ICONS = {
    "fixed-wing": '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    vtol: '<path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"/><path d="M9 12l2 2 4-4"/>',
    fpv: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    cinelifter: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/>',
    hexacopter: '<path d="M12 2v6M12 16v6M4 7l5 3M15 14l5 3M4 17l5-3M15 10l5-3"/><circle cx="12" cy="12" r="2.4"/>',
    octacopter: '<circle cx="12" cy="12" r="9"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
    interceptor: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  };

  function svg(key) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (PLATFORM_ICONS[key] || "") + "</svg>";
  }

  const PLATFORM_OVERRIDE = { "uas-15-surveillance": "hexacopter", "drone-atlas-cargo": "octacopter" };
  const CATEGORY_DEFAULT_PLATFORM = { vtol: "vtol", fpv: "fpv", drone: "hexacopter", uas: "fixed-wing", "counter-uas": "interceptor" };

  function defaultPlatformForProduct(p) {
    if (PLATFORM_OVERRIDE[p.id]) return PLATFORM_OVERRIDE[p.id];
    return CATEGORY_DEFAULT_PLATFORM[p.category] || "hexacopter";
  }

  const sel = {
    platformId: null,
    frameId: null,
    motorId: null,
    propId: null,
    escId: null,
    batteryId: null,
    fcId: null,
    gpsId: null,
    videoId: null,
    cameraId: null,
    payloadId: F.PAYLOADS[0].id,
    protocol: F.COMMS_PROTOCOLS[0],
    receiverId: null,
  };

  function fillSelect(el, list, valueOf, labelOf, current) {
    el.innerHTML = list.map((item) => `<option value="${valueOf(item)}">${labelOf(item)}</option>`).join("");
    if (current && list.some((i) => valueOf(i) === current)) {
      el.value = current;
    } else if (list.length) {
      el.value = valueOf(list[0]);
    }
    return el.value;
  }

  const els = {
    platforms: document.getElementById("forge-platforms"),
    frame: document.getElementById("forge-frame"),
    motor: document.getElementById("forge-motor"),
    prop: document.getElementById("forge-prop"),
    esc: document.getElementById("forge-esc"),
    battery: document.getElementById("forge-battery"),
    fc: document.getElementById("forge-fc"),
    gps: document.getElementById("forge-gps"),
    video: document.getElementById("forge-video"),
    camera: document.getElementById("forge-camera"),
    payload: document.getElementById("forge-payload"),
    payloadField: document.getElementById("forge-payload-field"),
    protocols: document.getElementById("forge-protocols"),
    receiver: document.getElementById("forge-receiver"),
    checks: document.getElementById("forge-checks"),
    status: document.getElementById("forge-status"),
    price: document.getElementById("forge-price"),
  };

  function renderPlatformCards() {
    els.platforms.innerHTML = F.PLATFORMS.map(
      (p) => `<div class="forge-option-card${p.id === sel.platformId ? " is-selected" : ""}" data-platform="${p.id}">${svg(p.id)}<span>${p.label}</span></div>`
    ).join("");
    els.platforms.querySelectorAll(".forge-option-card").forEach((card) => {
      card.addEventListener("click", () => {
        sel.platformId = card.dataset.platform;
        sel.frameId = null; // force re-default
        renderPlatformCards();
        renderFrame();
        recompute();
      });
    });
  }

  function renderFrame() {
    const platform = F.byId(F.PLATFORMS, sel.platformId);
    const frames = platform ? platform.frameIds.map((id) => F.byId(F.FRAMES, id)) : F.FRAMES;
    sel.frameId = fillSelect(els.frame, frames, (f) => f.id, (f) => f.label, sel.frameId);
    els.payloadField.style.display = platform && platform.hasPayload ? "" : "none";
  }

  function renderStaticLists() {
    sel.motorId = fillSelect(els.motor, F.MOTORS, (m) => m.id, (m) => `${m.label} · ${m.kv}KV`, sel.motorId);
    sel.propId = fillSelect(els.prop, F.PROPELLERS, (p) => p.id, (p) => p.label, sel.propId);
    sel.escId = fillSelect(els.esc, F.ESCS, (e) => e.id, (e) => `${e.label} (${e.currentA}A)`, sel.escId);
    sel.batteryId = fillSelect(els.battery, F.BATTERIES, (b) => b.id, (b) => b.label, sel.batteryId);
    sel.fcId = fillSelect(els.fc, F.FLIGHT_CONTROLLERS, (f) => f.id, (f) => f.label, sel.fcId);
    sel.gpsId = fillSelect(els.gps, F.GPS_OPTIONS, (g) => g.id, (g) => g.label, sel.gpsId);
    sel.videoId = fillSelect(els.video, F.VIDEO_SYSTEMS, (v) => v.id, (v) => v.label, sel.videoId);
    sel.cameraId = fillSelect(els.camera, F.CAMERAS, (c) => c.id, (c) => c.label, sel.cameraId);
    sel.payloadId = fillSelect(els.payload, F.PAYLOADS, (p) => p.id, (p) => p.label, sel.payloadId);
    sel.receiverId = fillSelect(els.receiver, F.RECEIVERS, (r) => r.id, (r) => `${r.label} (${r.protocol})`, sel.receiverId);
  }

  function renderProtocolPills() {
    els.protocols.innerHTML = F.COMMS_PROTOCOLS.map(
      (proto) => `<button type="button" class="forge-pill${proto === sel.protocol ? " is-selected" : ""}" data-protocol="${proto}">${proto}</button>`
    ).join("");
    els.protocols.querySelectorAll(".forge-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        sel.protocol = btn.dataset.protocol;
        const match = F.RECEIVERS.find((r) => r.protocol === sel.protocol);
        if (match) { sel.receiverId = match.id; els.receiver.value = match.id; }
        renderProtocolPills();
        recompute();
      });
    });
  }

  function statusIcon(status) {
    return status === "ok" ? "✓" : status === "check" ? "⚠" : "✕";
  }
  function statusIconClass(status) {
    return status === "ok" ? "check-icon--ok" : status === "check" ? "check-icon--check" : "check-icon--bad";
  }

  function readSelections() {
    sel.frameId = els.frame.value;
    sel.motorId = els.motor.value;
    sel.propId = els.prop.value;
    sel.escId = els.esc.value;
    sel.batteryId = els.battery.value;
    sel.fcId = els.fc.value;
    sel.gpsId = els.gps.value;
    sel.videoId = els.video.value;
    sel.cameraId = els.camera.value;
    sel.payloadId = els.payload.value;
    sel.receiverId = els.receiver.value;
  }

  let lastResult = null;

  function recompute() {
    readSelections();
    const result = F.computeConfiguration(sel);
    lastResult = result;

    els.checks.innerHTML = result.checks
      .map(
        (c) => `<div class="check-item">
          <div class="check-icon ${statusIconClass(c.status)}">${statusIcon(c.status)}</div>
          <div>
            <div class="check-item__label">${window.escapeHtml(c.label)} — ${F.STATUS_LABEL[c.status].text}</div>
            <div class="check-item__detail">${window.escapeHtml(c.detail)}</div>
            ${c.fix ? `<div class="check-item__fix">Suggested fix: ${window.escapeHtml(c.fix)}</div>` : ""}
          </div>
        </div>`
      )
      .join("");

    const st = result.overallStatus;
    els.status.innerHTML = `<div class="check-icon ${statusIconClass(st)}">${statusIcon(st)}</div><span>${F.STATUS_LABEL[st].text}</span>`;
    els.price.textContent = window.formatINR(result.totalPriceINR);

    document.getElementById("est-weight").textContent = result.estimatedWeightG + " g";
    document.getElementById("est-payload").textContent = result.estimatedPayloadHeadroomG + " g";
    document.getElementById("est-endurance").textContent = result.estimatedEnduranceMin + " min";
    document.getElementById("est-speed").textContent = result.estimatedTopSpeedKmh + " km/h";
    document.getElementById("est-range").textContent = result.estimatedRangeKm + " km";
    document.getElementById("est-motors").textContent = result.motorCount;
  }

  function buildConfigLabel() {
    const p = lastResult.parts;
    const platform = F.byId(F.PLATFORMS, sel.platformId);
    return [platform && platform.label, p.frame && p.frame.label, p.motor && p.motor.label, p.battery && p.battery.label, sel.protocol]
      .filter(Boolean)
      .join(" · ");
  }

  function wireActions() {
    document.getElementById("forge-save").addEventListener("click", (e) => {
      try {
        const saved = JSON.parse(localStorage.getItem("sentinelSavedConfigs.v1") || "[]");
        saved.push({ savedAt: Date.now(), selection: Object.assign({}, sel), configLabel: buildConfigLabel(), totalPriceINR: lastResult.totalPriceINR });
        localStorage.setItem("sentinelSavedConfigs.v1", JSON.stringify(saved));
      } catch (err) { /* storage unavailable */ }
      const btn = e.currentTarget;
      const original = btn.textContent;
      btn.textContent = "Saved ✓";
      setTimeout(() => { btn.textContent = original; }, 1300);
    });

    document.getElementById("forge-add-cart").addEventListener("click", (e) => {
      window.SentinelCart.addItem({
        productId: null,
        name: (F.byId(F.PLATFORMS, sel.platformId) || {}).label + " Custom Build",
        config: Object.assign({}, sel),
        configLabel: buildConfigLabel(),
        unitPriceINR: lastResult.totalPriceINR,
      });
      const btn = e.currentTarget;
      const original = btn.textContent;
      btn.textContent = "Added ✓";
      setTimeout(() => { btn.textContent = original; }, 1300);
    });

    document.getElementById("forge-buy-now").addEventListener("click", () => {
      try {
        localStorage.setItem(
          "sentinelBuyNowItem.v1",
          JSON.stringify({
            name: (F.byId(F.PLATFORMS, sel.platformId) || {}).label + " Custom Build",
            configLabel: buildConfigLabel(),
            unitPriceINR: lastResult.totalPriceINR,
            qty: 1,
          })
        );
      } catch (err) { /* storage unavailable */ }
      window.location.href = "procurement.html?buyNow=forge";
    });
  }

  function init() {
    const params = new URLSearchParams(window.location.search);
    const restoreId = params.get("restore");
    let restored = false;
    if (restoreId && window.SentinelCart) {
      const cart = window.SentinelCart.readCart();
      const item = cart.find((i) => i.cartItemId === restoreId);
      if (item && item.config) {
        Object.assign(sel, item.config);
        restored = true;
      }
    }

    const productId = params.get("product");
    if (!restored && productId) {
      const product = (window.SENTINEL_PRODUCTS || []).find((p) => p.id === productId);
      if (product) sel.platformId = defaultPlatformForProduct(product);
    }
    if (!sel.platformId) sel.platformId = F.PLATFORMS[0].id;

    renderPlatformCards();
    renderFrame();
    renderStaticLists();
    renderProtocolPills();
    recompute();
    wireActions();

    [els.frame, els.motor, els.prop, els.esc, els.battery, els.fc, els.gps, els.video, els.camera, els.payload, els.receiver].forEach((el) => {
      el.addEventListener("change", recompute);
    });
  }

  init();
})();
