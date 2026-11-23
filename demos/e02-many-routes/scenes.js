/* E02 "Many routes to the farmer": original compositions, 1920 x 1080.
 * Helper functions come from the player template (mk, paper, slip, txt, person, ...).
 * Every scene is deterministic and seekable. Motion follows the narration chunks (cu).
 * Key content stays above y = 880 so the caption slip is never covered. */
const K={sky:'#bc563a',sun:'#f4cd6b',dune:'#cc8a43',far:'#d9b76c',olive:'#8c9848',green:'#3c7443',deep:'#204c37'};
const NAMES=['Saved seed','Neighbours and kin','Local market','Cooperative or community','Seed company'];
function P(p,d,f,extra={}){return mk('path',{d,fill:f,...extra},p)}
function ttl(p,lines,x,y,size=64,o={}){const z=slip(p,lines,size,{fill:o.fill||C.cream,tc:o.tc||C.ink,seed:o.seed||12,maxW:o.maxW||1300});place(z,x,y,1,o.r??-1);return z}
function easeIn(sc,g,j,x,y,opts={}){sc.moves.push((u)=>{const p=eo(seg(u,cu(sc.I,j),cu(sc.I,j)+(opts.span||.065)));vis(g,p*4);place(g,x+(opts.dx||0)*(1-p),y+(opts.dy??20)*(1-p),opts.s||1,(opts.r||0)+(opts.turn||0)*(1-p))})}
function begin(I){return {I,moves:[],update(u,lt,d){this.moves.forEach(f=>f(u,lt*BEATS[this.I].dur0/d,d))},setTag(){}}}
function farm(p,variant='sunset',sky){
 const z=mk('g',{},p),back=mk('g',{},z),middle=mk('g',{},z),front=mk('g',{},z);
 mk('rect',{x:-80,y:-80,width:2080,height:1240,fill:sky||(variant==='sunset'?K.sky:'#e6d39b')},back);
 const sun=paper(back,blobD(430,420,214,210,111,18,.02),K.sun,{dx:0,dy:8,op:.1});
 [[465,35,K.dune,21],[550,32,K.far,22],[636,24,K.olive,23],[713,18,K.green,24]].forEach(([y,a,f,s])=>paper(middle,hillD(y,a,s,120),f,{dx:0,dy:-7,op:.18}));
 paper(front,hillD(795,17,25,110),K.deep,{dx:0,dy:-8,op:.2});
 for(let i=-5;i<23;i++){const xb=i*140,xt=870+(xb-870)*.14;P(front,`M${xt} 789L${xt+13} 789L${xb+75} 1120L${xb} 1120Z`,i%2?'#2b6041':'#214c37')}
 return {z,back,middle,front,sun};
}
function seedG(p,x=0,y=0,s=1,fill=C.ochre){const g=mk('g',{},p);paper(g,blobD(0,0,15,25,5,10,.09),fill,{dx:2,dy:4,op:.25});P(g,'M-2-15Q-8 0-2 15','none',{stroke:'rgba(50,35,12,.25)','stroke-width':2});place(g,x,y,s,-19);return g}
function shoot(p){const g=mk('g',{},p);P(g,'M0 35C3-8-5-65 0-114','none',{stroke:C.leaf,'stroke-width':9,'stroke-linecap':'round'});const l=mk('g',{},g),r=mk('g',{},g);paper(l,'M0-65C-61-46-91-90-80-118C-39-128-5-103 0-65Z',C.leaf,{dx:3,dy:5,op:.24});paper(r,'M0-105C52-90 83-126 71-151C39-163 5-139 0-105Z','#82a653',{dx:3,dy:5,op:.24});return g}
function maize(p,x,y,s=1,r=0){const g=mk('g',{},p);P(g,'M0 0Q6-90 0-210','none',{stroke:C.leaf,'stroke-width':8,'stroke-linecap':'round'});
 [[-1,-70],[1,-110],[-1,-150],[1,-185]].forEach(([d,yy],i)=>paper(g,`M0 ${yy}Q${d*70} ${yy-48} ${d*118} ${yy+6}Q${d*60} ${yy-14} 0 ${yy+10}Z`,i%2?C.leaf:'#4f8a45',{dx:2,dy:3,op:.2}));
 paper(g,blobD(14,-118,13,30,s*3+2,8,.08),C.sun,{dx:2,dy:3,op:.2});place(g,x,y,s,r);return g}
