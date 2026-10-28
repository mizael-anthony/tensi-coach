import React from 'react';
import { ShieldAlert, PhoneCall, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  systolic?: number;
  diastolic?: number;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  isOpen,
  onClose,
  systolic = 180,
  diastolic = 120,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border-2 border-red-500 overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-red-700/80 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wide">
                Alerte Tension Élevée
              </h2>
              <p className="text-xs text-red-100">
                Valeur mesurée : {systolic} / {diastolic} mmHg
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-700/60 hover:bg-red-700 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-slate-800">
          <div className="p-3 bg-red-50 rounded-xl border border-red-200">
            <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Conduite à tenir immédiate</span>
            </h3>
            <p className="text-xs text-red-800 leading-relaxed">
              Une valeur isolée très élevée peut être temporaire (stress aigu, effort, erreur de brassard).
              Cependant, elle exige une évaluation attentive de votre état général.
            </p>
          </div>

          {/* 2 cases */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border-2 border-red-300 bg-red-50/50">
              <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>CAS 1 : Présence de symptômes d’alerte</span>
              </h4>
              <p className="text-xs text-slate-700 mt-1">
                Si vous ressentez au moins un de ces signes :
              </p>
              <ul className="text-xs text-slate-700 list-disc list-inside mt-1 space-y-0.5 font-medium">
                <li>Maux de tête intenses et inhabituels</li>
                <li>Douleur ou serrement dans la poitrine</li>
                <li>Essoufflement brutal ou sensation d’étouffement</li>
                <li>Troubles de la vue (mouches, vision trouble)</li>
                <li>Engourdissement du visage, d’un bras ou difficultés à parler</li>
              </ul>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href="tel:15"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-sm transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Appeler le 15 (SAMU)</span>
                </a>
                <a
                  href="tel:112"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>112 (Europe)</span>
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>CAS 2 : Aucun symptôme ressenti</span>
              </h4>
              <ol className="text-xs text-slate-700 list-decimal list-inside mt-1.5 space-y-1">
                <li>Restez assis calmement dans une pièce tempérée pendant 5 minutes.</li>
                <li>Ne buvez pas de café, ne fumez pas et ne parlez pas.</li>
                <li>Reprenez la mesure avec le bras posé sur la table à hauteur du cœur.</li>
                <li>Si la valeur reste au-dessus de 180 ou 120, contactez votre médecin ou composez le 15 pour avis régulateur.</li>
              </ol>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 italic text-center">
            TensiCoach est un carnet d’auto-mesure préventif et ne remplace pas une consultation médicale.
          </p>

          <button
            onClick={onClose}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            J'ai compris les consignes
          </button>
        </div>
      </div>
    </div>
  );
};
