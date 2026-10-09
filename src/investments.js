const pick = list => list[Math.floor(Math.random()*list.length)];
const randomBetween=(min,max)=>min+Math.random()*(max-min);
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const idFor=prefix=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const stockCategories={
  Technology:{prefixes:['Nimble','Orbit','Pixel','Quantum','Cloud','Copper','Vertex','Lumen'],suffixes:['Systems','Labs','Networks','Dynamics','Software','Robotics'],price:[24,340],vol:.025,yield:[0,.018]},
  Healthcare:{prefixes:['Everwell','Nova','Cedar','Pulse','Bright','Horizon','LifeSpring'],suffixes:['Health','Therapeutics','Medical','BioWorks','Care Group'],price:[18,210],vol:.018,yield:[.003,.035]},
  Consumer:{prefixes:['Sunday','Clover','Mosaic','Golden','Wildwood','Fresh','Goodday'],suffixes:['Foods','Brands','Markets','Home','Retail'],price:[12,160],vol:.02,yield:[.006,.045]},
  Energy:{prefixes:['BluePeak','Solara','NorthWind','RedRock','SunField','Terra'],suffixes:['Energy','Power','Resources','Grid','Petroleum'],price:[16,250],vol:.03,yield:[.01,.06]},
  Finance:{prefixes:['Harbor','Summit','Pioneer','Clearwater','Union','Monarch'],suffixes:['Financial','Bancorp','Capital','Insurance','Payments'],price:[22,280],vol:.02,yield:[.01,.055]},
  Transport:{prefixes:['Skyway','Pioneer','Atlas','Swift','NorthStar','Meridian'],suffixes:['Air','Motors','Logistics','Transit','Freight'],price:[15,190],vol:.028,yield:[0,.04]},
};
const cryptoRoots=['Auralis','Kestrel','Solstice','Nexora','Vela','Arbor','Cinder','Meridian','Halcyon','Tandem','Kairo','Moneta'];
const memeRoots=['PugRocket','DogeMango','PickleCoin','BananaCat','CapyCash','FrogWizard','HamsterMoon','ToastToken','LlamaLambo','WaffleWifHat','Duckonomics','GoblinCoin','ShibaSprout','PepePancake','TacoTuesday','MemeMuseum','RaccoonRally','SleepySloth','PigeonPilot','NoodleDoodle','MochiMeteor','PandaParade','ChonkyPenguin','BurritoBandit','CosmicHamster','WiggleWorm','TurboTurtle','CactusCat','DiscoDuck','MoonMuffin','SillyGoose','PotatoWizard','FuzzyComet','JellybeanJet','DinoDollars','FluffyFren','ZoomieZebra','PuddlePup','NachoNinja','BubbleTeaBear','MangoMayhem','RocketRaccoon','SpicyMeerkat','CloudyCapybara','GummyGator','PancakeParty','UnicornYawn','MemeMarmot','PixelPossum','WobbleWhale','BobaBandit','SneezyDragon','CosmoCrumb','TinyTornado','FroggyFiesta','WaffleWizard','PuffinProfit','SnackShark','LoopyLemur','MarshmallowMoth','YapCoin','VibeLizard','DoodleDoge','BreadHead','ZoomerZucchini'];
const bondNames=['US Treasury Note','Commonwealth Infrastructure Bond','Northstar Municipal Bond','Bluehaven Corporate Bond','Cedar County Green Bond','Union Transit Revenue Bond','Atlas Savings Note','Pioneer Utility Debenture'];
const symbolsFor=name=>name.replace(/[^A-Za-z]/g,'').toUpperCase().slice(0,4).padEnd(3,'X');
const makeInstrument=(assetClass,name,category,price,volatility,annualYield=0)=>({id:idFor(assetClass.toLowerCase()),assetClass,name,symbol:symbolsFor(name),category,price,lastPrice:price,volatility,annualYield,history:Array.from({length:18},(_,i)=>Math.max(.001,price*randomBetween(.90,1.04))).concat(price),changePct:0,createdYear:2026,halted:false});
const makeBond=(year,existing=[])=>{const issuer=pick(bondNames);const series=`Series ${year}-${Math.floor(randomBetween(1,99))}`;let name=`${issuer} ${series}`;while(existing.some(item=>item.name===name))name=`${issuer} Series ${year}-${Math.floor(randomBetween(100,999))}`;const term=pick([2,3,5,7,10,15,20]);const government=/Treasury|Commonwealth|Municipal|County|Transit/.test(issuer);const rating=government?pick(['AAA','AA+','AA']):pick(['AA','A','BBB','BB']);const asset=makeInstrument('Bond',name,government?'Government':'Corporate',randomBetween(82,116),.001+Math.random()*.002,randomBetween(government?.025:.035,government?.055:.085));return {...asset,createdYear:year,maturityYears:term,maturityYear:year+term,creditRating:rating};};
export function createInvestmentMarket(year=2026){
  let stocks=[];Object.entries(stockCategories).forEach(([category,data])=>{for(let i=0;i<4;i++){const name=`${pick(data.prefixes)} ${pick(data.suffixes)}`;const asset=makeInstrument('Stock',name,category,randomBetween(...data.price),data.vol,randomBetween(...data.yield));stocks.push({...asset,sharesOutstanding:Math.round(randomBetween(18,900)*1000000),priceEarnings:Math.round(randomBetween(7,48)*10)/10});}});
  const bonds=bondNames.slice(0,5).map((name,i)=>{const asset=makeInstrument('Bond',name,i<2?'Government':'Corporate',randomBetween(82,116),.001+Math.random()*.002,randomBetween(.025,.075));const maturityYears=pick([2,3,5,7,10,20]);return {...asset,maturityYears,maturityYear:year+maturityYears,creditRating:i<2?'AAA':pick(['AA','A','BBB','BB'])};});
  const crypto=[...new Set(cryptoRoots)].slice(0,6).map((root,i)=>makeInstrument('Crypto',root+pick([' Network',' Protocol',' Chain','']),['Layer 1','Payments','Infrastructure','DeFi'][i%4],randomBetween(i<2?80:1.5,i<2?480:85),.055+Math.random()*.07,0));
  const memes=Array.from({length:8},()=>makeInstrument('Memecoin',pick(memeRoots),pick(['Community','Animal','Meme culture','Influencer','Food','Viral trend']),randomBetween(.00002,.08),.19+Math.random()*.22,0));
  const market={stocks,bonds,crypto,memecoins:memes,ruggedCoins:[],news:[],transactions:[],realizedPnl:0,portfolioHistory:[],lastTick:Date.now(),lastYear:year};
  return {...market,stocks:stocks.map(a=>({...a,createdYear:year})),bonds:bonds.map(a=>({...a,createdYear:year})),crypto:crypto.map(a=>({...a,createdYear:year})),memecoins:memes.map(a=>({...a,createdYear:year}))};
}
export const marketInstruments=market=>['stocks','bonds','crypto','memecoins','ruggedCoins'].flatMap(key=>market?.[key]||[]);
export const instrumentPrice=(market,id)=>marketInstruments(market).find(asset=>asset.id===id)?.price||0;
const appendPoint=(history,price)=>[...(history||[]).slice(-39),Number.isFinite(price)?price:0];
function tickInstrument(asset,theme){
  if(asset.halted)return asset;
  const spread=asset.assetClass==='Bond'?.001:asset.assetClass==='Stock'?.006:asset.assetClass==='Crypto'?.025:.075;
  const bias=theme&&newsImpact(asset,theme)?(theme.effect[0]+theme.effect[1])/2*.015:0;
  const movement=randomBetween(-spread,spread)+bias+(asset.assetClass==='Memecoin'?randomBetween(-.02,.02):0);
  const price=Math.max(asset.assetClass==='Memecoin'?.0000000001:.01,asset.price*(1+movement));
  return {...asset,lastPrice:asset.price,price,changePct:asset.price?((price/asset.price)-1)*100:0,history:appendPoint(asset.history,price)};
}
export function tickInvestmentMarket(market){
  if(!market)return market;
  const tick=(market.liveTicks||0)+1;
  const bulletin=tick%12===1?{...pick(newsDeck),id:idFor('bulletin'),year:market.lastYear,live:true}:null;
  const theme=bulletin||market.liveTheme;
  const update=asset=>tickInstrument(asset,theme);
  const next={...market,stocks:market.stocks.map(update),bonds:market.bonds.map(update),crypto:market.crypto.map(update),memecoins:market.memecoins.map(update),lastTick:Date.now(),liveTicks:tick,liveTheme:theme,news:bulletin?[bulletin,...(market.news||[])].slice(0,60):market.news};
  const lookup=marketInstruments(next);const value=(next.holdings||[]).reduce((sum,position)=>sum+position.units*(lookup.find(a=>a.id===position.assetId)?.price||0),0);
  return {...next,portfolioHistory:next.portfolioHistory?.length?appendPoint(next.portfolioHistory,value):[value]};
}
const newsDeck=[
 {headline:'A stronger than expected earnings season lifts investors’ mood.',classes:['Stock'],effect:[.025,.11]},
 {headline:'New chip demand sends technology shares higher.',classes:['Stock'],category:'Technology',effect:[.04,.19]},
 {headline:'A safety review puts pressure on healthcare companies.',classes:['Stock'],category:'Healthcare',effect:[-.14,-.035]},
 {headline:'Energy supply worries move oil and utility shares.',classes:['Stock'],category:'Energy',effect:[-.08,.13]},
 {headline:'Central banks signal higher rates; bond prices soften.',classes:['Bond'],effect:[-.08,-.015]},
 {headline:'Investors seek safer income as government bonds rally.',classes:['Bond'],effect:[.01,.055]},
 {headline:'A major exchange approval brings new crypto buyers.',classes:['Crypto'],effect:[.08,.55]},
 {headline:'Regulators announce a broad crypto compliance review.',classes:['Crypto','Memecoin'],effect:[-.48,-.08]},
 {headline:'Network congestion and a protocol exploit rattle token markets.',classes:['Crypto'],effect:[-.62,-.14]},
 {headline:'An online creator’s post sends a joke coin trending overnight.',classes:['Memecoin'],effect:[.18,4.5]},
 {headline:'Traders rotate into speculative meme tokens during a risk-on rally.',classes:['Memecoin'],effect:[.12,2.2]},
 {headline:'Liquidity drains from small tokens as speculative buyers leave.',classes:['Memecoin'],effect:[-.72,-.12]},
 {headline:'A consumer spending report reshapes retail forecasts.',classes:['Stock'],category:'Consumer',effect:[-.12,.12]},
 {headline:'New trade routes improve outlooks for transport companies.',classes:['Stock'],category:'Transport',effect:[.035,.16]},
 {headline:'Banking reform and credit concerns unsettle financial shares.',classes:['Stock'],category:'Finance',effect:[-.17,.04]},
];
function newsImpact(asset,story){return story.classes.includes(asset.assetClass)&&(!story.category||asset.category===story.category);}
function moveAnnual(asset,story){
  const base=asset.assetClass==='Bond'?randomBetween(-.045,.055):asset.assetClass==='Stock'?randomBetween(-.38,.48):asset.assetClass==='Crypto'?randomBetween(-.82,1.9):randomBetween(-.97,3.5);
  let pct=base;
  if(story&&newsImpact(asset,story)){const impact=randomBetween(...story.effect);pct=asset.assetClass==='Memecoin'?pct+impact:pct+impact;}
  const price=Math.max(asset.assetClass==='Memecoin'?.0000000001:.01,asset.price*(1+pct));
  return {...asset,lastPrice:asset.price,price,changePct:(price/asset.price-1)*100,history:appendPoint(asset.history,price),lastNews:story&&newsImpact(asset,story)?story.headline:asset.lastNews};
}
export function advanceInvestmentYear(market,year,age=year){
  let next=market||createInvestmentMarket(year);const newsCount=Math.random()<.28?1:Math.random()<.78?2:3;const chosen=[];
  for(let i=0;i<newsCount;i++){const story=pick(newsDeck);if(!chosen.some(item=>item.headline===story.headline))chosen.push({...story,id:idFor('news'),year,age});}
  const updateList=(list)=>list.map(asset=>{const story=[...chosen].reverse().find(item=>newsImpact(asset,item));return moveAnnual(asset,story);});
  let stocks=updateList(next.stocks||[]),bonds=updateList(next.bonds||[]),crypto=updateList(next.crypto||[]),memecoins=updateList(next.memecoins||[]);let ruggedCoins=[...(next.ruggedCoins||[])];const rugNews=[];const spikeNews=[];const matured=bonds.filter(asset=>asset.maturityYear&&asset.maturityYear<=year);bonds=bonds.filter(asset=>!asset.maturityYear||asset.maturityYear>year);while(bonds.length<5)bonds.push(makeBond(year,bonds));const maturityEvents=[];
  memecoins=memecoins.filter(coin=>{if(Math.random()<.055){const ruined={...coin,lastPrice:coin.price,price:0,changePct:-100,history:appendPoint(coin.history,0),rugged:true,ruggedYear:year,halted:true};ruggedCoins.unshift(ruined);rugNews.push({id:idFor('news'),type:'rugpull',label:`${coin.name} rug pull`,headline:`${coin.name} rug pull: liquidity vanished and the token crashed to zero.`,classes:['Memecoin'],effect:[0,0],year,age,type:'rugpull'});return false;}if(Math.random()<.004){const before=coin.price;const price=before*10001;coin={...coin,lastPrice:before,price,changePct:1000000,history:appendPoint(coin.history,price),lastNews:`A sudden speculative surge drove ${coin.name} up 1,000,000% in a year.`};spikeNews.push({id:idFor('news'),type:'spike',label:`${coin.name} surge +1,000,000%`,headline:`${coin.name} surges 1,000,000% amid a viral buying frenzy.`,classes:['Memecoin'],effect:[10001,10001],year,age,type:'spike'});}return true;});
  while(memecoins.length<8){const replacement={...makeInstrument('Memecoin',pick(memeRoots),pick(['Community','Animal','Meme culture','Influencer','Food','Viral trend']),randomBetween(.00002,.09),.2+Math.random()*.2),createdYear:year};memecoins.push(replacement);if(rugNews.length)rugNews.push({id:idFor('news'),type:'listing',label:`New listing · ${replacement.name}`,headline:`${replacement.name} listed as a new memecoin after market removals.`,classes:['Memecoin'],effect:[0,0],year,age});}
  const holdings=next.holdings||[];let distributions=0;let investmentIncome=0;let maturedRealized=0;const remainingHoldings=[];for(const position of holdings){const maturedBond=matured.find(asset=>asset.id===position.assetId);if(maturedBond){const principal=position.units*100;const coupon=position.units*100*maturedBond.annualYield;distributions+=principal+coupon;investmentIncome+=coupon;maturedRealized+=principal-position.costBasis;maturityEvents.push({id:idFor('maturity'),type:'MATURITY',assetId:maturedBond.id,symbol:maturedBond.symbol,label:`${maturedBond.name} matured · principal and final coupon returned`,amount:Math.round(principal+coupon),realizedPnl:Math.round(principal-position.costBasis),year,age});continue;}const asset=[...stocks,...bonds,...crypto,...memecoins,...ruggedCoins].find(item=>item.id===position.assetId);if(asset&&position.units>0&&asset.annualYield>0){const income=Math.max(0,position.units*position.averageCost*asset.annualYield);distributions+=income;investmentIncome+=income;}remainingHoldings.push(position);}
  const allNews=[...rugNews,...spikeNews,...chosen.map(item=>({...item,age:year}))];const allAssets=[...stocks,...bonds,...crypto,...memecoins,...ruggedCoins];const portfolioValue=holdings.reduce((sum,position)=>sum+position.units*(allAssets.find(a=>a.id===position.assetId)?.price||0),0);
  const updated={...next,stocks,bonds,crypto,memecoins,ruggedCoins,realizedPnl:(next.realizedPnl||0)+maturedRealized,news:[...allNews,...(next.news||[])].slice(0,60),holdings:remainingHoldings,maturedAssets:[...matured,...(next.maturedAssets||[])],transactions:[...maturityEvents,...rugNews,...spikeNews,...chosen.map(item=>({id:item.id,type:'news',label:item.headline,year,age})),...(next.transactions||[])].slice(0,400),lastYear:year,portfolioHistory:appendPoint(next.portfolioHistory,portfolioValue)};
  return {market:updated,distributions:Math.round(distributions),income:Math.round(investmentIncome),headline:allNews[0]?.headline||''};
}