function coin(p,x,y,r=30,dashed=false){const g=mk('g',{},p);if(dashed){mk('circle',{r,fill:'none',stroke:C.cream,'stroke-width':5,'stroke-dasharray':'9 8',opacity:.8},g)}else{paper(g,blobD(0,0,r,r,7,12,.02),C.ochre,{dx:3,dy:5,op:.3});mk('circle',{r:r*.62,fill:'none',stroke:'rgba(90,55,10,.4)','stroke-width':3},g)}place(g,x,y,1,0);return g}
function plate(p,w,h,n,fill){const g=mk('g',{},p);paper(g,rectD(-w/2,-h/2,w,h,n,3),fill||C.cream,{dx:6,dy:10,op:.28});return g}

/* five small paper scenes, one per seed route; local origin at the tile centre (300 x 230) */
function routeArt(p,k){
 const fills=['#eadcae','#e9d7a6','#efe0b4','#e4dbaa','#e9e4c8'];
 const g=plate(p,300,230,k+3,fills[k]);const a=mk('g',{},g);
 P(a,'M-140 62H140V100H-140Z','#c9a96a');
 if(k===0){paper(a,'M-90-10H40V62H-90Z','#b9794b',{dx:3,dy:5,op:.22});paper(a,'M-102-10L-25-72L52-10Z','#8c4a31',{dx:3,dy:5,op:.22});P(a,'M-48 18H-14V62H-48Z','#5b3322');
  paper(a,blobD(92,50,44,24,4,10,.06),'#c79a4f',{dx:3,dy:5,op:.25});[[-18,-16],[6,-22],[28,-14]].forEach(([x,y],i)=>paper(a,blobD(92+x,40+y,9,22,10+i,8,.06),C.sun,{dx:2,dy:3,op:.2}));}
 if(k===1){const a1=person(a,-62,76,.6,{shirt:C.terra,hat:C.ochre,hold:true}),b1=person(a,68,76,.6,{shirt:C.moss,flip:true,skin:'#7a4429'});
  paper(a,blobD(2,56,28,20,6,10,.06),'#c79a4f',{dx:3,dy:5,op:.25});seedG(a,2,44,.7);}
 if(k===2){[-100,-60,-20,20,60,100].forEach((x,i)=>paper(a,`M${x-20} -58H${x+20}L${x+20} -20H${x-20}Z`,i%2?C.cream:C.terra,{sh:false}));P(a,'M-124-58H124L134-30H-134Z','none',{stroke:'rgba(0,0,0,.18)','stroke-width':3});
  P(a,'M-108-30V62M108-30V62','none',{stroke:'#6b4a2f','stroke-width':9});paper(a,'M-126 22H126V42H-126Z','#a8764a',{dx:3,dy:5,op:.25});
  [-70,0,70].forEach((x,i)=>{paper(a,blobD(x,8,30,22,20+i,10,.06),i%2?'#d9c28a':'#c79a4f',{dx:3,dy:4,op:.25});seedG(a,x,2,.45,C.sun)});}
 if(k===3){paper(a,'M-120-14H120V62H-120Z','#7d9150',{dx:3,dy:5,op:.22});paper(a,'M-134-14L0-76L134-14Z','#5e7036',{dx:3,dy:5,op:.22});P(a,'M-26 8H26V62H-26Z','#4b5a2b');P(a,'M-26 8V62M26 8V62M0 8V62','none',{stroke:'#3a4620','stroke-width':3});
  [-86,-62,60,86].forEach((x,i)=>paper(a,blobD(x,48,19,22,30+i,9,.08),'#d8c28a',{dx:2,dy:3,op:.22}));P(a,'M96-76V-116','none',{stroke:'#5b3322','stroke-width':5});paper(a,'M98-116H128L116-104L128-92H98Z',C.terra,{sh:false});}
 if(k===4){paper(a,'M-118-30H118V62H-118Z','#dfe3d4',{dx:3,dy:5,op:.22});P(a,'M-124-50H124V-24H-124Z',C.moss);
  P(a,'M-96-8H-12V50H-96Z','#9ab9a3');P(a,'M12-8H96V50H12Z','#9ab9a3');P(a,'M-54-8V50M54-8V50','none',{stroke:C.cream,'stroke-width':5});
  paper(a,'M-80 14H-50V46H-80Z',C.cream,{sh:false});P(a,'M-80 14H-50V22H-80Z',C.ochre);paper(a,'M30 14H62V46H30Z',C.cream,{sh:false});P(a,'M30 14H62V22H30Z',C.ochre);}
 return g;
}

