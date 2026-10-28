import {
  BPCategory,
  BPCategoryInfo,
  BloodPressureMeasurement,
  PeriodStats,
} from '../types';

/**
 * Classification ESH (European Society of Hypertension) / HAS (Haute Autorité de Santé)
 */
export function classifyBloodPressure(systolic: number, diastolic: number): BPCategoryInfo {
  // 1. Urgence Hypertensive / Crise
  if (systolic >= 180 || diastolic >= 120) {
    return {
      category: 'CRISIS',
      label: 'Crise Hypertensive Potentielle',
      shortLabel: 'Crise / Valeur Très Élevée',
      color: '#dc2626', // Red 600
      bgColor: 'bg-red-50 text-red-700 border-red-200',
      borderColor: '#ef4444',
      textColor: 'text-red-700',
      description: 'Valeur particulièrement élevée nécessitant une vérification au calme et un avis médical rapide.',
      recommendation: 'Restez au calme 5 minutes et reprenez la mesure. Si des symptômes sont présents (maux de tête violents, essoufflement, douleur thoracique), appelez le 15 ou le 112 sans tarder.',
    };
  }

  // 2. Hypotension
  if (systolic < 90 || diastolic < 60) {
    return {
      category: 'HYPOTENSION',
      label: 'Tension Basse (Hypotension)',
      shortLabel: 'Tension Basse',
      color: '#0284c7', // Sky 600
      bgColor: 'bg-sky-50 text-sky-800 border-sky-200',
      borderColor: '#38bdf8',
      textColor: 'text-sky-800',
      description: 'Tension inférieure aux seuils physiologiques habituels.',
      recommendation: 'Asseyez-vous, buvez un verre d\'eau et levez-vous doucement. Consultez si vous ressentez des vertiges fréquents ou des malaises.',
    };
  }

  // 3. Hypertension Grade 2
  if (systolic >= 160 || diastolic >= 100) {
    return {
      category: 'HTA_GRADE_2',
      label: 'Hypertension Grade 2 (Modérée/Sévère)',
      shortLabel: 'HTA Grade 2',
      color: '#e11d48', // Rose 600
      bgColor: 'bg-rose-50 text-rose-800 border-rose-200',
      borderColor: '#fb7185',
      textColor: 'text-rose-800',
      description: 'Niveau tensionnel modérément à nettement supérieur aux objectifs.',
      recommendation: 'Notez le contexte de la mesure et parlez-en à votre médecin traitant lors de votre prochaine consultation.',
    };
  }

  // 4. Hypertension Grade 1
  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: 'HTA_GRADE_1',
      label: 'Hypertension Grade 1 (Légère)',
      shortLabel: 'HTA Grade 1',
      color: '#f97316', // Orange 500
      bgColor: 'bg-orange-50 text-orange-800 border-orange-200',
      borderColor: '#fb923c',
      textColor: 'text-orange-800',
      description: 'Tension légèrement au-dessus du seuil normal de consultation.',
      recommendation: 'Renforcez vos habitudes cardio-protectrices (marche, baisse du sel, gestion du stress). L\'auto-mesure sur 3 jours sera précieuse pour votre praticien.',
    };
  }

  // 5. Normale Haute / Pré-hypertension
  if (systolic >= 130 || diastolic >= 85) {
    return {
      category: 'HIGH_NORMAL',
      label: 'Tension Normale Haute',
      shortLabel: 'Normale Haute',
      color: '#eab308', // Amber 500
      bgColor: 'bg-amber-50 text-amber-800 border-amber-200',
      borderColor: '#facc15',
      textColor: 'text-amber-800',
      description: 'Zone charnière idéale pour agir par l\'hygiène de vie.',
      recommendation: 'Excellente opportunité d\'optimisation par le sport modéré, un sommeil régulier et une alimentation équilibrée.',
    };
  }

  // 6. Normale
  if (systolic >= 120 || diastolic >= 80) {
    return {
      category: 'NORMAL',
      label: 'Tension Normale',
      shortLabel: 'Normale',
      color: '#0d9488', // Teal 600
      bgColor: 'bg-teal-50 text-teal-800 border-teal-200',
      borderColor: '#2dd4bf',
      textColor: 'text-teal-800',
      description: 'Valeur physiologique dans les limites normales recommandées.',
      recommendation: 'Bravo ! Maintenez votre régularité et votre mode de vie actif.',
    };
  }

  // 7. Optimale
  return {
    category: 'OPTIMAL',
    label: 'Tension Optimale',
    shortLabel: 'Optimale',
    color: '#059669', // Emerald 600
    bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderColor: '#34d399',
    textColor: 'text-emerald-800',
    description: 'Niveau de tension parfait pour une santé cardiovasculaire idéale.',
    recommendation: 'Valeur exemplaire. Continuez vos bonnes habitudes au quotidien !',
  };
}

