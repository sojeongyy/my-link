'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  QrCode,
  ExternalLink,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
  handle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  profileName,
  handle,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://mylinke.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=ffffff&color=111827&margin=2`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = currentUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileName} (${handle}) 의 링크트리`,
          text: `${profileName}님의 프로필과 링크를 확인해보세요!`,
          url: currentUrl,
        });
      } catch {
        // user cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-700/80 p-6 text-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">프로필 공유하기</h3>
          <p className="text-xs text-zinc-400 mt-1">
            {profileName} ({handle}) 님의 링크를 친구들에게 공유하세요
          </p>
        </div>

        {/* Tabs: Link vs QR */}
        <div className="flex bg-zinc-800 rounded-xl p-1 mb-5">
          <button
            type="button"
            onClick={() => setShowQr(false)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              !showQr ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            링크 공유
          </button>
          <button
            type="button"
            onClick={() => setShowQr(true)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              showQr ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            QR 코드
          </button>
        </div>

        {/* QR Code Mode */}
        {showQr ? (
          <div className="flex flex-col items-center py-2">
            <div className="p-3 bg-white rounded-2xl shadow-inner mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="Profile QR Code"
                width={180}
                height={180}
                className="rounded-lg"
              />
            </div>
            <p className="text-[11px] text-zinc-400 text-center">
              스마트폰 카메라로 스캔하여 프로필에 바로 접속하세요
            </p>
          </div>
        ) : (
          /* Link Copy Mode */
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-2 bg-zinc-800/80 rounded-xl border border-zinc-700">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-transparent px-2 text-xs text-zinc-200 outline-none select-all truncate"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    복사됨!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    복사
                  </>
                )}
              </button>
            </div>

            {/* Quick Share Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded-xl text-xs font-medium transition-all"
              >
                <Share2 className="w-4 h-4 text-indigo-400" />
                기기 공유
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `${profileName}님의 링크트리 프로필을 확인해보세요! #mylinke`
                )}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded-xl text-xs font-medium transition-all text-white"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                X(Twitter) 공유
              </a>
            </div>
          </div>
        )}

        {/* Feedback Alert */}
        {copied && (
          <div className="mt-4 py-2 px-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs text-center font-medium animate-fadeIn">
            ✨ 링크가 클립보드에 복사되었습니다!
          </div>
        )}
      </div>
    </div>
  );
};
