'use client';

import React, { useState } from 'react';
import { LinkItem, ThemeConfig } from '@/types/profile';
import { ChevronRight, ChevronDown, ExternalLink } from 'lucide-react';

interface LinkItemCardProps {
  item: LinkItem;
  theme?: ThemeConfig;
  onLinkClick?: (id: string) => void;
}

export const LinkItemCard: React.FC<LinkItemCardProps> = ({ item, onLinkClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isAccordion = item.type === 'accordion';
  const isExternal = item.url.startsWith('http');

  const handleRowClick = (e: React.MouseEvent) => {
    if (isAccordion) {
      e.preventDefault();
      setIsExpanded((prev) => !prev);
    }
    onLinkClick?.(item.id);
  };

  return (
    <div className="w-full bg-white rounded-[20px] transition-all duration-200 border border-black/[0.06] hover:border-black/[0.12] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Apple List Item Row */}
      <a
        href={isAccordion ? undefined : item.url}
        target={isExternal && !isAccordion ? '_blank' : undefined}
        rel={isExternal && !isAccordion ? 'noopener noreferrer' : undefined}
        onClick={handleRowClick}
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none group apple-press-sm"
      >
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-semibold text-[16px] text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors truncate tracking-[-0.015em]">
              {item.title}
            </span>
            {item.badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0066cc]/10 text-[#0066cc] flex-shrink-0">
                {item.badge}
              </span>
            )}
            {item.featured && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f5f5f7] text-[#86868b] flex-shrink-0">
                Featured
              </span>
            )}
          </div>
          {item.subtitle && (
            <p className="text-[13px] text-[#86868b] mt-0.5 truncate tracking-[-0.01em]">
              {item.subtitle}
            </p>
          )}
        </div>

        {/* Action cue */}
        <div className="flex-shrink-0 text-[#86868b] group-hover:text-[#0066cc] transition-all flex items-center justify-center w-8 h-8 rounded-full bg-[#f5f5f7] group-hover:bg-[#0066cc]/10">
          {isAccordion ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-[#0066cc]" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            )
          ) : (
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          )}
        </div>
      </a>

      {/* Accordion detail list */}
      {isAccordion && isExpanded && item.details && (
        <div className="px-5 pb-4 pt-1 border-t border-black/[0.04] bg-[#fafafc] animate-fadeIn">
          <ul className="space-y-2 mt-2">
            {item.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#424245] leading-relaxed">
                <span className="text-[#0066cc] mt-0.5 font-bold">·</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
