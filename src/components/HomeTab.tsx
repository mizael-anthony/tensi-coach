import React, { useState } from 'react';
import {
  Heart,
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Sparkles,
  Plus,
  Calendar,
  Clock,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  Zap,
  Moon,
  Footprints,
  Salad,
  Wind,
} from 'lucide-react';
import { BloodPressureMeasurement, HabitEntry, PeriodStats } from '../types';
import {
  classifyBloodPressure,
  computePeriodStats,
  getTrendSummary,
  calculateMAP,
  calculatePulsePressure,
} from '../utils/bloodPressure';
import { calculateHabitScore } from '../utils/localCoach';

interface HomeTabProps {
  measurements: BloodPressureMeasurement[];
  habits: HabitEntry[];
  onOpenQuickAdd: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  measurements,
  habits,
  onOpenQuickAdd,
  onNavigateToTab,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 30 | 60>(7);

  const lastM = measurements[0];
  const lastClassification = lastM
    ? classifyBloodPressure(lastM.systolic, lastM.diastolic)
    : null;

  const stats7d = computePeriodStats(measurements, 7);
  const stats30d = computePeriodStats(measurements, 30);
  const stats60d = computePeriodStats(measurements, 60);

  const currentStats =
    selectedPeriod === 7 ? stats7d : selectedPeriod === 30 ? stats30d : stats60d;

