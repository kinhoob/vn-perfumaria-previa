/* ============ CONFIG — edite aqui ============
   Tudo abaixo é DEMONSTRATIVO até você preencher com dados reais. */
const CONFIG = {
  instagram: "",            // ex.: "https://instagram.com/seuperfil"
  contactUrl: "",           // ex.: "https://wa.me/55DDDNUMERO"
  aboutText: "Substitua este texto pela apresentação real da loja, baseada no perfil do Instagram.",
  // Caminhos das fotos (ex.: "img/hero.jpg"). Vazio = espaço reservado.
  images: { hero:"", exp1:"", exp2:"", s1:"", s2:"", s3:"", s4:"", about:"" },
  brands: ["Marca demo 01", "Marca demo 02", "Marca demo 03", "Marca demo 04", "Marca demo 05"],
  products: [ // price e concentration são opcionais
    { name:"Fragrância demo 01", brand:"Marca demo 01", concentration:"Eau de Parfum", price:"", category:"Todas", img:"", url:"" },
    { name:"Fragrância demo 02", brand:"Marca demo 02", concentration:"Parfum",        price:"", category:"Todas", img:"", url:"" },
    { name:"Fragrância demo 03", brand:"Marca demo 03", concentration:"Eau de Toilette", price:"", category:"Todas", img:"", url:"" }
  ],
  instaPosts: [ { img:"", url:"" }, { img:"", url:"" }, { img:"", url:"" }, { img:"", url:"" } ]
};

/* ============ helpers ============ */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

function fillSlot(el, src, label) {
  if (src) {
    const i = new Image();
    i.src = src; i.alt = label || ""; i.loading = "lazy"; i.decoding = "async";
    el.appendChild(i);
  } else { el.classList.add("ph"); if (label) el.dataset.label = label; }
}
function setLink(el, url) {
  if (!el) return;
  if (url) el.href = url; else { el.removeAttribute("target"); el.setAttribute("title", "Defina o link em CONFIG (script.js)"); }
}

/* ============ render dynamic content ============ */
$("#year").textContent = new Date().getFullYear();
$("#aboutText").textContent = CONFIG.aboutText;
["instaBtn", "footInsta"].forEach(id => setLink($("#" + id), CONFIG.instagram));
["contactBtn", "footWpp"].forEach(id => setLink($("#" + id), CONFIG.contactUrl));

$$("[data-img]").forEach(el => fillSlot(el, CONFIG.images[el.dataset.img], el.dataset.label));

$("#brandList").innerHTML = CONFIG.brands.map(b => `<li>${b}</li>`).join("");

const cats = [...new Set(CONFIG.products.map(p => p.category))];
const grid = $("#grid"), filters = $("#filters");
CONFIG.products.forEach(p => {
  const a = document.createElement("article");
  a.className = "card"; a.dataset.cat = p.category;
  a.innerHTML = `<figure><div class="slot"></div></figure>
    <div class="card-info"><h3>${p.name}</h3><span class="price">${p.price || ""}</span>
    <span class="meta">${[p.brand, p.concentration].filter(Boolean).join(" · ")}</span>
    <a class="more ul" href="${p.url || CONFIG.contactUrl || "#contato"}"${p.url ? ' target="_blank" rel="noopener"' : ""}>Conhecer</a></div>`;
  fillSlot($(".slot", a), p.img, p.name);
  grid.appendChild(a);
});
if (cats.length > 1) {
  filters.innerHTML = cats.map((c, i) => `<button role="tab" class="${i ? "" : "on"}" data-c="${c}">${c}</button>`).join("");
  filters.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", filters).forEach(x => x.classList.toggle("on", x === b));
    $$(".card").forEach(c => c.classList.toggle("hide", b.dataset.c !== cats[0] && c.dataset.cat !== b.dataset.c));
    window.gsap && ScrollTrigger.refresh();
  });
} else filters.remove();

$("#instaGrid").innerHTML = CONFIG.instaPosts.map(() => `<a class="rv" href="#" target="_blank" rel="noopener" aria-label="Ver publicação no Instagram"><div class="slot"></div></a>`).join("");
$$("#instaGrid a").forEach((a, i) => {
  const post = CONFIG.instaPosts[i];
  fillSlot($(".slot", a), post.img, "Post Instagram");
  post.url ? a.href = post.url : (a.removeAttribute("target"));
});

