// ---------------------------------------------------------------
// TROCAR AQUI o número real de WhatsApp antes de publicar o site.
// Formato: código do país + DDD + número, só dígitos.
// Ex.: "5515999999999" para +55 15 99999-9999
// ---------------------------------------------------------------
const WHATSAPP_NUMBER = "5515900000000"; // <-- PLACEHOLDER, TROCAR

function buildWhatsappUrl(message) {
  const text = encodeURIComponent(message || "Olá! Vi o site da Galeria Lemura e gostaria de mais informações.");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function formatWhatsappDisplay(number) {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 12) return number;
  const country = digits.slice(0, 2);
  const ddd = digits.slice(2, 4);
  const rest = digits.slice(4);
  const part1 = rest.slice(0, rest.length - 4);
  const part2 = rest.slice(-4);
  return `+${country} ${ddd} ${part1}-${part2}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Liga todos os CTAs de WhatsApp ao número + mensagem configurados acima
  document.querySelectorAll(".js-whatsapp").forEach((el) => {
    el.setAttribute("href", buildWhatsappUrl(el.dataset.msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });

  // Texto de contato no rodapé
  const footerText = document.querySelector(".js-whatsapp-text");
  if (footerText) {
    footerText.textContent = `WhatsApp: ${formatWhatsappDisplay(WHATSAPP_NUMBER)}`;
  }

  // Menu mobile
  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("nav-mobile");
  if (navToggle && navMobile) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMobile.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navMobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMobile.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Ano dinâmico no rodapé
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header com sombra ao rolar
  const header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.style.boxShadow = window.scrollY > 8 ? "0 12px 24px -16px rgba(0,0,0,0.25)" : "none";
    });
  }

  // Movimento: revelar seções ao rolar (fade + slide up)
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("reveal-visible"));
  }

  // FAQ: acordeão com altura animada e chevron rotativo
  document.querySelectorAll(".faq-item").forEach((item) => {
    const toggle = item.querySelector(".faq-toggle");
    const chevron = item.querySelector(".faq-chevron");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          const otherChevron = openItem.querySelector(".faq-chevron");
          if (otherChevron) {
            otherChevron.classList.remove("bg-neutral-950", "text-white");
            otherChevron.classList.add("bg-neutral-100", "text-neutral-500");
          }
        }
      });
      item.classList.toggle("is-open", !isOpen);
      if (chevron) {
        chevron.classList.toggle("bg-neutral-950", !isOpen);
        chevron.classList.toggle("text-white", !isOpen);
        chevron.classList.toggle("bg-neutral-100", isOpen);
        chevron.classList.toggle("text-neutral-500", isOpen);
      }
    });
  });
});
