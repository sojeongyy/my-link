'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, RotateCcw } from 'lucide-react';
import { GuestbookEntry } from '@/types/profile';

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
}

const DEFAULT_MESSAGES: GuestbookEntry[] = [
  {
    id: '1',
    author: 'KAIST 연구실 동료',
    message: '하드웨어 보안 프로젝트 연구 방향성 너무 멋집니다! 항상 응원해요 🔬',
    createdAt: '방금 전',
    emoji: '🔥',
  },
  {
    id: '2',
    author: '학부 동기',
    message: '마이링크 사이트 디자인이 애플처럼 엄청 깔끔하고 예쁘네요 ✨',
    createdAt: '2시간 전',
    emoji: '✨',
  },
  {
    id: '3',
    author: '방문 연구원',
    message: 'CyPhy 랩 인턴 활동 기대됩니다. 기회 되면 커피챗 나눠요! ☕',
    createdAt: '어제',
    emoji: '👏',
  },
];

export const GuestbookModal: React.FC<GuestbookModalProps> = ({
  isOpen,
  onClose,
  profileName,
}) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>(DEFAULT_MESSAGES);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💬');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('mylinke_guestbook_v3');
        if (saved) {
          try {
            setEntries(JSON.parse(saved));
          } catch {
            // ignore error
          }
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      author: author.trim(),
      message: message.trim(),
      createdAt: '방금 전',
      emoji: selectedEmoji,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mylinke_guestbook_v3', JSON.stringify(updated));
    }
    setAuthor('');
    setMessage('');
  };

  const handleClear = () => {
    if (confirm('방명록을 기본 예시 메시지로 초기화하시겠습니까?')) {
      setEntries(DEFAULT_MESSAGES);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mylinke_guestbook_v3', JSON.stringify(DEFAULT_MESSAGES));
      }
    }
  };

  const emojis = ['💬', '❤️', '🔥', '✨', '☕', '🎉', '👏', '🚀'];

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
              방명록
            </h3>
            <p className="text-[13px] text-[#86868b] mt-0.5">
              {profileName}님에게 따뜻한 응원의 한마디를 남겨주세요
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

        {/* Message Entries List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 no-scrollbar bg-[#f5f5f7]/50">
          {entries.length === 0 ? (
            <div className="text-center py-10 text-[#86868b] text-[14px]">
              아직 남겨진 메시지가 없습니다. 첫 메시지를 남겨보세요!
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-[20px] bg-white border border-black/[0.04] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:border-black/[0.08]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[17px]">{entry.emoji}</span>
                    <span className="text-[14px] font-semibold text-[#1d1d1f]">
                      {entry.author}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#86868b]">
                    {entry.createdAt}
                  </span>
                </div>
                <p className="text-[14px] text-[#424245] leading-relaxed break-keep pl-7">
                  {entry.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Write Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 border-t border-black/[0.06] bg-white space-y-3.5 flex-shrink-0"
        >
          {/* Emoji selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[12px] text-[#86868b] flex-shrink-0 mr-1">무드:</span>
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[15px] transition-all flex-shrink-0 ${
                  selectedEmoji === emoji
                    ? 'bg-[#0066cc]/10 ring-2 ring-[#0066cc] scale-105'
                    : 'bg-[#f5f5f7] hover:bg-[#e8e8ed]'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="작성자 닉네임"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={20}
              className="w-1/3 px-3.5 py-2.5 rounded-full bg-[#f5f5f7] border border-transparent focus:border-[#0066cc] focus:bg-white text-[13px] text-[#1d1d1f] outline-none transition-all placeholder:text-[#86868b]"
            />
            <input
              type="text"
              placeholder="응원의 메시지를 남겨보세요..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={120}
              className="flex-1 px-4 py-2.5 rounded-full bg-[#f5f5f7] border border-transparent focus:border-[#0066cc] focus:bg-white text-[13px] text-[#1d1d1f] outline-none transition-all placeholder:text-[#86868b]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 text-[12px] text-[#86868b] hover:text-[#1d1d1f] transition-colors"
              title="예시 메시지로 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              초기화
            </button>
            <button
              type="submit"
              disabled={!author.trim() || !message.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] disabled:opacity-40 disabled:hover:bg-[#0066cc] text-white text-[13px] font-medium transition-all apple-press"
            >
              <Send className="w-3.5 h-3.5" />
              작성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
