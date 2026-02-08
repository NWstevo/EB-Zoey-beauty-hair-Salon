// =========================================================
// CART: Simple cart functionality for jewelry and cosmetics
// - Add items to cart
// - Display cart modal
// - Placeholder for PayPal checkout
// =========================================================

(function () {
    let cart = [];
    const DISCOUNT_KEY = "ebz_discount_pending";
    let discountPending = localStorage.getItem(DISCOUNT_KEY) === "true";
    const DISCOUNT_RATE = 0.2;
    const modal = document.getElementById("cartModal");
    const closeBtn = document.getElementById("cartModalCloseBtn");
    const cartItemsEl = document.getElementById("cartItems");
    const cartTotalEl = document.getElementById("cartTotal");
    const totalAmountEl = document.getElementById("totalAmount");
    const checkoutSection = document.getElementById("checkoutSection");
    const paypalBtn = document.getElementById("paypalBtn");

    if (!modal) return;

    let lastFocusedEl = null;

    function lockScroll() {
        document.body.style.overflow = "hidden";
    }

    function unlockScroll() {
        document.body.style.overflow = "";
    }

    function openModal(triggerEl) {
        lastFocusedEl = triggerEl || document.activeElement;
        modal.classList.add("isOpen");
        modal.setAttribute("aria-hidden", "false");
        lockScroll();
        updateCartDisplay();
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove("isOpen");
        modal.setAttribute("aria-hidden", "true");
        unlockScroll();
        if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
            lastFocusedEl.focus();
        }
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCounts = document.querySelectorAll("#cartCount, #cartCountMobile");
        cartCounts.forEach(el => el.textContent = count);
    }

    function getCartCount() {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="muted">Your cart is empty.</p>';
            cartTotalEl.hidden = true;
            checkoutSection.hidden = true;
            return;
        }

        let html = '<ul class="cartList">';
        let total = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
        <li class="cartItem">
          <span>${item.name} (x${item.quantity}) - €${itemTotal}</span>
          <button class="btn btnGhost removeBtn" data-index="${index}" type="button">Remove</button>
        </li>
      `;
        });
        html += '</ul>';
        cartItemsEl.innerHTML = html;
        totalAmountEl.textContent = total;
        cartTotalEl.hidden = false;
        checkoutSection.hidden = false;
    }

    function setDiscountPending(value) {
        discountPending = value;
        localStorage.setItem(DISCOUNT_KEY, String(value));
        updateDiscountButtonState();
    }

    function updateDiscountButtonState() {
        const btn = document.querySelector(".discountBtn");
        if (!btn) return;
        if (discountPending) {
            btn.textContent = "Discount Ready";
            btn.disabled = true;
        } else {
            btn.textContent = "Claim Now!!";
            btn.disabled = false;
        }
    }

    function addToCart(product, price) {
        let finalPrice = parseFloat(price);
        if (discountPending) {
            finalPrice = Math.max(0, +(finalPrice * (1 - DISCOUNT_RATE)).toFixed(2));
            setDiscountPending(false);

            const discountedName = `${product} (20% off)`;
            cart.push({ name: discountedName, price: finalPrice, quantity: 1 });
            updateCartCount();
            return;
        }

        const existing = cart.find(item => item.name === product);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name: product, price: finalPrice, quantity: 1 });
        }
        updateCartCount();
    }

    // Expose cart helpers
    window.addToCartFromBooking = addToCart;
    window.__EBZ_GET_CART_COUNT__ = getCartCount;

    // Add to cart buttons
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".addToCartBtn");
        if (!btn) return;
        const product = btn.getAttribute("data-product");
        const price = btn.getAttribute("data-price");
        addToCart(product, price);
        // Optional: show feedback
        btn.textContent = "Added!";
        setTimeout(() => btn.textContent = "Add to Cart", 1000);
    });

    // One-time discount button (applies to next item only)
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".discountBtn");
        if (!btn) return;
        if (!discountPending) {
            setDiscountPending(true);
        }
    });

    // Cart buttons
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".cartBtn");
        if (!btn) return;
        openModal(btn);
    });

    // Remove item
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".removeBtn");
        if (!btn) return;
        const index = parseInt(btn.getAttribute("data-index"));
        cart.splice(index, 1);
        updateCartCount();
        updateCartDisplay();
    });

    // PayPal placeholder
    if (paypalBtn) {
        paypalBtn.addEventListener("click", () => {
            alert("PayPal integration placeholder. In a real implementation, this would redirect to PayPal checkout.");
        });
    }

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Click backdrop to close
    modal.addEventListener("click", (e) => {
        const shouldClose = e.target && e.target.getAttribute("data-close-modal") === "true";
        if (shouldClose) closeModal();
    });

    // ESC to close
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("isOpen")) {
            closeModal();
        }
    });

    // Initialize cart count and discount state
    updateCartCount();
    updateDiscountButtonState();
})();
