// ── Works Archive: 案件データ ──
// works.html だけで読み込まれます。掲載順=新しい順を維持してください
// (このスクリプトは並び替えを行わず、配列の並び順をそのまま表示します)。
//
// 各項目:
//   title        案件名(社内管理用。画面には表示されません)
//   clientName   表示するクライアント名/名義
//   year         西暦(数値)
//   image        画像パス
//   width/height 画像の実寸(px)。レイアウトシフト防止のため必須
//   externalUrl  クライアント名をリンクにする場合のURL。無ければ null
//   allowLightbox クリックで拡大表示するか(true/false)
//   category     将来の絞り込み用。現時点では画面表示に使用しない
//
// TODO: 以下は仮データです。実際の実績が確定次第、画像・数値を差し替えてください。
const WORKS_DATA = [
  {
    title: "別注シャツ",
    clientName: "TEWSEN",
    year: 2026,
    image: "images/image_works_shirt_01.jpg",
    width: 1400,
    height: 1049,
    externalUrl: "https://www.instagram.com/tewsen/",
    allowLightbox: true,
    category: null,
  },
  {
    title: "型染め手拭",
    clientName: "BEAMS",
    year: 2026,
    image: "images/image_works_tenugui_01.jpg",
    width: 1400,
    height: 1049,
    externalUrl: null,
    allowLightbox: true,
    category: null,
  },
  {
    title: "店舗用暖簾",
    clientName: "K様",
    year: 2025,
    image: "images/image_works_noren_01.jpg",
    width: 1400,
    height: 931,
    externalUrl: null,
    allowLightbox: false,
    category: null,
  },
  {
    title: "注染浴衣 別注",
    clientName: "丸久 復刻てぬぐい",
    year: 2025,
    image: "images/image_works_yukata_01.jpg",
    width: 1400,
    height: 1049,
    externalUrl: null,
    allowLightbox: true,
    category: null,
  },
  {
    title: "ブランドコラボレーション",
    clientName: "Brand Collaboration",
    year: 2025,
    image: "images/image_works_collab_01.jpg",
    width: 1049,
    height: 1400,
    externalUrl: "#",
    allowLightbox: true,
    category: null,
  },
  {
    title: "OEM受注製作",
    clientName: "Y商事",
    year: 2024,
    image: "images/image_works_oem_01.jpg",
    width: 931,
    height: 1400,
    externalUrl: null,
    allowLightbox: false,
    category: null,
  },
  {
    title: "手拭 秋の意匠",
    clientName: "N様",
    year: 2024,
    image: "images/image_works_tenugui_02.jpg",
    width: 1400,
    height: 1049,
    externalUrl: null,
    allowLightbox: true,
    category: null,
  },
  {
    title: "別注シャツ 藍染",
    clientName: "TEWSEN",
    year: 2023,
    image: "images/image_works_shirt_01.jpg",
    width: 1400,
    height: 1049,
    externalUrl: "https://www.instagram.com/tewsen/",
    allowLightbox: true,
    category: null,
  },
  {
    title: "店舗用暖簾 別注",
    clientName: "K様",
    year: 2023,
    image: "images/image_works_noren_01.jpg",
    width: 1400,
    height: 931,
    externalUrl: null,
    allowLightbox: false,
    category: null,
  },
];
