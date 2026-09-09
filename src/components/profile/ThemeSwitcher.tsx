'use client';

import React from 'react';
import { ThemeId } from '@/types/profile';
import { THEMES } from '@/data/initialProfile';
import { Palette } from 'lucide-react';

interface ThemeSwitcherProps {
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  const themeList: { id: ThemeId; label: string; color: string }[] = [
    { id: 'glass', label: '글래스', color: 'bg-indigo-600' },
    { id: 'midnight', label: '미드나잇', color: 'bg-cyan-500' },
    { id: 'sunset', label: '선셋', color: 'bg-rose-500' },
    { id: 'emerald', label: '에메랄드', color: 'bg-emerald-500' },
    { id: 'clean', label: '미니멀', color: 'bg-zinc-700' },
    { id: 'cyberpunk', label: '사이버펑크', color: 'bg-yellow-400' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
      <div className="flex items-center gap-1 px-2 text-white/70 text-xs font-medium">
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">테마</span>
      </div>
      <div className="flex items-center gap-1">
        {themeList.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTheme(t.id)}
            title={THEMES[t.id].name}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs transition-all ${
              currentTheme === t.id
                ? 'bg-white/20 text-white font-semibold shadow-sm scale-105 border border-white/30'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${t.color}`} />
            <span className="text-[11px]">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
