const fs=require('fs');
function edit(path,fn){const old=fs.readFileSync(path,'utf8');const next=fn(old);if(old===next)throw Error('No change: '+path);fs.writeFileSync(path,next);}
edit('src/App.jsx',s=>{
 s="import WorldFeatures from './WorldFeatures.jsx';\nimport {prepareWorldYear,finishWorldYear,businessDemand,monthlyRentalReceipt,rentalAction,successionWorld} from './livingWorld.js';\n"+s;
 s=s.replace("(a.status==='owned'&&a.rentedOut?a.rentalIncome||0:0)","monthlyRentalReceipt(a,month)");
 s=s.replace("setGame(g => { const companies=(g.companies||[]).map(c=>", "setGame(g => { g=prepareWorldYear(g);const companies=(g.companies||[]).map(c=>");
 s=s.replace("((c.performance||50)/75));const payroll", "((c.performance||50)/75)*businessDemand(c));const payroll");
 const annual="advanceNpcEconomy(advanceLifeSystems(advanceRealism(advanceFuturePlanning(prepareChildChoices(advanceNightlife(advanced)),salaryIncome)),salaryIncome+(investmentYear.distributions||0)))";
 if(!s.includes('return '+annual))throw Error('Annual anchor missing');s=s.replace('return '+annual,'return finishWorldYear('+annual+')');
 s=s.replace("setGame(g=>({...g,...successorState(g,child)","setGame(g=>successionWorld(g,child,{...g,...successorState(g,child)");
 const oldRent="if(action==='rent'&&asset.rentalIncome>0){setGame(g=>({...g,assets:g.assets.map(a=>a.id===asset.id?{...a,rentedOut:!a.rentedOut}:a)}));announce(asset.rentedOut?'Listing removed from rent.':'Property is now rented out.');return;}";
 if(!s.includes(oldRent))throw Error('Rent anchor missing');s=s.replace(oldRent,"if(action==='rent'&&asset.rentalIncome>0){const out=rentalAction(game,asset.id,asset.rentedOut?(asset.rental?.tenant?'end':'unlist'):'list');if(!out.error)setGame(out.game);announce(out.error||out.message);return;}");
 s=s.replace('<div className="asset-list-heading"><h3>Your things</h3>', '<WorldFeatures type="rentals" game={game} setGame={setGame}/><div className="asset-list-heading"><h3>Your things</h3>');
 s=s.replace('<div className="relationships-content"><button', '<div className="relationships-content"><WorldFeatures type="relationships" game={game} setGame={setGame}/><WorldFeatures type="milestones" game={game} setGame={setGame}/><button');
 s=s.replace('<article className="school-university-note">', '<WorldFeatures type="school" game={game} setGame={setGame}/><article className="school-university-note">');
 return s;
});
edit('src/RealismScreen.jsx',s=>"import WorldFeatures from './WorldFeatures.jsx';\n"+s.replace("{tab==='Work life'&&<><h2>","{tab==='Work life'&&<><WorldFeatures type=\"jobs\" game={game} setGame={setGame}/><h2>").replace("{tab==='Economy'&&<><h2>","{tab==='Economy'&&<><WorldFeatures type=\"news\" game={game} setGame={setGame}/><h2>"));
edit('src/LifeDevelopmentScreen.jsx',s=>"import WorldFeatures from './WorldFeatures.jsx';\n"+s.replace("['Achievements','🏆']", "['Achievements','🏆'],['Family legacy','📜']").replace("{tab==='Skills'", "{tab==='Family legacy'&&<WorldFeatures type=\"inheritance\" game={game} setGame={setGame} expanded/>}\n{tab==='Skills'"));
edit('src/CareerSystems.jsx',s=>"import WorldFeatures from './WorldFeatures.jsx';\n"+s.replace('<CompanySalaryPanel game=', '<WorldFeatures type="business" game={game} setGame={setGame} company={c} onNotice={setNotice}/><CompanySalaryPanel game='));
edit('src/realism.js',s=>s.replace("const commute=work||school?r.housing.commute", "const commute=school||work&&!r.career.remote?r.housing.commute"));
edit('src/main.jsx',s=>s+"\nimport './living-world.css';\n");
