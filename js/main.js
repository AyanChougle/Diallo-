document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const mobileNav = document.querySelector(".mobile-nav");
  const menuButton = document.querySelector(".menu-button");
  const closeButton = document.querySelector(".mobile-close");

  window.addEventListener("load", () => {
    body.classList.add("loaded");
    setTimeout(() => document.querySelector(".loader")?.remove(), 900);
  });

  const setMobile = (open) => {
    mobileNav?.classList.toggle("open", open);
    mobileNav?.setAttribute("aria-hidden", String(!open));
    menuButton?.setAttribute("aria-expanded", String(open));
    body.style.overflow = open ? "hidden" : "";
  };

  menuButton?.addEventListener("click", () => setMobile(true));
  closeButton?.addEventListener("click", () => setMobile(false));
  mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMobile(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMobile(false);
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("seen");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  document.querySelectorAll(".faq-q").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item?.querySelector(".faq-a");
      const isOpen = item?.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-q")?.setAttribute("aria-expanded", "false");
        const openAnswer = openItem.querySelector(".faq-a");
        if (openAnswer) openAnswer.style.height = "0px";
      });
      if (!isOpen && item && answer) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
        answer.style.height = `${answer.scrollHeight}px`;
      }
    });
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-links a[data-scroll]")];

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle("active", link.dataset.scroll === entry.target.id));
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

  sections.forEach((section) => sectionObserver.observe(section));

  const contactForm = document.querySelector("#contactForm");
  const formStatus = document.querySelector("#formStatus");

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const data = new FormData(contactForm);
    const name = data.get("name") || "";
    const company = data.get("company") || "";
    const email = data.get("email") || "";
    const phone = data.get("phone") || "";
    const service = data.get("service") || "";
    const message = data.get("message") || "";

    const subject = encodeURIComponent(`Website enquiry${company ? ` - ${company}` : ""}`);
    const body = encodeURIComponent(
      `Name: ${name}\nCompany: ${company}\nWork email: ${email}\nPhone: ${phone}\nService: ${service}\n\nMessage:\n${message}`
    );

    formStatus.hidden = false;
    formStatus.classList.remove("error");
    formStatus.textContent = "Opening your email client…";

    window.location.href = `mailto:admin@diallo.co.in?subject=${subject}&body=${body}`;

    setTimeout(() => {
      formStatus.textContent = "If your email client did not open, email admin@diallo.co.in directly.";
    }, 1400);
  });

  // Keep text fallbacks visible whenever a logo asset is missing.
  document.querySelectorAll(".client-pill img").forEach((img) => {
    img.addEventListener("load", () => {
      img.previousElementSibling?.classList.add("has-image");
    });
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
