import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  CreditCard,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import {
  CartItem,
  DeliveryMethod,
  DistrictFilter,
  EWalletType,
  SmartLockerLocation,
} from '../types';
import { DISTRICT_FILTER_OPTIONS, formatVnd } from '../data/mockData';
import { DiscreetParcelSvg } from './ProductArtwork';
import { SmartLockerMap } from './SmartLockerMap';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';

interface Screen5StealthCheckoutProps {
  cart: CartItem[];
  deliveryMethod: DeliveryMethod;
  selectedLocker: SmartLockerLocation | null;
  districtFilter: DistrictFilter;
  eWallet: EWalletType;
  courierHint: string;
  orderCount: number;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onChangeDeliveryMethod: (method: DeliveryMethod) => void;
  onSelectLocker: (locker: SmartLockerLocation) => void;
  onChangeDistrictFilter: (district: DistrictFilter) => void;
  onChangeEWallet: (wallet: EWalletType) => void;
  onChangeCourierHint: (hint: string) => void;
  onConfirmOrder: () => void;
  onBackToCatalog: () => void;
  onOpenCourierTutorial: () => void;
  onOpenOrderList: () => void;
}

const ThermalBarcodeStripes: React.FC = () => {
  const widths = [
    2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 2, 3, 1, 1, 2, 2, 1, 3, 1, 2,
    1, 2, 3, 1, 2,
  ];
  return (
    <div
      className="flex items-stretch gap-[2px] h-5 overflow-hidden"
      aria-hidden="true"
    >
      {widths.map((w, idx) => (
        <span
          key={idx}
          className="bg-[#141413] shrink-0"
          style={{ width: `${w}px` }}
        />
      ))}
    </div>
  );
};

const COURIER_PRESETS: Record<
  Exclude<DistrictFilter, 'ALL'>,
  string
> = {
  'Q.1': 'Sảnh chung cư P. Bến Nghé, Q.1 · Biệt danh: Mèo Béo',
  'Q.3': 'Cổng bảo vệ Võ Văn Tần, Q.3 · Biệt danh: Mèo Béo',
  'Q.7': 'Cổng bảo vệ KTX ĐH Tôn Đức Thắng, Q.7 · Biệt danh: Mèo Béo',
  'Q.10': 'Cổng sau ĐH Bách Khoa, Q.10 · Biệt danh: Mèo Béo',
  'Bình Thạnh': 'Bàn bảo vệ D2, Bình Thạnh · Biệt danh: Mèo Béo',
  'Gò Vấp': 'Cổng bảo vệ ĐH Công Nghiệp (IUH), Gò Vấp · Biệt danh: Mèo Béo',
  'Tân Bình': 'Sảnh Pico Plaza Cộng Hòa, Tân Bình · Biệt danh: Mèo Béo',
  'Thủ Đức': 'Bàn bảo vệ KTX Khu B, Thủ Đức · Biệt danh: Mèo Béo',
};

