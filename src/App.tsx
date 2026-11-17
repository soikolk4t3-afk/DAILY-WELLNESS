/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CartItem,
  DeliveryMethod,
  DistrictFilter,
  EWalletType,
  OrderSnapshot,
  Product,
  ScreenId,
  SmartLockerLocation,
} from './types';
import {
  DEFAULT_COURIER_HINT,
  PRODUCTS,
  SMART_LOCKER_LOCATIONS,
} from './data/mockData';
import { triggerHaptic } from './utils/haptics';
import { useSoundFeedback } from './hooks/useSoundFeedback';
import { PhoneFrame } from './components/PhoneFrame';
import { GlobalHeader } from './components/GlobalHeader';
import { PanicDecoyScreen } from './components/PanicDecoyScreen';
import { MaskedCourierTutorialOverlay } from './components/MaskedCourierTutorialOverlay';
import { OrderListOverlay } from './components/OrderListOverlay';
import { SizeGuideFaqModal } from './components/SizeGuideFaqModal';
import { Screen2GuestHome } from './components/Screen2GuestHome';
import { Screen3FitQuiz } from './components/Screen3FitQuiz';
import { Screen4ProductDetail } from './components/Screen4ProductDetail';
import { Screen5StealthCheckout } from './components/Screen5StealthCheckout';
import { Screen6OtpPickup } from './components/Screen6OtpPickup';
import {
  InteractiveTutorialOverlay,
  TUTORIAL_STEP_COUNT,
} from './components/InteractiveTutorialOverlay';

const SESSION_KEYS = {
  cart: 'dw_session_cart',
  orders: 'dw_session_orders',
  activeOrderId: 'dw_session_active_order_id',
  deliveryMethod: 'dw_session_delivery_method',
  selectedLocker: 'dw_session_selected_locker',
  districtFilter: 'dw_session_district_filter',
  eWallet: 'dw_session_ewallet',
  courierHint: 'dw_session_courier_hint',
} as const;

const TUTORIAL_COMPLETED_KEY = 'dw_tutorial_completed';

function readSessionJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeSessionJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('guest-home');
  const [returnScreen, setReturnScreen] = useState<ScreenId>('guest-home');
  const [panicDecoyActive, setPanicDecoyActive] = useState<boolean>(false);
  const [tutorialActive, setTutorialActive] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(0);
  const phoneFrameRef = useRef<HTMLDivElement | null>(null);
  const hasAutoTriggeredTutorialRef = useRef<boolean>(false);

  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [cart, setCart] = useState<CartItem[]>(() =>
    readSessionJson<CartItem[]>(SESSION_KEYS.cart, [])
  );
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(() =>
    readSessionJson<DeliveryMethod>(SESSION_KEYS.deliveryMethod, 'locker')
  );
  const [selectedLocker, setSelectedLocker] =
    useState<SmartLockerLocation | null>(() =>
      readSessionJson<SmartLockerLocation | null>(
        SESSION_KEYS.selectedLocker,
        SMART_LOCKER_LOCATIONS[0]
      )
    );
  const [districtFilter, setDistrictFilter] = useState<DistrictFilter>(() =>
    readSessionJson<DistrictFilter>(SESSION_KEYS.districtFilter, 'ALL')
  );
  const [eWallet, setEWallet] = useState<EWalletType>(() =>
    readSessionJson<EWalletType>(SESSION_KEYS.eWallet, 'Momo')
  );
  const [courierHint, setCourierHint] = useState<string>(() =>
    readSessionJson<string>(SESSION_KEYS.courierHint, DEFAULT_COURIER_HINT)
  );

  // Danh sách đơn hàng tạm trong phiên (chỉ sessionStorage, KHÔNG localStorage, xóa sạch khi Wipe)
  const [orders, setOrders] = useState<OrderSnapshot[]>(() =>
    readSessionJson<OrderSnapshot[]>(SESSION_KEYS.orders, [])
  );
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() =>
    readSessionJson<string | null>(SESSION_KEYS.activeOrderId, null)
  );
  const [showOrdersModal, setShowOrdersModal] = useState<boolean>(false);

  const [showCourierTutorial, setShowCourierTutorial] = useState<boolean>(false);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [sizeGuideTab, setSizeGuideTab] = useState<'guide' | 'situations'>(
    'guide'
  );

  const { playSound } = useSoundFeedback();

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.product.priceVnd * item.quantity, 0),
    [cart]
  );

  const activeOrder = useMemo(
    () => orders.find((o) => o.id === activeOrderId) ?? orders[0] ?? null,
    [orders, activeOrderId]
  );

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.cart, cart);
  }, [cart]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.orders, orders);
  }, [orders]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.activeOrderId, activeOrderId);
  }, [activeOrderId]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.deliveryMethod, deliveryMethod);
  }, [deliveryMethod]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.selectedLocker, selectedLocker);
  }, [selectedLocker]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.districtFilter, districtFilter);
  }, [districtFilter]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.eWallet, eWallet);
  }, [eWallet]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.courierHint, courierHint);
  }, [courierHint]);

  useEffect(() => {
    if (!panicDecoyActive && screen === 'otp-pickup' && !activeOrder) {
      setScreen('guest-home');
    }
  }, [panicDecoyActive, screen, activeOrder]);

  useEffect(() => {
    if (hasAutoTriggeredTutorialRef.current) return;
    if (screen !== 'guest-home' || panicDecoyActive) return;

    let completed = false;
    try {
      completed = window.localStorage.getItem(TUTORIAL_COMPLETED_KEY) === 'true';
    } catch {
      completed = false;
    }

    if (completed) {
      hasAutoTriggeredTutorialRef.current = true;
      return;
    }

    const timerId = window.setTimeout(() => {
      hasAutoTriggeredTutorialRef.current = true;
      setTutorialStep(0);
      setTutorialActive(true);
    }, 350);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [screen, panicDecoyActive]);

  const navigateTo = (nextScreen: ScreenId) => {
    playSound('transition');
    setScreen(nextScreen);
  };

  const handleOpenCourierTutorial = () => {
    triggerHaptic('tap');
    playSound('transition');
    setShowCourierTutorial(true);
  };

  const handleOpenSizeGuide = (initialTab: 'guide' | 'situations' = 'guide') => {
    triggerHaptic('tap');
    playSound('transition');
    setSizeGuideTab(initialTab);
    setShowSizeGuide(true);
  };

  const handleAddToCart = (product: Product, qty = 1) => {
    triggerHaptic('success');
    playSound('success');
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(9, i.quantity + qty) }
            : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    if (delta < 0) {
      triggerHaptic('tap');
    } else {
      triggerHaptic('toggle');
    }
    playSound('toggle');
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    triggerHaptic('warning');
    playSound('toggle');
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    triggerHaptic('warning');
    playSound('toggle');
    setCart([]);
  };

  const handleViewProduct = (product: Product, origin: ScreenId) => {
    triggerHaptic('tap');
    setSelectedProduct(product);
    setReturnScreen(origin);
    navigateTo('product-detail');
  };

  const handleConfirmOrder = () => {
    triggerHaptic('success');
    playSound('success');
    const fee = deliveryMethod === 'locker' ? 0 : 18000;
    const totalVnd = cartSubtotal + fee;
    const partA = Math.floor(100 + Math.random() * 899);
    const partB = Math.floor(100 + Math.random() * 899);
    const orderNum = 8821 + orders.length + cartCount;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    const itemsSummary =
      cart.length > 0
        ? cart.map((c) => `${c.product.shortName} ×${c.quantity}`).join(', ')
        : 'Sản phẩm chăm sóc';

    const newOrder: OrderSnapshot = {
      id: `ord-${Date.now()}`,
      orderCode: `DW-${orderNum}`,
      otpDigits: orders.length === 0 ? '492 - 817' : `${partA} - ${partB}`,
      deliveryMethod,
      lockerLocation: selectedLocker ?? SMART_LOCKER_LOCATIONS[0],
      courierAddressHint: courierHint.trim() || DEFAULT_COURIER_HINT,
      eWallet,
      totalVnd,
      readyEstimate:
        deliveryMethod === 'locker'
          ? 'Sẵn sàng sau 20 phút'
          : 'Giao thả 30 phút',
      itemCount: cartCount,
      itemsSummary,
      createdAtLabel: `${hh}:${mm}`,
      status: 'ready',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    setCart([]);
    setScreen('otp-pickup');
  };

  const handleToggleOrderPickedUp = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: o.status === 'ready' ? 'picked_up' : 'ready' }
          : o
      )
    );
  };

  const handleOpenOrderFromList = (order: OrderSnapshot) => {
    setActiveOrderId(order.id);
    setShowOrdersModal(false);
    setScreen('otp-pickup');
  };

  const handleCloseAndSaveTutorial = () => {
    try {
      window.localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
    hasAutoTriggeredTutorialRef.current = true;
    setTutorialActive(false);
    setTutorialStep(0);
  };

  const handleOpenTutorialFromHeader = () => {
    playSound('transition');
    setShowOrdersModal(false);
    setShowCourierTutorial(false);
    setShowSizeGuide(false);
    setPanicDecoyActive(false);
    setScreen('guest-home');
    setTutorialStep(0);
    setTutorialActive(true);
  };

  const handleWipeAllTraces = () => {
    triggerHaptic('success');
    playSound('success');
    try {
      window.sessionStorage.clear();
      window.localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
    } catch {
      // Ignore storage errors
    }
    hasAutoTriggeredTutorialRef.current = true;
    setTutorialActive(false);
    setTutorialStep(0);
    setCart([]);
    setOrders([]);
    setActiveOrderId(null);
    setShowOrdersModal(false);
    setSelectedProduct(PRODUCTS[0]);
    setDeliveryMethod('locker');
    setSelectedLocker(SMART_LOCKER_LOCATIONS[0]);
    setDistrictFilter('ALL');
    setEWallet('Momo');
    setCourierHint(DEFAULT_COURIER_HINT);
    setPanicDecoyActive(false);
    setShowCourierTutorial(false);
    setShowSizeGuide(false);
    setScreen('guest-home');
  };

  return (
    <PhoneFrame containerRef={phoneFrameRef}>
      {/* Header chung khóa cố định ở trên */}
      {!panicDecoyActive && (
        <GlobalHeader
          cartCount={cartCount}
          onPanicHide={() => {
            triggerHaptic('warning');
            playSound('alert');
            setShowOrdersModal(false);
            setShowCourierTutorial(false);
            setShowSizeGuide(false);
            setPanicDecoyActive(true);
          }}
          onOpenCart={() => navigateTo('checkout')}
          onOpenTutorial={handleOpenTutorialFromHeader}
          showCartButton={screen !== 'checkout' && screen !== 'otp-pickup'}
        />
      )}

      {/* Khung thân màn hình độc lập với GlobalHeader */}
      <div className="relative flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        {/* Màn hình ngụy trang khi bấm ẨN NHANH (có nút Quay lại cửa hàng rõ ràng) */}
        {panicDecoyActive && (
          <PanicDecoyScreen
            onReturnToStore={() => setPanicDecoyActive(false)}
          />
        )}

        {/* Màn hình 2: Trang chủ ẩn danh */}
        {!panicDecoyActive && screen === 'guest-home' && (
          <Screen2GuestHome
            products={PRODUCTS}
            cart={cart}
            cartCount={cartCount}
            cartTotal={cartSubtotal}
            orderCount={orders.length}
            onStartQuiz={() => navigateTo('fit-quiz')}
            onSelectProduct={(p) => handleViewProduct(p, 'guest-home')}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onUpdateQty={handleUpdateQty}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onGoToCheckout={() => navigateTo('checkout')}
            onOpenOrderList={() => {
              triggerHaptic('tap');
              playSound('transition');
              setShowOrdersModal(true);
            }}
            onOpenSizeGuide={handleOpenSizeGuide}
          />
        )}

        {/* Màn hình 3: Quiz 30s tức thì */}
        {!panicDecoyActive && screen === 'fit-quiz' && (
          <Screen3FitQuiz
            onBackHome={() => navigateTo('guest-home')}
            onViewProduct={(p) => handleViewProduct(p, 'fit-quiz')}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onGoToCheckout={() => navigateTo('checkout')}
          />
        )}

        {/* Màn hình 4: Chi tiết sản phẩm gọn */}
        {!panicDecoyActive && screen === 'product-detail' && (
          <Screen4ProductDetail
            product={selectedProduct}
            inCartQty={
              cart.find((item) => item.product.id === selectedProduct.id)
                ?.quantity ?? 0
            }
            onBack={() => navigateTo(returnScreen)}
            onAddToCart={(p, qty) => handleAddToCart(p, qty)}
            onRemoveFromCart={handleRemoveFromCart}
            onGoToCheckout={() => navigateTo('checkout')}
            onOpenSizeGuide={() => handleOpenSizeGuide('guide')}
          />
        )}

        {/* Màn hình 5: Thanh toán kín 2 bước */}
        {!panicDecoyActive && screen === 'checkout' && (
          <Screen5StealthCheckout
            cart={cart}
            deliveryMethod={deliveryMethod}
            selectedLocker={selectedLocker}
            districtFilter={districtFilter}
            eWallet={eWallet}
            courierHint={courierHint}
            orderCount={orders.length}
            onUpdateQty={handleUpdateQty}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onChangeDeliveryMethod={setDeliveryMethod}
            onSelectLocker={setSelectedLocker}
            onChangeDistrictFilter={setDistrictFilter}
            onChangeEWallet={setEWallet}
            onChangeCourierHint={setCourierHint}
            onConfirmOrder={handleConfirmOrder}
            onBackToCatalog={() => navigateTo('guest-home')}
            onOpenCourierTutorial={handleOpenCourierTutorial}
            onOpenOrderList={() => {
              triggerHaptic('tap');
              playSound('transition');
              setShowOrdersModal(true);
            }}
          />
        )}

        {/* Màn hình 6: Mã OTP nhận hàng & Vị trí tủ */}
        {!panicDecoyActive && screen === 'otp-pickup' && activeOrder && (
          <Screen6OtpPickup
            order={activeOrder}
            orderCount={orders.length}
            onSaveAndHome={() => navigateTo('guest-home')}
            onOpenOrderList={() => {
              triggerHaptic('tap');
              playSound('transition');
              setShowOrdersModal(true);
            }}
            onWipeComplete={handleWipeAllTraces}
          />
        )}

        {/* Lớp phủ Hướng dẫn Giao che tên */}
        {!panicDecoyActive && showCourierTutorial && (
          <MaskedCourierTutorialOverlay
            sampleProductName={cart[0]?.product.name}
            orderCode={
              activeOrder?.orderCode ?? `DW-${8821 + orders.length + cartCount}`
            }
            onClose={() => setShowCourierTutorial(false)}
          />
        )}

        {/* Lớp phủ Danh sách đơn tạm trong phiên */}
        {!panicDecoyActive && showOrdersModal && (
          <OrderListOverlay
            orders={orders}
            onClose={() => setShowOrdersModal(false)}
            onOpenOrder={handleOpenOrderFromList}
            onMarkPickedUp={handleToggleOrderPickedUp}
            onWipeAllTraces={handleWipeAllTraces}
          />
        )}

        {/* Lớp phủ Tra cứu Tình huống & Cẩm nang đo Size */}
        {!panicDecoyActive && showSizeGuide && (
          <SizeGuideFaqModal
            initialTab={sizeGuideTab}
            cart={cart}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectProduct={(p) => handleViewProduct(p, screen)}
            onClose={() => setShowSizeGuide(false)}
            onStartQuiz={() => navigateTo('fit-quiz')}
          />
        )}
      </div>

      {/* Hướng dẫn tương tác từng bước (Spotlight Walkthrough) */}
      {tutorialActive && (
        <InteractiveTutorialOverlay
          stepIndex={tutorialStep}
          panicDecoyActive={panicDecoyActive}
          containerRef={phoneFrameRef}
          onNextStep={() =>
            setTutorialStep((s) => Math.min(TUTORIAL_STEP_COUNT - 1, s + 1))
          }
          onExitPanicAndNext={() => {
            setPanicDecoyActive(false);
            setTutorialStep(1);
          }}
          onSkip={handleCloseAndSaveTutorial}
          onComplete={handleCloseAndSaveTutorial}
        />
      )}
    </PhoneFrame>
  );
}
