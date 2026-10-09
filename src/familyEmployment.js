export const familyRoleSalary=(company,role)=>Math.round(role==='board'?Math.max(12000,Math.min(150000,(company.valuation||0)*.008)):Math.max(30000,Math.min(250000,(company.valuation||0)*.025)));
export const staffId=p=>p.personId||p.childId;
export const familyEmployees=g=>[...(g.children||[]),...(g.partner?[g.partner]:[]),...(g.friends||[])];
export const isSpouse=(g,p)=>p?.id===g.partner?.id&&(g.marriage?.partnerId===p.id||p.maritalStatus==='married'||p.relationshipLabel==='Spouse');
const mapPeople=(g,fn)=>({...g,children:(g.children||[]).map(fn),partner:g.partner?fn(g.partner):g.partner,friends:(g.friends||[]).map(fn)});
export function appointmentReason(g,c,p,role){
 if(!g.alive)return 'This life has ended.';
 if(!c||!(g.companies||[]).some(n=>n.id===c.id))return 'You must own this company.';
 if(!['board','manager'].includes(role))return 'Choose a board or management role.';
 if(!p||p.alive===false||(!(g.children||[]).some(n=>n.id===p.id)&&!isSpouse(g,p)))return 'Choose a living child or your spouse.';
 if(p.age<18)return 'Your child must be at least 18.';
 if(p.familyEmployment&&p.familyEmployment.companyId!==c.id)return 'They already work in another family company. End that appointment first.';
 if(p.familyEmployment?.companyId===c.id&&p.familyEmployment.role===role)return 'They already hold this role.';
 if((c.cash||0)<familyRoleSalary(c,role)/4)return 'The company needs a cash reserve of three months of this role’s salary.';
 return '';
}
export function appointFamilyMember(g,companyId,personId,role){
 const c=(g.companies||[]).find(c=>c.id===companyId),p=familyEmployees(g).find(p=>p.id===personId);const error=appointmentReason(g,c,p,role);if(error)return {game:g,error};
 const salary=familyRoleSalary(c,role),title=role==='board'?'Board director':'Company manager',child=(g.children||[]).some(p=>p.id===personId),identity={personId,...(child?{childId:personId}:{})};
 const employment={companyId,companyName:c.name,role,salary,appointedYear:g.year};
 const updated={...c,familyStaff:[...(c.familyStaff||[]).filter(p=>staffId(p)!==personId),{...identity,name:p.name,role,salary,appointedYear:g.year}],board:[...(c.board||[]).filter(p=>staffId(p)!==personId),...(role==='board'?[{id:`family-${personId}`,...identity,name:p.name,title:'Family board director',equity:0}]:[])]};
 const message=`${p.name} joined ${c.name} as a ${title.toLowerCase()}, earning $${salary.toLocaleString()} per year from company cash. This appointment grants no equity.`;
 return {game:mapPeople({...g,companies:g.companies.map(c=>c.id===companyId?updated:c),log:[{age:g.age,text:message,tag:'Family business',icon:'🏢'},...(g.log||[])]},p=>p.id===personId?{...p,familyEmployment:employment,job:title,personalCareer:title,annualSalary:salary,npcJobGenerated:false}:p),message};
}
export const appointChild=appointFamilyMember;
export function dismissFamilyMember(g,companyId,personId){
 const c=(g.companies||[]).find(c=>c.id===companyId),p=familyEmployees(g).find(p=>p.id===personId);
 if(!g.alive)return {game:g,error:'This life has ended.'};
 if(!c||p?.familyEmployment?.companyId!==companyId)return {game:g,error:'This person does not work in this company.'};
 const message=`${p.name}'s appointment at ${c.name} ended. They can pursue another job.`;
 return {game:mapPeople({...g,companies:g.companies.map(c=>c.id===companyId?{...c,familyStaff:(c.familyStaff||[]).filter(p=>staffId(p)!==personId),board:(c.board||[]).filter(p=>staffId(p)!==personId)}:c),log:[{age:g.age,text:message,tag:'Family business',icon:'🏢'},...(g.log||[])]},p=>p.id===personId?{...p,familyEmployment:null,job:'Seeking employment',personalCareer:null,annualSalary:0,npcJobGenerated:false}:p),message};
}
export const dismissChild=dismissFamilyMember;
export function familyPayroll(c,availableCash,people,year){
 const staff=(c.familyStaff||[]).filter(p=>people.some(n=>n.id===staffId(p)&&n.alive!==false&&n.familyEmployment?.companyId===c.id)),due=staff.reduce((sum,p)=>sum+p.salary,0),paid=Math.min(due,Math.max(0,availableCash)),ratio=due?paid/due:0;
 const payments=staff.map(p=>({...p,paid:Math.floor(p.salary*ratio),year}));
 return {paid:payments.reduce((sum,p)=>sum+p.paid,0),due,payments,arrears:due-payments.reduce((sum,p)=>sum+p.paid,0)};
}
export function reconcileFamilyEmployment(g){
 let changed=false;const next=mapPeople(g,p=>{if(!p.familyEmployment)return p;const c=(g.companies||[]).find(c=>c.id===p.familyEmployment.companyId);if(c&&(c.familyStaff||[]).some(s=>staffId(s)===p.id))return p;changed=true;return {...p,familyEmployment:null,job:'Seeking employment',personalCareer:null,annualSalary:0,npcJobGenerated:false};});
 return changed?next:g;
}
