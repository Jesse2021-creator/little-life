import {startCustodyCase} from './custody.js';
import {forexEquity} from './forex.js';
import {instrumentPrice} from './investments.js';
import {inheritEstate} from './estate.js';
import {formatMoney} from './money.js';

export const funds=g=>Math.max(0,g.money||0)+Math.max(0,g.bankBalance||0);
const clamp=n=>Math.max(0,Math.min(100,n));
const log=(g,text,tag,icon)=>({...g,log:[{year:g.year,age:g.age,text,tag,icon},...(g.log||[])]});
export function spend(g,amount,label){
 amount=Math.max(0,Math.round(amount));if(funds(g)<amount)return null;
 const cash=Math.min(Math.max(0,g.money||0),amount);
 return {...g,money:(g.money||0)-cash,bankBalance:(g.bankBalance||0)-(amount-cash),lifetimeSpending:(g.lifetimeSpending||0)+amount,transactions:[{label,amount:-amount,year:g.year},...(g.transactions||[])]};
}
function income(g,amount,label){
 amount=Math.max(0,Math.round(amount));return {...g,bankBalance:(g.bankBalance||0)+amount,lifetimeIncome:(g.lifetimeIncome||0)+amount,transactions:[{label,amount,year:g.year},...(g.transactions||[])]};
}
export function companyEquity(c){return Math.max(0,Math.round((c.valuation||0)*(c.ownership??100)/100));}
export function planningNetWorth(g){
 const assets=(g.assets||[]).filter(a=>a.status==='owned').reduce((s,a)=>s+Math.max(0,Math.round((a.value||0)*(a.condition??100)/100)),0);
 const investments=(g.investments?.holdings||[]).reduce((s,p)=>s+p.units*instrumentPrice(g.investments,p.assetId),0);
 return funds(g)+forexEquity(g)+(g.worldLife?.inheritance?.held||0)-(g.childSupportOrders||[]).reduce((n,o)=>n+(o.arrears||0),0)-(g.realism?.housingArrears||0)-(g.realism?.careArrears||0)-(g.economyArrears||0)+assets+investments+(g.companies||[]).reduce((s,c)=>s+companyEquity(c),0)+(g.pension?.balance||0)-(g.loans||[]).reduce((s,l)=>s+(l.balance||0),0)-(g.divorceObligations||[]).reduce((s,o)=>s+(o.arrears||0),0);
}

