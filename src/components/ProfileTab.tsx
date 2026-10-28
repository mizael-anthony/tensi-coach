import React, { useState } from 'react';
import {
  User,
  Bell,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Info,
  Check,
  Stethoscope,
  Heart,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileTabProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
  onOpenLegal: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userProfile,
  onUpdateProfile,
  onResetDemoData,
  onClearAllData,
  onOpenLegal,
}) => {
  const [remindersActive, setRemindersActive] = useState<boolean>(userProfile.remindersActive);
  const [morningTime, setMorningTime] = useState<string>(userProfile.morningReminderTime);
  const [eveningTime, setEveningTime] = useState<string>(userProfile.eveningReminderTime);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const handleSaveReminders = () => {
    onUpdateProfile({
      ...userProfile,
      remindersActive,
      morningReminderTime: morningTime,
      eveningReminderTime: eveningTime,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-teal-600" />
          <span>Profil & Réglages</span>
        </h1>
        <p className="text-xs text-slate-500">
          Gestion du profil utilisateur, rappels et gestion des données
        </p>
      </div>

      {/* User Card */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-3.5 mb-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-900 to-teal-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
            T
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{userProfile.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                Profil Démo Fictif
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {userProfile.age} ans · {userProfile.occupation}
            </p>
          </div>
        </div>

        {/* Clinical target */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
              Cible tensionnelle ESH
            </span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              &lt; {userProfile.targetSys} / {userProfile.targetDia} mmHg
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
              Médecin référent
            </span>
            <span className="text-xs font-bold text-slate-900 truncate block">
              {userProfile.doctorName || 'Dr. Anne Mercier'}
            </span>
          </div>
        </div>
      </section>

      {/* Reminders section */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Rappels d’auto-mesure (Règle des 3)
            </h2>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={remindersActive}
              onChange={(e) => setRemindersActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        <p className="text-xs text-slate-500">
          Programmez deux horaires fixes pour respecter la régularité de l'auto-mesure recommandée par la HAS.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Rappel du Matin (à jeun)
            </label>
            <input
              type="time"
              value={morningTime}
              onChange={(e) => setMorningTime(e.target.value)}
              disabled={!remindersActive}
              className="w-full text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-50"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Rappel du Soir (avant coucher)
            </label>
            <input
              type="time"
              value={eveningTime}
              onChange={(e) => setEveningTime(e.target.value)}
              disabled={!remindersActive}
              className="w-full text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-50"
            />
          </div>
        </div>

        <button
          onClick={handleSaveReminders}
          className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
        >
          {savedNotice ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Rappels enregistrés !</span>
            </>
          ) : (
            <span>Enregistrer les préférences de rappel</span>
          )}
        </button>
      </section>

      {/* Demo Data Management */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-teal-600" />
          <span>Gestion des données de démonstration</span>
        </h2>
        <p className="text-xs text-slate-500">
          Cette application fonctionne en <strong>Mode Démonstration</strong> avec 60 jours de relevés cohérents
          pour un profil fictif de 32 ans.
        </p>

        <div className="pt-2 space-y-2">
          <button
            onClick={onResetDemoData}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-teal-700" />
            <span>Réinitialiser les 60 jours de démo (Thomas, 32 ans)</span>
          </button>

          {showClearConfirm ? (
            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-xs text-center space-y-2">
              <span className="font-bold text-red-900 block">
                Êtes-vous sûr de vouloir effacer toutes les données locales ?
              </span>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    onClearAllData();
                    setShowClearConfirm(false);
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
                >
                  Oui, tout effacer
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 text-slate-600 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Effacer toutes les mesures locales</span>
            </button>
          )}
        </div>
      </section>

      {/* Medical Safety & Privacy Links */}
      <section className="bg-slate-100/70 rounded-3xl p-5 border border-slate-200/80 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Informations Médicales & Éthique</span>
        </h2>
        <div className="space-y-2 text-xs">
          <button
            onClick={onOpenLegal}
            className="w-full p-3 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Avertissement médical complet</span>
                <span className="text-[11px] text-slate-500">Non-substitution médicale, rôle éducatif</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={onOpenLegal}
            className="w-full p-3 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Politique de confidentialité locale</span>
                <span className="text-[11px] text-slate-500">Stockage 100% sur votre appareil, aucun traqueur</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </section>
    </div>
  );
};
