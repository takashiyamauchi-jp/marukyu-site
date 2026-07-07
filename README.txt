=== 丸久商店 筆順ローダー 組み込み手順 ===

【1. ファイルを配置】(リポジトリのルート基準)
  js/marukyu-loader.js        ← 新規フォルダ js/ を作って入れる
  images/loader/tm1.png〜tm8.png ← 新規フォルダ images/loader/ に8枚
  script.js                    ← 既存を上書き(ローダー呼び出し統合済み・return バグ修正込み)

【2. index.html に1行追加】
  </body> の直前、既存の <script src="script.js"></script> の【前】に:

    <script src="js/marukyu-loader.js"></script>

  ※ HTMLの構造変更は不要です(#loader の中身はそのままでOK。
     静止画 loaderMark はJS側で自動的にSVGへ置き換わります)

【3. style.css に1ブロック追記】(どこでも可・末尾推奨)

    #loaderMarkStage svg { width: 100%; height: 100%; display: block; }

【4. 動作確認】
  - シークレットウィンドウでトップを開く(sessionStorageの影響回避)
  - 紋が①〜⑦→○の筆順で染まり、屋号→年号→フェードアウトの順
  - 2回目以降のトップ表示ではローダーがスキップされること

【調整したくなったら】
  js/marukyu-loader.js 冒頭の DEFAULTS を編集:
    color   : 染料の色 (例 '#234069' で藍)
    speed   : 速度 (1.2 で2割速く)
    bleed   : 滲みの強さ (ラボの同名スライダーと同じ)
    overlap : 画の重なり (0.35 = 35%)

【備考】
  - 全体尺は約3.4秒(紋) + 2.5秒(屋号・年号〜フェード)
  - prefers-reduced-motion の環境では即座に完成形を表示
  - ラボで使っていたB+C(注ぎ)モードは本番版では未搭載。
    欲しくなったら言ってください、追加できます。
