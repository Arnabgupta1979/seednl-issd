const fs=require('fs'),path=require('path');
const root=__dirname,manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
function normal(s){return String(s).trim().replace(/\s+/g,' ')}
function requireValue(v,message){if(!v)throw new Error(message)}
requireValue(typeof manifest.title==='string'&&manifest.title.trim(),'Project title is required');
requireValue(Array.isArray(manifest.scenes)&&manifest.scenes.length>=4&&manifest.scenes.length<=9,'Use 4–9 scenes');
let total=0,start=0;
const rows=manifest.scenes.map((s,i)=>{
 requireValue(typeof s.title==='string'&&s.title.trim(),'Scene '+(i+1)+' needs a title');
 requireValue(typeof s.narration==='string'&&s.narration.trim(),'Scene '+(i+1)+' needs narration');
 requireValue(Number.isFinite(s.duration_seconds)&&s.duration_seconds>=3,'Scene duration must be finite and at least 3 seconds');
 const caps=s.caps||s.narration.match(/[^.!?]+[.!?]+|[^.!?]+$/g).map(s=>s.trim());
 requireValue(Array.isArray(caps)&&caps.length&&caps.every(s=>typeof s==='string'&&s.trim()),'Caption chunks must be nonempty strings');
 requireValue(normal(caps.join(' '))===normal(s.narration),'Caption wording differs from scene '+(i+1)+' narration');
 const row={...s,scene:i+1,start_seconds:start,end_seconds:start+s.duration_seconds,caps};start=row.end_seconds;total+=s.duration_seconds;return row;
});
requireValue(total>=60&&total<=180,'Total duration must be 60–180 seconds; got '+total);
const source=fs.readFileSync(path.join(root,'scenes.js'),'utf8');
rows.forEach((s,i)=>requireValue(new RegExp('function\\s+S'+(i+1)+'\\s*\\(').test(source),'Missing S'+(i+1)+' scene constructor'));
const safeJSON=v=>JSON.stringify(v).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const escapeHTML=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const beats=rows.map((s,i)=>({id:'scene'+(i+1),dur:s.duration_seconds,caps:s.caps}));
const data=`const BEATS=${safeJSON(beats)};BEATS.forEach(b=>{b.chunks=b.caps.map(s=>({s,w:s.split(/\s+/).length}));b.words=b.chunks.reduce((a,c)=>a+c.w,0);b.dur0=b.dur});const LEAD=.4,TAIL=0,N=BEATS.length,LAST=N-1,OPT=-1;`;
let embed='const EMBED=null;';
const mp3=path.join(root,'Narration_recorded.mp3'),tj=path.join(root,'narration_timing.json');
if(fs.existsSync(mp3)&&fs.existsSync(tj)){const t=JSON.parse(fs.readFileSync(tj,'utf8'));embed='const EMBED='+safeJSON({src:'data:audio/mpeg;base64,'+fs.readFileSync(mp3).toString('base64'),dur:t.audio_seconds,bounds:t.bounds,wins:t.wins})+';';}
let html=fs.readFileSync(path.join(root,'player_template.html'),'utf8');
html=html.replace('/*__BEATS__*/',()=>data+embed).replace('/*__SCENES__*/',()=>source).replace('/*__BUILDERS__*/',rows.map((s,i)=>'S'+(i+1)).join(','));
html=html.replaceAll('__PROJECT_TITLE__',escapeHTML(manifest.title)).replaceAll('__ACTIVITY_URL__',escapeHTML(manifest.activity_url||'../G01_Farmer_seed_choices/index.html')).replaceAll('__END_LINE__',escapeHTML(manifest.end_line||manifest.title)).replaceAll('__PREFERENCES_KEY__','paper-cut-'+manifest.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'));
const a=fs.readFileSync(path.join(root,'paper-sans-regular.woff')).toString('base64'),b=fs.readFileSync(path.join(root,'paper-sans-bold.woff')).toString('base64');
html=html.replace('<style>','<style>@font-face{font-family:"Egypt Paper Sans";font-weight:400;font-display:block;src:url(data:font/woff;base64,'+a+')}@font-face{font-family:"Egypt Paper Sans";font-weight:700 900;font-display:block;src:url(data:font/woff;base64,'+b+')}');
requireValue(!/\/\*__(?:BEATS|SCENES|BUILDERS)__\*\//.test(html),'Unexpanded engine marker');
fs.writeFileSync(path.join(root,'Explainer.html'),html);
fs.writeFileSync(path.join(root,'Narration_ElevenLabs.txt'),rows.map(s=>s.narration).join('\n\n')+'\n');
fs.writeFileSync(path.join(root,'Timing_and_illustration_plan.json'),JSON.stringify({status:'Planned timing; verify against actual audio',duration_seconds:total,scenes:rows},null,2));
const stamp=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+(t%60).toFixed(1).padStart(4,'0');
const table=['| Scene | Title | Start | End |','|---|---|---|---|',...rows.map(s=>`| ${s.scene} | ${s.title.replace(/\|/g,'/')} | ${stamp(s.start_seconds)} | ${stamp(s.end_seconds)} |`)].join('\n');
let guide='# '+manifest.title+'\n\nPlanned duration: '+total+' seconds. Timing requires checking against the actual voice file.\n\n'+table+'\n\n';
rows.forEach((s,i)=>{fs.writeFileSync(path.join(root,'Voice_'+String(i+1).padStart(2,'0')+'.txt'),s.narration+'\n');guide+='## '+(i+1)+'. '+s.title+'\n\nNarration: '+s.narration+'\n\nIllustration: '+(s.illustration||'[Complete the illustration script]')+'\n\nMotion: '+(s.relative_animation_cues||'[Complete the motion cues]')+'\n\n';});
guide+='## Music prompt\n\n'+(manifest.music_prompt||'[Write a new content-specific Suno instrumental prompt]')+'\n\n## Sources\n\n'+(manifest.sources||[]).map(x=>typeof x==='string'?x:JSON.stringify(x)).join('\n\n')+'\n';
fs.writeFileSync(path.join(root,'Production_guide.md'),guide);
fs.writeFileSync(path.join(root,'YouTube_and_music.txt'),'YOUTUBE TITLE\n'+(manifest.youtube_title||'[Complete the accurate publishing title]')+'\n\nDESCRIPTION\n'+(manifest.youtube_description||'[Complete description and source links]')+'\n\nSUNO PROMPT\n'+(manifest.music_prompt||'[Complete the content-specific instrumental prompt]')+'\n');
console.log(JSON.stringify({html:path.join(root,'Explainer.html'),scenes:rows.length,duration_seconds:total,words:rows.reduce((a,s)=>a+s.narration.split(/\s+/).length,0)}));
