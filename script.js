document.addEventListener("DOMContentLoaded", () => {

  /* ── Loader ── */
  const loader = document.getElementById("loader");
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots   = Array.from(document.querySelectorAll(".slide-dots span"));
  let current = 0;

  function showSlide(i) {
    slides.forEach((s, j) => s.classList.toggle("is-active", j === i));
    dots.forEach((d, j)   => d.classList.toggle("is-active", j === i));
    current = i;
  }
  function startSlider() {
    if (!slides.length) return;
    showSlide(0);
    setTimeout(() => {
      setInterval(() => showSlide((current + 1) % slides.length), 8000);
    }, 3000);
  }

  if (loader) {
    if (sessionStorage.getItem('loaded')) {
      loader.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
      startSlider();
      return;
    }
    sessionStorage.setItem('loaded', '1');

    const circle      = document.getElementById("loaderCircle")?.parentElement;
    const mark        = document.getElementById("loaderMark");
    const shinedozome = document.getElementById("loaderShinedozome");
    const marukyu     = document.getElementById("loaderMarukyu");
    const year        = document.getElementById("loaderYear");

    setTimeout(() => circle?.classList.add("is-drawn"),   250);
    setTimeout(() => mark?.classList.add("is-visible"),  1150);
    setTimeout(() => shinedozome?.classList.add("is-visible"), 1900);
    setTimeout(() => marukyu?.classList.add("is-visible"),     2700);
    setTimeout(() => year?.classList.add("is-visible"),        3500);
    setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
      window.scrollTo({ top: 0, behavior: "instant" });
      startSlider();
    }, 4650);
  } else {
    startSlider();
  }

  /* ── Header scroll ── */
  const header = document.querySelector('.site-header');
  if (header && !document.body.classList.contains('no-hero')) {
    const onScroll = () => {
      if (window.scrollY > 80) {
        document.body.classList.add('is-scrolled');
      } else {
        document.body.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Scroll fade-in ── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ── Language switch ── */
  const html = document.documentElement;
  const btn  = document.getElementById("langSwitch");
  if (btn) {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang === "en" || urlLang === "ja") {
      html.setAttribute("lang", urlLang);
      sessionStorage.setItem("lang", urlLang);
    } else {
      const saved = sessionStorage.getItem("lang");
      if (saved) html.setAttribute("lang", saved);
    }

    const categoryOptions = {
      ja: ["制作のご相談", "商品について", "採用について", "その他"],
      en: ["Custom Production", "Products", "Recruitment", "Other"],
    };

    const updateForm = () => {
      const cur = html.getAttribute("lang");
      const isJa = cur === "ja";

      const emptyOpt = document.querySelector('option[value=""]');
      if (emptyOpt) emptyOpt.textContent = isJa ? "選択してください" : "Please select";

      const select = document.getElementById("category");
      if (select) {
        const opts = Array.from(select.options).filter(o => o.value !== "");
        opts.forEach((opt, i) => {
          opt.textContent = isJa ? categoryOptions.ja[i] : categoryOptions.en[i];
        });
      }

      const textarea = document.getElementById("message");
      if (textarea) {
        textarea.placeholder = isJa
          ? "ご相談内容をご記入ください。\n作りたいもの・数量・ご希望納期・用途などがあれば、あわせてお知らせください。"
          : "Please describe your inquiry.\ne.g.\n- Product type\n- Quantity\n- Desired timeline\n- Intended use";
      }

      document.querySelectorAll('a[href="privacy.html"]').forEach(a => {
        a.href = `privacy.html?lang=${cur}`;
      });
    };

    const updateLabel = () => {
      const cur = html.getAttribute("lang");
      btn.querySelector(".lang-current").textContent = cur === "ja" ? "JP" : "EN";
      btn.querySelector(".lang-other").textContent   = cur === "ja" ? "EN" : "JP";
    };

    updateLabel();
    updateForm();

    btn.addEventListener("click", () => {
      const next = html.getAttribute("lang") === "ja" ? "en" : "ja";
      html.setAttribute("lang", next);
      sessionStorage.setItem("lang", next);
      updateLabel();
      updateForm();
    });
  }
});