export function marry(g,{prenup=false,weddingCost=2500,spouseShare=50}={}){
 if(!g.alive||g.age<18||!g.partner||g.partner.age<18||g.marriage)return {error:'Marriage requires two adults who are currently dating.'};
 if(![2500,10000,50000].includes(Number(weddingCost))||![30,50,70].includes(Number(spouseShare)))return {error:'Choose a wedding and a valid agreement.'};
 const legalFee=prenup?1500:0;const paid=spend(g,Number(weddingCost)+legalFee,'Wedding and marriage agreement');
 if(!paid)return {error:'Save enough for the wedding and legal costs first.'};
 const spouseWealth=Math.max(0,g.partner.personalWealth||0);const married={...paid,bankBalance:(paid.bankBalance||0)+(prenup?0:spouseWealth),partner:{...g.partner,maritalStatus:'married',relationshipLabel:'Spouse',personalWealth:prenup?spouseWealth:0},relationship:`Married to ${g.partner.name}`,marriage:{partnerId:g.partner.id,year:g.year,prenup,protectedWealth:Math.max(0,planningNetWorth(paid)),spouseSeparateWealth:prenup?spouseWealth:0,spouseShare:Number(spouseShare),spouseIncome:g.partner.salary||g.partner.personalIncome||30000}};
 if(!prenup&&spouseWealth)married.transactions=[{label:'Spouse savings pooled at marriage',amount:spouseWealth,year:g.year},...(married.transactions||[])];
 return {state:log(married,`You married ${g.partner.name}.${prenup?` You both signed a prenup protecting premarital wealth; your spouse receives ${spouseShare}% of future shared wealth on divorce.`:' You pooled your savings and chose shared ownership of the estate.'}`,'Marriage','💍')};
}
export function divorceQuote(g,custody='Shared',method='Amicable'){
 if(!g.marriage)return null;
 const net=Math.max(0,planningNetWorth(g));const m=g.marriage;
 const shared=m.prenup?Math.max(0,net-(m.protectedWealth||0)-(m.protectedInheritance||0)):net;
 const settlement=Math.round(shared*(m.prenup?(m.spouseShare??50)/100:.5));
 const years=Math.max(0,g.year-m.year);const spouseIncome=m.spouseIncome||30000;
 const alimony=years>=5?Math.min(50000,Math.round(Math.max(0,(g.salary||0)-spouseIncome)*.15)):0;
 const minors=(g.children||[]).filter(c=>c.alive!==false&&c.age<18&&(c.otherParentId===g.partner?.id||!c.otherParentId&&!c.singleParentAdoption)).length;
 const perChild=Math.min(12000,Math.max(1000,Math.round((g.salary||0)*.08)));
 return {settlement,legalFee:method==='Court'?10000:2500,alimony,alimonyYears:alimony?Math.min(5,Math.ceil(years/2)):0,childSupport:custody==='You'?0:Math.round(minors*perChild*(custody==='Shared'?.5:1)),childSupportPerChild:perChild,childSupportReceived:custody==='You'?minors*Math.min(12000,Math.max(1000,Math.round(spouseIncome*.08))):0,initialMinors:minors,childIds:(g.children||[]).filter(c=>c.alive!==false&&c.age<18&&(c.otherParentId===g.partner?.id||!c.otherParentId&&!c.singleParentAdoption)).map(c=>c.id),custody,method};
}
function liquidateForExpense(g,cost){
 let next={...g,assets:[...(g.assets||[])],companies:[...(g.companies||[])]};const sold=[];
 for(const asset of [...next.assets].filter(a=>a.status==='owned')){if(funds(next)>=cost)break;const value=Math.max(0,Math.round((asset.value||0)*(asset.condition??100)/100));next.money=(next.money||0)+value;next.assets=next.assets.filter(a=>a.id!==asset.id);if(next.livingArrangement?.assetId===asset.id)next.livingArrangement=null;sold.push(asset.name);}
 if(funds(next)<cost&&next.investments?.holdings?.length){const value=next.investments.holdings.reduce((s,p)=>s+p.units*instrumentPrice(next.investments,p.assetId),0);next.money=(next.money||0)+Math.round(value);next.investments={...next.investments,holdings:[]};sold.push('investment portfolio');}
 for(const company of [...next.companies]){if(funds(next)>=cost)break;next.money=(next.money||0)+companyEquity(company);next.companies=next.companies.filter(c=>c.id!==company.id);sold.push(company.name);}
 if(funds(next)<cost&&(next.pension?.balance||0)>0){const transferred=Math.min(next.pension.balance,cost-funds(next));next.pension={...next.pension,balance:next.pension.balance-transferred};next.money=(next.money||0)+transferred;sold.push('retirement assets transferred under settlement');}
 const paid=spend(next,cost,'Divorce settlement and legal fees');return paid?{...paid,settlementSales:sold}:null;
}
export function divorce(g,custody='Shared',method='Amicable'){
 if(!g.alive||!g.marriage||!g.partner)return {error:'You are not currently married.'};
 if(!['Shared','You','Other parent'].includes(custody)||!['Amicable','Court'].includes(method))return {error:'Choose an available process and custody arrangement.'};
 if(method==='Court'&&g.custodyCase?.stage!=='judgment'){const state=startCustodyCase(g,custody);if(state)return {state,pending:true};}
 const quote=divorceQuote(g,custody,method);const paid=liquidateForExpense(g,quote.settlement+quote.legalFee);
 if(!paid)return {error:'The estate cannot cover the settlement and legal fees. Build available assets first.'};
 const former={...g.partner,role:'Friend',relationshipLabel:'Former spouse',maritalStatus:'divorced',personalWealth:(g.partner.personalWealth||0)+quote.settlement,closeness:Math.max(10,(g.partner.closeness||50)-(method==='Court'?40:20))};
 const state={...paid,partner:null,marriage:null,relationship:'Divorced',friends:[...(g.friends||[]).filter(p=>p.id!==former.id),former],divorceObligations:[{...quote,id:`divorce-${g.year}-${former.id}`,formerSpouseId:former.id,yearsRemaining:quote.alimonyYears,arrears:0},...(g.divorceObligations||[])],divorceHistory:[{...quote,year:g.year,spouse:former.name,sold:paid.settlementSales},...(g.divorceHistory||[])],children:(g.children||[]).map(c=>({...c,custody:quote.childIds.includes(c.id)?custody:c.custody}))};
 if(g.job==='Founder & CEO'&&!state.companies.length){state.job=null;state.salary=0;state.career='Not employed';}
 return {state:log(state,`You divorced ${former.name}. Settlement: ${formatMoney(quote.settlement)}; legal costs: ${formatMoney(quote.legalFee)}. Custody: ${custody}.${paid.settlementSales.length?` Assets sold or transferred: ${paid.settlementSales.join(', ')}.`:''}`,'Divorce settlement','⚖️'),quote};
}

