import {FameCareerPanel} from './PublicCareerPanels.jsx';
import {isFameJob,isSportsJob,signFameContract} from './publicCareers.js';
import EnrichmentScreen,{BusinessLifePanel} from './EnrichmentScreens.jsx';
import {academicGrade} from './simulationSettings.js';
import {recordJobChance} from './criminalConsequences.js';
import {EducationDepthScreen} from './LifeDepthScreens.jsx';
import CareerProgression from './CareerProgression.jsx';
import {normalizeCompanyEquity,companyEquities,stepDownCeo} from './gameFixes.js';
import WorldFeatures from './WorldFeatures.jsx';
import {companyCeoSalary} from './companySalary.js';
import {VerticalMenu,SlideChildPage,careerMenuItems} from './VerticalNavigation.jsx';
import CompanySalaryPanel from './CompanySalaryPanel.jsx';
import FamilyBusinessStaff from './FamilyBusinessStaff.jsx';
import {useFeedbackNotice} from './OutcomeFeedback.jsx';
import RealismScreen from './RealismScreen.jsx';
import {prepareInterview,employmentBonus} from './realism.js';
import {careerBonus} from './lifeSystems.js';
import {formatMoney} from './money.js';
import React, { useEffect, useState } from 'react';
import './career.css';
import PoliticalCareer from './PoliticalCareer.jsx';
import SocialMediaCareer from './CreatorStudio.jsx';
import FuturePlanningScreen from './FuturePlanningScreen.jsx';

const jobBoard = [
  { id: 'retail', title: 'Retail Associate', category: 'Entry level', qualification: 0, salary: 28000, fame: 0, description: 'Customer service, stocking and point-of-sale work.' },
  { id: 'barista', title: 'Barista', category: 'Entry level', qualification: 0, salary: 30000, fame: 0, description: 'Prepare drinks, serve customers and keep the café running.' },
  { id: 'assistant', title: 'Administrative Assistant', category: 'Office', qualification: 0, salary: 39000, fame: 0, description: 'Coordinate calendars, records and office operations.' },
  { id: 'sales', title: 'Sales Representative', category: 'Office', qualification: 0, salary: 46000, fame: 0, description: 'Build a client pipeline and earn commission from closed deals.' },
  { id: 'developer', title: 'Software Developer', category: 'Technology', qualification: 1, salary: 82000, fame: 0, description: 'Ship software, review code and collaborate with product teams.' },
  { id: 'analyst', title: 'Financial Analyst', category: 'Finance', qualification: 1, salary: 76000, fame: 0, description: 'Model performance, research markets and advise decision makers.' },
  { id: 'manager', title: 'Operations Manager', category: 'Management', qualification: 1, salary: 91000, fame: 0, description: 'Lead a team, own budgets and improve business operations.' },
  { id: 'doctor', title: 'Physician', category: 'Healthcare', qualification: 3, salary: 210000, fame: 0, description: 'Requires graduate education and a professional qualification.' },
  { id: 'actor', title: 'Screen Actor', category: 'Premium · Fame', qualification: 0, salary: 52000, fame: 5, description: 'Audition for roles. Pay and recognition depend on bookings.' },
  { id: 'musician', title: 'Recording Musician', category: 'Premium · Fame', qualification: 0, salary: 48000, fame: 5, description: 'Release music, perform and grow an audience.' },
  { id: 'director', title: 'Film Director', category: 'Premium · Fame', qualification: 1, salary: 145000, fame: 10, description: 'Pitch projects and lead cast and crew through production.' },
  { id: 'label', title: 'Music Label Executive', category: 'Premium · Fame', qualification: 1, salary: 135000, fame: 8, description: 'Find artists, negotiate releases and manage a label roster.' },
  { id: 'producer', title: 'Music Producer', category: 'Premium · Fame', qualification: 0, salary: 72000, fame: 7, description: 'Produce recordings and build a portfolio of successful releases.' },
  { id: 'comedian', title: 'Stand-up Comedian', category: 'Premium · Fame', qualification: 0, salary: 36000, fame: 6, description: 'Book shows, tour and build a following one set at a time.' },
];

const gigs = [
  { title: 'Deliver food for an evening', pay: 95, energy: 12 },
  { title: 'Freelance logo design', pay: 240, energy: 18 },
  { title: 'Tutor a student for two hours', pay: 130, energy: 14 },
  { title: 'Help a neighbor move', pay: 110, energy: 20 },
  { title: 'Complete a website bug-fix contract', pay: 380, energy: 24 },
  { title: 'Pet-sit for the weekend', pay: 175, energy: 10 },
];

const companyTypes = [
  ['Local café', 'Hospitality', 150000], ['Digital agency', 'Professional services', 225000],
  ['Neighborhood gym', 'Fitness', 325000], ['Online clothing shop', 'Retail', 185000],
  ['Mobile app studio', 'Technology', 475000], ['Food truck fleet', 'Hospitality', 250000],
  ['Property maintenance firm', 'Services', 300000], ['Indie record label', 'Entertainment', 275000],
  ['Logistics startup', 'Transport', 850000], ['Small manufacturing workshop', 'Manufacturing', 1250000],
  ['Gadget company', 'Consumer technology', 12500000], ['Pharmaceutical company', 'Life sciences', 65000000],
  ['Car manufacturer', 'Automotive', 200000000], ['Semiconductor company', 'Semiconductors', 450000000],
  ['Cleaning services company', 'Services', 90000], ['Solar installation firm', 'Energy', 600000],
  ['Video game publisher', 'Entertainment', 950000], ['Agricultural produce company', 'Agriculture', 1800000],
  ['Boutique hotel group', 'Hospitality', 5000000],
];
const investorProfiles = [
  { name: 'Maya Patel', firm: 'Northstar Capital', style: 'Growth investor', premium: 1.08, approvalThreshold: 62 },
  { name: 'Andre Okafor', firm: 'Meridian Partners', style: 'Patient capital', premium: 1.02, approvalThreshold: 58 },
  { name: 'Sofia Alvarez', firm: 'Juniper Ventures', style: 'Impact investor', premium: 1.05, approvalThreshold: 55 },
  { name: 'Daniel Brooks', firm: 'Summit Equity', style: 'Private investor', premium: .94, approvalThreshold: 68 },
  { name: 'Amina Hassan', firm: 'Cedar Ridge Fund', style: 'Industry operator', premium: 1.12, approvalThreshold: 60 },
  { name: 'Leo Tan', firm: 'Atlas Growth', style: 'Strategic investor', premium: 1.10, approvalThreshold: 65 },
];
const randomFrom = (list) => list[Math.floor(Math.random() * list.length)];
const fmt=formatMoney;
const qualLabels = ['No qualification', 'High school', 'University degree', 'Master’s degree','PhD'];
const universityPrograms = {
  Business: { tuition: 42000, smarts: 48, skill: 'Leadership', detail: 'Accounting, strategy, marketing, operations, and a final venture project.' },
  'Arts and humanities': { tuition: 38000, smarts: 42, skill: 'Creativity', detail: 'Writing, history, studio practice, research, and a portfolio or thesis.' },
  'Computer science': { tuition: 48000, smarts: 54, skill: 'Intelligence', detail: 'Programming, algorithms, systems, team software projects, and an internship track.' },
  Engineering: { tuition: 52000, smarts: 58, skill: 'Intelligence', detail: 'Mathematics, design labs, safety practice, group builds, and a capstone.' },
  'Health sciences': { tuition: 46000, smarts: 55, skill: 'Empathy', detail: 'Anatomy, public health, supervised placements, and patient-care preparation.' },
  'Social sciences': { tuition: 40000, smarts: 48, skill: 'Empathy', detail: 'Research methods, policy, statistics, field work, and a senior dissertation.' },
  Law: { tuition: 50000, smarts: 60, skill: 'Intelligence', detail: 'Legal research, case analysis, moot court, ethics, and supervised clinic work.' },
  'Pharmaceutical sciences': { tuition: 54000, smarts: 60, skill: 'Intelligence', detail: 'Chemistry, pharmacology, lab safety, clinical research, and a research project.' },
};
const fameJobIds = new Set(['actor','musician','director','label','producer','comedian']);
const fameJobTitles = new Set(['Screen Actor','Recording Musician','Film Director','Music Label Executive','Music Producer','Stand-up Comedian']);

