# marukyu_site_mock_v2

## 構成
- index.html：トップ。画像5枚＋フルスクリーン紹介画像のみ
- about.html：About
- works.html：Works
- order.html：Order / OEM相談ページ
- contact.html：Contact
- style.css：全体の見た目
- script.js：トップの読み込みアニメーション

## 画像差し替え
`images` フォルダに下記の名前で画像を入れて、HTMLの placeholder を img タグに差し替える想定です。

例：
<div class="visual-card placeholder"><span>image_hero_01.jpg</span></div>

を

<div class="visual-card"><img src="images/image_hero_01.jpg" alt=""></div>

に変更。

## 仮画像名
- image_hero_01.jpg
- image_hero_02.jpg
- image_hero_03.jpg
- image_hero_04.jpg
- image_hero_05.jpg
- image_intro.jpg
- image_about.jpg
- image_apparel.jpg
- image_tenugui.jpg
- image_yukata.jpg
- image_textile.jpg
- image_collaboration.jpg
- image_exhibition.jpg

## Order表記について
OEMよりやわらかく、一般の問い合わせにも広げられます。
BtoB感を強めるなら Production / Custom Order / OEM でも良いです。
