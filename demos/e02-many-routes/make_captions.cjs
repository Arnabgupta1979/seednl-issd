// Writes Captions_provisional.vtt and Transcript.md from Timing_and_illustration_plan.json.
// Caption times are PROVISIONAL: words are spread across each scene's planned duration
// (same estimate the player uses). Re-time against recorded audio before publishing.
const fs=require('fs'),path=require('path');
const plan=JSON.parse(fs.readFileSync(path.join(__dirname,'Timing_and_illustration_plan.json'),'utf8'));
const ts=t=>{const h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+s.toFixed(3).padStart(6,'0')};
let vtt='WEBVTT\n\nNOTE Provisional timing from the script estimate. No audio has been recorded.\n\n',md='# Many routes to the farmer: transcript\n\nScript only. No recorded narration. Caption times are provisional.\n\n';
for(const s of plan.scenes){
  const lead=s.scene===1?0.4:0.1,a=s.start_seconds+lead,b=s.end_seconds-0.2,words=s.caps.map(c=>c.split(/\s+/).length),tot=words.reduce((x,y)=>x+y,0);
  let n=0;md+='## '+s.scene+'. '+s.title+' ('+ts(s.start_seconds).slice(3,8)+')\n\n'+s.narration+'\n\n';
  s.caps.forEach((c,i)=>{const t0=a+(n/tot)*(b-a);n+=words[i];const t1=a+(n/tot)*(b-a);vtt+=ts(t0)+' --> '+ts(t1)+'\n'+c+'\n\n';});
}
fs.writeFileSync(path.join(__dirname,'Captions_provisional.vtt'),vtt);fs.writeFileSync(path.join(__dirname,'Transcript.md'),md);console.log('captions written');
