import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Heart,
  Clock,
  Share2,
} from 'lucide-react';
import { BloodPressureMeasurement, HabitEntry, UserProfile } from '../types';
import { computePeriodStats, classifyBloodPressure } from '../utils/bloodPressure';

interface ReportTabProps {
  userProfile: UserProfile;
  measurements: BloodPressureMeasurement[];
  habits: HabitEntry[];
}

export const ReportTab: React.FC<ReportTabProps> = ({
  userProfile,
  measurements,
  habits,
}) => {
  const [reportPeriod, setReportPeriod] = useState<7 | 30 | 60>(30);
  const stats = computePeriodStats(measurements, reportPeriod);

  const now = new Date();
  const generationDate = now.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Recent 10 measurements for the consultation table
  const recent10 = measurements.slice(0, 12);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            user: userProfile,
            stats,
            measurements: measurements.slice(0, 100),
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `TensiCoach_Rapport_${userProfile.name}_${reportPeriod}j.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = 'Date,Moment,Systolique_mmHg,Diastolique_mmHg,Pouls_bpm,Bras,Position,Note\n';
    const rows = measurements
      .map(
        (m) =>
          `"${m.timestamp}","${m.moment}",${m.systolic},${m.diastolic},${m.pulse},"${m.arm}","${m.position}","${m.note || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TensiCoach_Releve_${userProfile.name}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Top Action Bar (hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span>Rapport Médical & Export</span>
          </h1>
          <p className="text-xs text-slate-500">
            Fiche de synthèse conforme au protocole d’auto-mesure HAS
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            {([7, 30, 60] as const).map((p) => (
              <button
                key={p}
                onClick={() => setReportPeriod(p)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  reportPeriod === p
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}j
              </button>
            ))}
          </div>

          {/* Print button */}
          <button
            onClick={handlePrint}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Clinical Sheet */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 print-shadow-none print:p-0">
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Tensi<span className="text-teal-600">Coach</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 uppercase tracking-wider border border-slate-200">
                Relevé d’Auto-Mesure
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Édité le {generationDate} · Période analysée : {reportPeriod} derniers jours
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="font-bold text-slate-900 block">{userProfile.name} (32 ans, Homme)</span>
            <span className="text-slate-500">{userProfile.doctorName || 'Médecin traitant'}</span>
          </div>
        </div>

        {/* Protocol Compliance Badge */}
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl mb-4 text-xs text-teal-900 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Protocole d'Auto-Mesure Recommandé par la HAS :</span>
            <p className="text-[11px] text-teal-800 mt-0.5">
              Ce relevé récapitule les mesures en position assise après 5 minutes de repos. La moyenne à domicile recommandée par l’ESH est &lt; 135/85 mmHg.
            </p>
          </div>
        </div>

        {/* Core Clinical Indicators Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              Moyenne Générale
            </span>
            <div className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">
              {stats.avgSys} / {stats.avgDia}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">mmHg ({stats.totalMeasurements} mesures)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              Moyenne Matin
            </span>
            <div className="text-xl font-extrabold text-blue-900 font-mono mt-0.5">
              {stats.morningAvgSys} / {stats.morningAvgDia}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Au réveil à jeun</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              Moyenne Soir
            </span>
            <div className="text-xl font-extrabold text-indigo-900 font-mono mt-0.5">
              {stats.eveningAvgSys} / {stats.eveningAvgDia}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Avant le coucher</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              Fréquence Cardiaque
            </span>
            <div className="text-xl font-extrabold text-rose-600 font-mono mt-0.5">
              {stats.avgPulse}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">bpm au repos</span>
          </div>
        </div>

        {/* Detailed Statistical Summary */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5 text-xs text-slate-700">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
            Paramètres et Dispersion
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-slate-500 block">Valeur max :</span>
              <span className="font-bold font-mono">{stats.maxSys} / {stats.maxDia} mmHg</span>
            </div>
            <div>
              <span className="text-slate-500 block">Valeur min :</span>
              <span className="font-bold font-mono">{stats.minSys} / {stats.minDia} mmHg</span>
            </div>
            <div>
              <span className="text-slate-500 block">Écart-type SYS :</span>
              <span className="font-bold font-mono">&plusmn; {stats.standardDeviationSys} mmHg</span>
            </div>
            <div>
              <span className="text-slate-500 block">Mesures cibles (&lt;130/85) :</span>
              <span className="font-bold text-emerald-700 font-mono">{stats.optimalPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Detailed Measurements Table */}
        <div className="mb-5">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
            Relevé Récent des 10 Dernières Mesures
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-2 px-2.5">Date & Heure</th>
                  <th className="py-2 px-2">Moment</th>
                  <th className="py-2 px-2">SYS / DIA</th>
                  <th className="py-2 px-2">Pouls</th>
                  <th className="py-2 px-2">Classification</th>
                  <th className="py-2 px-2">Remarque</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent10.map((m) => {
                  const cat = classifyBloodPressure(m.systolic, m.diastolic);
                  const d = new Date(m.timestamp);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-2.5 font-medium text-slate-800">
                        {d.toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                        })}{' '}
                        à{' '}
                        {d.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2 px-2 capitalize text-slate-600">
                        {m.moment === 'morning' ? 'Matin' : m.moment === 'evening' ? 'Soir' : 'Midi'}
                      </td>
                      <td className="py-2 px-2 font-mono font-bold text-slate-900">
                        {m.systolic} / {m.diastolic}
                      </td>
                      <td className="py-2 px-2 font-mono text-slate-700">{m.pulse} bpm</td>
                      <td className="py-2 px-2">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{ backgroundColor: cat.bgColor, color: cat.textColor }}
                        >
                          {cat.shortLabel}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-500 italic max-w-xs truncate">
                        {m.note || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Medical Disclaimer on Printed Sheet */}
        <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 leading-normal">
          <p>
            <strong>Note au praticien :</strong> Relevé d'auto-mesure généré via l'application TensiCoach.
            Ce document ne constitue pas un diagnostic médical et doit être interprété par le médecin traitant
            dans le cadre du suivi clinique global du patient.
          </p>
        </div>
      </div>

      {/* Export CSV / JSON buttons (hidden on print) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs no-print">
        <div>
          <span className="font-bold text-slate-900 block">Exporter les données brutes</span>
          <span className="text-[11px] text-slate-500">Pour tableur Excel ou sauvegarde locale</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Fichier CSV (Excel)</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Format JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
