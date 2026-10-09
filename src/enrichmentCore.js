export const clamp=n=>Math.max(0,Math.min(100,n));
export const enrichmentState=g=>({housing:{neighbourhood:'Balanced',transport:'Transit',roommate:null},childhood:{curfew:20,strictness:55,allowance:10,chores:0,focus:'Science'},sports:null,ambition:null,...g.enrichment});
export const enrich=(g,key,value)=>({...g,enrichment:{...enrichmentState(g),[key]:value}});
export const note=(g,text,tag='Life experience',icon='✨')=>({...g,log:[{age:g.age,year:g.year,text,tag,icon},...(g.log||[])]});
export const success=(g,message,tag,icon)=>({game:note(g,message,tag,icon),message});
export const failure=(g,error)=>({game:g,error});
export const credit=(g,amount,label)=>({...g,money:(g.money||0)+amount,lifetimeIncome:(g.lifetimeIncome||0)+Math.max(0,amount),transactions:[{age:g.age,year:g.year,label,amount},...(g.transactions||[])]});
export const hash=s=>[...String(s)].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7);
