import React,{createContext,useContext,useState,useEffect,useRef,useCallback} from 'react';
import {formatMoney} from './money.js';
import {normalizeLifeRecords} from './lifeRecords.js';
const Feedback=createContext(()=>{});
const DialogState=createContext({messages:null,onClose:()=>{}});
export const existingPopupSelector='.dialog-backdrop, .career-scrim, .investment-sale-backdrop, [role="dialog"]:not(.outcome-dialog)';
export function hasExistingPopup(root){return Boolean(root?.querySelector(existingPopupSelector));}
export function outcomeChanges(before,after){
  if(!before||before.name!==after.name)return [];
  before=normalizeLifeRecords(before);after=normalizeLifeRecords(after);
  const old=new Map();const signature=e=>`${e.age}|${e.text}`;
  for(const entry of before.log||[])old.set(signature(entry),(old.get(signature(entry))||0)+1);
  const messages=[];const seen=new Map();
  for(const entry of after.log||[]){const key=signature(entry);seen.set(key,(seen.get(key)||0)+1);if(seen.get(key)>(old.get(key)||0))messages.push(entry.text);}
  messages.reverse();
  for(const key of Object.keys(after.stats||{})){const delta=(after.stats[key]||0)-(before.stats?.[key]||0);if(delta)messages.push(`${key[0].toUpperCase()+key.slice(1)}: ${delta>0?'+':''}${delta}`);}
  for(const [key,label] of [['money','Cash'],['bankBalance','Bank balance']]){const delta=(after[key]||0)-(before[key]||0);if(delta)messages.push(`${label}: ${delta>0?'+':'−'}${formatMoney(Math.abs(delta))}`);}
  for(const key of Object.keys(after.skills||{})){const delta=after.skills[key]-(before.skills?.[key]??after.skills[key]);if(Number.isFinite(delta)&&delta)messages.push(`${key}: ${delta>0?'+':''}${delta}`);}
  for(const key of ['nightlife','casualEncounters','realism']){if(after[key]?.lastNotice&&after[key].lastNotice!==before[key]?.lastNotice)messages.push(after[key].lastNotice);}
  return messages;
}
export function FeedbackProvider({children}){
  const [outcome,setOutcome]=useState(null);const pending=useRef([]);const timer=useRef();const claimedUntil=useRef(0);
  const notify=useCallback((message,existingPopup=false)=>{
    if(existingPopup){claimedUntil.current=Date.now()+350;pending.current=[];clearTimeout(timer.current);return;}
    if(!message||(Array.isArray(message)&&!message.length)||Date.now()<claimedUntil.current)return;
    pending.current.push(...(Array.isArray(message)?message:[message]));clearTimeout(timer.current);
    timer.current=setTimeout(()=>{const messages=[...new Set(pending.current)];pending.current=[];if(Date.now()<claimedUntil.current||hasExistingPopup(document))return;setOutcome(current=>current?[...new Set([...current,...messages])]:messages);},120);
  },[]);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  useEffect(()=>{const observer=new MutationObserver(()=>{if(hasExistingPopup(document)){pending.current=[];clearTimeout(timer.current);setOutcome(null);}});observer.observe(document.body,{childList:true,subtree:true});return ()=>observer.disconnect();},[]);
  return <Feedback.Provider value={notify}><DialogState.Provider value={{messages:outcome,onClose:()=>setOutcome(null)}}>{children}</DialogState.Provider></Feedback.Provider>;
}
export function GameOutcomeDialog(){const props=useContext(DialogState);return <OutcomeDialog {...props}/>;}
export function useFeedbackNotice(initial='',existingPopup=false){
  const [value,setValue]=useState(initial);const notify=useContext(Feedback);
  const update=useCallback(next=>{setValue(previous=>typeof next==='function'?next(previous):next);if(typeof next==='string'&&next)notify(next,existingPopup);},[notify,existingPopup]);
  return [value,update];
}
export function useGameOutcomes(game,enabled,suppress){const previous=useRef(normalizeLifeRecords(game));const notify=useContext(Feedback);useEffect(()=>{const current=normalizeLifeRecords(game);if(enabled&&!suppress?.current)notify(outcomeChanges(previous.current,current));if(suppress)suppress.current=false;previous.current=current;},[game,enabled,notify]);}
export function OutcomeDialog({messages,onClose}){
  const ref=useRef();useEffect(()=>{if(!messages)return;const active=document.activeElement;ref.current?.focus();return ()=>{if(active?.isConnected)active.focus();};},[Boolean(messages)]);
  if(!messages?.length)return null;
  return <div className="outcome-backdrop"><section className="outcome-dialog" role="dialog" aria-modal="true" aria-labelledby="outcome-title" onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();onClose();}if(e.key==='Tab'){e.preventDefault();ref.current?.focus();}}}><span className="outcome-icon">✦</span><h2 id="outcome-title">What happened</h2><div className="outcome-messages">{messages.map((message,index)=><p key={index}>{message}</p>)}</div><button ref={ref} onClick={onClose}>Continue</button></section></div>;
}
