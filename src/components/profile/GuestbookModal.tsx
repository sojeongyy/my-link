'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white text-black border-[2.5px] border-black shadow-brutal-xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Retro Window Header */}
        <div className="bg-[#FF80B5] border-b-2 border-black px-3.5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black inline-block"></span>
          </div>
          <span className="font-mono text-[11px] font-black uppercase tracking-wider text-black">
            GUESTBOOK.LOG
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded border border-black bg-white flex items-center justify-center hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
            aria-label="닫기"
          >
            <X className="w-3.5 h-3.5 text-black" />
          </button>
        </div>

        {/* Modal Subheader */}
        <div className="px-4 pt-3 pb-2 border-b-2 border-black bg-[#FFFDE7]">
          <h3 className="text-base font-black tracking-tight uppercase">[ 💌 방명록 & 응원 보드 ]</h3>
          <p className="text-[11px] font-mono text-zinc-700">
            {profileName}님에게 한줄 응원 메시지를 남겨보세요!
          </p>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 no-scrollbar bg-[#FAFAFA]">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 font-mono text-xs font-bold">
              [ 아직 메시지가 없습니다. 첫 응원을 남겨보세요! ]
            </div>
          ) : (
            entries.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-white border-2 border-black shadow-brutal-xs flex items-start gap-2.5 text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-[#FEF08A] border-2 border-black flex items-center justify-center text-sm flex-shrink-0 shadow-brutal-xs">
                  {item.emoji || '💬'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-black truncate">{item.author}</span>
                    <span className="text-[10px] font-mono font-bold text-zinc-500 flex-shrink-0 ml-1">{item.createdAt}</span>
                  </div>
                  <p className="text-zinc-800 break-words leading-relaxed text-[11px] sm:text-xs font-medium">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 border-t-2 border-black bg-white space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-sm no-scrollbar">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center transition-all flex-shrink-0 ${
                  selectedEmoji === emoji
                    ? 'bg-[#A3E635] shadow-brutal-xs scale-105 font-bold'
                    : 'bg-zinc-100 hover:bg-[#FEF08A]'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="작성자 닉네임"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full sm:w-1/3 bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-mono font-bold text-black placeholder-zinc-400 outline-none focus:bg-[#FEF9C3] shadow-brutal-xs transition-colors"
              maxLength={15}
              required
            />
            <div className="flex-1 flex gap-2 w-full">
              <input
                type="text"
                placeholder="응원 메시지를 입력하세요..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-mono font-bold text-black placeholder-zinc-400 outline-none focus:bg-[#FEF9C3] shadow-brutal-xs transition-colors min-w-0"
                maxLength={80}
                required
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#A3E635] hover:bg-[#86EFAC] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-black border-2 border-black shadow-brutal-xs rounded-xl transition-all flex items-center justify-center flex-shrink-0 font-bold"
                aria-label="보내기"
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={handleClear}
              className="text-[10.5px] font-mono font-bold text-zinc-500 hover:text-black flex items-center gap-1"
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
