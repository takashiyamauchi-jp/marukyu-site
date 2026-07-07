/* =====================================================
   Marukyu Loader — 紋が筆順で染まるローディング
   使い方:
     MarukyuLoader.play(container, { basePath:'images/loader/' })
       .then(() => { ...完了後の処理... });
   containerの中にSVGを生成して一度だけ再生します。
   ===================================================== */
window.MarukyuLoader = (() => {
  const SVGNS = 'http://www.w3.org/2000/svg';

  // ラボ版と同じ既定値(AEメモの値に合わせて調整可)
  const DEFAULTS = {
    basePath: 'images/loader/',   // tm1.png〜tm8.png の場所
    color:   '#1a1a1a',           // 染料の色
    speed:   1.0,                 // 再生速度
    bleed:   12,                  // 滲みの強さ
    overlap: 0.35,                // 画の重なり(0〜0.7)
    K:       22,                  // 筆先しきい値の柔らかさ
  };
  // 各画の持続時間(ms)。①〜⑦、○の順。
  const TDUR = [300, 300, 300, 980, 926, 300, 300, 1200];
  const RING_JOIN = 0.5; // ○は⑦の抜きの後半50%に食い込んで始まる
  const ringEase = t => t*t*(3-2*t)*0.92 + t*0.08;
  const easeStroke = t => -(Math.cos(Math.PI*t)-1)/2;

  function el(n, attrs, parent){
    const e = document.createElementNS(SVGNS, n);
    for(const k in attrs) e.setAttribute(k, attrs[k]);
    if(parent) parent.appendChild(e);
    return e;
  }

  function play(container, opts){
    const cfg = Object.assign({}, DEFAULTS, opts || {});
    const svg = el('svg', {viewBox:'0 0 800 789', 'aria-hidden':'true'});
    svg.style.width = '100%'; svg.style.height = '100%'; svg.style.display = 'block';
    container.appendChild(svg);
    const defs = el('defs', {}, svg);
    const layer = el('g', {}, svg);
    const reveals = [];

    for(let i=1;i<=8;i++){
      const fid = `mkldr-fx${i}`;
      const f = el('filter', {id:fid, x:'-15%', y:'-15%', width:'130%', height:'130%',
                              'color-interpolation-filters':'sRGB'}, defs);
      const fct = el('feComponentTransfer', {in:'SourceGraphic', result:'th'}, f);
      const funcs = ['feFuncR','feFuncG','feFuncB'].map(n =>
        el(n, {type:'linear', slope:-cfg.K, intercept:-0.6}, fct));
      el('feColorMatrix', {in:'th', type:'luminanceToAlpha', result:'la'}, f);
      el('feTurbulence', {type:'fractalNoise', baseFrequency:'0.03 0.036', numOctaves:3, seed:7, result:'nz'}, f);
      el('feDisplacementMap', {in:'la', in2:'nz', scale:cfg.bleed, xChannelSelector:'R', yChannelSelector:'G', result:'ld'}, f);
      el('feGaussianBlur', {in:'ld', stdDeviation:1.2, result:'lb'}, f);
      el('feComposite', {in:'lb', in2:'SourceAlpha', operator:'in', result:'shape'}, f);
      const gate = el('feComponentTransfer', {in:'shape', result:'shapeG'}, f);
      el('feFuncA', {type:'linear', slope:2.6, intercept:-0.65}, gate);
      el('feFlood', {'flood-color':cfg.color, 'flood-opacity':1, result:'col'}, f);
      el('feComposite', {in:'col', in2:'shapeG', operator:'in'}, f);
      el('image', {href:`${cfg.basePath}tm${i}.png`, width:800, height:789, filter:`url(#${fid})`}, layer);

      const setP = p => {
        const ic = cfg.K*(p*1.1 - 0.05) + 0.5;
        funcs.forEach(fn => fn.setAttribute('intercept', String(ic)));
      };
      setP(0);
      reveals.push({set:setP, dur:TDUR[i-1],
                    join: i===8 ? RING_JOIN : null,
                    ease: i===8 ? ringEase : null});
    }

    // タイムライン(重なりあり・○はjoinで食い込み)
    const wins = []; let t = 0;
    reveals.forEach(r => {
      const dur = r.dur/cfg.speed;
      let t0 = t;
      if(r.join != null && wins.length){
        const pw = wins[wins.length-1];
        t0 = pw.t1 - (pw.t1-pw.t0)*r.join;
      }
      wins.push({t0, t1:t0+dur, set:r.set, ease:r.ease});
      t = t0 + dur*(1-cfg.overlap);
    });
    const total = Math.max(...wins.map(w=>w.t1));

    return new Promise(resolve => {
      if(matchMedia('(prefers-reduced-motion: reduce)').matches){
        reveals.forEach(r=>r.set(1));
        setTimeout(resolve, 400);
        return;
      }
      let t0 = null;
      function frame(ts){
        if(t0===null) t0=ts;
        const elp = ts-t0;
        for(const w of wins){
          if(elp < w.t0) break;
          const p = Math.min((elp-w.t0)/(w.t1-w.t0), 1);
          w.set((w.ease||easeStroke)(p));
        }
        if(elp < total){ requestAnimationFrame(frame); }
        else { reveals.forEach(r=>r.set(1)); resolve(); }
      }
      requestAnimationFrame(frame);
    });
  }

  return { play };
})();
