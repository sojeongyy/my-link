'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Link as LinkIcon,
  User,
} from 'lucide-react';
import { ProfileData, LinkItem } from '@/types/profile';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'links'>('profile');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkSubtitle, setNewLinkSubtitle] = useState('');
  const [newLinkBadge, setNewLinkBadge] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
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
    };

    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, newLink],
    }));

    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkSubtitle('');
    setNewLinkBadge('');
  };

  const handleRemoveLink = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-[28px] bg-white text-[#1d1d1f] border border-black/[0.08] apple-modal-shadow overflow-hidden flex flex-col max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-black/[0.06] flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
              프로필 편집
            </h3>
            <p className="text-[13px] text-[#86868b] mt-0.5">
              내용을 변경하고 저장하면 실시간으로 반영됩니다
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] flex items-center justify-center transition-colors apple-press"
            aria-label="닫기"
          >
            <X className="w-4 h-4 text-[#86868b]" />
          </button>
        </div>

        {/* Segmented Control */}
        <div className="px-6 pt-4 pb-2 flex-shrink-0">
          <div className="flex bg-[#f5f5f7] p-1 rounded-full">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-1.5 text-[13px] font-medium rounded-full transition-all flex items-center justify-center gap-1.5 apple-press ${
                activeTab === 'profile'
                  ? 'bg-white text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              기본 정보
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('links')}
              className={`flex-1 py-1.5 text-[13px] font-medium rounded-full transition-all flex items-center justify-center gap-1.5 apple-press ${
                activeTab === 'links'
                  ? 'bg-white text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              링크 목록 ({formData.links.length})
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">
                  이름 (표시명)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:border-[#0066cc] focus:bg-white text-[14px] text-[#1d1d1f] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">
                  핸들 (@아이디)
                </label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:border-[#0066cc] focus:bg-white text-[14px] text-[#1d1d1f] outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">
                  상태 배지
                </label>
                <input
                  type="text"
                  value={formData.statusBadge ?? ''}
                  onChange={(e) => setFormData({ ...formData, statusBadge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:border-[#0066cc] focus:bg-white text-[14px] text-[#1d1d1f] outline-none transition-all"
                  placeholder="예: 🔬 KAIST cyphy 랩 인턴 중"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">
                  소개글 (Bio)
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:border-[#0066cc] focus:bg-white text-[14px] text-[#1d1d1f] outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">
                  위치
                </label>
                <input
                  type="text"
                  value={formData.location ?? ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:border-[#0066cc] focus:bg-white text-[14px] text-[#1d1d1f] outline-none transition-all"
                  placeholder="예: Daejeon, Korea 🇰🇷"
                />
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Add New Link Card */}
              <div className="p-4 rounded-[20px] bg-[#f5f5f7] border border-black/[0.04] space-y-3">
                <h4 className="text-[13px] font-semibold text-[#1d1d1f]">새 링크 추가</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="링크 제목 *"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-transparent focus:border-[#0066cc] text-[13px] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="배지 (선택, 예: New)"
                    value={newLinkBadge}
                    onChange={(e) => setNewLinkBadge(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-transparent focus:border-[#0066cc] text-[13px] outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="URL 주소 (https://...) *"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-transparent focus:border-[#0066cc] text-[13px] outline-none font-mono"
                />
                <input
                  type="text"
                  placeholder="보조 설명 (선택)"
                  value={newLinkSubtitle}
                  onChange={(e) => setNewLinkSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-transparent focus:border-[#0066cc] text-[13px] outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                  className="w-full py-2 bg-[#0066cc] hover:bg-[#0071e3] disabled:opacity-40 text-white rounded-xl text-[13px] font-medium transition-all apple-press flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  링크 목록에 추가
                </button>
              </div>

              {/* Current Link List */}
              <div className="space-y-2">
                <h4 className="text-[12px] font-medium text-[#86868b]">현재 등록된 링크</h4>
                {formData.links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-sm"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[14px] text-[#1d1d1f] truncate">
                          {link.title}
                        </span>
                        {link.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#0066cc]/10 text-[#0066cc] font-medium">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#86868b] truncate mt-0.5 font-mono">
                        {link.url}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link.id)}
                      className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-red-50 hover:text-red-600 text-[#86868b] flex items-center justify-center transition-colors flex-shrink-0"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-black/[0.06] bg-[#fafafc] flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              if (confirm('기본 프로필로 초기화하시겠습니까?')) {
                onReset();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-[13px] text-[#86868b] hover:text-[#1d1d1f] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            기본값 초기화
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[13px] font-medium text-[#1d1d1f] transition-all apple-press"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-[13px] font-medium transition-all apple-press flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
