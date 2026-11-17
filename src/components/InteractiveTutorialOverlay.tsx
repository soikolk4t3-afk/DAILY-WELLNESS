import React, { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Check, Sparkles, X } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';

interface TutorialStepSpec {
  target: string;
  badge: string;
  title: string;
  description: string;
  checklist?: string[];
  allowTargetClick?: boolean;
}

const TUTORIAL_STEPS: TutorialStepSpec[] = [
  {
    target: 'panic-hide-btn',
    badge: 'BƯỚC 1/5 • LÁ CHẮN THOÁT HIỂM',
    title: 'Có người đi ngang? Bấm ẨN NHANH!',
    description:
      'Màn hình lập tức biến thành app theo dõi uống nước. Hãy bấm thử nút ẨN NHANH ngay trên góc phải để trải nghiệm!',
    allowTargetClick: true,
  },
  {
    target: 'quiz-banner',
    badge: 'BƯỚC 2/5 • CHỌN CHUẨN KHÔNG NGẠI',
    title: 'Lọc size 49–55mm trong 30 giây',
    description:
      'Chưa biết kích cỡ hay dị ứng cao su? Trả lời 3 câu hỏi ngắn, lọc trực tiếp trên máy và không lưu lịch sử.',
  },
  {
    target: 'first-product-card',
    badge: 'BƯỚC 3/5 • CÁCH MUA HÀNG',
    title: 'Chọn sản phẩm & Thêm vào túi kín',
    description:
      'Chạm vào thẻ sản phẩm để xem thông số (size, độ mỏng, mã lô Bộ Y tế), hoặc bấm nút "+ Thêm" bên phải để bỏ nhanh vào túi.',
    checklist: [
      'Chạm thẻ để kiểm tra tem lô & thành phần',
      'Bấm + / - hoặc icon thùng rác để sửa/xóa món bất kỳ lúc nào',
    ],
  },
  {
    target: 'header-cart-btn',
    badge: 'BƯỚC 4/5 • CÁCH THANH TOÁN & NHẬN HÀNG',
    title: 'Mở Túi hàng • Chọn 1 trong 2 cách nhận',
    description:
      'Bấm icon Túi hàng (hoặc thanh Túi ở đáy màn hình) để chọn phương thức nhận hàng & thanh toán kín đáo:',
    checklist: [
      'Tủ tự động 24/7 (0đ): Chọn tủ trên bản đồ 8 quận TP.HCM — nhận ngay mã QR & OTP để tự mở tủ, không qua shipper',
      'Giao thả 30p (18k): Tài xế thả đúng điểm hẹn theo biệt danh, chụp ảnh xác nhận qua app, không gọi điện & không lộ tên/SĐT',
      'Ví ẩn tên: Thanh toán Momo / ZaloPay / VietQR (sao kê chỉ ghi HCMC DAILY WELLNESS)',
    ],
  },
  {
    target: 'tutorial-help-btn',
    badge: 'BƯỚC 5/5 • SẴN SÀNG',
    title: 'Quên cách dùng? Bấm vào đây',
    description:
      'Mở lại hướng dẫn này bất cứ lúc nào. Sau khi nhận hàng xong, bạn cũng có thể bấm "Xóa sạch toàn bộ dữ liệu" để xóa trắng mọi thông tin.',
  },
];

export const TUTORIAL_STEP_COUNT = TUTORIAL_STEPS.length;

interface CutoutRect {
  left: number;
  top: number;
  width: number;
  height: number;
  containerW: number;
  containerH: number;
}

