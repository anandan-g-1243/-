/* core.js - கணிப்பு மையம் (DOM தேவையில்லை): வானியல் கணக்கு + பஞ்சபட்சி அட்டவணைகள் */
/* ===== மையக் கணிப்பு (DOM தேவையில்லை) ===== */
const R=Math.PI/180, TZ=330, MS=864e5;
const BIRDS=['வல்லூறு','ஆந்தை','காகம்','கோழி','மயில்'];
const ACT={U:'ஊண்',N:'நடை',A:'அரசு',T:'துயில்',S:'சாவு'}, GOOD={U:1,A:1};
const WD=['ஞாயிறு','திங்கள்','செவ்வாய்','புதன்','வியாழன்','வெள்ளி','சனி'];
const NAK=['அசுவினி','பரணி','கார்த்திகை','ரோகிணி','மிருகசீரிடம்','திருவாதிரை','புனர்பூசம்','பூசம்','ஆயில்யம்','மகம்','பூரம்','உத்திரம்','அஸ்தம்','சித்திரை','சுவாதி','விசாகம்','அனுஷம்','கேட்டை','மூலம்','பூராடம்','உத்திராடம்','திருவோணம்','அவிட்டம்','சதயம்','பூரட்டாதி','உத்திரட்டாதி','ரேவதி'];
const TITHI=['பிரதமை','துவிதியை','திருதியை','சதுர்த்தி','பஞ்சமி','சஷ்டி','சப்தமி','அஷ்டமி','நவமி','தசமி','ஏகாதசி','துவாதசி','திரயோதசி','சதுர்த்தசி'];
/* நட்சத்திரம் → பட்சி (0 வல்லூறு,1 ஆந்தை,2 காகம்,3 கோழி,4 மயில்) – மூலம்: aastrocrown, patrikai */
const NW=[0,0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,4];
const NK=[4,4,4,4,4,3,3,3,3,3,3,0,0,0,0,0,0,2,2,2,2,2,1,1,1,1,1];
/* யாம அட்டவணை: வரிசை = வல்லூறு,ஆந்தை,காகம்,கோழி,மயில்; எழுத்து = 5 யாமங்களின் தொழில் */
const T=(s)=>s.split(' ');
const TB={
 WD:{'02':T('UNATS NATSU ATSUN TSUNA SUNAT'),'13':T('SUNAT UNATS NATSU ATSUN TSUNA'),'4':T('TSUNA SUNAT UNATS NATSU ATSUN'),'5':T('ATSUN TSUNA SUNAT UNATS NATSU'),'6':T('NATSU ATSUN TSUNA SUNAT UNATS')},
 WN:{'02':T('SAUTN NSAUT TNSAU UTNSA AUTNS'),'13':T('NSAUT TNSAU UTNSA AUTNS SAUTN'),'4':T('TNSAU UTNSA AUTNS SAUTN NSAUT'),'5':T('UTNSA AUTNS SAUTN NSAUT TNSAU'),'6':T('AUTNS SAUTN NSAUT TNSAU UTNSA')},
 KD:{'02':T('SUTAN TSANU NAUST UNSTA ATNUS'),'16':T('NAUST UNSTA TSANU ATNUS SUTAN'),'3':T('ATNUS NAUST SUTAN TSANU UNSTA'),'4':T('UNSTA SUTAN ATNUS NAUST TSANU'),'5':T('TSANU ATNUS UNSTA SUTAN NAUST')},
 KN:{'02':T('STUNA ANTSU TASUN NUATS USNAT'),'6':T('TASUN NUATS ANTSU USNAT STUNA'),'13':T('ANTSU USNAT NUATS STUNA TASUN'),'4':T('USNAT TASUN STUNA ANTSU NUATS'),'5':T('NUATS STUNA USNAT TASUN ANTSU')}
};
/* படுபட்சி நாட்கள் (0=ஞாயிறு) */
const PADU={W:[[4,6],[0,5],[1],[2],[3]],K:[[2],[1],[0],[4,6],[3,5]]};
const rowOf=(t,wd)=>t[Object.keys(t).find(k=>k.includes(String(wd)))];
const jd=ms=>ms/MS+2440587.5, md=x=>((x%360)+360)%360;
function sunEq(J){const t=(J-2451545)/36525,L0=md(280.46646+t*(36000.76983+t*0.0003032)),M=357.52911+t*(35999.05029-0.0001537*t),e=0.016708634-t*(0.000042037+0.0000001267*t);
 const C=Math.sin(M*R)*(1.914602-t*(0.004817+0.000014*t))+Math.sin(2*M*R)*(0.019993-0.000101*t)+Math.sin(3*M*R)*0.000289,om=125.04-1934.136*t,lam=L0+C-0.00569-0.00478*Math.sin(om*R);
 const e0=23+(26+(21.448-t*(46.815+t*(0.00059-t*0.001813)))/60)/60,eps=e0+0.00256*Math.cos(om*R),dec=Math.asin(Math.sin(eps*R)*Math.sin(lam*R))/R,y=Math.tan(eps*R/2)**2;
 const eq=4*(y*Math.sin(2*L0*R)-2*e*Math.sin(M*R)+4*e*y*Math.sin(M*R)*Math.cos(2*L0*R)-0.5*y*y*Math.sin(4*L0*R)-1.25*e*e*Math.sin(2*M*R))/R;return{dec,eq}}
