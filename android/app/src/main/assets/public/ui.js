/* ui.js - திரைகள் (core.js முதலில் ஏற்றப்பட வேண்டும்) */
/* ===== UI ===== */
if(typeof document!=='undefined'){
const $=s=>document.querySelector(s),pad=n=>String(n).padStart(2,'0');
const f=ms=>{const d=new Date(ms+TZ*6e4);return pad(d.getUTCHours())+':'+pad(d.getUTCMinutes())};
const fs=ms=>{const d=new Date(ms+TZ*6e4);return f(ms)+':'+pad(d.getUTCSeconds())};
const dk=ms=>{const d=new Date(ms+TZ*6e4);return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate())};
const dd=k=>k.split('-').reverse().join('-');
const shift=(k,n)=>{const[y,m,d]=k.split('-').map(Number);return dk(Date.UTC(y,m-1,d+n)-TZ*6e4+12*36e5)};
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let P=Object.assign({},DEF,store.get('pp_prof',{})),tab='day',cur,mon,sel=store.get('pp_sel','me');
(function(){const n=Date.now(),t=dk(n);cur=n<dayInfo(t,P).rise?shift(t,-1):t;mon=cur.slice(0,7)})();
const TABS={day:'அட்டவணை',hist:'வரலாறு',dob:'பிறந்த தேதி சரிபார்',how:'கணிப்பு முறை',me:'என் விவரம்'};
const pkTxt=k=>k==='W'?'வளர்பிறை':'தேய்பிறை';
function go(k){cur=k;const r=store.get('pp_recent',[]).filter(x=>x!==k);r.unshift(k);store.set('pp_recent',r.slice(0,12));tab='day';draw()}
function seg(label,start,len,code,now){return[...code].map((c,i)=>{const s=start+i*len,e=s+len,on=now>=s&&now<e;
 return`<tr class="${on?'now':''}"><td>${label} ${i+1}${on?' ◀ இப்போது':''}</td><td>${f(s)} – ${f(e)}</td><td><b class="${GOOD[c]?'g':'b'}">${ACT[c]}</b></td><td>${GOOD[c]?'நன்மை':'தவிர்க்க'}</td></tr>`}).join('')}
const selHtml=all=>{const s=(!all&&sel==='all')?'me':sel,o=(v,t)=>`<option value="${v}" ${s===v?'selected':''}>${t}</option>`;
 return`<div class="row"><label>பட்சி: <select id="sel">${o('me','என் பட்சி ('+BIRDS[bird(P)]+')')}${BIRDS.map((n,i)=>o(String(i),n)).join('')}${all?o('all','அனைத்து பட்சிகள்'):''}</select></label></div>`};
const padMsg=I=>sel==='all'?(()=>{const l=BIRDS.filter((_,b)=>PADU[I.pk][b].includes(I.wd));return l.length?`<div class="warn">இன்று படுபட்சி நாள்: <b>${l.join(', ')}</b> (மூல உரைப்படி).</div>`:''})():(I.padu?`<div class="warn">இன்று ${BIRDS[I.bi]} பட்சிக்கு <b>படுபட்சி நாள்</b> – புதிய முயற்சிகளில் கவனம் தேவை (மூல உரைப்படி).</div>`:'');
function mat(label,start,len,rows,now){let h='<table><tr><th>யாமம்</th><th>நேரம்</th>'+BIRDS.map(n=>`<th>${n}</th>`).join('')+'</tr>';
 for(let i=0;i<5;i++){const s=start+i*len,e=s+len,on=now>=s&&now<e;h+=`<tr class="${on?'now':''}"><td>${label} ${i+1}${on?' ◀':''}</td><td>${f(s)} – ${f(e)}</td>`+rows.map(r=>`<td><b class="${GOOD[r[i]]?'g':'b'}">${ACT[r[i]]}</b></td>`).join('')+'</tr>'}return h+'</table>'}
