import React, { useState } from 'react';
import {
  HeartHandshake,
  Moon,
  Footprints,
  Wind,
  Salad,
  Activity,
  Droplets,
  Coffee,
  Check,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Save,
} from 'lucide-react';
import { HabitEntry, SaltLevel } from '../types';
import { calculateHabitScore } from '../utils/localCoach';

interface HabitsTabProps {
  habits: HabitEntry[];
  onUpdateTodayHabit: (entry: HabitEntry) => void;
}

export const HabitsTab: React.FC<HabitsTabProps> = ({ habits, onUpdateTodayHabit }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const existingToday = habits.find((h) => h.date === todayStr);

  const [sleepHours, setSleepHours] = useState<number>(existingToday?.sleepHours ?? 7.5);
  const [sleepQuality, setSleepQuality] = useState<number>(existingToday?.sleepQuality ?? 4);
  const [steps, setSteps] = useState<number>(existingToday?.steps ?? 8500);
  const [stressLevel, setStressLevel] = useState<number>(existingToday?.stressLevel ?? 2);
  const [saltIntake, setSaltIntake] = useState<SaltLevel>(existingToday?.saltIntake ?? 'low');
  const [activityMinutes, setActivityMinutes] = useState<number>(existingToday?.physicalActivityMinutes ?? 30);
  const [waterLiters, setWaterLiters] = useState<number>(existingToday?.waterLiters ?? 1.8);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const habitScore = calculateHabitScore(habits);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTodayHabit({
      id: existingToday?.id || `habit-${todayStr}`,
      date: todayStr,
      sleepHours,
      sleepQuality,
      steps,
      stressLevel,
      saltIntake,
      physicalActivityMinutes: activityMinutes,
      caffeineCups: 1,
      waterLiters,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-teal-600" />
          <span>Suivi des Habitudes</span>
        </h1>
        <p className="text-xs text-slate-500">
          Les 5 leviers non-médicamenteux majeurs de la santé artérielle
        </p>
      </div>

      {/* Global Habits Score Card */}
      <section className="bg-gradient-to-br from-blue-900 to-teal-800 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            Score Cardio-Protecteur Global
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
            {habitScore.levelLabel}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center font-extrabold shadow-md shrink-0">
            <span className="text-2xl font-mono leading-none text-teal-700">{habitScore.score}</span>
            <span className="text-[10px] text-slate-600 uppercase font-bold">/100</span>
          </div>
          <div className="flex-1">
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${habitScore.score}%` }}
              />
            </div>
            <p className="text-xs text-slate-200 mt-2">
              Un score &gt; 75 points est statistiquement associé à une baisse de 5 à 10 mmHg de la pression systolique.
            </p>
          </div>
        </div>
      </section>

      {/* Form: Saisie des habitudes du jour */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Enregistrer mes habitudes du jour</span>
          </h2>
          <span className="text-xs text-slate-600 font-medium">Aujourd’hui</span>
        </div>

        {/* 1. Sommeil */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Sommeil nocturne</span>
                <span className="text-[10px] text-slate-600">Recommandé : 7h à 8h30</span>
              </div>
            </div>
            <span className="text-base font-extrabold text-indigo-900 font-mono">
              {sleepHours}h
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={11}
            step={0.5}
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-xs">
            <span className="text-[11px] text-slate-600">Qualité ressentie :</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSleepQuality(q)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    sleepQuality === q
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Pas du jour */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Footprints className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Activité pédestre</span>
                <span className="text-[10px] text-slate-600">Cible OMS : &ge; 7 500 pas</span>
              </div>
            </div>
            <span className="text-base font-extrabold text-emerald-800 font-mono">
              {steps.toLocaleString('fr-FR')} pas
            </span>
          </div>
          <input
            type="range"
            min={1000}
            max={20000}
            step={500}
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>

        {/* 3. Sel consommé */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Salad className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">Apport en sel estimé</span>
              <span className="text-[10px] text-slate-600">Max 5g/jour recommandé</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'low', label: 'Faible', desc: 'Cuisine maison, sans sel ajouté' },
              { key: 'moderate', label: 'Modéré', desc: 'Repas équilibré standard' },
              { key: 'high', label: 'Élevé', desc: 'Plat préparé, pizza, charcuterie' },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSaltIntake(option.key as SaltLevel)}
                className={`p-2 rounded-xl text-center border transition-all ${
                  saltIntake === option.key
                    ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-1 ring-rose-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs block">{option.label}</span>
                <span className="text-[9px] text-slate-600 block mt-0.5 leading-tight">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Stress ressenti */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Niveau de stress</span>
                <span className="text-[10px] text-slate-600">De 1 (très zen) à 5 (intense)</span>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-900">
              {stressLevel === 1 ? 'Très faible' : stressLevel === 2 ? 'Faible' : stressLevel === 3 ? 'Modéré' : stressLevel === 4 ? 'Élevé' : 'Très intense'}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setStressLevel(lvl)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  stressLevel === lvl
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Activité cardio & Eau */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-bold text-slate-900 block mb-1">Sport / Cardio</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                max={180}
                step={5}
                value={activityMinutes}
                onChange={(e) => setActivityMinutes(Number(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-center font-bold bg-white rounded-lg border border-slate-200 text-sm"
              />
              <span className="text-xs text-slate-500">minutes</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-bold text-slate-900 block mb-1">Hydratation</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0.5}
                max={5}
                step={0.1}
                value={waterLiters}
                onChange={(e) => setWaterLiters(Number(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-center font-bold bg-white rounded-lg border border-slate-200 text-sm"
              />
              <span className="text-xs text-slate-500">Litres</span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.99] flex items-center justify-center gap-2 shadow-md shadow-teal-700/10 transition-all cursor-pointer"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Habitudes du jour enregistrées avec succès !</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Enregistrer mes habitudes d'aujourd'hui</span>
            </>
          )}
        </button>
      </form>

      {/* Visual Correlation: Ce que disent vos 60 jours */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Corrélations constatées sur vos 60 jours</span>
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Comparaison directe entre vos habitudes et vos chiffres tensionnels
        </p>

        <div className="space-y-2.5">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Nuits &lt; 6h30</span>
                <span className="text-[11px] text-slate-500">Moyenne matinale observée</span>
              </div>
            </div>
            <span className="text-sm font-extrabold text-amber-600 font-mono">136 / 88 mmHg</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-emerald-950 block">Nuits &gt; 7h15</span>
                <span className="text-[11px] text-emerald-700">Moyenne matinale observée</span>
              </div>
            </div>
            <span className="text-sm font-extrabold text-emerald-700 font-mono">121 / 79 mmHg</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Salad className="w-4 h-4 text-rose-500" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Dîner salé ou commande pizza</span>
                <span className="text-[11px] text-slate-500">Moyenne lendemain matin</span>
              </div>
            </div>
            <span className="text-sm font-extrabold text-rose-600 font-mono">+6 mmHg SYS</span>
          </div>
        </div>
      </section>
    </div>
  );
};
