export type ThemeId = 'glass' | 'midnight' | 'sunset' | 'emerald' | 'clean' | 'cyberpunk';

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'instagram' | 'twitter' | 'youtube' | 'email' | 'threads' | 'website';
  url: string;
  label: string;
}

export type LinkType = 'link' | 'music' | 'accordion' | 'featured';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  type?: LinkType;
  details?: string[];
  clicks?: number;
  featured?: boolean;
}

export interface GuestbookEntry {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  emoji?: string;
}

export interface ProfileData {
  name: string;
  handle: string;
  avatarUrl: string;
  bannerUrl?: string;
  statusBadge?: string;
  bio: string;
  tags: string[];
  location: string;
  theme: ThemeId;
  socials: SocialLink[];
  links: LinkItem[];
  stats: {
    views: number;
    likes: number;
  };
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  background: string;
  containerBg: string;
  cardBg: string;
  cardHover: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentGradient: string;
  border: string;
}