function vDay(){const I=dayInfo(cur,P,sel),now=Date.now(),b=birth(P);
 const bp=P.bp==='auto'?b.paksha:P.bp;
 return`<div class="row"><button class="btn" data-go="${shift(cur,-1)}">◀ முந்தைய நாள்</button><input type="date" id="dt" value="${cur}"><button class="btn" data-go="${shift(cur,1)}">அடுத்த நாள் ▶</button><button class="btn" id="today">இன்று</button></div>
 ${selHtml(1)}
 <div class="card"><div class="grid">
 <div><div class="k">தேதி</div><div class="v">${dd(cur)} · ${WD[I.wd]}</div></div>
 <div><div class="k">பட்சி</div><div class="v">${BIRDS[I.bi]}</div></div>
 <div><div class="k">அன்றைய பட்சம்</div><div class="v">${pkTxt(I.pk)}</div></div>
 <div><div class="k">திதி (உதயத்தில்)</div><div class="v">${tithiName(I.tithi)}</div></div>
 <div><div class="k">சூரிய உதயம்</div><div class="v">${fs(I.rise)}</div></div>
 <div><div class="k">சூரிய அஸ்தமனம்</div><div class="v">${fs(I.set)}</div></div></div></div>
 ${padMsg(I)}
 ${I.near?`<div class="info">இந்நாளில் பட்சம் மாறும் நேரம் உதயத்திற்கு மிக அருகில் உள்ளது; கணிப்பு ±2° வரை வேறுபடலாம். பஞ்சாங்கத்துடன் சரிபார்க்கவும்.</div>`:''}
 <h2>பகல் யாமங்கள் (உதயம் → அஸ்தமனம்)</h2><div class="card wrap">${sel==='all'?mat('பகல்',I.rise,I.dl,I.D,now):`<table><tr><th>யாமம்</th><th>நேரம்</th><th>தொழில்</th><th>பலன்</th></tr>${seg('பகல்',I.rise,I.dl,I.day,now)}</table>`}</div>
 <h2>இரவு யாமங்கள் (அஸ்தமனம் → அடுத்த உதயம்)</h2><div class="card wrap">${sel==='all'?mat('இரவு',I.set,I.nl,I.N,now):`<table><tr><th>யாமம்</th><th>நேரம்</th><th>தொழில்</th><th>பலன்</th></tr>${seg('இரவு',I.set,I.nl,I.night,now)}</table>`}</div>
 <p class="tiny">ஒவ்வொரு யாமமும் ${Math.round(I.dl/6e4*10)/10} நிமிடம் (பகல்) / ${Math.round(I.nl/6e4*10)/10} நிமிடம் (இரவு). நேரங்கள் இந்திய நேரம் (24 மணி). அந்தரம் (உப-பிரிவு) நேரங்கள் சரிபார்க்கப்பட்ட ஆதாரம் இல்லாததால் சேர்க்கப்படவில்லை.</p>`}
function vHist(){const[y,m]=mon.split('-').map(Number),n=new Date(Date.UTC(y,m,0)).getUTCDate(),rec=store.get('pp_recent',[]);let h='';
 for(let d=1;d<=n;d++){const k=mon+'-'+pad(d),I=dayInfo(k,P,sel),ch=(code,s,l,t)=>[...code].map((c,i)=>GOOD[c]?`<span class="chip">${t}${i+1} ${ACT[c]} ${f(s+i*l)}–${f(s+(i+1)*l)}</span>`:'').join('');
  h+=`<tr class="${k===cur?'now':''}"><td><a href="#" data-go="${k}">${dd(k)}</a></td><td>${WD[I.wd]}</td><td>${pkTxt(I.pk)}</td><td style="white-space:normal">${ch(I.day,I.rise,I.dl,'ப')}${ch(I.night,I.set,I.nl,'இ')}${I.padu?'<b class="b">படுபட்சி</b>':''}</td></tr>`}
 return`${selHtml(0)}<div class="row"><label>மாதம்: <input type="month" id="mo" value="${mon}"></label></div>
 ${rec.length?`<div class="card"><div class="k">சமீபத்தில் பார்த்த தேதிகள்</div>${rec.map(k=>`<a href="#" data-go="${k}">${dd(k)}</a>`).join(' · ')}</div>`:''}
 <div class="card wrap"><table><tr><th>தேதி</th><th>வாரம்</th><th>பட்சம்</th><th>நன்மை தரும் யாமங்கள் (ப = பகல், இ = இரவு)</th></tr>${h}</table></div>`}
