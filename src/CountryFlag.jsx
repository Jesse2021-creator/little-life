import {middleEastCountries} from './regions.js';
import { useId } from 'react';

/** Small, locally rendered country flags with rounded corners. */
export default function CountryFlag({ country, className = '' }) {
  const clipId = `flag-${useId().replaceAll(':', '')}`;
  const regional=middleEastCountries.find(c=>c.name===country);
  if(regional)return <span className={`country-flag region-flag ${className}`} role="img" aria-label={`${country} flag`}>{regional.flag}</span>;
  const shape = (() => {
    switch (country) {
      case 'United States':
        return <><rect width="60" height="40" fill="#fff"/>{Array.from({length:7},(_,i)=><rect key={i} y={i*6.16} width="60" height="3.08" fill="#bd2635"/>)}<rect width="27" height="21.6" fill="#25406d"/>{Array.from({length:18},(_,i)=><circle key={i} cx={3+(i%6)*4.2} cy={3+(Math.floor(i/6))*5.7} r=".75" fill="#fff"/>)}</>;
      case 'Nigeria':
        return <><rect width="20" height="40" fill="#16864a"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#16864a"/></>;
      case 'United Kingdom':
        return <UnionJack/>;
      case 'Canada':
        return <><rect width="60" height="40" fill="#fff"/><rect width="14" height="40" fill="#d52b3e"/><rect x="46" width="14" height="40" fill="#d52b3e"/><path d="M30 8l-3 6-4-2 2 6-5 2 7 2-1 8h8l-1-8 7-2-5-2 2-6-4 2z" fill="#d52b3e"/></>;
      case 'Japan':
        return <><rect width="60" height="40" fill="#fff"/><circle cx="30" cy="20" r="10" fill="#bc263e"/></>;
      case 'Brazil':
        return <><rect width="60" height="40" fill="#199253"/><path d="M30 4 54 20 30 36 6 20z" fill="#f6d447"/><circle cx="30" cy="20" r="9" fill="#2452a2"/><path d="M22 17q8-4 16 0" fill="none" stroke="#fff" strokeWidth="1.4"/></>;
      case 'India':
        return <><rect width="60" height="13.34" fill="#ed8b32"/><rect y="13.33" width="60" height="13.34" fill="#fff"/><rect y="26.66" width="60" height="13.34" fill="#16834b"/><circle cx="30" cy="20" r="5" fill="none" stroke="#24509a" strokeWidth="1.2"/>{Array.from({length:12},(_,i)=><path key={i} d="M30 15v10" stroke="#24509a" strokeWidth=".55" transform={`rotate(${i*30} 30 20)`}/>)}</>;
      case 'Australia':
        return <><rect width="60" height="40" fill="#17366e"/><g transform="scale(.5)"><UnionJack/></g>{[[43,11],[51,19],[43,28],[34,21],[51,34],[23,30]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={i===0?1.8:1.3} fill="#fff"/>)}</>;
      default:
        return <><rect width="60" height="40" fill="#fff"/><rect width="20" height="40" fill="#c83d4b"/><rect x="40" width="20" height="40" fill="#c83d4b"/></>;
    }
  })();
  return <svg className={`country-flag ${className}`} viewBox="0 0 60 40" role="img" aria-label={`${country} flag`} xmlns="http://www.w3.org/2000/svg"><defs><clipPath id={clipId}><rect width="60" height="40" rx="7"/></clipPath></defs><g clipPath={`url(#${clipId})`}>{shape}</g><rect x=".5" y=".5" width="59" height="39" rx="6.5" fill="none" stroke="currentColor" strokeOpacity=".12"/></svg>;
}

function UnionJack() {
  return <><rect width="60" height="40" fill="#17366e"/><path d="M0 0 60 40M60 0 0 40" stroke="#fff" strokeWidth="9"/><path d="M0 0 60 40M60 0 0 40" stroke="#c9283c" strokeWidth="4"/><path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="13"/><path d="M30 0v40M0 20h60" stroke="#c9283c" strokeWidth="6"/></>;
}
