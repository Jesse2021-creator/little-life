import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {readFileSync} from 'node:fs';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {outcomeChanges,OutcomeDialog}=await server.ssrLoadModule('/src/OutcomeFeedback.jsx');
 const before={name:'Alex',money:500,bankBalance:100,stats:{health:80},skills:{cooking:20},log:[{year:2026,age:20,text:'Earlier'}]};
 const after={...before,money:450,stats:{health:85},skills:{cooking:23},log:[{year:2026,age:20,text:'Treatment succeeded'},...before.log]};
 assert.deepEqual(outcomeChanges(before,before),[]);
 assert.ok(outcomeChanges(before,{...before,log:[before.log[0],...before.log]}).includes('Earlier'));
 const messages=outcomeChanges(before,after);assert.ok(messages.includes('Treatment succeeded'));assert.ok(messages.includes('Health: +5'));assert.ok(messages.includes('cooking: +3'));assert.ok(messages.some(s=>s.includes('Cash:')));
 assert.deepEqual(outcomeChanges(before,{...after,name:'Other'}),[]);
 assert.ok(outcomeChanges(before,{...before,casualEncounters:{lastNotice:'They declined.'}}).includes('They declined.'));
 const html=renderToStaticMarkup(React.createElement(OutcomeDialog,{messages,onClose:()=>{}}));assert.ok(html.includes('aria-modal="true"'));assert.ok(html.includes('Treatment succeeded'));assert.ok(html.includes('Continue'));
 await server.ssrLoadModule('/src/App.jsx');
 const app=readFileSync('src/App.jsx','utf8');for(const label of ['Start New Life','Load Life','Current autosave','Music volume','Sound effects volume'])assert.ok(app.includes(label));
 const gains=[];const param=()=>({value:0,setTargetAtTime(v){gains.push(v)},cancelScheduledValues(){},setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(v){gains.push(v)}});
 globalThis.window={AudioContext:class {currentTime=0;destination={};resume(){}createGain(){return {gain:param(),connect(){}}}createOscillator(){return {frequency:param(),connect(){},start(){},stop(){}}}createBiquadFilter(){return {frequency:{},connect(){}}}},setInterval:()=>1,clearInterval:()=>{}};
 const audio=await import('./src/sound.js');audio.setAudioVolumes(.8,.85);audio.startAmbientMusic();assert.ok(gains.includes(1.6));audio.setAudioVolumes(.5,.4);assert.equal(gains.at(-1),1);audio.stopAmbientMusic();audio.setAudioVolumes(1,1);assert.equal(gains.at(-1),0);audio.playUiClick();assert.ok(gains.includes(.16));audio.setAudioVolumes(0,0);audio.playUiClick();assert.ok(gains.includes(.0001));
}finally{await server.close();}
console.log('PASS: outcome summaries, dialog rendering, startup/load routes, and live audio volume/mute behavior.');
