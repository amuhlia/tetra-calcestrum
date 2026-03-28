/**
 * app.js — Controlador principal de NovaMart PWA
 */

const App = (() => {

  /* ─── Estado ─────────────────────────────────────────────── */
  let activeView    = 'store';
  let activeProduct = null; // producto abierto en modal
  let modalQty      = 1;

  /* ─── Vistas ─────────────────────────────────────────────── */
  const VIEWS = {
    store:    document.getElementById('viewStore'),
    cart:     document.getElementById('viewCart'),
    checkout: document.getElementById('viewCheckout'),
    success:  document.getElementById('viewSuccess'),
  };

  const NAV_BTNS = document.querySelectorAll('.nav-btn[data-view]');

  function showView(name) {
    // Ocultar todo
    Object.values(VIEWS).forEach(v => v?.classList.remove('active'));
    // Mostrar la vista solicitada
    VIEWS[name]?.classList.add('active');
    activeView = name;

    // Actualizar nav
    NAV_BTNS.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === name);
    });

    // Acciones específicas al cambiar vista
    if (name === 'cart')     renderCart();
    if (name === 'checkout') { Checkout.resetSteps(); }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goHome() {
    showView('store');
  }

  /* ─── Toast ──────────────────────────────────────────────── */
  let toastTimer;
  function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className   = `toast toast--${type} show`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 2500);
  }

  /* ─── Badge del carrito ──────────────────────────────────── */
  function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const n = Cart.getTotalItems();
    badge.textContent = n;
    badge.classList.toggle('hidden', n === 0);
    badge.classList.add('bump');
    badge.addEventListener('animationend', () => badge.classList.remove('bump'), { once: true });
  }

  /* ─── Productos: Grid ────────────────────────────────────── */
  function renderProducts(cat = 'all') {
    const grid       = document.getElementById('productsGrid');
    const countEl    = document.getElementById('productsCount');
    const titleEl    = document.getElementById('productsTitle');
    if (!grid) return;

    const list = getProducts(cat);
    countEl.textContent = `${list.length} producto${list.length !== 1 ? 's' : ''}`;

    const titles = {
      all: 'Todos los productos', electronics: 'Electrónica',
      clothing: 'Ropa y Calzado', home: 'Hogar', sports: 'Deportes', beauty: 'Belleza',
    };
    if (titleEl) titleEl.textContent = titles[cat] || 'Productos';

    grid.innerHTML = '';
    list.forEach(p => {
      const card = _createProductCard(p);
      grid.appendChild(card);
    });
  }

  function _starsHtml(rating) {
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty) + ` (${rating})`;
  }

  function _createProductCard(p) {
    const card = document.createElement('div');
    card.className  = 'product-card';
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', p.name);
    card.tabIndex   = 0;

    const badgeColor = p.badge === 'Oferta' ? '' : 'badge--sale';
    const badgeHtml  = p.badge
      ? `<span class="product-card__badge ${badgeColor}">${p.badge}</span>` : '';

    const oldPriceHtml = p.oldPrice
      ? `<span class="product-card__price-old">$${p.oldPrice.toFixed(2)}</span>` : '';

    const bgColors = {
      electronics: '#eef0ff', clothing: '#fff0f5',
      home: '#f0fff4', sports: '#fffbeb', beauty: '#fff0fb',
    };

    card.innerHTML = `
      <div class="product-card__img" style="background:${bgColors[p.category] || '#f7f8fc'}">
        ${badgeHtml}
        ${p.emoji}
      </div>
      <div class="product-card__body">
        <span class="product-card__category">${p.categoryLabel}</span>
        <span class="product-card__name">${p.name}</span>
        <span class="product-card__stars" aria-label="Rating: ${p.rating} de 5">${_starsHtml(p.rating)}</span>
      </div>
      <div class="product-card__footer">
        <div>
          <span class="product-card__price">$${p.price.toFixed(2)}</span>
          ${oldPriceHtml}
        </div>
        <button class="btn-add" data-id="${p.id}" aria-label="Agregar ${p.name} al carrito">+</button>
      </div>
    `;

    // Clic en la tarjeta → modal
    card.addEventListener('click', e => {
      if (e.target.classList.contains('btn-add') || e.target.closest('.btn-add')) return;
      openProductModal(p.id);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProductModal(p.id); }
    });

    // Botón "+"
    card.querySelector('.btn-add').addEventListener('click', e => {
      e.stopPropagation();
      _quickAddToCart(p.id, e.currentTarget);
    });

    return card;
  }

  function _quickAddToCart(productId, btn) {
    Cart.addItem(productId, 1);
    btn.classList.add('added');
    btn.textContent = '✓';
    setTimeout(() => { btn.classList.remove('added'); btn.textContent = '+'; }, 1200);
    const p = getProductById(productId);
    showToast(`${p?.emoji} ${p?.name} agregado al carrito`, 'success');
  }

  /* ─── Categorías ─────────────────────────────────────────── */
  function initCategories() {
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.cat);
      });
    });
  }

  /* ─── Modal de producto ──────────────────────────────────── */
  function openProductModal(productId) {
    const p = getProductById(productId);
    if (!p) return;
    activeProduct = p;
    modalQty      = 1;

    const modal = document.getElementById('productModal');
    if (!modal) return;

    // Llenar contenido
    document.getElementById('modalImg').textContent         = p.emoji;
    document.getElementById('modalCategory').textContent    = p.categoryLabel;
    document.getElementById('modalTitle').textContent       = p.name;
    document.getElementById('modalStars').textContent       = _starsHtml(p.rating);
    document.getElementById('modalStars').setAttribute('aria-label', `Rating: ${p.rating}`);
    document.getElementById('modalDescription').textContent = p.description;
    document.getElementById('modalPrice').textContent       = `$${p.price.toFixed(2)}`;
    document.getElementById('modalQty').textContent         = modalQty;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Focus en el cierre para accesibilidad
    document.getElementById('modalClose')?.focus();
  }

  function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal?.classList.add('hidden');
    document.body.style.overflow = '';
    activeProduct = null;
    modalQty      = 1;
  }

  function initModal() {
    document.getElementById('modalClose')?.addEventListener('click', closeProductModal);
    document.getElementById('modalBackdrop')?.addEventListener('click', closeProductModal);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeProductModal();
    });

    document.getElementById('modalQtyMinus')?.addEventListener('click', () => {
      if (modalQty > 1) {
        modalQty--;
        document.getElementById('modalQty').textContent = modalQty;
      }
    });

    document.getElementById('modalQtyPlus')?.addEventListener('click', () => {
      modalQty++;
      document.getElementById('modalQty').textContent = modalQty;
    });

    document.getElementById('modalAddBtn')?.addEventListener('click', () => {
      if (!activeProduct) return;
      Cart.addItem(activeProduct.id, modalQty);
      showToast(`${activeProduct.emoji} ×${modalQty} ${activeProduct.name} agregado`, 'success');
      closeProductModal();
    });
  }

  /* ─── Carrito: Render ────────────────────────────────────── */
  function renderCart() {
    const container = document.getElementById('cartItems');
    const emptyEl   = document.getElementById('cartEmpty');
    const summaryEl = document.getElementById('cartSummary');
    if (!container) return;

    const items = Cart.getItems();
    const empty = items.length === 0;

    container.innerHTML  = '';
    emptyEl?.classList.toggle('hidden',   !empty);
    summaryEl?.classList.toggle('hidden', empty);

    items.forEach(({ id, qty, product: p }) => {
      const item = document.createElement('div');
      item.className = 'cart-item';
      item.dataset.id = id;
      item.innerHTML = `
        <div class="cart-item__img">${p.emoji}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${p.name}</div>
          <div class="cart-item__price">$${(p.price * qty).toFixed(2)}</div>
          <div class="cart-item__controls">
            <button class="qty-btn" data-action="dec" aria-label="Reducir cantidad">−</button>
            <span class="qty-value">${qty}</span>
            <button class="qty-btn" data-action="inc" aria-label="Aumentar cantidad">+</button>
          </div>
        </div>
        <button class="cart-item__remove" aria-label="Eliminar ${p.name}">🗑️</button>
      `;

      item.querySelector('[data-action="dec"]').addEventListener('click', () => {
        Cart.updateQty(id, qty - 1);
        renderCart();
      });
      item.querySelector('[data-action="inc"]').addEventListener('click', () => {
        Cart.updateQty(id, qty + 1);
        renderCart();
      });
      item.querySelector('.cart-item__remove').addEventListener('click', () => {
        Cart.removeItem(id);
        renderCart();
        showToast(`${p.name} eliminado del carrito`, 'info');
      });

      container.appendChild(item);
    });

    // Totales
    const subEl  = document.getElementById('summarySubtotal');
    const shipEl = document.getElementById('summaryShipping');
    const totEl  = document.getElementById('summaryTotal');
    if (subEl)  subEl.textContent  = `$${Cart.getSubtotal().toFixed(2)}`;
    if (shipEl) shipEl.textContent = Cart.getShipping() === 0 ? 'Gratis' : `$${Cart.getShipping().toFixed(2)}`;
    if (totEl)  totEl.textContent  = `$${Cart.getTotal().toFixed(2)}`;
  }

  /* ─── Nav y checkout btn ─────────────────────────────────── */
  function initNav() {
    NAV_BTNS.forEach(btn => {
      btn.addEventListener('click', () => showView(btn.dataset.view));
    });

    document.getElementById('logoBtn')?.addEventListener('click', e => {
      e.preventDefault();
      showView('store');
    });

    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
      if (Cart.isEmpty()) {
        showToast('Tu carrito está vacío', 'error');
        return;
      }
      showView('checkout');
    });
  }

  /* ─── PWA Service Worker ─────────────────────────────────── */
  function registerSW() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('./sw.js')
          .catch(err => console.warn('SW no registrado:', err));
      });
    }
  }

  /* ─── Init ────────────────────────────────────────────────── */
  function init() {
    registerSW();
    initNav();
    initCategories();
    initModal();
    Checkout.init();

    // Suscribir al carrito para actualizar el badge y re-render si está visible
    Cart.onChange(() => {
      updateBadge();
      if (activeView === 'cart') renderCart();
    });

    // Render inicial
    renderProducts('all');
    updateBadge();
    showView('store');
  }

  // Arrancar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { showView, goHome };
})();