function vHow(){const I=dayInfo(cur,P),b=birth(P),n6=x=>x.toFixed(3);
 return`<div class="card"><h2 style="margin-top:0">கணிப்பு படிகள்</h2><ol>
 <li><b>இடம்:</b> ${P.place} – அட்சரேகை ${P.lat}°வ, தீர்க்கரேகை ${P.lon}°கி (மூலம்: விக்கிப்பீடியா). உயரத் திருத்தம் இல்லை.</li>
 <li><b>சூரிய உதயம்/அஸ்தமனம்:</b> NOAA சூரிய நிலைச் சூத்திரம்; சூரிய விளிம்பு + ஒளிவிலகல் (90.833°). ±1–2 நிமிடம் வேறுபடலாம். நிலையான 6:00–6:00 அட்டவணை பயன்படுத்தப்படவில்லை.</li>
 <li><b>யாமம்:</b> பகல் = உதயம்→அஸ்தமனம், இரவு = அஸ்தமனம்→அடுத்த உதயம்; ஒவ்வொன்றும் 5 சம பாகங்கள்.</li>
 <li><b>பட்சம்:</b> உதய நேரத்தில் சந்திரன் – சூரியன் கோண இடைவெளி 0–180° = வளர்பிறை, 180–360° = தேய்பிறை. (எளிய வானியல் சூத்திரம்; சுமார் 0.1° துல்லியம்.)</li>
 <li><b>உங்கள் பட்சி:</b> பிறந்த நட்சத்திரம் + பிறந்த நேர பட்சம் → கீழுள்ள அட்டவணை.</li>
 <li><b>தொழில்:</b> அன்றைய பட்சம் + பகல்/இரவு + வாரம் + பட்சி → ஐந்து யாமங்களின் தொழில் வரிசை. தரவுச் சரிபார்ப்பு: ஒவ்வொரு யாமத்திலும் ஐந்து பட்சிகளுக்கும் ஐந்து தொழில்களும் ஒரு முறை மட்டுமே வரும்.</li>
 <li><b>பலன்:</b> அரசு, ஊண் = நன்மை; நடை, துயில், சாவு = தவிர்க்க (மூல உரைப்படி).</li></ol></div>
 <div class="card"><h2 style="margin-top:0">${dd(cur)} அன்றைய எண் மதிப்புகள்</h2><div class="grid">
 <div><div class="k">உதய நேர சூரிய நிரக்கோடு</div><div class="v">${n6(I.q.sun)}°</div></div>
 <div><div class="k">சந்திர நிரக்கோடு</div><div class="v">${n6(I.q.moon)}°</div></div>
 <div><div class="k">இடைவெளி</div><div class="v">${n6(I.q.e)}°</div></div>
 <div><div class="k">திதி எண்</div><div class="v">${I.tithi} (${tithiName(I.tithi)})</div></div>
 <div><div class="k">பகல் நீளம்</div><div class="v">${Math.round(I.dl*5/6e4)} நிமிடம்</div></div>
 <div><div class="k">இரவு நீளம்</div><div class="v">${Math.round(I.nl*5/6e4)} நிமிடம்</div></div></div></div>
 <div class="card"><h2 style="margin-top:0">பிறப்பு சரிபார்ப்பு (${dd(P.dob)}, ${P.tob})</h2>
 <p>கணித்த பட்சம்: <b>${pkTxt(b.paksha)}</b> (இடைவெளி ${n6(b.e)}°, திதி ${tithiName(b.tithi)}).<br>கணித்த சந்திர நட்சத்திரம் (லாகிரி அயனாம்சம்): <b>${NAK[b.nak]}</b>${b.nak===P.nak?' – நீங்கள் கொடுத்த நட்சத்திரத்துடன் பொருந்துகிறது.':` – கொடுத்த நட்சத்திரம் (${NAK[P.nak]}) உடன் வேறுபடுகிறது; ஜாதகத்தைச் சரிபார்க்கவும்.`}${b.near?'<br><b>பட்ச எல்லைக்கு அருகில் உள்ளது; ஜாதகத்தில் உறுதிசெய்யவும்.</b>':''}</p></div>
 <div class="card"><h2 style="margin-top:0">ஆதாரங்கள்</h2><ul class="tiny">
 <li><a href="https://aastrocrown.wordpress.com/2010/11/23/panjapatchi/" target="_blank" rel="noopener">aastrocrown – பஞ்சபட்சி சாஸ்திரம்</a> (நட்சத்திரம்–பட்சி, யாம அட்டவணைகள், படுபட்சி)</li>
 <li><a href="https://patrikai.com/pancha-bakshi-sashtra/" target="_blank" rel="noopener">பத்திரிகை.காம்</a> (வளர்பிறை நட்சத்திரப் பிரிவு, படுபட்சி நாட்கள்)</li></ul>
 <p class="tiny">இவை இணைய மூல உரைகள்; உங்கள் குருநாதர்/மரபு நூலுடன் ஒப்பிட்டுச் சரிபார்க்கவும். மூலங்களில் இல்லாத எந்த நேரமும் இங்கே உருவாக்கப்படவில்லை.</p></div>`}
