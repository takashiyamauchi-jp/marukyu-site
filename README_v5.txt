# marukyu-site v5 actual

## 変更内容
- v3をベースに実サイト用データとして作成
- 左上に紋ロゴ＋筆字「新江戸染」「丸久商店」＋1899を配置
- メニューが下に落ちないようヘッダーを固定レイアウトに修正
- Recruitページとメニューを追加
- ローディング演出を変更
  1. 円を描く
  2. 紋ロゴが出る
  3. 筆字「新江戸染」
  4. 筆字「丸久商店」
  5. 1899
  6. フェードアウトしてトップへ
- ローディング後、トップ画像1枚目を3秒静止
- その後、約8秒ごとにゆっくりフェードで切り替え

## 差し替える画像
/images の下記ファイルを同名で差し替えるだけで反映できます。

- image_hero_01.jpg
- image_hero_02.jpg
- image_hero_03.jpg
- image_hero_04.jpg
- image_hero_05.jpg

## ロゴ素材
- logo_mark.png
- brush_shinedozome.png
- brush_marukyu.png

## GitHubに上げる時
zipの中身を展開して、index.html / style.css / script.js / images などを既存リポジトリに上書きアップロードしてください。
