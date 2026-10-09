import React from 'react';

const palettes = [
  { skin: '#f3c7a6', hair: '#49332d', shirt: '#e87962', bg: '#ffe2bc' },
  { skin: '#a96849', hair: '#20202a', shirt: '#56a7a1', bg: '#d3f0e8' },
  { skin: '#f0d2b2', hair: '#bb7444', shirt: '#8f79c8', bg: '#e9e1ff' },
  { skin: '#754734', hair: '#281c1d', shirt: '#e5b94f', bg: '#fff0bd' },
  { skin: '#d99b78', hair: '#593b68', shirt: '#e1749a', bg: '#ffdfeb' },
  { skin: '#f2d5bf', hair: '#302b28', shirt: '#6d94cb', bg: '#dceaff' },
  { skin: '#e8b58b', hair: '#25212a', shirt: '#438b82', bg: '#c9eee3' },
  { skin: '#8d523c', hair: '#201a1d', shirt: '#c96652', bg: '#ffe0ca' },
  { skin: '#f5d8ba', hair: '#754c2d', shirt: '#dbad48', bg: '#fff0bf' },
  { skin: '#bd8061', hair: '#32252b', shirt: '#5e78ad', bg: '#d9e6ff' },
  { skin: '#d6a27e', hair: '#573c32', shirt: '#a76caa', bg: '#f6dff4' },
  { skin: '#f0c5a4', hair: '#c36f43', shirt: '#579a6e', bg: '#d8f0ce' },
  { skin: '#70422f', hair: '#211b1b', shirt: '#d5943e', bg: '#ffedbb' },
];
const choose = (seed, list) => {
  let hash = 17;
  for (const char of String(seed || 'friend')) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return list[hash % list.length];
};

export function PersonPortrait({ person, className = '' }) {
  const seed = person?.avatarSeed || person?.id || person?.avatar || person?.name;
  const ethnicityTone = { White:['#f3c7a6','#f0d2b2','#f2d5bf','#f5d8ba','#f0c5a4'], 'East Asian':['#e8b58b','#f3c7a6','#d6a27e'], 'South Asian':['#bd8061','#d99b78','#a96849'], Latino:['#bd8061','#d99b78','#e8b58b'], Black:['#754734','#70422f','#8d523c'], 'Middle Eastern':['#d99b78','#bd8061','#e8b58b'], Mixed:['#d6a27e','#e8b58b','#a96849'], Indigenous:['#a96849','#bd8061','#754734'] };
  const skinOptions = ethnicityTone[person?.ethnicity] || [];
  const colors = skinOptions.length ? { ...choose(seed, palettes), skin: choose(`${seed}skin`, skinOptions) } : choose(seed, palettes);
  const feminine = ['Woman','Girl','Female'].includes(person?.gender);
  const hairStyle = feminine
    ? choose(`${seed}hair`, ['M7 43 Q4 8 31 8 Q59 8 57 43 L53 57 L46 49 L49 29 Q37 28 30 18 Q22 29 12 29 L14 51Z', 'M6 42 Q7 10 31 9 Q57 9 58 42 L52 58 L48 39 L49 24 Q32 31 13 25 L13 43 L10 55Z', 'M8 39 Q5 9 31 8 Q58 9 56 40 L52 52 L49 27 Q32 21 14 30 L12 51Z'])
    : choose(`${seed}hair`, ['M6 38 Q7 10 31 9 Q56 7 57 39 L53 28 Q42 23 35 17 Q27 29 9 30Z', 'M6 38 Q7 10 31 9 Q57 10 57 39 L51 35 L50 24 Q39 30 16 26 L12 40Z', 'M8 30 Q12 8 32 9 Q54 8 56 32 L48 20 Q36 27 13 24Z']);
  const facialHair = !feminine && choose(`${seed}beard`, [false, false, false, true, false]);
  const glasses = choose(`${seed}glasses`, [false, false, false, true]);
  const freckles = choose(`${seed}freckles`, [false, false, true]);
  return <svg className={`illustrated-portrait ${className}`} viewBox="0 0 64 64" role="img" aria-label={`${person?.name || 'Person'} portrait`}>
    <rect width="64" height="64" rx="19" fill={colors.bg}/>
    <path d="M7 64 Q9 43 22 41 L42 41 Q56 44 58 64Z" fill={colors.shirt}/>
    <path d="M25 39 L25 47 Q32 53 39 47 L39 38Z" fill={colors.skin}/>
    <ellipse cx="12" cy="31" rx="4" ry="6" fill={colors.skin}/><ellipse cx="52" cy="31" rx="4" ry="6" fill={colors.skin}/>
    <ellipse cx="32" cy="29" rx="20" ry="23" fill={colors.skin}/>
    <path d={hairStyle} fill={colors.hair}/>
    <path d="M21 30 Q24 28 27 30 M37 30 Q40 28 43 30" fill="none" stroke={colors.hair} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="25" cy="34" r="1.8" fill="#302a28"/><circle cx="39" cy="34" r="1.8" fill="#302a28"/>
    <path d="M28 42 Q32 45 36 42" fill="none" stroke="#9b554c" strokeWidth="1.8" strokeLinecap="round"/>
    {freckles && <g fill="#a36e59" opacity=".65"><circle cx="22" cy="39" r=".7"/><circle cx="25" cy="40" r=".65"/><circle cx="42" cy="39" r=".7"/><circle cx="39" cy="40" r=".65"/></g>}
    {facialHair && <path d="M22 41 Q25 48 32 47 Q39 48 42 41 Q38 44 32 43 Q26 44 22 41Z" fill={colors.hair} opacity=".92"/>}
    {glasses && <g fill="none" stroke="#3b4652" strokeWidth="1.5"><rect x="19" y="30" width="11" height="8" rx="3"/><rect x="34" y="30" width="11" height="8" rx="3"/><path d="M30 33 Q32 31 34 33 M19 32 L16 31 M45 32 L48 31"/></g>}
    <circle cx="19" cy="39" r="3" fill="#eea18d" opacity=".4"/><circle cx="45" cy="39" r="3" fill="#eea18d" opacity=".4"/>
  </svg>;
}

