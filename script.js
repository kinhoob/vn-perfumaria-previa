/* ============ CONFIG — edite aqui ============
   Tudo abaixo é DEMONSTRATIVO até você preencher com dados reais. */
const CONFIG = {
  instagram: "https://www.instagram.com/vasconcelosniche/",
  contactUrl: "https://www.instagram.com/vasconcelosniche/",
  aboutText: "Uma maison de alta perfumaria em João Pessoa, dedicada à curadoria internacional de fragrâncias de nicho. Na Avenida Esperança, 473 — Manaíra, cada fragrância é escolhida para traduzir identidade, memória e presença.",
  images: {
    hero: "https://github.com/user-attachments/assets/59c140d5-d89f-4fd2-9c7c-aaaef11b2fba",
    exp1: "https://github.com/user-attachments/assets/c8611a3e-89b3-4e65-9520-57962e1fd7dc",
    exp2: "https://github.com/user-attachments/assets/288126e5-929c-46f9-86ba-6b0d0706ef48",
    s1: "https://github.com/user-attachments/assets/05bb6ce8-34b2-40c2-8df6-13df55a6e34a",
    s2: "https://github.com/user-attachments/assets/11698c6e-2e86-4ee1-a695-94e852b05b31",
    s3: "https://github.com/user-attachments/assets/9a9d8fc2-aa71-4137-bf0f-a9e35aa53ba7",
    s4: "https://github.com/user-attachments/assets/73cdc520-231e-4469-9c78-054ac2426095",
    about: "https://github.com/user-attachments/assets/8d91a002-0243-4cf1-8b8d-ed4390c454ff"
  },
  brands: ["Xerjoff", "Nishane", "Byredo"],
  products: [
    { name:"Nishane", brand:"Alta perfumaria de nicho", concentration:"", price:"", category:"Todas", img:"https://github.com/user-attachments/assets/d596bcbf-1697-4f23-904e-62244cfa6e6a", url:"" },
    { name:"Xerjoff", brand:"Alta perfumaria de nicho", concentration:"", price:"", category:"Todas", img:"https://github.com/user-attachments/assets/775c6bbe-4d45-4fa5-92e4-795a05aaa91e", url:"" },
    { name:"Xerjoff", brand:"Alta perfumaria de nicho", concentration:"", price:"", category:"Todas", img:"https://github.com/user-attachments/assets/41ca715a-971a-4396-ae1e-c6a4f8a2a599", url:"" }
  ],
  instaPosts: [
    { img:"https://github.com/user-attachments/assets/303b0a84-7296-41aa-a87c-112bffa18bd9", url:"https://www.instagram.com/vasconcelosniche/reel/DfqGxKfxi8q/" },
    { img:"https://github.com/user-attachments/assets/4c9c3395-379c-4fac-9c4f-2a53ac045850", url:"https://www.instagram.com/vasconcelosniche/reel/DfvnuDvxjfP/" },
    { img:"https://github.com/user-attachments/assets/0f1006ed-fe8f-4456-ad26-0f8d28c3945e", url:"https://www.instagram.com/vasconcelosniche/reel/DgDZxgoRdB0/" },
    { img:"https://github.com/user-attachments/assets/1e491889-33a5-4085-a365-55de3ae8050d", url:"https://www.instagram.com/vasconcelosniche/reel/Df-0bUExRpg/" }
  ]
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
