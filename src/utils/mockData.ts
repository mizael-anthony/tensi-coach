import { BloodPressureMeasurement, HabitEntry, UserProfile } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Thomas',
  age: 32,
  gender: 'M',
  occupation: 'Chef de projet digital',
  targetSys: 120,
  targetDia: 80,
  doctorName: 'Dr. Anne Mercier (Généraliste)',
  hasMedicalFollowup: true,
  morningReminderTime: '08:00',
  eveningReminderTime: '20:30',
  remindersActive: true,
};

/**
 * Génère 60 jours de données cohérentes et réalistes pour Thomas (32 ans)
 */
export function generate60DaysDemoData(): {
  measurements: BloodPressureMeasurement[];
  habits: HabitEntry[];
} {
  const measurements: BloodPressureMeasurement[] = [];
  const habits: HabitEntry[] = [];

  const now = new Date();

  // Pseudo-random helper with seed-like stability
  let seed = 42;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let dayOffset = 59; dayOffset >= 0; dayOffset--) {
    const currentDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
    const dateStr = currentDate.toISOString().split('T')[0];

    // Progression sur 60 jours :
    // 0 = il y a 60 jours (mauvaise hygiène de vie, stress)
    // 1 = aujourd'hui (bonnes habitudes, tension stabilisée)
    const progress = (59 - dayOffset) / 59;

    // Simulation événement exceptionnel (rush projet + repas salé il y a 14 jours)
    const isOutlierRush = dayOffset === 14;

    // 1. Habitudes
    let sleepHours: number;
    let sleepQuality: number;
    let stressLevel: number;
    let steps: number;
    let saltIntake: 'low' | 'moderate' | 'high';
    let activityMinutes: number;
    let caffeineCups: number;

    if (isOutlierRush) {
      sleepHours = 5.2;
      sleepQuality = 2;
      stressLevel = 5;
      steps = 4100;
      saltIntake = 'high';
      activityMinutes = 0;
      caffeineCups = 4;
    } else if (dayOffset > 38) {
      // Phase 1 : Période stressante initiale
      sleepHours = Math.round((5.6 + random() * 1.0) * 10) / 10;
      sleepQuality = Math.floor(random() * 2) + 2; // 2 ou 3
      stressLevel = Math.floor(random() * 2) + 4; // 4 ou 5
      steps = Math.floor(3500 + random() * 2200);
      saltIntake = random() > 0.3 ? 'high' : 'moderate';
      activityMinutes = random() > 0.7 ? 15 : 0;
      caffeineCups = 3 + Math.floor(random() * 2);
    } else if (dayOffset > 18) {
      // Phase 2 : Prise de conscience et transition
      sleepHours = Math.round((6.6 + random() * 1.0) * 10) / 10;
      sleepQuality = Math.floor(random() * 2) + 3; // 3 ou 4
      stressLevel = Math.floor(random() * 2) + 2; // 2 ou 3
      steps = Math.floor(6500 + random() * 2500);
      saltIntake = random() > 0.6 ? 'moderate' : 'low';
      activityMinutes = random() > 0.4 ? 25 : 10;
      caffeineCups = 2;
    } else {
      // Phase 3 : Routine optimale consolidée
      sleepHours = Math.round((7.3 + random() * 0.9) * 10) / 10;
      sleepQuality = Math.floor(random() * 2) + 4; // 4 ou 5
      stressLevel = Math.floor(random() * 2) + 1; // 1 ou 2
      steps = Math.floor(8200 + random() * 3200);
      saltIntake = random() > 0.2 ? 'low' : 'moderate';
      activityMinutes = random() > 0.3 ? 35 : 15;
      caffeineCups = 1 + (random() > 0.7 ? 1 : 0);
    }

    habits.push({
      id: `habit-${dateStr}`,
      date: dateStr,
      sleepHours,
      sleepQuality,
      steps,
      stressLevel,
      saltIntake,
      physicalActivityMinutes: activityMinutes,
      caffeineCups,
      waterLiters: Math.round((1.2 + progress * 0.8 + random() * 0.4) * 10) / 10,
      notes: isOutlierRush
        ? 'Soirée pizza et nuit écourtée pour finaliser la livraison client.'
        : undefined,
    });

    // 2. Mesures de Tension (Matin et Soir)
    // Calcul de base de la tension avec corrélation directe
    let baseSys = 140 - progress * 19; // De 140 vers 121
    let baseDia = 89 - progress * 11; // De 89 vers 78
    let basePulse = 78 - progress * 10; // De 78 vers 68

    // Impact direct des facteurs de risque
    if (saltIntake === 'high') {
      baseSys += 4;
      baseDia += 2.5;
    } else if (saltIntake === 'low') {
      baseSys -= 2;
      baseDia -= 1;
    }

    if (stressLevel >= 4) {
      baseSys += 4;
      baseDia += 3;
      basePulse += 6;
    } else if (stressLevel <= 2) {
      baseSys -= 2;
      baseDia -= 1.5;
      basePulse -= 3;
    }

    if (sleepHours < 6) {
      baseSys += 3.5;
      baseDia += 2;
    }

    if (activityMinutes >= 30) {
      baseSys -= 2.5;
      baseDia -= 1.5;
    }

    if (isOutlierRush) {
      baseSys += 10;
      baseDia += 7;
      basePulse += 12;
    }

    // Mesure du Matin (07:45 - 08:30)
    const morningNoiseSys = Math.round((random() - 0.5) * 6);
    const morningNoiseDia = Math.round((random() - 0.5) * 5);
    const morningNoisePulse = Math.round((random() - 0.5) * 6);

    const morningDate = new Date(currentDate);
    morningDate.setHours(8, Math.floor(random() * 30) + 15, 0, 0);

    const mSys = Math.max(105, Math.min(170, Math.round(baseSys + morningNoiseSys)));
    const mDia = Math.max(65, Math.min(105, Math.round(baseDia + morningNoiseDia)));
    const mPulse = Math.max(55, Math.min(110, Math.round(basePulse + morningNoisePulse)));

    measurements.push({
      id: `m-morning-${dateStr}`,
      timestamp: morningDate.toISOString(),
      systolic: mSys,
      diastolic: mDia,
      pulse: mPulse,
      moment: 'morning',
      position: 'sitting',
      arm: 'left',
      note: isOutlierRush ? 'Réveil difficile, sensation de tension dans la nuque' : undefined,
      isDemo: true,
    });

    // Mesure du Soir (20:00 - 21:15)
    // Habituellement légère variation physiologique le soir
    const eveningDate = new Date(currentDate);
    eveningDate.setHours(20, Math.floor(random() * 35) + 10, 0, 0);

    const eveningModSys = stressLevel >= 4 ? 3 : -1;
    const eSys = Math.max(
      105,
      Math.min(168, Math.round(baseSys + eveningModSys + (random() - 0.5) * 6))
    );
    const eDia = Math.max(
      65,
      Math.min(105, Math.round(baseDia + (stressLevel >= 4 ? 2 : -1) + (random() - 0.5) * 5))
    );
    const ePulse = Math.max(55, Math.min(105, Math.round(basePulse - 2 + (random() - 0.5) * 6)));

    measurements.push({
      id: `m-evening-${dateStr}`,
      timestamp: eveningDate.toISOString(),
      systolic: eSys,
      diastolic: eDia,
      pulse: ePulse,
      moment: 'evening',
      position: 'sitting',
      arm: 'left',
      isDemo: true,
    });
  }

  // Tri chronologique descendant (les plus récentes en premier)
  measurements.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  habits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { measurements, habits };
}