/* ============ header + menu ============ */
const header = $("#header"), burger = $(".burger"), menu = $("#menu");
const onScroll = () => header.classList.toggle("solid", scrollY > 60);
addEventListener("scroll", onScroll, { passive: true }); onScroll();
function toggleMenu(open) {
  burger.setAttribute("aria-expanded", open);
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", !open);
  document.body.style.overflow = open ? "hidden" : "";
}
burger.addEventListener("click", () => toggleMenu(burger.getAttribute("aria-expanded") !== "true"));
addEventListener("keydown", e => e.key === "Escape" && toggleMenu(false));

/* ============ motion ============ */
// split headings into words
$$(".split").forEach(h => {
  h.setAttribute("aria-label", h.textContent);
  h.innerHTML = h.textContent.trim().split(/\s+/).map(w => `<span class="w" aria-hidden="true"><i>${w}</i></span>`).join(" ");
});

function showAll() {
  $$(".rv,.hero-img").forEach(e => e.style.clipPath = "none");
  $$(".hl").forEach(e => e.style.opacity = 1);
  $$(".split .w i").forEach(e => e.style.transform = "none");
  const l = $(".loader"); l && l.remove();
}

if (!window.gsap || !window.ScrollTrigger || reduce) {
  showAll();
  $$("a[href^='#']").forEach(a => a.addEventListener("click", () => toggleMenu(false)));
} else {
  gsap.registerPlugin(ScrollTrigger);

  // smooth scroll
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$("a[href^='#']").forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const t = $(id); if (!t) return;
    e.preventDefault(); toggleMenu(false);
    lenis ? lenis.scrollTo(t, { duration: 1.4 }) : t.scrollIntoView({ behavior: "smooth" });
  }));

  // scroll progress
  gsap.to(".progress", { scaleX: 1, ease: "none", scrollTrigger: { scrub: 0.2, start: 0, end: "max" } });

  // intro: logo -> hero
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.to(".loader img", { opacity: 1, scale: 1.08, duration: 0.8, ease: "power2.out" }, 0.1)
    .to(".loader", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, 0.9)
    .set(".loader", { display: "none" })
    .to(".hero-img", { clipPath: "inset(0 0 0 0%)", duration: 1.6, ease: "expo.inOut" }, 1.0)
    .to(".hero .split i", { y: 0, duration: 1.3, stagger: 0.08 }, 1.35)
    .to(".hl", { opacity: 1, duration: 1, stagger: 0.15 }, 1.2)
    .from(".header", { yPercent: -100, duration: 1 }, 1.6);

  // text reveal on scroll (hero title handled above)
  $$(".split").filter(h => !h.closest(".hero")).forEach(h => {
    gsap.to($$("i", h), { y: 0, duration: 1.2, stagger: 0.07, ease: "expo.out",
      scrollTrigger: { trigger: h, start: "top 85%", once: true } });
  });

  // mask reveal for images (vertical wipe + inner zoom)
  $$(".rv").forEach(el => {
    gsap.to(el, { clipPath: "inset(0 0 0% 0)", duration: 1.5, ease: "expo.inOut",
      scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    gsap.from($(".slot", el), { scale: 1.25, duration: 2, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });

  // paragraphs / buttons rising
  $$(".fade").forEach(el => gsap.from(el, { y: 36, opacity: 0, duration: 1.2, ease: "expo.out",
    scrollTrigger: { trigger: el, start: "top 90%", once: true } }));

  // product cards staggered
  gsap.from(".card", { y: 70, opacity: 0, duration: 1.2, stagger: 0.12, ease: "expo.out",
    scrollTrigger: { trigger: "#grid", start: "top 85%", once: true } });

  // brands staggered
  gsap.from(".brand-list li", { yPercent: 60, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out",
    clearProps: "opacity,transform", scrollTrigger: { trigger: ".brand-list", start: "top 85%", once: true } });

  // parallax at different speeds (desktop + mobile, subtle)
  $$(".par").forEach(el => {
    const v = parseFloat(el.dataset.speed || 0.1) * 25;
    gsap.fromTo(el, { yPercent: -v }, { yPercent: v, ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // floating overlap between sections: small image drifts over the edge
  gsap.to(".exp-small", { y: -60, ease: "none",
    scrollTrigger: { trigger: ".exp", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".s3", { y: 70, ease: "none",
    scrollTrigger: { trigger: ".sense", start: "top bottom", end: "bottom top", scrub: true } });

  addEventListener("load", () => ScrollTrigger.refresh());
}
