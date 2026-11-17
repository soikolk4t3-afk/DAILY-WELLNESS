import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ScanBarcode,
  ShieldCheck,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { Product } from '../types';
import { formatVnd } from '../data/mockData';
import { PharmacySealSvg, ProductArtwork } from './ProductArtwork';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';

interface Screen4ProductDetailProps {
  product: Product;
  inCartQty: number;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onGoToCheckout: () => void;
  onOpenSizeGuide: () => void;
}

export const Screen4ProductDetail: React.FC<Screen4ProductDetailProps> = ({
  product,
  inCartQty,
  onBack,
  onAddToCart,
  onRemoveFromCart,
  onGoToCheckout,
  onOpenSizeGuide,
}) => {
  const { playSound } = useSoundFeedback();
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedFeedback(true);
  };

  const handleRemove = () => {
    onRemoveFromCart(product.id);
    setAddedFeedback(false);
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9]">
      {/* Thanh điều hướng phụ gọn */}
      <div className="shrink-0 px-3.5 py-1.5 bg-white border-b-[2.5px] border-[#141413] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[32px] px-2.5 rounded-lg border-[2px] border-[#141413] bg-[#FDF6E9] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1 font-mono text-[11px] font-bold text-[#141413] cursor-pointer transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại</span>
        </button>
        <span className="px-2 py-0.5 rounded-full bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold text-[#141413]">
          Chuẩn Bộ Y tế
        </span>
      </div>

      {/* Nội dung sắp xếp tự nhiên với khoảng cách đồng nhất 12px */}
      <main className="animate-spring-pop flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-3.5 flex flex-col gap-3">
        {/* Phần trên: Hình + Tên + Giá + Nhãn nhà thuốc */}
        <section className="rounded-xl bg-white border-2 border-[#141413] shadow-[4px_4px_0_#141413] p-3 flex items-center gap-3 min-w-0 shrink-0">
          <ProductArtwork product={product} size="sm" />
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded-md bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[9.5px] font-bold text-[#141413]">
              {product.pharmacyPartner}
            </span>
            <h1 className="font-display text-[17px] font-extrabold text-[#141413] leading-tight mt-1 break-words">
              {product.name}
            </h1>
            <div className="flex items-baseline justify-between gap-2 mt-1">
              <p className="font-mono text-[18px] font-bold text-[#0F5C56] tabular-nums leading-none">
                {formatVnd(product.priceVnd)}
              </p>
              <span className="font-mono text-[11px] font-semibold text-[#141413]/70">
                {product.packSize}
              </span>
            </div>
          </div>
        </section>

        {/* Thẻ gộp Thông số & Mô tả nhanh */}
        <section
          aria-label="Thông số & mô tả sản phẩm"
          className="bg-white border-2 border-[#141413] shadow-[4px_4px_0_#141413] rounded-xl p-3.5 min-w-0 shrink-0"
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#FDF6E9] border border-[#141413]/20 rounded-lg px-2.5 py-2 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-[#141413]/55 leading-none">
                  {product.category === 'hydration' ? 'DUNG TÍCH' : 'SIZE'}
                </p>
                {product.category === 'protection' && (
                  <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="font-mono text-[9.5px] font-bold text-[#0F5C56] underline hover:text-[#141413] cursor-pointer leading-none shrink-0"
                  >
                    ? Cách đo
                  </button>
                )}
              </div>
              <p className="font-display text-[13.5px] font-extrabold text-[#141413] mt-1 leading-tight">
                {product.shortWidth}
              </p>
            </div>

            <div className="bg-[#FDF6E9] border border-[#141413]/20 rounded-lg px-2.5 py-2 min-w-0">
              <p className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-[#141413]/55 leading-none">
                {product.category === 'hydration' ? 'ĐỘ PH' : 'ĐỘ MỎNG'}
              </p>
              <p className="font-display text-[13.5px] font-extrabold text-[#141413] mt-1 leading-tight">
                {product.shortThickness}
              </p>
            </div>

            <div className="bg-[#FDF6E9] border border-[#141413]/20 rounded-lg px-2.5 py-2 min-w-0">
              <p className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-[#141413]/55 leading-none">
                CHẤT LIỆU
              </p>
              <p className="font-display text-[13.5px] font-extrabold text-[#141413] mt-1 leading-tight">
                {product.shortMaterial}
              </p>
            </div>

            <div className="bg-[#FDF6E9] border border-[#141413]/20 rounded-lg px-2.5 py-2 min-w-0">
              <p className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-[#141413]/55 leading-none">
                HSD
              </p>
              <p className="font-mono text-[13px] font-bold text-[#0F5C56] tabular-nums mt-1 leading-tight">
                {product.shortExpiry}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-[#141413]/25 my-3" />

          <p className="text-[13px] font-medium leading-relaxed text-[#141413] break-words">
            {product.summary}
          </p>
        </section>

        {/* Nút bấm rõ ràng để mở xác thực mã lô */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('toggle');
            playSound('success');
            setShowBatchModal(true);
          }}
          className="w-full shrink-0 rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] border-2 border-[#141413] shadow-[3px_3px_0_#141413] px-3.5 py-2.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-between gap-2 transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2 min-w-0">
            <ScanBarcode className="w-4 h-4 text-[#141413] shrink-0" />
            <span className="font-mono text-[11px] font-bold text-[#141413] leading-tight text-left break-words">
              Xác thực nguồn gốc • Lô {product.batchNo}
            </span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#141413] text-[#FFD166] font-mono text-[10.5px] font-bold shrink-0 whitespace-nowrap">
            Kiểm tra →
          </span>
        </button>

        {/* Đánh giá ẩn danh (tính điểm trung bình động & hiển thị toàn bộ đánh giá) */}
        {product.reviews.length > 0 && (() => {
          const avgRating = (
            product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          ).toFixed(1);

          return (
            <section
              aria-label="Đánh giá ẩn danh"
              className="space-y-2 shrink-0 pb-1"
            >
              <div className="flex items-center justify-between gap-2 px-0.5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#141413]/70">
                  ĐÁNH GIÁ ẨN DANH ({product.reviews.length})
                </p>
                <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-bold text-[#141413] bg-[#FFD166] px-2 py-0.5 rounded-md border border-[#141413]">
                  <Star className="w-3 h-3 fill-[#141413]" />
                  <span>{avgRating}/5</span>
                </span>
              </div>

              <div className="space-y-2">
                {product.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-2.5 rounded-xl bg-white border-2 border-[#141413] space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] font-bold text-[#0F5C56]">
                      <span>
                        {review.author} • {review.district} · {review.verifiedDate}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[#141413] shrink-0">
                        <Star className="w-3 h-3 fill-[#FFD166]" />
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-[12px] font-medium text-[#141413] leading-snug break-words">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}
      </main>

      {/* Thanh chọn số lượng, Xoá (nếu đã có trong túi) & Thêm vào túi */}
      <footer className="shrink-0 bg-[#FDF6E9] border-t-[2.5px] border-[#141413] px-3.5 py-2 flex items-center gap-2">
        <div className="flex items-center border-[2.5px] border-[#141413] rounded-xl bg-white shadow-[2px_2px_0_#141413] h-[42px] shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap');
              playSound('click');
              setQuantity((q) => Math.max(1, q - 1));
            }}
            aria-label="Giảm số lượng"
            className="w-8 h-full flex items-center justify-center text-[#141413] hover:bg-[#FFD166] rounded-l-[9px] cursor-pointer transition-colors"
          >
            <Minus className="w-3.5 h-3.5 stroke-[2.8]" />
          </button>
          <span className="w-7 text-center font-mono text-[13.5px] font-bold text-[#141413] tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap');
              playSound('click');
              setQuantity((q) => Math.min(5, q + 1));
            }}
            aria-label="Tăng số lượng"
            className="w-8 h-full flex items-center justify-center text-[#141413] hover:bg-[#FFD166] rounded-r-[9px] cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
          </button>
        </div>

        {inCartQty > 0 && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Xoá ${product.shortName} khỏi túi`}
            title={`Xoá khỏi túi (${inCartQty})`}
            className="h-[42px] px-2.5 rounded-xl bg-white hover:bg-[#F26B50] border-[2.5px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-mono text-[11px] font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 stroke-[2.4]" />
            <span>Xoá ({inCartQty})</span>
          </button>
        )}

        {!addedFeedback ? (
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 min-w-0 min-h-[42px] px-3.5 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[13.5px] font-bold flex items-center justify-center transition-all cursor-pointer"
          >
            <span>Thêm vào túi</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onGoToCheckout}
            className="flex-1 min-w-0 min-h-[42px] px-3.5 rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-display text-[13px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <span>Thanh toán</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        )}
      </footer>

      {/* Popover Kiểm tra mã lô & Thành phần (không dùng bảng hay danh sách chấm đầu dòng) */}
      {showBatchModal && (
        <div
          onClick={() => setShowBatchModal(false)}
          className="absolute inset-0 z-40 bg-[#141413]/70 p-4 flex items-center justify-center animate-spring-pop"
          role="dialog"
          aria-modal="true"
          aria-label="Xác thực mã lô sản phẩm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#FDF6E9] border-[3px] border-[#141413] rounded-2xl shadow-[5px_5px_0_#141413] overflow-hidden"
          >
            <div className="bg-[#95D5B2] border-b-[2.5px] border-[#141413] px-4 py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PharmacySealSvg className="w-7 h-7 shrink-0" />
                <div>
                  <p className="font-mono text-[10px] font-bold text-[#0F5C56]">
                    ĐÃ XÁC THỰC CHÍNH HÃNG
                  </p>
                  <p className="font-display text-[14px] font-extrabold text-[#141413]">
                    Mã lô {product.batchNo}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                aria-label="Đóng kiểm tra mã lô"
                className="w-8 h-8 rounded-lg bg-white border-[2px] border-[#141413] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-[12px]">
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="rounded-full bg-white border-[2px] border-[#141413] px-3 py-1.5 flex items-center justify-between gap-1">
                  <span className="text-[#141413]/65">Công bố</span>
                  <span className="font-bold text-[#0F5C56]">{product.mohLicenseNo}</span>
                </div>
                <div className="rounded-full bg-[#FFD166] border-[2px] border-[#141413] px-3 py-1.5 flex items-center justify-between gap-1">
                  <span className="text-[#141413]/75">Hạn</span>
                  <span className="font-bold text-[#141413]">{product.shortExpiry}</span>
                </div>
              </div>

              <div className="rounded-xl bg-white border-[2px] border-[#141413] p-3 space-y-2">
                <p className="font-mono text-[10.5px] font-bold text-[#0F5C56]">
                  Thành phần &amp; chất bôi trơn ({product.lubricant})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.keyIngredients.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDF6E9] border-[1.5px] border-[#141413] text-[11px] font-semibold text-[#141413] leading-snug"
                    >
                      <Check className="w-3 h-3 text-[#0F5C56] stroke-[3] shrink-0" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#0F5C56]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Xuất trực tiếp từ {product.pharmacyPartner}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
