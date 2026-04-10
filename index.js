// Obachi Mobile Shop - Core Business Logic
// TODO: Refactor this massive file into modules eventually. It's getting too big.
// Using jQuery for now because it's what I know best, but maybe migrate to React later?

$(document).ready(function() {
  // ----------------------------------------------------
  // 1. Initializers & UI State Setup
  // ----------------------------------------------------
  
  // Initialize Cart and Wishlist Badges
  updateCartBadge();
  updateWishlistBadge();
  
  // Theme Setup (Dark / Light Mode)
  initTheme();

  // Detect which page we are on
  const pathname = window.location.pathname;
  const isProductPage = pathname.includes('product.html');
  const isCartPage = pathname.includes('cart.html');
  const isIndexPage = !isProductPage && !isCartPage;

  // ----------------------------------------------------
  // 2. Theme Switching Logic
  // ----------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem('mobileshop_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleUI(savedTheme);

    // Event listener for toggle buttons (supports both index and other headers)
    $(document).on('click', '.theme-toggle-btn', function(e) {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('mobileshop_theme', newTheme);
      updateThemeToggleUI(newTheme);
      showToast("Theme Updated", "info", `Switched to ${newTheme} mode.`);
    });
  }

  function updateThemeToggleUI(theme) {
    const $toggleBtn = $('.theme-toggle-btn i');
    if (theme === 'dark') {
      $toggleBtn.removeClass('fa-moon').addClass('fa-sun');
    } else {
      $toggleBtn.removeClass('fa-sun').addClass('fa-moon');
    }
  }

  // ----------------------------------------------------
  // 3. Local Storage Cart & Wishlist Operations
  // ----------------------------------------------------
  function getCart() {
    return JSON.parse(localStorage.getItem('mobileshop_cart')) || [];
  }

  function saveCart(cart) {
    localStorage.setItem('mobileshop_cart', JSON.stringify(cart));
    updateCartBadge();
  }

  function addToCart(productId, qty = 1, options = {}) {
    let cart = getCart();
    let existing = cart.find(item => item.id === productId && 
      item.options.ram === options.ram && 
      item.options.color === options.color);
    
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty: qty, options: options });
    }
    saveCart(cart);
    
    const product = window.products.find(p => p.id === productId);
    showToast("Added to Cart", "success", `${product.name} has been added to your cart.`);
  }

  function removeFromCart(productId, options = {}) {
    let cart = getCart();
    cart = cart.filter(item => !(item.id === productId && 
      item.options.ram === options.ram && 
      item.options.color === options.color));
    saveCart(cart);
    showToast("Removed from Cart", "info", "Item has been removed from your cart.");
  }

  function getWishlist() {
    return JSON.parse(localStorage.getItem('mobileshop_wishlist')) || [];
  }

  function saveWishlist(wishlist) {
    localStorage.setItem('mobileshop_wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
  }

  function toggleWishlist(productId) {
    let wishlist = getWishlist();
    let index = wishlist.indexOf(productId);
    const product = window.products.find(p => p.id === productId);
    
    if (index !== -1) {
      wishlist.splice(index, 1);
      saveWishlist(wishlist);
      showToast("Removed from Wishlist", "info", `${product.name} removed from wishlist.`);
      return false;
    } else {
      wishlist.push(productId);
      saveWishlist(wishlist);
      showToast("Added to Wishlist", "success", `${product.name} added to wishlist!`);
      return true;
    }
  }

  function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.qty, 0);
    $('.color-primary-bg span.bg-light').text(count);
  }

  function updateWishlistBadge() {
    const wishlist = getWishlist();
    // Update badge in Wishlist nav link
    $('a:contains("Wishlist"), a:contains("Whishlist")').each(function() {
      $(this).html(`Wishlist(${wishlist.length})`);
    });
  }

  // ----------------------------------------------------
  // 4. Toast Notification Engine
  // ----------------------------------------------------
  function showToast(title, type, message) {
    let container = $('.toast-container');
    if (!container.length) {
      $('body').append('<div class="toast-container"></div>');
      container = $('.toast-container');
    }
    
    const iconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
    const toastClass = type === 'success' ? 'custom-toast-success' : 'custom-toast-info';
    
    const toastHtml = `
      <div class="custom-toast ${toastClass}">
        <i class="${iconClass}"></i>
        <div>
          <strong style="display:block;">${title}</strong>
          <span style="font-size: 12px; opacity: 0.95;">${message}</span>
        </div>
      </div>
    `;
    
    const $toast = $(toastHtml);
    container.append($toast);
    
    // Trigger slide animation
    setTimeout(() => {
      $toast.addClass('show');
    }, 50);
    
    // Fade out and remove
    setTimeout(() => {
      $toast.removeClass('show');
      setTimeout(() => {
        $toast.remove();
      }, 400);
    }, 3200);
  }

  // Helper: Generates stars based on float ratings
  function getRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars += '<span><i class="fas fa-star"></i></span>';
      } else if (i === fullStars + 1 && halfStar) {
        stars += '<span><i class="fas fa-star-half-alt"></i></span>';
      } else {
        stars += '<span><i class="far fa-star"></i></span>';
      }
    }
    return stars;
  }

  // ----------------------------------------------------
  // 5. Card Template Builder & Dynamic Rendering
  // ----------------------------------------------------
  function buildProductCard(product) {
    const wishlist = getWishlist();
    const isWishlisted = wishlist.includes(product.id) ? 'active' : '';
    
    return `
      <div class="product font-rale">
        <button class="wishlist-icon-btn ${isWishlisted}" data-id="${product.id}">
          <i class="fas fa-heart"></i>
        </button>
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" class="img-fluid">
        </a>
        <div class="text-center py-2">
          <h6>${product.name}</h6>
          <div class="rating text-warning font-size-12">
            ${getRatingStars(product.rating)}
          </div>
          <div class="price py-2">
            <span>$${product.price.toFixed(2)}</span>
          </div>
          <button class="btn btn-warning font-size-12 add-to-cart-home-btn" data-id="${product.id}">Add To Cart</button>
        </div>
      </div>
    `;
  }

  // Toggle wishlist button click on product cards
  $(document).on('click', '.wishlist-icon-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const productId = parseInt($(this).attr('data-id'));
    const added = toggleWishlist(productId);
    if (added) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });

  // Home Page Add To Cart Button click
  $(document).on('click', '.add-to-cart-home-btn', function(e) {
    e.preventDefault();
    const productId = parseInt($(this).attr('data-id'));
    addToCart(productId, 1, { ram: '6GB RAM', color: 'Midnight Black' }); // Default settings
  });

  // ----------------------------------------------------
  // 6. Homepage Logic & Carousel Setup
  // ----------------------------------------------------
  if (isIndexPage) {
    // 6.1 Banner Owl Carousel
    $("#banner-area .owl-carousel").owlCarousel({
      dots: true,
      items: 1,
      loop: true,
      autoplay: true,
      autoplayTimeout: 5000
    });

    // 6.2 Top Sales rendering
    const topSalesContainer = $("#Top-Sale .owl-carousel");
    topSalesContainer.empty();
    // Use first 6 products for Top Sales
    window.products.slice(0, 6).forEach(product => {
      topSalesContainer.append(`<div class="item py-2">${buildProductCard(product)}</div>`);
    });

    // Initialize Top Sale Carousel
    $("#Top-Sale .owl-carousel").owlCarousel({
      loop: true,
      nav: true,
      dots: false,
      responsive: {
        0: { items: 1 },
        600: { items: 3 },
        1000: { items: 5 }
      }
    });

    // 6.3 New Phones rendering
    const newPhonesContainer = $("#new-phones .owl-carousel");
    newPhonesContainer.empty();
    // Use last 6 products for New Phones
    window.products.slice(-6).forEach(product => {
      newPhonesContainer.append(`<div class="item py-2">${buildProductCard(product)}</div>`);
    });

    // Initialize New Phones Carousel
    $("#new-phones .owl-carousel").owlCarousel({
      loop: true,
      nav: false,
      dots: true,
      responsive: {
        0: { items: 1 },
        600: { items: 3 },
        1000: { items: 5 }
      }
    });

    // 6.4 Special Price (Isotope Grid) rendering
    const gridContainer = $("#special-price .grid");
    gridContainer.empty();
    window.products.forEach(product => {
      const cardHtml = `
        <div class="grid-item ${product.brand} col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
          ${buildProductCard(product)}
        </div>
      `;
      gridContainer.append(cardHtml);
    });

    // Initialize Isotope
    const $grid = $(".grid").isotope({
      itemSelector: '.grid-item',
      layoutMode: 'fitRows'
    });

    // Filter items on button click
    $(".button-group").on('click', 'button', function() {
      const filterValue = $(this).attr('data-filter');
      $grid.isotope({ filter: filterValue });
      
      // Update checked button state
      $(".button-group button").removeClass("is-checked");
      $(this).addClass("is-checked");
    });

    // Check if redirecting from brand dropdown menu
    const urlParams = new URLSearchParams(window.location.search);
    const filterBrand = urlParams.get('brand');
    if (filterBrand) {
      const btn = $(`.button-group button[data-filter=".${filterBrand}"]`);
      if (btn.length) {
        setTimeout(() => {
          $('html, body').animate({
            scrollTop: $("#special-price").offset().top - 80
          }, 600);
          btn.trigger('click');
        }, 400);
      }
    }

    // 6.5 Blogs Owl Carousel
    $("#blogs .owl-carousel").owlCarousel({
      loop: true,
      nav: false,
      dots: true,
      responsive: {
        0: { items: 1 },
        768: { items: 3 }
      }
    });
  }

  // ----------------------------------------------------
  // 7. Product Detail Page Logic
  // ----------------------------------------------------
  if (isProductPage) {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id')) || 1;
    const product = window.products.find(p => p.id === productId) || window.products[0];

    // Selected product configuration options
    let selectedRam = '6GB RAM';
    let selectedColor = 'Midnight Black';
    let detailQty = 1;

    // Load static product fields
    $("#product img.img-fluid").attr("src", product.image);
    $("#product h5.font-baloo").text(product.name);
    $("#product small").text(`By ${product.brand}`);
    $("#product .rating").html(getRatingStars(product.rating));
    
    // Set prices
    const mprPrice = product.price * 1.15;
    const savePrice = mprPrice - product.price;
    $("#product table td strike").text(`$${mprPrice.toFixed(2)}`);
    $("#product table td.font-size-20 span").text(product.price.toFixed(2));
    $("#product table td.font-size-16 span").text(savePrice.toFixed(2));

    // Description text
    $("#product .col-12 p:first-of-type").text(product.description);

    // Color selectors
    const colors = [
      { name: 'Midnight Black', class: 'color-primary-bg' },
      { name: 'Ocean Blue', class: 'color-second-bg' },
      { name: 'Sunset Amber', class: 'color-yellow-bg' }
    ];
    
    const colorContainer = $("#product .color .d-flex");
    colorContainer.html('<h6 class="font-baloo m-0 mr-3 align-self-center">Color:</h6>');
    colors.forEach((c, idx) => {
      const activeOutline = idx === 0 ? 'border border-dark' : '';
      const dotHtml = `
        <div class="p-1 rounded-circle dot-container ${activeOutline}" style="margin: 0 4px; cursor:pointer;" data-color="${c.name}">
          <div class="p-2 ${c.class} rounded-circle" style="width: 24px; height: 24px;"></div>
        </div>
      `;
      colorContainer.append(dotHtml);
    });

    // Color switch selection trigger
    $(document).on('click', '.dot-container', function() {
      $('.dot-container').removeClass('border border-dark');
      $(this).addClass('border border-dark');
      selectedColor = $(this).attr('data-color');
    });

    // RAM sizes selector active logic
    $(document).on('click', '.size button', function() {
      $('.size .font-rubik').removeClass('border-dark bg-dark text-white');
      $('.size button').removeClass('text-white');
      
      $(this).parent().addClass('border-dark bg-dark text-white');
      $(this).addClass('text-white');
      selectedRam = $(this).text();
    });

    // Hook quantity adjustments
    const $detailQtyInput = $(".qty .qty_input");
    
    $(".qty .qty-up").click(function(e) {
      e.preventDefault();
      let val = parseInt($detailQtyInput.val());
      if (val >= 1 && val < 10) {
        detailQty = val + 1;
        $detailQtyInput.val(detailQty);
      }
    });

    $(".qty .qty-down").click(function(e) {
      e.preventDefault();
      let val = parseInt($detailQtyInput.val());
      if (val > 1) {
        detailQty = val - 1;
        $detailQtyInput.val(detailQty);
      }
    });

    // Add To Cart action hooks
    $("#product button.btn-warning").click(function(e) {
      e.preventDefault();
      addToCart(product.id, detailQty, { ram: selectedRam, color: selectedColor });
    });

    // Proceed To Buy button hooks (redirects directly to checkout with details)
    $("#product button.btn-danger").click(function(e) {
      e.preventDefault();
      addToCart(product.id, detailQty, { ram: selectedRam, color: selectedColor });
      window.location.href = 'cart.html?checkout=true';
    });

    // Load Top Sales Carousel on details page
    const detailTopSales = $("#Top-Sale .owl-carousel");
    detailTopSales.empty();
    window.products.slice(0, 6).forEach(product => {
      detailTopSales.append(`<div class="item py-2">${buildProductCard(product)}</div>`);
    });

    $("#Top-Sale .owl-carousel").owlCarousel({
      loop: true,
      nav: true,
      dots: false,
      responsive: {
        0: { items: 1 },
        600: { items: 3 },
        1000: { items: 5 }
      }
    });
  }

  // ----------------------------------------------------
  // 8. Shopping Cart Page Logic
  // ----------------------------------------------------
  if (isCartPage) {
    renderCart();

    // Check if redirecting directly to checkout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('checkout') === 'true') {
      openCheckoutModal();
    }

    function renderCart() {
      const cart = getCart();
      const cartItemsContainer = $("#cart .col-sm-9");
      const subTotalSection = $("#cart .col-sm-3");
      const normalLayout = $("#cart .row");
      const emptyLayout = $(".empty-cart-message");

      if (cart.length === 0) {
        // Render Empty Cart Layout
        normalLayout.hide();
        if (!emptyLayout.length) {
          $("#cart").append(`
            <div class="empty-cart-message text-center py-5">
              <img src="assets/empty_cart.png" alt="Empty Cart" class="img-fluid mb-4" style="max-height: 250px;">
              <h4 class="font-baloo">Your shopping cart is empty</h4>
              <p class="font-rale text-muted">Looks like you haven't added anything to your cart yet.</p>
              <a href="index.html" class="btn btn-warning mt-3 px-5 py-2 font-rubik">Continue Shopping</a>
            </div>
          `);
        } else {
          emptyLayout.show();
        }
        return;
      }

      // Hide empty cart message if present
      if (emptyLayout.length) {
        emptyLayout.hide();
      }
      normalLayout.show();

      // Clear container and append titles
      cartItemsContainer.empty();
      cartItemsContainer.append('<h5 class="font-baloo font-size-20 border-bottom pb-2">Shopping Cart</h5>');

      let cartSubtotal = 0;
      let totalItemCount = 0;

      cart.forEach((item, idx) => {
        const product = window.products.find(p => p.id === item.id);
        if (!product) return;

        const totalProductPrice = product.price * item.qty;
        cartSubtotal += totalProductPrice;
        totalItemCount += item.qty;

        const itemHtml = `
          <div class="row border-bottom py-4 align-items-center" data-idx="${idx}">
            <div class="col-sm-2 text-center">
              <img src="${product.image}" style="height: 100px; object-fit:contain;" alt="${product.name}" class="img-fluid">
            </div>
            <div class="col-sm-8">
              <h5 class="font-baloo font-size-16 m-0">${product.name}</h5>
              <div class="d-flex flex-wrap gap-2 my-1 text-muted" style="font-size: 13px;">
                <span>By ${product.brand}</span> |
                <span>Size: <strong class="text-dark">${item.options.ram || '6GB RAM'}</strong></span> |
                <span>Color: <strong class="text-dark">${item.options.color || 'Midnight Black'}</strong></span>
              </div>
              
              <!-- Ratings -->
              <div class="d-flex align-items-center gap-2 mb-2">
                <div class="rating text-warning font-size-12">
                  ${getRatingStars(product.rating)}
                </div>
              </div>
              
              <!-- Actions -->
              <div class="qty d-flex align-items-center gap-3">
                <div class="d-flex font-rale align-items-center border rounded overflow-hidden" style="width: 120px;">
                  <button class="qty-down border-0 bg-light px-3 py-1 cart-qty-btn" data-action="down"><i class="fas fa-angle-down"></i></button>
                  <input type="text" class="qty_input border-0 text-center w-100 bg-white" disabled value="${item.qty}">
                  <button class="qty-up border-0 bg-light px-3 py-1 cart-qty-btn" data-action="up"><i class="fas fa-angle-up"></i></button>
                </div>
                <button type="button" class="btn-delete-cart font-baloo text-danger bg-transparent border-0" style="font-size:14px; padding:0;">Delete</button>
                <button type="button" class="btn-save-later font-baloo text-primary bg-transparent border-0" style="font-size:14px; padding:0;">Save For Later</button>
              </div>
            </div>
            <div class="col-sm-2 text-right">
              <div class="font-size-20 text-danger font-baloo">
                $<span>${totalProductPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        `;
        cartItemsContainer.append(itemHtml);
      });

      // Update Subtotal UI
      subTotalSection.html(`
        <div class="sub-total border rounded p-3 bg-light text-center">
          <h6 class="font-rale font-size-12 text-success py-2 m-0"><i class="fas fa-check"></i> Order is eligible for Free Delivery</h6>
          <hr class="my-2">
          <div class="py-2">
            <h5 class="font-baloo font-size-16">Subtotal (${totalItemCount} items)</h5>
            <h4 class="text-danger font-baloo font-weight-bold">$<span id="deal-price">${cartSubtotal.toFixed(2)}</span></h4>
            <button type="button" class="btn btn-warning w-100 mt-3 py-2 btn-proceed-buy font-rubik">Proceed To Buy</button>
          </div>
        </div>
      `);
    }

    // Cart Quantity Increase/Decrease
    $(document).on('click', '.cart-qty-btn', function(e) {
      e.preventDefault();
      const action = $(this).attr('data-action');
      const itemRow = $(this).closest('.row[data-idx]');
      const idx = parseInt(itemRow.attr('data-idx'));
      let cart = getCart();
      
      if (action === 'up') {
        if (cart[idx].qty < 10) {
          cart[idx].qty += 1;
        }
      } else {
        if (cart[idx].qty > 1) {
          cart[idx].qty -= 1;
        }
      }
      
      saveCart(cart);
      renderCart();
    });

    // Delete item from cart
    $(document).on('click', '.btn-delete-cart', function(e) {
      e.preventDefault();
      const itemRow = $(this).closest('.row[data-idx]');
      const idx = parseInt(itemRow.attr('data-idx'));
      const cart = getCart();
      const item = cart[idx];
      removeFromCart(item.id, item.options);
      renderCart();
    });

    // Save For Later (moves item to wishlist)
    $(document).on('click', '.btn-save-later', function(e) {
      e.preventDefault();
      const itemRow = $(this).closest('.row[data-idx]');
      const idx = parseInt(itemRow.attr('data-idx'));
      const cart = getCart();
      const item = cart[idx];
      
      // Toggle Wishlist to active
      const wishlist = getWishlist();
      if (!wishlist.includes(item.id)) {
        wishlist.push(item.id);
        saveWishlist(wishlist);
      }
      
      // Remove from cart
      cart.splice(idx, 1);
      saveCart(cart);
      
      showToast("Saved for Later", "success", "Item moved to your wishlist.");
      renderCart();
    });

    // Load Top Sales Carousel on cart page
    const cartNewPhones = $("#new-phones .owl-carousel");
    cartNewPhones.empty();
    window.products.slice(-6).forEach(product => {
      cartNewPhones.append(`<div class="item py-2">${buildProductCard(product)}</div>`);
    });

    $("#new-phones .owl-carousel").owlCarousel({
      loop: true,
      nav: false,
      dots: true,
      responsive: {
        0: { items: 1 },
        600: { items: 3 },
        1000: { items: 5 }
      }
    });

    // ----------------------------------------------------
    // 9. Checkout & Payment Modal logic
    // ----------------------------------------------------
    // Create the modal container inside DOM
    if (!$('.checkout-modal').length) {
      $('body').append(`
        <div id="checkoutModal" class="checkout-modal">
          <div class="checkout-content">
            <div class="modal-header-custom border-bottom pb-2">
              <h5 class="font-baloo font-size-18 m-0"><i class="fas fa-credit-card text-primary mr-2"></i> Secure Checkout</h5>
              <button class="modal-close-btn">&times;</button>
            </div>
            
            <form id="checkoutForm">
              <div class="mb-3">
                <label class="form-label font-size-14">Full Name</label>
                <input type="text" class="form-control" id="custName" required placeholder="John Doe">
                <div class="invalid-feedback">Please enter your name.</div>
              </div>
              <div class="mb-3">
                <label class="form-label font-size-14">Email Address</label>
                <input type="email" class="form-control" id="custEmail" required placeholder="john@example.com">
                <div class="invalid-feedback">Please enter a valid email address.</div>
              </div>
              <div class="mb-3">
                <label class="form-label font-size-14">Shipping Address</label>
                <textarea class="form-control" id="custAddr" rows="2" required placeholder="123 Migori Street, Nairobi"></textarea>
                <div class="invalid-feedback">Please enter your shipping address.</div>
              </div>
              
              <hr class="my-3">
              <h6 class="font-baloo mb-2">Payment Details</h6>
              
              <div class="mb-3">
                <label class="form-label font-size-14">Card Number</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-credit-card"></i></span>
                  <input type="text" class="form-control" id="cardNum" maxlength="19" required placeholder="4000 1234 5678 9010">
                </div>
                <div class="invalid-feedback" id="cardFeedback">Enter a valid 16-digit card number.</div>
              </div>
              
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label font-size-14">Expiry Date</label>
                  <input type="text" class="form-control" id="cardExpiry" maxlength="5" required placeholder="MM/YY">
                  <div class="invalid-feedback">MM/YY required.</div>
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label font-size-14">CVV</label>
                  <input type="text" class="form-control" id="cardCvv" maxlength="3" required placeholder="123">
                  <div class="invalid-feedback">3 digits.</div>
                </div>
              </div>
              
              <button type="submit" class="btn btn-warning w-100 py-2 mt-2 font-rubik btn-pay-now">Pay Now</button>
            </form>
            
            <div id="paymentSuccess" class="text-center py-4" style="display:none;">
              <div class="success-icon mb-3" style="font-size:50px; color:#10b981;">
                <i class="fas fa-check-circle animate__animated animate__zoomIn"></i>
              </div>
              <h5 class="font-baloo">Payment Successful!</h5>
              <p class="font-rale text-muted">Thank you for your purchase. Your order has been placed successfully.</p>
              <button class="btn btn-warning px-4 mt-2 modal-done-btn font-rubik">Awesome</button>
            </div>
          </div>
        </div>
      `);
    }

    // Modal Triggers
    $(document).on('click', '.btn-proceed-buy', function() {
      openCheckoutModal();
    });

    $(document).on('click', '.modal-close-btn', function() {
      closeCheckoutModal();
    });

    function openCheckoutModal() {
      $('#checkoutModal').addClass('show');
      $('#checkoutForm').show();
      $('#paymentSuccess').hide();
      $('.modal-header-custom').show();
      // Reset form
      $('#checkoutForm')[0].reset();
      $('#checkoutForm').removeClass('was-validated');
    }

    function closeCheckoutModal() {
      $('#checkoutModal').removeClass('show');
    }

    // Input masking for Credit Card
    $(document).on('input', '#cardNum', function() {
      let val = $(this).val().replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let matches = val.match(/\d{4,16}/g);
      let match = (matches && matches[0]) || '';
      let parts = [];

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }

      if (parts.length > 0) {
        $(this).val(parts.join(' '));
      } else {
        $(this).val(val);
      }
    });

    // Input masking for Expiry Date
    $(document).on('input', '#cardExpiry', function() {
      let val = $(this).val().replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (val.length >= 2) {
        $(this).val(val.substring(0, 2) + '/' + val.substring(2, 4));
      } else {
        $(this).val(val);
      }
    });

    // Input masking for CVV
    $(document).on('input', '#cardCvv', function() {
      let val = $(this).val().replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      $(this).val(val);
    });

    // Submit form validation and mock processing
    $(document).on('submit', '#checkoutForm', function(e) {
      e.preventDefault();
      const form = $(this)[0];
      
      let isValid = true;
      
      // Custom card validation
      const cardNum = $('#cardNum').val().replace(/\s/g, '');
      if (cardNum.length < 16) {
        $('#cardNum').addClass('is-invalid');
        isValid = false;
      } else {
        $('#cardNum').removeClass('is-invalid');
      }

      const expiry = $('#cardExpiry').val();
      if (expiry.length < 5 || !expiry.includes('/')) {
        $('#cardExpiry').addClass('is-invalid');
        isValid = false;
      } else {
        $('#cardExpiry').removeClass('is-invalid');
      }

      const cvv = $('#cardCvv').val();
      if (cvv.length < 3) {
        $('#cardCvv').addClass('is-invalid');
        isValid = false;
      } else {
        $('#cardCvv').removeClass('is-invalid');
      }

      if (!form.checkValidity() || !isValid) {
        $(this).addClass('was-validated');
        return;
      }

      // If valid, start loading state
      const payBtn = $('.btn-pay-now');
      payBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i> Processing...');

      setTimeout(() => {
        // Mock success
        $('#checkoutForm').hide();
        $('.modal-header-custom').hide();
        $('#paymentSuccess').show();
        
        // Empty the cart
        localStorage.removeItem('mobileshop_cart');
        updateCartBadge();
      }, 1500);
    });

    // Click "Awesome" after successful checkout
    $(document).on('click', '.modal-done-btn', function() {
      closeCheckoutModal();
      window.location.href = 'index.html';
    });
  }
});