/* 1. One farmer, one season */
function S1(svg){const sc=begin(0),land=farm(svg,'sunset');
 const ttlg=ttl(svg,['Many routes','to the farmer'],470,196,76,{maxW:820});easeIn(sc,ttlg,0,470,196,{dy:-30,span:.09});
 [[1480,820,1.1],[1620,840,1.3],[1790,820,1.05]].forEach(([x,y,s],i)=>maize(svg,x,y,s,i-1));
 const amina=person(svg,0,0,1,{shirt:C.cream,pants:'#3a4b38',hat:C.ochre});easeIn(sc,amina,0,760,835,{s:1.7,dy:26,span:.1});
 const tag=slip(svg,'a fictional farmer',36,{fill:C.sun,cls:'b',seed:3,maxW:400});easeIn(sc,tag,0,760,405,{r:-3,dy:12,span:.07});
 const cloud=cloudG(svg,'#9a8f8c');
 const rain=mk('g',{},svg);for(let i=0;i<9;i++)P(rain,`M${-90+i*22} 70l-12 40`,'none',{stroke:C.cream,'stroke-width':4,'stroke-linecap':'round',opacity:.6});
 const q=slip(svg,['Where will the','seed come from?'],56,{fill:C.sun,cls:'d',seed:9,maxW:560});easeIn(sc,q,3,1250,380,{r:3,dy:22,span:.1});
 sc.moves.push((u)=>{const c=eo(seg(u,cu(0,1)-.02,cu(0,1)+.22));place(cloud,1900-480*c-30*u,190+20*c,1.25,0);vis(cloud,c*4);place(rain,1900-480*c-30*u,190+20*c,1.25,0);vis(rain,eo(seg(u,cu(0,2),cu(0,2)+.15))*.9);
  place(land.middle,-9*u,0,1);place(land.sun,0,-12*u,1);});
 return sc;}

/* 2. Many routes */
function S2(svg){const sc=begin(1),land=farm(svg,'day','#cdb97f');
 const field=mk('g',{},svg);paper(field,blobD(960,735,450,150,31,16,.04),'#5f8f45',{dx:0,dy:10,op:.28});
 for(let r=0;r<3;r++)for(let c=0;c<6;c++)P(field,rectD(615+c*118,650+r*58,108,50,r*7+c,3),(r+c)%2?'#4e7f3c':'#6f9a4c',{opacity:.9});
 const xs=[250,610,970,1330,1690],ys=[330,265,235,265,330],tx=[780,870,960,1050,1140],ty=[690,660,640,660,690];
 const trails=xs.map((x,i)=>{const d=`M${x} ${ys[i]+190}C${x} ${ys[i]+330} ${tx[i]} ${ty[i]-190} ${tx[i]} ${ty[i]}`;
  const sh=P(svg,d,'none',{stroke:'rgba(0,0,0,.22)','stroke-width':16,'stroke-linecap':'round',pathLength:1,transform:'translate(4 7)'});
  const t=P(svg,d,'none',{stroke:C.cream,'stroke-width':12,'stroke-linecap':'round',pathLength:1});return [t,sh]});
 const amina=person(svg,960,850,1.1,{shirt:C.terra,pants:'#3a4b38',hat:C.ochre});
 const head=ttl(svg,'Many routes to one field',960,76,54,{maxW:900,seed:4});easeIn(sc,head,0,960,76,{dy:-24,span:.08});
 xs.forEach((x,i)=>{const g=mk('g',{},svg);routeArt(g,i);const lb=slip(g,NAMES[i],32,{fill:C.cream,cls:'b',seed:5+i,maxW:330});place(lb,0,150,1,i%2?1.5:-1.5);easeIn(sc,g,i+1,x,ys[i],{dy:34,span:.08,r:(i-2)*.8});
  sc.moves.push(u=>{const p=eo(seg(u,cu(1,i+1)+.04,cu(1,i+1)+.18));trails[i].forEach(t=>{t.setAttribute('stroke-dasharray',`${p} 2`);vis(t,p>.002?1:0)})});});
 sc.moves.push(u=>{place(land.middle,-6*u,0,1)});
 return sc;}

