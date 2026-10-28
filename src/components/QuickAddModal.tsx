import React, { useState } from 'react';
import { X, Check, AlertTriangle, ShieldAlert, Heart, Clock, Info } from 'lucide-react';
import { BloodPressureMeasurement, MeasurementMoment, BodyPosition, ArmSide } from '../types';
import { classifyBloodPressure } from '../utils/bloodPressure';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (measurement: Omit<BloodPressureMeasurement, 'id'>) => void;
  onTriggerCrisisAlert?: (sys: number, dia: number) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onTriggerCrisisAlert,
}) => {
  // Determine default moment based on current hour
  const currentHour = new Date().getHours();
  const defaultMoment: MeasurementMoment =
    currentHour < 11 ? 'morning' : currentHour < 17 ? 'midday' : 'evening';

  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [pulse, setPulse] = useState<number>(72);
  const [moment, setMoment] = useState<MeasurementMoment>(defaultMoment);
  const [arm, setArm] = useState<ArmSide>('left');
  const [position, setPosition] = useState<BodyPosition>('sitting');
  const [note, setNote] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  if (!isOpen) return null;

  const classification = classifyBloodPressure(systolic, diastolic);
  const isCrisis = systolic >= 180 || diastolic >= 120;
  const isHypo = systolic < 90 || diastolic < 60;

  // 1-Click Fast Presets
  const presets = [
    { label: '120 / 80', sys: 120, dia: 80, pulse: 70, desc: 'Optimale' },
    { label: '125 / 82', sys: 125, dia: 82, pulse: 72, desc: 'Normale' },
    { label: '135 / 86', sys: 135, dia: 86, pulse: 75, desc: 'Norm. haute' },
    { label: '142 / 92', sys: 142, dia: 92, pulse: 78, desc: 'HTA 1' },
  ];

  const handleApplyPreset = (sys: number, dia: number, p: number) => {
    setSystolic(sys);
    setDiastolic(dia);
    setPulse(p);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isCrisis && onTriggerCrisisAlert) {
      onTriggerCrisisAlert(systolic, diastolic);
    }

    onSave({
      timestamp: new Date().toISOString(),
      systolic,
      diastolic,
      pulse,
      moment,
      position,
      arm,
      note: note.trim() || undefined,
      isDemo: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-teal-600 fill-teal-100" />
              <span>Ajouter une mesure</span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Saisie express en moins de 3 interactions
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Quick Presets for 1-Tap Entry */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
              Préréglages rapides (1 clic)
            </span>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((preset) => {
                const isSelected = systolic === preset.sys && diastolic === preset.dia;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset.sys, preset.dia, preset.pulse)}
                    className={`py-2 px-1 rounded-xl text-center border transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-teal-50/60 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{preset.label}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                      {preset.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Steppers for Systolic & Diastolic */}
          <div className="grid grid-cols-2 gap-3">
            {/* Systolic */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Systolique</label>
                <span className="text-[10px] text-slate-600 uppercase font-medium">SYS (mmHg)</span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => setSystolic((v) => Math.max(70, v - 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-xs text-lg font-bold text-slate-700 hover:bg-slate-100 active:scale-95 flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value) || 0)}
                  min={60}
                  max={240}
                  className="w-16 text-center text-2xl font-extrabold text-slate-900 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSystolic((v) => Math.min(240, v + 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-xs text-lg font-bold text-slate-700 hover:bg-slate-100 active:scale-95 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Diastolic */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Diastolique</label>
                <span className="text-[10px] text-slate-600 uppercase font-medium">DIA (mmHg)</span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => setDiastolic((v) => Math.max(40, v - 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-xs text-lg font-bold text-slate-700 hover:bg-slate-100 active:scale-95 flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value) || 0)}
                  min={40}
                  max={160}
                  className="w-16 text-center text-2xl font-extrabold text-slate-900 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setDiastolic((v) => Math.min(160, v + 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-xs text-lg font-bold text-slate-700 hover:bg-slate-100 active:scale-95 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Pulse row + Category status badge */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
              <div>
                <span className="text-xs font-bold text-slate-700 block leading-tight">Pouls</span>
                <span className="text-[10px] text-slate-600">BPM (au repos)</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPulse((v) => Math.max(40, v - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-100 active:scale-95 flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value) || 0)}
                min={40}
                max={200}
                className="w-12 text-center text-lg font-bold text-slate-900 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setPulse((v) => Math.min(200, v + 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-100 active:scale-95 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Real-time Category Feedback */}
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${classification.bgColor}`}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold block">{classification.label}</span>
              <p className="opacity-90 text-[11px] mt-0.5">{classification.recommendation}</p>
            </div>
          </div>

          {/* CRITICAL WARNING IF CRISIS (>=180 or >=120) */}
          {isCrisis && (
            <div className="p-3.5 rounded-xl bg-red-100 border-2 border-red-500 text-red-900 animate-pulse">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                <span>Alerte valeur très élevée</span>
              </div>
              <p className="text-xs mt-1 leading-relaxed">
                Reprenez la mesure au calme dans 5 minutes. En présence de malaise, céphalées violentes,
                douleur dans la poitrine ou vision trouble, <strong>contactez immédiatement le 15 ou les urgences</strong>.
              </p>
            </div>
          )}

          {/* WARNING IF HYPOTENSION (<90 or <60) */}
          {isHypo && (
            <div className="p-3 rounded-xl bg-sky-100 border border-sky-400 text-sky-900">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-sky-700 shrink-0" />
                <span>Valeur basse détectée</span>
              </div>
              <p className="text-[11px] mt-0.5">
                Restez assis, buvez un grand verre d'eau. Évitez de vous lever brusquement.
              </p>
            </div>
          )}

          {/* Advanced options toggle (Moment, Arm, Notes) */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{showAdvanced ? 'Masquer les détails' : 'Plus de détails (moment, bras, note)'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                {/* Moment */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Moment</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['morning', 'midday', 'evening'] as MeasurementMoment[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMoment(m)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center ${
                          moment === m
                            ? 'bg-blue-900 text-white border-blue-900'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {m === 'morning' ? 'Matin' : m === 'midday' ? 'Midi' : 'Soir'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Arm & Position */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Bras</label>
                    <div className="flex gap-1">
                      {(['left', 'right'] as ArmSide[]).map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setArm(a)}
                          className={`flex-1 py-1 rounded-lg text-xs font-medium border ${
                            arm === a
                              ? 'bg-blue-900 text-white border-blue-900'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {a === 'left' ? 'Gauche' : 'Droit'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Position</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value as BodyPosition)}
                      className="w-full py-1 px-2 rounded-lg text-xs bg-white border border-slate-200 text-slate-700"
                    >
                      <option value="sitting">Assis (recommandé)</option>
                      <option value="lying">Allongé</option>
                      <option value="standing">Debout</option>
                    </select>
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Note optionnelle</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ex: après café, au calme..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button (Total interactions: 2 taps!) */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-900 to-teal-700 hover:from-blue-950 hover:to-teal-800 active:scale-[0.99] shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-5 h-5 text-emerald-300" />
              <span>Enregistrer la mesure ({systolic} / {diastolic})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
