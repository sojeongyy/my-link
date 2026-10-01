'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Eye, ChevronRight } from 'lucide-react';
import { ProfileData } from '@/types/profile';
import { INITIAL_PROFILE } from '@/data/initialProfile';
import { LinkItemCard } from './LinkItemCard';
import { ShareModal } from './ShareModal';
import { GuestbookModal } from './GuestbookModal';
import { EditProfileModal } from './EditProfileModal';

const STORAGE_KEY = 'mylinke_profile_data_v4';

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
    /* Nintendo.com 2001 Chrome */
    <div className="min-h-dvh w-full flex flex-col items-center bg-[#7a8aba] overflow-x-clip font-sans">
      {/* Fixed-width chrome container */}
      <div className="w-full max-w-[780px]">

        {/* 1. CARBON NAV BAR */}
        <nav
          className="halftone w-full flex items-center px-2 gap-2 select-none"
          style={{ backgroundColor: '#21242e', height: 32 }}
        >
          {/* Logo pill */}
          <span
            className="font-black uppercase tracking-wider flex-shrink-0"
            style={{
              backgroundColor: '#ffffff',
              color: '#3d4f97',
              fontSize: 10,
              padding: '2px 8px',
              borderRadius: 9999,
              border: '1px solid #3d4f97',
            }}
          >
            SJ.
          </span>

          {/* Nav words */}
          <div className="hidden sm:flex items-center gap-3 ml-1">
            {['PROFILE', 'LINKS', 'RESEARCH', 'CONTACT'].map((w) => (
              <span
                key={w}
                className="font-bold uppercase cursor-default"
                style={{ color: '#e48600', fontSize: 11, letterSpacing: '0.05em' }}
              >
                {w}
              </span>
            ))}
          </div>

          {/* Utility chips */}
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setIsEditOpen(true)}
              className="bevel-chip font-bold uppercase hover:brightness-110 active:brightness-90 transition-all"
              style={{
                backgroundColor: '#ecab37',
                color: '#21242e',
                fontSize: 9,
                letterSpacing: '0.05em',
                padding: '2px 6px',
                borderRadius: 2,
              }}
            >
              ✏ EDIT
            </button>
            <button
              onClick={() => setIsShareOpen(true)}
              className="bevel-chip font-bold uppercase hover:brightness-110 active:brightness-90 transition-all"
              style={{
                backgroundColor: '#ecab37',
                color: '#21242e',
                fontSize: 9,
                letterSpacing: '0.05em',
                padding: '2px 6px',
                borderRadius: 2,
              }}
            >
              ⬡ SHARE
            </button>
          </div>
        </nav>

        {/* 2. SKY SUB-NAV STRIP */}
        <div
          className="w-full flex items-center px-3 gap-3 select-none"
          style={{
            backgroundColor: '#9fbee7',
            borderBottom: '2px solid #3d4f97',
            height: 22,
          }}
        >
          {['ABOUT', 'RESEARCH', 'KAIST CYPHY', 'SECURITY', 'HARDWARE'].map((w) => (
            <span
              key={w}
              className="font-bold uppercase cursor-default hidden sm:inline"
              style={{ color: '#21242e', fontSize: 9, letterSpacing: '0.05em' }}
            >
              {w}
            </span>
          ))}
          <span
            className="font-bold uppercase cursor-default sm:hidden"
            style={{ color: '#21242e', fontSize: 9 }}
          >
            KAIST CYPHY · SECURITY · HARDWARE
          </span>
        </div>

        {/* 3. LAVENDER HERO PANEL */}
        <div
          className="w-full flex items-center gap-4 px-4 py-4 relative overflow-hidden"
          style={{ backgroundColor: '#acace7', borderBottom: '2px solid #3d4f97', minHeight: 120 }}
        >
          {/* Profile image */}
          <div className="flex-shrink-0">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  border: '3px solid #21242e',
                  boxShadow: '4px 4px 0 #3d4f97',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  border: '3px solid #21242e',
                  boxShadow: '4px 4px 0 #3d4f97',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                }}
              >
                👤
              </div>
            )}
          </div>

          {/* Name + handle + status */}
          <div className="flex-1 min-w-0">
            <h1
              className="font-black leading-none nt-display break-keep"
              style={{ color: '#ffffff', fontSize: 'clamp(20px, 5vw, 32px)' }}
            >
              {profile.name}
            </h1>
            <p
              className="font-bold mt-1"
              style={{ color: '#21242e', fontSize: 11 }}
            >
              {profile.handle}
            </p>
            {profile.statusBadge && (
              <p
                className="mt-1 font-medium"
                style={{ color: '#3d4f97', fontSize: 10 }}
              >
                {profile.statusBadge}
              </p>
            )}
            {profile.location && (
              <p style={{ color: '#60619c', fontSize: 10, marginTop: 2 }}>{profile.location}</p>
            )}
          </div>

          {/* Signal orange forward arrow */}
          <button
            onClick={() => setIsGuestbookOpen(true)}
            title="방명록 쓰기"
            className="bevel-chip flex-shrink-0 flex items-center justify-center hover:brightness-110 active:brightness-90 transition-all"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#f68d1f',
            }}
          >
            <ChevronRight className="text-white" style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* 4. TWO-COLUMN BODY */}
        <div
          className="w-full flex flex-col lg:flex-row items-start"
          style={{ borderBottom: '2px solid #3d4f97' }}
        >

          {/* Content Column (67%) */}
          <div className="w-full min-w-0 lg:flex-1 lg:border-r-2 lg:border-r-[#3d4f97]">

            {/* Section bar — PROFILE */}
            <div
              className="flex items-center gap-1 px-3"
              style={{
                backgroundColor: '#7a8aba',
                borderBottom: '1px solid #3d4f97',
                height: 24,
              }}
            >
              <span
                className="font-bold uppercase text-white"
                style={{ fontSize: 11, letterSpacing: '0.05em' }}
              >
                ≡ PROFILE
              </span>
            </div>

            {/* Bio */}
            <div
              className="bg-white px-3 py-2"
              style={{ borderBottom: '1px solid #3d4f97' }}
            >
              <p
                className="whitespace-pre-line"
                style={{ color: '#21242e', fontSize: 12, lineHeight: 1.4 }}
              >
                {profile.bio}
              </p>
            </div>

            {/* Tags */}
            {profile.tags && profile.tags.length > 0 && (
              <div
                className="flex flex-wrap gap-1 px-3 py-2"
                style={{ backgroundColor: '#dedede', borderBottom: '1px solid #3d4f97' }}
              >
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-bold"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#3d4f97',
                      fontSize: 10,
                      padding: '1px 6px',
                      border: '1px solid #3d4f97',
                      borderRadius: 2,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Section bar — LINKS */}
            <div
              className="flex items-center gap-1 px-3"
              style={{
                backgroundColor: '#7a8aba',
                borderBottom: '1px solid #3d4f97',
                height: 24,
              }}
            >
              <span
                className="font-bold uppercase text-white"
                style={{ fontSize: 11, letterSpacing: '0.05em' }}
              >
                ≡ LINKS
              </span>
            </div>

            {/* Link news-rows */}
            {profile.links.map((link) => (
              <LinkItemCard key={link.id} item={link} />
            ))}

            {/* Scoreboard — views + like */}
            <div
              className="flex items-center gap-3 px-3 py-2"
              style={{ backgroundColor: '#8ba1d4', borderTop: '2px solid #3d4f97' }}
            >
              {/* Views */}
              <div
                className="flex items-center gap-1 font-bold"
                style={{
                  backgroundColor: '#ffffff',
                  padding: '3px 8px',
                  border: '1px solid #3d4f97',
                  borderRadius: 2,
                  fontSize: 10,
                  color: '#21242e',
                  letterSpacing: '0.05em',
                }}
              >
                <Eye style={{ width: 12, height: 12, color: '#3d4f97', flexShrink: 0 }} />
                <span className="uppercase">VIEWS: {viewsCount.toLocaleString()}</span>
              </div>

              {/* Like / Cheer button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleLike}
                  className="bevel-chip flex items-center gap-1 font-black uppercase hover:brightness-110 active:brightness-90 transition-all"
                  style={{
                    backgroundColor: '#f68d1f',
                    color: '#ffffff',
                    fontSize: 10,
                    letterSpacing: '0.05em',
                    padding: '3px 8px',
                    borderRadius: 2,
                  }}
                >
                  <Heart
                    className={`transition-transform ${liked ? 'scale-125' : ''}`}
                    style={{ width: 12, height: 12, fill: '#ffffff', flexShrink: 0 }}
                  />
                  CHEER: {likesCount.toLocaleString()}
                </button>

                {/* Floating particles */}
                {particles.map((p) => (
                  <span
                    key={p.id}
                    style={{ transform: `translateX(${p.xOffset}px)` }}
                    className="pointer-events-none absolute -top-5 left-1/2 text-sm animate-heartFloat select-none z-30"
                  >
                    {p.emoji}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Action Rail (33%) */}
          <div
            className="w-full lg:w-[240px] flex-shrink-0 border-t-2 border-t-[#3d4f97] lg:border-t-0"
          >
            {/* GitHub button — carbon slab */}
            {profile.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="halftone w-full flex items-center gap-2 px-3 py-2.5 hover:brightness-110 transition-all"
                style={{
                  backgroundColor: '#21242e',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderBottom: '1px solid #3d4f97',
                  display: 'flex',
                }}
              >
                <span style={{ color: '#f68d1f', fontSize: 14 }}>⊞</span>
                <span
                  className="flex-1 font-bold uppercase"
                  style={{ fontSize: 11, letterSpacing: '0.05em' }}
                >
                  {s.label}
                </span>
                <ChevronRight style={{ width: 14, height: 14, color: '#f68d1f', flexShrink: 0 }} />
              </a>
            ))}

            {/* Guestbook button — carbon slab */}
            <button
              onClick={() => setIsGuestbookOpen(true)}
              className="halftone w-full flex items-center gap-2 px-3 py-2.5 hover:brightness-110 transition-all"
              style={{
                backgroundColor: '#21242e',
                color: '#ffffff',
                borderBottom: '1px solid #3d4f97',
                width: '100%',
              }}
            >
              <span style={{ color: '#ecab37', fontSize: 14 }}>💌</span>
              <span
                className="flex-1 text-left font-bold uppercase"
                style={{ fontSize: 11, letterSpacing: '0.05em' }}
              >
                GUESTBOOK
              </span>
              <ChevronRight style={{ width: 14, height: 14, color: '#f68d1f', flexShrink: 0 }} />
            </button>

            {/* Info box */}
            <div style={{ borderBottom: '1px solid #3d4f97' }}>
              <div
                className="font-bold uppercase"
                style={{
                  backgroundColor: '#ecab37',
                  color: '#21242e',
                  fontSize: 10,
                  letterSpacing: '0.05em',
                  padding: '3px 12px',
                }}
              >
                WHAT IS — CYPHY LAB
              </div>
              <div className="bg-white px-3 py-2">
                <p style={{ color: '#21242e', fontSize: 12, lineHeight: 1.4 }}>
                  CyPhy Lab at KAIST bridges the physical and digital worlds through security and hardware research.
                </p>
              </div>
            </div>

            {/* Promo card */}
            <div
              className="px-3 py-3"
              style={{ backgroundColor: '#acace7', borderBottom: '1px solid #3d4f97' }}
            >
              <p
                className="font-bold uppercase"
                style={{ color: '#21242e', fontSize: 9, letterSpacing: '0.05em', marginBottom: 4 }}
              >
                RESEARCH AREAS
              </p>
              <p
                className="font-black nt-display"
                style={{ color: '#ffffff', fontSize: 20, lineHeight: 1.1 }}
              >
                SECURITY
              </p>
              <p
                className="font-black nt-display"
                style={{ color: '#ffffff', fontSize: 20, lineHeight: 1.1 }}
              >
                HARDWARE
              </p>
              <p style={{ color: '#3d4f97', fontSize: 10, marginTop: 6, fontWeight: 600 }}>
                @ KAIST cyphy Lab
              </p>
            </div>

          </div>
        </div>

        {/* 5. CARBON FOOTER */}
        <footer
          className="halftone w-full flex items-center justify-between px-4 py-2"
          style={{ backgroundColor: '#21242e' }}
        >
          <span style={{ color: '#9fbee7', fontSize: 10 }}>
            © {new Date().getFullYear()} {profile.name} · ALL RIGHTS RESERVED
          </span>
          <span
            className="font-bold uppercase"
            style={{
              backgroundColor: '#ecab37',
              color: '#21242e',
              fontSize: 9,
              letterSpacing: '0.05em',
              padding: '1px 5px',
              borderRadius: 2,
            }}
          >
            PRIVACY CERTIFIED
          </span>
        </footer>

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
