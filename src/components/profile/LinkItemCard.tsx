'use client';

import React, { useState } from 'react';
import { LinkItem, ThemeConfig } from '@/types/profile';
import {
  ExternalLink,
  ChevronDown,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-react';

interface LinkItemCardProps {
  item: LinkItem;
  theme: ThemeConfig;
  onLinkClick?: (id: string) => void;
}

export const LinkItemCard: React.FC<LinkItemCardProps> = ({
  item,
  theme,
  onLinkClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (item.type === 'accordion') {
      e.preventDefault();
      setIsExpanded((prev) => !prev);
    } else if (item.type === 'music') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }

    if (onLinkClick) {
      onLinkClick(item.id);
    }
  };

  const isExternal = item.url.startsWith('http');

  return (
    <div className="w-full relative group">
      {/* Featured subtle glow */}
      {item.featured && (
        <div
          className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${theme.accentGradient} opacity-30 group-hover:opacity-60 blur-sm transition-all duration-300`}
        />
      )}

      <div
        className={`relative w-full rounded-2xl transition-all duration-200 overflow-hidden ${
          theme.cardBg
        } ${theme.cardHover} ${
          item.featured ? 'ring-1 ring-zinc-400/40 dark:ring-white/20' : ''
        }`}
      >
        <a
          href={item.url}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          onClick={handleClick}
          className="flex items-center justify-between px-5 py-4 w-full select-none cursor-pointer relative"
        >
          {/* Left spacer or icon */}
          <div className="w-6 flex items-center justify-start flex-shrink-0">
            {item.type === 'music' ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying((prev) => !prev);
                }}
                aria-label={isPlaying ? '일시 정지' : '재생'}
                className="w-7 h-7 rounded-full bg-zinc-200/60 dark:bg-zinc-700/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current text-zinc-800 dark:text-zinc-100" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-zinc-800 dark:text-zinc-100" />
                )}
              </button>
            ) : null}
          </div>

          {/* Centered Content */}
          <div className="flex-1 text-center px-2">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="font-semibold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                {item.title}
              </span>
              {item.badge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200">
                  {item.badge}
                </span>
              )}
            </div>
            {item.subtitle && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal">
                {item.subtitle}
              </p>
            )}
          </div>

          {/* Right indicator */}
          <div className="w-6 flex items-center justify-end flex-shrink-0 text-zinc-400 dark:text-zinc-500">
            {item.type === 'accordion' ? (
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180 text-zinc-900 dark:text-white' : ''
                }`}
              />
            ) : (
              <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </a>

        {/* Music Player Equalizer Animation */}
        {item.type === 'music' && isPlaying && (
          <div className="px-5 pb-3 pt-1 border-t border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-center gap-3 text-xs bg-zinc-100/50 dark:bg-zinc-800/40">
            <div className="flex items-center gap-1">
              <span className="inline-block w-1 h-3 bg-indigo-500 animate-[bounce_0.8s_infinite]"></span>
              <span className="inline-block w-1 h-4 bg-indigo-500 animate-[bounce_0.6s_infinite_0.2s]"></span>
              <span className="inline-block w-1 h-2 bg-indigo-500 animate-[bounce_1s_infinite_0.4s]"></span>
              <span className="inline-block w-1 h-3.5 bg-indigo-500 animate-[bounce_0.7s_infinite_0.1s]"></span>
            </div>
            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
              코딩할 때 듣는 감성 플레이리스트 재생 중 🎧
            </span>
          </div>
        )}

        {/* Accordion Content */}
        {item.type === 'accordion' && isExpanded && item.details && (
          <div className="px-5 pb-4 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 bg-zinc-50/60 dark:bg-zinc-800/30 text-xs space-y-2 text-left animate-fadeIn">
            {item.details.map((detail, index) => (
              <div key={index} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                <span className="leading-relaxed">{detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
