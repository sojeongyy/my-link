'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquareHeart, Trash2 } from 'lucide-react';
import { GuestbookEntry } from '@/types/profile';

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
}

const DEFAULT_MESSAGES: GuestbookEntry[] = [
  {
    id: '1',
    author: 'Tech Lead 준호',
    message: 'TaskFlow AI 프로젝트 코드 구조가 굉장히 깔끔하네요! 응원합니다 🚀',
    createdAt: '방금 전',
    emoji: '🔥',
  },
  {
    id: '2',
    author: 'Frontend 수연',
    message: 'Next.js 렌더링 최적화 블로그 글 보고 많은 인사이트 얻고 갑니다! ☕',
    createdAt: '2시간 전',
    emoji: '✨',
  },
  {
    id: '3',
    author: 'Dev Minwoo',
    message: '실시간 캔버스 데모 반응속도 엄청 빠르네요! 커피챗도 신청드렸습니다 👍',
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
        const saved = localStorage.getItem('mylinke_guestbook_v2');
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
      localStorage.setItem('mylinke_guestbook_v2', JSON.stringify(updated));
    }
    setAuthor('');
    setMessage('');
  };

  const handleClear = () => {
    if (confirm('방명록을 초기화하시겠습니까?')) {
      setEntries(DEFAULT_MESSAGES);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mylinke_guestbook_v2', JSON.stringify(DEFAULT_MESSAGES));
      }
    }
  };

  const emojis = ['💬', '❤️', '🔥', '✨', '☕', '🎉', '👏', '🚀'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-700/80 p-6 text-white shadow-2xl transition-all max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">한줄 방명록</h3>
              <p className="text-xs text-zinc-400">
                {profileName}님에게 응원의 메시지를 남겨보세요!
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

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              첫 번째 방명록 메시지를 남겨보세요!
            </div>
          ) : (
            entries.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-zinc-800/70 border border-zinc-700/50 flex items-start gap-3 text-xs"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-base flex-shrink-0">
                  {item.emoji || '💬'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-zinc-200">{item.author}</span>
                    <span className="text-[10px] text-zinc-500">{item.createdAt}</span>
                  </div>
                  <p className="text-zinc-300 break-words leading-relaxed">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-zinc-800 space-y-2.5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  selectedEmoji === emoji
                    ? 'bg-indigo-600 scale-110 shadow'
                    : 'bg-zinc-800 hover:bg-zinc-700'
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
              className="w-1/3 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-indigo-500 transition-colors"
              maxLength={15}
              required
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="응원 메시지를 입력하세요..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-indigo-500 transition-colors"
                maxLength={80}
                required
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl transition-all flex items-center justify-center"
                aria-label="보내기"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-zinc-500 hover:text-zinc-400 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              목록 초기화
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
