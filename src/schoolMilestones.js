export function schoolMilestones(before,after,stages=[]){
 if(!before||before.characterId!==after.characterId||!after.alive)return [];
 const entries=[],stage=(age)=>stages.find(s=>age>=s.start&&age<=s.end),old=before.country===after.country?stage(before.age):null,next=stage(after.age);
 const add=(kind,title,details)=>entries.push({id:`${after.characterId}-${kind}-${title}-${after.year}`,kind,title,age:after.age,country:after.country,details});
 if(old&&after.age>old.end&&after.age>before.age)add('Graduation',old.name,[['Years completed',old.end-old.start+1],['Qualification',after.education||'Stage completed']]);
 if(next&&(!old||old.name!==next.name))add('Enrollment',next.name,[['Year level',after.age-next.start+1],['School ages',`${next.start}–${next.end}`],['Duration',`${next.end-next.start+1} years`]]);
 if(after.educationStatus==='enrolled'&&before.educationStatus!=='enrolled')add('Enrollment',`${after.universityCourse||'University'} · Bachelor’s degree`,[['Program length',`${after.universityYearsRequired||4} years`],['Annual tuition',`$${(after.universityTuition||0).toLocaleString()}`],['Housing',after.universityHousing||'Commute from home'],['Prestige',`${after.universityPrestige||60}/100`]]);
 if(after.educationStudy&&(!before.educationStudy||before.educationStudy.startedYear!==after.educationStudy.startedYear||before.educationStudy.id!==after.educationStudy.id))add('Enrollment',`${after.educationStudy.title} · ${after.educationStudy.major}`,[['Program length',`${after.educationStudy.years} years`],['Study country',after.educationStudy.country],['Annual tuition',`$${after.educationStudy.fee.toLocaleString()}`],['Prestige',`${after.educationStudy.prestige}/100`]]);
 if(after.educationStatus==='graduated'&&['enrolled','advanced-enrolled'].includes(before.educationStatus))add('Graduation',before.educationStudy?`${before.educationStudy.title} · ${before.educationStudy.major}`:`${after.universityCourse||'University'} · Bachelor’s degree`,[['Qualification',after.education||'Degree completed'],['Final GPA',`${Number(after.universityGpa||0).toFixed(2)} / 4.00`],['Years of study',before.educationStudy?.years||after.universityYearsCompleted||4]]);
 if(!old&&before.educationLevel===0&&after.educationLevel===1&&after.age>=18)add('Graduation','Secondary school',[['Qualification',after.education||'Secondary school graduate']]);
 return entries;
}
