import React from 'react';
import {ChevronLeft,X} from 'lucide-react';
import './screen-header.css';
export default function ScreenHeader({title,eyebrow,onBack,onClose,backLabel='Back'}){return <header className="fullscreen-header new-screen-header"><button className="round-close" aria-label={backLabel} onClick={onBack}><ChevronLeft aria-hidden="true"/></button><div className="new-screen-heading">{eyebrow&&<span className="eyebrow small">{eyebrow}</span>}<h2>{title}</h2></div><button className="round-close" aria-label={`Close ${title}`} onClick={onClose}><X aria-hidden="true"/></button></header>;}
