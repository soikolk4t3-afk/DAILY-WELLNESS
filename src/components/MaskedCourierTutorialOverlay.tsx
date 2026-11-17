import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronsRight,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
  X,
  XCircle,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';

interface MaskedCourierTutorialOverlayProps {
  sampleProductName?: string;
  orderCode?: string;
  onClose: () => void;
}

export const MaskedCourierTutorialOverlay: React.FC<
  MaskedCourierTutorialOverlayProps
> = ({ orderCode = 'DW-8822', onClose }) => {
  const { playSound } = useSoundFeedback();
  const [revealProgress, setRevealProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const lastStepBucketRef = useRef<number>(0);
  const unlockedRef = useRef<boolean>(false);

  const isRevealed = revealProgress >= 0.85;
  const pct = Math.round(revealProgress * 100);
  const displayCode = orderCode.replace(/^#/, '');

  const updateProgressFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const thumbWidth = 52;
    const usableWidth = Math.max(1, rect.width - thumbWidth);
    const raw = (clientX - rect.left - thumbWidth / 2) / usableWidth;
    const clamped = Math.max(0, Math.min(1, raw));

    setRevealProgress(clamped);

    const bucket = Math.floor(clamped * 5);
    if (bucket !== lastStepBucketRef.current) {
      lastStepBucketRef.current = bucket;
      playSound('slide');
    }

    if (clamped >= 0.9 && !unlockedRef.current) {
      unlockedRef.current = true;
      triggerHaptic('success');
      playSound('success');
    } else if (clamped < 0.25 && unlockedRef.current) {
      unlockedRef.current = false;
      triggerHaptic('toggle');
      playSound('toggle');
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    triggerHaptic('tap');
    updateProgressFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateProgressFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (revealProgress >= 0.85) {
      setRevealProgress(1);
    } else if (revealProgress <= 0.15) {
      setRevealProgress(0);
    }
  };

  const handleReset = () => {
    triggerHaptic('toggle');
    playSound('toggle');
    unlockedRef.current = false;
    lastStepBucketRef.current = 0;
    setRevealProgress(0);
  };

  return (
    <div
      className="absolute inset-0 z-50 bg-[#141413]/75 p-4 flex items-center justify-center animate-spring-pop"
      role="dialog"
      aria-modal="true"
      aria-label="So sánh tem hộp với sàn TMĐT"
    >
      <div className="w-full max-h-full bg-[#FDF6E9] border-[3px] border-[#141413] rounded-2xl shadow-[6px_6px_0_#141413] flex flex-col overflow-hidden min-w-0">
        {/* Top Zine Header */}
        <header className="shrink-0 bg-[#FFD166] border-b-[2.5px] border-[#141413] px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0F5C56] border-[2px] border-[#141413] flex items-center justify-center text-[#FFD166] shrink-0">
              <Truck className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#141413]/75 leading-none">
                SO SÁNH TEM VẬN CHUYỂN
              </p>
              <h2 className="font-display text-[14.5px] font-extrabold text-[#141413] leading-snug mt-0.5 break-words">
                Khác gì so với đặt trên Shopee/Lazada?
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap');
              playSound('click');
              onClose();
            }}
            aria-label="Đóng so sánh tem hộp"
            className="w-8 h-8 mr-0.5 rounded-lg bg-white border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center text-[#141413] cursor-pointer shrink-0 transition-all"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-4 space-y-3.5">
          <section
            aria-label="Kéo thanh trượt so sánh tem sàn TMĐT và tem HCMC Daily Wellness"
            className="rounded-xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-3.5 space-y-3"
          >
            {/* Thanh điều khiển trên thẻ so sánh */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-sans text-[12px] font-bold text-[#141413]/80">
                Kéo thanh trượt để đối chiếu
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0F5C56] tabular-nums">
                  {pct}%
                </span>
                {revealProgress > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Quay lại tem sàn TMĐT"
                    className="w-6 h-6 rounded border-[1.5px] border-[#141413] bg-[#FDF6E9] hover:bg-[#FFD166] flex items-center justify-center cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Thẻ so sánh 2 lớp */}
            <div className="relative grid rounded-xl border-[2.5px] border-[#141413] bg-[#141413] overflow-hidden">
              {/* Lớp dưới (Mặc định - Nền tối #141413): TEM SÀN TMĐT */}
              <div className="[grid-area:1/1] p-3.5 bg-[#141413] text-[#FDF6E9] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[12.5px] font-extrabold uppercase tracking-tight text-[#FFD166] flex items-center gap-1.5 whitespace-nowrap">
                    <AlertTriangle className="w-4 h-4 text-[#F26B50] shrink-0" />
                    <span>TEM SÀN TMĐT</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#F26B50] text-[#141413] font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                    DỄ LỘ
                  </span>
                </div>

                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#F26B50] shrink-0 mt-[3px]" />
                    <span className="font-sans text-[13px] font-medium leading-relaxed text-[#FDF6E9]/90">
                      In rõ <strong className="font-bold text-white">Tên thật &amp; SĐT</strong> ngay trên mặt hộp
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#F26B50] shrink-0 mt-[3px]" />
                    <span className="font-sans text-[13px] font-medium leading-relaxed text-[#FDF6E9]/90">
                      Shipper <strong className="font-bold text-white">gọi điện, đứng chờ</strong> ở cổng KTX
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#F26B50] shrink-0 mt-[3px]" />
                    <span className="font-sans text-[13px] font-medium leading-relaxed text-[#FDF6E9]/90">
                      Lưu lịch sử &amp; gợi ý lại trên tài khoản chính
                    </span>
                  </li>
                </ul>
              </div>

              {/* Lớp trên (Khi kéo mở - Nền xanh bạc hà #D8F3DC): TEM DAILY WELLNESS */}
              <div
                className="[grid-area:1/1] bg-[#D8F3DC] text-[#141413] p-3.5 space-y-2.5 transition-[clip-path] duration-75 ease-out pointer-events-none"
                style={{
                  clipPath: `inset(0 ${100 - pct}% 0 0)`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[12.5px] font-extrabold uppercase tracking-tight text-[#0F5C56] flex items-center gap-1.5 whitespace-nowrap">
                    <PackageCheck className="w-4 h-4 text-[#0F5C56] shrink-0" />
                    <span>TEM DAILY WELLNESS</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#0F5C56] text-[#FFD166] font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                    KÍN 100%
                  </span>
                </div>

                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F5C56] shrink-0 mt-[3px]" />
                    <span className="font-sans text-[13px] font-medium leading-relaxed text-[#141413]">
                      Chỉ in{' '}
                      <strong className="font-bold">
                        Mã{' '}
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                          #{displayCode}
                        </span>{' '}
                        &amp; Biệt danh
                      </strong>{' '}
                      (0 tên, 0 SĐT)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F5C56] shrink-0 mt-[3px]" />
                    <span className="font-sans text-[13px] font-medium leading-relaxed text-[#141413]">
                      <strong className="font-bold">Thả điểm hẹn &amp; chụp ảnh</strong>, không gọi điện
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F5C56] shrink-0 mt-[3px]" />
                    <span className="font-sans text-[13px] font-medium leading-relaxed text-[#141413]">
                      Hộp nâu trơn 2 lớp, không lưu dấu vết
                    </span>
                  </li>
                </ul>
              </div>

              {pct > 2 && pct < 98 && (
                <div
                  className="absolute top-0 bottom-0 w-[3px] bg-[#FFD166] shadow-[0_0_0_1px_#141413] pointer-events-none"
                  style={{ left: `${pct}%` }}
                />
              )}
            </div>

            {/* Thanh trượt tương tác */}
            <div
              ref={trackRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              role="slider"
              tabIndex={0}
              aria-label="Kéo thanh trượt để so sánh tem sàn TMĐT và tem Daily Wellness"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  const next = Math.min(1, revealProgress + 0.25);
                  setRevealProgress(next);
                  playSound(next >= 0.9 ? 'success' : 'slide');
                } else if (e.key === 'ArrowLeft') {
                  const next = Math.max(0, revealProgress - 0.25);
                  setRevealProgress(next);
                  playSound('slide');
                }
              }}
              className="relative h-12 rounded-xl bg-[#FDF6E9] border-[2.5px] border-[#141413] select-none touch-none cursor-grab active:cursor-grabbing overflow-hidden flex items-center"
            >
              <div
                className="absolute inset-y-0 left-0 bg-[#D8F3DC] pointer-events-none"
                style={{ width: `${pct}%` }}
              />

              <span
                className={`relative z-10 w-full font-sans text-[11.5px] font-bold whitespace-nowrap pointer-events-none ${
                  isRevealed
                    ? 'pr-14 pl-3 text-right text-[#0F5C56]'
                    : 'pl-14 pr-3 text-left text-[#141413]/85'
                }`}
              >
                {isRevealed
                  ? '✓ Đã mở tem kín · Kéo trái xem lại'
                  : 'Kéo sang phải xem tem kín →'}
              </span>

              <div
                className={`absolute top-1 bottom-1 w-11 rounded-lg border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] flex items-center justify-center pointer-events-none transition-colors ${
                  isRevealed
                    ? 'bg-[#0F5C56] text-[#FFD166]'
                    : 'bg-[#FFD166] text-[#141413]'
                }`}
                style={{
                  left: `calc(${revealProgress * 100}% - ${
                    revealProgress * 52
                  }px + 4px)`,
                }}
              >
                {isRevealed ? (
                  <PackageCheck className="w-4.5 h-4.5 stroke-[2.5]" />
                ) : (
                  <ChevronsRight className="w-5 h-5 stroke-[2.6]" />
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white border-[2px] border-[#141413] p-3.5 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-[#FFD166] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p className="font-sans text-[13px] font-medium text-[#141413] leading-relaxed">
                <strong className="font-bold">Không tên thật &amp; SĐT:</strong>{' '}
                Tem chỉ in mã đơn{' '}
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                  #{displayCode}
                </span>{' '}
                và biệt danh nhận hàng.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p className="font-sans text-[13px] font-medium text-[#141413] leading-relaxed flex-1">
                <strong className="font-bold">Không gọi điện làm phiền:</strong>{' '}
                Tài xế thả đúng điểm hẹn, chụp ảnh xác nhận qua app và rời đi.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-[#F26B50]/60 border-[1.5px] border-[#141413] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <p className="font-sans text-[13px] font-medium text-[#141413] leading-relaxed">
                <strong className="font-bold">Hộp nâu trơn 2 lớp:</strong>{' '}
                Xuất kho trực tiếp từ nhà thuốc gần bạn trong 30 phút, không logo.
              </p>
            </div>
          </section>
        </div>

        <footer className="shrink-0 bg-[#FDF6E9] border-t-[2.5px] border-[#141413] p-3.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('success');
              playSound('success');
              onClose();
            }}
            className="w-full min-h-[44px] px-4 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#FFD166] shrink-0" />
            <span>Đã hiểu • Đóng so sánh</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