export const policyDefinitions={health:{name:'Health insurance',premium:2400,deductible:500,rate:.9,limit:100000},life:{name:'Life insurance',premium:1200,deductible:0,rate:1,limit:250000},auto:{name:'Vehicle insurance',deductible:1000,rate:.85},home:{name:'Home insurance',deductible:2000,rate:.9}};
export function policyQuote(g,kind,assetId){
 const definition=policyDefinitions[kind];if(!definition)return null;
 if(['health','life'].includes(kind))return {...definition,kind,id:kind};
 const asset=(g.assets||[]).find(a=>a.id===assetId&&a.status==='owned');
 if(!asset||kind==='home'&&asset.category!=='Homes'||kind==='auto'&&!String(asset.kind).toLowerCase().includes('car'))return null;
 const value=Math.max(0,asset.value||asset.purchasePrice||0);
 return {...definition,kind,assetId,id:`${kind}-${assetId}`,name:`${definition.name} · ${asset.name}`,premium:Math.round(Math.max(kind==='home'?800:600,value*(kind==='home'?.003:.025))),limit:Math.round(value)};
}
export function buyInsurance(g,kind,assetId){
 if(!g.alive||g.age<18||kind==='life'&&g.age>70&&!g.insurance?.policies?.some(p=>p.kind==='life'&&p.paidYear===g.year&&!p.deathPaid))return {error:'Policies open at 18; new life policies are available through age 70.'};
 const quote=policyQuote(g,kind,assetId);if(!quote)return {error:'Choose an eligible owned asset.'};
 if(g.insurance?.policies?.some(p=>p.id===quote.id&&p.active))return {error:'That policy is already active.'};
 const previous=g.insurance?.policies?.find(p=>p.id===quote.id);
 if(previous?.paidYear===g.year&&!previous.deathPaid)return {state:log({...g,insurance:{...g.insurance,policies:g.insurance.policies.map(p=>p.id===quote.id?{...p,active:true}:p)}},`You reactivated the already-paid ${quote.name}. This year's deductible and claims totals are unchanged.`,'Insurance reactivated','🛡️')};
 const paid=spend(g,quote.premium,`${quote.name} premium`);if(!paid)return {error:'You cannot afford this annual premium.'};
 const policy={...quote,active:true,paidYear:g.year,startedYear:g.year,deductibleUsed:0,claimsPaid:0};
 return {state:log({...paid,insurance:{...(g.insurance||{}),policies:[...(g.insurance?.policies||[]).filter(p=>p.id!==quote.id),policy]}},`You bought ${quote.name}. Premium ${formatMoney(quote.premium)} per year, deductible ${formatMoney(quote.deductible)}.`,'Insurance policy','🛡️')};
}
export function insuredQuote(g,cost,kind,assetId){
 const policy=g.insurance?.policies?.find(p=>p.active&&p.paidYear===g.year&&p.kind===kind&&(!assetId||p.assetId===assetId));
 if(!policy)return {cost,userCost:cost,covered:0,policy:null,deductible:0};
 const deductible=Math.min(cost,Math.max(0,policy.deductible-(policy.deductibleUsed||0)));
 const covered=Math.max(0,Math.min(Math.round((cost-deductible)*policy.rate),Math.max(0,policy.limit-(policy.claimsPaid||0))));
 return {cost,userCost:cost-covered,covered,policy,deductible};
}
export function insuredExpense(g,cost,kind,assetId,label){
 const quote=insuredQuote(g,cost,kind,assetId);const paid=spend(g,quote.userCost,label);if(!paid)return null;
 if(!quote.policy)return paid;
 return {...paid,insurance:{...g.insurance,policies:g.insurance.policies.map(p=>p.id===quote.policy.id?{...p,deductibleUsed:(p.deductibleUsed||0)+quote.deductible,claimsPaid:(p.claimsPaid||0)+quote.covered}:p),claims:[{year:g.year,policy:quote.policy.name,bill:cost,paid:quote.userCost,covered:quote.covered,label},...(g.insurance.claims||[])].slice(0,50)}};
}
export function settleLifeInsurance(g){
 if(g.alive)return g;
 const policy=g.insurance?.policies?.find(p=>p.kind==='life'&&p.active&&p.paidYear===g.year&&!p.deathPaid);if(!policy)return g;
 return log({...income(g,policy.limit,'Life insurance estate payout'),insurance:{...g.insurance,policies:g.insurance.policies.map(p=>p.id===policy.id?{...p,deathPaid:true,active:false}:p)}},`Your life policy paid ${formatMoney(policy.limit)} into the estate for your beneficiaries.`,'Insurance payout','🛡️');
}

