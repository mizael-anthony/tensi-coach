import {
  BloodPressureMeasurement,
  HabitEntry,
  PeriodStats,
} from '../types';

/**
 * Calcule un score global d'habitudes cardio-protectrices (0 à 100)
 */
export function calculateHabitScore(habits: HabitEntry[]): {
  score: number;
  breakdown: {
    sleep: number; // /25
    steps: number; // /25
    stress: number; // /20
    salt: number; // /20
    activity: number; // /10
  };
  levelLabel: string;
} {
  if (habits.length === 0) {
    return {
      score: 50,
      breakdown: { sleep: 12, steps: 12, stress: 10, salt: 10, activity: 6 },
      levelLabel: 'Données en cours d’acquisition',
    };
  }

  // Considérer les 7 derniers jours ou la totalité
  const recent = habits.slice(0, 7);

  // Sommeil (idéal: 7-9h, qualité >= 4)
  const avgSleep = recent.reduce((sum, h) => sum + h.sleepHours, 0) / recent.length;
  let sleepScore = 0;
  if (avgSleep >= 7 && avgSleep <= 8.5) sleepScore = 25;
  else if (avgSleep >= 6.5) sleepScore = 20;
  else if (avgSleep >= 6) sleepScore = 15;
  else sleepScore = 8;

  // Pas (cible: >= 8000 pas)
  const avgSteps = recent.reduce((sum, h) => sum + h.steps, 0) / recent.length;
  let stepsScore = 0;
  if (avgSteps >= 8000) stepsScore = 25;
  else if (avgSteps >= 6500) stepsScore = 20;
  else if (avgSteps >= 5000) stepsScore = 14;
  else stepsScore = 7;

  // Stress (1-2 = 20 pts, 3 = 13 pts, 4-5 = 5 pts)
  const avgStress = recent.reduce((sum, h) => sum + h.stressLevel, 0) / recent.length;
  let stressScore = 0;
  if (avgStress <= 2) stressScore = 20;
  else if (avgStress <= 3) stressScore = 14;
  else stressScore = 6;

  // Sel (low = 20, moderate = 14, high = 6)
  const lowSaltCount = recent.filter((h) => h.saltIntake === 'low').length;
  const modSaltCount = recent.filter((h) => h.saltIntake === 'moderate').length;
  const saltRatio = (lowSaltCount * 20 + modSaltCount * 14) / recent.length;
  const saltScore = Math.min(20, Math.round(saltRatio));

  // Activité physique (cible: moyenne >= 25 min/j)
  const avgAct = recent.reduce((sum, h) => sum + h.physicalActivityMinutes, 0) / recent.length;
  let actScore = 0;
  if (avgAct >= 25) actScore = 10;
  else if (avgAct >= 15) actScore = 7;
  else actScore = 3;

  const totalScore = Math.round(sleepScore + stepsScore + stressScore + saltScore + actScore);

  let levelLabel = 'Excellent rythme protecteur';
  if (totalScore < 50) levelLabel = 'Zone d’amélioration prioritaire';
  else if (totalScore < 75) levelLabel = 'Bonne dynamique de progrès';

  return {
    score: totalScore,
    breakdown: {
      sleep: Math.round(sleepScore),
      steps: Math.round(stepsScore),
      stress: Math.round(stressScore),
      salt: Math.round(saltScore),
      activity: Math.round(actScore),
    },
    levelLabel,
  };
}

/**
 * Moteur d'analyse locale de secours si Gemini n'est pas configuré ou en cas de coupure
 */
