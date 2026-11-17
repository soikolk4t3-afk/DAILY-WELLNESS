import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  ClipboardList,
  Trash2,
  Ruler,
  Sparkles,
} from 'lucide-react';
import { CartItem, Product } from '../types';
import { formatVnd } from '../data/mockData';
import { PharmacySealSvg, ProductArtwork } from './ProductArtwork';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';

type ShelfFilter = 'all' | 'thin' | 'size' | 'gel-other';

interface Screen2GuestHomeProps {
  products: Product[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  orderCount: number;
  onStartQuiz: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onGoToCheckout: () => void;
  onOpenOrderList: () => void;
  onOpenSizeGuide: (initialTab?: 'guide' | 'situations') => void;
}

const FILTER_TABS: Array<{ id: ShelfFilter; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'thin', label: 'Siêu mỏng' },
  { id: 'size', label: 'Theo Size' },
  { id: 'gel-other', label: 'Gel & Khác' },
];

export const Screen2GuestHome: React.FC<Screen2GuestHomeProps> = ({
  products,
  cart,
  cartCount,
  cartTotal,
  orderCount,
  onStartQuiz,
  onSelectProduct,
  onAddToCart,
  onUpdateQty,
  onRemoveFromCart,
  onClearCart,
  onGoToCheckout,
  onOpenOrderList,
  onOpenSizeGuide,
}) => {
  const { playSound } = useSoundFeedback();
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [shelfFilter, setShelfFilter] = useState<ShelfFilter>('all');
  const addedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current !== null) {
        window.clearTimeout(addedTimerRef.current);
      }
    };
  }, []);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setRecentlyAddedId(product.id);
    if (addedTimerRef.current !== null) {
      window.clearTimeout(addedTimerRef.current);
    }
    addedTimerRef.current = window.setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1000);
  };

  const filteredProducts = useMemo(() => {
    if (shelfFilter === 'thin') {
      return products.filter((p) => p.fitTags.includes('ultra-thin'));
    }
    if (shelfFilter === 'size') {
      const sizeOrder: Record<string, number> = {
        '49mm': 1,
        '52mm': 2,
        '52.5mm': 3,
        '55mm': 4,
      };
      return products
        .filter((p) => p.category === 'protection')
        .sort(
          (a, b) => (sizeOrder[a.shortWidth] ?? 9) - (sizeOrder[b.shortWidth] ?? 9)
        );
    }
    if (shelfFilter === 'gel-other') {
      return products.filter(
        (p) =>
          p.category === 'hydration' ||
          p.fitTags.includes('beginner') ||
          p.fitTags.includes('extra-lubrication')
      );
    }
    return products;
  }, [products, shelfFilter]);

  const tickerText =
    'XUẤT KHO NHÀ THUỐC TP.HCM • TỦ TỰ ĐỘNG 24/7 • GIAO THẢ KHÔNG GỌI ĐIỆN • ';

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9]">
      {/* Marquee mỏng 24px cuộn mượt vô tận, giữ khoảng trắng chuẩn */}
      <div className="shrink-0 w-full h-6 bg-[#141413] text-[#FFD166] border-b-[2px] border-[#141413] overflow-hidden select-none flex items-center">
        <div className="flex w-max shrink-0 items-center animate-marquee font-mono text-[10px] font-bold tracking-wider uppercase whitespace-pre">
          <span className="shrink-0">{tickerText}</span>
          <span className="shrink-0" aria-hidden="true">
            {tickerText}
          </span>
        </div>
      </div>

      {/* Main Scrollable Shelf */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-3.5 space-y-3">
        {/* Thẻ Chọn đúng Size & Gu (30s) gọn sạch không rớt chữ */}
        <section
          data-tutorial-target="quiz-banner"
          aria-label="Chọn đúng Size và Gu trong 30 giây"
          className="animate-spring-pop rounded-2xl bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-3.5 space-y-2.5"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PharmacySealSvg className="w-5 h-5 shrink-0" />
              <h1 className="font-display text-[17px] font-extrabold text-[#141413] leading-tight">
                Chọn đúng Size &amp; Gu (30s)
              </h1>
            </div>
            <p className="text-[12px] font-semibold text-[#141413]/85 leading-snug">
              Trả lời 3 câu hỏi • Gợi ý chuẩn kích cỡ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap');
                onStartQuiz();
              }}
              className="min-h-[36px] px-3 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-2 border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[12px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span>Chọn giúp tôi</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onOpenSizeGuide('situations')}
              className="min-h-[36px] px-2.5 rounded-xl bg-[#95D5B2] hover:bg-white border-2 border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-mono text-[10.5px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0F5C56] shrink-0" />
              <span>Tình huống (5)</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenSizeGuide('guide')}
              className="min-h-[36px] px-2.5 rounded-xl bg-white hover:bg-[#95D5B2] border-2 border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-mono text-[10.5px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Ruler className="w-3.5 h-3.5 text-[#0F5C56] shrink-0" />
              <span>Cách đo size</span>
            </button>
          </div>
        </section>

        {/* Kệ nhà thuốc TP.HCM */}
        <section aria-label="Kệ nhà thuốc TP.HCM" className="space-y-2.5 min-w-0">
          <div className="flex items-center justify-between gap-2 border-b-[2px] border-[#141413] pb-1.5">
            <h2 className="font-display text-[14.5px] font-extrabold text-[#141413]">
              Kệ nhà thuốc TP.HCM ({filteredProducts.length})
            </h2>
          </div>

          {/* Filter Chips ngang gọn */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5"
            role="tablist"
            aria-label="Lọc nhanh sản phẩm"
          >
            {FILTER_TABS.map((tab) => {
              const active = shelfFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    triggerHaptic('toggle');
                    playSound('toggle');
                    setShelfFilter(tab.id);
                  }}
                  className={`min-h-[30px] px-2.5 rounded-full border-2 border-[#141413] font-mono text-[10.5px] font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#141413] text-[#FFD166] shadow-none'
                      : 'bg-white text-[#141413] shadow-[2px_2px_0_#141413] hover:bg-[#FDF6E9]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-2.5">
            {filteredProducts.map((product, index) => {
              const isAdded = recentlyAddedId === product.id;
              const qtyInCart =
                cart.find((item) => item.product.id === product.id)?.quantity ??
                0;

              return (
                <article
                  key={product.id}
                  data-tutorial-target={index === 0 ? 'first-product-card' : undefined}
                  onClick={() => onSelectProduct(product)}
                  className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] hover:bg-[#FFFDF8] p-2.5 flex items-center gap-2.5 transition-all cursor-pointer min-w-0"
                >
                  <ProductArtwork product={product} size="sm" />

                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#95D5B2]/60 border border-[#141413]/40 font-mono text-[9.5px] font-bold text-[#141413] leading-none mb-1">
                      {product.highlightBadge}
                    </span>
                    <h3 className="font-display text-[14px] font-extrabold text-[#141413] leading-snug line-clamp-2 break-words">
                      {product.shortName}
                    </h3>
                    <p className="text-[11px] font-medium text-[#141413]/75 mt-0.5 leading-snug break-words">
                      {product.pharmacyPartner} · {product.packSize}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="font-mono text-[13px] font-bold text-[#141413] tabular-nums">
                      {formatVnd(product.priceVnd)}
                    </span>

                    {qtyInCart > 0 ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center border-[2px] border-[#141413] rounded-lg bg-[#FDF6E9] shadow-[2px_2px_0_#141413] h-[32px] overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (qtyInCart === 1) {
                              onRemoveFromCart(product.id);
                            } else {
                              onUpdateQty(product.id, -1);
                            }
                          }}
                          aria-label={
                            qtyInCart === 1
                              ? `Xoá ${product.shortName} khỏi túi`
                              : `Giảm số lượng ${product.shortName}`
                          }
                          className="w-7 h-full flex items-center justify-center text-[#141413] hover:bg-[#F26B50] cursor-pointer transition-colors"
                        >
                          {qtyInCart === 1 ? (
                            <Trash2 className="w-3.5 h-3.5" />
                          ) : (
                            <Minus className="w-3 h-3 stroke-[2.8]" />
                          )}
                        </button>
                        <span className="w-6 text-center font-mono text-[12px] font-bold text-[#0F5C56] tabular-nums">
                          {qtyInCart}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateQty(product.id, 1);
                          }}
                          aria-label={`Tăng số lượng ${product.shortName}`}
                          className="w-7 h-full flex items-center justify-center text-[#141413] hover:bg-[#95D5B2] cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3 stroke-[2.8]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        aria-label={`Thêm ${product.shortName} vào túi`}
                        className={`min-w-[64px] min-h-[32px] px-2 rounded-lg border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-mono text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-[#0F5C56] text-white'
                            : 'bg-[#95D5B2] hover:bg-[#FFD166] text-[#141413]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 stroke-[2.6]" />
                            <span>Đã thêm</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 stroke-[2.6]" />
                            <span>Thêm</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* Bottom Bar: Túi hàng & Xoá nhanh & Đơn của bạn (N) */}
      {(cartCount > 0 || orderCount > 0) && (
        <footer className="shrink-0 px-3.5 py-2.5 bg-[#FDF6E9] border-t-[2.5px] border-[#141413] flex items-center gap-2">
          {cartCount > 0 && (
            <>
              <button
                type="button"
                onClick={onClearCart}
                aria-label="Xoá hết sản phẩm trong túi"
                title="Xoá hết túi"
                className="w-[44px] h-[44px] shrink-0 rounded-xl bg-white hover:bg-[#F26B50] border-[2.5px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] flex items-center justify-center transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4 stroke-[2.3]" />
              </button>
              <button
                type="button"
                onClick={onGoToCheckout}
                className="flex-1 min-w-0 min-h-[44px] px-3.5 rounded-xl bg-[#141413] hover:bg-[#262624] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#0F5C56] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] flex items-center justify-between gap-2 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-mono text-[11.5px] font-bold">
                  <ShoppingBag className="w-4 h-4 text-[#FFD166] shrink-0" />
                  <span className="tabular-nums">Túi ({cartCount})</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[12.5px] font-bold text-[#95D5B2] tabular-nums shrink-0">
                  <span>{formatVnd(cartTotal)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </>
          )}

          {orderCount > 0 && (
            <button
              type="button"
              onClick={onOpenOrderList}
              className={`${
                cartCount > 0 ? 'shrink-0 px-3' : 'flex-1 px-4 justify-between'
              } min-h-[44px] rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-mono text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap`}
            >
              <span className="flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>Đơn của bạn ({orderCount})</span>
              </span>
              {cartCount === 0 && <ArrowRight className="w-3.5 h-3.5 shrink-0" />}
            </button>
          )}
        </footer>
      )}
    </div>
  );
};
