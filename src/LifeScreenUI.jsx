import React from 'react';
import {ChevronRight} from 'lucide-react';
export function LifeHero({icon,title,description,badge}){return <header className="life-hero"><span className="life-hero-icon" aria-hidden="true">{icon}</span><div>{badge&&<span className="life-status">{badge}</span>}<h2>{title}</h2><p>{description}</p></div></header>;}
export function LifeTabs({items,value,onChange,label}){return <nav className="life-section-tabs" aria-label={label}>{items.map(([name,icon])=><button key={name} aria-pressed={value===name} className={value===name?'active':''} onClick={()=>onChange(name)}><span aria-hidden="true">{icon}</span><b>{name}</b><ChevronRight size={16}/></button>)}</nav>;}