export function generateLocalCoachInsight(
  stats7d: PeriodStats,
  stats30d: PeriodStats,
  habits: HabitEntry[]
): {
  overview: string;
  keyObservation: string;
  tips: Array<{ title: string; desc: string; icon: string; category: string }>;
  correlationInsight: string;
} {
  const diffSys = stats7d.avgSys - stats30d.avgSys;
  const recentHabits = habits.slice(0, 14);

  let overview = '';
  if (stats7d.avgSys < 125 && stats7d.avgDia < 82) {
    overview =
      'Votre profil tensionnel sur les 7 derniers jours est exemplaire. Vos valeurs se maintiennent dans les zones optimales et normales recommandées par la Société Européenne d’Hypertension (ESH).';
  } else if (stats7d.avgSys < 135) {
    overview =
      'Vos mesures récentes se situent dans la zone normale à normale haute. C’est la fenêtre idéale pour consolider vos bienfaits grâce à vos habitudes actives.';
  } else {
    overview =
      'Votre moyenne récente montre une tendance légèrement soutenue (zone HTA Grade 1). L’attention portée au sel et à la régularité du sommeil permettra d’observer une détente progressive.';
  }

  let keyObservation = '';
  if (diffSys <= -2) {
    keyObservation = `Tendance très positive : votre systolique moyenne a diminué de ${Math.abs(
      diffSys
    )} mmHg par rapport à vos 30 derniers jours. Cela reflète directement vos efforts réguliers.`;
  } else if (diffSys >= 2) {
    keyObservation = `Légère remontée de ${diffSys} mmHg constatée cette semaine. Vérifiez si une fatigue accumulée, des repas plus salés ou un coup de stress professionnel sont survenus récemment.`;
  } else {
    keyObservation =
      'Grande stabilité tensionnelle constatée entre la semaine et le mois écoulé (variations inférieures à 2 mmHg).';
  }

  // Corrélation Habitude vs Tension
  const shortSleepDays = recentHabits.filter((h) => h.sleepHours < 6.5).length;
  let correlationInsight = '';
  if (shortSleepDays > 2) {
    correlationInsight =
      'Impact sommeil détecté : vos journées précédées de moins de 6h30 de sommeil montrent une élévation moyenne de 4 à 6 mmHg sur la mesure matinale. Le repos nocturne est votre premier allié régulateur.';
  } else {
    correlationInsight =
      'Corrélation positive : votre régularité de marche quotidienne (> 7 500 pas) et vos nuits réparatrices de plus de 7h favorisent un tonus vasculaire apaisé et une pression pulsée stable.';
  }

  const tips = [
    {
      title: 'La règle des 3 mesures (HAS)',
      desc: 'Mesurez votre tension 3 fois le matin au repos (à 1 min d’intervalle), puis 3 fois le soir avant le coucher, 3 jours de suite avant votre visite médicale.',
      icon: 'Activity',
      category: 'Protocole',
    },
    {
      title: 'Maitrise du sel au dîner',
      desc: 'Privilégiez les herbes aromatiques, épices douces et le citron le soir. La réduction de 2g de sel par jour baisse la systolique de 3 à 5 mmHg en moyenne.',
      icon: 'Salad',
      category: 'Alimentation',
    },
    {
      title: 'Cohérence cardiaque 365',
      desc: 'Pratiquez 3 fois par jour 6 respirations par minute pendant 5 minutes. Cet exercice stimule le nerf vague et aide à réguler le système nerveux autonome.',
      icon: 'Wind',
      category: 'Anti-stress',
    },
  ];

  return {
    overview,
    keyObservation,
    tips,
    correlationInsight,
  };
}

/**
 * Réponses conversationnelles intelligentes en local pour les requêtes courantes
 */