/* 3. Different needs */
function S3(svg){const sc=begin(2);mk('rect',{width:W,height:H,fill:'#2d4a37'},svg);
 for(let i=0;i<7;i++)P(svg,`M-40 ${100+i*150}Q500 ${70+i*150} 1000 ${100+i*150}T2000 ${90+i*150}`,'none',{stroke:'#3b5c45','stroke-width':4,opacity:.5});
 const head=ttl(svg,'Different routes, different strengths',960,88,56,{maxW:1500,seed:8});easeIn(sc,head,0,960,88,{dy:-24,span:.08});
 const can=[['Close at hand','little cash needed'],['Known to do well','nearby'],['Open when','she is ready'],['Quality','information'],['Labelled','seed']];
 const catchT=[['Quality may','be unknown'],['Supply may','be limited'],['Origin may','be unclear'],['May not stock','her crop'],['Cash and','travel']];
 const xs=[220,590,960,1330,1700],cy=490,catches=[];
 xs.forEach((x,i)=>{const g=mk('g',{},svg);paper(g,rectD(-165,-285,330,570,i+40,3),C.cream,{dx:7,dy:12,op:.32});
  const art=mk('g',{},g);routeArt(art,i);place(art,0,-168,.8,0);
  txt(g,NAMES[i],0,-36,29,{fill:C.ink,anchor:'middle',cls:'b',maxW:300,min:20});P(g,'M-130-14H130','none',{stroke:'#b9a679','stroke-width':3});
  txt(g,'CAN MEET',0,28,21,{fill:C.moss,anchor:'middle',cls:'b'});const s=slip(g,can[i],30,{fill:'#cfe3b4',seed:50+i,maxW:300});place(s,0,84,1,i%2?1:-1);
  const cg=mk('g',{},g);txt(cg,'WATCH FOR',0,158,21,{fill:C.clay,anchor:'middle',cls:'b'});const c=slip(cg,catchT[i],30,{fill:'#f0c9b4',seed:60+i,maxW:300});place(c,0,212,1,i%2?-1:1);catches.push(cg);
  easeIn(sc,g,i+1,x,cy,{dy:40,span:.08,r:(i-2)*.6});});
 sc.moves.push(u=>{catches.forEach((cg,i)=>{const t0=i===4?cu(2,5):cu(2,6)+i*.005;vis(cg,eo(seg(u,t0+.01,t0+.05)))});
  const pulse=eo(seg(u,cu(2,6),cu(2,6)+.05));const pl=catches[4];pl.setAttribute('transform',`translate(0 0) scale(${(1+.05*pulse).toFixed(3)})`);});
 return sc;}