function vMe(){const b=birth(P);
 return`<div class="card"><div class="row"><label>பிறந்த தேதி <input type="date" id="f_dob" value="${P.dob}"></label><label>நேரம் <input type="time" id="f_tob" value="${P.tob}"></label></div>
 <div class="row"><label>இடம் <input id="f_pl" value="${P.place}"></label><label>ராசி <input id="f_ra" value="${P.rasi}" size="8"></label></div>
 <div class="row"><label>நட்சத்திரம் <select id="f_nak">${NAK.map((n,i)=>`<option value="${i}" ${i===P.nak?'selected':''}>${n}</option>`).join('')}</select></label>
 <label>பிறந்த பட்சம் <select id="f_bp"><option value="auto" ${P.bp==='auto'?'selected':''}>தானாக கணி (${pkTxt(b.paksha)})</option><option value="W" ${P.bp==='W'?'selected':''}>வளர்பிறை</option><option value="K" ${P.bp==='K'?'selected':''}>தேய்பிறை</option></select></label></div>
 <div class="row"><label>அட்சரேகை <input id="f_lat" type="number" step="0.0001" value="${P.lat}" style="width:110px"></label><label>தீர்க்கரேகை <input id="f_lon" type="number" step="0.0001" value="${P.lon}" style="width:110px"></label></div>
 <div class="row"><button class="btn" id="save">சேமி</button><button class="btn" id="reset">இயல்புநிலைக்கு மாற்று</button></div>
 <p class="v">உங்கள் பட்சி: ${BIRDS[bird(P)]}</p></div>
 <div class="card"><h2 style="margin-top:0">எவருக்கும் பட்சி கண்டறி</h2><div class="row"><label>நட்சத்திரம் <select id="fn_nak">${NAK.map((n,i)=>`<option value="${i}">${n}</option>`).join('')}</select></label><label>பட்சம் <select id="fn_pk"><option value="W">வளர்பிறை</option><option value="K">தேய்பிறை</option></select></label></div><div id="fn_res" class="v"></div></div>`}
