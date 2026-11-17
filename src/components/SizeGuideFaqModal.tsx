import React, { useEffect, useState } from 'react';
import {
  Check,
  ChevronDown,
  Plus,
  Ruler,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { CartItem, Product } from '../types';
import { PRODUCTS, SITUATION_GUIDES, formatVnd } from '../data/mockData';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';

interface SizeGuideFaqModalProps {
  initialTab?: 'guide' | 'situations';
  cart?: CartItem[];
  onAddToCart?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onClose: () => void;
  onStartQuiz?: () => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  hasSizeChart?: boolean;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'size-15s',
    question: 'Cách đo size nhanh trong 15 giây tại nhà?',
    answer:
      'Quấn sợi dây hoặc thước dây quanh chu vi lúc cương, lấy chu vi (mm) ÷ 2 = độ rộng bao phù hợp (VD: chu vi 10,4cm = 104mm ÷ 2 ≈ 52mm).',
    hasSizeChart: true,
  },
  {
    id: 'thickness-diff',
    question: '0.01mm, 0.03mm, 0.04mm khác nhau thế nào?',
    answer:
      'Đều đạt chuẩn kiểm định điện tử Bộ Y tế. 0.01mm–0.02mm (Polyurethane) mỏng và truyền nhiệt nhanh nhất; 0.03mm–0.04mm là cao su siêu mỏng cân bằng giữa cảm giác thật và giá tiết kiệm.',
  },
  {
    id: 'latex-allergy',
    question: 'Dị ứng cao su (Latex) thì chọn loại nào?',
    answer:
      'Bạn nên chọn chất liệu Polyurethane 100% không chứa Latex như Sagami Original 0.01 hoặc Sagami Original 0.02 Large — không mùi cao su, không gây ngứa rát và cực kỳ lành tính.',
  },
  {
    id: 'privacy-proof',
    question: 'Đặt hàng có lưu lịch sử hay lộ tên trên đơn/sao kê không?',
    answer:
      'Hoàn toàn không. App không cần đăng nhập và không lưu dữ liệu ra máy chủ. Tem bưu kiện chỉ ghi "Sản phẩm chăm sóc", còn sao kê Momo/ZaloPay/VietQR chỉ hiện "HCMC DAILY WELLNESS".',
  },
];

