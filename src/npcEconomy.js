import {countryBudgets} from './lifeSystems.js';
const hash=value=>[...String(value)].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7);
const baseIncome=country=>Math.max(4000,(countryBudgets[country]?.[0]||8000)*3);
export function wealthLabel(value){return value>=10000000?'Ultra wealthy':value>=1000000?'Wealthy':value>=250000?'Affluent':value>=50000?'Comfortable':value>=10000?'Modest savings':'Limited savings';}
export function npcFinancialProfile(person,country='United States'){
  if(!person||person.role==='Pet')return person;
  country=person.country||country;
  const seed=hash(person.id||person.name);const age=Math.max(0,Number(person.age)||0);
  const wealth=Math.max(0,Number.isFinite(Number(person.personalWealth))?Number(person.personalWealth):Number.isFinite(Number(person.wealth))?Number(person.wealth):age<18?(seed%900):1000+seed%350000);
  let job=person.personalCareer||person.occupation||person.work||person.job;let salary=Number(person.annualSalary??person.salary??person.annualIncome);let generated=Boolean(person.npcJobGenerated);
  if(generated&&!person.personalCareer&&!person.occupation&&!person.work){job=null;salary=NaN;}
  if(age>=18&&/^(Not in school yet|Elementary school student|Middle school student|Secondary school student)$/.test(job||'')){job=null;salary=NaN;}
  if(age<18){job=age<5?'Not in school yet':age<12?'Elementary school student':age<15?'Middle school student':'Secondary school student';salary=0;generated=true;}
  else if(person.familyEmployment){job=person.familyEmployment.role==='board'?'Board director':'Company manager';salary=person.familyEmployment.salary;generated=false;}
  else if(person.alive===false){job=person.job||person.personalCareer||person.occupation||'Not recorded';salary=0;}
  else if(age<22&&person.ownEducationChoice==='University'){job='University student';salary=0;generated=true;}
  else if(age>=67&&(!job||generated||job==='Retired')){job='Retired';salary=Math.round(baseIncome(country)*.4);generated=true;}
  else if(!job){const jobs=wealth>=1000000?['Business owner','Investment director','Company executive']:wealth>=250000?['Company director','Senior engineer','Medical specialist']:wealth>=50000?['Project manager','Teacher','Accountant']:wealth>=10000?['Office administrator','Electrician','Retail supervisor']:['Retail assistant','Delivery driver','Hospitality worker','Seeking employment'];job=jobs[seed%jobs.length];salary=job==='Seeking employment'?0:Math.round(baseIncome(country)*(wealth>=1000000?5:wealth>=250000?3:wealth>=50000?1.8:wealth>=10000?1.2:.8));generated=true;}
  if(!Number.isFinite(salary)||salary<0)salary=Math.round(baseIncome(country));
  if(['University student','Graduate student','Seeking employment','Unemployed'].includes(job))salary=0;
  if(person.country&&person.personalWealth===wealth&&person.job===job&&person.annualSalary===salary&&person.npcJobGenerated===generated)return person;
  return {...person,country:person.country||country,personalWealth:wealth,job,annualSalary:salary,npcJobGenerated:generated};
}
const mapArray=(items,fn)=>{if(!items)return items;const mapped=items.map(fn);return mapped.some((p,i)=>p!==items[i])?mapped:items;};
export function mapNpcs(game,fn){
  const next={...game};let changed=false;
  for(const key of ['children','friends','datingMatches','classmates']){next[key]=mapArray(game[key],fn);changed ||=next[key]!==game[key];}
  if(game.partner){next.partner=fn(game.partner);changed ||=next.partner!==game.partner;}
  for(const key of ['casualEncounters','nightlife']){if(!game[key])continue;const profile=game[key].profile?fn(game[key].profile):game[key].profile;const people=mapArray(game[key].people,fn);if(profile!==game[key].profile||people!==game[key].people){next[key]={...game[key],...(profile?{profile}:{}),...(people?{people}:{})};changed=true;}}
  if(game.family){next.family={...game.family};let familyChanged=false;for(const key of ['parents','siblings','stepParents','memorials']){next.family[key]=mapArray(game.family[key],fn);familyChanged ||=next.family[key]!==game.family[key];}if(!familyChanged)next.family=game.family;changed ||=familyChanged;}
  if(game.familyTree){next.familyTree=Object.fromEntries(Object.entries(game.familyTree).map(([id,p])=>[id,fn(p)]));if(Object.keys(game.familyTree).every(id=>next.familyTree[id]===game.familyTree[id]))next.familyTree=game.familyTree;changed ||=next.familyTree!==game.familyTree;}
  return changed?next:game;
}
export function normalizeNpcEconomy(game){return mapNpcs(game,p=>p.id===game.characterId?p:npcFinancialProfile(p,game.country));}
export function advanceNpcEconomy(game){return mapNpcs(game,raw=>{
  if(raw.id===game.characterId)return raw;
  const p=npcFinancialProfile(raw,game.country);if(p.alive===false||p.age<18||p.financialYear===game.year)return p;
  const employed=p.familyEmployment;
  const company=employed?(game.companies||[]).find(c=>c.id===employed.companyId):null;
  const paid=employed?company?.familyPayrollPayments?.find(entry=>(entry.personId||entry.childId)===p.id)?.paid||0:p.annualSalary;
  const savings=Math.round(paid*.25+p.personalWealth*.015);
  return {...p,personalWealth:Math.max(0,p.personalWealth+savings),financialYear:game.year,lastAnnualIncome:paid};
});}
