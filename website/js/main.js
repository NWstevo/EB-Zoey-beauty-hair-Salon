// =========================================================
// MAIN: shared site logic
// - Mobile menu open/close
// - Footer year update
// =========================================================

(function () {
    const burger = document.getElementById("burger");
    const mobileMenu = document.getElementById("mobileMenu");

    // Mobile menu: toggle a class (cleaner than inline styles)
    if (burger && mobileMenu) {
        burger.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.toggle("isOpen");
            burger.setAttribute("aria-expanded", String(isOpen));
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll("a").forEach((a) => {
            a.addEventListener("click", () => {
                mobileMenu.classList.remove("isOpen");
                burger.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Update footer year everywhere
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Vision/about expand on click (hover handled in CSS)
    const visionBox = document.getElementById("visionBox");
    const visionToggle = document.getElementById("visionToggle");
    if (visionBox && visionToggle) {
        visionToggle.addEventListener("click", () => {
            const isExpanded = visionBox.classList.toggle("isExpanded");
            visionBox.setAttribute("aria-expanded", String(isExpanded));
            visionToggle.textContent = isExpanded ? "Show less" : "Read more";
        });
    }
})();
