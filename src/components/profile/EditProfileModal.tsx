'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  Palette,
  User,
} from 'lucide-react';
import { ProfileData, ThemeId, LinkItem } from '@/types/profile';
import { THEMES } from '@/data/initialProfile';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSave: (updated: ProfileData) => void;
  onReset: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<ProfileData>(profile);
  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'theme'>('profile');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkSubtitle, setNewLinkSubtitle] = useState('');
  const [newLinkBadge, setNewLinkBadge] = useState('');

  if (!isOpen) return null;

  const handleTextChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;

    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim().startsWith('http') ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`,
      subtitle: newLinkSubtitle.trim() || undefined,
      badge: newLinkBadge.trim() || undefined,
      clicks: 0,
      featured: false,
    };

    setFormData((prev) => ({
      ...prev,
      links: [newLink, ...prev.links],
    }));

    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkSubtitle('');
    setNewLinkBadge('');
  };

  const handleDeleteLink = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }));
  };

  const handleToggleFeatured = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((l) =>
        l.id === id ? { ...l, featured: !l.featured } : l
      ),
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleResetConfirm = () => {
    if (confirm('기본 설정으로 되돌리시겠습니까? 모든 변경사항이 초기화됩니다.')) {
      onReset();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl bg-zinc-900 border border-zinc-700/80 p-6 text-white shadow-2xl transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">프로필 커스텀 & 설정</h3>
              <p className="text-xs text-zinc-400">
                내용과 테마를 자유롭게 수정하고 실시간으로 반영하세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-zinc-800/80 rounded-xl p-1 my-4 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'profile' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            기본 정보
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'links' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            링크 관리 ({formData.links.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'theme' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            테마 디자인
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          {/* TAB 1: Profile Info */}
          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">이름 (Display Name)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleTextChange('name', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">사용자 핸들 (@handle)</label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => handleTextChange('handle', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">상태 배지 문구</label>
                <input
                  type="text"
                  value={formData.statusBadge || ''}
                  onChange={(e) => handleTextChange('statusBadge', e.target.value)}
                  placeholder="예: 🟢 프로젝트 & 커피챗 문의 환영"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">소개글 (Bio)</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleTextChange('bio', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">위치 (Location)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleTextChange('location', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">프로필 이미지 URL</label>
                <input
                  type="text"
                  value={formData.avatarUrl}
                  onChange={(e) => handleTextChange('avatarUrl', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Links Management */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              {/* Add New Link Card */}
              <div className="p-3.5 bg-zinc-800/80 rounded-2xl border border-zinc-700/80 space-y-2.5">
                <span className="font-semibold text-zinc-200 block">새 링크 추가하기</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="링크 제목 (예: 블로그 보러가기)"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="연결 URL (https://...)"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="부제목 (선택사항)"
                    value={newLinkSubtitle}
                    onChange={(e) => setNewLinkSubtitle(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="배지 라벨 (예: NEW, HOT)"
                    value={newLinkBadge}
                    onChange={(e) => setNewLinkBadge(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  링크 목록에 추가
                </button>
              </div>

              {/* Existing Links List */}
              <div className="space-y-2">
                <span className="font-semibold text-zinc-400 block">등록된 링크 ({formData.links.length})</span>
                {formData.links.map((link) => (
                  <div
                    key={link.id}
                    className="p-3 bg-zinc-800 rounded-xl border border-zinc-700/60 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-100 truncate">{link.title}</span>
                        {link.featured && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            강조됨
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">{link.url}</p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(link.id)}
                        className={`px-2 py-1 rounded-lg text-[11px] transition-colors ${
                          link.featured
                            ? 'bg-amber-500/30 text-amber-300'
                            : 'bg-zinc-700 text-zinc-400 hover:text-white'
                        }`}
                        title="강조 효과 토글"
                      >
                        ⭐ 강조
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Theme Design */}
          {activeTab === 'theme' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(THEMES) as ThemeId[]).map((themeId) => {
                const item = THEMES[themeId];
                const isSelected = formData.theme === themeId;
                return (
                  <button
                    key={themeId}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, theme: themeId }))}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      item.background
                    } ${
                      isSelected
                        ? 'ring-2 ring-indigo-400 border-white/50 scale-[1.02]'
                        : 'border-white/10 hover:border-white/30 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-sm">{item.name}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="h-6 rounded-lg bg-white/20 backdrop-blur-sm border border-white/20 flex items-center px-2 text-[10px] text-white">
                      미리보기 카드 스타일
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={handleResetConfirm}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            초기화
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-300 hover:bg-zinc-800 transition-colors text-xs font-medium"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white transition-all text-xs font-semibold shadow-lg shadow-indigo-600/30"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