/* 4. No single winner */
function S4(svg){const sc=begin(3),land=farm(svg,'day','#d7c58d');
 const head=ttl(svg,'No single winner',960,84,60,{maxW:900,seed:14});easeIn(sc,head,0,960,84,{dy:-24,span:.08});
 const xs=[300,630,960,1290,1620];const tiles=xs.map((x,i)=>{const g=mk('g',{},svg);const a=mk('g',{},g);routeArt(a,i);place(a,0,0,.58,0);const lb=slip(g,NAMES[i],26,{fill:C.cream,cls:'b',seed:20+i,maxW:300});place(lb,0,98,1,i%2?1:-1);place(g,x,690,1,0);easeIn(sc,g,0,x,690,{dy:30,span:.1});return g});
 const cards=[['Cash is short',0],['Rains are late',1],['Crop is a hybrid',2]].map(([t,k],i)=>{const g=mk('g',{},svg);paper(g,rectD(-215,-100,430,200,60+i,3),C.cream,{dx:7,dy:12,op:.3});P(g,'M-212-100H212V-52H-212Z',C.moss);txt(g,t,0,-62,32,{fill:C.cream,anchor:'middle',cls:'b',maxW:400});
  const ic=mk('g',{},g);if(k===0){coin(ic,-70,22,28);coin(ic,0,22,28);coin(ic,70,22,28,true)}
  if(k===1){const cl=cloudG(ic,'#9a8f8c');place(cl,-20,18,.32,0);P(ic,'M60 40q-20 20 0 40','none',{stroke:C.clay,'stroke-width':4,'stroke-dasharray':'6 8',opacity:.0})}
  if(k===2){seedG(ic,-110,22,1.1,C.sun);P(ic,'M-80 22H-30','none',{stroke:C.ink,'stroke-width':5,'stroke-linecap':'round'});P(ic,'M-42 10L-28 22L-42 34','none',{stroke:C.ink,'stroke-width':5,'stroke-linecap':'round'});[[0,0,.8],[50,10,1.1],[105,-4,.6]].forEach(([x,y,s],j)=>seedG(ic,x+25,24+y,s,j%2?C.ochre:C.sun))}
  return g});
 const cx=[480,960,1440];cards.forEach((g,i)=>easeIn(sc,g,i+1,cx[i],270,{dy:30,span:.07}));
 const fl=[[0,[0,1]],[1,[2]],[2,[3,4]]];const flags=[];fl.forEach(([c,rs])=>rs.forEach(r=>{const f=slip(svg,'fits here',30,{fill:C.sun,cls:'b',seed:70+r,maxW:200});flags.push({f,c,r})}));
 sc.moves.push(u=>{const act=u>=cu(3,3)?2:u>=cu(3,2)?1:u>=cu(3,1)?0:-1;
  cards.forEach((g,i)=>{const p=eo(seg(u,cu(3,i+1),cu(3,i+1)+.07));const on=i===act?1:0;place(g,cx[i],270-p*0+(1-p)*30-on*10,(.92+.1*on)*1,0);vis(g,p*4*(i===act||act<0||u<cu(3,i+1)+.0?1:.62))});
  flags.forEach(({f,c,r})=>{const a=eo(seg(u,cu(3,c+1)+.02,cu(3,c+1)+.07));const off=c<2?1-eo(seg(u,cu(3,c+2)+.0,cu(3,c+2)+.04)):1;const p=a*off;vis(f,p*4);place(f,xs[r],540-(1-p)*24,1,r%2?2:-2)});
  place(land.middle,-5*u,0,1);});
 return sc;}