/**
 * Calcule la Pression Artérielle Moyenne (PAM) en mmHg
 * Formule clinique classique : PAM = Diastolique + 1/3 (Systolique - Diastolique)
 */
export function calculateMAP(systolic: number, diastolic: number): number {
  return Math.round(diastolic + (systolic - diastolic) / 3);
}

/**
 * Calcule la Pression Pulsée (PP) en mmHg
 */
export function calculatePulsePressure(systolic: number, diastolic: number): number {
  return systolic - diastolic;
}

/**
 * Calcule les statistiques complètes pour une liste de mesures sur une période
 */
export function computePeriodStats(
  measurements: BloodPressureMeasurement[],
  days: number
): PeriodStats {
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const filtered = measurements.filter((m) => new Date(m.timestamp) >= cutoff);

  if (filtered.length === 0) {
    return {
      periodDays: days,
      totalMeasurements: 0,
      avgSys: 0,
      avgDia: 0,
      avgPulse: 0,
      minSys: 0,
      maxSys: 0,
      minDia: 0,
      maxDia: 0,
      morningAvgSys: 0,
      morningAvgDia: 0,
      eveningAvgSys: 0,
      eveningAvgDia: 0,
      optimalPercentage: 0,
      highPercentage: 0,
      standardDeviationSys: 0,
    };
  }

  const sysList = filtered.map((m) => m.systolic);
  const diaList = filtered.map((m) => m.diastolic);
  const pulseList = filtered.map((m) => m.pulse);

  const sumSys = sysList.reduce((acc, v) => acc + v, 0);
  const sumDia = diaList.reduce((acc, v) => acc + v, 0);
  const sumPulse = pulseList.reduce((acc, v) => acc + v, 0);

  const avgSys = Math.round(sumSys / filtered.length);
  const avgDia = Math.round(sumDia / filtered.length);
  const avgPulse = Math.round(sumPulse / filtered.length);

  // Écart-type systolique
  const varianceSys =
    sysList.reduce((acc, val) => acc + Math.pow(val - avgSys, 2), 0) / filtered.length;
  const standardDeviationSys = Math.round(Math.sqrt(varianceSys) * 10) / 10;

  // Matin vs Soir
  const morningList = filtered.filter((m) => m.moment === 'morning');
  const eveningList = filtered.filter((m) => m.moment === 'evening');

  const morningAvgSys = morningList.length
    ? Math.round(morningList.reduce((acc, m) => acc + m.systolic, 0) / morningList.length)
    : avgSys;
  const morningAvgDia = morningList.length
    ? Math.round(morningList.reduce((acc, m) => acc + m.diastolic, 0) / morningList.length)
    : avgDia;

  const eveningAvgSys = eveningList.length
    ? Math.round(eveningList.reduce((acc, m) => acc + m.systolic, 0) / eveningList.length)
    : avgSys;
  const eveningAvgDia = eveningList.length
    ? Math.round(eveningList.reduce((acc, m) => acc + m.diastolic, 0) / eveningList.length)
    : avgDia;

  // Pourcentages
  const optimalCount = filtered.filter((m) => m.systolic < 130 && m.diastolic < 85).length;
  const highCount = filtered.filter((m) => m.systolic >= 140 || m.diastolic >= 90).length;

  return {
    periodDays: days,
    totalMeasurements: filtered.length,
    avgSys,
    avgDia,
    avgPulse,
    minSys: Math.min(...sysList),
    maxSys: Math.max(...sysList),
    minDia: Math.min(...diaList),
    maxDia: Math.max(...diaList),
    morningAvgSys,
    morningAvgDia,
    eveningAvgSys,
    eveningAvgDia,
    optimalPercentage: Math.round((optimalCount / filtered.length) * 100),
    highPercentage: Math.round((highCount / filtered.length) * 100),
    standardDeviationSys,
  };
}

/**
 * Détermine la tendance entre les 7 derniers jours et les 30 jours
 */
export function getTrendSummary(
  stats7d: PeriodStats,
  stats30d: PeriodStats
): { direction: 'down' | 'stable' | 'up'; diff: number; text: string; colorClass: string } {
  if (stats7d.totalMeasurements === 0 || stats30d.totalMeasurements === 0) {
    return {
      direction: 'stable',
      diff: 0,
      text: 'Données insuffisantes pour établir la tendance',
      colorClass: 'text-slate-500',
    };
  }

  const diff = stats7d.avgSys - stats30d.avgSys;

  if (diff <= -3) {
    return {
      direction: 'down',
      diff,
      text: `En baisse de ${Math.abs(diff)} mmHg par rapport à la moyenne mensuelle`,
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  }
  if (diff >= 3) {
    return {
      direction: 'up',
      diff,
      text: `En hausse de ${diff} mmHg par rapport au mois dernier`,
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    };
  }
  return {
    direction: 'stable',
    diff,
    text: 'Tension stabilisée par rapport aux 30 derniers jours',
    colorClass: 'text-teal-700 bg-teal-50 border-teal-200',
  };
}
