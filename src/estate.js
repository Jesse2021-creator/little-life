export function willRecipients(game){
 const people=[...(game.children||[]),...(game.partner?[game.partner]:[]),...(game.family?.parents||[]),...(game.family?.siblings||[]),...(game.friends||[])].filter(p=>p.alive!==false);
 return [...new Map(people.map(p=>[p.id,{id:p.id,name:p.name,age:p.age,role:p.role||'Family'}])).values(),{id:'charity',name:'Community charity fund',role:'Charity'}];
}
export function defaultWill(game){
 const children=(game.children||[]).filter(p=>p.alive!==false);const recipients=children.length?children:[{id:'charity',name:'Community charity fund'}];
 const base=Math.floor(100/recipients.length);
 return {beneficiaries:recipients.map((p,i)=>({id:p.id,name:p.name,percent:base+(i===0?100-base*recipients.length:0)})),executor:'',guardian:'',message:''};
}
export function validateWill(will,game){
 if(game.age<18||!game.alive)return 'You must be at least 18 and living to write your will.';
 const beneficiaries=will.beneficiaries||[];const eligible=new Set(willRecipients(game).map(p=>p.id));
 if(!beneficiaries.length)return 'Choose at least one beneficiary.';
 if(new Set(beneficiaries.map(p=>p.id)).size!==beneficiaries.length)return 'Each beneficiary can appear only once.';
 if(beneficiaries.some(p=>!eligible.has(p.id)||!Number.isFinite(Number(p.percent))||Number(p.percent)<=0||Number(p.percent)>100))return 'Use living beneficiaries and shares between 1% and 100%.';
 if(Math.abs(beneficiaries.reduce((sum,p)=>sum+Number(p.percent),0)-100)>.001)return 'Your beneficiary shares must total 100%.';
 return '';
}
export function inheritEstate(game,child,netWorth){
 if(!game.will)return {};
 const share=Number(game.will.beneficiaries?.find(p=>p.id===child.id)?.percent)||0;
 return {money:0,bankBalance:Math.max(0,Math.floor(netWorth*share/100)),assets:[],investments:null,forex:null,companies:[],loans:[],livingArrangement:null,will:null,inheritanceReceived:Math.max(0,Math.floor(netWorth*share/100))};
}
