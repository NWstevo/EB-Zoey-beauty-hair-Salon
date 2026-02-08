// =========================================================
// BOOKING: Calendly embed
// =========================================================

(function () {
  const embed = document.getElementById("bookingEmbed");
  if (!embed) return;

  function loadBookingInterface() {
    const calendlyUrl =
      "https://calendly.com/ebzoeysalon/appointment?hide_event_type_details=1&hide_gdpr_banner=1";

    embed.innerHTML = `
      <iframe
        title="Calendly Booking"
        src="${calendlyUrl}"
        style="width:100%; height:100%; min-height:520px; border:0; border-radius:14px;"
        loading="lazy"
        allow="camera; microphone; fullscreen"
      ></iframe>
    `;
  }

  // Load interface when modal opens
  const modal = document.getElementById("bookingModal");
  if (!modal) return;

  const observer = new MutationObserver(() => {
    if (modal.classList.contains("isOpen")) {
      loadBookingInterface();
    }
  });

  observer.observe(modal, { attributes: true, attributeFilter: ["class"] });
})();