export const Screen5StealthCheckout: React.FC<Screen5StealthCheckoutProps> = ({
  cart,
  deliveryMethod,
  selectedLocker,
  districtFilter,
  eWallet,
  courierHint,
  orderCount,
  onUpdateQty,
  onRemoveFromCart,
  onClearCart,
  onChangeDeliveryMethod,
  onSelectLocker,
  onChangeDistrictFilter,
  onChangeEWallet,
  onChangeCourierHint,
  onConfirmOrder,
  onBackToCatalog,
  onOpenCourierTutorial,
  onOpenOrderList,
}) => {
  const { playSound } = useSoundFeedback();
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [previewTab, setPreviewTab] = useState<'statement' | 'label'>('statement');
  const [showBagEditor, setShowBagEditor] = useState<boolean>(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.priceVnd * item.quantity,
    0
  );
  const deliveryFee = deliveryMethod === 'locker' ? 0 : 18000;
  const totalVnd = subtotal + (cart.length > 0 ? deliveryFee : 0);
  const totalQty = cart.reduce((s, i) => s + i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9]">
        <div className="shrink-0 px-3.5 py-2 bg-white border-b-[2.5px] border-[#141413] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="min-h-[32px] px-2.5 rounded-lg border-[2px] border-[#141413] bg-[#FDF6E9] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1 font-mono text-[11px] font-bold text-[#141413] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>
          <span className="font-mono text-[11px] font-bold text-[#0F5C56]">
            Thanh toán kín
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] flex items-center justify-center mb-4">
            <ShoppingBag className="w-6 h-6 text-[#141413]" />
          </div>
          <h2 className="font-display text-[19px] font-extrabold text-[#141413]">
            Túi hàng tạm đang trống!
          </h2>
          <p className="text-[13px] font-medium text-[#141413]/75 mt-1 max-w-[260px]">
            Ghé kệ nhà thuốc hoặc làm Quiz 30s để bỏ món vào túi kín đáo nha.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 w-full max-w-[240px]">
            <button
              type="button"
              onClick={onBackToCatalog}
              className="min-h-[44px] px-5 rounded-xl bg-[#0F5C56] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[13.5px] font-bold cursor-pointer"
            >
              Xem kệ nhà thuốc
            </button>
            {orderCount > 0 && (
              <button
                type="button"
                onClick={onOpenOrderList}
                className="min-h-[42px] px-4 rounded-xl bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-display text-[13px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>Đơn của bạn ({orderCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const canContinueStep1 = deliveryMethod === 'courier' || Boolean(selectedLocker);

  const pickupLabel =
    deliveryMethod === 'locker'
      ? `Tủ tự động 24/7: ${selectedLocker?.name ?? 'Chưa chọn tủ'}`
      : `Giao thả 30p: ${courierHint.trim() || 'Điểm thả ẩn danh'}`;

  return (
    <div className="relative flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9]">
      {/* Thanh điều hướng phụ gọn 1 dòng */}
      <div className="shrink-0 px-3.5 py-2 bg-white border-b-[2.5px] border-[#141413] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            if (checkoutStep === 2) {
              triggerHaptic('tap');
              playSound('transition');
              setCheckoutStep(1);
            } else {
              onBackToCatalog();
            }
          }}
          className="min-h-[32px] px-2.5 rounded-lg border-[2px] border-[#141413] bg-[#FDF6E9] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1 font-mono text-[11px] font-bold text-[#141413] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{checkoutStep === 1 ? 'Thêm món' : 'Đổi nơi nhận'}</span>
        </button>

        <span className="px-2.5 py-1 rounded-full bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[10.5px] font-bold text-[#141413] whitespace-nowrap">
          {checkoutStep === 1 ? 'Bước 1/2 • Nơi nhận' : 'Bước 2/2 • Thanh toán'}
        </span>
      </div>

      {/* Thân chính vừa khít 100dvh */}
      {checkoutStep === 1 ? (
        <>
          <main className="animate-spring-pop flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar px-3.5 py-2.5 flex flex-col gap-2">
            {/* Thanh gọn sửa/xoá sản phẩm ngay ở Bước 1 */}
            <div className="shrink-0 rounded-xl bg-white border-2 border-[#141413] px-2.5 py-1.5 flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <ShoppingBag className="w-3.5 h-3.5 text-[#0F5C56] shrink-0" />
                <p className="font-mono text-[11px] font-bold text-[#141413] leading-tight line-clamp-1 break-words min-w-0">
                  Túi ({totalQty}):{' '}
                  {cart.map((c) => `${c.product.shortName} ×${c.quantity}`).join(', ')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap');
                  playSound('click');
                  setShowBagEditor(true);
                }}
                className="px-2 py-0.5 rounded-md bg-[#F26B50]/25 hover:bg-[#F26B50] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold text-[#141413] inline-flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3 h-3 shrink-0" />
                <span>Xoá / Sửa</span>
              </button>
            </div>

            {/* 1. Chọn phương thức nhận hàng tách bạch */}
            <section aria-label="Chọn cách nhận hàng" className="space-y-1.5 min-w-0">
              <h1 className="font-display text-[15px] font-extrabold text-[#141413]">
                Chọn phương thức nhận hàng
              </h1>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('toggle');
                    playSound('toggle');
                    setPreviewTab('statement');
                    onChangeDeliveryMethod('locker');
                  }}
                  className={`min-h-[40px] px-2 rounded-xl border-[2.5px] border-[#141413] font-mono text-[11px] font-bold transition-all cursor-pointer ${
                    deliveryMethod === 'locker'
                      ? 'bg-[#0F5C56] text-[#FDF6E9] shadow-none translate-x-[2px] translate-y-[2px]'
                      : 'bg-white text-[#141413] shadow-[3px_3px_0_#141413]'
                  }`}
                >
                  Tủ tự động 24/7 (0đ)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('toggle');
                    playSound('toggle');
                    setPreviewTab('statement');
                    onChangeDeliveryMethod('courier');
                  }}
                  className={`min-h-[40px] px-2 rounded-xl border-[2.5px] border-[#141413] font-mono text-[11px] font-bold transition-all cursor-pointer ${
                    deliveryMethod === 'courier'
                      ? 'bg-[#0F5C56] text-[#FDF6E9] shadow-none translate-x-[2px] translate-y-[2px]'
                      : 'bg-white text-[#141413] shadow-[3px_3px_0_#141413]'
                  }`}
                >
                  Giao thả 30p (18k)
                </button>
              </div>
            </section>

            {/* 2. Bản đồ Smart Locker 24/7 hoặc Giao che tên */}
            {deliveryMethod === 'locker' ? (
              <SmartLockerMap
                selectedLocker={selectedLocker}
                districtFilter={districtFilter}
                onSelectLocker={onSelectLocker}
                onChangeDistrictFilter={onChangeDistrictFilter}
              />
            ) : (
              <div className="space-y-2.5 min-w-0">
                <div className="rounded-xl bg-white border-2 border-[#141413] shadow-[4px_4px_0_#141413] p-3.5 space-y-2.5 min-w-0">
                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#141413]/65">
                      Chọn nhanh khu vực TP.HCM
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {DISTRICT_FILTER_OPTIONS.map((dist) => {
                        const active = districtFilter === dist.label;
                        return (
                          <button
                            key={dist.label}
                            type="button"
                            onClick={() => {
                              triggerHaptic('toggle');
                              playSound('toggle');
                              onChangeDistrictFilter(dist.label);
                              onChangeCourierHint(COURIER_PRESETS[dist.label]);
                            }}
                            className={`min-h-[28px] px-2.5 rounded-lg border-[2px] border-[#141413] font-mono text-[10.5px] font-bold transition-all cursor-pointer ${
                              active
                                ? 'bg-[#FFD166] text-[#141413] shadow-none translate-x-[1px] translate-y-[1px]'
                                : 'bg-[#FDF6E9] text-[#141413] shadow-[2px_2px_0_#141413]'
                            }`}
                          >
                            {dist.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="courier-dropoff-note"
                      className="block font-mono text-[10.5px] font-bold text-[#141413]"
                    >
                      Điểm thả hàng &amp; Biệt danh nhận
                    </label>
                    <input
                      id="courier-dropoff-note"
                      type="text"
                      value={courierHint}
                      onChange={(e) => onChangeCourierHint(e.target.value)}
                      placeholder="VD: Bàn bảo vệ KTX Khu B · Biệt danh: Mèo Béo"
                      className="w-full h-10 px-3 rounded-lg bg-[#FDF6E9] border-[2px] border-[#141413] text-[12.5px] font-medium text-[#141413] focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                {/* 3 điểm khác biệt so với sàn TMĐT */}
                <div className="rounded-xl bg-[#95D5B2] border-2 border-[#141413] shadow-[3px_3px_0_#141413] p-3 space-y-2">
                  <p className="font-mono text-[10.5px] font-bold uppercase text-[#0F5C56]">
                    Khác gì so với đặt sàn TMĐT?
                  </p>
                  <div className="space-y-1.5 text-[11.5px] font-medium text-[#141413] leading-snug">
                    <div className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#0F5C56] stroke-[2.8] shrink-0 mt-0.5" />
                      <p>
                        <strong className="font-bold">Không tên thật &amp; SĐT:</strong>{' '}
                        Tem hộp chỉ in mã đơn &amp; biệt danh (khác hoàn toàn tem Shopee/Lazada).
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#0F5C56] stroke-[2.8] shrink-0 mt-0.5" />
                      <p>
                        <strong className="font-bold">Không gọi điện:</strong>{' '}
                        Tài xế thả đúng điểm hẹn, chụp ảnh xác nhận qua app và rời đi.
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#0F5C56] stroke-[2.8] shrink-0 mt-0.5" />
                      <p>
                        <strong className="font-bold">Hỏa tốc 30 phút:</strong>{' '}
                        Xuất kho trực tiếp từ nhà thuốc gần bạn.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCourierTutorial}
                    className="w-full min-h-[34px] px-3 rounded-lg bg-[#FFD166] hover:bg-white border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-mono text-[10.5px] font-bold text-[#141413] flex items-center justify-center cursor-pointer transition-all"
                  >
                    So sánh tem với sàn TMĐT →
                  </button>
                </div>
              </div>
            )}
          </main>

          <footer className="shrink-0 bg-[#FDF6E9] border-t-[2.5px] border-[#141413] px-3.5 py-2.5">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('toggle');
                playSound('transition');
                setCheckoutStep(2);
              }}
              disabled={!canContinueStep1}
              className="w-full min-h-[44px] px-4 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] disabled:bg-zinc-300 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none text-[#FDF6E9] font-display text-[13.5px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>
                {!canContinueStep1
                  ? 'Chọn Smart Locker trên bản đồ'
                  : `Tiếp tục thanh toán • ${formatVnd(totalVnd)}`}
              </span>
              {canContinueStep1 && <ArrowRight className="w-4 h-4 shrink-0" />}
            </button>
          </footer>
        </>
      ) : (
        <>
          <main className="animate-spring-pop flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-3.5 flex flex-col gap-3">
            {/* Khối 1: Tóm tắt đơn & điểm nhận gộp gọn */}
            <section
              aria-label="Tóm tắt đơn hàng và nơi nhận"
              className="rounded-xl bg-white border-2 border-[#141413] shadow-[4px_4px_0_#141413] p-3 space-y-2 min-w-0 shrink-0"
            >
              <div className="space-y-1.5">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-2 min-w-0"
                  >
                    <span className="font-display text-[13px] font-extrabold text-[#141413] leading-snug break-words min-w-0 flex-1">
                      {product.shortName}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(product.id, -1)}
                        aria-label={`Bớt ${product.shortName}`}
                        className="w-7 h-7 rounded-lg border-[1.5px] border-[#141413] bg-[#FDF6E9] hover:bg-[#FFD166] flex items-center justify-center text-[#141413] cursor-pointer transition-colors"
                      >
                        <Minus className="w-3 h-3 stroke-[2.6]" />
                      </button>
                      <span className="w-5 text-center font-mono text-[12px] font-bold text-[#141413] tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(product.id, 1)}
                        aria-label={`Thêm ${product.shortName}`}
                        className="w-7 h-7 rounded-lg border-[1.5px] border-[#141413] bg-[#FDF6E9] hover:bg-[#95D5B2] flex items-center justify-center text-[#141413] cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3 stroke-[2.6]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveFromCart(product.id)}
                        aria-label={`Xoá ${product.shortName} khỏi đơn`}
                        title={`Xoá ${product.shortName}`}
                        className="w-7 h-7 rounded-lg border-[1.5px] border-[#141413] bg-[#F26B50]/20 hover:bg-[#F26B50] flex items-center justify-center text-[#141413] cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-mono text-[12px] font-bold text-[#0F5C56] tabular-nums shrink-0 min-w-[60px] text-right">
                      {formatVnd(product.priceVnd * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-[#141413]/30 flex items-start justify-between gap-2 min-w-0">
                <p className="text-[11.5px] font-semibold text-[#141413]/85 leading-snug break-words min-w-0 flex-1">
                  {pickupLabel}
                </p>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap');
                      playSound('click');
                      setCheckoutStep(1);
                    }}
                    className="font-mono text-[11px] font-bold text-[#0F5C56] underline cursor-pointer"
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="font-mono text-[11px] font-bold text-[#F26B50] underline cursor-pointer"
                  >
                    Xoá hết
                  </button>
                </div>
              </div>
            </section>

            {/* Khối 2: Chọn ví thanh toán 1 hàng gọn */}
            <section aria-label="Ví thanh toán" className="space-y-1.5 min-w-0 shrink-0">
              <p className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#141413]/70">
                Ví thanh toán ẩn tên sản phẩm
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(['Momo', 'ZaloPay', 'VietQR'] as EWalletType[]).map((wallet) => (
                  <button
                    key={wallet}
                    type="button"
                    onClick={() => {
                      triggerHaptic('toggle');
                      playSound('toggle');
                      onChangeEWallet(wallet);
                    }}
                    className={`min-h-[38px] rounded-xl border-2 border-[#141413] font-mono text-[11.5px] font-bold transition-all cursor-pointer ${
                      eWallet === wallet
                        ? 'bg-[#141413] text-[#FFD166] shadow-none translate-x-[1px] translate-y-[1px]'
                        : 'bg-white text-[#141413] shadow-[3px_3px_0_#141413]'
                    }`}
                  >
                    {wallet}
                  </button>
                ))}
              </div>
            </section>

            {/* Khối 3: Thẻ xem trước bảo mật theo phương thức nhận hàng */}
            <section
              aria-label={
                deliveryMethod === 'locker'
                  ? `Xem trước hiển thị trên ví ${eWallet}`
                  : 'Xem trước sao kê ví và tem hộp 0 danh tính'
              }
              className="rounded-xl bg-white border-2 border-[#141413] shadow-[4px_4px_0_#141413] overflow-hidden min-w-0 shrink-0"
            >
              {deliveryMethod === 'locker' ? (
                <div className="p-3.5 bg-[#FFD166]/35 space-y-2">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] font-bold text-[#141413]/75">
                    <span>HIỂN THỊ TRÊN VÍ {eWallet.toUpperCase()}</span>
                    <span>CHỨNG TỪ KÍN</span>
                  </div>
                  <div className="rounded-lg bg-white border-[1.5px] border-[#141413] p-2.5 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-mono text-[12.5px] font-bold text-[#141413]">
                        HCMC DAILY WELLNESS
                      </p>
                      <span className="font-mono text-[14px] font-bold text-[#0F5C56] tabular-nums shrink-0">
                        -{formatVnd(totalVnd)}
                      </span>
                    </div>
                    <p className="font-sans text-[12px] font-medium text-[#141413]/85 leading-snug">
                      Ẩn hoàn toàn tên sản phẩm • Mã giao dịch kín
                    </p>
                  </div>
                  <p className="font-sans text-[11.5px] font-medium text-[#141413]/80 leading-snug">
                    Đóng gói hộp nâu trơn, đặt kín trong ngăn tủ tự động.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 border-b-2 border-[#141413] bg-[#FDF6E9]">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('toggle');
                        playSound('toggle');
                        setPreviewTab('statement');
                      }}
                      className={`min-h-[38px] px-2 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 border-r border-[#141413] transition-colors cursor-pointer ${
                        previewTab === 'statement'
                          ? 'bg-[#FFD166] text-[#141413]'
                          : 'bg-[#FDF6E9] text-[#141413]/70 hover:bg-white'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 shrink-0" />
                      <span>Sao kê ví</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('toggle');
                        playSound('toggle');
                        setPreviewTab('label');
                      }}
                      className={`min-h-[38px] px-2 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 border-l border-[#141413] transition-colors cursor-pointer ${
                        previewTab === 'label'
                          ? 'bg-[#FFD166] text-[#141413]'
                          : 'bg-[#FDF6E9] text-[#141413]/70 hover:bg-white'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5 shrink-0" />
                      <span>Tem hộp 0 danh tính</span>
                    </button>
                  </div>

                  {previewTab === 'statement' ? (
                    <div className="p-3.5 bg-[#FFD166]/35 space-y-2">
                      <div className="flex items-center justify-between gap-2 font-mono text-[10px] font-bold text-[#141413]/75">
                        <span>HIỂN THỊ TRÊN VÍ {eWallet.toUpperCase()}</span>
                        <span>CHỨNG TỪ KÍN</span>
                      </div>
                      <div className="rounded-lg bg-white border-[1.5px] border-[#141413] p-2.5 space-y-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-mono text-[12.5px] font-bold text-[#141413]">
                            HCMC DAILY WELLNESS
                          </p>
                          <span className="font-mono text-[14px] font-bold text-[#0F5C56] tabular-nums shrink-0">
                            -{formatVnd(totalVnd)}
                          </span>
                        </div>
                        <p className="font-sans text-[12px] font-medium text-[#141413]/85 leading-snug">
                          Ẩn hoàn toàn tên sản phẩm • Mã giao dịch kín
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="h-2.5 w-full serrated-top bg-white" />
                      <div className="px-3.5 py-2.5 space-y-2">
                        <div className="flex items-center justify-between gap-2 border-b border-dashed border-[#141413]/35 pb-2 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <DiscreetParcelSvg className="w-8 h-8 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-mono text-[11.5px] font-bold text-[#141413] leading-tight break-words">
                                #DW-{8821 + orderCount + totalQty} · GIAO THẢ 30P
                              </p>
                              <p className="font-sans text-[11px] font-semibold text-[#0F5C56]">
                                Người gửi: HCMC Daily Wellness
                              </p>
                            </div>
                          </div>

                          <div className="animate-stamp-slam px-2 py-1 border-2 border-[#0F5C56] bg-[#95D5B2]/45 font-mono text-[9.5px] font-bold text-[#0F5C56] uppercase tracking-wider whitespace-nowrap text-center shrink-0">
                            0 TÊN • 0 SĐT
                          </div>
                        </div>

                        <div className="font-sans text-[12px] font-medium text-[#141413] space-y-1 leading-snug">
                          <p>
                            <strong className="font-bold">Người nhận:</strong> Biệt danh tại điểm hẹn (Không tên thật, không SĐT)
                          </p>
                          <p>
                            <strong className="font-bold">Đóng gói:</strong> Hộp carton nâu trơn 2 lớp, không logo
                          </p>
                        </div>

                        <div className="pt-0.5 flex items-center justify-between gap-2">
                          <ThermalBarcodeStripes />
                        </div>
                      </div>
                      <div className="h-2.5 w-full serrated-bottom bg-white" />
                    </div>
                  )}
                </>
              )}
            </section>
          </main>

          <footer className="shrink-0 bg-[#FDF6E9] border-t-[2.5px] border-[#141413] px-3.5 py-2.5">
            <button
              type="button"
              onClick={onConfirmOrder}
              disabled={!canContinueStep1}
              className="w-full min-h-[44px] px-4 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] disabled:bg-zinc-300 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none text-[#FDF6E9] font-display text-[13.5px] font-bold flex items-center justify-center transition-all cursor-pointer"
            >
              <span>Đặt hàng ẩn danh • {formatVnd(totalVnd)}</span>
            </button>
          </footer>
        </>
      )}

      {/* Popover Xoá / Sửa sản phẩm ngay trong thanh toán */}
      {showBagEditor && (
        <div
          onClick={() => setShowBagEditor(false)}
          className="absolute inset-0 z-40 bg-[#141413]/70 p-4 flex items-center justify-center animate-spring-pop"
          role="dialog"
          aria-modal="true"
          aria-label="Chỉnh sửa hoặc xoá sản phẩm trong túi"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#FDF6E9] border-[3px] border-[#141413] rounded-2xl shadow-[5px_5px_0_#141413] overflow-hidden"
          >
            <div className="bg-[#FFD166] border-b-[2.5px] border-[#141413] px-4 py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#141413]" />
                <p className="font-display text-[15px] font-extrabold text-[#141413]">
                  Sản phẩm trong túi ({totalQty})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBagEditor(false)}
                aria-label="Đóng chỉnh sửa túi"
                className="w-8 h-8 rounded-lg bg-white border-[2px] border-[#141413] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-3.5 space-y-2.5 max-h-[55dvh] overflow-y-auto no-scrollbar">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="rounded-xl bg-white border-2 border-[#141413] p-2.5 flex items-center justify-between gap-2 min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[13.5px] font-extrabold text-[#141413] leading-snug break-words">
                      {product.shortName}
                    </p>
                    <p className="font-mono text-[11.5px] font-bold text-[#0F5C56] tabular-nums">
                      {formatVnd(product.priceVnd * quantity)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(product.id, -1)}
                      aria-label={`Giảm ${product.shortName}`}
                      className="w-7 h-7 rounded-lg border-[1.5px] border-[#141413] bg-[#FDF6E9] hover:bg-[#FFD166] flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3 h-3 stroke-[2.6]" />
                    </button>
                    <span className="w-5 text-center font-mono text-[12px] font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(product.id, 1)}
                      aria-label={`Tăng ${product.shortName}`}
                      className="w-7 h-7 rounded-lg border-[1.5px] border-[#141413] bg-[#FDF6E9] hover:bg-[#95D5B2] flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3 h-3 stroke-[2.6]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(product.id)}
                      aria-label={`Xoá ${product.shortName}`}
                      className="ml-0.5 px-2 h-7 rounded-lg border-[1.5px] border-[#141413] bg-[#F26B50] hover:bg-[#EA5B3F] font-mono text-[10.5px] font-bold text-[#141413] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xoá</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-3.5 py-2.5 bg-white border-t-[2px] border-[#141413] flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClearCart();
                  setShowBagEditor(false);
                }}
                className="min-h-[38px] px-3 rounded-xl bg-[#F26B50]/25 hover:bg-[#F26B50] border-[2px] border-[#141413] font-mono text-[11px] font-bold text-[#141413] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xoá hết túi</span>
              </button>
              <button
                type="button"
                onClick={() => setShowBagEditor(false)}
                className="flex-1 min-h-[38px] rounded-xl bg-[#0F5C56] text-[#FDF6E9] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] font-display text-[13px] font-bold cursor-pointer"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
