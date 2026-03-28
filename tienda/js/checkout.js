/**
 * checkout.js — Flujo de checkout de 3 pasos (simulado)
 */

const Checkout = (() => {
  let currentStep = 1;
  let shippingData = {};
  let selectedMethod = 'card';

  /* ─── Stepper ─────────────────────────────────────────────── */
  function _setStep(n) {
    currentStep = n;

    // Mostrar/ocultar pasos
    ['step1', 'step2', 'step3'].forEach((id, idx) => {
      document.getElementById(id)?.classList.toggle('hidden', idx + 1 !== n);
    });

    // Actualizar círculos del stepper
    document.querySelectorAll('.step[data-step]').forEach(el => {
      const s = parseInt(el.dataset.step, 10);
      el.classList.toggle('active', s === n);
      el.classList.toggle('done', s < n);
    });

    // Líneas del stepper
    document.querySelectorAll('.step__line').forEach((el, idx) => {
      el.classList.toggle('done', idx + 1 < n);
    });
  }

  /* ─── Validaciones ────────────────────────────────────────── */
  function _validateShipping() {
    let valid = true;

    const rules = [
      { id: 'firstName', label: 'firstNameError',  test: v => v.length >= 2 },
      { id: 'lastName',  label: 'lastNameError',   test: v => v.length >= 2 },
      {
        id: 'email', label: 'emailError',
        test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      },
      {
        id: 'phone', label: 'phoneError',
        test: v => /^[\d\s\+\-\(\)]{7,}$/.test(v),
      },
      { id: 'address', label: 'addressError', test: v => v.length >= 5 },
      { id: 'city',    label: 'cityError',    test: v => v.length >= 2 },
      {
        id: 'zip', label: 'zipError',
        test: v => /^\d{4,10}$/.test(v.replace(/\s/g, '')),
      },
    ];

    rules.forEach(({ id, label, test }) => {
      const input = document.getElementById(id);
      const errEl = document.getElementById(label);
      if (!input) return;
      const val = input.value.trim();
      const ok  = test(val);
      if (!ok) {
        valid = false;
        input.classList.add('error');
        if (errEl) errEl.textContent = 'Campo inválido o requerido';
      } else {
        input.classList.remove('error');
        if (errEl) errEl.textContent = '';
      }
    });

    return valid;
  }

  function _validateCard() {
    let valid = true;

    const holderEl = document.getElementById('cardHolder');
    const numberEl = document.getElementById('cardNumber');
    const expiryEl = document.getElementById('cardExpiry');
    const cvvEl    = document.getElementById('cardCvv');

    const holderOk = holderEl.value.trim().length >= 3;
    _setFieldError('cardHolder', 'cardHolderError', holderOk, 'Nombre requerido');

    const rawNumber = numberEl.value.replace(/\s/g, '');
    const numberOk  = /^\d{13,19}$/.test(rawNumber);
    _setFieldError('cardNumber', 'cardNumberError', numberOk, 'Número de tarjeta inválido');

    const expiryOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryEl.value);
    _setFieldError('cardExpiry', 'cardExpiryError', expiryOk, 'Formato MM/AA inválido');

    const cvvOk = /^\d{3,4}$/.test(cvvEl.value.trim());
    _setFieldError('cardCvv', 'cardCvvError', cvvOk, 'CVV inválido');

    if (!holderOk || !numberOk || !expiryOk || !cvvOk) valid = false;
    return valid;
  }

  function _setFieldError(inputId, errorId, isOk, msg) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errorId);
    if (!input) return;
    input.classList.toggle('error', !isOk);
    if (err) err.textContent = isOk ? '' : msg;
  }

  /* ─── Formateo de inputs ──────────────────────────────────── */
  function _initCardFormatting() {
    const numInput = document.getElementById('cardNumber');
    if (numInput) {
      numInput.addEventListener('input', () => {
        let v = numInput.value.replace(/\D/g, '').substring(0, 16);
        numInput.value = v.replace(/(.{4})/g, '$1 ').trim();

        // Detectar tipo básico
        const icon = document.getElementById('cardTypeIcon');
        if (icon) {
          if (/^4/.test(v))      icon.textContent = '🔵'; // Visa
          else if (/^5/.test(v)) icon.textContent = '🔴'; // MC
          else if (/^3/.test(v)) icon.textContent = '🟡'; // Amex
          else                   icon.textContent = '💳';
        }
      });
    }

    const expInput = document.getElementById('cardExpiry');
    if (expInput) {
      expInput.addEventListener('input', () => {
        let v = expInput.value.replace(/\D/g, '').substring(0, 4);
        if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
        expInput.value = v;
      });
    }
  }

  /* ─── Métodos de pago ─────────────────────────────────────── */
  function _initPaymentMethods() {
    const opts = document.querySelectorAll('.payment-option');
    const cardF   = document.getElementById('cardForm');
    const paypalF = document.getElementById('paypalForm');
    const cashF   = document.getElementById('cashForm');

    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        opts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selectedMethod = opt.querySelector('input[name="payMethod"]').value;

        cardF?.classList.toggle('hidden',   selectedMethod !== 'card');
        paypalF?.classList.toggle('hidden', selectedMethod !== 'paypal');
        cashF?.classList.toggle('hidden',   selectedMethod !== 'cash');

        // Ref OXXO aleatoria
        if (selectedMethod === 'cash') {
          const ref = document.getElementById('oxxoRef');
          if (ref) ref.textContent = 'NOVA-' + _randRef();
        }
      });
    });
  }

  function _randRef() {
    return Math.random().toString(36).substring(2, 6).toUpperCase() +
           '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  }

  /* ─── Resumen paso 3 ──────────────────────────────────────── */
  function _populateOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    const orderSub   = document.getElementById('orderSubtotal');
    const orderTot   = document.getElementById('orderTotal');
    const shipSumm   = document.getElementById('shippingSummary');

    if (!orderItems) return;
    orderItems.innerHTML = '';

    Cart.getItems().forEach(({ product, qty }) => {
      const el = document.createElement('div');
      el.className = 'order-item';
      el.innerHTML = `
        <div class="order-item__img">${product.emoji}</div>
        <span class="order-item__name">${product.name} ×${qty}</span>
        <span class="order-item__price">$${(product.price * qty).toFixed(2)}</span>
      `;
      orderItems.appendChild(el);
    });

    if (orderSub) orderSub.textContent = `$${Cart.getSubtotal().toFixed(2)}`;
    if (orderTot) orderTot.textContent = `$${Cart.getTotal().toFixed(2)}`;

    if (shipSumm) {
      shipSumm.innerHTML = `
        <strong>Dirección de envío:</strong><br>
        ${shippingData.address}, ${shippingData.city} ${shippingData.zip}<br>
        ${shippingData.firstName} ${shippingData.lastName}<br>
        ${shippingData.email} · ${shippingData.phone}
      `;
    }
  }

  /* ─── Simular pago ────────────────────────────────────────── */
  function _simulatePay() {
    const payBtn = document.getElementById('payBtn');
    if (!payBtn) return;

    // Mostrar loader
    payBtn.disabled = true;
    payBtn.innerHTML = '<span class="loader"></span> Procesando…';

    setTimeout(() => {
      payBtn.disabled = false;
      payBtn.innerHTML = 'Pagar ahora →';
      _populateOrderSummary();
      _setStep(3);
    }, 2200);
  }

  /* ─── Confirmar pedido ────────────────────────────────────── */
  function _confirmOrder() {
    const btn = document.getElementById('confirmBtn');
    if (!btn) return;

    btn.disabled = true;
    btn.innerHTML = '<span class="loader"></span> Confirmando…';

    setTimeout(() => {
      // Generar número de pedido
      const orderId = '#NM' + Date.now().toString().slice(-7);
      const eta = _etaDate();

      const successOrderId = document.getElementById('successOrderId');
      const successEta     = document.getElementById('successEta');
      if (successOrderId) successOrderId.textContent = orderId;
      if (successEta)     successEta.textContent = eta;

      Cart.clear();
      App.showView('success');

      btn.disabled = false;
      btn.innerHTML = '✓ Confirmar pedido';
    }, 1800);
  }

  function _etaDate() {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  /* ─── Init / Bind eventos ─────────────────────────────────── */
  function init() {
    // Paso 1: form de envío
    const shippingForm = document.getElementById('shippingForm');
    if (shippingForm) {
      shippingForm.addEventListener('submit', e => {
        e.preventDefault();
        if (!_validateShipping()) return;

        shippingData = {
          firstName: document.getElementById('firstName').value.trim(),
          lastName:  document.getElementById('lastName').value.trim(),
          email:     document.getElementById('email').value.trim(),
          phone:     document.getElementById('phone').value.trim(),
          address:   document.getElementById('address').value.trim(),
          city:      document.getElementById('city').value.trim(),
          zip:       document.getElementById('zip').value.trim(),
        };
        _setStep(2);
      });
    }

    // Botón volver a paso 1
    document.getElementById('backToStep1')?.addEventListener('click', () => _setStep(1));

    // Botón pagar
    document.getElementById('payBtn')?.addEventListener('click', () => {
      if (selectedMethod === 'card' && !_validateCard()) return;
      _simulatePay();
    });

    // Botón volver a paso 2
    document.getElementById('backToStep2')?.addEventListener('click', () => _setStep(2));

    // Botón confirmar
    document.getElementById('confirmBtn')?.addEventListener('click', _confirmOrder);

    _initCardFormatting();
    _initPaymentMethods();
  }

  function resetSteps() {
    currentStep  = 1;
    shippingData = {};
    selectedMethod = 'card';
    _setStep(1);

    // Resetear formularios
    document.getElementById('shippingForm')?.reset();
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group input').forEach(el => el.classList.remove('error'));

    // Resetear método de pago a tarjeta
    document.querySelectorAll('.payment-option').forEach((opt, i) => {
      opt.classList.toggle('active', i === 0);
    });
    document.getElementById('cardForm')?.classList.remove('hidden');
    document.getElementById('paypalForm')?.classList.add('hidden');
    document.getElementById('cashForm')?.classList.add('hidden');
  }

  return { init, resetSteps };
})();
