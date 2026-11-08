import {getMotionLesson,renderMotionDiagram,renderMotionLearning} from './motion-learning.js';

// One delegated controller serves theory, answer reviews and lesson dialogs.
// Playback is temporary UI state: it never touches answers or localStorage.
export function initMotionLearning(doc=document){
  const view=doc.defaultView;
  const reduced=view.matchMedia('(prefers-reduced-motion: reduce)');
  const players=new Map();
  const effectiveReduce=p=>reduced.matches||p.reduce;
  function sync(p){
    const last=p.model.steps.length-1;
    p.root.dataset.motionStep=p.index;
    p.root.dataset.motionReduced=String(effectiveReduce(p));
    p.root.querySelector('[data-motion-control="previous"]').disabled=p.index===0;
    p.root.querySelector('[data-motion-control="next"]').disabled=p.index===last;
    const play=p.root.querySelector('[data-motion-control="play"]');
    play.disabled=effectiveReduce(p);
    play.textContent=effectiveReduce(p)?'단계별 보기':p.playing?'Ⅱ 일시정지':p.index===last?'↻ 다시 재생':'▶ 재생';
    play.setAttribute('aria-pressed',String(p.playing));
    const toggle=p.root.querySelector('[data-motion-control="reduce"]');
    toggle.disabled=reduced.matches;
    toggle.setAttribute('aria-pressed',String(effectiveReduce(p)));
    toggle.textContent=effectiveReduce(p)?'움직임 줄임 · 적용 중':'움직임 줄이기';
    p.root.querySelector('.motion-motion-note').textContent=effectiveReduce(p)?'움직임을 줄였습니다. 이전·다음 또는 단계 번호로 살펴보세요.':p.playing?'재생 중입니다. 일시정지하면 지금 단계에서 멈춥니다.':'자동으로 시작하지 않습니다. 재생하거나 단계 번호를 눌러 내 속도로 살펴보세요.';
    p.root.querySelector('.motion-counter').textContent=`${p.index+1} / ${last+1}단계`;
    p.root.querySelectorAll('[data-motion-control="step"]').forEach(b=>{
      if(Number(b.dataset.motionIndex)===p.index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');
    });
  }
  function pause(p){view.clearTimeout(p.timer);p.timer=null;p.playing=false;sync(p);}
  function hidden(p){const dialog=p.root.closest('dialog'),active=doc.querySelector('dialog[open]');return !p.root.isConnected||doc.hidden||(dialog&&!dialog.open)||(active&&!active.contains(p.root));}
  function schedule(p){
    view.clearTimeout(p.timer);
    if(!p.playing)return;
    p.timer=view.setTimeout(()=>{
      if(hidden(p)||effectiveReduce(p)){pause(p);return;}
      paint(p,Math.min(p.index+1,p.model.steps.length-1));
      if(p.index===p.model.steps.length-1)pause(p);else schedule(p);
    },Number(p.root.querySelector('[data-motion-speed]').value));
  }
  function paint(p,index){
    p.animations.forEach(a=>a.cancel());p.animations=[];
    const stage=p.root.querySelector('.motion-stage');
    const oldWidths=new Map([...stage.querySelectorAll('[data-motion-key]')].map(n=>[n.dataset.motionKey,n.getBoundingClientRect().width]));
    p.index=index;
    stage.innerHTML=renderMotionDiagram(p.model.id,index);
    const step=p.model.steps[index];
    p.root.querySelector('.motion-step-title').textContent=`${index+1}. ${step.title}`;
    p.root.querySelector('.motion-formula').textContent=step.formula;
    p.root.querySelector('.motion-caption').textContent=step.caption;
    sync(p);
    if(!effectiveReduce(p)&&typeof stage.animate==='function'){
      p.animations.push(stage.animate([{opacity:.55},{opacity:1}],{duration:260}));
      stage.querySelectorAll('.motion-bar-fill,.motion-cost-part').forEach(n=>{
        const from=oldWidths.get(n.dataset.motionKey)??0,to=n.getBoundingClientRect().width;
        p.animations.push(n.animate([{width:from+'px'},{width:to+'px'}],{duration:650,easing:'ease-out'}));
      });
      stage.querySelectorAll('.motion-token.is-excluded,.motion-flow-node.is-active').forEach(n=>{
        p.animations.push(n.animate([{transform:'translateY(0)'},{transform:n.classList.contains('is-excluded')?'translateY(5px)':'translateY(-3px)'},{transform:'translateY(0)'}],{duration:500,easing:'ease-out'}));
      });
    }
  }
  const intersection='IntersectionObserver' in view?new view.IntersectionObserver(entries=>{
    for(const e of entries){const p=players.get(e.target);if(p?.playing&&!e.isIntersecting)pause(p);}
  }):null;
  function get(root){
    if(players.has(root))return players.get(root);
    const model=getMotionLesson(root.dataset.motion);if(!model)return null;
    const p={root,model,index:Number(root.dataset.motionStep)||0,playing:false,reduce:false,timer:null,animations:[]};
    players.set(root,p);sync(p);intersection?.observe(root);return p;
  }
  function scan(){
    for(const [root,p]of players){
      if(!root.isConnected){view.clearTimeout(p.timer);p.animations.forEach(a=>a.cancel());intersection?.unobserve(root);players.delete(root);}
      else if(p.playing&&hidden(p))pause(p);
    }
    doc.querySelectorAll('[data-motion]').forEach(get);
  }
  doc.addEventListener('click',e=>{
    const button=e.target.closest('[data-motion-control]'),root=button?.closest('[data-motion]');
    if(!root||button.disabled)return;
    const p=get(root);if(!p)return;
    const action=button.dataset.motionControl;
    if(action==='play'){
      if(p.playing){pause(p);return;}
      if(effectiveReduce(p))return;
      if(p.index===p.model.steps.length-1)paint(p,0);
      p.playing=true;sync(p);schedule(p);return;
    }
    pause(p);
    if(action==='reduce'){p.reduce=!p.reduce;p.animations.forEach(a=>a.cancel());sync(p);return;}
    const index=action==='next'?p.index+1:action==='previous'?p.index-1:action==='reset'?0:Number(button.dataset.motionIndex);
    paint(p,Math.max(0,Math.min(index,p.model.steps.length-1)));
  });
  doc.addEventListener('change',e=>{
    const root=e.target.closest('[data-motion]');if(!root)return;
    const p=get(root);
    if(e.target.matches('[data-motion-speed]'))schedule(p);
    if(e.target.matches('[data-motion-scenario]')){
      const next=e.target.value;if(!['average','average12'].includes(next))return;
      pause(p);root.outerHTML=renderMotionLearning(next,{context:'theory'});scan();
      const replacement=[...doc.querySelectorAll('[data-motion]')].find(n=>n.dataset.motion===next&&n.dataset.motionContext==='theory');
      replacement?.querySelector('[data-motion-scenario]')?.focus({preventScroll:true});
    }
  });
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)for(const p of players.values())if(p.playing)pause(p);});
  reduced.addEventListener('change',()=>{for(const p of players.values()){if(effectiveReduce(p)){pause(p);p.animations.forEach(a=>a.cancel());}else sync(p);}});
  // Observe only subtree creation/removal and dialogs; our text updates are safe and finite.
  let pending=false;
  const observer=new view.MutationObserver(()=>{if(pending)return;pending=true;view.queueMicrotask(()=>{pending=false;scan();});});
  observer.observe(doc.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});
  scan();
}
