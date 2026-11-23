// Writes Captions.vtt and Transcript.md.
// If narration_timing.json exists, caption times come from the recorded audio's word timestamps
// (video timeline = audio time + lead). Otherwise they are a provisional script estimate.
const fs=require('fs'),path=require('path');
const plan=JSON.parse(fs.readFileSync(path.join(__dirname,'Timing_and_illustration_plan.json'),'utf8'));
const tp=path.join(__dirname,'narration_timing.json'),timing=fs.existsSync(tp)?JSON.parse(fs.readFileSync(tp,'utf8')):null;
const ts=t=>{const h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+s.toFixed(3).padStart(6,'0')};
let vtt='WEBVTT\n\n'+(timing?'NOTE Timed from word timestamps of Narration_recorded.mp3 (video time = audio time + '+timing.lead+' s). Check by ear before release.\n\n':'NOTE Provisional timing from the script estimate. No audio was recorded.\n\n');
let md='# Many routes to the farmer: transcript\n\n'+(timing?'Recorded narration: Narration_recorded.mp3 (about '+Math.round(timing.audio_seconds)+' s). Caption times follow the recording.\n\n':'Script only. No recorded narration. Caption times are provisional.\n\n');
for(const s of plan.scenes){
  md+='## '+s.scene+'. '+s.title+' ('+ts(s.start_seconds).slice(3,8)+')\n\n'+s.narration+'\n\n';
  if(timing){
    s.caps.forEach((c,i)=>{const [a,b]=timing.caption_times[s.scene-1][i];vtt+=ts(a+timing.lead)+' --> '+ts(b+timing.lead+0.15)+'\n'+c+'\n\n'});
  }else{
    const lead=s.scene===1?0.4:0.1,a=s.start_seconds+lead,b=s.end_seconds-0.2,words=s.caps.map(c=>c.split(/\s+/).length),tot=words.reduce((x,y)=>x+y,0);let n=0;
    s.caps.forEach((c,i)=>{const t0=a+(n/tot)*(b-a);n+=words[i];const t1=a+(n/tot)*(b-a);vtt+=ts(t0)+' --> '+ts(t1)+'\n'+c+'\n\n'});
  }
}
fs.writeFileSync(path.join(__dirname,'Captions.vtt'),vtt);fs.writeFileSync(path.join(__dirname,'Transcript.md'),md);
try{fs.unlinkSync(path.join(__dirname,'Captions_provisional.vtt'))}catch(e){}
console.log('captions written ('+(timing?'from recording':'provisional')+')');
