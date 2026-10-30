// Configure this number with the company's WhatsApp number in international format.
const WHATSAPP_NUMBER = "5511999999999";

const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dotsContainer = document.querySelector(".carousel-dots");
const previousButton = document.querySelector(".carousel-prev");
const nextButton = document.querySelector(".carousel-next");
let activeSlide = 0;
let carouselTimer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });
  dotsContainer.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });
}

function restartCarousel() {
  window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 6000);
}

slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.className = "carousel-dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Mostrar imagem ${index + 1}`);
  dot.setAttribute("aria-pressed", String(index === 0));
  dot.addEventListener("click", () => {
    showSlide(index);
    restartCarousel();
  });
  dotsContainer.append(dot);
});
previousButton.addEventListener("click", () => {
  showSlide(activeSlide - 1);
  restartCarousel();
});
nextButton.addEventListener("click", () => {
  showSlide(activeSlide + 1);
  restartCarousel();
});
restartCarousel();

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  primaryNav.classList.toggle("is-open", !isOpen);
});
primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("duda-prado-theme");
if (savedTheme === "dark") document.body.classList.add("dark-theme");

function updateThemeButton() {
  const isDark = document.body.classList.contains("dark-theme");
  themeToggle.setAttribute("aria-label", isDark ? "Ativar modo claro" : "Ativar modo escuro");
  themeToggle.innerHTML = isDark
    ? '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
    : '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.1A8.4 8.4 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z"/></svg>';
}
updateThemeButton();
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem("duda-prado-theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
  updateThemeButton();
});

const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = document.querySelectorAll(".gallery-item");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    galleryItems.forEach((item) => {
      item.hidden = filter !== "todos" && item.dataset.category !== filter;
    });
  });
});

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("p");
galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector("img").alt;
    lightboxCaption.textContent = item.querySelector("span").textContent;
    lightbox.showModal();
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

const eventDate = document.querySelector('input[name="data"]');
eventDate.min = new Date().toISOString().split("T")[0];
document.querySelector("#current-year").textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}`;
});

const estimateForm = document.querySelector("#estimate-form");
estimateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!estimateForm.reportValidity()) return;

  const formData = new FormData(estimateForm);
  const selectedServices = formData.getAll("servicos");
  const details = [
    "Olá! Gostaria de solicitar um orçamento para meu evento.",
    "",
    `Nome: ${formData.get("nome")}`,
    `E-mail: ${formData.get("email")}`,
    `Telefone: ${formData.get("telefone")}`,
    `Tipo de evento: ${formData.get("tipo")}`,
    `Data: ${formData.get("data") || "A definir"}`,
    `Local: ${formData.get("local") || "A definir"}`,
    `Convidados: ${formData.get("convidados") || "A definir"}`,
    `Orçamento estimado: ${formData.get("orcamento") || "Prefiro conversar"}`,
    `Serviços: ${selectedServices.length ? selectedServices.join(", ") : "A definir"}`,
    `Observações: ${formData.get("observacoes") || "Nenhuma"}`
  ];
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(details.join("\n"))}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  document.querySelector(".form-status").textContent = "Sua solicitação está pronta no WhatsApp. É só enviar a mensagem para falar com a gente.";
});