/* 5. Behind the choice */
function S5(svg){const sc=begin(4);mk('rect',{width:W,height:H,fill:'#2b4636'},svg);
 for(let i=0;i<8;i++)P(svg,`M-40 ${60+i*140}Q500 ${30+i*140} 1000 ${60+i*140}T2000 ${50+i*140}`,'none',{stroke:'#39594a','stroke-width':4,opacity:.45});
 const head=ttl(svg,'Eight sector functions',960,86,58,{maxW:1000,seed:6});easeIn(sc,head,0,960,86,{dy:-24,span:.08});
 const cp=mk('clipPath',{id:'s5clip'},svg);mk('circle',{cx:0,cy:0,r:206},cp);
 const mid=mk('g',{},svg);paper(mid,blobD(0,0,218,218,41,18,.02),C.cream,{dx:8,dy:14,op:.32});const inner=mk('g',{'clip-path':'url(#s5clip)'},mid);
 mk('rect',{x:-260,y:-260,width:520,height:520,fill:'#f0dfae'},inner);[[20,K.far],[60,K.olive],[105,K.green]].forEach(([y,f],i)=>paper(inner,hillD(y,10,80+i,90,300),f,{sh:false}));
 for(let r=0;r<4;r++)P(inner,`M${-90-r*20} ${120+r*26}L${90+r*20} ${120+r*26}`,'none',{stroke:'#18412d','stroke-width':8,opacity:.5});
 const sh=shoot(inner);place(sh,-90,130,1.1);const am=person(inner,64,182,.95,{shirt:C.terra,pants:'#3a4b38',hat:C.ochre});
 const mtag=slip(mid,'Amina’s seed choice',30,{fill:C.sun,cls:'b',seed:3,maxW:320});place(mtag,0,-250,1,-2);
 easeIn(sc,mid,0,960,470,{dy:24,span:.1,s:1});
 const fn=[['Production','Seed is made'],['Value addition and distribution','Seed reaches farmers'],['Service provision','Advice, testing, inspection'],['Utilisation','Farmers choose and sow'],['Stakeholder organisation','Groups and associations'],['Regulation','Rules for quality and trade'],['Coordination','Actors align their work'],['Financing','Who can pay, and when']];
 const tiles=fn.map(([n,d],i)=>{const g=mk('g',{},svg);paper(g,rectD(-215,-72,430,144,i+90,3),C.cream,{dx:6,dy:10,op:.3});P(g,'M-215-72H-205V72H-215Z',[C.moss,C.leaf,C.olive,C.ochre,C.moss,C.terra,C.leaf,C.clay][i]);
  const ic=mk('g',{},g);
  if(i===0){const s=shoot(ic);place(s,0,30,.6)}if(i===1)icBin(ic);if(i===2)icDoc(ic);if(i===3){seedG(ic,-14,4,1.1);seedG(ic,18,-10,.9,C.sun)}
  if(i===4){[[-22,12],[22,12],[0,-20]].forEach(([x,y])=>mk('circle',{cx:x,cy:y,r:13,fill:C.moss},ic));P(ic,'M-22 12L22 12L0-20Z','none',{stroke:C.moss,'stroke-width':4})}
  if(i===5)icCheck(ic);if(i===6){mk('circle',{cx:-14,cy:0,r:24,fill:'none',stroke:C.moss,'stroke-width':7},ic);mk('circle',{cx:14,cy:0,r:24,fill:'none',stroke:C.terra,'stroke-width':7},ic)}
  if(i===7){coin(ic,-12,-6,26);coin(ic,14,14,22)}
  place(ic,-150,0,.85,0);
  if(i===1){txt(g,'Value addition',-100,-24,32,{fill:C.ink,cls:'b',maxW:305,min:22});txt(g,'and distribution',-100,10,32,{fill:C.ink,cls:'b',maxW:305,min:22});txt(g,d,-100,48,23,{fill:C.moss,maxW:305,min:17})}else{txt(g,n,-100,-8,34,{fill:C.ink,cls:'b',maxW:305,min:22});txt(g,d,-100,34,23,{fill:C.moss,maxW:305,min:17})}return g});
 const lx=330,rx=1590,ys=[230,410,590,770];
 const pos=fn.map((_,i)=>i<4?[lx,ys[i]]:[rx,ys[i-4]]);
 const wires=pos.map(([x,y],i)=>{const sx=i<4?x+215:x-215,ex=i<4?960-212:960+212;const d=`M${sx} ${y}C${sx+(i<4?90:-90)} ${y} ${ex-(i<4?90:-90)} 470 ${ex} ${470+(y-470)*.3}`;
  return P(svg,d,'none',{stroke:C.sun,'stroke-width':6,'stroke-dasharray':'12 10','stroke-linecap':'round',opacity:0})});
 tiles.forEach((g,i)=>easeIn(sc,g,1+Math.floor(i/2),pos[i][0],pos[i][1],{dx:i<4?-70:70,dy:0,span:.07,r:(i%2?1:-1)*.8}));
 const sum=slip(svg,['what seed exists','who can reach it','what risk she carries'],30,{fill:C.sun,cls:'b',seed:11,maxW:420});
 sc.moves.push(u=>{const p=eo(seg(u,cu(4,5)-.01,cu(4,5)+.08));wires.forEach((w,i)=>vis(w,p*.9));
  const q=eo(seg(u,cu(4,5)+.03,cu(4,6)+.04));vis(sum,q*4);place(sum,960,795-(1-q)*16,1,-1);});
 return sc;}

