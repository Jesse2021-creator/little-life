import {recordAge} from './lifeRecords.js';
import {useFeedbackNotice} from './OutcomeFeedback.jsx';
import {formatMoney} from './money.js';
import React,{useState} from 'react';
import './systems.css';
export const offices=[
 {name:'City Councillor',salary:42000,campaign:8500,term:4,service:0,minAge:18},
 {name:'State Legislator',salary:98000,campaign:42000,term:4,service:2,minAge:21},
 {name:'National Legislator',salary:168000,campaign:125000,term:4,service:3,minAge:25},
 {name:'Governor / Regional Premier',salary:245000,campaign:440000,term:4,service:4,minAge:30},
 {name:'Head of Government',salary:380000,campaign:1800000,term:4,service:7,minAge:35},
];
const fmt=formatMoney;const clamp=n=>Math.max(0,Math.min(100,n));
export default function PoliticalCareer({game,setGame,moneyAvailable,onMoney}){
 const [notice,setNotice]=useFeedbackNotice('');const [race,setRace]=useState(game.politicalOffice||'City Councillor');
 const [party,setParty]=useState(game.politicalParty||'Independent');const [platform,setPlatform]=useState(game.politicalPlatform||'Education');
 const active=!!game.politicalOffice&&game.job===game.politicalOffice;const target=offices.find(o=>o.name===race)||offices[0];const approval=game.publicApproval??48;
 const support=Math.max(.05,Math.min(.9,.12+approval*.004+(game.stats?.smarts??50)*.0018+(game.careerReputation||0)*.002+(game.politicalReadiness||0)*.002-(game.criminalRecord||[]).length*.1));
 const service=game.politicalTotalServiceYears||game.politicalServiceYears||0;const eligible=game.age>=target.minAge&&service>=target.service;
 const campaign=()=>{
  if(!game.alive||!eligible||game.politicalLastCampaignYear===game.year||moneyAvailable<target.campaign)return;
  if(game.job&&!active){setNotice('Leave your current job before campaigning for office.');return;}
  if(game.companies?.length){setNotice('Sell your business interests before running to resolve conflicts of interest.');return;}
  if(active&&game.year<game.politicalTermEnds){setNotice('Complete your current term before seeking a new mandate.');return;}
  onMoney(-target.campaign,`${target.name} campaign`);const won=Math.random()<support;
  setGame(g=>({...g,politicalParty:party,politicalPlatform:platform,politicalLastCampaignYear:g.year,politicalCampaigns:(g.politicalCampaigns||0)+1,politicalReadiness:0,
   politicalHistory:[{year:g.year,office:target.name,party,platform,won,cost:target.campaign},...(g.politicalHistory||[])],
   ...(won?{politicalOffice:target.name,politicalTermEnds:g.year+target.term,politicalServiceYears:0,job:target.name,salary:target.salary,career:'Public service & politics',careerYears:0}:{}),publicApproval:clamp((g.publicApproval??48)+(won?5:-5)),
   log:[{year:g.year,age:g.age,text:`You ran for ${target.name} as ${party} on an ${platform.toLowerCase()} platform. ${won?`You won a ${target.term}-year mandate.`:'Voters elected your opponent.'}`,tag:won?'Elected':'Election result',icon:'🗳️'},...(g.log||[])]}));
  setNotice(won?`Elected ${target.name}. Your term ends in year ${game.year+target.term}.`:'You lost the election. Build support before trying again.');
 };
 const action=kind=>{
  if(game.politicalActionYear===game.year||!game.alive)return;
  const choices={volunteer:[100,3,10,'You volunteered on a local civic project and met residents.'],debate:[1200,2,15,'You prepared for a public debate and explained your platform.'],townhall:[450,6,0,'You held a town hall and recorded constituent concerns.'],disclose:[250,5,0,'You published financial disclosures and meetings records.'],policy:[1800,7,0,`You negotiated a ${platform.toLowerCase()} bill with colleagues.`],budget:[600,4,0,'You reviewed the public budget and prioritized essential services.']};
  const [cost,trust,ready,text]=choices[kind];if(moneyAvailable<cost){setNotice(`Requires ${fmt(cost)}.`);return;}
  onMoney(-cost,'Political outreach and administration');const passed=kind!=='policy'||Math.random()<.3+(game.stats.smarts??50)*.003+(game.politicalCoalition??40)*.003;
  setGame(g=>({...g,politicalActionYear:g.year,politicalReadiness:clamp((g.politicalReadiness||0)+ready),publicApproval:clamp((g.publicApproval??48)+(passed?trust:-3)),politicalCoalition:clamp((g.politicalCoalition??40)+(kind==='policy'?4:1)),politicalBillsPassed:(g.politicalBillsPassed||0)+(kind==='policy'&&passed?1:0),politicalPlatform:platform,
   log:[{year:g.year,age:g.age,text:text+(kind==='policy'?(passed?' The legislature passed your proposal.':' The proposal failed to secure a majority.') :''),tag:'Public service',icon:'🏛️'},...(g.log||[])]}));setNotice(passed?'Your work improved public trust.':'The bill failed. Build a coalition before the next vote.');
 };
 return <div className="game-system-screen politics-screen"><div className="system-hero"><span>🏛️</span><div><small>PUBLIC SERVICE</small><h2>Politics & Government</h2><p>A fictional political career with campaigns, eligibility, public trust, legislation, and fixed terms.</p></div></div>
  <section className="system-card"><h3>{active?game.politicalOffice:'Your political profile'}</h3><div className="political-facts"><span>Approval <b>{approval}%</b></span><span>Service <b>{service} years</b></span><span>Bills passed <b>{game.politicalBillsPassed||0}</b></span><span>Coalition <b>{game.politicalCoalition??40}%</b></span>{active&&<span>Term remaining <b>{Math.max(0,game.politicalTermEnds-game.year)} years</b></span>}</div>
  {notice&&<div className="system-notice" role="status">{notice}</div>}
  <div className="social-form-grid"><label>Party<select value={party} onChange={e=>setParty(e.target.value)}>{['Independent','Progressive Alliance','Conservative Union','Green Movement','Social Democratic Party'].map(p=><option key={p}>{p}</option>)}</select></label><label>Platform<select value={platform} onChange={e=>setPlatform(e.target.value)}>{['Education','Healthcare','Jobs and economy','Housing','Environment','Public safety'].map(p=><option key={p}>{p}</option>)}</select></label></div>
  <div className="political-actions">{(active?[['townhall','Town hall',450],['policy','Introduce policy',1800],['budget','Review budget',600],['disclose','Publish disclosures',250]]:[['volunteer','Civic volunteering',100],['debate','Prepare for debate',1200]]).map(([id,label,cost])=><button key={id} disabled={!game.alive||game.age<18||game.politicalActionYear===game.year} onClick={()=>action(id)}><b>{label}</b><small>{fmt(cost)} · Once per year</small></button>)}</div>
  {(!active||game.year>=game.politicalTermEnds)&&<><label className="social-compose">Select office<select value={race} onChange={e=>setRace(e.target.value)}>{offices.map(o=><option key={o.name}>{o.name}</option>)}</select></label><p>Budget {fmt(target.campaign)} · Estimated win chance {Math.round(support*100)}% · Minimum age {target.minAge} · {target.service} service years required.</p><button className="system-primary-action" disabled={!game.alive||!eligible||moneyAvailable<target.campaign||game.politicalLastCampaignYear===game.year} onClick={campaign}>Run for {target.name}</button></>}
  </section><section className="system-card"><h3>Path to national leadership</h3>{offices.map((o,i)=><article className="political-office-row" key={o.name}><span>{i+1}</span><div><b>{o.name}</b><small>Age {o.minAge}+ · {o.service} service years · {o.term}-year term</small></div><strong>{fmt(o.salary)}<small>/ year</small></strong></article>)}</section>
  <section className="system-card"><h3>Election history</h3>{(game.politicalHistory||[]).length?(game.politicalHistory||[]).slice(0,10).map((r,i)=><p key={i}>Age {recordAge(r,game)} · {r.office} · {r.party} · {r.won?'Elected':'Lost'} · Spent {fmt(r.cost)}</p>):<p>You have not contested an election yet.</p>}</section>
 </div>;
}
