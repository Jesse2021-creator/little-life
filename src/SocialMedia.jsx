import {fameLevel} from './lifeDepth.js';
import {sponsorship} from './lifeDepth.js';
import {socialOutcome,respondToScandal} from './socialDynamics.js';
import {recordAge} from './lifeRecords.js';
import {useFeedbackNotice} from './OutcomeFeedback.jsx';
import React,{useState} from 'react';
import {PersonPortrait} from './RelationshipPortrait.jsx';
import {formatMoney} from './money.js';

const platforms=[{name:'PhotoShare',icon:'📸',strength:'Photos',rate:.002},{name:'ShortLoop',icon:'🎵',strength:'Short videos',rate:.001},{name:'TownSquare',icon:'💬',strength:'Thoughts',rate:.0015}];
const formats=['Photos','Short videos','Thoughts','Stories'];
const topics=['Lifestyle','Travel','Education','Fitness','Fashion','Politics','Comedy'];
const fmt=n=>new Intl.NumberFormat('en-US',{notation:'compact'}).format(n||0);
export default function SocialMedia({game,setGame}){
 const [selected,setSelected]=useState('PhotoShare');const [text,setText]=useState('');
 const [format,setFormat]=useState('Photos');const [topic,setTopic]=useState('Lifestyle');const [notice,setNotice]=useFeedbackNotice('');
 const account=game.socialAccounts?.[selected];const platform=platforms.find(p=>p.name===selected);
 const update=fn=>setGame(g=>{const previous=g.socialAccounts?.[selected]||{};return {...g,socialAccounts:{...(g.socialAccounts||{}),[selected]:fn(previous,g)}};});
 const create=()=>{if(game.age<13||!game.alive)return;update(()=>({handle:game.name.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,20),followers:0,posts:[],reputation:60,earnings:0,privacy:'Public',verified:false}));setNotice(`Your ${selected} account is ready.`);};
 const publish=()=>{
  if(!account||game.age<13||!game.alive||!text.trim())return;
  if(account.lastPostYear===game.year&&(account.postsThisYear||0)>=6){setNotice('You have posted six times this year. Age up to publish more.');return;}
  if(account.suspended){setNotice('Appeal the account restriction before publishing.');return;}
  const privateAccount=account.privacy==='Private';const outcome=socialOutcome(game,account,topic);const {viral,scandal,hate}=outcome;
  const skill=(game.stats.smarts??50)+(game.skill==='Creativity'?20:0);
  const reach=Math.max(1,Math.round((account.followers*.35+40+Math.random()*600)*(skill/65)*(format===platform.strength?1.6:1)*outcome.reachMultiplier));
  const views=privateAccount?Math.min(account.followers,reach):reach;
  const gained=privateAccount?0:Math.round(views*(.01+Math.random()*.035));
  const controversial=hate;
  const likes=Math.round(views*(.04+Math.random()*.08));const comments=Math.round(views*.012);
  const earnings=game.age>=18&&!privateAccount&&account.followers>=10000&&account.reputation>=40?Math.round(views*platform.rate):0;
  const post={id:`social-${Date.now()}`,text:text.trim(),format,topic,year:game.year,views,likes,comments,viral,hate,scandal,replied:false};
  setGame(g=>{const current=g.socialAccounts?.[selected]||account;return {...g,money:g.money+earnings,lifetimeIncome:(g.lifetimeIncome||0)+earnings,
   socialAccounts:{...g.socialAccounts,[selected]:{...current,followers:Math.max(0,current.followers+gained-Math.round(current.followers*outcome.lossFraction)),posts:[post,...(current.posts||[])].slice(0,50),lastPostYear:g.year,postsThisYear:current.lastPostYear===g.year?(current.postsThisYear||0)+1:1,reputation:Math.max(0,Math.min(100,current.reputation+outcome.reputationDelta)),earnings:(current.earnings||0)+earnings,scandal:scandal?{year:g.year,postId:post.id,resolved:false,topic,description:'A careless post was shared out of context, creating a public controversy.'}:current.scandal,hateReceived:(current.hateReceived||0)+(hate?Math.round(comments*.3):0)}},
   transactions:earnings?[{label:`${selected} ad revenue`,amount:earnings,year:g.year},...(g.transactions||[])]:g.transactions,
   fame:Math.max(0,Math.min(100,(g.fame||0)+outcome.fameDelta)),log:[{year:g.year,age:g.age,text:`You posted on ${selected}: “${post.text}”. ${fmt(views)} views, ${fmt(likes)} likes and ${fmt(gained)} new followers.${controversial?' A debate divided your audience.':''}${earnings?` Earned $${earnings} in ad revenue.`:''}`,tag:'Social media',icon:platform.icon},...(g.log||[])]};});
  setText('');setNotice(scandal?'Your post accidentally created a scandal. Choose how to respond.':hate?'Some comments turned hostile. Take care of your wellbeing.':viral?'Your post went viral!':controversial?'Your post sparked a heated debate.':'Your post is live.');
 };
 const engage=post=>{if(post.replied)return;update(a=>({...a,reputation:Math.min(100,a.reputation+2),followers:a.followers+Math.round(post.comments*.1),posts:a.posts.map(p=>p.id===post.id?{...p,replied:true}:p)}));setNotice('You replied thoughtfully and strengthened your community.');};
 const promote=()=>{if(game.money+(game.bankBalance||0)<500||game.age<18||account.privacy==='Private'||account.lastPromotionYear===game.year)return;
  const followers=50+Math.floor(Math.random()*251);setGame(g=>{const a=g.socialAccounts[selected];const cash=Math.min(g.money,500);return {...g,money:g.money-cash,bankBalance:(g.bankBalance||0)-(500-cash),lifetimeSpending:(g.lifetimeSpending||0)+500,socialAccounts:{...g.socialAccounts,[selected]:{...a,followers:a.followers+followers,lastPromotionYear:g.year}},transactions:[{label:`${selected} promotion`,amount:-500,year:g.year},...(g.transactions||[])],log:[{year:g.year,age:g.age,text:`You spent $500 promoting your ${selected} account and attracted ${followers} followers.`,tag:'Social promotion',icon:'📣'},...(g.log||[])]};});setNotice(`Your campaign brought ${followers} followers.`);};
 return <section className="system-card social-media-card"><small>SOCIAL MEDIA</small><h3>Your online life</h3><p>Build separate audiences, choose your privacy, publish posts, reply to comments, and earn simulated ad revenue.</p><p><b>{fameLevel(game.fame||0)} · Fame {Math.round(game.fame||0)}/100</b><br/>Growing career fame brings new followers to public accounts and your creator channel. Scandals and hostile reactions can still cost followers.</p>
  <div className="social-platform-tabs">{platforms.map(p=><button key={p.name} aria-pressed={selected===p.name} onClick={()=>{setSelected(p.name);setNotice('');}}>{p.icon} {p.name}</button>)}</div>
  {notice&&<div className="system-notice" role="status">{notice}</div>}
  {!account?<button className="system-primary-action" disabled={game.age<13||!game.alive} onClick={create}>{game.age<13?'Create an account at age 13':`Join ${selected}`}</button>:<>
   <div className="social-account-heading"><span className="dating-match-avatar"><PersonPortrait person={game}/></span><div><b>@{account.handle}{account.verified?' ✓':''}</b><small>{fmt(account.followers)} followers · Reputation {account.reputation}% · Earned {formatMoney(account.earnings)}</small></div></div>
   <section className="depth-panel"><h3>Audience & partnerships</h3><p>{fmt(account.hateReceived)} hostile comments received. Public reputation shapes future offers.</p>{account.sponsorOffer&&account.sponsoredYear!==game.year?<><p>{account.sponsorOffer.brand} offers {formatMoney(account.sponsorOffer.fee)} for a disclosed campaign.</p><button onClick={()=>{const out=sponsorship(game,selected);if(!out.error)setGame(out.game);setNotice(out.error||out.message);}}>Deliver sponsorship</button></>:<p>Sponsorship offers arrive each year for public adult accounts with 10,000 followers and 40% reputation.</p>}{account.scandal&&!account.scandal.resolved&&<><h3>Respond to the controversy</h3><p>{account.scandal.description}</p><div className="depth-actions">{[['apologize','Own the mistake & apologize'],['clarify','Clarify the context'],['ignore','Ignore it']].map(([id,label])=><button key={id} onClick={()=>{const out=respondToScandal(game,selected,id);if(!out.error)setGame(out.game);setNotice(out.error||out.message);}}>{label}</button>)}</div></>}</section><div className="social-form-grid"><label>Privacy<select value={account.privacy} onChange={e=>update(a=>({...a,privacy:e.target.value}))}><option>Public</option><option>Private</option></select></label><label>Format<select value={format} onChange={e=>setFormat(e.target.value)}>{formats.map(f=><option key={f}>{f}</option>)}</select></label><label>Topic<select value={topic} onChange={e=>setTopic(e.target.value)}>{topics.map(t=><option key={t}>{t}</option>)}</select></label></div>
   <label className="social-compose">Write your post<textarea maxLength={280} value={text} onChange={e=>setText(e.target.value)} placeholder="What would you like to share?"/></label><small>{text.length}/280 · {account.lastPostYear===game.year?account.postsThisYear:0}/6 posts this year · {platform.strength} perform best here.</small>
   <div className="social-platform-tabs"><button disabled={!text.trim()||!game.alive||account.suspended} onClick={publish}>Publish post</button><button disabled={game.age<18||account.privacy==='Private'||game.money+(game.bankBalance||0)<500||account.lastPromotionYear===game.year} onClick={promote}>Promote · $500</button><button disabled={!game.alive||account.suspended||account.verified||account.followers<25000||account.reputation<70} onClick={()=>{update(a=>({...a,verified:true}));setNotice('Your account was verified.');}}>Request verification</button></div>
   <p>Ad revenue unlocks at 18 with 10,000 followers, a public account, and at least 40% reputation. Verification requires 25,000 followers and 70% reputation.</p>
   {(account.posts||[]).length===0?<div className="system-empty">Publish your first post to start your feed.</div>:(account.posts||[]).slice(0,8).map(post=><article className="social-feed-post" key={post.id}><small>{post.format} · {post.topic} · Age {recordAge(post,game)}{post.viral?' · 🔥 Viral':''}{post.hate?' · Hostile replies':''}{post.scandal?' · Controversy':''}</small><p>{post.text}</p><small>{fmt(post.views)} views · {fmt(post.likes)} likes · {fmt(post.comments)} comments</small><button disabled={post.replied||!game.alive} onClick={()=>engage(post)}>{post.replied?'Replied to community':'Reply to comments'}</button></article>)}
  </>}
 </section>;
}
