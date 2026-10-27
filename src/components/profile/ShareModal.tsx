'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, QrCode, ExternalLink } from 'lucide-react';

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

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://my-link.vercel.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=ffffff&color=1d1d1f&margin=2`;

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
          title: `${profileName} (${handle})`,
          text: `${profileName}님의 마이링크 프로필을 확인해보세요.`,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[28px] bg-white text-[#1d1d1f] border border-black/[0.08] apple-modal-shadow overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <div>
            <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
              프로필 공유
            </h3>
            <p className="text-[13px] text-[#86868b] mt-0.5">
              {profileName} · {handle}
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

        {/* Modal Content */}
        <div className="p-6 pt-4">
          {/* Segmented Control */}
          <div className="flex bg-[#f5f5f7] p-1 rounded-full mb-5">
            <button
              type="button"
              onClick={() => setShowQr(false)}
              className={`flex-1 py-1.5 text-[13px] font-medium rounded-full transition-all apple-press ${
                !showQr
                  ? 'bg-white text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              링크 복사
            </button>
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className={`flex-1 py-1.5 text-[13px] font-medium rounded-full transition-all flex items-center justify-center gap-1.5 apple-press ${
                showQr
                  ? 'bg-white text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              QR 코드
            </button>
          </div>

          {/* QR Code Mode */}
          {showQr ? (
            <div className="flex flex-col items-center py-2 animate-fadeIn">
              <div className="p-4 bg-white border border-black/[0.06] rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="Profile QR Code"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              </div>
              <p className="text-[12px] text-[#86868b] text-center">
                카메라로 스캔하면 바로 연결됩니다
              </p>
            </div>
          ) : (
            /* Link Copy Mode */
            <div className="space-y-3.5 animate-fadeIn">
              <div className="flex items-center gap-2 p-1.5 pl-3.5 bg-[#f5f5f7] rounded-full border border-black/[0.04]">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 bg-transparent text-[13px] text-[#1d1d1f] outline-none select-all truncate font-mono"
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-4 py-2 bg-[#0066cc] hover:bg-[#0071e3] text-white text-[13px] font-medium rounded-full transition-all apple-press flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      복사
                    </>
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-full text-[13px] font-medium text-[#1d1d1f] transition-all apple-press"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#0066cc]" />
                  기기 공유
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `${profileName}님의 마이링크 프로필`
                  )}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-full text-[13px] font-medium text-[#1d1d1f] transition-all apple-press"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#0066cc]" />
                  X에 공유
                </a>
              </div>
            </div>
          )}

          {/* Feedback message */}
          {copied && (
            <div className="mt-3.5 py-2 px-3 bg-[#0066cc]/10 rounded-full text-[#0066cc] text-[12px] font-medium text-center animate-fadeIn">
              클립보드에 링크가 복사되었습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