/* 6. Whose voice is missing? */
function S6(svg){const sc=begin(5),land=farm(svg,'day','#d3c08a');
 const head=ttl(svg,'Whose voice is missing?',960,88,60,{maxW:1100,seed:5});easeIn(sc,head,0,960,88,{dy:-24,span:.08});
 const head2=ttl(svg,'Your turn: three fictional farmers',960,88,56,{maxW:1300,seed:7});vis(head2,0);
 const wr=mk('g',{},svg);[[300,820,1.2],[470,830,1.0]].forEach(([x,y,s],i)=>maize(wr,x,y,s,i*3-2));
 const cast=[
  {x:560,y:845,s:1.55,o:{shirt:C.terra,pants:'#3a4b38',hat:C.ochre},name:'Amina'},
  {x:930,y:845,s:1.5,o:{shirt:C.moss,pants:'#4a3a2b',skin:'#7a4429'},name:'a neighbour'},
  {x:1290,y:845,s:1.5,o:{shirt:C.cream,pants:'#2b3a4a',hat:C.sun,skin:'#8a4f31'},name:'a seed seller'},
  {x:1640,y:845,s:1.5,o:{shirt:'#b2527a',pants:'#3a3a52',skin:'#6f3b24',hold:true},name:'a woman who keeps seed'}];
 const sil={shirt:'#1a2a22',pants:'#1a2a22',skin:'#1a2a22',hair:'#1a2a22'};
 const people=cast.map((c,i)=>{const s=mk('g',{},svg),col=mk('g',{},svg);
  if(i>0){person(s,0,0,1,{...sil,hat:c.o.hat?'#1a2a22':undefined,hold:c.o.hold});}
  person(col,0,0,1,c.o);
  if(i===0){place(s,0,0,1);vis(s,0)}
  const lb=slip(col,c.name,30,{fill:C.cream,cls:'b',seed:30+i,maxW:300});place(lb,0,-300,0);
  return {s,col,lb,c}});
 // the label is placed in the coloured group's local space (above the head), scaled with the person
 people.forEach(({s,col,lb,c},i)=>{place(lb,0,-262,1/c.s*.95,0);
  easeIn(sc,s,0,c.x,c.y,{s:c.s,dy:20,span:.08});
  sc.moves.push(u=>{const p=i===0?eo(seg(u,cu(5,0),cu(5,0)+.08)):eo(seg(u,cu(5,1),cu(5,1)+.07)+0);vis(col,p*4*(i===0?1:1));place(col,c.x,c.y+(1-p)*12,c.s,0);
   if(i>0)vis(s,(1-p)*4*eo(seg(u,cu(5,0),cu(5,0)+.08)));});});
 const coins=[0,1,2].map(i=>{const g=coin(svg,0,0,34);return g});
 sc.moves.push(u=>{coins.forEach((g,i)=>{const p=eo(seg(u,cu(5,2)+i*.01,cu(5,2)+.07+i*.01));vis(g,p*4);place(g,640+i*70,380-(1-p)*26,1,i*9-9)});});
 // three fictional farmers: the invitation
 const info=[['Amina','maize',C.terra],['Joseph','tomato',C.moss],['Neema','beans','#b2527a']];
 const cards=info.map(([n,cr,sh],i)=>{const g=mk('g',{},svg);paper(g,rectD(-185,-260,370,520,70+i,3),C.cream,{dx:7,dy:12,op:.32});P(g,'M-182-260H182V-190H-182Z',C.moss);
  txt(g,'a fictional farmer',0,-214,26,{fill:C.cream,anchor:'middle',cls:'b'});
  person(g,-62,40,1.0,{shirt:sh,pants:'#3a4b38',hat:i===0?C.ochre:undefined,skin:['#8a4f31','#7a4429','#6f3b24'][i]});
  const cg=mk('g',{},g);
  if(i===0)maize(cg,70,80,.6);
  if(i===1){paper(cg,blobD(64,30,38,38,5,12,.04),C.terra,{dx:3,dy:5,op:.25});P(cg,'M64-8L50-26M64-8L82-24','none',{stroke:C.leaf,'stroke-width':6,'stroke-linecap':'round'})}
  if(i===2){[0,1,2].forEach(j=>paper(cg,'M0 0Q36-26 64-4Q40 20 0 0Z',C.leaf,{dx:2,dy:3,op:.2}));cg.querySelectorAll('g').forEach((e,j)=>e.setAttribute('transform',`translate(${40+j*5} ${-10+j*32}) rotate(${-10+j*8})`))}
  if(i!==0)place(cg,0,50,1,0);
  txt(g,n,0,150,44,{fill:C.ink,anchor:'middle',cls:'b'});txt(g,cr,0,205,34,{fill:C.moss,anchor:'middle'});return g});
 const cxs=[480,960,1440];
 sc.moves.push(u=>{const fall=eo(seg(u,cu(5,3)-.01,cu(5,3)+.07));people.forEach(({s,col},i)=>{if(fall>0){vis(col,1-fall);}});coins.forEach(g=>{if(fall>0)vis(g,1-fall)});vis(wr,1-fall);
  cards.forEach((g,i)=>{const p=eo(seg(u,cu(5,3)+.03+i*.03,cu(5,3)+.13+i*.03));vis(g,p*4);place(g,cxs[i],470+(1-p)*80,1,(i-1)*1.5)});
  vis(head,1-fall);vis(head2,eo(seg(u,cu(5,3)+.02,cu(5,3)+.08))*4)});
 return sc;}
