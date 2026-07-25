(() => {
  const nav = document.querySelector(".navbar");

  function setNavState() {
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 24);
    }
  }

  setNavState();

  window.addEventListener("scroll", setNavState, {
    passive: true
  });

  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const revealItems = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });

  const counters = document.querySelectorAll("[data-count]");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const finalValue = Number(counter.dataset.count);
        const suffix = counter.dataset.suffix || "";
        const startTime = performance.now();
        const duration = 1100;

        function updateCounter(currentTime) {
          const progress = Math.min(
            (currentTime - startTime) / duration,
            1
          );

          const easedProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.floor(finalValue * easedProgress);

          counter.textContent =
            currentValue.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      });
    },
    {
      threshold: 0.6
    }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });

  const newsletterForm = document.querySelector(".newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const button = newsletterForm.querySelector("button");

      if (button) {
        button.textContent = "Thank you!";
        button.disabled = true;
      }
    });
  }
})();
