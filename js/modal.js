// =========================================================
// MODAL: shared booking popup behavior
// - Opens from any button with class ".bookBtn"
// - Closes via close button, backdrop click, or ESC key
// - Locks background scroll while open
// - Designed so future "payment step" can be inserted later
// =========================================================

(function () {
  const PROMO_KEY = "ebz_promo_pending";
  const PROMO_NAME = "Valentine's Day 20% Off";
  const bookingModal = document.getElementById("bookingModal");
  const bookingCloseBtn = document.getElementById("modalCloseBtn");
  const appointmentModal = document.getElementById("appointmentModal");
  const appointmentCloseBtn = document.getElementById("appointmentModalCloseBtn");

  if (!bookingModal && !appointmentModal) return;

  let lastFocusedEl = null;
  let appointmentLastFocusedEl = null;

  function setPromoPending(value) {
    localStorage.setItem(PROMO_KEY, String(value));
    updatePromoButtons();
  }

  function isPromoPending() {
    return localStorage.getItem(PROMO_KEY) === "true";
  }

  function updatePromoButtons() {
    document.querySelectorAll(".promoClaim").forEach((btn) => {
      if (isPromoPending()) {
        btn.textContent = "Discount Ready";
        btn.disabled = true;
      } else {
        btn.textContent = "Claim Now!";
        btn.disabled = false;
      }
    });
  }

  function lockScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.style.overflow = "";
  }

  function openBookingModal(triggerEl) {
    if (!bookingModal) return;
    lastFocusedEl = triggerEl || document.activeElement;
    bookingModal.classList.add("isOpen");
    bookingModal.setAttribute("aria-hidden", "false");
    lockScroll();

    // Focus close button for accessibility
    if (bookingCloseBtn) bookingCloseBtn.focus();
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove("isOpen");
    bookingModal.setAttribute("aria-hidden", "true");
    unlockScroll();

    // Restore focus to the element that opened the modal
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  function openAppointmentModal(triggerEl) {
    if (!appointmentModal) return;
    appointmentLastFocusedEl = triggerEl || document.activeElement;
    appointmentModal.classList.add("isOpen");
    appointmentModal.setAttribute("aria-hidden", "false");
    lockScroll();
    if (appointmentCloseBtn) appointmentCloseBtn.focus();
  }

  function closeAppointmentModal() {
    if (!appointmentModal) return;
    appointmentModal.classList.remove("isOpen");
    appointmentModal.setAttribute("aria-hidden", "true");
    unlockScroll();
    if (appointmentLastFocusedEl && typeof appointmentLastFocusedEl.focus === "function") {
      appointmentLastFocusedEl.focus();
    }
  }

  // Claim promo button
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".promoClaim");
    if (!btn) return;
    setPromoPending(true);
  });

  // Open booking modal from any service-level button
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".bookBtn");
    if (!btn) return;

    // Store selected service for later use (Calendly prefill / payments)
    const service = btn.getAttribute("data-service") || "general";
    if (isPromoPending()) {
      window.__EBZ_SELECTED_SERVICE__ = `${service} + ${PROMO_NAME}`;
      setPromoPending(false);
    } else {
      window.__EBZ_SELECTED_SERVICE__ = service;
    }

    openBookingModal(btn);
  });

  // Open appointment selector from any "Book an Appointment" button
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".bookAppointmentBtn");
    if (!btn) return;
    openAppointmentModal(btn);
  });

  // Close button
  if (bookingCloseBtn) {
    bookingCloseBtn.addEventListener("click", closeBookingModal);
  }
  if (appointmentCloseBtn) {
    appointmentCloseBtn.addEventListener("click", closeAppointmentModal);
  }
  // Click backdrop to close
  if (bookingModal) {
    bookingModal.addEventListener("click", (e) => {
      const shouldClose = e.target && e.target.getAttribute("data-close-modal") === "true";
      if (shouldClose) closeBookingModal();
    });
  }
  if (appointmentModal) {
    appointmentModal.addEventListener("click", (e) => {
      const shouldClose = e.target && e.target.getAttribute("data-close-modal") === "true";
      if (shouldClose) closeAppointmentModal();
    });
  }

  // ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bookingModal && bookingModal.classList.contains("isOpen")) {
      closeBookingModal();
    }
    if (e.key === "Escape" && appointmentModal && appointmentModal.classList.contains("isOpen")) {
      closeAppointmentModal();
    }
  });

  // Expose close function (useful later when payments are added)
  window.__EBZ_CLOSE_BOOKING_MODAL__ = closeBookingModal;

  // Initialize promo button state
  updatePromoButtons();
})();
