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
    if (onLinkClick) onLinkClick(item.id);
  };

  return (
    <div className="w-full bg-[#F9FAFB] hover:bg-[#F2F4F6] rounded-[16px] transition-colors overflow-hidden border border-[#E5E8EB]">
      {/* ── TDS List Row ── */}
      <a
        href={isAccordion ? undefined : item.url}
        target={isExternal && !isAccordion ? '_blank' : undefined}
        rel={isExternal && !isAccordion ? 'noopener noreferrer' : undefined}
        onClick={handleRowClick}
        className="flex items-center justify-between px-4 py-3.5 cursor-pointer select-none group"
      >
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[15px] text-[#191F28] group-hover:text-[#3182F6] transition-colors truncate">
              {item.title}
            </span>
            {item.badge && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F3FF] text-[#3182F6] flex-shrink-0">
                {item.badge}
              </span>
            )}
          </div>
          {item.subtitle && (
            <p className="text-[13px] text-[#8B95A1] mt-0.5 truncate">
              {item.subtitle}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 text-[#B0B8C1] group-hover:text-[#4E5968] transition-colors">
          {isAccordion ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-[#3182F6]" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <ExternalLink className="w-4 h-4" />
          )}
        </div>
      </a>

      {/* Accordion detail list */}
      {isAccordion && isExpanded && item.details && (
        <div className="px-4 pb-3.5 pt-1 border-t border-[#E5E8EB] bg-[#FFFFFF] animate-fadeIn">
          <ul className="space-y-1.5 mt-2">
            {item.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-[#4E5968] leading-relaxed">
                <span className="text-[#3182F6] mt-1 font-bold">·</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};



