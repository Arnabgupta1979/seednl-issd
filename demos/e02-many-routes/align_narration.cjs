// Aligns the recorded narration (Narration_recorded.mp3) to the scenes using word timestamps
// (narration_words.json = [[start,end,word],...] from a local speech-to-text pass).
// Writes narration_timing.json and sets each scene's duration_seconds in manifest.json.
// Usage: node align_narration.cjs <audio_duration_seconds>   then: node build.cjs && node make_captions.cjs
const fs=require('fs'),path=require('path');
const dur=parseFloat(process.argv[2]);if(!(dur>0))throw new Error('Pass the audio duration in seconds');
const LEAD=.4,TAIL_AFTER=.3;
const mpath=path.join(__dirname,'manifest.json'),manifest=JSON.parse(fs.readFileSync(mpath,'utf8'));
const words=JSON.parse(fs.readFileSync(path.join(__dirname,'narration_words.json'),'utf8'));
const counts=manifest.scenes.map(s=>s.narration.trim().split(/\s+/).length);
const total=counts.reduce((a,b)=>a+b,0);
if(total!==words.length)throw new Error('Word count mismatch: script '+total+' vs recording '+words.length);
let idx=0;const wins=[],chunkTimes=[];
manifest.scenes.forEach((s,i)=>{
  const a=idx,b=idx+counts[i]-1;idx+=counts[i];
  wins.push([words[a][0],words[b][1]]);
  const caps=s.caps||s.narration.match(/[^.!?]+[.!?]+|[^.!?]+$/g).map(x=>x.trim());
  let k=a;const ct=[];
  caps.forEach(c=>{const n=c.split(/\s+/).length;ct.push([words[k][0],words[k+n-1][1]]);k+=n});
  chunkTimes.push(ct);
});
const bounds=[];for(let n=1;n<wins.length;n++)bounds.push(+((wins[n-1][1]+wins[n][0])/2).toFixed(3));
const sceneSeconds=wins.map((w,n)=>{const s=n===0?-LEAD:bounds[n-1],e=n===wins.length-1?dur+TAIL_AFTER:bounds[n];return +(e-s).toFixed(2)});
const localWins=wins.map((w,n)=>{const s=n===0?-LEAD:bounds[n-1];return [+(w[0]-s).toFixed(2),+(w[1]-s).toFixed(2)]});
fs.writeFileSync(path.join(__dirname,'narration_timing.json'),JSON.stringify({audio:'Narration_recorded.mp3',audio_seconds:dur,lead:LEAD,bounds,wins:wins.map(w=>w.map(x=>+x.toFixed(3))),local_windows:localWins,scene_seconds:sceneSeconds,caption_times:chunkTimes},null,1));
manifest.scenes.forEach((s,i)=>{s.duration_seconds=sceneSeconds[i]});
fs.writeFileSync(mpath,JSON.stringify(manifest,null,2)+'\n');
console.log('scene seconds',sceneSeconds.join(', '),'total',sceneSeconds.reduce((a,b)=>a+b,0).toFixed(2));
