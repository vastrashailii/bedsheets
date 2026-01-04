// script.js - responsive behavior + renders products and handles sort, modal, cart, checkout, and mobile nav
(function(){
  // Elements
  const productsContainer = document.getElementById('products');
  const resultCount = document.getElementById('result-count');
  const sortEl = document.getElementById('sort');

  // Modals
  const modal = document.getElementById('product-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  // Nav
  const navToggle = document.getElementById('nav-toggle');
  const navBackdrop = document.getElementById('nav-backdrop');

  // Cart
  const cartButton = document.getElementById('cart-button');
  const cartCountEl = document.getElementById('cart-count');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const clearCartBtn = document.getElementById('clear-cart');
  const cartCloseBtn = document.getElementById('cart-close');
  const checkoutBtn = document.getElementById('checkout');

  // Checkout
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutClose = document.getElementById('checkout-close');
  const checkoutCancel = document.getElementById('checkout-cancel');
  const checkoutForm = document.getElementById('checkout-form');

  // WhatsApp button (if you want to add extra logic)
  const floatingWhatsApp = document.getElementById('floating-whatsapp');

  // Constants
  const STORAGE_KEY = 'cart_v1';
  const WHATSAPP_NUMBER = '919887259471'; // +91 9887259471 (no +)

  // Utilities
  function formatPrice(p){
    return "₹" + p.toLocaleString('en-IN');
  }

  // CART storage helpers
  function getCart(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error('Failed to read cart', e);
      return {};
    }
  }
  function saveCart(cart){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function addToCart(productId, qty = 1){
    const cart = getCart();
    if(!cart[productId]) cart[productId] = 0;
    cart[productId] += qty;
    saveCart(cart);
    renderCart();
  }

  function setCartItem(productId, qty){
    const cart = getCart();
    if(qty <= 0) delete cart[productId];
    else cart[productId] = qty;
    saveCart(cart);
    renderCart();
  }

  function removeFromCart(productId){
    const cart = getCart();
    delete cart[productId];
    saveCart(cart);
    renderCart();
  }

  function clearCart(){
    localStorage.removeItem(STORAGE_KEY);
    renderCart();
  }

  function cartItemCount(){
    const cart = getCart();
    return Object.values(cart).reduce((s,n)=>s + n, 0);
  }

  // RENDER CART
  function renderCart(){
    const cart = getCart();
    cartItemsContainer.innerHTML = '';
    let total = 0;
    const ids = Object.keys(cart);
    if(ids.length === 0){
      cartItemsContainer.innerHTML = `<p style="color:var(--muted);padding:12px">Your cart is empty.</p>`;
      cartTotalEl.textContent = formatPrice(0);
      checkoutBtn.setAttribute('disabled', 'true');
    } else {
      ids.forEach(id => {
        const product = products.find(p=>p.id === id);
        const qty = cart[id];
        if(!product) return;
        const subtotal = product.price * qty;
        total += subtotal;
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div class="info">
            <h4>${product.name}</h4>
            <div class="meta">${product.sizes.join(' · ')}</div>
            <div class="qty">
              <button class="qty-decrease" data-id="${id}" aria-label="Decrease quantity">−</button>
              <span class="qty-value" data-id="${id}">${qty}</span>
              <button class="qty-increase" data-id="${id}" aria-label="Increase quantity">+</button>
              <button class="btn-ghost remove-item" data-id="${id}" style="margin-left:8px">Remove</button>
            </div>
          </div>
          <div style="min-width:72px;text-align:right">
            <div style="font-weight:700">${formatPrice(subtotal)}</div>
          </div>
        `;
        cartItemsContainer.appendChild(item);
      });
      cartTotalEl.textContent = formatPrice(total);
      checkoutBtn.removeAttribute('disabled');
    }

    // update header count
    const count = cartItemCount();
    cartCountEl.textContent = count;
    cartCountEl.setAttribute('aria-hidden', count === 0 ? 'true' : 'false');

    // attach qty/remove handlers
    cartItemsContainer.querySelectorAll('.qty-increase').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-id');
        const cart = getCart();
        const current = cart[id] || 0;
        setCartItem(id, current + 1);
      });
    });
    cartItemsContainer.querySelectorAll('.qty-decrease').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-id');
        const cart = getCart();
        const current = cart[id] || 0;
        setCartItem(id, current - 1);
      });
    });
    cartItemsContainer.querySelectorAll('.remove-item').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-id');
        removeFromCart(id);
      });
    });
  }

  // CART open/close
  function openCart(){
    renderCart();
    cartDrawer.setAttribute('aria-hidden','false');
    cartBackdrop.hidden = false;
    cartButton.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
    cartDrawer.focus && cartDrawer.focus();
  }
  function closeCart(){
    cartDrawer.setAttribute('aria-hidden','true');
    cartBackdrop.hidden = true;
    cartButton.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }

  cartButton.addEventListener('click', ()=>{
    const isOpen = cartDrawer.getAttribute('aria-hidden') === 'false';
    if(isOpen) closeCart();
    else openCart();
  });
  cartCloseBtn.addEventListener('click', closeCart);
  cartBackdrop.addEventListener('click', closeCart);

  // Mobile nav toggle
  function openNav(){
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded','true');
    navBackdrop.hidden = false;
    navBackdrop.style.display = 'block';
    document.body.style.overflow = 'hidden';
    navToggle.setAttribute('aria-label', 'Close navigation');
  }
  function closeNav(){
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded','false');
    navBackdrop.hidden = true;
    navBackdrop.style.display = 'none';
    document.body.style.overflow = '';
    navToggle.setAttribute('aria-label', 'Open navigation');
  }

  navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if(expanded) closeNav(); else openNav();
  });
  navBackdrop.addEventListener('click', closeNav);

  // Global keyboard handler
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      if(cartDrawer.getAttribute('aria-hidden') === 'false') closeCart();
      if(modal.getAttribute('aria-hidden') === 'false') closeModal();
      if(checkoutModal.getAttribute('aria-hidden') === 'false') closeCheckoutModal();
      if(document.body.classList.contains('nav-open')) closeNav();
    }
  });

  // Product rendering and modal
  function createCard(product){
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="media" tabindex="0" role="button" aria-pressed="false" data-id="${product.id}">
        ${product.onSale ? `<div class="badge">SALE</div>` : ''}
        <img loading="lazy" src="${product.image}" alt="${product.name}" />
      </div>
      <div class="content">
        <div>
          <h3>${product.name}</h3>
          <p class="meta">${product.sizes.join(' · ')}</p>
        </div>
        <div>
          <div class="price">${formatPrice(product.price)}</div>
          <div class="actions">
            <button class="btn-ghost" data-action="view" data-id="${product.id}">Quick view</button>
            <button class="btn" data-action="add" data-id="${product.id}">Add to cart</button>
          </div>
        </div>
      </div>
    `;
    // add events
    card.querySelectorAll('[data-action="view"], .media').forEach(el=>{
      el.addEventListener('click', ()=> openModal(product.id));
      el.addEventListener('keydown', (e)=> {
        if(e.key === 'Enter' || e.key === ' ') openModal(product.id);
      });
    });
    card.querySelector('[data-action="add"]').addEventListener('click', (e)=>{
      const id = e.currentTarget.getAttribute('data-id');
      addToCart(id, 1);
    });
    return card;
  }

  function renderProducts(list){
    productsContainer.innerHTML = '';
    list.forEach(p => productsContainer.appendChild(createCard(p)));
    resultCount.textContent = `${list.length} products`;
  }

  function sortProducts(list, mode){
    const copy = [...list];
    if(mode === 'price-asc') copy.sort((a,b)=>a.price - b.price);
    else if(mode === 'price-desc') copy.sort((a,b)=>b.price - a.price);
    else if(mode === 'name-asc') copy.sort((a,b)=>a.name.localeCompare(b.name));
    return copy;
  }

  function openModal(id){
    const product = products.find(p => p.id === id);
    if(!product) return;
    modalBody.innerHTML = `
      <div class="left" style="margin-bottom:12px;">
        <img src="${product.image}" alt="${product.name}" style="width:100%;height:auto;max-height:420px;object-fit:cover;">
      </div>
      <div class="right">
        <h2 style="margin-top:0;font-family:'Playfair Display', serif;">${product.name}</h2>
        <p style="color:var(--muted)">${product.description}</p>
        <p style="font-weight:700;margin-top:12px">${formatPrice(product.price)}</p>
        <p style="margin-top:12px;color:var(--muted)">Sizes: ${product.sizes.join(', ')}</p>
        <div style="margin-top:18px;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" id="modal-add-to-cart" data-id="${product.id}">Add to cart</button>
          <button class="btn-ghost" id="view-details">View details</button>
        </div>
      </div>
    `;
    const addBtn = document.getElementById('modal-add-to-cart');
    addBtn.addEventListener('click', ()=>{
      addToCart(product.id, 1);
    });

    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{
    if(e.target === modal) closeModal();
  });

  // Checkout flow
  function openCheckoutModal(){
    const cart = getCart();
    if(Object.keys(cart).length === 0){
      alert('Your cart is empty.');
      return;
    }
    checkoutModal.setAttribute('aria-hidden','false');
    closeCart();
    document.body.style.overflow = 'hidden';
    checkoutForm.reset();
  }
  function closeCheckoutModal(){
    checkoutModal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  checkoutBtn.addEventListener('click', openCheckoutModal);
  checkoutClose.addEventListener('click', closeCheckoutModal);
  if (checkoutCancel) checkoutCancel.addEventListener('click', closeCheckoutModal);

  // Checkout submit -> WhatsApp
  checkoutForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('buyer-name').value.trim();
    const mobile = document.getElementById('buyer-mobile').value.trim();
    const email = document.getElementById('buyer-email').value.trim();
    const address = document.getElementById('buyer-address').value.trim();
    const pincode = document.getElementById('buyer-pincode').value.trim();
    const state = document.getElementById('buyer-state').value.trim();

    if(!name || !mobile || !email || !address || !pincode || !state){
      alert('Please fill all required fields.');
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRe.test(email)){
      alert('Please enter a valid email address.');
      return;
    }
    if(!/^\d{5,6}$/.test(pincode)){
      if(!confirm('Pincode looks unusual. Continue anyway?')) return;
    }
    if(!/^\d{10,12}$/.test(mobile)){
      if(!confirm('Mobile number looks unusual. Continue anyway?')) return;
    }

    // build order message
    const cart = getCart();
    const ids = Object.keys(cart);
    if(ids.length === 0){
      alert('Cart is empty.');
      closeCheckoutModal();
      return;
    }

    let total = 0;
    let lines = [];
    lines.push('New order from website - Bedding collection');
    lines.push('');
    lines.push('Customer details:');
    lines.push(`Name: ${name}`);
    lines.push(`Mobile: ${mobile}`);
    lines.push(`Email: ${email}`);
    lines.push(`Address: ${address}`);
    lines.push(`Pincode: ${pincode}`);
    lines.push(`State: ${state}`);
    lines.push('');
    lines.push('Items:');

    ids.forEach((id, idx) => {
      const product = products.find(p => p.id === id);
      const qty = cart[id];
      if(!product) return;
      const subtotal = product.price * qty;
      total += subtotal;
      lines.push(`${idx+1}. ${product.name} — Qty: ${qty} — ${formatPrice(product.price)} — Subtotal: ${formatPrice(subtotal)}`);
    });

    lines.push('');
    lines.push(`Total: ${formatPrice(total)}`);
    lines.push('');
    lines.push('Please confirm availability and payment instructions.');
    const message = encodeURIComponent(lines.join('\n'));

    // open WhatsApp
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(waUrl, '_blank', 'noopener');

    // clear cart after opening WhatsApp (as requested)
    clearCart();
    closeCheckoutModal();
    alert('WhatsApp window opened with your order. Please review and send the message from WhatsApp.');
  });

  // Sort control
  sortEl.addEventListener('change', (e)=>{
    const sorted = sortProducts(products, e.target.value);
    renderProducts(sorted);
  });

  // clear cart confirm
  clearCartBtn.addEventListener('click', ()=>{
    if(confirm('Clear all items from the cart?')) clearCart();
  });

  // initial render
  renderProducts(products);
  renderCart();

  // newsletter simple behaviour (no backend)
  const newsletter = document.getElementById('newsletter-form');
  if(newsletter) newsletter.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Thank you! (This demo does not send emails.)');
  });

  // Improve touch targets: ensure buttons have min size (done in CSS)
  // Ensure resize handling: close mobile nav when resizing to desktop
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 900 && document.body.classList.contains('nav-open')){
      closeNav();
    }
  });

})();