  const trend = getTrendSummary(stats7d, stats30d);
  const habitSummary = calculateHabitScore(habits);

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Hero: Dernière Mesure Card */}
      <section className="bg-gradient-to-br from-blue-950 via-slate-900 to-teal-950 text-white rounded-3xl p-5 shadow-xl border border-teal-900/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Dernière mesure
            </span>
          </div>
          {lastM && (
            <span className="text-[11px] text-slate-300 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-teal-400" />
              <span>{formatDate(lastM.timestamp)}</span>
            </span>
          )}
        </div>

        {lastM ? (
          <div className="relative z-10">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-1.5">
                <div className="flex items-baseline">
                  <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white font-mono">
                    {lastM.systolic}
                  </span>
                  <span className="text-2xl text-slate-400 font-light mx-1">/</span>
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-teal-200 font-mono">
                    {lastM.diastolic}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400 ml-1">mmHg</span>
              </div>

              {/* Pouls badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30 animate-pulse" />
                <span className="text-sm font-bold text-white font-mono">{lastM.pulse}</span>
                <span className="text-[10px] text-slate-300">bpm</span>
              </div>
            </div>

            {/* Classification & Details */}
            {lastClassification && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  style={{
                    backgroundColor: lastClassification.color,
                    color: '#ffffff',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {lastClassification.label}
                </span>

                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-slate-200">
                  {lastM.moment === 'morning' ? 'Matin (au repos)' : lastM.moment === 'midday' ? 'Midi' : 'Soir'}
                </span>

                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  PAM : {calculateMAP(lastM.systolic, lastM.diastolic)} mmHg · Pression pulsée : {calculatePulsePressure(lastM.systolic, lastM.diastolic)} mmHg
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-slate-300 mb-3">Aucune mesure enregistrée pour le moment.</p>
            <button
              onClick={onOpenQuickAdd}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
            >
              Ajouter ma première mesure
            </button>
          </div>
        )}

        {/* Action express button */}
        <div className="mt-4 pt-3 flex items-center justify-between relative z-10">
          <button
            onClick={onOpenQuickAdd}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Ajouter une mesure express (&lt; 3 clics)</span>
          </button>
        </div>
      </section>

      {/* Moyennes & Tendances (7j, 30j, 60j) */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Moyennes & Tendances</span>
            </h2>
            <p className="text-[11px] text-slate-600">
              Analyse comparative temporelle
            </p>
          </div>

          {/* Period selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            {([7, 30, 60] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedPeriod === period
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period}j
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Trend Alert Banner */}
        <div className={`p-3 rounded-2xl border mb-4 flex items-center justify-between ${trend.colorClass}`}>
          <div className="flex items-center gap-2">
            {trend.direction === 'down' ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <TrendingDown className="w-4 h-4" />
              </div>
            ) : trend.direction === 'up' ? (
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                <Minus className="w-4 h-4" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold block">{trend.text}</span>
              <span className="text-[10px] opacity-80">
                Basé sur {stats7d.totalMeasurements} mesures sur 7 jours vs {stats30d.totalMeasurements} sur 30 jours
              </span>
            </div>
          </div>
        </div>

        {/* Grid of Averages */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              Moyenne {selectedPeriod}j
            </span>
            <div className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
              {currentStats.avgSys} <span className="text-slate-600 font-normal text-xs">/ {currentStats.avgDia}</span>
            </div>
            <span className="text-[10px] text-teal-700 font-semibold block mt-0.5">
              {classifyBloodPressure(currentStats.avgSys, currentStats.avgDia).shortLabel}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              Matin (HAS)
            </span>
            <div className="text-lg font-extrabold text-blue-900 font-mono mt-0.5">
              {currentStats.morningAvgSys} <span className="text-slate-600 font-normal text-xs">/ {currentStats.morningAvgDia}</span>
            </div>
            <span className="text-[10px] text-slate-600 block mt-0.5">
              Au réveil
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              Soir (HAS)
            </span>
            <div className="text-lg font-extrabold text-indigo-900 font-mono mt-0.5">
              {currentStats.eveningAvgSys} <span className="text-slate-600 font-normal text-xs">/ {currentStats.eveningAvgDia}</span>
            </div>
            <span className="text-[10px] text-slate-600 block mt-0.5">
              Avant coucher
            </span>
          </div>
        </div>

        {/* Secondary metrics */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg">
            <span>Mesures dans la cible :</span>
            <span className="font-bold text-emerald-700">{currentStats.optimalPercentage}%</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg">
            <span>Pouls moyen :</span>
            <span className="font-bold text-slate-800">{currentStats.avgPulse} bpm</span>
          </div>
        </div>
      </section>

      {/* Score d'habitudes cardio-protectrices */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Score d’habitudes cardio-protectrices</span>
            </h2>
            <p className="text-[11px] text-slate-600">
              {habitSummary.levelLabel}
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('habits')}
            className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-0.5"
          >
            <span>Détails</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Big Score Display */}
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/60 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex flex-col items-center justify-center font-extrabold shadow-sm">
            <span className="text-xl leading-none font-mono">{habitSummary.score}</span>
            <span className="text-[9px] text-teal-100 uppercase font-semibold">/100</span>
          </div>
          <div className="flex-1">
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${habitSummary.score}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5">
              Vos pas quotidiens et vos nuits de qualité réduisent activement votre résistance vasculaire.
            </p>
          </div>
        </div>

        {/* 4 Mini indicators */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <Moon className="w-4 h-4 mx-auto text-indigo-500 mb-1" />
            <span className="text-[10px] text-slate-600 block">Sommeil</span>
            <span className="font-bold text-slate-800 text-[11px]">
              {habitSummary.breakdown.sleep}/25
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <Footprints className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
            <span className="text-[10px] text-slate-600 block">Pas</span>
            <span className="font-bold text-slate-800 text-[11px]">
              {habitSummary.breakdown.steps}/25
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <Wind className="w-4 h-4 mx-auto text-teal-500 mb-1" />
            <span className="text-[10px] text-slate-600 block">Stress</span>
            <span className="font-bold text-slate-800 text-[11px]">
              {habitSummary.breakdown.stress}/20
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <Salad className="w-4 h-4 mx-auto text-rose-500 mb-1" />
            <span className="text-[10px] text-slate-600 block">Sel bas</span>
            <span className="font-bold text-slate-800 text-[11px]">
              {habitSummary.breakdown.salt}/20
            </span>
          </div>
        </div>
      </section>

      {/* Conseil IA Quotidien */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-400 text-slate-900 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Conseil TensiCoach IA du jour
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-teal-200">
            Éducatif
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed mt-2">
          « Thomas, votre régularité actuelle de <strong>8 500 pas par jour</strong> combinée à des dîners allégés en sodium a contribué à stabiliser votre diastolique sous les 80 mmHg. Continuez à vous accorder 5 minutes de respiration apaisée avant le coucher ce soir ! »
        </p>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => onNavigateToTab('coach')}
            type="button"
            className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Poser une question au Coach IA</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateToTab('report')}
            type="button"
            className="text-[11px] text-slate-300 hover:text-white underline underline-offset-2"
          >
            Voir mon rapport médecin
          </button>
        </div>
      </section>
    </div>
  );
};
