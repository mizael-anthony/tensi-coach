import React, { useState, useMemo } from 'react';
import {
  Activity,
  Plus,
  Filter,
  Trash2,
  Calendar,
  Clock,
  Heart,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Info,
  Search,
} from 'lucide-react';
import { BloodPressureMeasurement, MeasurementMoment } from '../types';
import { classifyBloodPressure } from '../utils/bloodPressure';

interface MeasuresTabProps {
  measurements: BloodPressureMeasurement[];
  onOpenQuickAdd: () => void;
  onDeleteMeasurement: (id: string) => void;
}

export const MeasuresTab: React.FC<MeasuresTabProps> = ({
  measurements,
  onOpenQuickAdd,
  onDeleteMeasurement,
}) => {
  const [periodFilter, setPeriodFilter] = useState<7 | 30 | 60 | 'all'>(30);
  const [momentFilter, setMomentFilter] = useState<'all' | MeasurementMoment>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'high' | 'normal'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Filtered dataset
  const filteredMeasurements = useMemo(() => {
    const now = new Date();
    return measurements.filter((m) => {
      // Period filter
      if (periodFilter !== 'all') {
        const cutoff = new Date(now.getTime() - periodFilter * 24 * 60 * 60 * 1000);
        if (new Date(m.timestamp) < cutoff) return false;
      }
      // Moment filter
      if (momentFilter !== 'all' && m.moment !== momentFilter) return false;

      // Status filter
      if (statusFilter === 'high' && m.systolic < 140 && m.diastolic < 90) return false;
      if (statusFilter === 'normal' && (m.systolic >= 140 || m.diastolic >= 90)) return false;

      return true;
    });
  }, [measurements, periodFilter, momentFilter, statusFilter]);

  // Data sorted chronologically for chart display (oldest to newest)
  const chartData = useMemo(() => {
    return [...filteredMeasurements].reverse().slice(-40); // Max 40 points for clear SVG readability
  }, [filteredMeasurements]);

  // SVG Chart Calculations
  const chartHeight = 220;
  const chartWidth = 560;
  const paddingX = 40;
  const paddingY = 24;

  const minVal = 50;
  const maxVal = 180;

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    return chartHeight - paddingY - ((clamped - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
  };

  const getX = (index: number, total: number) => {
    if (total <= 1) return chartWidth / 2;
    return paddingX + (index / (total - 1)) * (chartWidth - paddingX * 2);
  };

  // Build SVG path
  const sysPoints = chartData.map((d, i) => `${getX(i, chartData.length)},${getY(d.systolic)}`).join(' ');
  const diaPoints = chartData.map((d, i) => `${getX(i, chartData.length)},${getY(d.diastolic)}`).join(' ');

  const activePoint =
    selectedPointIndex !== null && chartData[selectedPointIndex]
      ? chartData[selectedPointIndex]
      : chartData[chartData.length - 1];

  const activeClassification = activePoint
    ? classifyBloodPressure(activePoint.systolic, activePoint.diastolic)
    : null;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Top Header with Quick Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span>Journal des Mesures</span>
          </h1>
          <p className="text-xs text-slate-500">
            {filteredMeasurements.length} mesure(s) enregistrée(s)
          </p>
        </div>
        <button
          onClick={onOpenQuickAdd}
          className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-blue-900 to-teal-700 hover:from-blue-950 hover:to-teal-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-900/10 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-300 stroke-[3]" />
          <span>+ Mesure</span>
        </button>
      </div>

      {/* Interactive SVG Chart Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Courbe d’évolution tensionnelle
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs font-semibold">
              <span className="flex items-center gap-1 text-blue-900">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-900" />
                Systolique (SYS)
              </span>
              <span className="flex items-center gap-1 text-teal-600">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                Diastolique (DIA)
              </span>
            </div>
          </div>

          {/* Period selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto">
            {([7, 30, 60, 'all'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodFilter(p)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  periodFilter === p
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p === 'all' ? 'Tout' : `${p}j`}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Data Point Inspector Tooltip */}
        {activePoint && activeClassification && (
          <div className="mb-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">
                {new Date(activePoint.timestamp).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono font-bold text-blue-900">{activePoint.systolic}</span>
              <span className="text-slate-400">/</span>
              <span className="font-mono font-bold text-teal-700">{activePoint.diastolic} mmHg</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 font-mono">{activePoint.pulse} bpm</span>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: activeClassification.bgColor,
                color: activeClassification.textColor,
              }}
            >
              {activeClassification.shortLabel}
            </span>
          </div>
        )}

        {/* SVG Canvas */}
        {chartData.length > 0 ? (
          <div className="relative overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto min-w-[320px] select-none"
            >
              {/* Reference Grid lines */}
              {/* 140 mmHg HTA line */}
              <line
                x1={paddingX}
                y1={getY(140)}
                x2={chartWidth - paddingX}
                y2={getY(140)}
                stroke="#f97316"
                strokeDasharray="4 4"
                strokeWidth="1.2"
                opacity="0.6"
              />
              <text
                x={paddingX + 4}
                y={getY(140) - 4}
                fill="#ea580c"
                fontSize="10"
                fontWeight="600"
              >
                Seuil HTA (140)
              </text>

              {/* 120 mmHg Optimal SYS */}
              <line
                x1={paddingX}
                y1={getY(120)}
                x2={chartWidth - paddingX}
                y2={getY(120)}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeWidth="1"
                opacity="0.5"
              />
              <text
                x={paddingX + 4}
                y={getY(120) - 4}
                fill="#059669"
                fontSize="9"
                fontWeight="500"
              >
                Cible SYS (120)
              </text>

              {/* 80 mmHg Optimal DIA */}
              <line
                x1={paddingX}
                y1={getY(80)}
                x2={chartWidth - paddingX}
                y2={getY(80)}
                stroke="#14b8a6"
                strokeDasharray="3 3"
                strokeWidth="1"
                opacity="0.5"
              />
              <text
                x={paddingX + 4}
                y={getY(80) - 4}
                fill="#0d9488"
                fontSize="9"
                fontWeight="500"
              >
                Cible DIA (80)
              </text>

              {/* Area fill for Systolic/Diastolic band */}
              {chartData.length > 1 && (
                <polygon
                  points={`${sysPoints} ${chartData
                    .map((_, i) => {
                      const revIdx = chartData.length - 1 - i;
                      return `${getX(revIdx, chartData.length)},${getY(chartData[revIdx].diastolic)}`;
                    })
                    .join(' ')}`}
                  fill="url(#pressureGradient)"
                  opacity="0.15"
                />
              )}

              <defs>
                <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
              </defs>

              {/* Systolic Polyline */}
              {chartData.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={sysPoints}
                />
              )}

              {/* Diastolic Polyline */}
              {chartData.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={diaPoints}
                />
              )}

              {/* Data points */}
              {chartData.map((d, i) => {
                const cx = getX(i, chartData.length);
                const cySys = getY(d.systolic);
                const cyDia = getY(d.diastolic);
                const isSelected = selectedPointIndex === i;

                return (
                  <g
                    key={d.id}
                    onClick={() => setSelectedPointIndex(i)}
                    className="cursor-pointer group"
                  >
                    {/* Systolic Point */}
                    <circle
                      cx={cx}
                      cy={cySys}
                      r={isSelected ? 6 : 4}
                      fill="#1e3a8a"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all hover:scale-125"
                    />
                    {/* Diastolic Point */}
                    <circle
                      cx={cx}
                      cy={cyDia}
                      r={isSelected ? 5.5 : 3.5}
                      fill="#0d9488"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all hover:scale-125"
                    />
                  </g>
                );
              })}
            </svg>
            <p className="text-[10px] text-center text-slate-600 mt-1">
              Touchez un point de la courbe pour inspecter les détails de la mesure
            </p>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-600">
            Aucune mesure ne correspond aux filtres sélectionnés.
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Moment Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-600">Moment :</span>
          <div className="flex gap-1">
            {(['all', 'morning', 'evening', 'midday'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMomentFilter(m)}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  momentFilter === m
                    ? 'bg-teal-700 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m === 'all' ? 'Tous' : m === 'morning' ? 'Matin' : m === 'evening' ? 'Soir' : 'Midi'}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-600">Statut :</span>
          <div className="flex gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-1 rounded-lg font-medium ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStatusFilter('high')}
              className={`px-2 py-1 rounded-lg font-medium ${
                statusFilter === 'high'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'bg-slate-100 text-orange-700 hover:bg-slate-200'
              }`}
            >
              Élevées
            </button>
            <button
              onClick={() => setStatusFilter('normal')}
              className={`px-2 py-1 rounded-lg font-medium ${
                statusFilter === 'normal'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 text-emerald-700 hover:bg-slate-200'
              }`}
            >
              Normales
            </button>
          </div>
        </div>
      </div>

      {/* Measurements List */}
      <div className="space-y-2.5">
        {filteredMeasurements.map((m) => {
          const classification = classifyBloodPressure(m.systolic, m.diastolic);
          const isConfirmingDelete = deleteConfirmId === m.id;

          const dateObj = new Date(m.timestamp);
          const formattedDate = dateObj.toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          });
          const formattedTime = dateObj.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={m.id}
              className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between gap-3"
            >
              {/* Left: Date, Moment & Classification */}
              <div className="flex items-start gap-3">
                <div
                  className="w-1.5 self-stretch rounded-full"
                  style={{ backgroundColor: classification.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 capitalize">
                      {formattedDate}
                    </span>
                    <span className="text-[11px] text-slate-600 font-mono flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-slate-600" />
                      {formattedTime}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      {m.moment === 'morning' ? 'Matin' : m.moment === 'evening' ? 'Soir' : 'Midi'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: classification.bgColor,
                        color: classification.textColor,
                      }}
                    >
                      {classification.shortLabel}
                    </span>
                    {m.note && (
                      <span className="text-[11px] text-slate-500 italic truncate max-w-[150px] sm:max-w-xs">
                        « {m.note} »
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Numbers and Delete action */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900 font-mono leading-tight">
                    {m.systolic} <span className="text-slate-400 font-light">/</span> {m.diastolic}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium flex items-center justify-end gap-1">
                    <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                    <span>{m.pulse} bpm</span>
                  </div>
                </div>

                {/* Delete button or confirmation */}
                {isConfirmingDelete ? (
                  <div className="flex items-center gap-1 bg-red-50 p-1 rounded-xl border border-red-200">
                    <button
                      onClick={() => {
                        onDeleteMeasurement(m.id);
                        setDeleteConfirmId(null);
                      }}
                      className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1 bg-white text-slate-700 text-[10px] font-bold rounded-lg hover:bg-slate-100 border border-slate-200"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(m.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Supprimer cette mesure"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredMeasurements.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-500">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">Aucune mesure trouvée</p>
            <p className="text-xs text-slate-400 mt-1">
              Modifiez vos critères de filtrage ou ajoutez une nouvelle mesure.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
