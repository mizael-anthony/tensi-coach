import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface MedicalSafetyBannerProps {
  onOpenLegal: () => void;
}

export const MedicalSafetyBanner: React.FC<MedicalSafetyBannerProps> = ({ onOpenLegal }) => {
  return (
    <aside
      aria-label="Avertissement médical"
      className="bg-slate-100 border-t border-slate-200/90 py-3 px-4 text-center text-slate-700 text-xs no-print"
    >
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Avertissement médical :</span>
        </div>
        <p className="leading-snug">
          TensiCoach ne remplace pas un avis médical. En cas de valeurs très élevées, de malaise ou de symptômes,
          consultez un professionnel de santé.
        </p>
        <button
          onClick={onOpenLegal}
          type="button"
          className="text-teal-700 hover:text-teal-900 font-semibold underline underline-offset-2 shrink-0 flex items-center gap-0.5 ml-1"
        >
          <span>En savoir plus</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