export function pensionEstimate(g){
 const p=g.pension||{};const years=p.serviceYears||0;
 const state=years>=10?Math.min(60000,Math.round((p.totalSalary||0)/years*Math.min(.6,years*.015))):0;
 const privateIncome=Math.round((p.balance||0)*.04);
 return {state,privateIncome,total:state+privateIncome};
}
export function setPensionRate(g,rate){
 if(!g.alive||g.age<18||![0,5,10,15,20].includes(Number(rate)))return {error:'Choose an available pension contribution rate.'};
 return {state:log({...g,pension:{...(g.pension||{}),contributionRate:Number(rate)/100}},`You set retirement contributions to ${rate}% of employment pay. Employer matching covers up to 3%.`,'Retirement planning','🌅')};
}
export function retire(g){
 if(!g.alive||g.age<60||g.retired)return {error:'Retirement is available from age 60.'};
 return {state:log({...g,retired:true,job:null,salary:0,career:'Retired',pension:{...(g.pension||{}),claiming:true,retiredYear:g.year}},`You retired. Employment pay stops; state benefits and a 4% retirement draw begin on your next age-up.`,'Retirement','🌅')};
}

export const educationPaths={University:{tuition:15000,years:4,target:60000},Vocational:{tuition:12000,years:2,target:24000}};
export function saveEducationPlan(g,childId,{path='University',annualContribution=0}={}){
 if(!g.alive||g.age<18||!educationPaths[path]||!Number.isFinite(Number(annualContribution))||Number(annualContribution)<0||Number(annualContribution)>1e8)return {error:'Choose a valid education plan and annual contribution.'};
 const child=g.children?.find(c=>c.id===childId&&c.alive!==false);if(!child)return {error:'Choose a living child.'};
 const previous=g.educationPlans?.[childId]||{};if(previous.started&&previous.path!==path)return {error:'A course already underway cannot switch paths.'};
 return {state:log({...g,educationPlans:{...(g.educationPlans||{}),[childId]:{balance:0,yearsCompleted:0,...previous,path,annualContribution:Math.round(Number(annualContribution)),childName:child.name}}},`You planned ${path.toLowerCase()} education for ${child.name}, saving ${formatMoney(annualContribution)} per year.`,'Education planning','🎓')};
}
export function fundEducation(g,childId,amount){
 const plan=g.educationPlans?.[childId];amount=Math.round(Number(amount));
 if(!g.alive||g.age<18||!plan||!Number.isFinite(amount)||amount<=0)return {error:'Choose a positive contribution for an existing plan.'};
 const paid=spend(g,amount,`${plan.childName} education savings`);if(!paid)return {error:'You do not have enough available funds.'};
 return {state:log({...paid,educationPlans:{...g.educationPlans,[childId]:{...plan,balance:plan.balance+amount}}},`You saved ${formatMoney(amount)} for ${plan.childName}'s education.`,'Education savings','🎓')};
}
export function tutorChild(g,childId){
 const child=g.children?.find(c=>c.id===childId&&c.alive!==false);
 if(!g.alive||g.age<18||!child||child.age<6||child.age>=18||child.tutoringYear===g.year)return {error:'Tutoring is available once per year for children aged 6–17.'};
 const paid=spend(g,500,`${child.name} tutoring`);if(!paid)return {error:'Tutoring costs $500.'};
 return {state:log({...paid,children:g.children.map(c=>c.id===childId?{...c,smarts:clamp((c.smarts??55)+6),tutoringYear:g.year}:c)},`${child.name} completed a tutoring programme and gained 6 smarts.`,'Child tutoring','📚')};
}
export function nominateSuccessor(g,companyId,childId){
 if(!g.alive||g.age<18||!g.companies?.some(c=>c.id===companyId)||!g.children?.some(c=>c.id===childId&&c.alive!==false))return {error:'Choose an owned business and a living child.'};
 const child=g.children.find(c=>c.id===childId);const company=g.companies.find(c=>c.id===companyId);
 return {state:log({...g,businessSuccession:{...(g.businessSuccession||{}),[companyId]:{childId,childName:child.name,year:g.year}}},`You nominated ${child.name} to inherit your ownership in ${company.name}. A professional manager will run it while an heir is under 18.`,'Family business','🏢')};
}
export function inheritFamilyPlans(g,child,netWorth){
 const aliveIds=new Set((g.children||[]).filter(c=>c.alive!==false).map(c=>c.id));
 const assigned=(g.companies||[]).filter(c=>aliveIds.has(g.businessSuccession?.[c.id]?.childId));
 const excluded=assigned.reduce((s,c)=>s+companyEquity(c),0);
 const businesses=(g.companies||[]).filter(c=>{const id=g.businessSuccession?.[c.id]?.childId;return aliveIds.has(id)?id===child.id:!g.will;}).map(c=>({...c,ownerName:child.name,inheritedYear:g.year,generation:(c.generation||1)+1,professionalManager:child.age<18,professionalManagerSalary:child.age<18?Math.min(120000,Math.max(18000,Math.round((c.valuation||0)*.015))):0}));
 const educationBalance=g.educationPlans?.[child.id]?.balance||0;
 const levy=g.estatePlan?.levyEnabled?Math.round(Math.max(0,netWorth-2000000)*.15):0;const estateAfterLevy=Math.max(0,netWorth-excluded-levy);const cashInheritance=inheritEstate(g,child,estateAfterLevy);
 return {...cashInheritance,estateReceipt:{netEstate:netWorth,levy,received:cashInheritance.bankBalance??Math.max(0,(g.bankBalance||0)+(g.pension?.balance||0)-levy)},companies:businesses,bankBalance:(cashInheritance.bankBalance??Math.max(0,(g.bankBalance||0)+(g.pension?.balance||0)-levy))+educationBalance,marriage:null,divorceObligations:[],pension:{balance:0,serviceYears:0,totalSalary:0,contributionRate:0},insurance:{policies:[],claims:[]},educationPlans:{},businessSuccession:{},retired:false};
}

