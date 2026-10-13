const CONTACT = Object.freeze({
  phoneDigits: "5554996815609",
  phoneDisplay: "(54) 99681-5609",
  phoneHref: "tel:+5554996815609",
  whatsappMessage: "Olá! Gostaria de solicitar um orçamento de dedetização em Passo Fundo.",
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
document.documentElement.classList.add("motion-ready");

const whatsappUrl = `https://wa.me/${CONTACT.phoneDigits}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`;

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = whatsappUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

document.querySelectorAll("[data-phone]").forEach((link) => {
  link.href = CONTACT.phoneHref;
});

document.querySelectorAll("[data-phone-label]").forEach((element) => {
  element.textContent = CONTACT.phoneDisplay;
});

const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir menu");
  navigation?.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  navigation?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    menuToggle?.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 12);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealGroups = [
  [".service-strip span", 70],
  [".about-media, .about-copy > *", 75],
  [".services-intro > *, .service-row", 75],
  [".reviews-heading > *, .review-list figure", 70],
  [".contact-lead > *, .contact-info > *", 70],
];

const revealElements = [];

revealGroups.forEach(([selector, stagger]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index * stagger, 210)}ms`);
    revealElements.push(element);
  });
});

function showAllMotionElements() {
  document.documentElement.classList.add("motion-loaded", "motion-settled");
  revealElements.forEach((element) => {
    element.classList.remove("reveal", "is-visible");
    element.style.removeProperty("--reveal-delay");
  });
}

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  showAllMotionElements();
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
      window.setTimeout(() => {
        entry.target.classList.remove("reveal", "is-visible");
        entry.target.style.removeProperty("--reveal-delay");
      }, 760);
    });
  }, {
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.12,
  });

  revealElements.forEach((element) => revealObserver.observe(element));
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.classList.add("motion-loaded");
    window.setTimeout(() => document.documentElement.classList.add("motion-settled"), 1100);
  }));
}

reducedMotion.addEventListener?.("change", (event) => {
  if (event.matches) showAllMotionElements();
});
