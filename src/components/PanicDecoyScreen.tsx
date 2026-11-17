import React, { useState } from 'react';
import { Droplets, Plus, RotateCcw, Check, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';

interface PanicDecoyScreenProps {
  onReturnToStore: () => void;
}

export const PanicDecoyScreen: React.FC<PanicDecoyScreenProps> = ({
  onReturnToStore,
}) => {
  const { playSound } = useSoundFeedback();
  const [intakeMl, setIntakeMl] = useState<number>(1250);

  const dailyGoal = 2000;
  const pct = Math.min(100, Math.round((intakeMl / dailyGoal) * 100));

  const logs = [
    { time: '08:15', amount: '250ml', label: 'Ly nước buổi sáng' },
    { time: '10:40', amount: '500ml', label: 'Bình mang đi học' },
    { time: '13:20', amount: '500ml', label: 'Uống sau bữa trưa' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9] text-[#141413]">
      {/* Header ngụy trang Daily Water */}
      <header className="shrink-0 px-4 py-3 flex items-center justify-between border-b-[2.5px] border-[#141413] bg-[#95D5B2]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white border-[2.5px] border-[#141413] text-[#0F5C56] flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5 stroke-[2.4]" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-[16px] font-extrabold uppercase tracking-tight leading-none">
              Daily Water
            </h1>
            <p className="font-mono text-[10.5px] font-semibold text-[#141413]/80 mt-0.5">
              THEO DÕI UỐNG NƯỚC
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('tap');
            playSound('click');
            setIntakeMl(1250);
          }}
          className="min-w-[38px] min-h-[38px] rounded-xl bg-white border-[2.5px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center cursor-pointer shrink-0 transition-all"
          aria-label="Đặt lại lượng nước"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.4]" />
        </button>
      </header>

      {/* Main scrollable body */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-4 space-y-3.5">
        <div className="bg-white rounded-2xl border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-5 flex flex-col items-center text-center">
          <span className="px-2.5 py-0.5 rounded-md bg-[#FFD166] border-[2px] border-[#141413] font-mono text-[11px] font-bold uppercase mb-3">
            Mục tiêu hôm nay
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#E5E5E5"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#0F5C56"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - pct / 100)}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-bold text-[#141413] tabular-nums">
                {intakeMl.toLocaleString('en-US')}ml
              </span>
              <span className="font-mono text-[11px] font-semibold text-[#141413]/70 tabular-nums">
                / 2,000ml
              </span>
            </div>
          </div>

          <p className="text-[12.5px] font-medium text-[#141413]/80 mb-4 break-words">
            {intakeMl >= dailyGoal
              ? 'Đủ 2 lít rồi nha, uống nước đều đặn!'
              : `Còn thiếu ${(dailyGoal - intakeMl).toLocaleString('en-US')}ml nữa là đạt mục tiêu hôm nay`}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap');
                playSound('click');
                setIntakeMl((prev) => Math.min(3500, prev + 250));
              }}
              className="min-h-[44px] rounded-xl bg-[#0F5C56] text-white border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none font-mono text-[12px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>+250ml</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap');
                playSound('click');
                setIntakeMl((prev) => Math.min(3500, prev + 500));
              }}
              className="min-h-[44px] rounded-xl bg-[#FFD166] text-[#141413] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none font-mono text-[12px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>+500ml</span>
            </button>
          </div>
        </div>

        {/* Nhật ký uống nước */}
        <div className="bg-white rounded-2xl border-[2.5px] border-[#141413] p-4">
          <h2 className="font-mono text-[11.5px] font-bold uppercase tracking-wide text-[#141413] mb-2.5">
            Nhật ký uống nước • Hôm nay
          </h2>
          <div className="divide-y-[2px] divide-[#141413]/15">
            {logs.map((entry) => (
              <div
                key={entry.time}
                className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-[12.5px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-[#95D5B2] border-[2px] border-[#141413] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#141413] leading-snug break-words">
                      {entry.label}
                    </p>
                    <p className="font-mono text-[10.5px] text-[#141413]/65 tabular-nums">
                      {entry.time}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[12px] font-bold text-[#141413] tabular-nums shrink-0">
                  {entry.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Nút thoát khỏi màn hình ngụy trang để quay lại cửa hàng rõ ràng */}
      <footer className="shrink-0 px-4 py-2.5 bg-[#FDF6E9] border-t-[2px] border-[#141413]/20 flex justify-end">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tap');
            playSound('transition');
            onReturnToStore();
          }}
          className="min-h-[38px] px-3.5 rounded-xl bg-white hover:bg-[#FFD166] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-mono text-[11px] font-bold text-[#141413] inline-flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Quay lại cửa hàng</span>
        </button>
      </footer>
    </div>
  );
};