export function advanceFuturePlanning(input,salaryIncome=0){
 if(!input.alive||input.futurePlanningYear===input.year)return input;
 let g={...input,futurePlanningYear:input.year};
 const p={balance:0,serviceYears:0,totalSalary:0,contributionRate:0,...g.pension};
 if(salaryIncome>0){p.serviceYears++;p.totalSalary+=salaryIncome;const contribution=Math.round(salaryIncome*(p.contributionRate||0));if(contribution>0){const paid=spend(g,contribution,'Retirement contribution');if(paid){g=paid;p.balance+=contribution+Math.round(salaryIncome*Math.min(.03,p.contributionRate||0));}else g=log(g,'Your retirement contribution was skipped because available funds were too low.','Retirement shortfall','🌅');}}
 p.balance=Math.round(p.balance*1.04);g.pension=p;
 if(p.claiming&&g.age>=60){const estimate=pensionEstimate(g);const draw=Math.min(p.balance,estimate.privateIncome);g=income(g,draw+estimate.state,'Annual retirement pension');g.pension={...p,balance:p.balance-draw,lastPayment:draw+estimate.state};g=log(g,`Your pension paid ${formatMoney(draw+estimate.state)} this year (${formatMoney(estimate.state)} state benefit and ${formatMoney(draw)} from retirement savings).`,'Pension payment','🌅');}
 if(g.marriage&&g.partner&&g.partner.alive!==false){g=income(g,g.marriage.spouseIncome||30000,'Spouse household income');}
 let policies=[];for(const original of g.insurance?.policies||[]){let policy={...original};if(policy.active&&policy.paidYear!==g.year){const owned=!policy.assetId||g.assets?.some(a=>a.id===policy.assetId&&a.status==='owned');const paid=owned?spend(g,policy.premium,`${policy.name} renewal`):null;if(paid){g=paid;policy={...policy,paidYear:g.year,deductibleUsed:0,claimsPaid:0};}else{policy.active=false;g=log(g,`${policy.name} lapsed because ${owned?'the premium could not be paid':'the insured asset is no longer owned'}. Renew it to regain cover.`,'Policy lapsed','🛡️');}}policies.push(policy);}g.insurance={...(g.insurance||{}),policies};
 let obligations=[];const supportedChildren=new Set();for(const o of g.divorceObligations||[]){const apart=!(g.partner?.id===o.formerSpouseId&&g.partner.alive!==false);const minors=(g.children||[]).filter(c=>c.alive!==false&&c.age<18&&(!o.childIds||o.childIds.includes(c.id))&&!supportedChildren.has(c.id)).length;for(const c of g.children||[])if(!o.childIds||o.childIds.includes(c.id))supportedChildren.add(c.id);const childSupport=!apart||o.custody==='You'?0:Math.round(minors*(o.childSupportPerChild||0)*(o.custody==='Shared'?.5:1));const due=childSupport+(o.yearsRemaining>0?o.alimony||0:0);const pay=Math.min(funds(g),due);if(pay)g=spend(g,pay,'Divorce support payment');const arrears=(o.arrears||0)+due-pay;obligations.push({...o,childSupport,yearsRemaining:Math.max(0,o.yearsRemaining-1),arrears});if(due>pay)g=log(g,`Unpaid family support of ${formatMoney(due-pay)} was added to your arrears.`,'Support arrears','⚖️');if(apart&&o.custody==='You'&&minors)g=income(g,Math.round((o.childSupportReceived||0)*minors/Math.max(1,o.initialMinors||minors)),'Child support received');}g.divorceObligations=obligations;
 let plans={};let children=[...(g.children||[])];for(const [id,original]of Object.entries(g.educationPlans||{})){const child=children.find(c=>c.id===id);let plan={...original};if(!child||child.alive===false){plans[id]=plan;continue;}plan.balance=Math.round((plan.balance||0)*1.03);const path=educationPaths[plan.path];if(!path||plan.completed){plans[id]=plan;continue;}if(child.age>=18&&child.ownEducationChoice&&child.ownEducationChoice!==plan.path){if(!plan.pausedForChoice)g=log(g,`${child.name} chose ${child.ownEducationChoice.toLowerCase()} instead of the planned ${plan.path.toLowerCase()} course. Education savings remain reserved.`,'Child choice','🧭');plan.pausedForChoice=true;plans[id]=plan;continue;}if(plan.annualContribution>0){const paid=spend(g,plan.annualContribution,`${child.name} annual education saving`);if(paid){g=paid;plan.balance+=plan.annualContribution;}else g=log(g,`The planned contribution for ${child.name} was skipped due to insufficient funds.`,'Education shortfall','🎓');}
 if(child.age>=18){const scholarship=(child.smarts??55)>=75?.25:0;const tuition=Math.round(path.tuition*(1-scholarship));if(plan.balance>=tuition){plan.balance-=tuition;plan.started=true;plan.yearsCompleted=(plan.yearsCompleted||0)+1;plan.completed=plan.yearsCompleted>=path.years;children=children.map(c=>c.id===id?{...c,smarts:clamp((c.smarts??55)+4),education:plan.completed?(plan.path==='University'?'University graduate':'Vocational graduate'):`${plan.path} student`,educationLevel:plan.completed?(plan.path==='University'?2:1):1}:c);g=log(g,`${child.name} completed year ${plan.yearsCompleted} of ${plan.path.toLowerCase()}.${scholarship?' A merit scholarship reduced tuition by 25%.':''}${plan.completed?' They graduated!':''}`,'Child education','🎓');}else g=log(g,`${child.name}'s ${plan.path.toLowerCase()} course needs ${formatMoney(tuition)} for its next year. Add funds to their education account.`,'Education funding','🎓');}plans[id]=plan;}g.educationPlans=plans;g.children=children;
 return g;
}
