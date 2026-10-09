export const salaryLimit=company=>Math.max(0,Math.floor((Number(company.valuation)||0)*.05));
export const suggestedSalary=company=>Math.floor((Number(company.valuation)||0)*.015);
export function companyCeoSalary(game,company){
 if(game.job!=='Founder & CEO')return 0;
 if(company.ceoSalary!=null)return Math.max(0,Number(company.ceoSalary)||0);
 const legacy=(game.companies||[]).find(c=>c.ceoSalary==null);
 return legacy?.id===company.id?Math.max(0,(Number(game.salary)||0)-(game.companies||[]).reduce((sum,c)=>sum+(Number(c.ceoSalary)||0),0)):0;
}
export function salaryReason(game,company,amount){
 if(!game.alive)return 'This life has ended.';
 if(game.age<18)return 'Executive appointments start at age 18.';
 if(!company||(game.companies||[]).every(c=>c.id!==company.id))return 'You must own this company.';
 if(company.successionDisputed)return 'Resolve the inheritance dispute before changing executive pay.';
 if(game.job&&game.job!=='Founder & CEO')return 'Leave your current job before taking a paid CEO role.';
 if(!Number.isFinite(amount)||amount<0||!Number.isInteger(amount))return 'Enter a whole annual salary of zero or more.';
 if(amount>salaryLimit(company))return 'The annual salary cannot exceed 5% of company value.';
 if((company.cash||0)<amount/4)return 'The company needs three months of salary in cash reserves.';
 if((company.ownership||0)<80&&company.lastBoardReviewYear===game.year)return 'The board has already reviewed compensation this year.';
 return '';
}
export function setCompanySalary(game,companyId,amount,random=Math.random){
 const company=(game.companies||[]).find(c=>c.id===companyId);amount=Number(amount);
 const error=salaryReason(game,company,amount);if(error)return {game,error};
 const reviewed=(company.ownership||0)<80;
 const directors=(company.board||[]).filter(d=>d.id!=='founder'&&!d.childId&&!d.personId&&!String(d.id||'').startsWith('family-'));
 const yesVotes=reviewed?directors.filter(d=>(company.performance||0)>=(d.approvalThreshold??62)&&amount<=Math.max(0,company.cash||0)&&random()<Math.max(.2,.85-amount/Math.max(1,company.valuation||0)*5)).length:0;
 const approved=!reviewed||(directors.length>0&&yesVotes>directors.length/2);
 const review={amount,approved,reviewed,yesVotes,totalVotes:directors.length,age:game.age};
 const companies=game.companies.map(c=>({...c,ceoSalary:companyCeoSalary(game,c),...(c.id===companyId?{ceoSalary:approved?amount:companyCeoSalary(game,c),...(approved?{professionalManagerSalary:0,board:(c.board||[]).map(d=>d.id==='founder'?{...d,title:'Founder & CEO'}:d)}:{}),salaryReview:review,...(reviewed?{lastBoardReviewYear:game.year}:{})}:{})}));
 const message=approved?`${company.name}: your annual CEO salary is now $${amount.toLocaleString()}. ${reviewed?`The independent board approved it (${yesVotes}/${directors.length} votes).`:'Your ownership of at least 80% allows you to approve it.'}`:`${company.name}: the board declined your $${amount.toLocaleString()} salary proposal (${yesVotes}/${directors.length} votes). Your current salary remains unchanged.`;
 return {game:{...game,companies,...(approved?{job:'Founder & CEO',career:'Business owner',salary:companies.reduce((sum,c)=>sum+c.ceoSalary,0)}:{}),log:[{age:game.age,text:message,tag:'CEO compensation',icon:'🏢'},...(game.log||[])]},message,approved};
}
