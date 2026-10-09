import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {normalizeLife} from './src/lifeSystems.js';
import {normalizeRealism} from './src/realism.js';
const game=normalizeRealism(normalizeLife({name:'Alex Morgan',country:'United States',age:25,year:2026,gender:'Man',alive:true,money:10000,stats:{health:80,happiness:70,looks:60,smarts:65},family:{parents:[],siblings:[]},children:[],friends:[],log:[],assets:[],companies:[]}));
const server=await createServer({server:{middlewareMode:true},appType:'custom'});try{
 const {VerticalMenu,SlideChildPage,MoreSectionPage,careerMenuItems,moreMenuItems}=await server.ssrLoadModule('/src/VerticalNavigation.jsx');
 for(const [items,label]of [[careerMenuItems,'Career sections'],[moreMenuItems,'More sections']]){const html=renderToStaticMarkup(React.createElement(VerticalMenu,{items,label,onSelect:()=>{}}));assert.equal((html.match(/class="vertical-menu-row"/g)||[]).length,items.length);assert.equal((html.match(/vertical-menu-chevron/g)||[]).length,items.length);for(const item of items)assert.ok(html.includes(item.title.replaceAll('&','&amp;')));assert.ok(html.includes(`aria-label="${label}"`));}
 const page=renderToStaticMarkup(React.createElement(SlideChildPage,{title:'Jobs',eyebrow:'CAREER',onBack:()=>{},onClose:()=>{}},React.createElement('p',null,'Open positions')));assert.ok(page.includes('Back to Career menu'));assert.ok(page.includes('Close Jobs'));assert.ok(page.includes('navigation-slide-in'));assert.ok(page.includes('Open positions'));
 const root=renderToStaticMarkup(React.createElement(MoreSectionPage,{bottom:true,active:'',onBack:()=>{},onClose:()=>{}},React.createElement('p',null,'Hidden section')));assert.equal(root,'');
 const more=renderToStaticMarkup(React.createElement(MoreSectionPage,{bottom:true,active:'Banking',onBack:()=>{},onClose:()=>{}},React.createElement('p',null,'Account balance')));assert.ok(more.includes('Back to More menu'));assert.ok(more.includes('Account balance'));
 const top=renderToStaticMarkup(React.createElement(MoreSectionPage,{bottom:false,active:'Lives'},React.createElement('p',null,'Saved lives')));assert.equal(top,'<p>Saved lives</p>');
 const Career=(await server.ssrLoadModule('/src/CareerSystems.jsx')).default;const career=renderToStaticMarkup(React.createElement(Career,{game,setGame:()=>{},money:10000,onMoney:()=>{},notify:()=>{},onClose:()=>{}}));assert.ok(career.includes('vertical-menu-row'));assert.ok(!career.includes('class="career-tabs"'));assert.ok(!career.includes('Open positions'));
 const Vacation=(await server.ssrLoadModule('/src/VacationPlanner.jsx')).default;const vacation=renderToStaticMarkup(React.createElement(Vacation,{game,setGame:()=>{},notify:()=>{},onClose:()=>{},embedded:true}));assert.ok(vacation.includes('embedded-vacation-screen'));assert.ok(!vacation.includes('Close vacation planner'));assert.ok(vacation.includes('Destination'));
 await server.ssrLoadModule('/src/App.jsx');
}finally{await server.close();}
console.log('PASS: all Career/More rows and chevrons, parent/child rendering, back/close controls, preserved top More menu, and embedded vacation layout.');
