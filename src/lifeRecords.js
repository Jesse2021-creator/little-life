export function recordAge(record,game){
  if(record?.age!=null&&Number.isFinite(Number(record.age)))return Math.max(0,Number(record.age));
  const dateYear=typeof record?.date==='string'&&/^Year \d+$/.test(record.date)?Number(record.date.slice(5)):null;
  const year=record?.year??dateYear;
  const elapsed=year!=null&&Number.isFinite(Number(year))&&Number.isFinite(Number(game.year))?Number(game.year)-Number(year):0;
  return Math.max(0,(Number(game.age)||0)-elapsed);
}
function ageRecords(records,game,actorId){
  if(!records)return records;
  const next=records.map(entry=>{
    if(!Object.hasOwn(entry,'year')&&entry.age!=null&&Number.isFinite(Number(entry.age))&&Object.hasOwn(entry,'actorId'))return entry;
    const {year,...rest}=entry;
    const owner=Object.hasOwn(entry,'actorId')?entry.actorId:game.generationStartYear!=null&&year!=null&&year<game.generationStartYear?null:actorId;
    return {...rest,age:recordAge(entry,game),actorId:owner};
  });
  return next.some((e,i)=>e!==records[i])?next:records;
}
export function normalizeLifeRecords(game){
  const log=ageRecords(game.log,game,game.characterId||`life-${game.name}-${game.year-game.age}`);let familyTree=game.familyTree;
  if(familyTree){const entries=Object.entries(familyTree).map(([id,person])=>{const history=ageRecords(person.history,{...game,age:person.age??game.age,generationStartYear:undefined},id);return [id,history!==person.history?{...person,history}:person];});if(entries.some(([id,p])=>p!==familyTree[id]))familyTree=Object.fromEntries(entries);}
  if(Object.hasOwn(game,'savedAt')){const {savedAt,...rest}=game;return {...rest,savedAtAge:game.savedAtAge??game.age,log,familyTree};}
  return log===game.log&&familyTree===game.familyTree?game:{...game,log,familyTree};
}
