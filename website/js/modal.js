// =========================================================
// MODAL: shared booking popup behavior
// - Opens from any button with class ".bookBtn"
// - Closes via close button, backdrop click, or ESC key
// - Locks background scroll while open
// - Designed so future "payment step" can be inserted later
// =========================================================

(function () {
  const modal = document.getElementById("bookingModal");
  const closeBtn = document.getElementById("modalCloseBtn");

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

    // Focus close button for accessibility
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("isOpen");
    modal.setAttribute("aria-hidden", "true");
    unlockScroll();

    // Restore focus to the element that opened the modal
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  // Open modal from any booking button
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".bookBtn");
    if (!btn) return;

    // Store selected service for later use (Calendly prefill / payments)
    const service = btn.getAttribute("data-service") || "general";
    window.__EBZ_SELECTED_SERVICE__ = service;

    openModal(btn);
  });

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

  // Expose close function (useful later when payments are added)
  window.__EBZ_CLOSE_BOOKING_MODAL__ = closeModal;
})();
