// node tests/validate.js
const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'../www/core.js'),'utf8');
const m=new Function(code+';return{TB,DEF,dayInfo,birth,bird,NAK,BIRDS}')();
for(const [t,o] of Object.entries(m.TB)){const days=new Set();
 for(const [k,rows] of Object.entries(o)){[...k].forEach(d=>days.add(d));
  rows.forEach(r=>{if(new Set(r).size!==5)throw new Error('row '+t+k+' '+r)});
  for(let i=0;i<5;i++)if(new Set(rows.map(r=>r[i])).size!==5)throw new Error('col '+t+k+' '+i)}
 if(days.size!==7)throw new Error('weekday coverage '+t)}
const b=m.birth(m.DEF);
if(b.paksha!=='W'||m.NAK[b.nak]!=='புனர்பூசம்'||m.BIRDS[m.bird(m.DEF)]!=='ஆந்தை')throw new Error('default profile check failed');
console.log('அனைத்து சரிபார்ப்புகளும் வெற்றி ✔');
