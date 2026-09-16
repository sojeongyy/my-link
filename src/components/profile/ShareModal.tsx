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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white text-black border-[2.5px] border-black shadow-brutal-xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Retro Window Header */}
        <div className="bg-[#FEF08A] border-b-2 border-black px-3.5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black inline-block"></span>
          </div>
          <span className="font-mono text-[11px] font-black uppercase tracking-wider">
            SHARE_MODAL.EXE
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded border border-black bg-white flex items-center justify-center hover:bg-[#FF80B5] active:translate-x-0.5 active:translate-y-0.5"
            aria-label="닫기"
          >
            <X className="w-3.5 h-3.5 text-black" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5">
          {/* Modal Title */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-black tracking-tight uppercase">프로필 공유하기</h3>
            <p className="text-xs font-mono text-zinc-600 mt-0.5">
              {profileName} ({handle})
            </p>
          </div>

          {/* Tabs: Link vs QR */}
          <div className="flex bg-[#F4F4F5] border-2 border-black rounded-xl p-1 mb-4">
            <button
              type="button"
              onClick={() => setShowQr(false)}
              className={`flex-1 py-1.5 text-xs font-mono font-black rounded-lg transition-all ${
                !showQr ? 'bg-black text-white shadow-brutal-xs' : 'text-black hover:bg-zinc-200'
              }`}
            >
              링크 복사
            </button>
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className={`flex-1 py-1.5 text-xs font-mono font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                showQr ? 'bg-black text-white shadow-brutal-xs' : 'text-black hover:bg-zinc-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              QR 코드
            </button>
          </div>

          {/* QR Code Mode */}
          {showQr ? (
            <div className="flex flex-col items-center py-2">
              <div className="p-3 bg-white border-2 border-black rounded-xl shadow-brutal-sm mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="Profile QR Code"
                  width={170}
                  height={170}
                  className="rounded"
                />
              </div>
              <p className="text-[11px] font-mono font-bold text-zinc-700 text-center">
                카메라로 스캔하여 프로필에 바로 접속하세요!
              </p>
            </div>
          ) : (
            /* Link Copy Mode */
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 p-1.5 bg-[#FFFBEB] rounded-xl border-2 border-black shadow-brutal-xs">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 bg-transparent px-2 text-xs font-mono font-bold text-black outline-none select-all truncate"
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#A3E635] hover:bg-[#86EFAC] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-black text-xs font-mono font-black border border-black shadow-brutal-xs rounded-lg transition-all flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      복사됨!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-black" />
                      복사
                    </>
                  )}
                </button>
              </div>

              {/* Quick Share Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none border-2 border-black rounded-xl text-xs font-mono font-black text-black shadow-brutal-xs transition-all"
                >
                  <Share2 className="w-3.5 h-3.5 text-black" />
                  기기 공유
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `${profileName}님의 링크트리 프로필을 확인해보세요! #mylinke`
                  )}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#67E8F9] hover:bg-[#A5F3FC] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none border-2 border-black rounded-xl text-xs font-mono font-black text-black shadow-brutal-xs transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-black" />
                  X 공유
                </a>
              </div>
            </div>
          )}

          {/* Feedback Alert */}
          {copied && (
            <div className="mt-3 py-1.5 px-3 bg-[#A3E635] border-2 border-black rounded-xl text-black text-xs font-mono font-black text-center shadow-brutal-xs animate-fadeIn">
              ★ 클립보드에 복사 완료! ★
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
