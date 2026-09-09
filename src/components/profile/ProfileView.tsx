'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  Edit3,
  MessageSquareHeart,
  Heart,
  Eye,
  Sparkles,
  CheckCircle2,
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

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(INITIAL_PROFILE.stats.likes);
  const [viewsCount, setViewsCount] = useState(INITIAL_PROFILE.stats.views);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

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

  // Handle Like Button click
  const handleLike = () => {
    if (!liked) {
      setLikesCount((prev) => prev + 1);
      setLiked(true);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 1200);

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
      className={`min-h-screen w-full transition-colors duration-300 flex flex-col items-center justify-start py-8 px-4 sm:px-6 relative ${currentTheme.background}`}
    >
      {/* Top Floating Control Bar */}
      <header className="w-full max-w-md flex items-center justify-between gap-2 mb-6 z-20">
        <button
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-zinc-800/70 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 backdrop-blur-md text-zinc-700 dark:text-zinc-200 text-xs font-medium transition-all hover:shadow-sm active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span>프로필 편집</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGuestbookOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-zinc-800/70 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 backdrop-blur-md text-zinc-700 dark:text-zinc-200 text-xs font-medium transition-all hover:shadow-sm active:scale-95"
            title="방명록"
          >
            <MessageSquareHeart className="w-3.5 h-3.5 text-pink-500" />
            <span>방명록</span>
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2 rounded-full bg-white/70 dark:bg-zinc-800/70 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 backdrop-blur-md text-zinc-700 dark:text-zinc-200 transition-all hover:shadow-sm active:scale-95"
            aria-label="공유하기"
            title="프로필 공유 & QR 코드"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Centered Container */}
      <main
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 transition-all duration-300 relative z-10 flex flex-col items-center text-center ${currentTheme.containerBg}`}
      >
        {/* Centered Avatar */}
        <div className="relative mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-200 via-rose-200 to-amber-200 dark:from-zinc-700 dark:to-zinc-800 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full rounded-full object-cover bg-zinc-200 dark:bg-zinc-700"
            />
          </div>
          {/* Active indicator */}
          <span
            className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 shadow-sm"
            title="활동 중"
          />
        </div>

        {/* Status Badge */}
        {profile.statusBadge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium mb-3">
            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            <span>{profile.statusBadge}</span>
          </div>
        )}

        {/* Centered Name */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {profile.name}
          </h1>
          <CheckCircle2
            className="w-5 h-5 text-indigo-500 fill-indigo-500/10 dark:text-indigo-400"
            aria-label="인증된 프로필"
          />
        </div>

        {/* Centered Handle */}
        <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-3">
          {profile.handle}
        </p>

        {/* Centered Bio */}
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 whitespace-pre-line leading-relaxed max-w-xs sm:max-w-sm mb-4 font-normal">
          {profile.bio}
        </p>

        {/* Centered Tags */}
        {profile.tags && profile.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Tech Stack Pills */}
        <div className="flex flex-col items-center gap-1.5 mb-5 max-w-xs sm:max-w-sm">
          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            <Code2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>CORE TECH STACK</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-1.5">
            {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Docker'].map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-mono font-medium bg-zinc-100/90 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/60 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Centered Social Icons */}
        <div className="w-full mb-6">
          <SocialLinks socials={profile.socials} />
        </div>

        {/* Centered Link Cards List */}
        <div className="w-full space-y-3 mb-6">
          {profile.links.map((link) => (
            <LinkItemCard key={link.id} item={link} theme={currentTheme} />
          ))}
        </div>

        {/* Centered Interactive Cheer (Like) & Views Bar */}
        <div className="w-full pt-4 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
          {/* Views count */}
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>조회수 {viewsCount.toLocaleString()}</span>
          </div>

          {/* Like button */}
          <div className="relative">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all border ${
                liked
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-semibold'
                  : 'bg-zinc-100/80 dark:bg-zinc-800/60 border-zinc-200/70 dark:border-zinc-700/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
              } active:scale-95`}
              title="응원하기"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform ${
                  liked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                }`}
              />
              <span>응원 {likesCount.toLocaleString()}</span>
            </button>

            {/* Floating Heart burst */}
            {showHeartAnim && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-sm animate-bounce font-bold text-rose-500">
                💖 +1
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full pt-6 mt-4 text-center">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} {profile.name} · Linktree
          </p>
        </footer>
      </main>

      {/* Bottom Floating Theme Switcher */}
      <div className="mt-6 z-20">
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