interface InteractiveTutorialOverlayProps {
  stepIndex: number;
  panicDecoyActive: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onNextStep: () => void;
  onExitPanicAndNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export const InteractiveTutorialOverlay: React.FC<
  InteractiveTutorialOverlayProps
> = ({
  stepIndex,
  panicDecoyActive,
  containerRef,
  onNextStep,
  onExitPanicAndNext,
  onSkip,
  onComplete,
}) => {
  const { playSound } = useSoundFeedback();
  const [cutout, setCutout] = useState<CutoutRect | null>(null);

  const safeStepIndex = Math.max(
    0,
    Math.min(TUTORIAL_STEPS.length - 1, stepIndex)
  );
  const currentStep = TUTORIAL_STEPS[safeStepIndex];
  const isLastStep = safeStepIndex === TUTORIAL_STEPS.length - 1;
  const isInteractivePanicTry = safeStepIndex === 0 && panicDecoyActive;

  const measureTarget = useCallback(() => {
    if (isInteractivePanicTry) {
      setCutout(null);
      return;
    }

    const containerEl = containerRef.current;
    if (!containerEl) {
      setCutout(null);
      return;
    }

    const targetEl = containerEl.querySelector<HTMLElement>(
      `[data-tutorial-target="${currentStep.target}"]`
    );
    if (!targetEl) {
      setCutout(null);
      return;
    }

    const containerRect = containerEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const originLeft = containerRect.left + containerEl.clientLeft;
    const originTop = containerRect.top + containerEl.clientTop;
    const containerW = containerEl.clientWidth;
    const containerH = containerEl.clientHeight;

    const pad = 4;
    const left = Math.max(2, targetRect.left - originLeft - pad);
    const top = Math.max(2, targetRect.top - originTop - pad);
    const right = Math.min(containerW - 2, targetRect.right - originLeft + pad);
    const bottom = Math.min(
      containerH - 2,
      targetRect.bottom - originTop + pad
    );

    setCutout({
      left,
      top,
      width: Math.max(20, right - left),
      height: Math.max(20, bottom - top),
      containerW,
      containerH,
    });
  }, [containerRef, currentStep.target, isInteractivePanicTry]);

  useEffect(() => {
    if (isInteractivePanicTry) {
      setCutout(null);
      return;
    }

    const containerEl = containerRef.current;
    const targetEl = containerEl?.querySelector<HTMLElement>(
      `[data-tutorial-target="${currentStep.target}"]`
    );

    if (targetEl && containerEl) {
      const cRect = containerEl.getBoundingClientRect();
      const tRect = targetEl.getBoundingClientRect();
      if (tRect.top < cRect.top + 56 || tRect.bottom > cRect.bottom - 16) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    const rafId = window.requestAnimationFrame(measureTarget);
    const settleTimerId = window.setTimeout(measureTarget, 220);

    const handleResizeOrScroll = () => {
      measureTarget();
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerEl) {
      resizeObserver = new ResizeObserver(measureTarget);
      resizeObserver.observe(containerEl);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimerId);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [containerRef, currentStep.target, isInteractivePanicTry, measureTarget]);

  if (isInteractivePanicTry) {
    return (
      <div
        className="absolute inset-x-3 top-14 z-50 pointer-events-auto animate-spring-pop"
        role="dialog"
        aria-modal="false"
        aria-label="Hướng dẫn tương tác Bước 1"
      >
        <div className="rounded-2xl bg-[#FDF6E9] border-[3px] border-[#141413] shadow-[4px_4px_0_#141413] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold text-[#141413]">
              <Sparkles className="w-3 h-3 text-[#0F5C56] shrink-0" />
              <span>ĐÃ KÍCH HOẠT NGỤY TRANG</span>
            </span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap');
                playSound('click');
                onSkip();
              }}
              aria-label="Bỏ qua hướng dẫn"
              className="w-7 h-7 rounded-lg bg-white hover:bg-[#F26B50] border-[1.5px] border-[#141413] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <p className="text-[12.5px] font-semibold text-[#141413] leading-snug break-words">
            Đỉnh chưa! Người đứng cạnh chỉ thấy app Daily Water. Bấm{' '}
            <strong className="text-[#0F5C56]">&apos;Quay lại &amp; Tiếp tục&apos;</strong>{' '}
            để xem bước tiếp theo.
          </p>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('success');
                playSound('transition');
                onExitPanicAndNext();
              }}
              className="min-h-[38px] px-3.5 rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] border-[2px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display text-[12.5px] font-extrabold text-[#141413] inline-flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>Quay lại &amp; Tiếp tục</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  let cardStyle: React.CSSProperties;
  if (cutout) {
    const targetCenterY = cutout.top + cutout.height / 2;
    const isTopHalf = targetCenterY <= cutout.containerH / 2;
    if (isTopHalf) {
      const topPos = Math.min(
        cutout.containerH - 180,
        cutout.top + cutout.height + 12
      );
      cardStyle = {
        top: `${topPos}px`,
        maxHeight: `${Math.max(150, cutout.containerH - topPos - 12)}px`,
      };
    } else {
      const bottomPos = Math.min(
        cutout.containerH - 180,
        cutout.containerH - cutout.top + 12
      );
      cardStyle = {
        bottom: `${bottomPos}px`,
        maxHeight: `${Math.max(150, cutout.top - 24)}px`,
      };
    }
  } else {
    cardStyle = {
      top: '50%',
      transform: 'translateY(-50%)',
      maxHeight: '80%',
    };
  }

  return (
    <div
      className="absolute inset-0 z-50 pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label={`Hướng dẫn sử dụng ${currentStep.badge}`}
    >
      {cutout ? (
        <>
          <div
            className="absolute left-0 right-0 top-0 bg-[#141413]/75 pointer-events-auto transition-all duration-200"
            style={{ height: `${cutout.top}px` }}
          />
          <div
            className="absolute left-0 right-0 bottom-0 bg-[#141413]/75 pointer-events-auto transition-all duration-200"
            style={{ top: `${cutout.top + cutout.height}px` }}
          />
          <div
            className="absolute left-0 bg-[#141413]/75 pointer-events-auto transition-all duration-200"
            style={{
              top: `${cutout.top}px`,
              height: `${cutout.height}px`,
              width: `${cutout.left}px`,
            }}
          />
          <div
            className="absolute right-0 bg-[#141413]/75 pointer-events-auto transition-all duration-200"
            style={{
              top: `${cutout.top}px`,
              height: `${cutout.height}px`,
              left: `${cutout.left + cutout.width}px`,
            }}
          />

          {!currentStep.allowTargetClick && (
            <div
              className="absolute pointer-events-auto"
              style={{
                left: `${cutout.left}px`,
                top: `${cutout.top}px`,
                width: `${cutout.width}px`,
                height: `${cutout.height}px`,
              }}
            />
          )}

          <div
            aria-hidden="true"
            className="absolute rounded-xl border-[3px] border-[#FFD166] animate-spotlight-pulse pointer-events-none transition-all duration-200"
            style={{
              left: `${cutout.left}px`,
              top: `${cutout.top}px`,
              width: `${cutout.width}px`,
              height: `${cutout.height}px`,
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-[#141413]/75 pointer-events-auto" />
      )}

      <div
        key={currentStep.target}
        style={cardStyle}
        className="absolute left-3 right-3 z-10 pointer-events-auto animate-spring-pop rounded-2xl bg-[#FDF6E9] border-[3px] border-[#141413] shadow-[4px_4px_0_#141413] p-4 overflow-y-auto no-scrollbar space-y-2.5"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="inline-block px-2 py-0.5 rounded-md bg-[#FFD166] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold text-[#141413]">
            {currentStep.badge}
          </span>

          <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
            {TUTORIAL_STEPS.map((s, idx) => (
              <span
                key={s.target}
                className={`h-2 rounded-full border border-[#141413] transition-all ${
                  idx === safeStepIndex
                    ? 'w-4 bg-[#0F5C56]'
                    : idx < safeStepIndex
                      ? 'w-2 bg-[#95D5B2]'
                      : 'w-2 bg-white'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-display text-[16.5px] font-extrabold text-[#141413] leading-snug break-words">
            {currentStep.title}
          </h2>
          <p className="text-[12.5px] font-medium text-[#141413]/85 leading-relaxed break-words">
            {currentStep.description}
          </p>

          {currentStep.checklist && currentStep.checklist.length > 0 && (
            <div className="rounded-xl bg-white border-[2px] border-[#141413] p-2.5 space-y-1.5">
              {currentStep.checklist.map((item, idx) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-[11.5px] font-semibold text-[#141413] leading-snug break-words"
                >
                  <span className="w-4 h-4 rounded bg-[#95D5B2] border border-[#141413] font-mono text-[9.5px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-1 flex items-center justify-between gap-2">
          {!isLastStep ? (
            <>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap');
                  playSound('click');
                  onSkip();
                }}
                className="min-h-[38px] px-3 rounded-xl bg-white hover:bg-[#F26B50]/20 border-[2px] border-[#141413] font-mono text-[11px] font-bold text-[#141413] cursor-pointer transition-colors"
              >
                Bỏ qua
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('toggle');
                  playSound('transition');
                  onNextStep();
                }}
                className="min-h-[38px] px-4 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-[2px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display text-[13px] font-bold text-[#FDF6E9] inline-flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span>Tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('success');
                playSound('success');
                onComplete();
              }}
              className="w-full min-h-[42px] px-4 rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display text-[13.5px] font-extrabold text-[#141413] inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <span>Bắt đầu mua sắm</span>
              <Check className="w-4 h-4 stroke-[2.8]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
