import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Plus,
  Sparkles,
  HeartHandshake,
  FileText,
  User,
} from 'lucide-react';

export type TabKey = 'home' | 'measures' | 'coach' | 'habits' | 'report' | 'profile';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onOpenQuickAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickAdd,
}) => {
  const navItems = [
    { key: 'home' as TabKey, label: 'Accueil', icon: LayoutDashboard },
    { key: 'measures' as TabKey, label: 'Mesures', icon: Activity },
    { key: 'coach' as TabKey, label: 'Coach IA', icon: Sparkles },
    { key: 'habits' as TabKey, label: 'Habitudes', icon: HeartHandshake },
    { key: 'report' as TabKey, label: 'Rapport', icon: FileText },
    { key: 'profile' as TabKey, label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg no-print">
      <div className="max-w-md mx-auto px-2 flex items-center justify-around h-16 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              type="button"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-teal-700 font-semibold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-teal-50 ring-1 ring-teal-200' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-700 stroke-[2.2]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[54px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
