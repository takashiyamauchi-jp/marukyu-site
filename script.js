document.addEventListener("DOMContentLoaded", () => {
// ── ヒーロー画像データ(最大10枚まで登録可。active:false で一時的に除外できる) ──
// focalPosition は object-position の値。省略時は中央(50% 50%)。
// 画像を追加/削除する場合はこの配列だけ編集すればよい（順不同でOK、重複ファイルは登録しない）。
const HERO_DATA = [
  { src: "hero_01.jpg", alt: "草原の丘に立つ、生成り地に大胆な花柄の羽織を着たモデル", focalPosition: "60% 65%", active: true, season: null },
  { src: "hero_02.jpg", alt: "溶岩海岸で藍色の羽織を風になびかせるモデルの後ろ姿", focalPosition: "65% 55%", active: true, season: null },
  { src: "hero_03.jpg", alt: "夕暮れの火山地形にたたずむ、ピンクの羽織を着た小さな人影", focalPosition: "70% 60%", active: true, season: null },
  { src: "hero_04.jpg", alt: "型の上に注がれる、鮮やかな紅色の注染染料のクローズアップ", focalPosition: "50% 50%", active: true, season: null },
  { src: "hero_05.jpg", alt: "草原の丘で並んで立つ、注染柄の羽織を着た二人", focalPosition: "50% 60%", active: true, season: null },
];

function getActiveHeroData() {
  return HERO_DATA.filter(d => d.active);
}

// セッション単位で開始位置を固定し、以降は順送りにする
function pickSessionStartIndex(len) {
  const key = "heroStartIndex";
  let idx = parseInt(sessionStorage.getItem(key), 10);
  if (isNaN(idx) || idx < 0 || idx >= len) {
    idx = Math.floor(Math.random() * len);
    sessionStorage.setItem(key, String(idx));
  }
  return idx;
}

// モバイルに過剰な高解像度を配信しないためのsrcset（*-800.jpg / *-1400.jpg を images/ に用意）
function heroSrcset(filename) {
  const stem = filename.replace(/\.jpg$/i, "");
  return `images/${stem}-800.jpg 800w, images/${stem}-1400.jpg 1400w, images/${filename} 2200w`;
}

function setupHeroImages() {
  const container = document.getElementById("heroSlides");
  const active = getActiveHeroData();
  if (!container || !active.length) return [];

  const startIdx = pickSessionStartIndex(active.length);
  const ordered = active.slice(startIdx).concat(active.slice(0, startIdx));

  ordered.forEach((data, i) => {
    const slide = document.createElement("div");
    slide.className = "hero-slide";

    const img = document.createElement("img");
    img.src = "images/" + data.src;
    img.srcset = heroSrcset(data.src);
    img.sizes = "100vw";
    img.alt = data.alt || "";
    if (data.focalPosition) img.style.objectPosition = data.focalPosition;

    if (i === 0) {
      img.setAttribute("fetchpriority", "high"); // 1枚目は優先読み込み
    } else if (i >= 3) {
      img.loading = "lazy";                       // 4枚目以降は遅延読み込み
    }
    // 2〜3枚目は属性なし＝通常の先読み

    slide.appendChild(img);
    container.appendChild(slide);
  });

  return Array.from(container.querySelectorAll(".hero-slide"));
}

// ── Featured links(Hero左下、控えめな見出しリンクのみ) ──
// TODO: 本番のリンクに差し替えてください（1〜3件を基本、最大5件、表示したい順）。
// 下の1件は仮データです。type は現時点では表示に使わず、将来の管理用に保持するだけです。
const featuredLinks = [
  { title: "Paris Design Week 2026", url: "https://www.instagram.com/shinedozome/", type: "instagram", active: true },
];

// 相対パス/自サイトのドメイン → 同一タブ、それ以外の外部URL → 新規タブ+noopener noreferrer
function isExternalUrl(url) {
  try {
    const resolved = new URL(url, window.location.href);
    return resolved.origin !== window.location.origin;
  } catch (e) {
    return false;
  }
}

function renderFeaturedLinks() {
  const container = document.getElementById("heroFeatured");
  if (!container) return;

  const active = featuredLinks.filter(l => l.active);
  if (!active.length) {
    container.remove(); // 表示対象が0件なら領域自体を非表示にする
    return;
  }

  const list = document.createElement("ul");
  list.className = "hero-featured-list";

  active.slice(0, 5).forEach(item => {
    const li = document.createElement("li");
    li.className = "hero-featured-item";

    const a = document.createElement("a");
    a.className = "hero-featured-link";
    a.href = item.url;
    a.textContent = item.title;

    if (isExternalUrl(item.url)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      const srOnly = document.createElement("span");
      srOnly.className = "sr-only";
      srOnly.textContent = "(新しいタブで開きます)";
      a.appendChild(srOnly);
    }

    li.appendChild(a);
    list.appendChild(li);
  });

  container.appendChild(list);
}

setupHeroImages();
renderFeaturedLinks();

  /* ── Loader ── */
  const loader = document.getElementById("loader");
  const heroSlider = document.querySelector(".hero-slider");
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  let current = 0;
  let autoplayId = null;

  function showSlide(i) {
    slides.forEach((s, j) => s.classList.toggle("is-active", j === i));
    current = i;
  }
  function armAutoplay(delay) {
    if (autoplayId) clearInterval(autoplayId);
    if (slides.length < 2) return;
    autoplayId = setInterval(() => showSlide((current + 1) % slides.length), delay);
  }
  function startSlider() {
    if (!slides.length) return;
    showSlide(0);
    setTimeout(() => armAutoplay(8000), 3000);
  }
  function goToSlide(delta) {
    if (slides.length < 2) return;
    showSlide((current + delta + slides.length) % slides.length);
    armAutoplay(8000); // 手動操作後はオートプレイのタイマーをリセット
  }

  /* ── Hero: キーボード操作(矢印キー) / スワイプ ── */
  if (heroSlider && slides.length > 1) {
    const prevBtn = heroSlider.querySelector(".hero-nav-prev");
    const nextBtn = heroSlider.querySelector(".hero-nav-next");
    prevBtn?.addEventListener("click", () => goToSlide(-1));
    nextBtn?.addEventListener("click", () => goToSlide(1));

    heroSlider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goToSlide(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goToSlide(-1); }
    });

    let touchStartX = null, touchStartY = null;
    heroSlider.addEventListener("touchstart", (e) => {
      const t = e.changedTouches[0];
      touchStartX = t.clientX; touchStartY = t.clientY;
    }, { passive: true });
    heroSlider.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      touchStartX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        goToSlide(dx < 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  if (loader && sessionStorage.getItem('loaded')) {
    // 2回目以降：ローダーを即スキップ（以降の初期化は続行する）
    loader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    startSlider();
  } else if (loader) {
    sessionStorage.setItem('loaded', '1');

    const shinedozome = document.getElementById("loaderShinedozome");
    const marukyu     = document.getElementById("loaderMarukyu");
    const year        = document.getElementById("loaderYear");

    // 紋マーク：筆順で染まるアニメーション（marukyu-loader.js）
    const stage = document.getElementById("loaderMarkStage");
    document.getElementById("loaderMark")?.remove(); // 静止画はSVGに置き換え
    MarukyuLoader.play(stage, { basePath: "images/loader/" }).then(() => {
      // 紋の定着 → ひと呼吸おいて屋号・年号(ゆとりのある展開)
      setTimeout(() => shinedozome?.classList.add("is-visible"),  500);
      setTimeout(() => marukyu?.classList.add("is-visible"),     1450);
      setTimeout(() => year?.classList.add("is-visible"),        2400);
      setTimeout(() => {
        loader.classList.add("is-hidden");   // フェードはCSS側で1.8sの余韻
        document.body.classList.remove("is-loading");
        window.scrollTo({ top: 0, behavior: "instant" });
        startSlider();
      }, 3800);
    });
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
