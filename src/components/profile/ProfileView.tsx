'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Share2,
  Edit3,
  ExternalLink,
  ChevronRight,
  Shield,
  Cpu,
  Layers,
  Sparkles,
  MessageSquare,
  Compass,
  Laptop,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { ProfileData } from '@/types/profile';
import { INITIAL_PROFILE } from '@/data/initialProfile';
import { LinkItemCard } from './LinkItemCard';
import { ShareModal } from './ShareModal';
import { GuestbookModal } from './GuestbookModal';
import { EditProfileModal } from './EditProfileModal';

const STORAGE_KEY = 'mylinke_profile_apple_v1';

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
  const [likesCount, setLikesCount] = useState(INITIAL_PROFILE.stats.likes);
  const [viewsCount, setViewsCount] = useState(INITIAL_PROFILE.stats.views);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  // Load profile data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile(parsed);
          setLikesCount(parsed.stats?.likes ?? INITIAL_PROFILE.stats.likes);
          setViewsCount((parsed.stats?.views ?? INITIAL_PROFILE.stats.views) + 1);
        } catch {
          // fallback to initial
        }
      } else {
        setViewsCount((prev) => prev + 1);
      }
    }
  }, []);

  // Save profile helper
  const handleProfileUpdate = (updated: ProfileData) => {
    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleProfileReset = () => {
    setProfile(INITIAL_PROFILE);
    setLikesCount(INITIAL_PROFILE.stats.likes);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Handle Like Button click
  const handleLike = () => {
    setLikesCount((prev) => {
      const next = prev + 1;
      const updated = {
        ...profile,
        stats: { ...profile.stats, likes: next },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return next;
    });

    const burstEmojis = ['❤️', '✨', '👏', '🔥'];
    const newParticles: FloatingParticle[] = burstEmojis.map((emoji, idx) => ({
      id: Date.now() + idx,
      xOffset: (idx - 1.5) * 18,
      emoji,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] selection:bg-[#0066cc]/20 selection:text-[#0066cc]">
      {/* ═════════════════════════════════════════════════════════
          1. APPLE GLOBAL STICKY NAVIGATION BAR
          ═════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 w-full apple-frosted border-b border-black/[0.06] transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <span className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight flex items-center gap-1.5">
              <span className="text-[19px] leading-none select-none font-serif"></span>
              <span className="font-semibold text-[14px] text-[#1d1d1f]">MyLink</span>
            </span>
            <span className="text-[11px] font-medium text-[#86868b] hidden sm:inline-block">
              / {profile.name}
            </span>
          </div>

          {/* Quick navigation anchor links */}
          <nav className="hidden md:flex items-center gap-6 text-[12px] text-[#424245]">
            <a href="#overview" className="hover:text-[#0066cc] transition-colors">
              Overview
            </a>
            <a href="#research" className="hover:text-[#0066cc] transition-colors">
              Research
            </a>
            <a href="#links" className="hover:text-[#0066cc] transition-colors">
              Links
            </a>
            <a href="#specs" className="hover:text-[#0066cc] transition-colors">
              Tech Specs
            </a>
            <a href="#guestbook" className="hover:text-[#0066cc] transition-colors">
              Community
            </a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/[0.05] hover:bg-black/[0.08] text-[12px] font-medium text-[#1d1d1f] transition-all apple-press"
              title="프로필 공유"
            >
              <Share2 className="w-3 h-3 text-[#0066cc]" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-[12px] font-medium text-white transition-all apple-press"
              title="프로필 편집"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════
          2. HERO SHOWCASE (Apple Keynote Style)
          ═════════════════════════════════════════════════════════ */}
      <section id="overview" className="relative pt-12 sm:pt-16 pb-14 sm:pb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066cc]/10 text-[#0066cc] text-[12px] font-semibold tracking-[0.06em] uppercase mb-6 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5" />
            KAIST CyPhy Lab · Security & Hardware Systems
          </div>

          {/* Profile Avatar with subtle glow */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-white shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-black/[0.06] transition-transform duration-300 group-hover:scale-105">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#f5f5f7] flex items-center justify-center text-3xl">
                    👩‍💻
                  </div>
                )}
              </div>
              {/* Live status badge pill */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md px-3 py-0.5 rounded-full border border-black/[0.08] shadow-sm flex items-center gap-1.5 text-[11px] font-medium text-[#1d1d1f]">
                <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse"></span>
                <span>{profile.statusBadge ?? 'Active Researcher'}</span>
              </div>
            </div>
          </div>

          {/* Big Bold Display Headline */}
          <h1 className="text-[38px] sm:text-[54px] lg:text-[62px] font-semibold tracking-[-0.035em] text-[#1d1d1f] leading-[1.08] mb-3 break-keep">
            {profile.name}
          </h1>

          {/* Handle & Subtitle */}
          <p className="text-[17px] sm:text-[21px] text-[#6e6e73] font-normal tracking-[-0.015em] max-w-2xl mx-auto break-keep mb-4">
            시스템 보안과 하드웨어 아키텍처의 경계를 탐구하는 연구자.
          </p>

          {/* Bio copy */}
          <p className="text-[15px] sm:text-[16px] text-[#424245] leading-relaxed max-w-xl mx-auto break-keep mb-8 whitespace-pre-line font-normal">
            {profile.bio}
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Primary Action Blue Pill */}
            <a
              href="https://github.com/sojeongyy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-[15px] font-medium shadow-[0_2px_12px_rgba(0,102,204,0.3)] transition-all apple-press"
            >
              <span>GitHub 방문하기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Like/Applause Pill with particle burst */}
            <div className="relative inline-block">
              <button
                onClick={handleLike}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#fafafc] border border-black/[0.08] text-[#1d1d1f] text-[15px] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all apple-press"
              >
                <Heart className="w-4 h-4 text-[#ff2d55] fill-[#ff2d55]" />
                <span>응원하기</span>
                <span className="ml-0.5 px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[12px] font-semibold text-[#86868b]">
                  {likesCount}
                </span>
              </button>

              {/* Floating particles */}
              {particles.map((p) => (
                <span
                  key={p.id}
                  className="absolute pointer-events-none select-none text-xl animate-heartFloat"
                  style={{
                    left: `calc(50% + ${p.xOffset}px)`,
                    bottom: '100%',
                  }}
                >
                  {p.emoji}
                </span>
              ))}
            </div>

            {/* Guestbook CTA Pill */}
            <button
              onClick={() => setIsGuestbookOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#fafafc] border border-black/[0.08] text-[#1d1d1f] text-[15px] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all apple-press"
            >
              <MessageSquare className="w-4 h-4 text-[#0066cc]" />
              <span>방명록 남기기</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center justify-center gap-6 mt-10 text-[13px] text-[#86868b]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]"></span>
              <span>{profile.location ?? 'Daejeon, Korea'}</span>
            </div>
            <span>·</span>
            <div>
              <span>총 방문자 </span>
              <strong className="text-[#1d1d1f] font-semibold">{viewsCount}</strong>
            </div>
            <span>·</span>
            <div>
              <span>응원 하트 </span>
              <strong className="text-[#1d1d1f] font-semibold">{likesCount}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          3. APPLE BENTO GRID SHOWCASE
          ═════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* ── BENTO 1: Large Feature Card (Research Focus) ── */}
          <div
            id="research"
            className="md:col-span-8 bg-white rounded-[28px] p-7 sm:p-9 border border-black/[0.06] apple-card-shadow apple-card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.06em] text-[#0066cc] uppercase">
                  <Shield className="w-3.5 h-3.5" />
                  Research Domain
                </span>
                <span className="text-[12px] text-[#86868b] font-medium">
                  KAIST CyPhy Lab
                </span>
              </div>

              <h2 className="text-[26px] sm:text-[32px] font-semibold tracking-[-0.025em] text-[#1d1d1f] leading-snug mb-3">
                Hardware Trust &<br className="hidden sm:inline" /> Microarchitectural Security
              </h2>

              <p className="text-[15px] sm:text-[16px] text-[#6e6e73] leading-relaxed mb-6 break-keep">
                현대 컴퓨팅 시스템은 하드웨어와 소프트웨어의 경계에서 다양한 취약점에 노출됩니다. 사이드 채널 분석, 신뢰 실행 환경(TEE), 하드웨어 타이밍 공격을 연구하며 무결성과 보안을 강화하는 실질적인 엔지니어링 솔루션을 도출합니다.
              </p>

              {/* Research Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 mb-6">
                <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04]">
                  <Cpu className="w-5 h-5 text-[#0066cc] mb-2" />
                  <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-1">
                    System Security
                  </h4>
                  <p className="text-[12px] text-[#86868b] leading-normal">
                    운영체제 및 가상화 계층 보안 구조 분석
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04]">
                  <Layers className="w-5 h-5 text-[#0066cc] mb-2" />
                  <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-1">
                    Hardware Trust
                  </h4>
                  <p className="text-[12px] text-[#86868b] leading-normal">
                    신뢰 가능한 하드웨어 설계 및 펌웨어 검증
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04]">
                  <Shield className="w-5 h-5 text-[#0066cc] mb-2" />
                  <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-1">
                    Cyber-Physical
                  </h4>
                  <p className="text-[12px] text-[#86868b] leading-normal">
                    실세계 센서/임베디드 CPS 무결성 보장
                  </p>
                </div>
              </div>
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-black/[0.04]">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#f5f5f7] text-[#424245]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── BENTO 2: Dark Accent Tile (GitHub Showcase) ── */}
          <div className="md:col-span-4 bg-[#161617] text-white rounded-[28px] p-7 sm:p-8 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold tracking-[0.08em] text-[#a1a1a6] uppercase">
                  OPEN SOURCE
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#2997ff]"></span>
              </div>

              <h3 className="text-[22px] sm:text-[24px] font-semibold tracking-[-0.02em] leading-snug mb-2">
                GitHub Repository
              </h3>
              <p className="text-[14px] text-[#a1a1a6] leading-relaxed mb-6 font-mono">
                github.com/sojeongyy
              </p>

              <div className="space-y-2.5 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.08] text-[13px]">
                  <span className="text-[#a1a1a6]">Primary Repos</span>
                  <span className="font-semibold text-white">my-link, CyPhy, OS</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.08] text-[13px]">
                  <span className="text-[#a1a1a6]">Focus</span>
                  <span className="font-semibold text-white">C/C++, Verilog, Python</span>
                </div>
                <div className="flex items-center justify-between py-2 text-[13px]">
                  <span className="text-[#a1a1a6]">Status</span>
                  <span className="font-semibold text-[#2997ff] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Public Verified
                  </span>
                </div>
              </div>
            </div>

            <a
              href="https://github.com/sojeongyy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full bg-[#2997ff] hover:bg-[#0071e3] text-white text-[14px] font-medium flex items-center justify-center gap-1.5 transition-all apple-press shadow-[0_2px_12px_rgba(41,151,255,0.3)]"
            >
              <span>코드 저장소 둘러보기</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* ── BENTO 3: Linktree Dynamic Collection ── */}
          <div
            id="links"
            className="md:col-span-7 bg-white rounded-[28px] p-7 sm:p-8 border border-black/[0.06] apple-card-shadow apple-card-hover"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[12px] font-semibold tracking-[0.06em] text-[#0066cc] uppercase">
                  DIRECTORY
                </span>
                <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f] mt-0.5">
                  나만의 링크트리 컬렉션
                </h3>
              </div>
              <span className="text-[12px] font-medium text-[#86868b] bg-[#f5f5f7] px-2.5 py-1 rounded-full">
                {profile.links.length} Links
              </span>
            </div>

            <div className="space-y-3">
              {profile.links.map((link) => (
                <LinkItemCard key={link.id} item={link} />
              ))}
            </div>
          </div>

          {/* ── BENTO 4: Apple Technical Specifications Sheet ── */}
          <div
            id="specs"
            className="md:col-span-5 bg-white rounded-[28px] p-7 sm:p-8 border border-black/[0.06] apple-card-shadow apple-card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[12px] font-semibold tracking-[0.06em] text-[#0066cc] uppercase">
                    SPECS
                  </span>
                  <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f] mt-0.5">
                    Technical Specs
                  </h3>
                </div>
                <Laptop className="w-5 h-5 text-[#86868b]" />
              </div>

              {/* Spec Rows */}
              <div className="divide-y divide-black/[0.06] text-[13px]">
                <div className="py-3 flex justify-between">
                  <span className="text-[#86868b]">소속 기관</span>
                  <span className="font-semibold text-[#1d1d1f] text-right">
                    KAIST CyPhy Lab
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#86868b]">연구 직무</span>
                  <span className="font-semibold text-[#1d1d1f] text-right">
                    Research Intern
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#86868b]">주요 언어</span>
                  <span className="font-semibold text-[#1d1d1f] text-right">
                    C / C++, Python, Verilog
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#86868b]">시스템 아키텍처</span>
                  <span className="font-semibold text-[#1d1d1f] text-right">
                    x86_64, ARM, RISC-V
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#86868b]">웹 & 배포 프레임워크</span>
                  <span className="font-semibold text-[#1d1d1f] text-right">
                    Next.js, Tailwind, Vercel
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#86868b]">버전 관리</span>
                  <span className="font-semibold text-[#1d1d1f] text-right font-mono">
                    Git & GitHub (@sojeongyy)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.04] flex items-center justify-between text-[12px] text-[#86868b]">
              <span>Hardware & Systems Certified</span>
              <span className="text-[#0066cc] font-medium">All Specs Active</span>
            </div>
          </div>

          {/* ── BENTO 5: Interactive Community & Guestbook Banner ── */}
          <div
            id="guestbook"
            className="md:col-span-12 bg-gradient-to-r from-white via-white to-[#f5f5f7] rounded-[28px] p-7 sm:p-9 border border-black/[0.06] apple-card-shadow flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.06em] text-[#0066cc] uppercase mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Community & Feedback
              </span>
              <h3 className="text-[24px] sm:text-[28px] font-semibold tracking-[-0.025em] text-[#1d1d1f] mb-2">
                연구 및 포트폴리오에 응원의 한마디를 남겨주세요
              </h3>
              <p className="text-[15px] text-[#6e6e73] leading-relaxed break-keep">
                방명록을 통해 연구 협업 제안, 커피챗, 또는 응원의 메시지를 자유롭게 남기실 수 있습니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setIsGuestbookOpen(true)}
                className="px-6 py-3 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-[14px] font-medium shadow-[0_2px_12px_rgba(0,102,204,0.3)] transition-all apple-press flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>방명록 열기</span>
              </button>
              <button
                onClick={() => setIsShareOpen(true)}
                className="px-5 py-3 rounded-full bg-white hover:bg-[#fafafc] border border-black/[0.08] text-[#1d1d1f] text-[14px] font-medium shadow-sm transition-all apple-press flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-[#0066cc]" />
                <span>페이지 공유</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          4. APPLE SIGNATURE FOOTER
          ═════════════════════════════════════════════════════════ */}
      <footer className="w-full bg-[#f5f5f7] border-t border-black/[0.08] text-[#86868b] text-[12px] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top navigation directory columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10 pb-10 border-b border-black/[0.06]">
            <div>
              <h5 className="font-semibold text-[#1d1d1f] text-[13px] mb-3">Profile</h5>
              <ul className="space-y-2">
                <li>
                  <a href="#overview" className="hover:text-[#1d1d1f] transition-colors">
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#overview" className="hover:text-[#1d1d1f] transition-colors">
                    About Sojeong Kim
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="hover:text-[#1d1d1f] transition-colors text-left"
                  >
                    Edit Profile
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-[#1d1d1f] text-[13px] mb-3">Research</h5>
              <ul className="space-y-2">
                <li>
                  <a href="#research" className="hover:text-[#1d1d1f] transition-colors">
                    Hardware Trust
                  </a>
                </li>
                <li>
                  <a href="#research" className="hover:text-[#1d1d1f] transition-colors">
                    System Security
                  </a>
                </li>
                <li>
                  <a
                    href="https://cps.kaist.ac.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#1d1d1f] transition-colors"
                  >
                    KAIST CyPhy Lab ↗
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-[#1d1d1f] text-[13px] mb-3">Links</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/sojeongyy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#1d1d1f] transition-colors"
                  >
                    GitHub (@sojeongyy) ↗
                  </a>
                </li>
                <li>
                  <a href="#links" className="hover:text-[#1d1d1f] transition-colors">
                    Directory
                  </a>
                </li>
                <li>
                  <a href="#specs" className="hover:text-[#1d1d1f] transition-colors">
                    Tech Specifications
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-[#1d1d1f] text-[13px] mb-3">Connect</h5>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setIsGuestbookOpen(true)}
                    className="hover:text-[#1d1d1f] transition-colors text-left"
                  >
                    Guestbook
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsShareOpen(true)}
                    className="hover:text-[#1d1d1f] transition-colors text-left"
                  >
                    Share Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLike}
                    className="hover:text-[#1d1d1f] transition-colors text-left"
                  >
                    Send Cheers ({likesCount})
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom legal row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#86868b]">
            <p>
              Copyright © 2026 김소정 (Sojeong Kim). All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:text-[#1d1d1f] cursor-pointer">Privacy Policy</span>
              <span>·</span>
              <span className="hover:text-[#1d1d1f] cursor-pointer">Terms of Use</span>
              <span>·</span>
              <span className="hover:text-[#1d1d1f] cursor-pointer">System Status: Normal</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═════════════════════════════════════════════════════════
          5. MODALS (Apple iOS / macOS Dialogs)
          ═════════════════════════════════════════════════════════ */}
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
        onSave={handleProfileUpdate}
        onReset={handleProfileReset}
      />
    </div>
  );
};
