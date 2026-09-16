'use client';

import React, { useState } from 'react';
import { LinkItem, ThemeConfig } from '@/types/profile';
import {
  ExternalLink,
  ChevronDown,
  Play,
  Pause,
  Rocket,
  Zap,
  BookOpen,
  Code2,
  Briefcase,
  FileText,
  Coffee,
  Sparkles,
  Music,
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

  const renderItemIcon = () => {
    if (item.type === 'music') {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsPlaying((prev) => !prev);
          }}
          aria-label={isPlaying ? '일시 정지' : '재생'}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FF80B5] text-black border-2 border-black shadow-brutal-xs flex items-center justify-center hover:bg-[#FFB5D5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-black" />
          ) : (
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-black ml-0.5" />
          )}
        </button>
      );
    }

    const iconClasses = 'w-4 h-4 text-black';
    const containerClasses =
      'w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 border-black shadow-brutal-xs flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-105';

    switch (item.icon) {
      case 'rocket':
        return (
          <div className={`${containerClasses} bg-[#FEF08A]`}>
            <Rocket className={iconClasses} />
          </div>
        );
      case 'zap':
        return (
          <div className={`${containerClasses} bg-[#A3E635]`}>
            <Zap className={iconClasses} />
          </div>
        );
      case 'book':
        return (
          <div className={`${containerClasses} bg-[#67E8F9]`}>
            <BookOpen className={iconClasses} />
          </div>
        );
      case 'code':
        return (
          <div className={`${containerClasses} bg-[#C084FC]`}>
            <Code2 className={iconClasses} />
          </div>
        );
      case 'briefcase':
        return (
          <div className={`${containerClasses} bg-[#FB923C]`}>
            <Briefcase className={iconClasses} />
          </div>
        );
      case 'file':
        return (
          <div className={`${containerClasses} bg-[#FDE047]`}>
            <FileText className={iconClasses} />
          </div>
        );
      case 'coffee':
        return (
          <div className={`${containerClasses} bg-[#FF80B5]`}>
            <Coffee className={iconClasses} />
          </div>
        );
      case 'music':
        return (
          <div className={`${containerClasses} bg-[#F472B6]`}>
            <Music className={iconClasses} />
          </div>
        );
      default:
        return (
          <div className={`${containerClasses} bg-[#E2E8F0]`}>
            <Sparkles className={iconClasses} />
          </div>
        );
    }
  };

  return (
    <div className="w-full relative group">
      {/* Featured Neobrutalist Sticker Badge */}
      {item.featured && (
        <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-[#FEF08A] text-black text-[9.5px] font-mono font-black uppercase tracking-wider border-2 border-black shadow-brutal-xs rotate-2 z-20">
          ★ FEATURED
        </div>
      )}

      <div
        className={`relative w-full rounded-xl transition-all duration-150 overflow-hidden ${
          theme.cardBg
        } ${theme.cardHover} ${item.featured ? 'ring-2 ring-black' : ''}`}
      >
        <a
          href={item.url}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          onClick={handleClick}
          className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3.5 w-full select-none cursor-pointer relative gap-2 sm:gap-2.5"
        >
          {/* Left Icon Block */}
          <div className="flex-shrink-0 flex items-center justify-center">
            {renderItemIcon()}
          </div>

          {/* Centered / Left content */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-black text-xs sm:text-sm tracking-tight text-black dark:text-inherit break-keep">
                {item.title}
              </span>
              {item.badge && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10px] font-mono font-black bg-[#FEF08A] text-black border border-black shadow-brutal-xs whitespace-nowrap flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </div>
            {item.subtitle && (
              <p className="text-[11px] sm:text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-0.5 line-clamp-1 sm:line-clamp-2 break-keep">
                {item.subtitle}
              </p>
            )}
          </div>

          {/* Right Action Button */}
          <div className="flex-shrink-0 flex items-center justify-end">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-black bg-white flex items-center justify-center shadow-brutal-xs group-hover:bg-[#FEF08A] transition-colors">
              {item.type === 'accordion' ? (
                <ChevronDown
                  className={`w-4 h-4 text-black transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              ) : (
                <ExternalLink className="w-3.5 h-3.5 text-black" />
              )}
            </div>
          </div>
        </a>

        {/* Music Player Boombox / Equalizer Animation */}
        {item.type === 'music' && isPlaying && (
          <div className="px-3 sm:px-4 py-2 border-t-2 border-black flex items-center justify-center gap-2.5 text-xs bg-[#FFD6E8] text-black font-mono font-bold">
            <div className="flex items-end gap-1 h-4">
              <span className="inline-block w-1.5 h-3 bg-black animate-[bounce_0.8s_infinite]"></span>
              <span className="inline-block w-1.5 h-4 bg-black animate-[bounce_0.6s_infinite_0.2s]"></span>
              <span className="inline-block w-1.5 h-2 bg-black animate-[bounce_1s_infinite_0.4s]"></span>
              <span className="inline-block w-1.5 h-3.5 bg-black animate-[bounce_0.7s_infinite_0.1s]"></span>
            </div>
            <span className="text-[11px] uppercase tracking-wide font-black">
              [ PLAYING: LO-FI DEV BEATS 🎧 ]
            </span>
          </div>
        )}

        {/* Accordion Content (Receipt / Notebook Drawer) */}
        {item.type === 'accordion' && isExpanded && item.details && (
          <div className="px-3.5 sm:px-4 pb-3.5 pt-2.5 border-t-2 border-black bg-white text-[11px] sm:text-xs space-y-2 text-left animate-fadeIn">
            {item.details.map((detail, index) => (
              <div key={index} className="flex items-start gap-2 text-zinc-900 font-medium">
                <span className="text-black font-bold flex-shrink-0 mt-0.5">✦</span>
                <span className="leading-relaxed break-keep">{detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
