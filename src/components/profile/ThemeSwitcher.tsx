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
  const themeList: { id: ThemeId; label: string; color: string; activeBg: string }[] = [
    { id: 'clean', label: '레몬', color: 'bg-[#FDE047]', activeBg: 'bg-[#FEF08A]' },
    { id: 'glass', label: '버블검', color: 'bg-[#FF80B5]', activeBg: 'bg-[#FFD1E3]' },
    { id: 'midnight', label: '다크', color: 'bg-[#121212]', activeBg: 'bg-zinc-800 text-white' },
    { id: 'sunset', label: '선셋', color: 'bg-[#FB923C]', activeBg: 'bg-[#FED7AA]' },
    { id: 'emerald', label: '민트', color: 'bg-[#4ADE80]', activeBg: 'bg-[#BBF7D0]' },
    { id: 'cyberpunk', label: '사이언', color: 'bg-[#22D3EE]', activeBg: 'bg-[#CFFAFE]' },
  ];

  return (
    <nav
      aria-label="테마 선택"
      className="max-w-[calc(100vw-24px)] flex items-center gap-1 p-1 sm:p-1.5 rounded-xl bg-white text-black border-2 border-black shadow-brutal overflow-x-auto no-scrollbar"
    >
      <div className="flex items-center gap-1 pl-1.5 pr-1 text-black font-mono text-xs font-black flex-shrink-0">
        <Palette className="w-3.5 h-3.5 text-black" />
        <span className="hidden sm:inline text-[11px] uppercase tracking-wider">THEME</span>
      </div>

      <div className="flex items-center gap-1 flex-nowrap">
        {themeList.map((t) => {
          const isActive = currentTheme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTheme(t.id)}
              title={THEMES[t.id].name}
              className={`flex items-center justify-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all duration-100 flex-shrink-0 ${
                isActive
                  ? `${t.activeBg} border-2 border-black shadow-brutal-xs scale-100 font-black`
                  : 'text-zinc-800 hover:bg-zinc-100 border-2 border-transparent hover:border-black active:translate-x-0.5 active:translate-y-0.5'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full border border-black flex-shrink-0 ${t.color}`}
              />
              <span
                className={`text-[11px] font-mono whitespace-nowrap ${
                  isActive ? 'inline font-black' : 'hidden sm:inline'
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
