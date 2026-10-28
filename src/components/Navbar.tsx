import React from 'react';
import { ShieldAlert, Info, Sparkles, HeartPulse } from 'lucide-react';

interface NavbarProps {
  onOpenSOS: () => void;
  onOpenLegal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSOS, onOpenLegal }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Demo Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-[11px] font-medium py-1 px-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wide uppercase text-emerald-300">Mode Démonstration</span>
          <span className="text-slate-300 hidden sm:inline">— Données fictives (Thomas, 32 ans)</span>
        </div>
        <button
          onClick={onOpenLegal}
          className="text-slate-300 hover:text-white underline underline-offset-2 flex items-center gap-1 text-[11px] shrink-0 transition-colors"
        >
          <Info className="w-3 h-3" />
          <span>Avertissement</span>
        </button>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-900 to-teal-700 flex items-center justify-center text-white shadow-sm ring-2 ring-teal-100">
            <HeartPulse className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Tensi<span className="text-teal-600">Coach</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                IA Santé
              </span>
            </div>
            <p className="text-[10px] text-slate-600 leading-none">
              Suivi tensionnel & prévention
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton Urgence / SOS */}
          <button
            onClick={onOpenSOS}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 active:scale-95 transition-all"
            title="Consignes d'urgence en cas de crise hypertensive"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600 animate-bounce" />
            <span className="hidden xs:inline">Alerte Crise</span>
            <span className="xs:hidden">SOS</span>
          </button>

          {/* Bouton Mentions & Confidentialité */}
          <button
            onClick={onOpenLegal}
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Avertissement médical et politique de confidentialité"
            aria-label="Mentions légales et confidentialité"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
