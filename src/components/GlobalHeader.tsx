import React from 'react';
import {
  ShieldCheck,
  EyeOff,
  ShoppingBag,
  Volume2,
  VolumeX,
  HelpCircle,
} from 'lucide-react';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import { triggerHaptic } from '../utils/haptics';

interface GlobalHeaderProps {
  cartCount: number;
  onPanicHide: () => void;
  onOpenCart: () => void;
  onOpenTutorial: () => void;
  showCartButton?: boolean;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  cartCount,
  onPanicHide,
  onOpenCart,
  onOpenTutorial,
  showCartButton = true,
}) => {
  const { soundEnabled, toggleSound } = useSoundFeedback();

  return (
    <header className="relative z-20 shrink-0 bg-[#FDF6E9] border-b-[2.5px] border-[#141413] px-3 py-2.5 flex items-center justify-between gap-1.5 min-w-0">
      {/* Trái: Biểu tượng khiên + Daily Wellness */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-[30px] h-[30px] rounded-lg bg-[#0F5C56] border-[2px] border-[#141413] flex items-center justify-center text-[#FFD166] shrink-0">
          <ShieldCheck className="w-4 h-4 stroke-[2.4]" aria-hidden="true" />
        </div>
        <p className="font-display text-[14px] font-extrabold tracking-tight text-[#141413] leading-none whitespace-nowrap">
          Daily Wellness
        </p>
      </div>

      {/* Phải: Nút Hướng dẫn (?) + Âm thanh + Túi hàng + ẨN NHANH */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          data-tutorial-target="tutorial-help-btn"
          onClick={() => {
            triggerHaptic('tap');
            onOpenTutorial();
          }}
          aria-label="Xem lại hướng dẫn sử dụng"
          title="Xem lại hướng dẫn sử dụng"
          className="min-w-[34px] min-h-[36px] rounded-xl border-[2.5px] border-[#141413] bg-white hover:bg-[#FFD166] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] flex items-center justify-center transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 stroke-[2.4]" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('toggle');
            toggleSound();
          }}
          aria-label={soundEnabled ? 'Tắt âm thanh thao tác' : 'Bật âm thanh thao tác'}
          title={soundEnabled ? 'Âm thanh: Đang bật' : 'Âm thanh: Đang tắt (Im lặng)'}
          className={`min-w-[34px] min-h-[36px] rounded-xl border-[2.5px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-[#95D5B2] text-[#141413]'
              : 'bg-white text-[#141413]/70 hover:text-[#141413]'
          }`}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 stroke-[2.4]" />
          ) : (
            <VolumeX className="w-4 h-4 stroke-[2.4]" />
          )}
        </button>

        {showCartButton && (
          <button
            type="button"
            data-tutorial-target="header-cart-btn"
            onClick={() => {
              triggerHaptic('tap');
              onOpenCart();
            }}
            aria-label={`Mở túi hàng (${cartCount} sản phẩm)`}
            className="relative min-w-[36px] min-h-[36px] rounded-xl border-[2.5px] border-[#141413] bg-white shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] flex items-center justify-center transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.4]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[19px] h-[19px] px-1 rounded-full bg-[#FFD166] border-[2px] border-[#141413] text-[#141413] font-mono text-[10px] font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        )}

        <button
          type="button"
          data-tutorial-target="panic-hide-btn"
          onClick={onPanicHide}
          className="min-h-[36px] px-2 rounded-xl bg-[#F26B50] hover:bg-[#EA5B3F] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none text-[#141413] font-mono text-[10.5px] font-bold uppercase tracking-tight flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0"
          title="Chuyển ngay sang màn hình ngụy trang Daily Water"
        >
          <EyeOff className="w-3.5 h-3.5 stroke-[2.5] shrink-0" aria-hidden="true" />
          <span>ẨN NHANH</span>
        </button>
      </div>
    </header>
  );
};
