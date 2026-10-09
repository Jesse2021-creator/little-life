import {spend,funds} from './futurePlanning.js';
export function donationUnavailable(game,amount=1000){return !game.alive?'This life has ended.':game.age<18?'Available at age 18.':!Number.isInteger(amount)||amount<1?'Choose a positive whole donation.':funds(game)<amount?'Not enough available funds for this donation.':'';}
export function donateCharity(game,amount=1000,random=Math.random){
 amount=Number(amount);if(donationUnavailable(game,amount))return game;
 const paid=spend(game,amount,'Charitable donation');
 const event=random()<.3?['The charity invited you to meet students supported by your gift.','A community organiser thanked you at a local gathering.','Your donation helped an emergency food drive reach its goal.'][Math.floor(random()*3)]:'';
 return {...paid,lifetimeDonations:(game.lifetimeDonations||0)+amount,charityEvents:event?[{year:game.year,age:game.age,text:event},...(game.charityEvents||[])]:game.charityEvents||[],stats:{...game.stats,happiness:Math.min(100,(game.stats?.happiness||0)+2+(event?2:0))},log:[{year:game.year,age:game.age,text:`You donated $${amount.toLocaleString()} to a community charity, supporting local education and essential services.${event?' '+event:''}`,tag:'Giving back',icon:'💛'},...(game.log||[])]};
}
