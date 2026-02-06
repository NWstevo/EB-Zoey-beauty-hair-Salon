// =========================================================
// SLIDESHOW: hero background fade slideshow
// - Slow timing (about 7 seconds per image)
// - Uses CSS transitions for smooth fade
// - JS only toggles .isActive class
// =========================================================

(function () {
    const slidesWrap = document.getElementById("heroSlides");
    if (!slidesWrap) return;

    const slides = Array.from(slidesWrap.querySelectorAll(".heroSlide"));
    if (slides.length <= 1) return;

    const SLIDE_INTERVAL_MS = 7000; // "Slow" mode as agreed
    let index = 0;

    // Optional: pause when tab is not visible (saves CPU)
    function isTabVisible() {
        return document.visibilityState === "visible";
    }

    setInterval(() => {
        if (!isTabVisible()) return;

        slides[index].classList.remove("isActive");
        index = (index + 1) % slides.length;
        slides[index].classList.add("isActive");
    }, SLIDE_INTERVAL_MS);
})();
