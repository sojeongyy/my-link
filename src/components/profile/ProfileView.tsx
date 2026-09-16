'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  Edit3,
  MessageSquareHeart,
  Heart,
  Eye,
  Sparkles,
  Code2,
} from 'lucide-react';
import { ProfileData, ThemeId } from '@/types/profile';
import { INITIAL_PROFILE, THEMES } from '@/data/initialProfile';
import { SocialLinks } from './SocialLinks';
import { LinkItemCard } from './LinkItemCard';
import { ShareModal } from './ShareModal';
import { GuestbookModal } from './GuestbookModal';
import { EditProfileModal } from './EditProfileModal';
import { ThemeSwitcher } from './ThemeSwitcher';

const STORAGE_KEY = 'mylinke_profile_data_v3';

interface FloatingParticle {
  id: number;
  xOffset: number;
  emoji: string;
}

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(INITIAL_PROFILE.stats.likes);
  const [viewsCount, setViewsCount] = useState(INITIAL_PROFILE.stats.views);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  // Load saved profile data from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setProfile(parsed);
            setLikesCount(parsed.stats?.likes ?? INITIAL_PROFILE.stats.likes);
            setViewsCount((parsed.stats?.views ?? INITIAL_PROFILE.stats.views) + 1);
          } catch {
            // ignore error
          }
        } else {
          setViewsCount((prev) => prev + 1);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const currentTheme = THEMES[profile.theme] || THEMES.clean;

  // Handle Like Button click with playful particle burst
  const handleLike = () => {
    setLikesCount((prev) => prev + 1);
    setLiked(true);

    const burstEmojis = ['💖', '✨', '❤️', '🔥'];
    const newParticles: FloatingParticle[] = burstEmojis.map((emoji, idx) => ({
      id: Date.now() + idx,
      xOffset: (idx - 1.5) * 16,
      emoji,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 1000);

    const updated = {
      ...profile,
      stats: {
        ...profile.stats,
        likes: likesCount + 1,
      },
    };
    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Handle Theme Change
  const handleThemeSelect = (themeId: ThemeId) => {
    const updated = { ...profile, theme: themeId };
    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Save profile changes
  const handleSaveProfile = (updated: ProfileData) => {
    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Reset to original
  const handleResetProfile = () => {
    setProfile(INITIAL_PROFILE);
    setLikesCount(INITIAL_PROFILE.stats.likes);
    setLiked(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div
      className={`min-h-dvh w-full transition-colors duration-200 flex flex-col items-center justify-start py-5 sm:py-9 px-3 sm:px-6 relative overflow-x-clip ${currentTheme.background}`}
    >
      {/* Top Floating Control Bar */}
      <header className="w-full max-w-[440px] flex items-center justify-between gap-1.5 sm:gap-2 mb-3 sm:mb-4 z-20">
        <button
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-mono font-black text-[11px] sm:text-xs border-2 border-black shadow-brutal-xs hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <Edit3 className="w-3.5 h-3.5 text-black" />
          <span>[ ✏️ EDIT PROFILE ]</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setIsGuestbookOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF80B5] text-black font-mono font-black text-[11px] sm:text-xs border-2 border-black shadow-brutal-xs hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            title="방명록"
          >
            <MessageSquareHeart className="w-3.5 h-3.5 text-black" />
            <span>[ 💌 GUESTBOOK ]</span>
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="p-1.5 sm:p-2 rounded-lg bg-white text-black border-2 border-black shadow-brutal-xs hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            aria-label="공유하기"
            title="프로필 공유 & QR 코드"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
          </button>
        </div>
      </header>

      {/* Main Retro OS Window Frame */}
      <div className={`w-full max-w-[440px] rounded-2xl overflow-hidden transition-all duration-200 relative z-10 ${currentTheme.containerBg}`}>
        {/* Retro Window Title Bar */}
        <div className={`w-full ${currentTheme.windowBarBg || 'bg-[#FEF08A] border-b-2 border-black'} px-3.5 py-2 flex items-center justify-between select-none`}>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black inline-block"></span>
          </div>
          <span className="font-mono text-[11px] font-black tracking-wider uppercase text-black">
            {profile.handle.replace('@', '')}.app // v2.0
          </span>
          <span className="text-[10px] font-mono font-black text-black px-1.5 py-0.2 rounded bg-white border border-black shadow-brutal-xs">
            DEV ✦
          </span>
        </div>

        {/* Main Body */}
        <main className="w-full p-4 sm:p-7 flex flex-col items-center text-center">
          {/* Brutalist Avatar with hard shadow */}
          <div className="relative mb-3.5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-black bg-white shadow-brutal p-1 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full rounded-xl object-cover bg-zinc-200"
              />
              {/* Online sticker */}
              <span className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded bg-[#A3E635] text-black border-2 border-black font-mono font-black text-[9.5px] shadow-brutal-xs rotate-[-3deg] whitespace-nowrap">
                ● ONLINE
              </span>
            </div>
          </div>

          {/* Status Badge Sticker */}
          {profile.statusBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FEF08A] text-black border-2 border-black font-mono font-black text-[10.5px] sm:text-[11px] mb-3 shadow-brutal-xs rotate-[-1deg] max-w-full text-center break-keep">
              <Sparkles className="w-3.5 h-3.5 text-black flex-shrink-0" />
              <span className="truncate">{profile.statusBadge}</span>
            </div>
          )}

          {/* Name & Verified Badge */}
          <div className="flex items-center justify-center gap-2 mb-1 max-w-full">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black dark:text-inherit break-keep">
              {profile.name}
            </h1>
            <span className="px-1.5 py-0.5 bg-[#A3E635] text-black border-2 border-black font-mono font-black text-[10px] shadow-brutal-xs rotate-2 flex-shrink-0">
              VERIFIED ✦
            </span>
          </div>

          {/* Handle */}
          <p className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 mb-3">
            [ {profile.handle} ]
          </p>

          {/* Memo Pad / Post-it Bio */}
          <div className="relative w-full max-w-sm mb-4">
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#FFFBEB] dark:bg-zinc-800 text-black dark:text-zinc-100 border-2 border-black shadow-brutal-xs text-xs sm:text-sm font-medium leading-relaxed text-left break-keep relative">
              <div className="absolute -top-2 left-4 px-2 py-0.5 bg-black text-white text-[9px] font-mono font-black uppercase tracking-wider rounded">
                MEMO // BIO
              </div>
              <p className="pt-1">{profile.bio}</p>
            </div>
          </div>

          {/* Tags */}
          {profile.tags && profile.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mb-3.5 max-w-full">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold bg-white text-black border-2 border-black shadow-brutal-xs hover:bg-[#FEF08A] transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Core Tech Cartridge Rack */}
          <div className="flex flex-col items-center gap-1.5 mb-4 w-full max-w-xs sm:max-w-sm">
            <div className="flex items-center gap-1 text-[10px] sm:text-[10.5px] font-mono font-black uppercase text-black dark:text-zinc-300">
              <Code2 className="w-3.5 h-3.5 text-black dark:text-white flex-shrink-0" />
              <span>[ CORE TECH CARTRIDGES ]</span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-1.5">
              {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL', 'Docker'].map(
                (tech, i) => {
                  const colors = [
                    'bg-[#FEF08A]',
                    'bg-[#67E8F9]',
                    'bg-[#A3E635]',
                    'bg-[#FF80B5]',
                    'bg-[#FDBA74]',
                    'bg-[#C084FC]',
                    'bg-[#86EFAC]',
                  ];
                  return (
                    <span
                      key={tech}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[10.5px] font-mono font-black text-black border-2 border-black shadow-brutal-xs ${
                        colors[i % colors.length]
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                      {tech}
                    </span>
                  );
                }
              )}
            </div>
          </div>

          {/* Social Icons */}
          <div className="w-full mb-4 sm:mb-5">
            <SocialLinks socials={profile.socials} />
          </div>

          {/* Link Cards List */}
          <div className="w-full space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
            {profile.links.map((link) => (
              <LinkItemCard key={link.id} item={link} theme={currentTheme} />
            ))}
          </div>

          {/* Arcade Scoreboard (Cheer & Views Bar) */}
          <div className="w-full pt-4 border-t-2 border-black flex items-center justify-center gap-3 sm:gap-6 text-xs font-mono font-bold">
            {/* Views count */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black bg-white text-black shadow-brutal-xs">
              <Eye className="w-3.5 h-3.5 text-black flex-shrink-0" />
              <span className="text-[11px] sm:text-xs font-black">
                VIEWS: {viewsCount.toLocaleString()}
              </span>
            </div>

            {/* Cheer / Like button */}
            <div className="relative">
              <button
                type="button"
                onClick={handleLike}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border-2 border-black bg-[#FF80B5] hover:bg-[#FFB5D5] text-black font-black shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                title="응원하기"
              >
                <Heart
                  className={`w-3.5 h-3.5 fill-black text-black transition-transform ${
                    liked ? 'scale-125' : ''
                  }`}
                />
                <span className="text-[11px] sm:text-xs">
                  CHEER: {likesCount.toLocaleString()}
                </span>
              </button>

              {/* Floating Particles Burst */}
              {particles.map((p) => (
                <span
                  key={p.id}
                  style={{
                    transform: `translateX(${p.xOffset}px)`,
                  }}
                  className="pointer-events-none absolute -top-5 left-1/2 text-sm animate-heartFloat font-black select-none z-30 drop-shadow-[1px_1px_0px_#000]"
                >
                  {p.emoji}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="w-full pt-4 mt-2 text-center">
            <p className="font-mono font-bold text-[10.5px] text-zinc-800 dark:text-zinc-400">
              © {new Date().getFullYear()} {profile.name} · ALL RIGHTS RESERVED
            </p>
          </footer>
        </main>
      </div>

      {/* Bottom Floating Theme Switcher */}
      <div className="mt-4 sm:mt-5 z-20">
        <ThemeSwitcher
          currentTheme={profile.theme}
          onSelectTheme={handleThemeSelect}
        />
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        profileName={profile.name}
        handle={profile.handle}
      />

      <GuestbookModal
        isOpen={isGuestbookOpen}
        onClose={() => setIsGuestbookOpen(false)}
        profileName={profile.name}
      />

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
        onReset={handleResetProfile}
      />
    </div>
  );
};
