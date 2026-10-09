export const difficultyModes={Relaxed:{cost:.75,risk:.65,opportunity:1.15},Realistic:{cost:1,risk:1,opportunity:1},Challenging:{cost:1.25,risk:1.35,opportunity:.85}};
export function simulationSettings(g){const mode=difficultyModes[g.difficulty]||difficultyModes.Realistic;return {...mode,cost:mode.cost*Math.max(.5,Math.min(1.5,Number(g.simulationSettings?.economySeverity)||1)),risk:mode.risk*Math.max(.5,Math.min(1.5,Number(g.simulationSettings?.eventSeverity)||1))};}
export const academicGrade=g=>Math.max(0,Math.min(100,Number(g.schoolAcademicGrade??g.childhood?.academicGrade??(g.schoolRecord?.grade>20?g.schoolRecord.grade:70))||70));
export const letterGrade=n=>n>=85?'A':n>=70?'B':n>=55?'C':n>=40?'D':'F';
