/* ════════════════════════════════════════════════════════════════════════
   cardioid.js — Times-Table Cardioid, standalone. No dependencies, no build.
   --------------------------------------------------------------------------
   USAGE:
     1. add  <script src="cardioid.js" defer>  (load via src, never inline)
     2. <canvas data-cardioid data-ink="#ece9df" style="width:100%;aspect-ratio:1/1"></canvas>

   data-ink : line colour (hex). default #ece9df  (light, for a dark background)
   Auto-mounts every <canvas data-cardioid>; lazy-starts on scroll, pauses
   off-screen, re-fits on resize. Programmatic: Cardioid.mount(elOrSelector, {ink}).
   ════════════════════════════════════════════════════════════════════════ */
(function(){
"use strict";
const REDUCE = matchMedia('(prefers-reduced-motion:reduce)').matches;
const TAU = Math.PI*2, N = 300;

function rgba(hex,a){ hex=(hex||'#ece9df').trim(); if(hex[0]==='#')hex=hex.slice(1);
  if(hex.length===3)hex=hex.split('').map(c=>c+c).join('');
  const n=parseInt(hex,16)||0; return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`; }

const mounted=[];

function mount(target,opts){
  opts=opts||{};
  const cv=(typeof target==='string')?document.querySelector(target):target;
  if(!cv) return null;
  const ink=opts.ink||(cv.getAttribute&&cv.getAttribute('data-ink'))||'#ece9df';
  let raf,ctx,w,h,k,running=false;
  function size(){ const dpr=Math.min(devicePixelRatio||1,2);
    w=Math.max(1,cv.clientWidth||420); h=Math.max(1,cv.clientHeight||420);
    cv.width=Math.floor(w*dpr); cv.height=Math.floor(h*dpr);
    ctx=cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); }
  function frame(){
    k+=0.004; if(k>92) k=2;
    ctx.clearRect(0,0,w,h);
    const cx=w/2, cy=h/2, R=Math.min(w,h)*0.43;
    ctx.strokeStyle=rgba(ink,.10); ctx.lineWidth=1; ctx.beginPath(); ctx.arc(cx,cy,R,0,TAU); ctx.stroke();
    ctx.strokeStyle=rgba(ink,.20); ctx.lineWidth=0.6; ctx.shadowColor=ink; ctx.shadowBlur=6; ctx.beginPath();
    for(let i=0;i<N;i++){ const a=TAU*i/N-Math.PI/2, j=(i*k)%N, b=TAU*j/N-Math.PI/2;
      ctx.moveTo(cx+R*Math.cos(a),cy+R*Math.sin(a)); ctx.lineTo(cx+R*Math.cos(b),cy+R*Math.sin(b)); }
    ctx.stroke(); ctx.shadowBlur=0;
    if(running&&!REDUCE) raf=requestAnimationFrame(frame);
  }
  const ctrl={
    start(){ if(running)return; running=true; size(); k=2; frame(); },
    stop(){ running=false; cancelAnimationFrame(raf); },
    resize(){ if(running) size(); }
  };
  if(typeof IntersectionObserver!=='undefined'){
    new IntersectionObserver(es=>es.forEach(e=>{ e.isIntersecting?ctrl.start():ctrl.stop(); }),
      {rootMargin:'120px 0px',threshold:0.04}).observe(cv);
  } else ctrl.start();
  mounted.push(ctrl);
  return ctrl;
}

function autoInit(){ if(typeof document==='undefined')return;
  document.querySelectorAll('canvas[data-cardioid]').forEach(cv=>mount(cv)); }

let rt;
if(typeof addEventListener!=='undefined') addEventListener('resize',()=>{ clearTimeout(rt);
  rt=setTimeout(()=>mounted.forEach(c=>c.resize()),200); });

if(typeof document!=='undefined'){
  if(document.readyState!=='loading') autoInit(); else document.addEventListener('DOMContentLoaded',autoInit);
}
if(typeof window!=='undefined') window.Cardioid={ mount, autoInit };
})();
