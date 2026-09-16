'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  RotateCcw,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white text-black border-[2.5px] border-black shadow-brutal-xl overflow-hidden max-h-[90vh] flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Retro Window Top Header */}
        <div className="bg-[#A3E635] border-b-2 border-black px-3.5 py-2 flex items-center justify-between select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black inline-block"></span>
          </div>
          <span className="font-mono text-[11px] font-black uppercase tracking-wider text-black">
            PROFILE_CONFIG.SETTINGS
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded border border-black bg-white flex items-center justify-center hover:bg-[#FF80B5] active:translate-x-0.5 active:translate-y-0.5"
            aria-label="닫기"
          >
            <X className="w-3.5 h-3.5 text-black" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="p-3 sm:p-4 pb-0">
          <div className="flex bg-[#F4F4F5] border-2 border-black rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 text-xs font-mono font-black rounded-lg flex items-center justify-center gap-1 transition-all ${
                activeTab === 'profile'
                  ? 'bg-black text-white shadow-brutal-xs'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>기본 정보</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('links')}
              className={`flex-1 py-2 text-xs font-mono font-black rounded-lg flex items-center justify-center gap-1 transition-all ${
                activeTab === 'links'
                  ? 'bg-black text-white shadow-brutal-xs'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>링크 ({formData.links.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 text-xs font-mono font-black rounded-lg flex items-center justify-center gap-1 transition-all ${
                activeTab === 'theme'
                  ? 'bg-black text-white shadow-brutal-xs'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>테마 디자인</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 text-xs no-scrollbar">
          {/* TAB 1: Profile Info */}
          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div>
                <label className="block text-black mb-1 font-mono font-black uppercase">
                  이름 (Display Name)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleTextChange('name', e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-black font-mono font-bold outline-none focus:bg-[#FEF9C3] shadow-brutal-xs"
                />
              </div>

              <div>
                <label className="block text-black mb-1 font-mono font-black uppercase">
                  사용자 핸들 (@handle)
                </label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => handleTextChange('handle', e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-black font-mono font-bold outline-none focus:bg-[#FEF9C3] shadow-brutal-xs"
                />
              </div>

              <div>
                <label className="block text-black mb-1 font-mono font-black uppercase">
                  상태 배지 스티커
                </label>
                <input
                  type="text"
                  value={formData.statusBadge || ''}
                  onChange={(e) => handleTextChange('statusBadge', e.target.value)}
                  placeholder="예: 🟢 사이드 프로젝트 & 커피챗 열려있음"
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-black font-mono font-bold outline-none focus:bg-[#FEF9C3] shadow-brutal-xs"
                />
              </div>

              <div>
                <label className="block text-black mb-1 font-mono font-black uppercase">
                  소개글 (Bio)
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleTextChange('bio', e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-black font-mono font-bold outline-none focus:bg-[#FEF9C3] shadow-brutal-xs resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-black mb-1 font-mono font-black uppercase">
                  위치 (Location)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleTextChange('location', e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-black font-mono font-bold outline-none focus:bg-[#FEF9C3] shadow-brutal-xs"
                />
              </div>

              <div>
                <label className="block text-black mb-1 font-mono font-black uppercase">
                  프로필 아바타 이미지 URL
                </label>
                <input
                  type="text"
                  value={formData.avatarUrl}
                  onChange={(e) => handleTextChange('avatarUrl', e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-black font-mono font-bold outline-none focus:bg-[#FEF9C3] shadow-brutal-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Links Management */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              {/* Add New Link Card */}
              <div className="p-3.5 bg-[#FFFBEB] rounded-xl border-2 border-black shadow-brutal-xs space-y-2.5">
                <span className="font-mono font-black text-black block uppercase tracking-wide">
                  [ + 새 링크 추가하기 ]
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="링크 제목 (예: 블로그 보러가기)"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    className="bg-white border-2 border-black rounded-xl px-3 py-2 text-black font-mono font-bold outline-none focus:bg-[#FEF9C3]"
                  />
                  <input
                    type="text"
                    placeholder="연결 URL (https://...)"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="bg-white border-2 border-black rounded-xl px-3 py-2 text-black font-mono font-bold outline-none focus:bg-[#FEF9C3]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="부제목 (선택사항)"
                    value={newLinkSubtitle}
                    onChange={(e) => setNewLinkSubtitle(e.target.value)}
                    className="bg-white border-2 border-black rounded-xl px-3 py-2 text-black font-mono font-bold outline-none focus:bg-[#FEF9C3]"
                  />
                  <input
                    type="text"
                    placeholder="배지 라벨 (예: NEW, HOT)"
                    value={newLinkBadge}
                    onChange={(e) => setNewLinkBadge(e.target.value)}
                    className="bg-white border-2 border-black rounded-xl px-3 py-2 text-black font-mono font-bold outline-none focus:bg-[#FEF9C3]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="w-full py-2 bg-[#FEF08A] hover:bg-[#FDE047] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-black font-mono font-black border-2 border-black rounded-xl shadow-brutal-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-black" />
                  링크 목록에 추가
                </button>
              </div>

              {/* Existing Links List */}
              <div className="space-y-2">
                <span className="font-mono font-black text-black block uppercase">
                  등록된 링크 ({formData.links.length})
                </span>
                {formData.links.map((link) => (
                  <div
                    key={link.id}
                    className="p-3 bg-white rounded-xl border-2 border-black shadow-brutal-xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-black text-black truncate">{link.title}</span>
                        {link.featured && (
                          <span className="px-1.5 py-0.2 rounded bg-[#FEF08A] text-black font-mono font-black text-[10px] border border-black shadow-brutal-xs">
                            ★ 강조
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-zinc-600 truncate">{link.url}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(link.id)}
                        className={`px-2 py-1 rounded-lg border-2 border-black font-mono font-black text-[11px] transition-all ${
                          link.featured
                            ? 'bg-[#FEF08A] text-black shadow-brutal-xs'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                        title="강조 토글"
                      >
                        ⭐
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1 rounded-lg border-2 border-black bg-[#FCA5A5] hover:bg-[#F87171] text-black shadow-brutal-xs transition-all"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4 text-black" />
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
                    className={`p-3.5 rounded-xl border-2 border-black text-left transition-all relative overflow-hidden ${
                      item.background
                    } ${
                      isSelected
                        ? 'shadow-brutal ring-2 ring-black scale-[1.01]'
                        : 'shadow-brutal-xs hover:shadow-brutal opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-black text-black text-sm">{item.name}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded border-2 border-black bg-black flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="h-6 rounded bg-white border border-black flex items-center px-2 text-[10px] font-mono font-bold text-black shadow-brutal-xs">
                      NEO-BRUTAL PREVIEW
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-t-2 border-black bg-[#F4F4F5]">
          <button
            type="button"
            onClick={handleResetConfirm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-white hover:bg-[#FECDD3] text-black font-mono font-black text-xs shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-black" />
            <span>초기화</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border-2 border-black bg-white hover:bg-zinc-100 text-black font-mono font-bold text-xs shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl border-2 border-black bg-[#A3E635] hover:bg-[#86EFAC] text-black font-mono font-black text-xs shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
