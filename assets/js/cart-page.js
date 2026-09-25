/* ============================================================
   Sentinel Dynamics — My Cart page
   ============================================================ */

(function () {
  "use strict";

  const itemsEl = document.getElementById("cart-items");
  if (!itemsEl) return;

  const emptyEl = document.getElementById("cart-empty");
  const summaryEl = document.getElementById("cart-summary");
  const totalEl = document.getElementById("cart-total");
  const titleEl = document.getElementById("cart-title");
  const subtitleEl = document.getElementById("cart-subtitle");

  const CUSTOM_BUILD_ICON =
    '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z"/>';

  function iconFor(item) {
    if (item.productId) {
      const product = (window.SENTINEL_PRODUCTS || []).find((p) => p.id === item.productId);
      if (product) return window.SentinelIcons.svg(product.icon);
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + CUSTOM_BUILD_ICON + "</svg>";
  }

  function render() {
    const cart = window.SentinelCart.readCart();
    const count = cart.reduce((s, i) => s + (i.qty || 1), 0);

    if (cart.length === 0) {
      emptyEl.style.display = "";
      summaryEl.style.display = "none";
      itemsEl.innerHTML = "";
      titleEl.textContent = "Your Cart";
      subtitleEl.textContent = "Your cart is currently empty.";
      return;
    }

    emptyEl.style.display = "none";
    summaryEl.style.display = "";
    titleEl.textContent = "Your Cart";
    subtitleEl.textContent = count + (count === 1 ? " item" : " items") + " ready for procurement.";

    itemsEl.innerHTML = cart
      .map((item) => {
        const lineTotal = (item.unitPriceINR || 0) * (item.qty || 1);
        const editHref = item.config
          ? "forge-lab.html?restore=" + encodeURIComponent(item.cartItemId)
          : item.productId
          ? "product-detail.html?id=" + encodeURIComponent(item.productId)
          : null;
        return `
        <article class="panel cart-item" data-cart-item-id="${item.cartItemId}">
          <div class="cart-item__visual">${iconFor(item)}</div>
          <div class="cart-item__body">
            <h4>${window.escapeHtml(item.name)}</h4>
            <div class="cart-item__config">${window.escapeHtml(item.configLabel || "Standard Configuration")}</div>
            <div class="cart-item__price">${window.formatINR(item.unitPriceINR)} × ${item.qty} = <strong>${window.formatINR(lineTotal)}</strong></div>
          </div>
          <div class="cart-item__actions">
            <div class="qty-stepper">
              <button type="button" data-qty="minus" aria-label="Decrease quantity">−</button>
              <input type="text" value="${item.qty < 10 ? "0" + item.qty : item.qty}" readonly>
              <button type="button" data-qty="plus" aria-label="Increase quantity">+</button>
            </div>
            <div class="cart-item__links">
              ${editHref ? `<a href="${editHref}">Edit Configuration</a>` : ""}
              <button type="button" data-action="remove">Remove</button>
              <a href="procurement.html?buyNow=cartitem&id=${encodeURIComponent(item.cartItemId)}">Buy Now</a>
            </div>
          </div>
        </article>`;
      })
      .join("");

    totalEl.textContent = window.formatINR(window.SentinelCart.getTotal());
  }

  itemsEl.addEventListener("click", (e) => {
    const card = e.target.closest("[data-cart-item-id]");
    if (!card) return;
    const id = card.dataset.cartItemId;

    if (e.target.closest('[data-action="remove"]')) {
      window.SentinelCart.removeItem(id);
      render();
      return;
    }
    if (e.target.closest('[data-qty="minus"]') || e.target.closest('[data-qty="plus"]')) {
      const cart = window.SentinelCart.readCart();
      const item = cart.find((i) => i.cartItemId === id);
      if (!item) return;
      const delta = e.target.closest('[data-qty="plus"]') ? 1 : -1;
      window.SentinelCart.updateQty(id, Math.max(1, (item.qty || 1) + delta));
      render();
    }
  });

  render();
})();
