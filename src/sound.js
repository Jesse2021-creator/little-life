let musicVolume=.8;
let effectsVolume=.85;
let musicPlaying=false;
export function setAudioVolumes(music,effects){musicVolume=Math.max(0,Math.min(1,Number(music)||0));effectsVolume=Math.max(0,Math.min(1,Number(effects)||0));if(audioContext&&musicMaster)musicMaster.gain.setTargetAtTime(musicPlaying?musicVolume*2:0,audioContext.currentTime,.05);}
let audioContext;
let musicMaster;
let musicTimer;
let step=0;
const melody=[261.63,329.63,392,329.63,293.66,392,440,392,261.63,329.63,392,523.25,440,392,329.63,293.66];
const bass=[130.81,110,123.47,98];
function getContext(){const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return null;if(!audioContext)audioContext=new AudioContextClass();return audioContext;}
function playPluck(frequency,volume=.025,duration=.42,type='sine'){const ctx=getContext();if(!ctx)return;const now=ctx.currentTime;const oscillator=ctx.createOscillator();const envelope=ctx.createGain();const lowpass=ctx.createBiquadFilter();oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,now);lowpass.type='lowpass';lowpass.frequency.value=1800;envelope.gain.setValueAtTime(.0001,now);envelope.gain.linearRampToValueAtTime(volume,now+.012);envelope.gain.exponentialRampToValueAtTime(.0001,now+duration);oscillator.connect(lowpass);lowpass.connect(envelope);envelope.connect(musicMaster||ctx.destination);oscillator.start(now);oscillator.stop(now+duration+.02);}
export function startAmbientMusic(){try{const ctx=getContext();if(!ctx)return;ctx.resume();if(!musicMaster){musicMaster=ctx.createGain();musicMaster.gain.value=0;musicMaster.connect(ctx.destination);}musicMaster.gain.cancelScheduledValues(ctx.currentTime);musicPlaying=true;musicMaster.gain.setTargetAtTime(musicVolume*2,ctx.currentTime,.15);if(musicTimer)return;step=0;const playStep=()=>{const index=step%melody.length;const accent=index===0||index===8;playPluck(melody[index],accent?.035:.023,accent?.58:.4,'sine');if(index===0||index===8)playPluck(bass[Math.floor(step/8)%bass.length],.012,.85,'triangle');step++;};playStep();musicTimer=window.setInterval(playStep,390);}catch{}}
export function stopAmbientMusic(){musicPlaying=false;try{if(musicTimer){window.clearInterval(musicTimer);musicTimer=undefined;}if(audioContext&&musicMaster)musicMaster.gain.setTargetAtTime(0,audioContext.currentTime,.12);}catch{}}
export function playUiClick(){try{const ctx=getContext();if(!ctx)return;ctx.resume();const now=ctx.currentTime;const oscillator=ctx.createOscillator();const gain=ctx.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(760,now);oscillator.frequency.exponentialRampToValueAtTime(570,now+.045);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(Math.max(.0001,.16*effectsVolume),now+.006);gain.gain.exponentialRampToValueAtTime(.0001,now+.06);oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start(now);oscillator.stop(now+.065);}catch{}}