const RASI=['மேஷம்','ரிஷபம்','மிதுனம்','கடகம்','சிம்மம்','கன்னி','துலாம்','விருச்சிகம்','தனுசு','மகரம்','கும்பம்','மீனம்'];
function vDob(){return`<div class="card"><h2 style="margin-top:0">பிறந்த தேதி மூலம் பட்சி சரிபார்</h2><p class="tiny">நேரம் இந்திய நேரம் (IST) என எடுத்துக்கொள்ளப்படும். பிறந்த நேரம் தெரியாவிட்டால் முடிவு மாறலாம்.</p><div class="row"><label>பிறந்த தேதி <input type="date" id="d_dob" value="${P.dob}"></label><label>நேரம் <input type="time" id="d_tob" value="${P.tob}"></label></div><div id="d_res"></div></div>`}
function dobCheck(){const dob=$('#d_dob').value,tob=$('#d_tob').value||'12:00',o=$('#d_res');if(!dob){o.textContent='பிறந்த தேதியை உள்ளிடவும்.';return}
 const b=birth({dob,tob}),sid=((b.q.moon-b.q.ayan)%360+360)%360,w=360/27,fr=sid%w,pada=Math.floor(fr/(w/4))+1,ra=Math.floor(sid/30),bi=(b.paksha==='W'?NW:NK)[b.nak],nb=Math.min(fr,w-fr)<0.5,r=(a,c)=>`<tr><td>${a}</td><td><b>${c}</b></td></tr>`;
 o.innerHTML=`<div class="wrap"><table>${r('தேதி / நேரம்',dd(dob)+' · '+tob)}${r('சந்திர நிரக்கோடு (நிரயனம்)',sid.toFixed(3)+'°')}${r('நட்சத்திரம்',NAK[b.nak]+' – பாதம் '+pada)}${r('சந்திர ராசி',RASI[ra])}${r('சந்திர–சூரிய இடைவெளி',b.e.toFixed(3)+'°')}${r('திதி',tithiName(b.tithi))}${r('பட்சம்',pkTxt(b.paksha))}${r('பட்சி',BIRDS[bi])}</table></div>
 ${(b.near||nb)?'<div class="info">நட்சத்திரம்/பட்ச எல்லைக்கு மிக அருகில் உள்ளது; கணிப்பு சில நிமிடம் அல்லது 0.5° வேறுபடலாம். ஜாதகத்தில் உறுதிசெய்யவும்.</div>':''}
 <div class="row"><button class="btn" data-pick="${bi}">இந்த பட்சியின் அட்டவணை</button><button class="btn" id="d_save" data-nak="${b.nak}" data-dob="${dob}" data-tob="${tob}">என் விவரமாகச் சேமி</button></div>`}
function finder(){const n=+$('#fn_nak').value,k=$('#fn_pk').value,i=(k==='W'?NW:NK)[n];$('#fn_res').innerHTML=`${NAK[n]} · ${pkTxt(k)} → பட்சி: <b>${BIRDS[i]}</b> <button class="btn" data-pick="${i}">இந்த பட்சியின் அட்டவணை</button>`}
function draw(){$('#tabs').innerHTML=Object.entries(TABS).map(([k,v])=>`<button data-tab="${k}" class="${k===tab?'on':''}">${v}</button>`).join('');
 $('#view').innerHTML={day:vDay,hist:vHist,dob:vDob,how:vHow,me:vMe}[tab]();if($('#fn_res'))finder();if($('#d_res'))dobCheck()}
document.addEventListener('click',e=>{const t=e.target.closest('[data-tab],[data-go],[data-pick],#d_save,#today,#save,#reset');if(!t)return;e.preventDefault();
 if(t.id==='d_save'){P={...P,dob:t.dataset.dob,tob:t.dataset.tob,nak:+t.dataset.nak,bp:'auto'};store.set('pp_prof',P);tab='me';draw()}else if(t.dataset.pick){sel=t.dataset.pick;store.set('pp_sel',sel);tab='day';draw()}else if(t.dataset.tab){tab=t.dataset.tab;draw()}else if(t.dataset.go)go(t.dataset.go);
 else if(t.id==='today'){const n=dk(Date.now());go(Date.now()<dayInfo(n,P).rise?shift(n,-1):n)}
 else if(t.id==='save'){P={...P,dob:$('#f_dob').value,tob:$('#f_tob').value,place:$('#f_pl').value,rasi:$('#f_ra').value,nak:+$('#f_nak').value,bp:$('#f_bp').value,lat:+$('#f_lat').value,lon:+$('#f_lon').value};store.set('pp_prof',P);draw()}
 else if(t.id==='reset'){P={...DEF};store.set('pp_prof',P);draw()}});
document.addEventListener('change',e=>{if(e.target.id==='sel'){sel=e.target.value;store.set('pp_sel',sel);draw()}if(e.target.id==='d_dob'||e.target.id==='d_tob')dobCheck();if(e.target.id==='fn_nak'||e.target.id==='fn_pk')finder();if(e.target.id==='dt'&&e.target.value)go(e.target.value);if(e.target.id==='mo'&&e.target.value){mon=e.target.value;draw()}});
draw()}