function createCompany(type = randomFrom(companyTypes)) {
  const capital = type[2];
  const directors = [
    { id: 'founder', name: 'You', title: 'Founder & CEO', equity: 100, approvalThreshold: 0 },
    { id: `director-${Math.random().toString(36).slice(2, 7)}`, name: randomFrom(['Olivia Grant', 'Noah Williams', 'Grace Kim', 'James Mensah', 'Amara Bello', 'Ethan Clarke']), title: 'Independent director', equity: 0, approvalThreshold: 58 + Math.floor(Math.random() * 20) },
    { id: `director-${Math.random().toString(36).slice(2, 7)}`, name: randomFrom(['Priya Shah', 'Samuel Adeyemi', 'Chloe Martin', 'David Chen', 'Fatima Yusuf', 'Marcus Reed']), title: 'Finance director', equity: 0, approvalThreshold: 55 + Math.floor(Math.random() * 23) },
    { id: `director-${Math.random().toString(36).slice(2, 7)}`, name: randomFrom(['Isabella Costa', 'Michael Okoye', 'Zara Ahmed', 'Liam Murphy', 'Nneka Obi', 'Ella Thompson']), title: 'Operations director', equity: 0, approvalThreshold: 52 + Math.floor(Math.random() * 25) },
  ];
  return {
    id: `company-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: `${randomFrom(['Bright', 'Northstar', 'Evergreen', 'Pioneer', 'Bluebird', 'Copper'])} ${type[0]}`,
    type: type[0], sector: type[1], valuation: Math.round(capital * (2 + Math.random() * 5)), cash: Math.round(capital * (0.2 + Math.random() * 0.8)),
    debt: Math.round(capital * Math.random() * 0.25), ownership: 100, performance: 55, employees: 2 + Math.floor(Math.random() * 9), branches: 1,
    product: `${type[0]} core offering`, production: 65, morale: 65, reputation: 50, founded: new Date().getFullYear(), status: 'Operating',
    board: directors, shareholders: [{ id: 'founder', name: 'You', equity: 100 }],
  };
}

/** Career and business layer for the life simulator. All money effects are
 * surfaced through callbacks so the parent game can keep its single balance. */
export default function CareerSystems({ game, setGame, money, onMoney, onFame, notify, onClose }) {
  const [tab, setTab] = useState('');
  const education = game.educationLevel || 0;
  const [applications, setApplications] = useState([]);
  const [applicationInProgress, setApplicationInProgress] = useState(false);
  const gigUsed = game.gigYear === game.year;
  const [companies, setCompanies] = useState((game.companies || []).map(normalizeCompanyEquity));
  useEffect(()=>{setCompanies((game.companies||[]).map(normalizeCompanyEquity));},[game.companies]);
  const [market, setMarket] = useState(() => Array.from({ length: 6 }, () => createCompany()));
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [event, setEvent] = useState(null);
  const [saleCandidate, setSaleCandidate] = useState(null);
  const [shareSale, setShareSale] = useState(null);
  const [contractOffer, setContractOffer] = useState(null);
  const [notice, setNotice] = useFeedbackNotice('',true);
  const [startupOffer, setStartupOffer] = useState(null);
  const [courseChoice, setCourseChoice] = useState('Business');
  const [collegePrestige,setCollegePrestige]=useState(60);
  const [housingChoice, setHousingChoice] = useState('Commute from home');
  useEffect(() => { if (game.pendingBusinessEvent) setEvent(game.pendingBusinessEvent); }, [game.pendingBusinessEvent]);
  const employed = Boolean(game.job);
  const salary = game.salary || 0;
  const hasBusiness = companies.length > 0;
  const famePath = isFameJob(game.job) || String(game.career || '').includes('Fame');
  const businessRestriction = game.age < 18 ? 'You must be 18 to start a business.' : hasBusiness ? 'You can own only one business at a time.' : game.job && !famePath ? 'Leave your regular job first, or pursue a fame career to combine a job with business ownership.' : '';
  const acquisitionRestriction = game.age < 21 ? 'You must be 21 to acquire an existing business.' : hasBusiness ? 'You can own only one business at a time.' : game.job && !famePath ? 'Leave your regular job first, or pursue a fame career to combine a job with business ownership.' : '';
  const updateJob = (job) => setGame((g) => ({ ...g, job: job.title, salary: job.salary, career: job.category, careerYears: 0, fameContract: null, fame: (g.fame || 0) + (job.fame || 0) }));
  const acceptContract = (salary, years) => {
    if (!contractOffer) return;
    const { job, renewal } = contractOffer;
    setGame(g=>{const result=signFameContract(g,job,salary,years,renewal);setNotice(result.error||result.message);return result.game;});
    setContractOffer(null);

  };
  const negotiateContract = () => {
    if (!contractOffer) return;
    const base = Number(contractOffer.job.salary) || 0;
    const request = Math.round(base * 1.22);
    const negotiationPower = (game.stats?.smarts || 50) / 260 + (game.fame || 0) / 500 + (game.publicCareer?.reputation||0)/700 + (game.publicCareer?.craft||0)/700;
    if (Math.random() < Math.min(.86, .34 + negotiationPower)) acceptContract(request, 3);
    else setContractOffer({ ...contractOffer, rejected: true, counterSalary: Math.round(base * 1.04), counterYears: 2 });
  };
  const openRenewal = () => {
    const role = jobBoard.find((item) => item.title === game.job) || { title: game.job, category: game.career || 'Premium · Fame', fame: 0, salary: game.fameContract?.annualSalary || game.salary || 0 };
    setContractOffer({ job: { ...role, salary: game.fameContract?.annualSalary || game.salary || role.salary }, renewal: true });
  };
  const requireFunds = (cost) => {
    if (money < cost) { setNotice(`Not enough funds. You need ${fmt(cost - money)} more.`); return false; }
    return true;
  };
  const startCompany = (type) => {
    if (game.age < 18) { setNotice('You must be 18 to legally start a business.'); return; }
    if (hasBusiness) { setNotice('You can own or operate only one business at a time.'); return; }
    if (game.job && !famePath) { setNotice('You cannot run a business alongside a regular job. A fame career is the only exception.'); return; }
    if(money<type[2]){
      if(education<2){setNotice(`This venture needs ${fmt(type[2])} in startup capital. Venture investors require a university degree or graduate education.`);return;}
      const investor=randomFrom(investorProfiles);const equity=type[2]>=200000000?72: type[2]>=10000000?58:35;
      const probability=Math.max(.12,Math.min(.86,.28+(game.stats?.smarts||50)*.003+(game.stats?.leadership||50)*.0015+(game.careerReputation||0)*.004+(game.fame||0)*.001));
      setStartupOffer({type,investor,equity,approved:Math.random()<probability,probability});return;
    }
    const c = createCompany(type);
    onMoney?.(-type[2], `Startup: ${c.name}`);
    setCompanies((all) => [...all, c]); setGame((g) => ({ ...g, career:g.job?g.career:'Business owner', companies: [...(g.companies || []), c] })); setSelectedCompany(c.id); setTab('My Businesses');
  };
  const resolveStartupPitch=()=>{
    if(!startupOffer)return;
    const {type,investor,equity,approved}=startupOffer;
    setStartupOffer(null);
    if(!approved){setNotice(`${investor.name} of ${investor.firm} passed after reviewing the plan. Improve your track record and try another investor later.`);return;}
    const base=createCompany(type);const investorDirector={id:`director-${Date.now()}`,name:investor.name,title:`Investor director · ${investor.firm}`,equity:100-equity,approvalThreshold:investor.approvalThreshold};
    const company={...base,valuation:Math.round(type[2]*1.8),cash:Math.round(type[2]*.62),ownership:equity,ventureBacked:true,board:[...(base.board||[]).filter(d=>d.id==='founder').map(d=>({...d,equity})),investorDirector,...(base.board||[]).filter(d=>d.id!=='founder')],shareholders:[{id:'founder',name:'You',equity},{id:investorDirector.id,name:investor.name,equity:100-equity}]};
    setCompanies(all=>[...all,company]);
    setGame(g=>({...g,career:g.job?g.career:'Business owner',companies:[...(g.companies||[]),company],log:[{year:g.year,age:g.age,text:`${investor.name} at ${investor.firm} approved a ${fmt(type[2])} investment in ${company.name} for ${100-equity}% ownership and a board seat.`,tag:'Venture funding',icon:'📈'},...(g.log||[])]}));
    if(type[0]==='Car manufacturer'){
      const options=[['City electric sedan','🚘',42000],['Family electric SUV','🚙',68000],['Performance coupe','🏎️',115000]];
      setGame(g=>({...g,pendingFounderCar:{companyId:company.id,companyName:company.name,options},log:[{year:g.year,age:g.age,text:`As founder and CEO of ${company.name}, you can choose a vehicle from the company's launch fleet.`,tag:'Founder benefit',icon:'🚘'},...(g.log||[])]}));
    }
    setSelectedCompany(company.id);setTab('My Businesses');setNotice(`${investor.name} approved your pitch. You retain ${equity}% and the investor joins your board.`);
  };
  const buyCompany = (c) => {
    if (game.age < 21) { setNotice('You must be 21 to acquire an existing business.'); return; }
    if (hasBusiness) { setNotice('You can own or operate only one business at a time.'); return; }
    if (game.job && !famePath) { setNotice('You cannot combine a regular job with business ownership. A fame career is the only exception.'); return; }
    const price = Math.max(10000, Math.round(c.valuation * (0.8 + Math.random() * 0.35)));
    if (!requireFunds(price)) return;
    onMoney?.(-price, `Acquired ${c.name}`); const owned = { ...c, ownership: 100, shareholders: [{ id: 'founder', name: 'You', equity: 100 }], cash: Math.max(c.cash, price * .08) };
    setCompanies((all) => [...all, owned]); setGame((g) => ({ ...g, career:g.job?g.career:'Business owner', companies: [...(g.companies || []), owned] })); setMarket((all) => all.filter((x) => x.id !== c.id));
    setNotice(`${c.name} acquired for ${fmt(price)}. Review operations and cash flow before expanding.`);
  };
  const applyUniversity = () => {
    if(game.age<18){setNotice('University applications open at age 18 after secondary school.');return;}
    if(education<1){setNotice('Complete secondary school before applying for university.');return;}
    if(game.educationStatus==='enrolled'||game.educationStudy){setNotice('You are already enrolled. Age up to complete each academic year.');return;}
    if(game.universityLastAppliedYear===game.year){setNotice('You have already applied this year. Wait until next year to submit another application.');return;}
    const applicationFee=75;const tuition=Math.round((universityPrograms[courseChoice]?.tuition||42000)*(.4+collegePrestige/100));
    if(collegePrestige===90&&(academicGrade(game)||70)<80){setNotice('Prestigious institutions require a secondary-school grade of at least 80%.');return;}
    if(!requireFunds(applicationFee))return;
    const program=universityPrograms[courseChoice]||universityPrograms.Business;
    const chance=Math.max(.12,Math.min(.94,.36+(game.skills?.Discipline||0)*.0007+(game.stats?.smarts??50)*.0045+(game.skill===program.skill?.12:0)+Math.max(0,((academicGrade(game)||70)-70))*.003));
    const accepted=Math.random()<Math.max(.12,chance-(collegePrestige===90?.15:collegePrestige===30?-.1:0));
    const housingCost=housingChoice==='Campus residence'?12000:housingChoice==='Shared student apartment'?9000:0;const scholarshipUsed=Math.min(game.universityScholarshipBalance||0,tuition);const firstYearCost=tuition-scholarshipUsed+housingCost;
    const cashAfterFee=Math.max(0,money-applicationFee);const tuitionFromSavings=accepted?Math.min(firstYearCost,cashAfterFee):0;const studentFinance=accepted?firstYearCost-tuitionFromSavings:0;
    onMoney?.(-(applicationFee+tuitionFromSavings),accepted?'University application and first-year costs':'University application fee');
    if(accepted){const monthly=studentFinance?Math.round(studentFinance*.055/12/(1-Math.pow(1+.055/12,-120))):0;setGame(g=>({...g,educationStatus:'enrolled',universityPrestige:collegePrestige,universityScholarshipBalance:Math.max(0,(g.universityScholarshipBalance||0)-scholarshipUsed),universityYearsCompleted:0,universityCreditsCompleted:0,universityCreditsRequired:120,universityYearsRequired:4,universityCourse:courseChoice,universityHousing:housingChoice,universityGpa:Math.max(1.2,Math.min(3.8,1.2+(g.stats?.smarts??50)*.026)),universityStanding:75,universityStartedYear:g.year,universityLastAppliedYear:g.year,universityTuition:tuition,campusActions:[],campusClubs:[],loans:studentFinance?[{id:`student-loan-${g.year}-${Date.now()}`,purpose:'Student tuition',principal:studentFinance,balance:studentFinance,apr:.055,termMonths:120,monthlyPayment:monthly,monthsPaid:0,status:'active',studentLoan:true},...(g.loans||[])]:g.loans||[],log:[{year:g.year,age:g.age,text:`Your application to study ${courseChoice} was accepted. You enrolled in the ${housingChoice.toLowerCase()} plan. You paid ${fmt(tuitionFromSavings)} from available funds${studentFinance?` and financed ${fmt(studentFinance)} through a ten-year student loan`:''}.`,tag:'University begins',icon:'🎓'},...(g.log||[])]}));setNotice(`Accepted into ${courseChoice}! First year: ${fmt(tuition)} tuition${housingChoice==='Commute from home'?' and no campus housing fee':` plus ${fmt(housingChoice==='Campus residence'?12000:9000)} housing`}. ${studentFinance?`${fmt(studentFinance)} is financed as a student loan.`:'Tuition is paid.'}`);}
    else{setGame(g=>({...g,universityApplicationStatus:'declined',universityLastAppliedYear:g.year,log:[{year:g.year,age:g.age,text:'Your university application was declined. You can strengthen your academic record or try again next year.',tag:'University application',icon:'📨'},...(g.log||[])]}));setNotice('Your application was declined this year. You can build your record and apply again next year.');}
  };
  const takeYearOff = () => {
    if(game.age<18){setNotice('You can plan a gap year after turning 18.');return;}
    if(game.educationStatus==='enrolled'||game.educationStudy){setNotice('You are already enrolled. Finish or leave your current program before taking time off.');return;}
    if(game.gapYearUsed){setNotice('You have already taken a gap year. You can apply to university when you are ready.');return;}
    setGame(g=>({...g,gapYearAt:g.year,gapYearUsed:true,educationStatus:'gap-year',log:[{year:g.year,age:g.age,text:'You decided to take a year away from formal education. You can work, travel, or explore your interests before applying to university.',tag:'A year off',icon:'🌿'},...(g.log||[])]}));
    setNotice('You have taken a year off. University applications remain open next year.');
  };
  const campusAction=(action)=>{
    if(game.educationStatus!=='enrolled'){setNotice('Enroll in a university program before using campus services.');return;}
    if(game.campusActionYear===game.year){setNotice('You have used your main campus opportunity this academic year. Age up to continue.');return;}
    const outcomes={study:{gpa:.18,standing:4,smarts:3,happiness:-2,cost:0,text:'You followed a structured study plan and performed strongly on coursework.'},tutor:{gpa:.13,standing:3,smarts:2,happiness:1,cost:180,text:'A tutoring session clarified difficult material and improved your confidence.'},society:{gpa:.02,standing:3,smarts:0,happiness:5,cost:80,text:'You joined a student society, met peers, and practiced working on a team.'},internship:{gpa:.04,standing:6,smarts:1,happiness:2,cost:0,text:'You interviewed for a degree-related internship.'},rest:{gpa:-.02,standing:1,smarts:0,happiness:5,cost:0,text:'You made room for sleep and friends. Your wellbeing improved and you returned to class refreshed.'},research:{gpa:.12,standing:5,smarts:3,happiness:-1,cost:0,text:'You helped a faculty member with research and earned a strong academic reference.'},workstudy:{gpa:-.03,standing:1,smarts:1,happiness:2,cost:0,text:'You completed a paid work-study shift and learned to balance a job with classes.'},advisor:{gpa:.05,standing:4,smarts:1,happiness:2,cost:0,text:'You met your academic advisor and made a practical plan for your course load.'}};
    const outcome=outcomes[action];if(money<outcome.cost){setNotice(`You need ${fmt(outcome.cost)} for this campus activity.`);return;}
    if(outcome.cost)onMoney?.(-outcome.cost,'University tutoring');
    const gpa=Math.max(0,Math.min(4,(Number(game.universityGpa)||2.8)+outcome.gpa+(Math.random()-.45)*.08));
    const internship=action==='internship'?Math.random()<Math.min(.9,.32+(game.universityStanding||70)*.004+(game.stats?.smarts||50)*.002):false;
    setGame(g=>({...g,campusActionYear:g.year,universityGpa:gpa,universityStanding:Math.max(0,Math.min(100,(g.universityStanding||70)+outcome.standing)),campusActions:[action,...(g.campusActions||[])].slice(0,12),campusClubs:action==='society'?[...(g.campusClubs||[]),'Student society']:g.campusClubs||[],universityInternship:internship?{course:g.universityCourse,year:g.year,status:'secured'}:g.universityInternship,universityInternshipApplications:action==='internship'?(g.universityInternshipApplications||0)+1:g.universityInternshipApplications,stats:{...g.stats,smarts:Math.max(0,Math.min(100,(g.stats?.smarts||50)+outcome.smarts)),happiness:Math.max(0,Math.min(100,(g.stats?.happiness||50)+outcome.happiness))},log:[{year:g.year,age:g.age,text:`${outcome.text}${action==='internship'?(internship?' Your application succeeded and you received an internship offer.':' The employer selected another candidate this year.') :''} GPA now ${gpa.toFixed(2)}.`,tag:'University life',icon:action==='internship'?'💼':'🎓'},...(g.log||[])]}));
    setNotice(`${outcome.text}${action==='internship'?(internship?' Internship secured.':' No offer this time; you can try next academic year.') :''} Current GPA: ${gpa.toFixed(2)}.`);
  };
  const continueEducation = () => {
    if(education>=2){setTab('University');setNotice('Choose a postgraduate pathway. Qualifications require completing academic years.');return;}
    if (education >= 3) { setNotice('You have completed the highest education level available in this career simulation.'); return; }
    if (education === 1) { applyUniversity(); return; }
    if (game.educationStatus === 'enrolled') { setNotice('You are enrolled at university. Age up to complete the next academic year.'); return; }
    if (education === 0) {
      if (game.age < 18) { setNotice('High school graduation is available at age 18. Keep studying and building your academic record.'); return; }
      setGame(g => ({ ...g, educationLevel: 1, education: 'High school graduate' }));
      setNotice('High school completed. You can now apply for roles that require a high school qualification.');
      return;
    }
    if (education === 2 && game.age < 22) { setNotice('Graduate school enrollment is available after completing an undergraduate degree.'); return; }
    const tuition = 36000;
    if (!requireFunds(tuition)) return;
    onMoney?.(-tuition, 'Graduate tuition');
    const next = education + 1;
    setGame(g => ({ ...g, educationLevel: next, education: next === 2 ? 'University graduate' : 'Graduate degree' }));
    setNotice(`${qualLabels[next]} completed. Your qualification is saved with this life.`);
  };
  const apply = (job) => {
    if(!game.alive||game.jail?.yearsRemaining>0){setNotice('You must be living and free to work before applying.');return;}
    if (applicationInProgress || applications.includes(job.id)) return;
    if(game.pendingInterview){setTab('Work life');setNotice('Complete your pending interview before applying elsewhere.');return;}
    if (game.job) { setNotice(`You already work as ${game.job}. Leave that role before applying elsewhere.`); return; }
    if (hasBusiness && !fameJobIds.has(job.id)) { setNotice('A business owner cannot take a regular job. Only fame careers can be combined with one business.'); return; }
    if(game.age<13){setNotice('Fame auditions open at age 13; regular jobs open at 16.');return;}
    if (game.age < 16 && !['actor','musician','comedian'].includes(job.id)) { setNotice('You must be at least 16 to apply for this position. Build your skills and return when you are old enough.'); return; }
    if (['football','basketball'].includes(job.id) && game.age < 18) { setNotice('Professional league applications open at age 18.'); return; }
    if (education < job.qualification) { setNotice(`${job.title} requires ${qualLabels[job.qualification]}. Your current level is ${qualLabels[education]}.`); return; }
    setApplications((a) => [...a, job.id]);
    setApplicationInProgress(true);
    const skillFit = (['football','basketball'].includes(job.id) && game.skill === 'Athletics') ? .18 : (['actor','musician','producer','comedian','director'].includes(job.id) && game.skill === 'Creativity') ? .14 : (['manager','label'].includes(job.id) && game.skill === 'Leadership') ? .12 : 0;
    const recordPenalty = Math.min(.28, (game.criminalRecord || []).length * .09);
    const chance = recordJobChance(game,Math.max(.08, Math.min(.9, .4 + education * .09 + (game.stats?.smarts || 50) * .002 + skillFit + careerBonus(game,job.title) + employmentBonus(game) + Math.random() * .15 - recordPenalty)));
    setTimeout(() => {
      setApplicationInProgress(false);
      if (Math.random() < chance) {
        if (fameJobIds.has(job.id)) setContractOffer({ job, renewal: false });
        else { setGame(g=>prepareInterview(g,job));setTab('Work life');setNotice(`You were shortlisted for ${job.title}. Complete your interview below.`); }
      }
      else setNotice(`Your application for ${job.title} was declined.${game.criminalRecord?.length?' Your criminal record made the background check much harder.':''} Improve your experience or qualifications and try again.`);
    }, 650);
  };
  const doGig = () => {
    if (game.age < 16) { setNotice('Quick gigs are available from age 16.'); return; }
    if (gigUsed) { setNotice('You have completed this year’s quick gig. Age up to find a new opportunity.'); return; }
    const gig = randomFrom(gigs); setGame(g => ({ ...g, gigYear: g.year })); onMoney?.(gig.pay, gig.title); setNotice(`Gig complete: ${gig.title}. You earned ${fmt(gig.pay)} without aging up.`);
  };
  const updateCompany = (id, patch) => {
    const next = companies.map((c) => c.id !== id ? c : normalizeCompanyEquity({ ...c, ...patch })); setCompanies(next); setGame((g) => ({ ...g, companies: next }));
    setSelectedCompany((old) => old === id ? id : old);
  };
  const openBranch = (c) => {
    const cost = Math.max(5000, Math.round(c.valuation * .06));
    if (c.cash < cost) { setNotice(`The company needs ${fmt(cost - c.cash)} more in working capital before it can open another branch.`); return; }
    updateCompany(c.id, { branches: c.branches + 1, cash: c.cash - cost, valuation: Math.round(c.valuation * 1.08) });
    setNotice(`Branch ${c.branches + 1} opened for ${fmt(cost)}. Expansion also increases annual overhead.`);
  };
  const setStaff = (c, employees) => {
    const hiringCost = Math.max(0, employees - c.employees) * 1800;
    if (c.cash < hiringCost) { setNotice(`The company needs ${fmt(hiringCost - c.cash)} more to cover recruiting and onboarding.`); return; }
    updateCompany(c.id, { employees, cash: c.cash - hiringCost, morale: Math.max(20, Math.min(100, c.morale + (employees < c.employees ? -3 : 2))) });
  };
  const setProduction = (c, production) => {
    const investment = Math.max(0, production - c.production) * 110;
    if (c.cash < investment) { setNotice(`The company needs ${fmt(investment - c.cash)} more to fund that production increase.`); return; }
    updateCompany(c.id, { production, cash: c.cash - investment, performance: Math.min(100, c.performance + (production > c.production ? 1 : 0)) });
  };
  const sellCompany = (c) => {
    const proceeds=Math.max(0,Math.round(((c.valuation||0)*(c.ownership||0)/100-(c.debt||0))*(.78+(c.performance||50)/500)));
    onMoney?.(proceeds, `Business sale · ${c.name}`);
    const remaining=companies.filter(item=>item.id!==c.id);
    setCompanies(remaining);
    setGame(g=>{const companies=remaining.map(c=>({...c,ceoSalary:companyCeoSalary(g,c)}));const keepCeo=g.job==='Founder & CEO'&&companies.length>0;return {...g,companies,job:g.job==='Founder & CEO'?(keepCeo?g.job:null):g.job,salary:g.job==='Founder & CEO'?companies.reduce((sum,c)=>sum+c.ceoSalary,0):g.salary,career:keepCeo?'Business owner':g.job==='Founder & CEO'?'Not employed':g.career};});
    setSaleCandidate(null);
    setNotice(`${c.name} sold. After debt and transaction costs, ${fmt(proceeds)} was added to your personal cash.`);
  };
  const openShareSale = (c) => {
    const available = investorProfiles.filter((buyer) => !(c.board || []).some((director) => director.name === buyer.name));
    setShareSale({ companyId: c.id, percent: Math.min(10, Math.max(1, (c.ownership || 0) - 10)), buyer: randomFrom(available.length ? available : investorProfiles) });
  };
  const completeShareSale = () => {
    if (!shareSale) return;
    const c = companies.find((company) => company.id === shareSale.companyId);
    if (!c) { setShareSale(null); return; }
    const percent = Number(shareSale.percent);
    const maxSale = Math.max(0, (c.ownership || 0) - 10);
    if (!Number.isFinite(percent) || percent < 1 || percent > maxSale) {
      setShareSale((current) => ({ ...current, error: `Enter 1–${maxSale}% so you retain at least 10% ownership.` })); return;
    }
    const buyer = shareSale.buyer;
    const proceeds = Math.round(c.valuation * percent / 100 * buyer.premium);
    const shareholders = c.shareholders || [{ id: 'founder', name: 'You', equity: c.ownership }];
    const buyerHolding = shareholders.find((holder) => holder.id === buyer.name);
    const nextShareholders = companyEquities(c).map((holder) => holder.id === 'founder' ? { ...holder, equity: Math.max(0, c.ownership - percent) } : holder);
    if (buyerHolding) {
      const existingBuyer = nextShareholders.find((holder) => holder.id === buyer.name);
      if (existingBuyer) existingBuyer.equity += percent;
    } else nextShareholders.push({ id: buyer.name, name: buyer.name, firm: buyer.firm, equity: percent });
    const directors = c.board || [];
    const alreadyDirector = directors.some((director) => director.name === buyer.name);
    updateCompany(c.id, {
      ownership: c.ownership - percent,
      shareholders: nextShareholders,
      board: alreadyDirector ? directors : [...directors, { ...buyer, id: buyer.name, title: 'Investor director', equity: percent }],
      lastEquitySaleYear: game.year,
    });
    onMoney?.(proceeds, `Equity sale · ${c.name} (${percent}%)`);
    setShareSale(null);
    setNotice(`${buyer.name} of ${buyer.firm} bought ${percent}% of ${c.name} for ${fmt(proceeds)}. The proceeds were paid to you personally, and ${buyer.name} joined the board as an investor director.`);
  };
  const raiseFunding = (c) => {
    if (education < 2) { setNotice('Venture funding requires a university degree or graduate education. Complete university first.'); return; }
    if (c.fundingRound >= 3 || c.lastFundingYear === game.year) { setNotice(c.fundingRound >= 3 ? 'The company has reached this simulation’s three-round venture limit.' : 'The company can close one funding round per financial year.'); return; }
    const recordCount=(game.criminalRecord||[]).length;
    if(recordCount&&Math.random()<Math.min(.75,.25*recordCount)){setNotice('The investors completed background checks and declined the round because of your criminal record.');updateCompany(c.id,{lastFundingYear:game.year});return;}
    const dilution = 20 + Math.floor(Math.random() * 21);
    const amount = Math.round(c.valuation * (.35 + Math.random() * .45));
    const sold=Math.min(dilution,Math.max(0,c.ownership-10));const investor=randomFrom(investorProfiles);const id=`funding-${Date.now()}`;const holders=companyEquities(c).map(h=>h.id==='founder'?{...h,equity:c.ownership-sold}:h);holders.push({id,name:investor.name,equity:sold});
    updateCompany(c.id, { shareholders:holders,board:[...(c.board||[]),{...investor,id,title:'Investor director',equity:sold}],cash: c.cash + amount, ownership: c.ownership-sold, valuation: Math.round(c.valuation * (1.05 + Math.random() * .15)), fundingRound: (c.fundingRound || 0) + 1, lastFundingYear: game.year });
    setNotice(`Term sheet accepted: investors put in ${fmt(amount)} for ${dilution}% equity. You now own ${Math.max(10, c.ownership - dilution)}%. Review future dilution carefully.`);
  };
  const seekValuation = (c) => {
    const estimate = Math.round(Math.max(0, c.cash - c.debt) + c.valuation * (.45 + c.performance / 200));
    setNotice(`${c.name} estimated enterprise value: ${fmt(estimate)}. Equity value after ${fmt(c.debt)} debt: ${fmt(Math.max(0, estimate - c.debt))}. This is an estimate, not cash you can withdraw.`);
  };
  const tickCompany = (c) => {
    const eventChoices = [
      { title: 'A supplier raises prices by 12%', options: [{ label: 'Accept the new terms', patch: { cash: c.cash - 4500, performance: c.performance - 2 } }, { label: 'Find a new supplier', patch: { cash: c.cash - 1800, performance: c.performance + 3 } }] },
      { title: 'A major client asks for a rush order', options: [{ label: 'Pay overtime and deliver', patch: { cash: c.cash - 2400, performance: c.performance + 8, reputation: c.reputation + 5 } }, { label: 'Decline and protect the team', patch: { morale: c.morale + 4, performance: c.performance - 2 } }] },
      { title: 'Employees request better benefits', options: [{ label: 'Approve a benefits budget', patch: { cash: c.cash - 3200, morale: c.morale + 12, performance: c.performance + 3 } }, { label: 'Schedule a staff meeting', patch: { morale: c.morale - 4, reputation: c.reputation - 2 } }] },
    ];
    setEvent({ companyId: c.id, ...randomFrom(eventChoices) });
  };
  const operate = (c, choice) => {
    updateCompany(c.id, choice.patch); setEvent(null); setGame(g => ({ ...g, pendingBusinessEvent: null }));
    setNotice(`${choice.label}. The decision is recorded in ${c.name}'s operations.`);
  };

  const quitJob = () => {const ceo=game.job==='Founder & CEO';setGame(g=>ceo?stepDownCeo(g):({...g,job:null,salary:0,career:hasBusiness?'Business owner':'Not employed',fameContract:null}));setNotice(ceo?'You stepped down as CEO. Professional management will run the company; you keep your shares.':'You left your job. Salary has stopped.');};

  return <section className="career-system">
    <header className="career-heading" hidden={Boolean(tab)}><div><span className="career-kicker">LIFE & WORK</span><h1>Career & Enterprise</h1><p>Build a livelihood, grow a company, and make the calls that shape your future.</p></div><div className="career-status"><b>{employed ? game.job : hasBusiness ? 'Business owner' : 'Not employed'}</b><span>{employed ? fmt(salary)+' / year' : 'No employment salary'}</span>{employed&&<button className="career-quit" onClick={quitJob}>{game.job==='Founder & CEO'?'Step down as CEO':'Leave job'}</button>}</div></header>
    <div className="navigation-root" hidden={Boolean(tab)}><VerticalMenu items={hasBusiness?[careerMenuItems.find(i=>i.id==='My Businesses'),...careerMenuItems.filter(i=>i.id!=='My Businesses')]:careerMenuItems} onSelect={setTab} label="Career sections"/></div>
    {tab&&<SlideChildPage key={tab} title={tab} eyebrow="CAREER" onBack={()=>setTab('')} onClose={onClose||(()=>setTab(''))}>

    {['Retirement','Family business'].includes(tab)&&<FuturePlanningScreen game={game} setGame={setGame} section={tab}/>}
    {tab==='Work life'&&<RealismScreen game={game} setGame={setGame} initialTab="Work life"/>}
    {tab==='Politics'&&<PoliticalCareer game={game} setGame={setGame} moneyAvailable={money} onMoney={onMoney}/>}
    {tab==='Social Media'&&<SocialMediaCareer game={game} setGame={setGame}/>}

    {!employed && !['Politics','Social Media','Retirement','Family business'].includes(tab) && <div className="career-callout"><b>💼 No job, no salary</b><span>You will not receive employment income until you apply and accept a job. One-off gigs are available for quick cash.</span></div>}
    {tab === 'Jobs' && <div className="career-content">{!isFameJob(game.job)&&<CareerProgression game={game} setGame={setGame}/>}<FameCareerPanel game={game} setGame={setGame} onSocial={()=>setTab('Social Media')} onRenew={openRenewal}/>{isSportsJob(game.job)&&<div className="career-callout"><b>Your sporting career is managed in Sports Career</b><button className="career-secondary" onClick={()=>setTab('Sports Career')}>Open Sports Career</button></div>}<div className="career-section-title"><div><h2>Open positions</h2><p>Applications consider your education and standing. Offers may be declined.</p></div><div className="education-progress"><span className="career-chip">🎓 EDUCATION</span><b>{qualLabels[education]}</b>{education!==1&&<button className="career-secondary" onClick={continueEducation}>{education===0?`Secondary school · age 18`:education===2?`Attend graduate school · ${fmt(36000)}`:education===3?`Explore PhD study`:`Education complete`}</button>}{game.age>=18&&education===1&&game.educationStatus!=='enrolled'&&<div className="university-choice-row"><button className="career-secondary" onClick={applyUniversity} disabled={game.universityLastAppliedYear===game.year}>{game.universityLastAppliedYear===game.year?'Applied · wait until next year':'Apply for university · $75 + tuition varies by program'}</button><button className="career-secondary" onClick={takeYearOff} disabled={game.gapYearUsed}>{game.gapYearUsed?'Gap year taken':'Take a year off'}</button></div>}{game.educationStatus==='enrolled'&&<div className="university-status"><b>🎓 {game.universityCourse||'University'} · Year {(game.universityYearsCompleted||0)+1} · {game.universityCreditsCompleted||0}/120 credits</b><span>Age up once per academic year. Your degree is awarded after four years.</span></div>}</div></div>{employed && !isSportsJob(game.job) && (fameJobTitles.has(game.job) ? <div className="career-callout contract-status"><b>🎬 Fame contract · {game.fameContract?.status === "active" ? `${game.fameContract.yearsRemaining} years remaining` : "Renewal needed"}</b><span>{game.fameContract?.status === "active" ? `Performance ${game.fameContract.performance}% · ${fmt(game.fameContract.annualSalary || game.salary)} annual pay` : "Your contract has expired. Secure a new deal to resume contract income."}</span>{game.fameContract?.status !== "active" && <button className="career-secondary" onClick={openRenewal}>Negotiate a new contract</button>}</div> : <div className="career-callout promotion-status"><b>📈 {game.job} · Career progression</b><span>{game.careerYears || 0} years in this role · Annual salary {fmt(game.salary)}. Raises and promotions are reviewed each year based on your experience and performance.</span></div>)}{(employed||hasBusiness)&&<div className="career-callout"><b>🔒 One active career at a time</b><span>{employed ? 'Leave your current job before applying for another position. ' : ''}{hasBusiness ? 'Business owners may apply for fame careers only.' : ''}</span></div>}<div className="job-grid">{jobBoard.map((job) => <article className="career-card job-card" key={job.id}><div className="job-top"><span className="career-chip">{job.category}</span>{job.fame > 0 && <span className="fame-chip">⭐ Fame</span>}</div><h3>{job.title}</h3><p>{job.description}</p><div className="career-meta"><span>Annual pay</span><b>{fmt(job.salary)}</b></div><div className="career-meta"><span>Minimum education</span><b>{qualLabels[job.qualification]}</b></div><button className="career-action" disabled={applications.includes(job.id) || game.job === job.title || Boolean(game.job) || Boolean(hasBusiness && !fameJobIds.has(job.id)) || applicationInProgress} onClick={() => apply(job)}>{game.job === job.title ? 'Current job' : applicationInProgress ? 'Reviewing application…' : applications.includes(job.id) ? 'Application sent…' : 'Apply for job'}</button></article>)}</div></div>}
    {tab==='University'&&<div className="career-content university-panel"><EducationDepthScreen game={game} setGame={setGame}/><div className="career-section-title"><div><h2>University & campus life</h2><p>Choose a course, build your academic standing, and make decisions that shape future opportunities.</p></div><span className="instant-badge">🎓 STUDENT LIFE</span></div>{game.age<18?<div className="career-callout"><b>University applications open at age 18</b><span>Complete secondary school first, then choose a course and submit an application.</span></div>:education<1?<div className="career-callout"><b>Secondary school qualification required</b><span>{game.education||'Complete your secondary education'} before applying to university.</span><button className="career-secondary" onClick={continueEducation}>Complete secondary school</button></div>:game.educationStatus==='enrolled'?<><div className="university-dashboard"><div><small>PROGRAM</small><b>{game.universityCourse}</b><span>Year {(game.universityYearsCompleted||0)+1} of {game.universityYearsRequired||4}</span></div><div><small>CURRENT GPA</small><b>{(game.universityGpa||2.8).toFixed(2)} / 4.00</b><span>{(game.universityGpa||2.8)>=3.6?'Honors track':(game.universityGpa||2.8)>=2.5?'Good standing':'Academic warning'}</span></div><div><small>ACADEMIC STANDING</small><b>{game.universityStanding||70}%</b><span>{game.universityInternship?'Internship secured':'Internship experience helps job applications'}</span></div></div><div className="university-detail-grid"><article><small>DEGREE PROGRESS</small><b>{game.universityCreditsCompleted||0} / {game.universityCreditsRequired||120} credits</b><span>{game.universityLastCreditsEarned||0} credits earned last year · degree requires 120</span></article><article><small>ACADEMIC STANDING</small><b>{game.universityGpa<1.5?'Suspension review':game.universityGpa<2?'Probation':game.universityGpa>=3.6?'Dean’s list':'Good standing'}</b><span>Keep cumulative GPA at 2.00+ to earn a full year of credits.</span></article><article><small>STUDENT LIFE</small><b>{game.universityHousing||'Commute from home'}</b><span>{(game.campusClubs||[]).length} societies · {game.universityInternshipApplications||0} internship applications</span></article></div><h3 className="university-subtitle">Plan your academic year</h3><div className="campus-actions-grid">{[['study','📚','Study session','Improve GPA and smarts'],['tutor','🧑‍🏫','Book a tutor · $180','Get help with a difficult subject'],['society','🎭','Join a society · $80','Build friendships and campus involvement'],['internship','💼','Apply for internship','Gain relevant experience and references'],['rest','🌿','Rest & reset','Protect your wellbeing this year']].map(([id,icon,title,detail])=><button key={id} disabled={game.campusActionYear===game.year} onClick={()=>campusAction(id)}><span>{icon}</span><b>{game.campusActionYear===game.year&&game.campusActions?.[0]===id?'Completed this year':title}</b><small>{detail}</small></button>)}</div><div className="campus-actions-grid campus-special-actions"><button disabled={game.campusActionYear===game.year} onClick={()=>campusAction('research')}><span>🔬</span><b>Research assistant</b><small>Faculty reference and course-related research</small></button><button disabled={game.campusActionYear===game.year} onClick={()=>campusAction('workstudy')}><span>🧾</span><b>Campus work-study</b><small>Build experience while balancing classes</small></button><button disabled={game.campusActionYear===game.year} onClick={()=>campusAction('advisor')}><span>🗓️</span><b>Meet academic advisor</b><small>Course planning and standing support</small></button></div><div className="university-policy-note"><b>📋 Academic year</b><span>Choose one major campus activity each year, then age up to complete classes. Grades depend on preparation, events, and your choices.</span></div></>:<><label className="university-course-picker">Institution prestige<select value={collegePrestige} onChange={e=>setCollegePrestige(Number(e.target.value))}><option value={30}>Community institution · 30/100</option><option value={60}>Regional university · 60/100</option><option value={90}>Prestigious university · 90/100</option></select></label><label className="university-course-picker">Choose a program<select value={courseChoice} onChange={e=>setCourseChoice(e.target.value)}>{['Business','Arts and humanities','Computer science','Engineering','Health sciences','Social sciences','Law','Pharmaceutical sciences'].map(course=><option key={course}>{course}</option>)}</select></label><article className="university-application-card"><div><span>🏛️</span><div><b>{courseChoice} · four-year degree</b><small>Application $75 · Tuition {fmt(Math.round((universityPrograms[courseChoice]?.tuition||42000)*(.4+collegePrestige/100)))} · Prestige {collegePrestige}/100. Merit awards reduce tuition.</small></div></div><div className="university-admissions-stats"><span>Smarts <b>{game.stats?.smarts||50}%</b></span><span>Academic record <b>{academicGrade(game)||70}%</b></span><span>Skill fit <b>{game.skill||'General'}</b></span></div><label className="university-course-picker">Living arrangement<select value={housingChoice} onChange={e=>setHousingChoice(e.target.value)}><option>Commute from home</option><option>Campus residence</option><option>Shared student apartment</option></select></label><p className="university-finance-copy">Tuition varies by program. Unpaid first-year costs are financed with a student loan at 5.5% APR; repayments are deferred while enrolled and begin after graduation. Campus residence costs $12,000 per year, shared housing $9,000, and commuting from home has no housing charge.</p><button className="career-action" disabled={game.universityLastAppliedYear===game.year} onClick={applyUniversity}>{game.universityLastAppliedYear===game.year?'Application submitted this year':`Apply · $75 fee + ${fmt(Math.max(0,Math.round((universityPrograms[courseChoice]?.tuition||42000)*(.4+collegePrestige/100))-(game.universityScholarshipBalance||0))+(housingChoice==="Campus residence"?12000:housingChoice==="Shared student apartment"?9000:0))} first-year costs`}</button><button className="career-secondary" onClick={takeYearOff} disabled={game.gapYearUsed}>{game.gapYearUsed?'Gap year already used':'Take a year off'}</button></article></>}</div>}    {tab === 'Quick gigs' && <div className="career-content gig-panel"><div className="career-section-title"><div><h2>Odd jobs & freelance</h2><p>One short contract can pay immediately. No age-up required.</p></div><span className="instant-badge">⚡ INSTANT PAY</span></div>{game.age<16&&<div className="career-callout"><b>🔒 Quick gigs unlock at age 16</b><span>Age up to become eligible for paid casual work.</span></div>}<div className="gig-card"><div className="gig-illustration">🧰</div><div className="gig-copy"><h3>Find a quick gig</h3><p>We’ll match you with a one-off task based on what’s available nearby.</p><span>Typical payout $90 – $400 · refreshed after each year</span></div><button className="career-action" disabled={game.age<16||gigUsed} onClick={doGig}>{game.age<16?'Available at 16':gigUsed?'Come back next year':'Find a gig'}</button></div></div>}
    {tab === 'Start a business' && <div className="career-content"><div className="career-section-title"><div><h2>Choose your first venture</h2><p>Start independently and retain ownership. Keep working capital for payroll, inventory and unexpected bills.</p></div><span className="instant-badge">🏗️ FOUNDER</span></div>{businessRestriction&&<div className="career-callout"><b>🔒 Business requirements</b><span>{businessRestriction}</span></div>}<div className="business-grid">{[...companyTypes].sort((a,b)=>a[2]-b[2]||a[0].localeCompare(b[0])).map((type) => <article className="career-card" key={type[0]}><span className="business-icon">{type[1] === 'Technology' ? '💻' : type[1] === 'Hospitality' ? '☕' : type[1] === 'Fitness' ? '🏋️' : type[1] === 'Manufacturing' ? '⚙️' : '🏢'}</span><span className="career-chip">{type[1]}</span><h3>{type[0]}</h3><p>Estimated setup capital</p><strong className="venture-cost">{fmt(type[2])}</strong><div className="career-meta"><span>Founder equity</span><b>100%</b></div><button className="career-action" disabled={Boolean(businessRestriction)} onClick={() => startCompany(type)}>{businessRestriction||(money<type[2]?(education<2?'Needs university for VC':'Pitch to investors'):'Plan & start')}</button></article>)}</div><div className="funding-note"><b>📈 Venture funding</b><p>Once your company is operating, you can pitch investors for growth capital. Funding trades part of your ownership for cash. A university or graduate qualification is required to seek venture funding.</p></div></div>}
    {tab === 'Acquire a business' && <div className="career-content"><div className="career-section-title"><div><h2>Businesses for sale</h2><p>Listings refresh each year. Review debts, cash and operating performance before buying.</p></div><button className="career-secondary" onClick={() => setMarket(Array.from({ length: 6 }, () => createCompany()))}>↻ Refresh listings</button></div>{acquisitionRestriction&&<div className="career-callout"><b>🔒 Acquisition requirements</b><span>{acquisitionRestriction}</span></div>}<div className="business-grid">{market.map((c) => <article className="career-card" key={c.id}><span className="career-chip">{c.sector}</span><h3>{c.name}</h3><p>{c.type} · {c.employees} employees · {c.branches} branch</p><div className="career-meta"><span>Estimated value</span><b>{fmt(c.valuation)}</b></div><div className="career-meta"><span>Cash / debt</span><b>{fmt(c.cash)} / {fmt(c.debt)}</b></div><div className="career-meta"><span>Performance</span><b>{c.performance}%</b></div><button className="career-action" disabled={Boolean(acquisitionRestriction)} onClick={() => buyCompany(c)}>{acquisitionRestriction||'Acquire business'}</button></article>)}</div></div>}
    {tab==='Sports Career'&&<EnrichmentScreen type={tab} game={game} setGame={setGame} onSocial={()=>setTab('Social Media')}/>}
    {tab === 'My Businesses' && <div className="career-content"><div className="career-section-title"><div><h2>Your companies</h2><p>Manage staff, production and locations. Profits are not personal salary until paid out.</p></div></div>{companies.length === 0 ? <div className="career-empty"><span>🏢</span><h3>Your next chapter could be your own</h3><p>Start from scratch or acquire an operating company.</p><button className="career-action" onClick={() => setTab('Start a business')}>Explore ventures</button></div> : <div className="owned-businesses">{companies.map((c) => <article className="career-card owned-company" key={c.id}><div className="company-banner"><span>🏢</span><div><span className="career-chip">{c.sector}</span><h3>{c.name}</h3><p>{c.type} · founded {c.founded}</p></div><div className="ownership-badge"><b>{c.ownership}%</b><small>YOUR EQUITY</small></div></div><div className="company-metrics"><div><small>Valuation</small><b>{fmt(c.valuation)}</b></div><div><small>Company cash</small><b>{fmt(c.cash)}</b></div><div><small>Debt</small><b>{fmt(c.debt)}</b></div><div><small>Employees</small><b>{c.employees}</b></div><div><small>Branches</small><b>{c.branches}</b></div><div><small>Production</small><b>{c.production}%</b></div><div><small>Last-year revenue</small><b>{c.lastYearRevenue==null?'—':fmt(c.lastYearRevenue)}</b></div><div><small>Last-year profit</small><b>{c.lastYearProfit==null?'—':fmt(c.lastYearProfit)}</b></div>{(c.familyStaff||[]).length>0&&<div><small>Family payroll / year</small><b>{fmt(c.familyStaff.reduce((sum,p)=>sum+p.salary,0))}</b></div>}{c.familyPayrollArrears>0&&<div><small>Unpaid family salaries</small><b>{fmt(c.familyPayrollArrears)}</b></div>}</div><div className="management-grid"><label>Employees<input type="range" min="1" max="60" value={c.employees} onChange={(e) => setStaff(c, Number(e.target.value))}/><small>{c.employees} team members · payroll approx. {fmt(c.employees * 22000 / 12)}/month</small></label><label>Production management<input type="range" min="20" max="100" value={c.production} onChange={(e) => setProduction(c, Number(e.target.value))}/><small>{c.production}% capacity · higher output increases costs</small></label><label>Staff morale<div className="meter"><i style={{ width: `${c.morale}%` }} /></div><small>{c.morale}% · {c.morale < 40 ? 'turnover risk' : c.morale > 75 ? 'strong team' : 'stable'}</small></label><label>Company performance<div className="meter performance"><i style={{ width: `${c.performance}%` }} /></div><small>{c.performance}% · reputation {c.reputation}%</small></label></div><section className="board-panel"><div className="board-heading"><span>🏛️ BOARD OF DIRECTORS</span><small>Independent directors review CEO pay below 80% ownership</small></div><div className="board-roster">{(c.board || []).map((director) => <div className="board-member" key={director.id || director.name}><b>{director.name}</b><span>{director.title}{` · ${(director.equity||0).toFixed(1)}% equity`}</span></div>)}</div><div className="equity-roster"><h4>Share ownership</h4>{companyEquities(c).map(h=><div key={h.id}><span>{h.name}</span><b>{h.equity.toFixed(1)}%</b></div>)}</div></section><WorldFeatures type="business" game={game} setGame={setGame} company={c} onNotice={setNotice}/><BusinessLifePanel game={game} company={c} setGame={setGame}/><CompanySalaryPanel game={game} company={c} setGame={setGame} onNotice={setNotice}/><FamilyBusinessStaff game={game} company={c} setGame={setGame} onNotice={setNotice}/><div className="company-actions"><button className="career-secondary" onClick={() => openBranch(c)}>＋ Open branch · {fmt(Math.max(5000, c.valuation * .06))}</button><button className="career-secondary" onClick={() => seekValuation(c)}>⌕ Seek valuation</button><button className="career-secondary" onClick={() => raiseFunding(c)}>📈 Pitch investors</button><button className="career-secondary" onClick={() => tickCompany(c)}>⚡ Resolve business event</button><button className="career-secondary" onClick={() => openShareSale(c)}>🤝 Sell equity</button><button className="career-secondary sell-business" onClick={() => setSaleCandidate(c)}>🏷️ Sell business</button></div><div className="company-footnote">Owner salary: {c.ownership < 80 ? 'Subject to board approval and company performance.' : 'Set a reasonable salary from operating cash; salary is separate from equity value.'} · Personal net worth counts your equity stake, not company cash.</div></article>)}</div>}</div>}
    </SlideChildPage>}
    {startupOffer&&<div className="career-scrim"><div className="career-modal venture-pitch-modal"><button className="career-modal-x" onClick={()=>setStartupOffer(null)}>×</button><span className="event-icon">📈</span><span className="career-kicker">SEED INVESTMENT PITCH</span><h2>{startupOffer.type[0]}</h2><p>Your available capital is below the estimated setup cost of {fmt(startupOffer.type[2])}. {startupOffer.investor.name} at {startupOffer.investor.firm} will review your plan, sector experience, education, and track record.</p><div className="contract-terms"><div><small>INVESTOR</small><b>{startupOffer.investor.name}</b></div><div><small>CAPITAL</small><b>{fmt(startupOffer.type[2])}</b></div><div><small>BOARD & EQUITY</small><b>{100-startupOffer.equity}%</b></div></div><p>The investor contributes launch capital and joins your board. You retain {startupOffer.equity}% ownership. An investor decision is final for this pitch.</p><button className="career-action" onClick={resolveStartupPitch}>Present business plan</button><button className="career-close" onClick={()=>setStartupOffer(null)}>Keep planning</button></div></div>}
    {game.pendingFounderCar&&<div className="career-scrim"><div className="career-modal founder-car-modal"><span className="event-icon">🚘</span><span className="career-kicker">FOUNDER FLEET BENEFIT</span><h2>Choose your company car</h2><p>As founder and CEO of {game.pendingFounderCar.companyName}, choose a vehicle from the company’s launch fleet. It is recorded in Assets at no purchase cost; you remain responsible for normal upkeep.</p><div className="founder-car-options">{game.pendingFounderCar.options.map(([name,icon,value])=><button className="career-secondary" key={name} onClick={()=>{const car={id:`founder-car-${Date.now()}`,name,category:'Cars',kind:'Car',status:'owned',value,purchasePrice:0,monthlyCost:Math.round(value*.002),condition:100,year:game.year,icon,freeCompanyVehicle:true,companyId:game.pendingFounderCar.companyId,details:[{label:'Acquired',value:'Company founder vehicle · no purchase charge'},{label:'Condition',value:'Brand new'},{label:'Company',value:game.pendingFounderCar.companyName}]};setGame(g=>({...g,assets:[car,...(g.assets||[])],pendingFounderCar:null,log:[{year:g.year,age:g.age,text:`You selected the ${name} from ${game.pendingFounderCar.companyName}'s launch fleet. It was added to your assets with normal upkeep.`,tag:'Company car',icon:'🚘'},...(g.log||[])]}));}}><span>{icon}</span><b>{name}</b><small>{fmt(value)} company vehicle · upkeep {fmt(Math.round(value*.002))}/month</small></button>)}</div></div></div>}    {contractOffer&&<div className="career-scrim"><div className="career-modal contract-modal"><button className="career-modal-x" aria-label="Close contract offer" onClick={()=>setContractOffer(null)}>×</button><span className="event-icon">🎤</span><span className="career-kicker">{contractOffer.renewal?"CONTRACT RENEWAL":"PREMIUM CAREER OFFER"}</span><h2>{contractOffer.rejected?"Employer counteroffer":`${contractOffer.job.title} contract`}</h2><p>{contractOffer.rejected?"The employer declined your salary request and returned with a counteroffer.":"Premium fame roles are fixed-term deals. Performance affects your standing; poor results can lead to termination, while strong years improve your next negotiation."}</p><div className="contract-terms"><div><small>EMPLOYER</small><b>{contractOffer.job.title}</b></div><div><small>ANNUAL PAY</small><b>{fmt(contractOffer.rejected?contractOffer.counterSalary:contractOffer.job.salary)}</b></div><div><small>TERM</small><b>{contractOffer.rejected?contractOffer.counterYears:2} years</b></div></div>{contractOffer.rejected?<><button className="career-action" onClick={()=>acceptContract(contractOffer.counterSalary,contractOffer.counterYears)}>Accept employer counteroffer</button><button className="career-close" onClick={()=>setContractOffer(null)}>Decline</button></>:<><button className="career-action" onClick={()=>acceptContract(contractOffer.job.salary,2)}>Accept standard · {fmt(contractOffer.job.salary)}/yr</button><button className="career-secondary contract-negotiate" onClick={negotiateContract}>Negotiate · request {fmt(Math.round(contractOffer.job.salary*1.22))}/yr for 3 years</button><button className="career-close" onClick={()=>setContractOffer(null)}>{contractOffer.renewal?"Decide later":"Decline contract"}</button></>}</div></div>}
    {event && <div className="career-scrim"><div className="career-modal"><span className="event-icon">📣</span><span className="career-kicker">BUSINESS EVENT</span><h2>{event.title}</h2><p>Choose how to handle this. The impact will affect company operations and team sentiment.</p><div className="event-options">{event.options.map((choice) => <button key={choice.label} className="career-secondary" onClick={() => operate(companies.find((c) => c.id === event.companyId), choice)}><b>{choice.label}</b><small>{Object.entries(choice.patch).map(([k, v]) => `${k}: ${v > 0 ? '+' : ''}${v}`).join(' · ')}</small></button>)}</div><button className="career-close" onClick={() => setEvent(null)}>Decide later</button></div></div>}
    {shareSale&&<div className="career-scrim" onClick={()=>setShareSale(null)}><div className="career-modal share-sale-modal" onClick={(e)=>e.stopPropagation()}><button className="career-modal-x" aria-label="Close" onClick={()=>setShareSale(null)}>×</button><span className="event-icon">🤝</span><span className="career-kicker">PRIVATE EQUITY OFFER</span><h2>Sell part of your company</h2><p>Choose how much of your stake to sell. This is a secondary share sale: payment goes to your personal balance, while the company keeps its cash.</p>{(()=>{const company=companies.find((item)=>item.id===shareSale.companyId);const maxSale=Math.max(0,(company?.ownership||0)-10);const percent=Math.min(Number(shareSale.percent)||0,maxSale);const proceeds=Math.round((company?.valuation||0)*percent/100*(shareSale.buyer?.premium||1));return <><label className="share-input-label">Equity percentage<input type="number" min="1" max={maxSale} value={shareSale.percent} onChange={(e)=>setShareSale({...shareSale,percent:e.target.value,error:""})}/><small>You own {company?.ownership||0}%. Keep at least 10% after sale.</small></label><div className="investor-offer"><span>BUYER · {shareSale.buyer?.style}</span><b>{shareSale.buyer?.name}</b><small>{shareSale.buyer?.firm} · {Math.round(((shareSale.buyer?.premium||1)-1)*100)}% valuation premium</small><button className="career-secondary" onClick={()=>openShareSale(company)}>Find another buyer</button></div><div className="share-estimate"><span>Estimated personal proceeds</span><b>{fmt(proceeds)}</b><small>Buyer receives {percent}% of the company and one board seat.</small></div>{shareSale.error&&<p className="share-error">{shareSale.error}</p>}<button className="career-action" disabled={!company||maxSale<1||Number(shareSale.percent)<1||Number(shareSale.percent)>maxSale} onClick={completeShareSale}>Accept offer · {fmt(proceeds)}</button><button className="career-close" onClick={()=>setShareSale(null)}>Decline offer</button></>})()}</div></div>}
    {saleCandidate&&<div className="career-scrim"><div className="career-modal"><button className="career-modal-x" aria-label="Close" onClick={()=>setSaleCandidate(null)}>×</button><span className="event-icon">🏷️</span><span className="career-kicker">SELL YOUR BUSINESS</span><h2>{saleCandidate.name}</h2><p>Estimated personal proceeds after debt and transaction costs: <b>{fmt(Math.max(0,Math.round(((saleCandidate.valuation||0)*(saleCandidate.ownership||0)/100-(saleCandidate.debt||0))*(.78+(saleCandidate.performance||50)/500))))}</b>. Selling releases your business slot so you can start or acquire another company, or move into a regular job.</p><button className="career-action" onClick={()=>sellCompany(saleCandidate)}>Accept sale offer</button><button className="career-close" onClick={()=>setSaleCandidate(null)}>Keep the business</button></div></div>}
    {notice && <div className="career-scrim notice-scrim" onClick={() => setNotice('')}><div className="career-modal notice-modal" onClick={(e) => e.stopPropagation()}><button className="career-modal-x" aria-label="Close" onClick={() => setNotice('')}>×</button><span className="event-icon">📋</span><span className="career-kicker">CAREER UPDATE</span><p>{notice}</p><button className="career-action" onClick={() => setNotice('')}>Got it</button></div></div>}
  </section>;
}







