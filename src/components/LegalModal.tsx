import React, { useState } from 'react';
import { X, ShieldAlert, Lock, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'medical' | 'privacy' | 'norms'>('medical');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Sécurité Médicale & Confidentialité
            </h2>
            <p className="text-xs text-slate-500">
              Cadre d’utilisation, engagements éthiques et conformité
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-100/50 p-1">
          <button
            onClick={() => setActiveSubTab('medical')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'medical'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Avertissement</span>
          </button>
          <button
            onClick={() => setActiveSubTab('privacy')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'privacy'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Confidentialité</span>
          </button>
          <button
            onClick={() => setActiveSubTab('norms')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'norms'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Normes HAS / ESH</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {activeSubTab === 'medical' && (
            <>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Information essentielle de santé</span>
                </div>
                <p>
                  <strong>TensiCoach ne mesure pas la tension artérielle</strong>, ne pose aucun diagnostic médical
                  et ne modifie en aucun cas un traitement prescrit.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">Rôle de l’application</h3>
                <p>
                  TensiCoach est un carnet numérique d’auto-mesure et un coach éducatif de bien-être.
                  Il a été conçu pour vous aider à consigner rigoureusement vos relevés réalisés avec
                  votre tensiomètre de bras validé (norme CE / ESH) et à observer l’influence de votre mode de vie
                  (sommeil, sel, activité physique, stress).
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">Limites de l’Intelligence Artificielle</h3>
                <p>
                  Les analyses et conseils générés par l’IA (Gemini ou moteur local) sont strictement
                  pédagogiques. Ils visent à soutenir vos bonnes résolutions d'hygiène de vie et à préparer vos échanges avec votre médecin traitant ou votre cardiologue.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">Quand contacter un médecin ?</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>En cas de moyenne régulièrement supérieure à 135/85 mmHg en auto-mesure à domicile.</li>
                  <li>En cas de valeur ponctuelle systolique ≥ 180 ou diastolique ≥ 120 mmHg.</li>
                  <li>En cas de malaise, étourdissement, palpitations inhabituelles ou essoufflement.</li>
                </ul>
              </div>
            </>
          )}

          {activeSubTab === 'privacy' && (
            <>
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  <span>Données locales et respect absolu de la vie privée</span>
                </div>
                <p>
                  Vos mesures et vos habitudes sont stockées localement dans le stockage sécurisé de votre navigateur (localStorage).
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">Anonymisation des requêtes IA</h3>
                <p>
                  Lorsque vous sollicitez l’analyse du Coach IA (Gemini), seules des statistiques consolidées et
                  anonymes (moyenne chiffrée, nombre de pas, niveau de stress 1 à 5) sont transmises au serveur.
                  Aucune information nominative, aucun identifiant personnel ni adresse IP n’est rattaché à vos relevés de tension.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">Contrôle total de vos données</h3>
                <p>
                  Vous pouvez à tout moment réinitialiser le jeu de données ou effacer l’intégralité de vos enregistrements
                  depuis l’onglet <strong>Profil</strong>. Aucune donnée n’est vendue, partagée ni conservée sur des bases de données distantes pour ce MVP.
                </p>
              </div>
            </>
          )}

          {activeSubTab === 'norms' && (
            <>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  Seuils de référence ESH / HAS
                </h3>
                <p className="text-slate-600 mb-3">
                  Recommandations de la Société Européenne d'Hypertension pour l'auto-mesure à domicile :
                </p>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-900 block">Optimale : &lt; 120 et &lt; 80 mmHg</span>
                    <span className="text-[11px] text-emerald-700">Risque cardiovasculaire le plus bas.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200">
                    <span className="font-bold text-teal-900 block">Normale : 120-129 ou 80-84 mmHg</span>
                    <span className="text-[11px] text-teal-700">Valeur standard de référence.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="font-bold text-amber-900 block">Normale Haute : 130-139 ou 85-89 mmHg</span>
                    <span className="text-[11px] text-amber-700">Zone charnière propice aux mesures hygiéno-diététiques.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200">
                    <span className="font-bold text-orange-900 block">Hypertension Grade 1 : 140-159 ou 90-99 mmHg</span>
                    <span className="text-[11px] text-orange-700">Nécessite confirmation par auto-mesure sur 3 jours.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                    <span className="font-bold text-rose-900 block">Hypertension Grade 2 : ≥ 160 ou ≥ 100 mmHg</span>
                    <span className="text-[11px] text-rose-700">Évaluation médicale recommandée sans tarder.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-red-100 border border-red-300">
                    <span className="font-bold text-red-900 block">Crise hypertensive : ≥ 180 ou ≥ 120 mmHg</span>
                    <span className="text-[11px] text-red-800">Contrôle au repos sous 5 min ; urgences si symptômes.</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-blue-900 text-white font-semibold text-xs hover:bg-blue-950 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
