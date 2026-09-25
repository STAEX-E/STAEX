/* ============================================================
   Sentinel Dynamics — Product Database
   Single source of truth for the catalog. Every page (Products,
   Search, Product Detail, Forge Lab, Compare, Cart) reads from
   window.SENTINEL_PRODUCTS.
   ============================================================ */

(function () {
  "use strict";

  // Shared icon set — reused across products within a category for
  // visual consistency without hand-authoring 28 bespoke SVGs.
  const ICONS = {
    vtol: '<path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"/><path d="M9 12l2 2 4-4"/>',
    "vtol-alt": '<path d="M12 2v14M12 2l-5 5M12 2l5 5"/><path d="M7 20h10"/>',
    "counter-uas": '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7" stroke-dasharray="2 3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    "counter-uas-radar": '<path d="M12 12 12 3"/><path d="M12 12a9 9 0 0 1 9 9"/><path d="M12 12a5 5 0 0 1 5 5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    uas: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    "uas-alt": '<path d="M4 17 12 4l8 13"/><path d="M8.5 12h7"/>',
    drone: '<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/><circle cx="5" cy="5" r="2.4"/><circle cx="19" cy="5" r="2.4"/><circle cx="5" cy="19" r="2.4"/><circle cx="19" cy="19" r="2.4"/><rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor"/>',
    "drone-alt": '<path d="M4 8h4l2-4 4 8 2-4h4"/><circle cx="8" cy="16" r="2.4"/><circle cx="16" cy="16" r="2.4"/>',
    fpv: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M12 8l1.6 4L12 16l-1.6-4Z" fill="currentColor" stroke="none"/>',
    "fpv-alt": '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  };

  function svg(iconKey) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      (ICONS[iconKey] || ICONS.drone) +
      "</svg>"
    );
  }

  const CATEGORY_LABELS = {
    vtol: "VTOLs",
    "counter-uas": "Counter-UAS",
    uas: "UAS",
    drone: "Drones",
    fpv: "FPV",
  };

  const PRODUCTS = [
    // ---------------- VTOLs ----------------
    {
      id: "vtol-tailsitter",
      name: "Tailsitter VTOL",
      category: "vtol",
      status: "active",
      tag: "Fixed-Wing · VTOL",
      icon: "vtol",
      short: "Vertical takeoff, fixed-wing range, and GPS-denied navigation up to 200 km/h.",
      description: "Launches and lands vertically like a rotorcraft, then transitions to efficient fixed-wing flight for extended-range missions, combining the deployment flexibility of a multirotor with the endurance of a fixed-wing aircraft.",
      specs: { frame: "Fixed-Wing", battery: "8S", topSpeed: "200 km/h", payload: "4.5 kg", endurance: "Long-Range", telemetry: "Non-ISM Band", navigation: "GPS-Denied Capable" },
      highlights: ["Fixed-Wing", "200 km/h", "4.5 kg Payload"],
      priceINR: 2450000,
      configurable: true,
    },
    {
      id: "vtol-aniketra",
      name: "ANIKETRA VTOL",
      category: "vtol",
      status: "active",
      tag: "VTOL · Collaboration",
      icon: "vtol-alt",
      partner: "Spatian Aviation",
      short: "A long-endurance ISR VTOL developed in collaboration with Spatian Aviation.",
      description: "ANIKETRA is a joint development between Sentinel Dynamics and Spatian Aviation — a long-endurance vertical-takeoff platform purpose-built for persistent intelligence, surveillance and reconnaissance over extended operational areas.",
      specs: { frame: "Fixed-Wing VTOL", battery: "Hybrid-Electric", topSpeed: "185 km/h", payload: "6 kg", endurance: "Extended", telemetry: "Encrypted Datalink", navigation: "GPS-Denied Capable" },
      highlights: ["Spatian Aviation Collab", "185 km/h", "Extended Endurance"],
      priceINR: 3800000,
      configurable: true,
    },
    {
      id: "vtol-voyager-x",
      name: "Voyager VTOL-X",
      category: "vtol",
      status: "concept",
      tag: "VTOL · Concept",
      icon: "vtol",
      short: "A conceptual long-range logistics VTOL for forward-position resupply.",
      description: "A concept-stage VTOL sized for cargo and logistics missions — moving critical supplies into forward positions without runway dependency.",
      specs: { frame: "Fixed-Wing VTOL", battery: "10S", topSpeed: "160 km/h", payload: "12 kg", endurance: "Long-Range", telemetry: "Non-ISM Band" },
      highlights: ["Cargo Class", "12 kg Payload", "Concept"],
      priceINR: 4200000,
      configurable: true,
    },
    {
      id: "vtol-sentinel-c",
      name: "Sentinel VTOL-C Compact",
      category: "vtol",
      status: "concept",
      tag: "VTOL · Concept",
      icon: "vtol-alt",
      short: "A conceptual compact VTOL for rapid tactical deployment.",
      description: "A smaller-footprint VTOL concept designed to deploy from confined forward positions in minutes, trading payload for speed of setup.",
      specs: { frame: "Compact VTOL", battery: "6S", topSpeed: "140 km/h", payload: "2 kg", endurance: "Medium", telemetry: "Non-ISM Band" },
      highlights: ["Rapid Deploy", "Compact", "Concept"],
      priceINR: 1650000,
      configurable: true,
    },
    {
      id: "vtol-horizon-h",
      name: "Horizon VTOL-H Heavy",
      category: "vtol",
      status: "concept",
      tag: "VTOL · Concept",
      icon: "vtol",
      short: "A conceptual heavy-payload VTOL for extended ISR missions.",
      description: "A heavy-class VTOL concept built around payload capacity — carrying larger sensor suites or multi-role packages across long-endurance ISR missions.",
      specs: { frame: "Heavy VTOL", battery: "12S", topSpeed: "175 km/h", payload: "9 kg", endurance: "Extended", telemetry: "Encrypted Datalink" },
      highlights: ["Heavy-Payload", "9 kg", "Concept"],
      priceINR: 4650000,
      configurable: true,
    },

    // ---------------- Counter-UAS ----------------
    {
      id: "cuas-aegis",
      name: "Aegis Counter-UAS Interceptor",
      category: "counter-uas",
      status: "concept",
      tag: "Counter-UAS · Concept",
      icon: "counter-uas",
      short: "A conceptual kinetic interceptor drone for neutralizing hostile small UAS.",
      description: "A concept-stage interceptor purpose-built to close on and neutralize hostile small unmanned aircraft before they reach protected airspace.",
      specs: { frame: "6-Inch Quad", battery: "6S", topSpeed: "260 km/h", payload: "N/A", endurance: "Short", telemetry: "Non-Jammable" },
      highlights: ["260 km/h", "Interceptor", "Concept"],
      priceINR: 950000,
      configurable: true,
    },
    {
      id: "cuas-warden",
      name: "Warden RF Detection Node",
      category: "counter-uas",
      status: "concept",
      tag: "Counter-UAS · Concept",
      icon: "counter-uas-radar",
      short: "A conceptual RF spectrum detection and tracking node for early UAS warning.",
      description: "A fixed or vehicle-mounted RF detection node concept that scans the spectrum for drone control and video links, cueing a response before visual acquisition.",
      specs: { class: "Detection Node", range: "Extended", power: "Grid / Vehicle", telemetry: "Encrypted Datalink" },
      highlights: ["RF Detection", "Early Warning", "Concept"],
      priceINR: 2850000,
      configurable: false,
    },
    {
      id: "cuas-falconet",
      name: "Falconet Net-Capture Interceptor",
      category: "counter-uas",
      status: "concept",
      tag: "Counter-UAS · Concept",
      icon: "counter-uas",
      short: "A conceptual non-kinetic interceptor that captures hostile drones with a deployable net.",
      description: "A concept interceptor designed to disable a hostile small UAS non-destructively — closing distance and deploying a capture net rather than a kinetic strike.",
      specs: { frame: "7-Inch Quad", battery: "6S", topSpeed: "180 km/h", payload: "Net Module", endurance: "Short" },
      highlights: ["Non-Kinetic", "Net Capture", "Concept"],
      priceINR: 1150000,
      configurable: true,
    },
    {
      id: "cuas-sentry-radar",
      name: "Sentry Counter-UAS Radar Array",
      category: "counter-uas",
      status: "concept",
      tag: "Counter-UAS · Concept",
      icon: "counter-uas-radar",
      short: "A conceptual radar array for wide-area detection and cueing of small aerial threats.",
      description: "A concept radar system providing wide-area detection and tracking of small aerial threats, cueing interceptor or jamming assets for response.",
      specs: { class: "Detection Array", range: "Wide-Area", power: "Grid / Generator", telemetry: "Encrypted Datalink" },
      highlights: ["Wide-Area", "Radar Cueing", "Concept"],
      priceINR: 6200000,
      configurable: false,
    },
    {
      id: "cuas-bastion",
      name: "Bastion Mobile C-UAS Platform",
      category: "counter-uas",
      status: "concept",
      tag: "Counter-UAS · Concept",
      icon: "counter-uas",
      short: "A conceptual vehicle-mounted mobile counter-UAS detection and response unit.",
      description: "A concept mobile platform integrating detection and response systems on a vehicle mount, providing counter-UAS coverage that moves with the force it protects.",
      specs: { class: "Mobile Platform", range: "Wide-Area", power: "Vehicle", telemetry: "Encrypted Datalink" },
      highlights: ["Mobile", "Integrated", "Concept"],
      priceINR: 7400000,
      configurable: false,
    },

    // ---------------- UAS ----------------
    {
      id: "uas-15-surveillance",
      name: "15-Inch Payload / Surveillance Drone",
      category: "uas",
      status: "active",
      tag: "ISR · Heavy-Lift",
      icon: "uas",
      short: "Heavy-lift ISR with 40 minutes of thermal-imaging endurance.",
      description: "A large-frame surveillance and payload platform built for endurance missions. Running roughly 40 minutes on an 8S 10,200 mAh pack, it carries a thermal imaging payload for long-range intelligence, surveillance and reconnaissance, plus the lift capacity for equipment or supply delivery into forward positions.",
      specs: { frame: "15-Inch", battery: "8S · 10,200 mAh", endurance: "40 min", payload: "Heavy-Lift", imaging: "Thermal" },
      highlights: ["15-Inch", "40 min", "Thermal Imaging"],
      priceINR: 780000,
      configurable: true,
    },
    {
      id: "uas-argus",
      name: "Argus Fixed-Wing ISR UAS",
      category: "uas",
      status: "concept",
      tag: "UAS · Concept",
      icon: "uas-alt",
      short: "A conceptual long-endurance fixed-wing reconnaissance aircraft.",
      description: "A concept fixed-wing UAS built for sustained reconnaissance over wide areas, trading agility for range and time-on-station.",
      specs: { frame: "Fixed-Wing", endurance: "Extended", range: "Long-Range", imaging: "EO/IR" },
      highlights: ["Long-Endurance", "Fixed-Wing", "Concept"],
      priceINR: 3100000,
      configurable: true,
    },
    {
      id: "uas-pathfinder",
      name: "Pathfinder Mapping & Survey UAS",
      category: "uas",
      status: "concept",
      tag: "UAS · Concept",
      icon: "uas",
      short: "A conceptual mapping and survey unmanned aircraft system.",
      description: "A concept UAS configured for terrain mapping and survey work, carrying imaging payloads suited to large-area data capture.",
      specs: { frame: "Fixed-Wing", endurance: "Long", imaging: "High-Res Mapping" },
      highlights: ["Mapping", "Survey-Grade", "Concept"],
      priceINR: 1950000,
      configurable: true,
    },
    {
      id: "uas-vanguard",
      name: "Vanguard Maritime Patrol UAS",
      category: "uas",
      status: "concept",
      tag: "UAS · Concept",
      icon: "uas-alt",
      short: "A conceptual maritime surveillance UAS for coastal patrol.",
      description: "A concept UAS configured for over-water endurance and maritime domain awareness, supporting coastal and offshore patrol missions.",
      specs: { frame: "Fixed-Wing", endurance: "Extended", imaging: "Maritime EO/IR" },
      highlights: ["Maritime", "Coastal Patrol", "Concept"],
      priceINR: 3450000,
      configurable: true,
    },
    {
      id: "uas-relay",
      name: "Relay Communications UAS",
      category: "uas",
      status: "concept",
      tag: "UAS · Concept",
      icon: "uas",
      short: "A conceptual airborne communications relay and repeater platform.",
      description: "A concept UAS that loiters at altitude to extend communications range across terrain that would otherwise break line-of-sight links.",
      specs: { frame: "Fixed-Wing", endurance: "Extended", payload: "Comms Relay" },
      highlights: ["Comms Relay", "Persistent", "Concept"],
      priceINR: 2200000,
      configurable: true,
    },
    {
      id: "uas-sentinel-border",
      name: "Sentinel Border Watch UAS",
      category: "uas",
      status: "concept",
      tag: "UAS · Concept",
      icon: "uas-alt",
      short: "A conceptual persistent border-surveillance UAS.",
      description: "A concept UAS designed for extended-duration border and perimeter surveillance, handing off between airframes to maintain continuous coverage.",
      specs: { frame: "Fixed-Wing", endurance: "Extended", imaging: "Thermal + EO/IR" },
      highlights: ["Border Watch", "Persistent", "Concept"],
      priceINR: 2900000,
      configurable: true,
    },

    // ---------------- Drones ----------------
    {
      id: "drone-10-tactical",
      name: "10-Inch Tactical Drone",
      category: "drone",
      status: "active",
      tag: "Multirole · Tactical",
      icon: "drone",
      short: "An in-house built multirole platform for reconnaissance, strike-support and thermal ISR.",
      description: "The backbone of the Sentinel Dynamics fleet — a rugged, in-house built multirotor for tactical reconnaissance, strike-support and surveillance missions. A thermal imaging payload and non-ISM band telemetry keep it effective and connected in contested environments, with 25 minutes of endurance on its 5,200 mAh pack.",
      specs: { frame: "10-Inch", configuration: "Quad", battery: "5,200 mAh", endurance: "25 min", imaging: "Thermal", telemetry: "Non-ISM Band" },
      highlights: ["10-Inch", "25 min", "Thermal"],
      priceINR: 425000,
      configurable: true,
    },
    {
      id: "drone-recon-8",
      name: "Recon-8 Tactical Drone",
      category: "drone",
      status: "concept",
      tag: "Drone · Concept",
      icon: "drone-alt",
      short: "A conceptual 8-inch tactical reconnaissance drone.",
      description: "A concept mid-frame quad sized between the 10-inch tactical and 7-inch interceptor classes, balancing endurance and agility for close-tactical recon.",
      specs: { frame: "8-Inch", configuration: "Quad", endurance: "20 min", imaging: "EO/IR" },
      highlights: ["8-Inch", "Recon", "Concept"],
      priceINR: 310000,
      configurable: true,
    },
    {
      id: "drone-atlas-cargo",
      name: "Atlas Heavy-Lift Cargo Drone",
      category: "drone",
      status: "concept",
      tag: "Drone · Concept",
      icon: "drone",
      short: "A conceptual heavy-lift logistics and resupply drone.",
      description: "A concept multirotor sized for forward-position logistics — moving supplies over short distances without road dependency.",
      specs: { frame: "20-Inch", configuration: "Octa", payload: "18 kg", endurance: "18 min" },
      highlights: ["Heavy-Lift", "18 kg", "Concept"],
      priceINR: 980000,
      configurable: true,
    },
    {
      id: "drone-swarm-1",
      name: "Swarm-1 Micro Tactical Drone",
      category: "drone",
      status: "concept",
      tag: "Drone · Concept",
      icon: "drone-alt",
      short: "A conceptual small swarm-capable micro drone.",
      description: "A concept micro-drone designed to operate in coordinated groups, trading individual capability for numbers and distributed coverage.",
      specs: { frame: "5-Inch", configuration: "Quad", endurance: "12 min", role: "Swarm Node" },
      highlights: ["Swarm-Capable", "Micro", "Concept"],
      priceINR: 145000,
      configurable: true,
    },
    {
      id: "drone-urban-6",
      name: "Urban-6 Close-Quarters Recon Drone",
      category: "drone",
      status: "concept",
      tag: "Drone · Concept",
      icon: "drone",
      short: "A conceptual close-quarters urban and indoor reconnaissance drone.",
      description: "A concept compact drone built for indoor and close-quarters urban reconnaissance, prioritizing maneuverability in confined spaces.",
      specs: { frame: "6-Inch", configuration: "Quad", endurance: "10 min", role: "Close-Quarters" },
      highlights: ["Urban Recon", "Compact", "Concept"],
      priceINR: 210000,
      configurable: true,
    },
    {
      id: "drone-guardian-perimeter",
      name: "Guardian Perimeter Security Drone",
      category: "drone",
      status: "concept",
      tag: "Drone · Concept",
      icon: "drone-alt",
      short: "A conceptual automated perimeter patrol drone.",
      description: "A concept drone intended for scheduled or triggered perimeter patrol routes, feeding live video back to a monitoring station.",
      specs: { frame: "10-Inch", configuration: "Quad", endurance: "22 min", role: "Perimeter Patrol" },
      highlights: ["Perimeter Patrol", "Automated", "Concept"],
      priceINR: 390000,
      configurable: true,
    },

    // ---------------- FPV ----------------
    {
      id: "fpv-7-interceptor",
      name: "7-Inch FPV Interceptor",
      category: "fpv",
      status: "active",
      tag: "FPV · Interceptor",
      icon: "fpv",
      short: "300 km/h of jam-resistant intercept speed in a stripped-down 7-inch frame.",
      description: "Built for velocity. The 7-inch interceptor reaches up to 300 km/h on a 6S 2,500 mAh pack, closing distance fast to neutralize aerial threats before they reach protected airspace. Non-jammable, non-ISM band telemetry keeps it linked under electronic countermeasures, carrying a 200 g payload across roughly 13 minutes of high-speed flight.",
      specs: { frame: "7-Inch", topSpeed: "300 km/h", battery: "6S · 2,500 mAh", endurance: "~13 min", payload: "200 g", telemetry: "Non-Jammable" },
      highlights: ["300 km/h", "7-Inch", "Non-Jammable"],
      priceINR: 185000,
      configurable: true,
    },
    {
      id: "fpv-5-interceptor",
      name: "5-Inch FPV Interceptor",
      category: "fpv",
      status: "active",
      tag: "FPV · Interceptor",
      icon: "fpv-alt",
      short: "The fleet's most agile platform — built for close-quarters, rapid-response flight.",
      description: "The most agile platform in the fleet. Small enough for close-quarters and urban deployment, the 5-inch interceptor trades raw range for unmatched maneuverability and near-instant response time, piloted over a low-latency analog FPV video link. Conceptually positioned for speeds of approximately 250 km/h in a high thrust-to-weight, low-drag configuration.",
      specs: { frame: "5-Inch", topSpeed: "~250 km/h (Concept Target)", videoLink: "Analog FPV", role: "Rapid-Response" },
      highlights: ["5-Inch", "~250 km/h Target", "Analog FPV"],
      priceINR: 92000,
      configurable: true,
    },
    {
      id: "fpv-viper-3",
      name: "Viper-3 Micro FPV",
      category: "fpv",
      status: "concept",
      tag: "FPV · Concept",
      icon: "fpv",
      short: "A conceptual 3-inch micro FPV platform for close-quarters agility.",
      description: "A concept micro-class FPV airframe for the tightest operating environments, where the 5-inch platform is still too large to maneuver freely.",
      specs: { frame: "3-Inch", videoLink: "Analog FPV", role: "Micro Recon" },
      highlights: ["3-Inch", "Micro", "Concept"],
      priceINR: 58000,
      configurable: true,
    },
    {
      id: "fpv-raptor-10",
      name: "Raptor-10 FPV Cinelifter",
      category: "fpv",
      status: "concept",
      tag: "FPV · Concept",
      icon: "fpv-alt",
      short: "A conceptual 10-inch heavy FPV platform for larger payload work.",
      description: "A concept heavy-class FPV airframe built to carry larger sensor or camera payloads while retaining FPV-style manual control.",
      specs: { frame: "10-Inch", payload: "1.2 kg", videoLink: "Digital FPV" },
      highlights: ["10-Inch", "Heavy Payload", "Concept"],
      priceINR: 265000,
      configurable: true,
    },
    {
      id: "fpv-scout-lr",
      name: "Scout Long-Range FPV",
      category: "fpv",
      status: "concept",
      tag: "FPV · Concept",
      icon: "fpv",
      short: "A conceptual long-range FPV reconnaissance platform.",
      description: "A concept FPV airframe tuned for range over raw speed, extending reconnaissance reach beyond typical interceptor-class platforms.",
      specs: { frame: "7-Inch", range: "Extended", videoLink: "Digital FPV" },
      highlights: ["Long-Range", "Recon", "Concept"],
      priceINR: 220000,
      configurable: true,
    },
    {
      id: "fpv-talon-7",
      name: "Talon-7 FPV Strike-Support Platform",
      category: "fpv",
      status: "concept",
      tag: "FPV · Concept",
      icon: "fpv-alt",
      short: "A conceptual FPV strike-support and forward-observation platform.",
      description: "A concept FPV airframe supporting forward observation and strike-support roles, built on the same high-speed design principles as the interceptor line.",
      specs: { frame: "7-Inch", topSpeed: "280 km/h (Concept Target)", role: "Strike-Support" },
      highlights: ["Strike-Support", "280 km/h Target", "Concept"],
      priceINR: 198000,
      configurable: true,
    },
  ];

  function formatINR(amount) {
    if (amount == null) return "—";
    return "₹" + Math.round(amount).toLocaleString("en-IN");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function renderProductTile(p) {
    const statusClass = p.status === "concept" ? "status-badge--concept" : "status-badge--active";
    const statusLabel = p.status === "concept" ? "CONCEPT" : "ACTIVE";
    const chips = (p.highlights || []).slice(0, 3).map((h) => `<span class="spec-chip">${escapeHtml(h)}</span>`).join("");
    const configureHref = p.configurable ? `forge-lab.html?product=${encodeURIComponent(p.id)}` : "customer-service.html";
    const configureLabel = p.configurable ? "Configure" : "Request Info";
    return `
    <article class="panel product-tile reveal" data-product-id="${p.id}" data-category="${p.category}">
      <div class="product-tile__visual">
        <span class="status-badge ${statusClass} product-tile__status">${statusLabel}</span>
        ${svg(p.icon)}
      </div>
      <div class="product-tile__body">
        <span class="product-tile__category">${escapeHtml(CATEGORY_LABELS[p.category] || p.category)}</span>
        <h3 class="product-tile__name">${escapeHtml(p.name)}</h3>
        <p class="product-tile__desc">${escapeHtml(p.short)}</p>
        <div class="product-tile__specs">${chips}</div>
        <div class="product-tile__price">
          <small>Estimated Price</small>
          ${formatINR(p.priceINR)}
        </div>
        <div class="product-tile__actions">
          <a class="btn btn--outline btn--sm" href="product-detail.html?id=${encodeURIComponent(p.id)}">View Details</a>
          <a class="btn btn--ghost btn--sm" href="${configureHref}">${configureLabel}</a>
          <button type="button" class="btn btn--ghost btn--sm" data-action="add-to-cart" data-id="${p.id}">Add to Cart</button>
          <button type="button" class="btn btn--primary btn--sm" data-action="buy-now" data-id="${p.id}">Buy Now</button>
        </div>
      </div>
    </article>`;
  }

  window.SENTINEL_PRODUCTS = PRODUCTS;
  window.SENTINEL_CATEGORY_LABELS = CATEGORY_LABELS;
  window.SentinelIcons = { svg, ICONS };
  window.formatINR = formatINR;
  window.renderProductTile = renderProductTile;
  window.escapeHtml = escapeHtml;
})();
