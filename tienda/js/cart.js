/**
 * cart.js — Gestión del carrito de compras
 */

const Cart = (() => {
  const STORAGE_KEY = 'novamart_cart';

  /** @type {Array<{id:number, qty:number}>} */
  let items = [];

  /* ─── Persistencia ─────────────────────────────────────────── */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      items = raw ? JSON.parse(raw) : [];
    } catch {
      items = [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  /* ─── API pública ───────────────────────────────────────────── */
  function addItem(productId, qty = 1) {
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty });
    }
    save();
    _notifyChange();
  }

  function removeItem(productId) {
    items = items.filter(i => i.id !== productId);
    save();
    _notifyChange();
  }

  function updateQty(productId, qty) {
    if (qty < 1) { removeItem(productId); return; }
    const item = items.find(i => i.id === productId);
    if (item) {
      item.qty = qty;
      save();
      _notifyChange();
    }
  }

  function clear() {
    items = [];
    save();
    _notifyChange();
  }

  /** Retorna los ítems enriquecidos con datos del producto */
  function getItems() {
    return items.map(i => {
      const product = getProductById(i.id);
      return product ? { ...i, product } : null;
    }).filter(Boolean);
  }

  function getTotalItems() {
    return items.reduce((acc, i) => acc + i.qty, 0);
  }

  function getSubtotal() {
    return getItems().reduce((acc, i) => acc + i.product.price * i.qty, 0);
  }

  function getShipping() {
    return getSubtotal() >= 50 ? 0 : 5.99;
  }

  function getTotal() {
    return getSubtotal() + getShipping();
  }

  function isEmpty() {
    return items.length === 0;
  }

  /* ─── Observadores ─────────────────────────────────────────── */
  const listeners = [];

  function onChange(fn) {
    listeners.push(fn);
  }

  function _notifyChange() {
    listeners.forEach(fn => fn());
  }

  /* ─── Init ─────────────────────────────────────────────────── */
  load();

  return {
    addItem, removeItem, updateQty, clear,
    getItems, getTotalItems, getSubtotal, getShipping, getTotal,
    isEmpty, onChange,
  };
})();
