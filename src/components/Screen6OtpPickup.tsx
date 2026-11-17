import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  Copy,
  Home,
  ShieldCheck,
  Star,
  Trash2,
} from 'lucide-react';
import { OrderSnapshot } from '../types';
import { formatVnd } from '../data/mockData';
import { SmartLockerSvg } from './ProductArtwork';
import { SmartLockerLocationCard } from './SmartLockerMap';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';

interface Screen6OtpPickupProps {
  order: OrderSnapshot;
  orderCount: number;
  onSaveAndHome: () => void;
  onOpenOrderList: () => void;
  onWipeComplete: () => void;
}

export const Screen6OtpPickup: React.FC<Screen6OtpPickupProps> = ({
  order,
  orderCount,
  onSaveAndHome,
  onOpenOrderList,
  onWipeComplete,
}) => {
  const { playSound } = useSoundFeedback();
  const [showInsideBox, setShowInsideBox] = useState<boolean>(false);
  const [surveyRating, setSurveyRating] = useState<number>(0);
  const [confirmWipe, setConfirmWipe] = useState<boolean>(false);
  const [wipingState, setWipingState] = useState<'idle' | 'erasing' | 'done'>('idle');
  const [copiedOtp, setCopiedOtp] = useState<boolean>(false);

  const wipeTimer1Ref = useRef<number | null>(null);
  const wipeTimer2Ref = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (wipeTimer1Ref.current !== null) {
        window.clearTimeout(wipeTimer1Ref.current);
      }
      if (wipeTimer2Ref.current !== null) {
        window.clearTimeout(wipeTimer2Ref.current);
      }
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const qrPayload = `${order.orderCode}|${order.otpDigits}|${order.lockerLocation.lockerCode}`;

  const handleCopyOtp = async () => {
    const cleanOtp = order.otpDigits.replace(/[^0-9]/g, '');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cleanOtp);
      }
    } catch {
      // Ignore clipboard permission errors in restricted webviews
    }
    triggerHaptic('success');
    playSound('success');
    setCopiedOtp(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopiedOtp(false);
    }, 2000);
  };

  const handleConfirmWipe = () => {
    triggerHaptic('warning');
    playSound('alert');
    setWipingState('erasing');
    if (wipeTimer1Ref.current !== null) {
      window.clearTimeout(wipeTimer1Ref.current);
    }
    if (wipeTimer2Ref.current !== null) {
      window.clearTimeout(wipeTimer2Ref.current);
    }
    wipeTimer1Ref.current = window.setTimeout(() => {
      setWipingState('done');
      triggerHaptic('success');
      playSound('success');
      wipeTimer2Ref.current = window.setTimeout(() => {
        onWipeComplete();
      }, 550);
    }, 1150);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9] relative">
      {/* Sub-bar đơn hàng gọn */}
      <div className="shrink-0 px-3.5 py-2 bg-white border-b-[2.5px] border-[#141413] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tap');
            onOpenOrderList();
          }}
          className="min-h-[32px] px-2.5 rounded-lg border-[2px] border-[#141413] bg-[#FFD166] hover:bg-[#95D5B2] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-[#141413] cursor-pointer transition-all"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Đơn của bạn ({orderCount})</span>
        </button>

        <span className="font-mono text-[10.5px] font-bold text-[#0F5C56]">
          #{order.orderCode} • ĐÃ ĐẶT
        </span>
      </div>

      {/* Nội dung chính gọn gàng */}
      <main className="animate-spring-pop flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-3.5 space-y-3">
        {/* Thẻ mã OTP nhận hàng */}
        <section
          aria-label="Mã OTP mở tủ nhận hàng"
          className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] overflow-hidden"
        >
          <div className="bg-[#0F5C56] text-[#FDF6E9] px-3.5 py-2.5 border-b-[2px] border-[#141413] flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold text-[#FFD166]">
                {order.deliveryMethod === 'locker'
                  ? 'TỦ SMART LOCKER 24/7'
                  : 'GIAO THẢ HỎA TỐC 30P'}
              </p>
              <h1 className="font-display text-[15.5px] font-extrabold leading-snug">
                {order.deliveryMethod === 'locker'
                  ? 'Mã OTP mở tủ tự động'
                  : 'Mã PIN xác nhận nhận hàng'}
              </h1>
            </div>
            <SmartLockerSvg className="w-9 h-9 shrink-0" />
          </div>

          <div className="p-3.5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="font-mono text-[10.5px] font-bold text-[#141413]/70">
                  {order.deliveryMethod === 'locker'
                    ? 'NHẬP MÃ NÀY TẠI MÀN HÌNH TỦ'
                    : 'ĐỌC MÃ NÀY KHI NHẬN HỘP'}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-block px-3.5 py-2 rounded-xl bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413]">
                    <p className="font-mono text-[24px] font-bold tracking-wider text-[#141413] tabular-nums leading-none">
                      {order.otpDigits}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyOtp}
                    className={`min-h-[34px] px-2.5 rounded-xl border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-mono text-[10.5px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                      copiedOtp
                        ? 'bg-[#95D5B2] text-[#141413]'
                        : 'bg-[#FDF6E9] hover:bg-[#FFD166] text-[#141413]'
                    }`}
                  >
                    {copiedOtp ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.6] text-[#0F5C56]" />
                        <span>Đã chép mã ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 stroke-[2.4]" />
                        <span>Chép mã</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div
                className="p-2 rounded-xl bg-[#FDF6E9] border-[2px] border-[#141413] shrink-0"
                aria-label={`Mã QR mở tủ ${order.orderCode}`}
              >
                <QRCodeSVG
                  value={qrPayload}
                  size={70}
                  bgColor="#FDF6E9"
                  fgColor="#141413"
                  level="M"
                />
              </div>
            </div>

            {order.deliveryMethod === 'courier' && (
              <div className="rounded-xl bg-[#FDF6E9] border-[1.5px] border-[#141413] p-2.5 space-y-1">
                <p className="font-mono text-[10px] font-bold uppercase text-[#141413]/65">
                  Điểm thả hàng đã chọn
                </p>
                <p className="font-display text-[13px] font-bold text-[#141413] leading-snug break-words">
                  {order.courierAddressHint}
                </p>
                <p className="text-[11.5px] font-semibold text-[#0F5C56] leading-snug">
                  Chế độ giao thả im lặng: Tài xế không gọi điện, không lộ tên thật &amp; SĐT
                </p>
              </div>
            )}

            <div className="pt-2 border-t-[2px] border-dashed border-[#141413]/25 flex items-center justify-between gap-2 font-mono text-[11px] font-bold text-[#141413]">
              <span className="flex items-center gap-1 text-[#0F5C56]">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                {order.readyEstimate}
              </span>
              <span className="tabular-nums">
                Đã thanh toán {formatVnd(order.totalVnd)}
              </span>
            </div>
          </div>
        </section>

        {/* Bản đồ vị trí tủ Smart Locker (KHÔNG vị trí người dùng, KHÔNG đường đi, địa chỉ full-width) */}
        {order.deliveryMethod === 'locker' && (
          <>
            <SmartLockerLocationCard locker={order.lockerLocation} />

            {/* Hướng dẫn thao tác tại tủ 30 giây */}
            <section
              aria-label="Hướng dẫn thao tác tại tủ Smart Locker"
              className="rounded-xl bg-white border-[2px] border-[#141413] p-3.5 space-y-2"
            >
              <p className="font-mono text-[10.5px] font-bold uppercase text-[#0F5C56]">
                Thao tác tại tủ Smart Locker (30 giây)
              </p>
              <div className="space-y-1.5 text-[12px] font-medium text-[#141413]">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#FFD166] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="leading-snug">
                    Đến đúng tủ <strong className="font-mono">{order.lockerLocation.lockerCode}</strong> và chạm nút <em>&ldquo;Nhận hàng&rdquo;</em> trên màn hình.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="leading-snug">
                    Đưa mã QR ở trên vào đầu quét hoặc nhập 6 số OTP.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#FDF6E9] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <p className="leading-snug">
                    Ngăn tủ tự bật mở — lấy hộp carton trơn và đóng cửa tủ (0 tiếp xúc).
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Dòng mở rộng gọn: Xem phiếu QR trong hộp */}
        <section className="rounded-xl bg-white border-[2px] border-[#141413] overflow-hidden">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('toggle');
              playSound('toggle');
              setShowInsideBox((v) => !v);
            }}
            className="w-full min-h-[42px] px-3.5 py-2 flex items-center justify-between gap-2 text-left hover:bg-[#FFFDF8] transition-colors cursor-pointer"
          >
            <span className="font-display text-[13px] font-bold text-[#141413]">
              Xem phiếu QR trong hộp
            </span>
            {showInsideBox ? (
              <ChevronUp className="w-4 h-4 text-[#141413] shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#141413] shrink-0" />
            )}
          </button>

          {showInsideBox && (
            <div className="px-3.5 pb-3.5 pt-2.5 border-t-[2px] border-[#141413] bg-[#FDF6E9]">
              <div className="rounded-xl bg-white border-[2px] border-dashed border-[#141413] p-3 space-y-1.5">
                <p className="font-display text-[12.5px] font-bold text-[#141413]">
                  Chấm điểm độ kín đáo của hộp (ẩn danh)
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap');
                        playSound('success');
                        setSurveyRating(star);
                      }}
                      aria-label={`Đánh giá ${star} sao`}
                      className="w-7 h-7 rounded-lg hover:bg-[#FFD166]/40 flex items-center justify-center cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= surveyRating
                            ? 'fill-[#FFD166] text-[#141413]'
                            : 'text-zinc-300'
                        }`}
                      />
                    </button>
                  ))}
                  {surveyRating > 0 && (
                    <span className="font-mono text-[10px] font-bold text-[#0F5C56] ml-1">
                      Đã ghi nhận ẩn danh ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Ghi chú nhắc giữ mã OTP */}
        <p className="flex items-center justify-center gap-1.5 font-mono text-[10.5px] font-semibold text-[#0F5C56] text-center">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Giữ mã OTP kín đáo • Xem lại bất cứ lúc nào ở mục Đơn của bạn</span>
        </p>
      </main>

      {/* Hai hành động đáy tách biệt rõ ràng */}
      <footer className="shrink-0 bg-[#FDF6E9] border-t-[2.5px] border-[#141413] px-3.5 py-2.5 space-y-2">
        <button
          type="button"
          onClick={onSaveAndHome}
          className="w-full min-h-[44px] px-4 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>Lưu &amp; Về trang chủ</span>
        </button>

        {!confirmWipe ? (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('warning');
              playSound('alert');
              setConfirmWipe(true);
            }}
            className="w-full min-h-[38px] px-3 rounded-xl bg-white hover:bg-[#F26B50]/15 border-[2px] border-[#141413] font-mono text-[11px] font-bold text-[#141413] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#F26B50] shrink-0" />
            <span>Xóa sạch toàn bộ dữ liệu</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap');
                playSound('click');
                setConfirmWipe(false);
              }}
              className="min-h-[38px] rounded-xl bg-white border-[2px] border-[#141413] font-mono text-[11px] font-bold text-[#141413] cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirmWipe}
              className="min-h-[38px] rounded-xl bg-[#F26B50] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] font-mono text-[11px] font-bold text-[#141413] cursor-pointer"
            >
              Xác nhận xóa hết?
            </button>
          </div>
        )}
      </footer>

      {/* Màn hình quét xóa sạch toàn bộ dấu vết */}
      {wipingState !== 'idle' && (
        <div
          className="absolute inset-0 z-50 bg-[#141413] text-[#FDF6E9] flex flex-col items-center justify-center p-6 text-center animate-spring-pop"
          role="dialog"
          aria-modal="true"
          aria-label="Đang xóa toàn bộ dữ liệu"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FFD166] border-[2.5px] border-[#FDF6E9] flex items-center justify-center mb-4">
            {wipingState === 'erasing' ? (
              <Trash2 className="w-8 h-8 text-[#141413] animate-bounce" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-[#0F5C56]" />
            )}
          </div>

          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#95D5B2]">
            {wipingState === 'erasing' ? 'ĐANG TỰ XÓA PHIÊN' : 'SẠCH HOÀN TOÀN 100%'}
          </p>
          <h2 className="font-display text-[22px] font-extrabold text-[#FDF6E9] mt-1">
            {wipingState === 'erasing'
              ? 'ĐANG XÓA DỮ LIỆU...'
              : 'ĐÃ XÓA SẠCH DẤU VẾT'}
          </h2>
          <p className="text-[12.5px] text-zinc-300 mt-2 max-w-[260px]">
            {wipingState === 'erasing'
              ? 'Đang xóa danh sách đơn, túi tạm, vị trí tủ & ghi chú...'
              : 'Quay về trang chủ sạch ngay bây giờ.'}
          </p>

          <div className="mt-5 w-full max-w-[240px] h-2.5 bg-[#262624] border-[2px] border-[#FDF6E9] rounded-full overflow-hidden">
            <div
              className={`h-full bg-[#FFD166] transition-all duration-1000 ${
                wipingState === 'erasing' ? 'w-3/4' : 'w-full'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