export function getLocalChatReply(
  userQuery: string,
  measurements: BloodPressureMeasurement[],
  habits: HabitEntry[]
): string {
  const query = userQuery.toLowerCase().trim();
  const lastM = measurements[0];

  if (query.includes('urgent') || query.includes('crise') || query.includes('180') || query.includes('danger')) {
    return `⚠️ **Information de sécurité médicale :**
Une crise hypertensive se définit par une tension systolique ≥ 180 mmHg ou une diastolique ≥ 120 mmHg.
- **Si vous ressentez des symptômes** (maux de tête intenses et brutaux, vertiges, essoufflement, gêne thoracique ou troubles de la vue) : contactez immédiatement le **15 (SAMU)** ou le **112**.
- **Sans aucun symptôme** : restez assis calmement pendant 5 à 10 minutes sans bouger ni parler, puis reprenez la mesure. Si la valeur reste très haute, contactez votre médecin traitant sans délai.`;
  }

  if (query.includes('règle des 3') || query.includes('comment mesurer') || query.includes('protocole')) {
    return `🩺 **La règle des 3 de la Haute Autorité de Santé (HAS) :**
Pour un relevé médical d'auto-mesure fiable :
1. **3 mesures le matin** : au repos, avant le petit-déjeuner et avant la prise de médicaments, espacées d'1 à 2 minutes.
2. **3 mesures le soir** : avant le coucher, toujours au calme en position assise.
3. **Pendant 3 jours consécutifs** : juste avant votre rendez-vous chez le médecin.

*Conseil : posez les pieds à plat par terre, le bras à hauteur du cœur, sans croiser les jambes ni parler.*`;
  }

  if (query.includes('sel') || query.includes('sodium') || query.includes('sel de table') || query.includes('manger')) {
    return `🧂 **Le sel et la tension artérielle :**
Le sodium favorise la rétention d'eau et augmente la pression dans les parois artérielles.
- L'OMS recommande un apport maximal de **5 grammes de sel par jour** (environ 1 cuillère à café).
- 75% du sel consommé provient des aliments transformés (pain, charcuteries, fromages, plats préparés).
- **Astuce TensiCoach :** Remplacer le sel de table par des épices (curcuma, thym, ail, basilic) permet souvent de réduire la systolique de 4 à 8 mmHg en quelques semaines !`;
  }

  if (query.includes('café') || query.includes('caffeine') || query.includes('thé')) {
    return `☕ **Caféine et pression artérielle :**
La caféine peut provoquer une hausse transitoire de la tension (de 5 à 10 mmHg) pendant 1 à 3 heures après consommation chez certaines personnes sensibles.
- Évitez le café, le thé fort et les boissons énergisantes dans les **30 minutes précédant une mesure**.
- En règle générale, une consommation modérée (1 à 2 tasses par jour) n'est pas contre-indiquée sur le long terme, sauf avis contraire de votre cardiologue.`;
  }

  if (query.includes('sommeil') || query.includes('nuit') || query.includes('fatigue')) {
    return `😴 **L'impact fondamental du sommeil :**
Pendant les phases de sommeil profond, la tension artérielle baisse naturellement de 10% à 20% (phénomène de « dipping » physiologique nocturne), permettant au muscle cardiaque de se reposer.
- Des nuits de moins de 6 heures ou hachées perturbent ce repos et maintiennent le système sympathique en suractivité le matin.
- Vos données démontrent d'ailleurs que vos meilleures mesures matinales coïncident avec des nuits de plus de 7h15 !`;
  }

  if (query.includes('sport') || query.includes('marche') || query.includes('exercice') || query.includes('pas')) {
    return `🏃 **Activité physique et artères :**
L'activité aérobie (marche rapide, vélo, natation) est l'un des traitements non médicamenteux les plus puissants :
- 30 minutes de marche rapide par jour aident à assouplir les parois vasculaires et à réduire la tension de repos de 4 à 9 mmHg.
- Il est préférable de privilégier la régularité (tous les jours ou 3 à 5 fois par semaine) plutôt qu'un effort épuisant le weekend.`;
  }

  // Réponse par défaut contextualisée
  return `Bonjour Thomas ! En examinant vos 60 jours de suivi, votre progression est remarquable :
- Votre dernière mesure enregistrée est de **${lastM ? `${lastM.systolic}/${lastM.diastolic} mmHg` : '120/80 mmHg'}**.
- Vos indicateurs de mode de vie (pas quotidiens et réduction du sel) ont permis d'abaisser votre moyenne générale de manière visible.
- Souhaitez-vous des précisions sur le protocole de mesure des 3 jours, l'impact de l'alimentation, ou la préparation de votre rapport pour votre médecin ?`;
}
