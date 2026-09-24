/* UX/UI portfolio demo only: no real messages, signatures or documents are transmitted. */
(()=>{
  'use strict';
  // V2 deliberately does not inherit an old completed V1 demo state.
  const STORE = 'lhMockFamilySignatureV2';
  const initial = () => ({sent:false, opened:false, signed:false, channel:'카카오톡', image:''});
  const $ = id => document.getElementById(id);
  let state;
  try { state = {...initial(), ...JSON.parse(localStorage.getItem(STORE) || '{}')}; }
  catch (_) { state = initial(); }
  const save = () => localStorage.setItem(STORE, JSON.stringify(state));
  const show = (id, visible) => { const el=$(id); if(el) el.hidden = !visible; };
  const reset = () => { state=initial(); save(); window.location.href='document-checklist.html'; };
  function renderApplicant(){
    if(!$('mock-progress-fill')) return;
    const count=state.signed?4:3;
    $('mock-progress-fill').style.width=count*20+'%';
    $('mock-progress-num').textContent=count;
    $('mock-sign-status').textContent=state.signed?'완료':state.sent?'요청함':'가족 서명 필요';
    $('mock-sign-row').classList.toggle('completed',state.signed);
    $('mock-sign-check').textContent=state.signed?'✓':'';
    $('mock-request').textContent=state.signed?'서명 완료 · 다시 확인하기':state.sent?'서명 요청 다시 보내기':'서명 요청 보내기';
    show('mock-go-family',state.sent&&!state.signed);
    show('mock-track',state.sent);
    for(const [index,key] of ['request','open','sign'].entries()){
      const el=$('mock-track-'+key);
      const done=[state.sent,state.opened,state.signed][index];
      el.className=done?'finished':'';
      el.textContent=(done?'✓ ':'○ ')+['요청함','링크 열림','서명 완료'][index];
    }
    show('mock-received',state.signed&&!!state.image);
    if(state.signed&&state.image) $('mock-received-img').src=state.image;
  }
  const screens=['mock-message-screen','mock-doc-screen','mock-sign-screen','mock-done-screen'];
  const showScreen = current => screens.forEach(id=>show(id,id===current));
  function renderFamily(){
    if(!$('mock-empty')) return;
    $('mock-channel').textContent=state.channel;
    show('mock-empty',!state.sent);
    show('mock-bubble',state.sent);
    // A saved completed demo can always be replayed from the reset button.
    showScreen(state.signed?'mock-done-screen':'mock-message-screen');
  }
  if($('mock-request')){
    $('mock-reset').addEventListener('click',reset);
    $('mock-request').addEventListener('click',()=>{
      if(state.signed){window.location.href='signature-request.html';return;}
      show('mock-share',true);
    });
    $('mock-close').addEventListener('click',()=>show('mock-share',false));
    $('mock-share').addEventListener('click',event=>{
      if(event.target===$('mock-share')) show('mock-share',false);
    });
    document.querySelectorAll('[data-method]').forEach(button=>button.addEventListener('click',()=>{
      state.channel=button.dataset.method;
      document.querySelectorAll('[data-method]').forEach(b=>b.classList.toggle('selected',b===button));
      $('mock-send').textContent=state.channel+'으로 보내기';
    }));
    $('mock-send').addEventListener('click',()=>{
      state.sent=true;state.opened=false;state.signed=false;state.image='';
      save();show('mock-share',false);renderApplicant();
      // Same-browser simulation of the family receiving the message.
      window.location.href='signature-request.html';
    });
    window.addEventListener('storage',()=>{
      try{state={...initial(),...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch(_){state=initial()}
      renderApplicant();
    });
    renderApplicant();
  }
  if($('mock-open-link')){
    $('mock-open-link').addEventListener('click',()=>{
      state.opened=true;save();showScreen('mock-doc-screen');
    });
    $('mock-next').addEventListener('click',()=>{
      if(!$('mock-consent').checked){$('mock-doc-feedback').textContent='내용 확인 후 동의해 주세요.';return;}
      $('mock-doc-feedback').textContent='';showScreen('mock-sign-screen');setupCanvas();
    });
    $('mock-back').addEventListener('click',()=>window.location.href='document-checklist.html');
    $('mock-family-reset').addEventListener('click',reset);
    renderFamily();
  }
  let ctx,canvas,drawn=false,drawing=false;
  function setupCanvas(){
    canvas=$('mock-canvas');
    if(canvas.dataset.ready)return;
    canvas.dataset.ready='1';
    const ratio=window.devicePixelRatio||1;
    const rect=canvas.getBoundingClientRect();
    canvas.width=Math.max(1,Math.round(rect.width*ratio));
    canvas.height=Math.max(1,Math.round(rect.height*ratio));
    ctx=canvas.getContext('2d');
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.strokeStyle='#222';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.lineJoin='round';
    const point=e=>{const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
    canvas.addEventListener('pointerdown',e=>{
      drawing=true;drawn=true;canvas.setPointerCapture(e.pointerId);
      const v=point(e);ctx.beginPath();ctx.moveTo(v.x,v.y);ctx.lineTo(v.x+.1,v.y+.1);ctx.stroke();
    });
    canvas.addEventListener('pointermove',e=>{
      if(!drawing)return;const v=point(e);ctx.lineTo(v.x,v.y);ctx.stroke();
    });
    ['pointerup','pointercancel','lostpointercapture'].forEach(k=>canvas.addEventListener(k,()=>drawing=false));
    $('mock-clear').addEventListener('click',()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);drawn=false;
      $('mock-sign-feedback').textContent='';
    });
    $('mock-complete').addEventListener('click',()=>{
      if(!drawn){$('mock-sign-feedback').textContent='서명란에 서명해 주세요.';return;}
      state.image=canvas.toDataURL('image/png');state.signed=true;save();
      showScreen('mock-done-screen');
    });
  }
})();
