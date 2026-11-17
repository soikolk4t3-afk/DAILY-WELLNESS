import React, { useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  MapPin,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { OrderSnapshot } from '../types';
import { formatVnd } from '../data/mockData';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';

interface OrderListOverlayProps {
  orders: OrderSnapshot[];
  onClose: () => void;
  onOpenOrder: (order: OrderSnapshot) => void;
  onMarkPickedUp: (orderId: string) => void;
  onWipeAllTraces: () => void;
}

export const OrderListOverlay: React.FC<OrderListOverlayProps> = ({
  orders,
  onClose,
  onOpenOrder,
  onMarkPickedUp,
  onWipeAllTraces,
}) => {
  const { playSound } = useSoundFeedback();
  const [confirmWipe, setConfirmWipe] = useState<boolean>(false);

  return (
    <div
      className="absolute inset-0 z-50 bg-[#141413]/75 p-3.5 sm:p-4 flex items-center justify-center animate-spring-pop"
      role="dialog"
      aria-modal="true"
      aria-label="Danh sách đơn hàng tạm"
    >
      <div className="w-full max-h-full bg-[#FDF6E9] border-[3px] border-[#141413] rounded-2xl shadow-[6px_6px_0_#141413] flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="shrink-0 bg-[#FFD166] border-b-[2.5px] border-[#141413] px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0F5C56] border-[2px] border-[#141413] flex items-center justify-center text-[#FFD166] shrink-0">
              <ClipboardList className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-[15px] font-extrabold text-[#141413] leading-tight">
                Đơn của bạn ({orders.length})
              </h2>
              <p className="font-mono text-[10px] font-bold text-[#141413]/75 mt-0.5">
                Chỉ giữ tạm trong phiên • Không lưu máy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap');
              playSound('click');
              onClose();
            }}
            aria-label="Đóng danh sách đơn"
            className="w-8 h-8 rounded-lg bg-white border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center text-[#141413] cursor-pointer shrink-0 transition-all"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </header>

        {/* Danh sách đơn */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 space-y-3">
          {orders.length === 0 ? (
            <div className="rounded-xl bg-white border-[2px] border-dashed border-[#141413] p-5 text-center space-y-1">
              <p className="font-display text-[14px] font-extrabold text-[#141413]">
                Chưa có đơn hàng nào
              </p>
              <p className="text-[12px] font-medium text-[#141413]/75 leading-snug">
                Sau khi đặt hàng ẩn danh, mã OTP và tủ nhận hàng sẽ nằm ở đây để bạn mở xem lại bất cứ lúc nào.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const isPicked = order.status === 'picked_up';
              return (
                <article
                  key={order.id}
                  className="rounded-xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-3.5 space-y-2.5 min-w-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#0F5C56]">
                      #{order.orderCode} · {order.createdAtLabel}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded border-[1.5px] border-[#141413] font-mono text-[10px] font-bold ${
                        isPicked
                          ? 'bg-[#95D5B2] text-[#141413]'
                          : 'bg-[#FFD166] text-[#141413]'
                      }`}
                    >
                      {isPicked ? 'Đã nhận hàng ✓' : 'Chờ lấy hàng'}
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <p className="font-display text-[14px] font-extrabold text-[#141413] leading-snug break-words">
                      {order.itemsSummary}
                    </p>
                    <p className="text-[12px] font-medium text-[#141413]/80 flex items-start gap-1.5 leading-snug break-words">
                      {order.deliveryMethod === 'locker' ? (
                        <MapPin className="w-3.5 h-3.5 text-[#0F5C56] shrink-0 mt-0.5" />
                      ) : (
                        <Truck className="w-3.5 h-3.5 text-[#0F5C56] shrink-0 mt-0.5" />
                      )}
                      <span>
                        {order.deliveryMethod === 'locker'
                          ? order.lockerLocation.name
                          : order.courierAddressHint}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t-[1.5px] border-dashed border-[#141413]/25 font-mono text-[12px] font-bold text-[#141413]">
                    <span>OTP: {order.otpDigits}</span>
                    <span className="tabular-nums">{formatVnd(order.totalVnd)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap');
                        playSound('transition');
                        onOpenOrder(order);
                      }}
                      className="min-h-[38px] px-2.5 rounded-lg bg-[#0F5C56] hover:bg-[#0C4C47] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display text-[12px] font-bold text-[#FDF6E9] cursor-pointer transition-all"
                    >
                      Xem mã OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('toggle');
                        playSound('success');
                        onMarkPickedUp(order.id);
                      }}
                      className={`min-h-[38px] px-2.5 rounded-lg border-[2px] border-[#141413] font-display text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        isPicked
                          ? 'bg-[#95D5B2] text-[#141413]'
                          : 'bg-[#FDF6E9] hover:bg-[#FFD166] text-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{isPicked ? 'Đã nhận' : 'Đã lấy hàng'}</span>
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Footer tách biệt hoàn toàn: Nút Xóa sạch toàn bộ dữ liệu với xác nhận 1 chạm */}
        <footer className="shrink-0 bg-[#FDF6E9] border-t-[2.5px] border-[#141413] p-3.5">
          {!confirmWipe ? (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('warning');
                playSound('alert');
                setConfirmWipe(true);
              }}
              className="w-full min-h-[42px] px-3.5 rounded-xl bg-white hover:bg-[#F26B50]/20 border-[2px] border-[#141413] font-display text-[12.5px] font-bold text-[#141413] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 className="w-4 h-4 text-[#F26B50] shrink-0" />
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
                className="min-h-[42px] rounded-xl bg-white border-[2px] border-[#141413] font-display text-[12.5px] font-bold text-[#141413] cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('warning');
                  playSound('alert');
                  onWipeAllTraces();
                }}
                className="min-h-[42px] rounded-xl bg-[#F26B50] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] font-display text-[12.5px] font-bold text-[#141413] cursor-pointer"
              >
                Xác nhận xóa hết?
              </button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};
