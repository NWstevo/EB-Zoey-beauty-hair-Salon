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

    // Match services screen height to skills stack
    const skillsGrid = document.querySelector(".skillsGrid");
    const servicesScreen = document.querySelector(".servicesScreen");
    const syncServicesHeight = () => {
        if (!skillsGrid || !servicesScreen) return;
        const isWide = window.matchMedia("(min-width: 981px)").matches;
        if (!isWide) {
            servicesScreen.style.height = "auto";
            return;
        }
        servicesScreen.style.height = `${skillsGrid.offsetHeight}px`;
    };
    if (skillsGrid && servicesScreen) {
        syncServicesHeight();
        if ("ResizeObserver" in window) {
            const ro = new ResizeObserver(() => syncServicesHeight());
            ro.observe(skillsGrid);
            ro.observe(servicesScreen);
        } else {
            window.addEventListener("resize", () => {
                window.clearTimeout(syncServicesHeight._t);
                syncServicesHeight._t = window.setTimeout(syncServicesHeight, 120);
            });
        }
    }

    // Vision/about: cycle paragraphs section-by-section
    const visionText = document.getElementById("visionText");
    if (visionText) {
        const paragraphs = Array.from(visionText.querySelectorAll("p"));
        if (paragraphs.length > 0) {
            let currentIndex = 0;
            paragraphs.forEach((p, i) => p.classList.toggle("isActive", i === 0));

            const setFixedVisionHeight = () => {
                const first = paragraphs[0];
                if (!first) return;
                const clone = first.cloneNode(true);
                clone.classList.add("isActive");
                clone.style.position = "absolute";
                clone.style.inset = "auto";
                clone.style.left = "0";
                clone.style.top = "0";
                clone.style.right = "0";
                clone.style.opacity = "1";
                clone.style.visibility = "hidden";
                clone.style.pointerEvents = "none";
                clone.style.transform = "none";
                visionText.appendChild(clone);
                const height = clone.offsetHeight;
                clone.remove();
                if (height > 0) visionText.style.height = `${height}px`;
            };

            const showNext = () => {
                paragraphs[currentIndex].classList.remove("isActive");
                const nextIndex = (currentIndex + 1) % paragraphs.length;
                window.setTimeout(() => {
                    paragraphs[nextIndex].classList.add("isActive");
                    currentIndex = nextIndex;
                }, 500);
            };

            window.requestAnimationFrame(setFixedVisionHeight);
            window.addEventListener("resize", () => {
                window.clearTimeout(setFixedVisionHeight._t);
                setFixedVisionHeight._t = window.setTimeout(setFixedVisionHeight, 120);
            });

            window.setInterval(showNext, 10000);
        }
    }
})();
