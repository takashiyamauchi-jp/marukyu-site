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

setupHeroImages();

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

  /* ── Header scroll ──
     ヘッダーの白/黒切り替えは、Hero画像がヘッダーの裏から完全に
     スクロールし終えるタイミングに合わせる（固定80pxだと、Heroの
     途中で黒文字に切り替わり、暗い写真の上でナビが読めなくなるため）。
  */
  const header = document.querySelector('.site-header');
  if (header && !document.body.classList.contains('no-hero')) {
    const heroEl = document.querySelector('.hero-slider, .page-hero-full');
    const getHeaderH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
    const getThreshold = () => heroEl ? Math.max(heroEl.offsetHeight - getHeaderH(), 0) : 80;
    let threshold = getThreshold();
    window.addEventListener('resize', () => { threshold = getThreshold(); }, { passive: true });

    const onScroll = () => {
      if (window.scrollY > threshold) {
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

  /* ── Works: アーカイブギャラリー(works.htmlのみ。WORKS_DATAは works-data.js で定義) ──
     カード幅は列で統一、高さは画像の実アスペクト比から算出した grid-row-end で
     決める擬似Masonry。掲載順(配列順=新しい順)はそのまま保持し、並び替えしない。
  */
  (function setupWorksArchive() {
    const grid = document.getElementById("worksArchiveGrid");
    if (!grid || typeof WORKS_DATA === "undefined") return;

    function renderClientName(item) {
      if (item.externalUrl) {
        const a = document.createElement("a");
        a.href = item.externalUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "works-archive-client";
        a.append(item.clientName + " ");
        const ext = document.createElement("span");
        ext.className = "works-archive-ext";
        ext.setAttribute("aria-hidden", "true");
        ext.textContent = "↗";
        a.appendChild(ext);
        const sr = document.createElement("span");
        sr.className = "sr-only";
        sr.textContent = "(新しいタブで開きます)";
        a.appendChild(sr);
        return a;
      }
      const span = document.createElement("p");
      span.className = "works-archive-client";
      span.textContent = item.clientName;
      return span;
    }

    function renderYear(item) {
      const p = document.createElement("p");
      p.className = "works-archive-year";
      p.textContent = item.year;
      return p;
    }

    const lightboxItems = [];

    WORKS_DATA.forEach((item) => {
      const article = document.createElement("article");
      article.className = "works-archive-item";

      const imgWrap = document.createElement("div");
      imgWrap.className = "works-archive-img";
      if (item.allowLightbox) imgWrap.classList.add("is-lightbox");

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.clientName ? `${item.clientName} ${item.year}` : "";
      img.width = item.width;
      img.height = item.height;
      img.loading = "lazy";
      imgWrap.appendChild(img);

      const overlay = document.createElement("div");
      overlay.className = "works-archive-overlay";
      overlay.appendChild(renderClientName(item));
      overlay.appendChild(renderYear(item));
      imgWrap.appendChild(overlay);

      if (item.allowLightbox) {
        imgWrap.setAttribute("role", "button");
        imgWrap.setAttribute("tabindex", "0");
        imgWrap.setAttribute("aria-label", `${item.clientName} ${item.year} を拡大表示`);
        imgWrap.addEventListener("click", () => openWorksLightbox(item));
        imgWrap.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openWorksLightbox(item);
          }
        });
      }

      const metaSp = document.createElement("div");
      metaSp.className = "works-archive-meta-sp";
      metaSp.appendChild(renderClientName(item));
      metaSp.appendChild(renderYear(item));

      article.appendChild(imgWrap);
      article.appendChild(metaSp);
      article.dataset.ratio = String(item.height / item.width);
      grid.appendChild(article);
    });

    // 疑似Masonry: 各カードの高さ(画像の実アスペクト比 × 実測列幅)から
    // grid-row-end の span を算出。grid-auto-rows は 1px の細かい単位にしてあるので、
    // grid の row-gap は使わず、span 計算に余白分(ITEM_GAP)を含める。
    const ROW_UNIT = 1;
    const ITEM_GAP = 20;

    function layoutWorksArchive() {
      const items = Array.from(grid.children);
      if (!items.length) return;
      const styles = getComputedStyle(grid);
      const columnCount = styles.gridTemplateColumns.split(" ").length;
      const colGap = parseFloat(styles.columnGap) || 0;
      const gridWidth = grid.clientWidth;
      const colWidth = (gridWidth - colGap * (columnCount - 1)) / columnCount;

      items.forEach((el) => {
        const ratio = parseFloat(el.dataset.ratio) || 1;
        const displayHeight = colWidth * ratio;
        const span = Math.ceil((displayHeight + ITEM_GAP) / ROW_UNIT);
        el.style.gridRowEnd = `span ${span}`;
      });
    }

    layoutWorksArchive();

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layoutWorksArchive, 150);
    }, { passive: true });

    /* ── ライトボックス ── */
    let lightboxEl = null;
    let lastFocusedEl = null;

    function buildLightbox() {
      const el = document.createElement("div");
      el.className = "works-lightbox";
      el.id = "worksLightbox";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-label", "拡大表示");

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "works-lightbox-close";
      closeBtn.setAttribute("aria-label", "閉じる");
      closeBtn.textContent = "×";
      closeBtn.addEventListener("click", closeWorksLightbox);

      const inner = document.createElement("div");
      inner.className = "works-lightbox-inner";

      const img = document.createElement("img");
      img.className = "works-lightbox-img";
      img.alt = "";

      const caption = document.createElement("p");
      caption.className = "works-lightbox-caption";

      inner.appendChild(img);
      inner.appendChild(caption);
      el.appendChild(closeBtn);
      el.appendChild(inner);

      // 背景クリックで閉じる(画像・キャプション本体のクリックは除く)
      el.addEventListener("click", (e) => {
        if (e.target === el) closeWorksLightbox();
      });

      document.body.appendChild(el);
      return el;
    }

    function openWorksLightbox(item) {
      if (!lightboxEl) lightboxEl = buildLightbox();
      const img = lightboxEl.querySelector(".works-lightbox-img");
      const caption = lightboxEl.querySelector(".works-lightbox-caption");
      img.src = item.image;
      img.alt = item.clientName || "";
      caption.textContent = `${item.clientName} — ${item.year}`;

      lastFocusedEl = document.activeElement;
      lightboxEl.classList.add("is-open");
      document.body.style.overflow = "hidden";
      lightboxEl.querySelector(".works-lightbox-close").focus();
    }

    function closeWorksLightbox() {
      if (!lightboxEl || !lightboxEl.classList.contains("is-open")) return;
      lightboxEl.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocusedEl) lastFocusedEl.focus();
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightboxEl && lightboxEl.classList.contains("is-open")) {
        closeWorksLightbox();
      }
    });
  })();
});