function sunTimes(y,m,d,lat,lon){const base=Date.UTC(y,m-1,d),o={};
 for(const k of['rise','set']){let t=720-4*lon;for(let i=0;i<4;i++){const{dec,eq}=sunEq(jd(base+t*6e4));
  const c=Math.cos(90.833*R)/(Math.cos(lat*R)*Math.cos(dec*R))-Math.tan(lat*R)*Math.tan(dec*R),H=Math.acos(c)/R;t=720-4*(lon+(k==='rise'?H:-H))-eq}
  o[k]=base+t*6e4}return o}
function pos(ms){const J=jd(ms),t=(J-2451545)/36525;
 const sun=md(280.46646+36000.76983*t+(1.914602-0.004817*t)*Math.sin((357.52911+35999.05029*t)*R)+0.019993*Math.sin(2*(357.52911+35999.05029*t)*R)-0.00569-0.00478*Math.sin((125.04-1934.136*t)*R));
 const Lp=218.3164477+481267.88123421*t,D=(297.8501921+445267.1114034*t)*R,M=(357.5291092+35999.0502909*t)*R,Mp=(134.9633964+477198.8675055*t)*R,F=(93.272095+483202.0175233*t)*R,s=Math.sin;
 const moon=md(Lp+6.288774*s(Mp)+1.274027*s(2*D-Mp)+0.658314*s(2*D)+0.213618*s(2*Mp)-0.185116*s(M)-0.114332*s(2*F)+0.058793*s(2*D-2*Mp)+0.057066*s(2*D-M-Mp)+0.053322*s(2*D+Mp)+0.045758*s(2*D-M)-0.04092*s(M-Mp)-0.03472*s(D)-0.030383*s(M+Mp));
 return{sun,moon,ayan:23.853+(J-2451545)/365.25*0.013969,e:md(moon-sun)}}
const tithiName=n=>n===15?'பௌர்ணமி':n===30?'அமாவாசை':TITHI[(n-1)%15];
function birth(p){const[Y,M,D]=p.dob.split('-').map(Number),[h,mi]=p.tob.split(':').map(Number);
 const q=pos(Date.UTC(Y,M-1,D,h,mi)-TZ*6e4),n=Math.floor(md(q.moon-q.ayan)/(360/27)),e=q.e;
 return{q,nak:n,e,paksha:e<180?'W':'K',tithi:Math.floor(e/12)+1,near:Math.min(e%180,180-e%180)<2}}
function dayInfo(key,p,ob){const[y,m,d]=key.split('-').map(Number),a=sunTimes(y,m,d,p.lat,p.lon),nx=new Date(Date.UTC(y,m-1,d+1)),b=sunTimes(nx.getUTCFullYear(),nx.getUTCMonth()+1,nx.getUTCDate(),p.lat,p.lon);
 const q=pos(a.rise),pk=q.e<180?'W':'K',wd=new Date(Date.UTC(y,m-1,d)).getUTCDay(),bi=(ob===undefined||ob==='me'||ob==='all')?bird(p):+ob,dl=(a.set-a.rise)/5,nl=(b.rise-a.set)/5;
 return{key,wd,rise:a.rise,set:a.set,nrise:b.rise,dl,nl,q,pk,tithi:Math.floor(q.e/12)+1,near:Math.min(q.e%180,180-q.e%180)<2,bi,
  D:rowOf(TB[pk+'D'],wd),N:rowOf(TB[pk+'N'],wd),day:rowOf(TB[pk+'D'],wd)[bi],night:rowOf(TB[pk+'N'],wd)[bi],padu:PADU[pk][bi].includes(wd)}}
function bird(p){const b=birth(p),pk=p.bp==='auto'?b.paksha:p.bp;return(pk==='W'?NW:NK)[p.nak]}
/* ===== பயனர் இயல்புநிலை ===== */
const DEF={nak:6,bp:'auto',dob:'1985-06-20',tob:'18:50',place:'சேந்தமங்கலம், நாமக்கல்',rasi:'மிதுனம்',lat:11.3,lon:78.2333};