export const SizeGuideFaqModal: React.FC<SizeGuideFaqModalProps> = ({
  initialTab = 'guide',
  cart = [],
  onAddToCart,
  onSelectProduct,
  onClose,
  onStartQuiz,
}) => {
  const { playSound } = useSoundFeedback();
  const [activeTab, setActiveTab] = useState<'guide' | 'situations'>(initialTab);
  const [openIndex, setOpenIndex] = useState<number>(0);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const toggleItem = (idx: number) => {
    triggerHaptic('toggle');
    playSound('toggle');
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-50 bg-[#141413]/75 p-3.5 flex items-center justify-center animate-spring-pop"
      role="dialog"
      aria-modal="true"
      aria-label="Tra cứu tình huống, Cẩm nang đo Size và FAQs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-h-[88dvh] bg-[#FDF6E9] border-[3px] border-[#141413] rounded-2xl shadow-[6px_6px_0_#141413] flex flex-col overflow-hidden"
      >
        {/* Header Modal */}
        <div className="shrink-0 bg-[#FFD166] border-b-[2.5px] border-[#141413] px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0F5C56] border-2 border-[#141413] flex items-center justify-center text-[#FFD166] shrink-0">
              {activeTab === 'situations' ? (
                <Sparkles className="w-4 h-4 stroke-[2.4]" />
              ) : (
                <Ruler className="w-4 h-4 stroke-[2.4]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[9.5px] font-bold uppercase text-[#141413]/75">
                TRA CỨU OFFLINE • 0 GỬI DỮ LIỆU
              </p>
              <h2 className="font-display text-[15px] font-extrabold text-[#141413] leading-tight">
                Tình huống &amp; Đo Size chuẩn
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
            aria-label="Đóng cẩm nang"
            className="w-8 h-8 rounded-lg bg-white border-2 border-[#141413] flex items-center justify-center cursor-pointer hover:bg-[#F26B50] transition-colors shrink-0"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* 2 Tabs chuyển nhanh */}
        <div className="shrink-0 grid grid-cols-2 border-b-[2px] border-[#141413] bg-white">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('toggle');
              playSound('toggle');
              setActiveTab('situations');
            }}
            className={`min-h-[38px] px-2 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 border-r border-[#141413] transition-colors cursor-pointer ${
              activeTab === 'situations'
                ? 'bg-[#95D5B2] text-[#141413]'
                : 'bg-white text-[#141413]/70 hover:bg-[#FDF6E9]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Tình huống (5)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('toggle');
              playSound('toggle');
              setActiveTab('guide');
            }}
            className={`min-h-[38px] px-2 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 border-l border-[#141413] transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-[#95D5B2] text-[#141413]'
                : 'bg-white text-[#141413]/70 hover:bg-[#FDF6E9]'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 shrink-0" />
            <span>Đo Size &amp; FAQs</span>
          </button>
        </div>

        {/* Nội dung chính theo Tab */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-3.5 space-y-2.5">
          {activeTab === 'situations' ? (
            <>
              <p className="font-mono text-[10.5px] font-bold text-[#0F5C56]">
                Tra cứu nhanh theo tình huống thực tế (dựa trên thông số y tế):
              </p>

              {SITUATION_GUIDES.map((sit) => {
                const product = PRODUCTS.find(
                  (p) => p.id === sit.recommendedProductId
                );
                if (!product) return null;
                const qtyInCart =
                  cart.find((c) => c.product.id === product.id)?.quantity ?? 0;

                return (
                  <article
                    key={sit.id}
                    className="rounded-xl bg-white border-2 border-[#141413] shadow-[3px_3px_0_#141413] p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#FFD166] border border-[#141413] font-mono text-[9.5px] font-bold text-[#141413] mb-1">
                          {sit.tag}
                        </span>
                        <h3 className="font-display text-[13.5px] font-extrabold text-[#141413] leading-snug break-words">
                          {sit.title}
                        </h3>
                      </div>
                    </div>

                    <ul className="space-y-1">
                      {sit.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="text-[11.5px] font-medium text-[#141413]/85 flex items-start gap-1.5 leading-snug"
                        >
                          <Check className="w-3.5 h-3.5 text-[#0F5C56] stroke-[2.8] shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-dashed border-[#141413]/25 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!onSelectProduct) return;
                          onClose();
                          onSelectProduct(product);
                        }}
                        className="min-w-0 flex-1 text-left cursor-pointer group"
                      >
                        <p className="font-display text-[12.5px] font-extrabold text-[#0F5C56] group-hover:underline leading-tight break-words">
                          {product.shortName} · {formatVnd(product.priceVnd)}
                        </p>
                        <p className="font-mono text-[10px] font-semibold text-[#141413]/70">
                          {sit.reasonBadge}
                        </p>
                      </button>

                      {onAddToCart && (
                        <button
                          type="button"
                          onClick={() => onAddToCart(product)}
                          className={`min-h-[32px] px-2.5 rounded-lg border-2 border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-mono text-[10.5px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
                            qtyInCart > 0
                              ? 'bg-[#141413] text-[#FFD166]'
                              : 'bg-[#95D5B2] hover:bg-[#FFD166] text-[#141413]'
                          }`}
                        >
                          {qtyInCart > 0 ? (
                            <>
                              <Check className="w-3 h-3 stroke-[2.8]" />
                              <span>Trong túi ({qtyInCart}) +1</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 stroke-[2.8]" />
                              <span>Thêm nhanh</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </>
          ) : (
            FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-white border-2 border-[#141413] shadow-[3px_3px_0_#141413] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    aria-expanded={isOpen}
                    className={`w-full px-3 py-2.5 text-left flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                      isOpen ? 'bg-[#95D5B2]/45' : 'bg-white hover:bg-[#FDF6E9]'
                    }`}
                  >
                    <span className="font-display text-[13px] font-extrabold text-[#141413] leading-snug break-words">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#141413] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-3 py-2.5 border-t border-dashed border-[#141413]/25 space-y-2.5 bg-white">
                      <p className="text-[12px] font-medium text-[#141413]/85 leading-relaxed">
                        {item.answer}
                      </p>

                      {item.hasSizeChart && (
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="rounded-lg bg-[#FDF6E9] border border-[#141413] p-2 text-center">
                            <p className="font-mono text-[10px] font-bold text-[#141413]/70">
                              &lt; 10cm
                            </p>
                            <p className="font-display text-[13.5px] font-extrabold text-[#0F5C56] mt-0.5">
                              49mm
                            </p>
                            <p className="text-[10px] font-semibold text-[#141413]/75">
                              Ôm sát
                            </p>
                          </div>

                          <div className="rounded-lg bg-[#FFD166]/45 border border-[#141413] p-2 text-center">
                            <p className="font-mono text-[10px] font-bold text-[#141413]/75">
                              10–11cm
                            </p>
                            <p className="font-display text-[13.5px] font-extrabold text-[#141413] mt-0.5">
                              52mm
                            </p>
                            <p className="text-[10px] font-semibold text-[#141413]/80">
                              Phổ thông
                            </p>
                          </div>

                          <div className="rounded-lg bg-[#95D5B2]/55 border border-[#141413] p-2 text-center">
                            <p className="font-mono text-[10px] font-bold text-[#141413]/75">
                              &gt; 11cm
                            </p>
                            <p className="font-display text-[13.5px] font-extrabold text-[#0F5C56] mt-0.5">
                              55–56mm
                            </p>
                            <p className="text-[10px] font-semibold text-[#141413]/80">
                              Size lớn
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Modal */}
        <div className="shrink-0 px-3.5 py-2.5 bg-white border-t-2 border-[#141413] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0F5C56]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>0 gửi dữ liệu cá nhân</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onStartQuiz && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartQuiz();
                }}
                className="min-h-[36px] px-3 rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] border-2 border-[#141413] shadow-[2px_2px_0_#141413] font-display text-[12px] font-bold text-[#141413] cursor-pointer"
              >
                Lọc Size 30s →
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-h-[36px] px-3.5 rounded-xl bg-[#0F5C56] text-[#FDF6E9] border-2 border-[#141413] shadow-[2px_2px_0_#141413] font-display text-[12px] font-bold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
