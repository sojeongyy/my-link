'use client';

import React, { useState } from 'react';
import { LinkItem, ThemeConfig } from '@/types/profile';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface LinkItemCardProps {
  item: LinkItem;
  theme?: ThemeConfig;
  onLinkClick?: (id: string) => void;
}

export const LinkItemCard: React.FC<LinkItemCardProps> = ({ item, onLinkClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isAccordion = item.type === 'accordion';
  const isExternal  = item.url.startsWith('http');

  const handleRowClick = (e: React.MouseEvent) => {
    if (isAccordion) {
      e.preventDefault();
      setIsExpanded((prev) => !prev);
    }
    if (onLinkClick) onLinkClick(item.id);
  };

  return (
    <div className="border-b border-[#3d4f97]">
      {/* Nintendo News Row */}
      <a
        href={isAccordion ? undefined : item.url}
        target={isExternal && !isAccordion ? '_blank' : undefined}
        rel={isExternal && !isAccordion ? 'noopener noreferrer' : undefined}
        onClick={handleRowClick}
        className="flex items-center gap-2 px-3 py-2 bg-[#dedede] hover:bg-[#cdd8ea] transition-colors cursor-pointer select-none"
        style={{ textDecoration: 'none' }}
      >
        {/* Badge chip — amber utility mark */}
        {item.badge && (
          <span
            className="bevel-chip flex-shrink-0 font-bold uppercase"
            style={{
              backgroundColor: '#ecab37',
              color: '#21242e',
              fontSize: 9,
              letterSpacing: '0.05em',
              padding: '1px 5px',
              borderRadius: 2,
              whiteSpace: 'nowrap',
            }}
          >
            {item.badge}
          </span>
        )}

        {/* Title — ink-soft link text */}
        <span
          className="flex-1 min-w-0 font-bold"
          style={{
            color: '#3d4f97',
            fontSize: 12,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.title}
        </span>

        {/* Featured star — nav gold */}
        {item.featured && (
          <span className="flex-shrink-0 font-bold" style={{ color: '#e48600', fontSize: 10 }}>
            ★
          </span>
        )}

        {/* Arrow chip — signal orange forward cue */}
        <div
          className="bevel-chip flex-shrink-0 flex items-center justify-center"
          style={{ width: 18, height: 18, backgroundColor: '#f68d1f', borderRadius: 2 }}
        >
          {isAccordion && isExpanded ? (
            <ChevronDown className="text-white" style={{ width: 11, height: 11 }} />
          ) : (
            <ChevronRight className="text-white" style={{ width: 11, height: 11 }} />
          )}
        </div>
      </a>

      {/* Subtitle strip — white with muted text */}
      {item.subtitle && !isAccordion && (
        <div className="px-3 py-1 bg-white border-t border-[#c0cce0]">
          <p style={{ color: '#60619c', fontSize: 10, lineHeight: 1.3 }}>{item.subtitle}</p>
        </div>
      )}

      {/* Accordion expanded — periwinkle panel */}
      {isAccordion && isExpanded && item.details && (
        <div className="px-3 py-2 border-t border-[#3d4f97] bg-[#8ba1d4] animate-fadeIn">
          <ul className="space-y-1">
            {item.details.map((detail, i) => (
              <li key={i} className="flex gap-1.5 items-start">
                <span style={{ color: '#f68d1f', fontSize: 11, flexShrink: 0, lineHeight: 1.4 }}>▸</span>
                <span style={{ color: '#21242e', fontSize: 11, lineHeight: 1.4 }}>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


