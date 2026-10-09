import {npcFinancialProfile} from './npcEconomy.js';
import {oneNightStand} from './nightlife.js';
export function findCasualProfile(g,gender='Woman',rng=Math.random){
 if(!g.alive||g.age<18||g.jail||(g.realism?.energy??80)<5||!['Woman','Man','Any'].includes(gender))return g;
 const previous={encounters:g.nightlife?.encounters||[],...g.casualEncounters};if(previous.profile?.year===g.year&&!previous.profile.resolved)return g;
 const count=previous.searchYear===g.year?previous.searches||0:0;if(count>=6)return g;
 const actualGender=gender==='Any'?(rng()<.5?'Woman':'Man'):gender;
 const id=`casual-${g.characterId||g.name}-${g.year}-${count}`;
 const names=actualGender==='Woman'?['Amara','Maya','Sofia','Nia','Zara','Lena']:['Kai','Noah','Andre','Jordan','Leo','Theo'];
 const profile={id,avatarSeed:id,year:g.year,name:`${names[Math.floor(rng()*names.length)%names.length]} ${['Morgan','Reed','Patel','Bello','Chen'][Math.floor(rng()*5)%5]}`,gender:actualGender,age:18+Math.floor(rng()*Math.max(8,Math.min(35,g.age-10))),ethnicity:g.ethnicity,alive:true,role:'Friend',closeness:40,looks:35+Math.floor(rng()*66),smarts:30+Math.floor(rng()*71),health:60+Math.floor(rng()*41),happiness:40+Math.floor(rng()*61),occupation:['University student','Designer','Software developer','Nurse','Retail manager','Musician'][Math.floor(rng()*6)%6],personality:['Outgoing','Adventurous','Thoughtful','Funny','Confident'][Math.floor(rng()*5)%5],annualIncome:20000+Math.floor(rng()*60000),mutualInterest:rng()<.85};
 return {...g,casualEncounters:{...previous,profile:npcFinancialProfile(profile,g.country),searchYear:g.year,searches:count+1,lastNotice:null}};
}
export function declineCasualProfile(g){const p=g.casualEncounters?.profile;if(!p||p.resolved||p.year!==g.year)return g;return {...g,casualEncounters:{...g.casualEncounters,profile:{...p,resolved:true},lastNotice:`You declined the encounter with ${p.name}.`}};}
export function acceptCasualProfile(g,protection=true,rng=Math.random){const p=g.casualEncounters?.profile;if(!p||p.resolved)return g;return oneNightStand(g,p.id,protection,rng,'casual');}
