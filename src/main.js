import './style.css'

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-./";

function animateSplitFlap(element, target, delay = 10) {
  const upperTarget = target.toUpperCase();

  setTimeout(() => {
    const cycles = 5 + Math.floor(Math.random() * 8);
    let currentCycle = 0;

    const interval = setInterval(() => {
      const isLastCycle = currentCycle >= cycles;

      const nextCharacter = isLastCycle
        ? upperTarget
        : CHARSET[Math.floor(Math.random() * CHARSET.length)];

      element.classList.add("flipping");

      setTimeout(() => {
        element.textContent = nextCharacter;
        element.classList.remove("flipping");
      }, 58);

      if (isLastCycle) {
        clearInterval(interval);
      }

      currentCycle++;
    }, 90);
  }, delay);
}


function initializeSplitFlap(container) {
  if (container.dataset.initialized === "true") {
    return;
  }

  const text = container.dataset.text || "";
  const charDelay = Number(container.dataset.charDelay) || 60;

  container.innerHTML = "";

  [...text].forEach((character, index) => {
    const tile = document.createElement("span");

    tile.className = "split-flap-tile";

    tile.textContent =
      CHARSET[Math.floor(Math.random() * CHARSET.length)];

    container.appendChild(tile);

    animateSplitFlap(
      tile,
      character,
      index * charDelay
    );
  });

  container.dataset.initialized = "true";
}

function observeSplitFlaps() {
  const splitFlaps = document.querySelectorAll(".split-flap");

  if (!("IntersectionObserver" in window)) {
    splitFlaps.forEach(initializeSplitFlap);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        initializeSplitFlap(entry.target);

        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2
    }
  );

  splitFlaps.forEach((splitFlap) => {
    observer.observe(splitFlap);
  });
}

function initializeMobileNavigation() {
  const menuButton = document.querySelector(".mobile-menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (!menuButton || !mobileMenu) {
    return;
  }

  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuButton.textContent = isOpen ? "✕" : "☰";
  });

  const links = mobileMenu.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.textContent = "☰";
    });
  });
}

function initializeSmoothNavigation() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
}

function initializeContactForm() {

    const form = document.querySelector("#contact-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const button = form.querySelector("button[type='submit']");
        const originalText = button.innerHTML;

        button.innerHTML = "SENDING...";

        const formData = new FormData(form);

        try {

            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {

                button.innerHTML =
                    'MESSAGE SENT <span class="text-air-400">✓</span>';

                form.reset();

                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 3000);

            } else {

                button.innerHTML = "ERROR";

                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 3000);
            }

        } catch (error) {

            console.error(error);

            button.innerHTML = "ERROR";

            setTimeout(() => {
                button.innerHTML = originalText;
            }, 3000);
        }
    });
}

function initializeProjectCarousel() {
  const carousels = document.querySelectorAll(".project-carousel");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".projects-grid");
    const prevButton = carousel.querySelector(".project-nav-prev");
    const nextButton = carousel.querySelector(".project-nav-next");

    if (!track || !prevButton || !nextButton) {
      return;
    }

    const getScrollAmount = () => {
      const firstCard = track.querySelector(".project-card");

      if (!firstCard) {
        return 360;
      }

      return firstCard.getBoundingClientRect().width;
    };

    const getMaxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

    prevButton.addEventListener("click", () => {
      const currentScroll = track.scrollLeft;
      const cardWidth = getScrollAmount();
      const target = Math.max(0, currentScroll - cardWidth);

      track.scrollTo({
        left: target,
        behavior: "smooth"
      });
    });

    nextButton.addEventListener("click", () => {
      const currentScroll = track.scrollLeft;
      const cardWidth = getScrollAmount();
      const maxScroll = getMaxScroll();
      const target = Math.min(maxScroll, currentScroll + cardWidth);

      track.scrollTo({
        left: target,
        behavior: "smooth"
      });
    });
  });
}

function initializeTimelineDetails() {
  const toggles = document.querySelectorAll(".timeline-toggle");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest(".timeline-item");

      if (!item) {
        return;
      }

      const isOpen = item.classList.toggle("is-open");
      const details = item.querySelector(".timeline-details");

      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "Fermer" : "En savoir plus";

      if (details) {
        details.style.maxHeight = isOpen ? `${details.scrollHeight}px` : "0px";
        details.setAttribute("aria-hidden", String(!isOpen));
      }
    });
  });
}

function initializeProjectDetails() {
  const projectCards = document.querySelectorAll(".project-toggle");
  const projectDetails =document.querySelectorAll(".project-detail");

  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const porjectId = card.dataset.project;
      const detail = document.getElementById(porjectId);

      if (!detail) {
          return;
      }

      if (detail.classList.contains("active")) {

          detail.classList.remove("active");
          detail.setAttribute("aria-hidden", "true");

      } 
      else {

          projectDetails.forEach(detail => {
              detail.classList.remove("active");
              detail.setAttribute("aria-hidden", "true");
          });

          detail.classList.add("active");
          detail.setAttribute("aria-hidden", "false");
      }

      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeMobileNavigation();
  initializeSmoothNavigation();
  observeSplitFlaps();
  initializeContactForm();
  initializeProjectCarousel();
  initializeTimelineDetails();
  initializeProjectDetails();
});