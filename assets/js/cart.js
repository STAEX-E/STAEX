/* ============================================================
   Sentinel Dynamics — Cart
   localStorage-backed cart shared across every page. Also updates
   the "CART 0X" nav badge on load and whenever the cart changes.
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "sentinelCart.v1";

  function readCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      /* storage unavailable (private mode, quota) — fail silently */
    }
    updateBadges();
  }

  function uid() {
    return "ci-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function addItem(item) {
    const cart = readCart();
    cart.push(
      Object.assign(
        {
          cartItemId: uid(),
          qty: 1,
          addedAt: Date.now(),
        },
        item
      )
    );
    writeCart(cart);
    return cart;
  }

  function removeItem(cartItemId) {
    const cart = readCart().filter((i) => i.cartItemId !== cartItemId);
    writeCart(cart);
    return cart;
  }

  function updateQty(cartItemId, qty) {
    const cart = readCart();
    const item = cart.find((i) => i.cartItemId === cartItemId);
    if (item) item.qty = Math.max(1, qty | 0);
    writeCart(cart);
    return cart;
  }

  function clearCart() {
    writeCart([]);
  }

  function getCount() {
    return readCart().reduce((sum, i) => sum + (i.qty || 1), 0);
  }

  function getTotal() {
    return readCart().reduce((sum, i) => sum + (i.unitPriceINR || 0) * (i.qty || 1), 0);
  }

  function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function updateBadges() {
    const count = getCount();
    document.querySelectorAll("[data-cart-badge]").forEach((el) => {
      el.textContent = pad2(count);
      el.classList.toggle("cart-badge--active", count > 0);
    });
  }

  window.SentinelCart = {
    readCart,
    writeCart,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getCount,
    getTotal,
    updateBadges,
  };

  document.addEventListener("DOMContentLoaded", updateBadges);

  // Global delegated handlers for "Add to Cart" / "Buy Now" buttons
  // rendered by renderProductTile() across Products, Search, Compare, etc.
  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest('[data-action="add-to-cart"]');
    if (addBtn) {
      const id = addBtn.dataset.id;
      const product = (window.SENTINEL_PRODUCTS || []).find((p) => p.id === id);
      if (product) {
        addItem({
          productId: product.id,
          name: product.name,
          config: null,
          configLabel: "Standard Configuration",
          unitPriceINR: product.priceINR,
        });
        const original = addBtn.textContent;
        addBtn.textContent = "Added ✓";
        addBtn.disabled = true;
        setTimeout(() => {
          addBtn.textContent = original;
          addBtn.disabled = false;
        }, 1300);
      }
      return;
    }
    const buyBtn = e.target.closest('[data-action="buy-now"]');
    if (buyBtn) {
      const id = buyBtn.dataset.id;
      window.location.href = "procurement.html?buyNow=" + encodeURIComponent(id) + "&qty=1";
    }
  });
})();
