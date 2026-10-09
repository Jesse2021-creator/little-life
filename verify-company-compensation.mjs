import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {companyCeoSalary,setCompanySalary,salaryLimit} from './src/companySalary.js';
import {appointFamilyMember,dismissFamilyMember,familyPayroll,familyEmployees,reconcileFamilyEmployment} from './src/familyEmployment.js';
import {normalizeNpcEconomy,advanceNpcEconomy} from './src/npcEconomy.js';
import {normalizeLife} from './src/lifeSystems.js';
import {normalizeRealism} from './src/realism.js';
const c={id:'co',name:'Atlas',valuation:1000000,cash:300000,performance:85,ownership:80,board:[{id:'founder'}, {id:'investor',approvalThreshold:65}]};
const spouse={id:'wife',name:'Riley',age:36,alive:true,maritalStatus:'married'};
const g=normalizeNpcEconomy(normalizeRealism(normalizeLife({characterId:'me',name:'Alex',country:'United States',age:40,year:2026,alive:true,money:10000,stats:{health:80,happiness:80,smarts:80,looks:80},partner:spouse,marriage:{partnerId:'wife'},children:[{id:'child',name:'Robin',age:21,alive:true}],friends:[],family:{parents:[],siblings:[]},companies:[c],log:[]})));
assert.equal(salaryLimit(c),50000);
const direct=setCompanySalary(g,c.id,25000,()=>.99);assert.ok(direct.approved);assert.equal(direct.game.salary,25000);assert.equal(direct.game.companies[0].salaryReview.reviewed,false);
assert.ok(setCompanySalary(g,c.id,50001).error);assert.ok(setCompanySalary(g,c.id,-1).error);assert.ok(setCompanySalary({...g,companies:[{...c,cash:100}]},c.id,25000).error);
const minority={...g,companies:[{...c,ownership:79}]};
const yes=setCompanySalary(minority,c.id,20000,()=>0);assert.ok(yes.approved);assert.equal(yes.game.companies[0].salaryReview.yesVotes,1);assert.ok(setCompanySalary(yes.game,c.id,21000,()=>0).error);
const rejected=setCompanySalary({...direct.game,companies:[{...direct.game.companies[0],ownership:79}]},c.id,30000,()=>.99);assert.equal(rejected.approved,false);assert.equal(rejected.game.salary,25000);assert.equal(companyCeoSalary(rejected.game,rejected.game.companies[0]),25000);
const married=appointFamilyMember(yes.game,c.id,'wife','board');assert.ok(!married.error);assert.equal(married.game.partner.job,'Board director');assert.equal(married.game.partner.familyEmployment.companyName,'Atlas');assert.equal(married.game.companies[0].board.at(-1).personId,'wife');
const nextYear={...married.game,year:2027};assert.equal(setCompanySalary(nextYear,c.id,20000,()=>0).game.companies[0].salaryReview.totalVotes,1);
const noIndependent={...nextYear,companies:[{...nextYear.companies[0],board:nextYear.companies[0].board.filter(d=>d.id!=='investor')}]};assert.equal(setCompanySalary(noIndependent,c.id,20000,()=>0).approved,false);
const hired=appointFamilyMember(married.game,c.id,'child','manager').game;
const wages=familyPayroll(hired.companies[0],300000,familyEmployees(hired),2027);assert.equal(wages.due,hired.partner.annualSalary+hired.children[0].annualSalary);assert.equal(wages.paid,wages.due);
const aged=advanceNpcEconomy({...hired,year:2027,companies:[{...hired.companies[0],familyPayrollPayments:wages.payments}]});assert.equal(aged.partner.lastAnnualIncome,hired.partner.annualSalary);
const fired=dismissFamilyMember(hired,c.id,'wife').game;assert.equal(normalizeNpcEconomy(fired).partner.job,'Seeking employment');assert.ok(!fired.companies[0].board.some(d=>d.personId==='wife'));assert.equal(dismissFamilyMember(hired,c.id,'child').game.children[0].familyEmployment,null);
const divorced={...hired,partner:null,marriage:null,friends:[hired.partner]};assert.equal(dismissFamilyMember(divorced,c.id,'wife').game.friends[0].familyEmployment,null);assert.ok(appointFamilyMember({...g,marriage:null,partner:{...spouse,maritalStatus:'dating'}},c.id,'wife','board').error);
assert.equal(reconcileFamilyEmployment({...hired,companies:[]}).partner.familyEmployment,null);
const multi=setCompanySalary({...direct.game,companies:[...direct.game.companies,{...c,id:'co2',name:'Second'}]},'co2',10000).game;assert.equal(multi.salary,35000);assert.equal(companyCeoSalary(multi,multi.companies[0]),25000);assert.equal(companyCeoSalary(multi,multi.companies[1]),10000);
const legacy={...g,job:'Founder & CEO',salary:30000,companies:[c,{...c,id:'other'}]};assert.equal(legacy.companies.reduce((s,c)=>s+companyCeoSalary(legacy,c),0),30000);
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {moreMenuItems}=await server.ssrLoadModule('/src/VerticalNavigation.jsx');assert.equal(moreMenuItems[0].id,'Dating');assert.deepEqual(moreMenuItems.slice(-3).map(i=>i.id),['Real Life','Life & Legacy','Write Your Will']);
 for(const [path,title]of [['ChildSupportScreen','Support when parents are apart'],['RealismScreen','Live with intention'],['LifeDevelopmentScreen','Build a lasting legacy'],['CharityScreen','Give back to your community'],['WillPlanner','Your last will']]){const Component=(await server.ssrLoadModule(`/src/${path}.jsx`)).default;const html=renderToStaticMarkup(React.createElement(Component,{game:g,setGame:()=>{},netWorth:10000,onClose:()=>{}}));assert.ok(html.includes('life-hero'));assert.ok(html.includes(title));assert.ok(!html.includes('NaN'));}
 const Staff=(await server.ssrLoadModule('/src/FamilyBusinessStaff.jsx')).default;const staff=renderToStaticMarkup(React.createElement(Staff,{game:hired,company:hired.companies[0],setGame:()=>{},onNotice:()=>{}}));assert.ok(staff.includes('Riley'));assert.ok(staff.includes('Spouse'));assert.ok(staff.includes('Dismiss'));
 const Panel=(await server.ssrLoadModule('/src/CompanySalaryPanel.jsx')).default;assert.ok(renderToStaticMarkup(React.createElement(Panel,{game:minority,company:minority.companies[0],setGame:()=>{},onNotice:()=>{}})).includes('Submit to the board'));
 await server.ssrLoadModule('/src/App.jsx');
}finally{await server.close();}
console.log('PASS: 80% salary threshold, valuation cap, reserves, board approvals/rejections/quorum, family vote exclusion, per-company payroll, spouse/child hire and dismissal, divorce dismissal, profiles, menu order and redesigned screen rendering.');
