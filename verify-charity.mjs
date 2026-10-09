import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {donateCharity,donationUnavailable} from './src/charity.js';
const base={name:'Alex',year:2026,age:18,alive:true,money:300,bankBalance:1700,stats:{happiness:99,health:80},lifetimeSpending:10,lifetimeDonations:500,log:[]};
const snapshot=JSON.stringify(base),paid=donateCharity(base);assert.equal(JSON.stringify(base),snapshot);assert.equal(paid.money,0);assert.equal(paid.bankBalance,1000);assert.equal(paid.lifetimeDonations,1500);assert.equal(paid.lifetimeSpending,1010);assert.equal(paid.stats.happiness,100);assert.equal(paid.stats.health,80);assert.ok(paid.log[0].text.includes('donated $1,000'));assert.equal(paid.transactions[0].amount,-1000);
for(const invalid of [{...base,age:17},{...base,alive:false},{...base,money:0,bankBalance:999}]){assert.ok(donationUnavailable(invalid));assert.equal(donateCharity(invalid),invalid);}
const server=await createServer({server:{middlewareMode:true},appType:'custom'});try{const Screen=(await server.ssrLoadModule('/src/CharityScreen.jsx')).default;const html=renderToStaticMarkup(React.createElement(Screen,{game:base,setGame:()=>{}}));assert.ok(html.includes('Lifetime donations'));assert.ok(html.includes('Donate $1,000'));const child=renderToStaticMarkup(React.createElement(Screen,{game:{...base,age:17},setGame:()=>{}}));assert.ok(child.includes('Available at age 18.'));assert.ok(child.includes('disabled'));await server.ssrLoadModule('/src/App.jsx');}finally{await server.close();}
console.log('PASS: charity cash/bank deductions, donation totals, age/alive/funds guards, immutable state, and screen rendering.');