const petColors = { Dog: ['#d69c63', '#f5ddbc'], Cat: ['#73788a', '#e0e5f4'], Rabbit: ['#f2f0ec', '#e9ddf8'], Bird: ['#4ca9a5', '#d6f2ec'] };
export function PetPortrait({ pet, className = '' }) {
  const [fur, bg] = petColors[pet?.species] || petColors.Dog;
  const seed = String(pet?.id || pet?.name || 'pet').length % 3;
  return <svg className={`illustrated-pet ${className}`} viewBox="0 0 72 64" role="img" aria-label={`${pet?.name || pet?.species || 'Pet'} illustration`}>
    <rect width="72" height="64" rx="18" fill={bg}/>
    {pet?.species === 'Bird' ? <><path d="M16 49 Q19 33 35 32 Q49 31 55 43 Q49 55 33 54Z" fill={fur}/><path d="M35 37 Q48 34 48 47 Q39 51 31 46Z" fill="#f4cb58"/><path d="M53 37 L64 41 L53 45Z" fill="#ec8c54"/><circle cx="47" cy="37" r="2.5" fill="#283343"/><path d="M26 52 L25 58 M37 52 L38 58" stroke="#b2764d" strokeWidth="2" strokeLinecap="round"/><path d="M18 40 Q10 37 13 29 Q20 31 22 38" fill={fur}/></> : <><path d={pet?.species === 'Rabbit' ? 'M20 32 Q13 8 23 8 Q31 10 31 30 Q35 7 43 10 Q51 13 43 33Z' : `M16 29 L${seed===1?10:17} 11 L32 22 L48 21 L${seed===2?60:55} 12 L55 34 Q52 53 35 55 Q16 52 16 29Z`} fill={fur}/><ellipse cx="36" cy="37" rx="21" ry="17" fill={fur}/><ellipse cx="36" cy="43" rx="11" ry="8" fill="#fff0db" opacity=".8"/><circle cx="29" cy="34" r="2" fill="#28242a"/><circle cx="43" cy="34" r="2" fill="#28242a"/><path d="M33 41 Q36 44 39 41" fill="none" stroke="#77504b" strokeWidth="1.7" strokeLinecap="round"/>{pet?.species==='Dog'&&<><path d="M17 28 Q5 27 12 43 Q17 48 21 42Z M55 28 Q67 27 60 43 Q55 48 51 42Z" fill={fur}/><path d="M56 49 Q64 53 62 57" fill="none" stroke={fur} strokeWidth="4" strokeLinecap="round"/></>}</>}
    <path d="M9 59 Q36 55 63 59" fill="none" stroke="#ffffff" strokeWidth="2" opacity=".65"/>
  </svg>;
}
