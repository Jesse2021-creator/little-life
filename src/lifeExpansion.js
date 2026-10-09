export const luxuryCatalogue = [
  ['apex-hypercar','Apex V16 Hypercar','Cars','Hypercar',4800000,18500,'🏎️',1800],
  ['electric-hypercar','Volt Carbon Electric Hypercar','Cars','Hypercar',2600000,11000,'🏎️',1900],
  ['track-hypercar','Aurora Track Edition','Cars','Hypercar',3400000,14500,'🏎️',1500],
  ['mega-mansion','Oceanfront Mega Mansion','Homes','Mega mansion',85000000,125000,'🏰',40],
  ['historic-castle','Restored Historic Castle','Homes','Castle',125000000,210000,'🏰',65],
  ['royal-estate','Royal Palace Estate','Homes','Palace',250000000,380000,'🏰',100],
  ['diamond-necklace','Rare Diamond Riviera Necklace','Collectibles','Jewelry',1250000,1800,'💎',25],
  ['ruby-tiara','Royal Ruby Tiara','Collectibles','Jewelry',6500000,4800,'👑',40],
  ['emerald-earrings','Colombian Emerald Earrings','Collectibles','Jewelry',480000,650,'💎',12],
  ['sapphire-bracelet','Sapphire and Platinum Bracelet','Collectibles','Jewelry',225000,450,'💎',8],
  ['grand-watch','Grand Complication Gold Watch','Collectibles','Jewelry',950000,1200,'⌚',1],
].map(([id,name,category,kind,price,monthlyMaintenance,icon,spec])=>({
  id,name,category,kind,price,monthlyMaintenance,icon,condition:100,
  description:category==='Homes'?'An exceptional estate with extensive grounds, staff quarters, and substantial monthly upkeep.':category==='Cars'?'A limited-production performance car with specialist servicing and insurance.':'A rare luxury piece with appraisal, secure storage, and insurance costs.',
  ...(category==='Cars'?{mileage:0,horsepower:spec}:{}),
  details:[{label:'Condition',value:'New / restored · 100%'},{label:category==='Cars'?'Power':category==='Homes'?'Bedrooms':'Collection',value:category==='Cars'?`${spec} hp`:category==='Homes'?`${spec} rooms`:'Rare certified piece'},{label:'Monthly upkeep',value:`$${monthlyMaintenance.toLocaleString('en-US')}`}],
  depreciation:category==='Cars'?-.06:.015,
}));

export function successorState(previous, child) {
  // Preserve the estate while clearing the previous person's health and careers.
  return {
    will:null,pendingPregnancies:[],nightlifeYear:null,charityEvents:[],lifetimeDonations:0,sterilized:false,cosmeticProcedureYear:null,healthConditions:[],jail:null,criminalRecord:[],
    educationStatus:child.age>=18?'not-enrolled':'school',schoolRecord:null,educationLevel:child.educationLevel??(child.age>=18?1:0),education:child.education||null,universityStanding:75,universityScholarshipBalance:0,universityHousing:null,universityTuition:0,
    universityGpa:0,universityYearsCompleted:0,universityCreditsCompleted:0,
    universityCourse:null,universityStartedYear:null,universityLastAppliedYear:null,
    campusActionYear:null,campusActions:[],campusClubs:[],universityInternship:null,
    politicalOffice:null,politicalTermEnds:null,politicalServiceYears:0,politicalTotalServiceYears:0,politicalBillsPassed:0,politicalHistory:[],politicalParty:null,politicalPlatform:null,politicalReadiness:0,politicalCoalition:40,
    politicalLastCampaignYear:null,politicalActionYear:null,politicalCampaigns:0,publicApproval:48,
    creatorProfile:{},socialAccounts:{},datingMatches:[],datingPasses:0,
    fame:0,fameContract:null,publicCareer:null,careerReputation:0,careerPerformance:50,retired:false,
    companies:(previous.companies||[]).map(company=>({...company})),
    skill:child.skill||'Intelligence',avatarSeed:child.avatarSeed||child.id,
  };
}

export const outdoorEvents = {
  'Go camping':{title:'Weather changes at the campsite',text:'Clouds gather while you set up camp. Your group needs a plan before nightfall.',choices:[{label:'Use a sheltered campsite',detail:'Pay $45 for a maintained site.',result:'You camped safely and learned how to prepare for changing weather.',money:-45,stats:{happiness:6,smarts:3}},{label:'Head home before the storm',detail:'Choose a shorter adventure.',result:'You packed up safely and planned another trip.',stats:{health:3,smarts:2}}]},
  'Go fishing':{title:'A catch worth remembering',text:'You feel a strong pull on the line near a protected stretch of water.',choices:[{label:'Release the fish carefully',detail:'Practice responsible fishing.',result:'You released the fish and enjoyed a peaceful morning.',stats:{happiness:6,smarts:2}},{label:'Ask a guide about local rules',detail:'A $35 guided lesson.',result:'You learned fishing techniques and permit rules from a local guide.',money:-35,stats:{smarts:5,happiness:3}}]},
  'Ride a dirt bike':{title:'A challenging trail section',text:'The instructor points out a steep, muddy trail and a gentler alternative.',choices:[{label:'Take a supervised riding lesson',detail:'Pay $120 for gear and instruction.',result:'You practiced braking and balance on the beginner trail.',money:-120,stats:{happiness:7,health:2}},{label:'Ride the easier loop',detail:'Keep the session within your skill level.',result:'You enjoyed a steady ride without pushing beyond your experience.',stats:{happiness:4,health:2}}]},
  'Go horseback riding':{title:'Getting to know your horse',text:'Your horse seems nervous as the riding session begins.',choices:[{label:'Work with the instructor',detail:'Pay $85 for a guided session.',result:'You learned to communicate calmly and enjoyed the ride.',money:-85,stats:{happiness:6,smarts:3}},{label:'Start with groundwork',detail:'Build confidence before mounting.',result:'You groomed and led the horse, building trust patiently.',stats:{happiness:4,smarts:3}}]},
  'Go hiking':{title:'Two routes at the trail junction',text:'One route is scenic and easy; the other climbs sharply before sunset.',choices:[{label:'Take the scenic trail',detail:'Match the route to your fitness.',result:'You finished a refreshing hike with beautiful views.',stats:{health:5,happiness:5}},{label:'Book a guided summit hike',detail:'Pay $60 for a guide and preparation.',result:'A guide helped you pace the climb and reach the summit safely.',money:-60,stats:{health:3,happiness:7}}]},
  'Go off-roading':{title:'A river crossing ahead',text:'The guide checks a crossing and offers an alternative trail.',choices:[{label:'Follow the guided route',detail:'Pay $180 for a 4×4 excursion.',result:'You explored rough terrain with a trained driver and recovery equipment.',money:-180,stats:{happiness:8,smarts:2}},{label:'Take the dry trail',detail:'Avoid the crossing and enjoy the views.',result:'You completed a relaxed trail drive without risking the crossing.',stats:{happiness:5,health:2}}]},
};
