export type ScreenId =
  | 'guest-home'
  | 'fit-quiz'
  | 'product-detail'
  | 'checkout'
  | 'otp-pickup';

export type DeliveryMethod = 'locker' | 'courier';
export type EWalletType = 'Momo' | 'ZaloPay' | 'VietQR';

export interface ProductReview {
  id: string;
  author: string;
  district: string;
  rating: number;
  comment: string;
  verifiedDate: string;
}

export interface Product {
  id: string;
  name: string;
  shortName: string;
  packSize: string;
  priceVnd: number;
  pharmacyPartner: string;
  district: string;
  mohLicenseNo: string;
  batchNo: string;
  expiryDate: string;
  category: 'protection' | 'hydration';
  nominalWidth: string;
  shortWidth: string;
  thickness: string;
  shortThickness: string;
  material: string;
  shortMaterial: string;
  shortExpiry: string;
  lubricant: string;
  highlightBadge: string;
  keyIngredients: string[];
  summary: string;
  fitTags: string[];
  accentTone: 'teal' | 'sage' | 'slate' | 'coral';
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface QuizAnswers {
  sizeFit: string;
  priority: string;
  budget: string;
}

export interface QuizMatchResult {
  product: Product;
  matchLabel: string;
  reasons: string[];
}

export interface SituationGuide {
  id: string;
  tag: string;
  title: string;
  bullets: [string, string, string];
  recommendedProductId: string;
  reasonBadge: string;
}

export type DistrictFilter =
  | 'ALL'
  | 'Q.1'
  | 'Q.3'
  | 'Q.7'
  | 'Q.10'
  | 'Bình Thạnh'
  | 'Gò Vấp'
  | 'Tân Bình'
  | 'Thủ Đức';

export interface SmartLockerLocation {
  id: string;
  lockerCode: string;
  name: string;
  district: string;
  districtShort: Exclude<DistrictFilter, 'ALL'>;
  addressHint: string;
  openHours: string;
  availableSlots: number;
  lat: number;
  lng: number;
  /** Percentage coordinates (0-100) on the HCMC Zine SVG map canvas */
  mapX: number;
  mapY: number;
}

export interface OrderSnapshot {
  id: string;
  orderCode: string;
  otpDigits: string;
  deliveryMethod: DeliveryMethod;
  lockerLocation: SmartLockerLocation;
  courierAddressHint: string;
  eWallet: EWalletType;
  totalVnd: number;
  readyEstimate: string;
  itemCount: number;
  itemsSummary: string;
  createdAtLabel: string;
  status: 'ready' | 'picked_up';
}
