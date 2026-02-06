// =========================================================
// BOOKING: Calendly embed loader + future payment hooks
//
// IMPORTANT: Replace CALENDLY_URL with your real Calendly link.
//
// Future plan (no rewrite needed):
// - Insert payment step before booking (deposit)
// - Or insert payment step after booking (confirmation)
// - Send email notifications via backend (or third-party service)
// =========================================================

(function () {
    const embed = document.getElementById("bookingEmbed");
    if (!embed) return;

    // ================================
    // 1) Calendly URL (REPLACE THIS)
    // ================================
    const CALENDLY_URL = "https://calendly.com/your-calendly-link-here";

    // Prevent reloading the iframe every time the modal opens
    let iframeLoaded = false;

    function buildCalendlyUrl() {
        // Selected service is stored in modal.js when user clicks any Book button
        const service = window.__EBZ_SELECTED_SERVICE__ || "general";

        // You can later use these query params to route services
        // or to prefill customer details when you have them.
        const url = new URL(CALENDLY_URL);

        // Example: tag service (safe for future logic)
        url.searchParams.set("service", service);

        return url.toString();
    }

    function loadCalendlyIframe() {
        if (iframeLoaded) return;

        // Simple safety check
        if (!CALENDLY_URL || CALENDLY_URL.includes("your-calendly-link-here")) {
            embed.innerHTML = `
        <p class="muted">
          Calendly is not configured yet.<br>
          Open <strong>js/booking.js</strong> and replace <strong>CALENDLY_URL</strong> with your real link.
        </p>
      `;
            return;
        }

        // Create iframe once and keep it for subsequent opens
        const iframe = document.createElement("iframe");
        iframe.src = buildCalendlyUrl();
        iframe.title = "Calendly booking";
        iframe.style.width = "100%";
        iframe.style.height = "560px";
        iframe.style.border = "0";
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";

        // Clear placeholder and attach iframe
        embed.innerHTML = "";
        embed.appendChild(iframe);

        iframeLoaded = true;
    }

    // Load iframe when modal opens (first time only)
    // We observe class change for "isOpen".
    const modal = document.getElementById("bookingModal");
    if (!modal) return;

    const observer = new MutationObserver(() => {
        if (modal.classList.contains("isOpen")) {
            // Reload URL with updated service tag if needed:
            // If you want it to change each time based on which page user is on,
            // we can update iframe.src here instead of caching.
            loadCalendlyIframe();
        }
    });

    observer.observe(modal, { attributes: true, attributeFilter: ["class"] });

    // ================================
    // 2) Future payment hooks (reserved)
    // ================================
    // Later we will:
    // - unhide #paymentStep
    // - insert Stripe/PayPal
    // - decide deposit amount per service
    // - only proceed to Calendly after payment success OR confirm payment after booking
})();
