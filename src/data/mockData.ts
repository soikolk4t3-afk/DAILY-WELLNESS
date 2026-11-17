import { Product, QuizAnswers, QuizMatchResult, SmartLockerLocation } from '../types';

export const DEFAULT_COURIER_HINT = 'Bàn bảo vệ KTX Khu B · Biệt danh: Mèo Béo';

export const formatVnd = (amount: number): string => {
  return `${amount.toLocaleString('vi-VN').replace(/,/g, '.')}đ`;
};

export const PRODUCTS: Product[] = [
  {
    id: 'durex-invisible',
    name: 'Durex Invisible Siêu Mỏng',
    shortName: 'Durex Invisible',
    packSize: 'Hộp 10 chiếc',
    priceVnd: 215000,
    pharmacyPartner: 'Xuất kho Q.10',
    district: 'Quận 10',
    mohLicenseNo: 'MOH-HCMC-4419',
    batchNo: 'DX26-0891',
    expiryDate: 'HSD 08/2028',
    category: 'protection',
    nominalWidth: '52mm Tiêu chuẩn',
    shortWidth: '52mm',
    thickness: '0.04mm Siêu mỏng',
    shortThickness: '0.04mm',
    material: 'Cao su thiên nhiên',
    shortMaterial: 'Latex y tế',
    shortExpiry: '08/2028',
    lubricant: 'Silicone mịn không mùi',
    highlightBadge: '52mm • Siêu mỏng 0.04',
    keyIngredients: [
      'Mủ cao su thiên nhiên chuẩn y tế',
      'Chất bôi trơn Dimethicone tinh khiết, không mùi',
      'Không paraben, không chất gây kích ứng',
    ],
    summary:
      'Siêu mỏng 0.04mm cho cảm giác chân thật, giữ trọn độ an toàn chuẩn Bộ Y tế và đóng vỉ bạc mờ kín đáo.',
    fitTags: ['ultra-thin', 'natural-feel', 'mid-range', 'standard-fit'],
    accentTone: 'teal',
    reviews: [
      {
        id: 'rev-1',
        author: 'Khách ẩn danh',
        district: 'Quận 10',
        rating: 5,
        comment:
          'Hộp bọc siêu kín, seal còn nguyên. Ghé tủ Smart Locker gần Bách Khoa lấy mất chưa tới 30s.',
        verifiedDate: '2 ngày trước',
      },
      {
        id: 'rev-2',
        author: 'Khách ẩn danh',
        district: 'Quận 5',
        rating: 5,
        comment:
          'Không bị mùi cao su gắt, kiểm tra mã lô chuẩn nhà thuốc. Đỡ ngại hẳn so với ra tiệm.',
        verifiedDate: '1 tuần trước',
      },
    ],
  },
  {
    id: 'sagami-001',
    name: 'Sagami Original 0.01',
    shortName: 'Sagami Original 0.01',
    packSize: 'Hộp 5 chiếc',
    priceVnd: 290000,
    pharmacyPartner: 'Xuất kho Q.1',
    district: 'Quận 1',
    mohLicenseNo: 'MOH-HCMC-1082',
    batchNo: 'SG26-4120',
    expiryDate: 'HSD 11/2028',
    category: 'protection',
    nominalWidth: '55mm Thoải mái',
    shortWidth: '55mm',
    thickness: '0.01mm Cực mỏng',
    shortThickness: '0.01mm',
    material: 'Polyurethane (Không Latex)',
    shortMaterial: 'Không Latex',
    shortExpiry: '11/2028',
    lubricant: 'Gel silicon êm không mùi',
    highlightBadge: '55mm • 0.01 • Không Latex',
    keyIngredients: [
      'Polyurethane sinh học chuẩn Nhật (100% không Latex)',
      'Không protein cao su — an toàn cho cơ địa dị ứng',
      'Truyền nhiệt nhanh, hoàn toàn không mùi',
    ],
    summary:
      'Dòng 0.01mm chuẩn Nhật cho người dị ứng latex: truyền nhiệt tức thì, siêu bền và hoàn toàn không mùi cao su.',
    fitTags: ['latex-free', 'ultra-thin', 'premium', 'extra-safety'],
    accentTone: 'slate',
    reviews: [
      {
        id: 'rev-3',
        author: 'Khách ẩn danh',
        district: 'Quận 1',
        rating: 5,
        comment:
          'Không kích ứng latex và không mùi cao su. Vỉ đóng kiểu hộp bơ sạch sẽ, kín đáo.',
        verifiedDate: '3 ngày trước',
      },
      {
        id: 'rev-4',
        author: 'Khách ẩn danh',
        district: 'Bình Thạnh',
        rating: 5,
        comment:
          'Sao kê ví chỉ hiện HCMC DAILY WELLNESS. Giao tới nơi nguyên tem nhập khẩu.',
        verifiedDate: '6 ngày trước',
      },
    ],
  },
  {
    id: 'okamoto-003-ha',
    name: 'Okamoto 0.03 Hyaluronic',
    shortName: 'Okamoto 0.03 HA',
    packSize: 'Hộp 10 chiếc',
    priceVnd: 185000,
    pharmacyPartner: 'Xuất kho Q.3',
    district: 'Quận 3',
    mohLicenseNo: 'MOH-HCMC-3174',
    batchNo: 'OK26-7734',
    expiryDate: 'HSD 05/2028',
    category: 'protection',
    nominalWidth: '52mm Tiêu chuẩn',
    shortWidth: '52mm',
    thickness: '0.03mm Siêu mỏng',
    shortThickness: '0.03mm',
    material: 'Cao su thiên nhiên mỏng',
    shortMaterial: 'Latex + HA',
    shortExpiry: '05/2028',
    lubricant: 'Cấp ẩm Hyaluronic Acid',
    highlightBadge: '52mm • Cấp ẩm HA êm mượt',
    keyIngredients: [
      'Tinh chất dưỡng ẩm Hyaluronic Acid dịu nhẹ',
      'Nền nước tinh khiết, rửa sạch nhanh',
      'Cao su siêu mỏng đã kiểm nghiệm da liễu',
    ],
    summary:
      'Phủ sẵn Hyaluronic Acid giúp cấp ẩm mượt mà, giảm ma sát cực êm với mức giá dễ chịu cho sinh viên.',
    fitTags: ['comfort', 'extra-lubrication', 'student-budget', 'sensitive'],
    accentTone: 'sage',
    reviews: [
      {
        id: 'rev-5',
        author: 'Khách ẩn danh',
        district: 'Quận 3',
        rating: 5,
        comment:
          'Êm và ẩm mượt, không bị bết rít. Hộp 10 cái tầm giá này rất ổn cho sinh viên.',
        verifiedDate: 'Hôm qua',
      },
      {
        id: 'rev-6',
        author: 'Khách ẩn danh',
        district: 'Thủ Đức',
        rating: 5,
        comment:
          '10 giờ tối ghé tủ KTX Khu B lấy hàng gọn ơ, không gặp ai mà tem Okamoto chuẩn xịn.',
        verifiedDate: '5 ngày trước',
      },
    ],
  },
  {
    id: 'durex-naturals',
    name: 'Durex Naturals Gel Gốc Nước',
    shortName: 'Durex Naturals Gel',
    packSize: 'Chai 100ml',
    priceVnd: 160000,
    pharmacyPartner: 'Xuất kho Thủ Đức',
    district: 'Thủ Đức',
    mohLicenseNo: 'MOH-HCMC-7805',
    batchNo: 'DN26-2209',
    expiryDate: 'HSD 09/2028',
    category: 'hydration',
    nominalWidth: 'Chai 100ml',
    shortWidth: '100ml',
    thickness: 'Cân bằng pH',
    shortThickness: 'pH dịu nhẹ',
    material: '100% Gốc nước tự nhiên',
    shortMaterial: 'Gốc nước',
    shortExpiry: '09/2028',
    lubricant: 'Prebiotic dưỡng ẩm',
    highlightBadge: 'Gốc nước pH cân bằng',
    keyIngredients: [
      '100% thành phần có nguồn gốc tự nhiên',
      'Lactic acid Prebiotic giúp cân bằng pH dịu nhẹ',
      'Không hương liệu, không glycerin, không phẩm màu',
    ],
    summary:
      'Gel bôi trơn gốc nước chuẩn pH kết hợp prebiotic tự nhiên, dịu nhẹ cho da nhạy cảm và an toàn với mọi loại bao.',
    fitTags: ['water-based-gel', 'fragrance-free', 'sensitive', 'student-budget'],
    accentTone: 'coral',
    reviews: [
      {
        id: 'rev-7',
        author: 'Khách ẩn danh',
        district: 'Thủ Đức',
        rating: 5,
        comment:
          'Không mùi hóa chất, rửa nước sạch ngay và cực kỳ dịu cho da nhạy cảm.',
        verifiedDate: '4 ngày trước',
      },
      {
        id: 'rev-8',
        author: 'Khách ẩn danh',
        district: 'Quận 10',
        rating: 5,
        comment:
          'Chai bọc chống sốc nằm gọn trong hộp nâu trơn. Bạn cùng phòng nhìn không đoán được.',
        verifiedDate: '1 tuần trước',
      },
    ],
  },
  {
    id: 'okamoto-harmony',
    name: 'Okamoto Harmony Vibra',
    shortName: 'Okamoto Harmony',
    packSize: 'Hộp 10 chiếc',
    priceVnd: 165000,
    pharmacyPartner: 'Xuất kho Q.3',
    district: 'Quận 3',
    mohLicenseNo: 'MOH-HCMC-5120',
    batchNo: 'OH26-3391',
    expiryDate: 'HSD 07/2028',
    category: 'protection',
    nominalWidth: '49mm Ôm sát',
    shortWidth: '49mm',
    thickness: '0.04mm Ôm khít',
    shortThickness: '0.04mm',
    material: 'Cao su thiên nhiên Nhật',
    shortMaterial: 'Latex Nhật',
    shortExpiry: '07/2028',
    lubricant: 'Gel trơn dịu nhẹ có rãnh gân',
    highlightBadge: '49mm • Ôm sát vừa vặn',
    keyIngredients: [
      'Thiết kế size nhỏ 49mm chống tuột hiệu quả',
      'Gân nổi nhẹ tăng cảm giác nhưng vẫn êm ái',
      'Chất bôi trơn dịu nhẹ không mùi hắc',
    ],
    summary:
      'Thiết kế cỡ nhỏ 49mm ôm sát vừa vặn cho người Việt, giúp tự tin chắc chắn và hoàn toàn không bị lỏng tuột.',
    fitTags: ['snug-49', 'student-budget', 'ultra-thin'],
    accentTone: 'sage',
    reviews: [
      {
        id: 'rev-9',
        author: 'Khách ẩn danh',
        district: 'Quận 3',
        rating: 5,
        comment:
          'Cuối cùng cũng tìm được dòng 49mm vừa khít, không bị dư đầu hay tuột như mấy loại 52mm ngoài tiệm.',
        verifiedDate: '3 ngày trước',
      },
    ],
  },
  {
    id: 'sagami-002-large',
    name: 'Sagami Original 0.02 Large',
    shortName: 'Sagami 0.02 Large',
    packSize: 'Hộp 6 chiếc',
    priceVnd: 275000,
    pharmacyPartner: 'Xuất kho Q.1',
    district: 'Quận 1',
    mohLicenseNo: 'MOH-HCMC-2045',
    batchNo: 'SL26-6612',
    expiryDate: 'HSD 12/2028',
    category: 'protection',
    nominalWidth: '55mm Size lớn',
    shortWidth: '55mm',
    thickness: '0.02mm Siêu mỏng',
    shortThickness: '0.02mm',
    material: 'Polyurethane (Không Latex)',
    shortMaterial: 'Không Latex',
    shortExpiry: '12/2028',
    lubricant: 'Gel silicon y tế mịn màng',
    highlightBadge: '55mm • Size lớn / Không Latex',
    keyIngredients: [
      'Độ rộng 55mm rộng rãi, giảm cảm giác bó chặt',
      '100% Polyurethane không chứa Latex chống dị ứng',
      'Siêu mỏng 0.02mm truyền nhiệt tức thì, không mùi',
    ],
    summary:
      'Phiên bản cỡ lớn 55mm bằng Polyurethane không Latex chuẩn Nhật, rộng rãi thoải mái và an toàn tuyệt đối cho da nhạy cảm.',
    fitTags: ['large-55', 'latex-free', 'ultra-thin', 'premium'],
    accentTone: 'slate',
    reviews: [
      {
        id: 'rev-10',
        author: 'Khách ẩn danh',
        district: 'Bình Thạnh',
        rating: 5,
        comment:
          'Đeo dòng phổ thông hay bị hằn đau, đổi qua bản Large 55mm thoải mái hẳn mà lại không dị ứng mùi cao su.',
        verifiedDate: '5 ngày trước',
      },
    ],
  },
  {
    id: 'durex-jeans',
    name: 'Durex Jeans',
    shortName: 'Durex Jeans',
    packSize: 'Hộp 12 chiếc',
    priceVnd: 135000,
    pharmacyPartner: 'Xuất kho Thủ Đức',
    district: 'Thủ Đức',
    mohLicenseNo: 'MOH-HCMC-6398',
    batchNo: 'DJ26-1904',
    expiryDate: 'HSD 10/2028',
    category: 'protection',
    nominalWidth: '52.5mm Easy-On',
    shortWidth: '52.5mm',
    thickness: '0.05mm Bền chắc',
    shortThickness: '0.05mm',
    material: 'Cao su thiên nhiên',
    shortMaterial: 'Latex Easy-On',
    shortExpiry: '10/2028',
    lubricant: 'Silicone mượt dễ mang',
    highlightBadge: '52.5mm • Dễ đeo • Giá tiết kiệm',
    keyIngredients: [
      'Dáng Easy-On dễ đeo trong 5 giây cho người mới',
      'Thêm lượng gel bôi trơn giúp giảm ma sát',
      'Hộp 12 chiếc tiết kiệm, kiểm định điện tử 100%',
    ],
    summary:
      'Thiết kế Easy-On dễ đeo cho người mới bắt đầu, nhiều gel mượt mà cùng mức giá tiết kiệm nhất cho sinh viên.',
    fitTags: ['beginner', 'standard-52', 'student-budget'],
    accentTone: 'teal',
    reviews: [
      {
        id: 'rev-11',
        author: 'Khách ẩn danh',
        district: 'Thủ Đức',
        rating: 5,
        comment:
          'Dễ đeo cực kỳ cho người mới, giá hộp 12 cái rất kinh tế. Nhận ở tủ KTX Khu B siêu kín.',
        verifiedDate: 'Hôm qua',
      },
    ],
  },
];

export const HCMC_CENTER = { lat: 10.7769, lng: 106.6951 };

export const DISTRICT_FILTER_OPTIONS: Array<{
  label: Exclude<import('../types').DistrictFilter, 'ALL'>;
  lat: number;
  lng: number;
  panX: number;
  panY: number;
  scale: number;
}> = [
  { label: 'Q.1', lat: 10.7738, lng: 106.7031, panX: -12, panY: -10, scale: 1.4 },
  { label: 'Q.3', lat: 10.7756, lng: 106.6889, panX: -2, panY: -6, scale: 1.4 },
  { label: 'Q.7', lat: 10.7326, lng: 106.6991, panX: -8, panY: -24, scale: 1.4 },
  { label: 'Q.10', lat: 10.7721, lng: 106.6579, panX: 16, panY: -10, scale: 1.4 },
  { label: 'Bình Thạnh', lat: 10.8019, lng: 106.7147, panX: -16, panY: 8, scale: 1.4 },
  { label: 'Gò Vấp', lat: 10.8222, lng: 106.6874, panX: 6, panY: 20, scale: 1.4 },
  { label: 'Tân Bình', lat: 10.8012, lng: 106.6528, panX: 20, panY: 8, scale: 1.4 },
  { label: 'Thủ Đức', lat: 10.8805, lng: 106.7824, panX: -24, panY: 20, scale: 1.35 },
];

export const SMART_LOCKER_LOCATIONS: SmartLockerLocation[] = [
  {
    id: 'locker-d10',
    lockerCode: 'LK-Q10-04',
    name: 'Tủ Smart Locker ĐH Bách Khoa (Q.10)',
    district: 'Quận 10',
    districtShort: 'Q.10',
    addressHint: '268 Lý Thường Kiệt, P.14, Quận 10 (Cổng sau KTX)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 6,
    lat: 10.7721,
    lng: 106.6579,
    mapX: 28,
    mapY: 66,
  },
  {
    id: 'locker-d3',
    lockerCode: 'LK-Q3-08',
    name: 'Tủ Smart Locker Võ Văn Tần (Q.3)',
    district: 'Quận 3',
    districtShort: 'Q.3',
    addressHint: '192 Võ Văn Tần, P.5, Quận 3 (Kế cửa hàng tiện lợi 24h)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 4,
    lat: 10.7756,
    lng: 106.6889,
    mapX: 48,
    mapY: 57,
  },
  {
    id: 'locker-d1',
    lockerCode: 'LK-Q1-02',
    name: 'Tủ Smart Locker Tôn Thất Thiệp (Q.1)',
    district: 'Quận 1',
    districtShort: 'Q.1',
    addressHint: '42 Tôn Thất Thiệp, P. Bến Nghé, Quận 1 (Sảnh trệt)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 5,
    lat: 10.7738,
    lng: 106.7031,
    mapX: 62,
    mapY: 63,
  },
  {
    id: 'locker-d7',
    lockerCode: 'LK-Q7-09',
    name: 'Tủ Smart Locker Nguyễn Hữu Thọ (Q.7)',
    district: 'Quận 7',
    districtShort: 'Q.7',
    addressHint: '19 Nguyễn Hữu Thọ, P. Tân Phong, Quận 7 (Gần TDTU & RMIT)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 8,
    lat: 10.7326,
    lng: 106.6991,
    mapX: 56,
    mapY: 85,
  },
  {
    id: 'locker-bt',
    lockerCode: 'LK-BT-07',
    name: 'Tủ Smart Locker Nguyễn Gia Trí (Bình Thạnh)',
    district: 'Bình Thạnh',
    districtShort: 'Bình Thạnh',
    addressHint: '69 Nguyễn Gia Trí (D2), P.25, Bình Thạnh (Gần HUTECH)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 7,
    lat: 10.8019,
    lng: 106.7147,
    mapX: 66,
    mapY: 39,
  },
  {
    id: 'locker-gv',
    lockerCode: 'LK-GV-05',
    name: 'Tủ Smart Locker Nguyễn Văn Bảo (Gò Vấp)',
    district: 'Gò Vấp',
    districtShort: 'Gò Vấp',
    addressHint: '12 Nguyễn Văn Bảo, P.4, Gò Vấp (Đối diện ĐH Công Nghiệp IUH)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 6,
    lat: 10.8222,
    lng: 106.6874,
    mapX: 43,
    mapY: 22,
  },
  {
    id: 'locker-tb',
    lockerCode: 'LK-TB-03',
    name: 'Tủ Smart Locker Cộng Hòa (Tân Bình)',
    district: 'Tân Bình',
    districtShort: 'Tân Bình',
    addressHint: '20 Cộng Hòa, P.12, Tân Bình (Sảnh trệt Pico Plaza)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 5,
    lat: 10.8012,
    lng: 106.6528,
    mapX: 18,
    mapY: 40,
  },
  {
    id: 'locker-thuduc',
    lockerCode: 'LK-TD-12',
    name: 'Tủ Smart Locker KTX Khu B (Thủ Đức)',
    district: 'Thủ Đức',
    districtShort: 'Thủ Đức',
    addressHint: 'Khu đô thị ĐHQG TP.HCM, Thủ Đức (Hành lang Cổng 2)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 9,
    lat: 10.8805,
    lng: 106.7824,
    mapX: 84,
    mapY: 21,
  },
];

export const SITUATION_GUIDES: import('../types').SituationGuide[] = [
  {
    id: 'sit-allergy',
    tag: 'DỊ ỨNG LATEX',
    title: 'Ngứa rát hoặc dị ứng mùi cao su tự nhiên',
    bullets: [
      'Chọn chất liệu Polyurethane 100% không chứa protein Latex.',
      'Hoàn toàn không có mùi cao su hắc, dịu nhẹ cho da nhạy cảm.',
      'Siêu mỏng 0.01mm giúp truyền nhiệt tức thì và dẻo dai gấp 3 lần.',
    ],
    recommendedProductId: 'sagami-001',
    reasonBadge: '100% Non-Latex Nhật Bản',
  },
  {
    id: 'sit-beginner',
    tag: 'NGƯỜI MỚI',
    title: 'Lần đầu sử dụng, ngại đeo ngược hoặc sợ rách',
    bullets: [
      'Dáng Easy-On tạo hình sẵn giúp đeo đúng chiều trong 5 giây.',
      'Độ dày chuẩn 0.05mm bền chắc, kiểm định điện tử từng chiếc.',
      'Sẵn lượng gel silicone mịn giúp thao tác êm và không bị khô.',
    ],
    recommendedProductId: 'durex-jeans',
    reasonBadge: 'Dễ đeo • Hộp 12 tiết kiệm',
  },
  {
    id: 'sit-snug',
    tag: 'CHỐNG TUỘT',
    title: 'Dùng size 52mm bị dư đầu hoặc dễ tuột',
    bullets: [
      'Chọn size 49mm ôm sát chuẩn hơn cho chu vi dưới 10cm.',
      'Giữ cố định chắc chắn suốt quá trình, giảm lo lắng tuột bao.',
      'Độ mỏng 0.04mm kết hợp rãnh nhẹ vẫn giữ cảm giác tự nhiên.',
    ],
    recommendedProductId: 'okamoto-harmony',
    reasonBadge: 'Size nhỏ 49mm ôm khít',
  },
  {
    id: 'sit-large',
    tag: 'THOẢI MÁI',
    title: 'Đeo loại thường bị bó chặt, hằn đau vòng gốc',
    bullets: [
      'Độ rộng 55mm rộng rãi hơn, phù hợp chu vi trên 11cm.',
      'Chất liệu Polyurethane mỏng 0.02mm giảm áp lực thắt ở gốc.',
      'Không chứa Latex, an toàn ngay cả khi cơ địa dễ kích ứng.',
    ],
    recommendedProductId: 'sagami-002-large',
    reasonBadge: 'Size lớn 55mm • Không Latex',
  },
  {
    id: 'sit-dryness',
    tag: 'GIẢM MA SÁT',
    title: 'Khô rát, cần bổ sung ẩm dịu nhẹ an toàn',
    bullets: [
      'Gel gốc nước 100% cân bằng pH sinh lý, không gây kích ứng.',
      'Không chứa glycerin hay hương liệu nhân tạo, rửa sạch nhanh.',
      'Tương thích an toàn với cả bao Latex lẫn Polyurethane.',
    ],
    recommendedProductId: 'durex-naturals',
    reasonBadge: 'Gel gốc nước pH cân bằng',
  },
];

export const QUIZ_STEPS = [
  {
    id: 'sizeFit',
    question: 'Độ ôm / Size mong muốn?',
    helper: 'Chọn đúng độ rộng giúp thoải mái, không bị bó hoặc tuột.',
    options: [
      { value: 'snug-49', label: 'Ôm sát (49–50mm)', detail: 'Cỡ nhỏ, ôm khít chắc chắn' },
      { value: 'standard-52', label: 'Phổ thông (52mm)', detail: 'Kích cỡ tiêu chuẩn phổ biến nhất' },
      { value: 'large-55', label: 'Thoải mái / Lớn (55mm+)', detail: 'Rộng rãi, không gây hằn bó' },
    ],
  },
  {
    id: 'priority',
    question: 'Ưu tiên hàng đầu của bạn?',
    helper: 'Lọc trực tiếp theo chất liệu và cảm giác sử dụng.',
    options: [
      { value: 'ultra-thin', label: 'Siêu mỏng chân thật', detail: 'Truyền nhiệt nhanh 0.01–0.04mm' },
      { value: 'non-latex', label: 'Dị ứng mủ cao su (Non-Latex)', detail: '100% Polyurethane không mùi cao su' },
      { value: 'beginner', label: 'Dễ đeo cho người mới', detail: 'Dáng Easy-On dễ mang, bền chắc' },
      { value: 'lubricant', label: 'Giảm ma sát / Gel bôi trơn', detail: 'Cấp ẩm HA mượt hoặc gel gốc nước' },
    ],
  },
  {
    id: 'budget',
    question: 'Ngân sách / Số lượng?',
    helper: 'Tất cả đều xuất kho trực tiếp từ nhà thuốc TP.HCM.',
    options: [
      { value: 'budget', label: 'Tiết kiệm / Thử trước', detail: '135.000đ – 185.000đ' },
      { value: 'premium', label: 'Cao cấp trải nghiệm', detail: '215.000đ – 290.000đ' },
    ],
  },
];

export function matchQuizProducts(answers: QuizAnswers): QuizMatchResult[] {
  const scores: Record<string, { score: number; reasons: string[] }> = {};

  PRODUCTS.forEach((p) => {
    scores[p.id] = { score: 0, reasons: [] };
  });

  // Bước 1: Độ ôm / Size
  if (answers.sizeFit === 'snug-49') {
    scores['okamoto-harmony'].score += 6;
    scores['okamoto-harmony'].reasons.push('Khớp size 49mm ôm sát, chống tuột hiệu quả');
    scores['durex-invisible'].score += 2;
    scores['durex-invisible'].reasons.push('Size 52mm ôm vừa nếu thích mỏng nhẹ');
    scores['durex-naturals'].score += 1;
  } else if (answers.sizeFit === 'standard-52') {
    scores['durex-invisible'].score += 5;
    scores['durex-invisible'].reasons.push('Khớp size 52mm phổ thông vừa vặn');
    scores['okamoto-003-ha'].score += 5;
    scores['okamoto-003-ha'].reasons.push('Khớp size 52mm tiêu chuẩn, êm ái');
    scores['durex-jeans'].score += 4;
    scores['durex-jeans'].reasons.push('Size 52.5mm Easy-On dễ đeo vừa tay');
  } else if (answers.sizeFit === 'large-55') {
    scores['sagami-002-large'].score += 6;
    scores['sagami-002-large'].reasons.push('Khớp size lớn 55mm rộng rãi, không hằn bó');
    scores['sagami-001'].score += 5;
    scores['sagami-001'].reasons.push('Độ rộng 55mm thoải mái chuẩn Nhật');
  }

  // Bước 2: Ưu tiên hàng đầu
  if (answers.priority === 'ultra-thin') {
    scores['durex-invisible'].score += 4;
    scores['durex-invisible'].reasons.push('ưu tiên siêu mỏng 0.04mm chân thật');
    scores['sagami-001'].score += 5;
    scores['sagami-001'].reasons.push('siêu mỏng nhất 0.01mm truyền nhiệt nhanh');
    scores['sagami-002-large'].score += 4;
    scores['sagami-002-large'].reasons.push('siêu mỏng 0.02mm rộng rãi');
    scores['okamoto-003-ha'].score += 3;
    scores['okamoto-003-ha'].reasons.push('mỏng 0.03mm tự nhiên');
  } else if (answers.priority === 'non-latex') {
    scores['sagami-001'].score += 6;
    scores['sagami-001'].reasons.push('100% không Latex, an toàn cơ địa dị ứng');
    scores['sagami-002-large'].score += 6;
    scores['sagami-002-large'].reasons.push('100% Polyurethane không Latex, không mùi');
    scores['durex-naturals'].score += 2;
    scores['durex-naturals'].reasons.push('gel gốc nước an toàn dùng kèm Non-Latex');
  } else if (answers.priority === 'beginner') {
    scores['durex-jeans'].score += 6;
    scores['durex-jeans'].reasons.push('dáng Easy-On dễ đeo nhất cho người mới');
    scores['okamoto-harmony'].score += 3;
    scores['okamoto-harmony'].reasons.push('ôm khít chắc chắn, dễ kiểm soát');
    scores['durex-invisible'].score += 2;
  } else if (answers.priority === 'lubricant') {
    scores['durex-naturals'].score += 6;
    scores['durex-naturals'].reasons.push('100% gel gốc nước pH dịu nhẹ giảm ma sát');
    scores['okamoto-003-ha'].score += 5;
    scores['okamoto-003-ha'].reasons.push('phủ sẵn Hyaluronic Acid cấp ẩm trượt êm');
  }

  // Bước 3: Ngân sách / Số lượng
  if (answers.budget === 'budget') {
    scores['durex-jeans'].score += 4;
    scores['durex-jeans'].reasons.push('giá tiết kiệm 135.000đ (Hộp 12 chiếc)');
    scores['durex-naturals'].score += 3;
    scores['durex-naturals'].reasons.push('giá mềm 160.000đ chai 100ml');
    scores['okamoto-harmony'].score += 3;
    scores['okamoto-harmony'].reasons.push('giá hợp lý 165.000đ (Hộp 10 chiếc)');
    scores['okamoto-003-ha'].score += 3;
    scores['okamoto-003-ha'].reasons.push('giá tốt 185.000đ (Hộp 10 chiếc)');
  } else if (answers.budget === 'premium') {
    scores['sagami-001'].score += 4;
    scores['sagami-001'].reasons.push('dòng cao cấp 0.01mm trải nghiệm đỉnh');
    scores['sagami-002-large'].score += 4;
    scores['sagami-002-large'].reasons.push('dòng Polyurethane 0.02mm cao cấp');
    scores['durex-invisible'].score += 3;
    scores['durex-invisible'].reasons.push('trải nghiệm siêu mỏng hộp 10 chiếc');
  }

  const sorted = [...PRODUCTS]
    .map((product) => {
      const entry = scores[product.id];
      const directReasons = Array.from(
        new Set(
          entry.reasons.map(
            (r) => r.charAt(0).toUpperCase() + r.slice(1)
          )
        )
      ).slice(0, 2);

      return {
        product,
        score: entry.score,
        reasons:
          directReasons.length > 0
            ? directReasons
            : [`Phù hợp tiêu chí bạn đã chọn (${product.packSize})`],
      };
    })
    .sort((a, b) => b.score - a.score);

  return [
    {
      product: sorted[0].product,
      matchLabel: 'Khớp nhất #1',
      reasons: sorted[0].reasons,
    },
    {
      product: sorted[1].product,
      matchLabel: 'Gợi ý #2',
      reasons: sorted[1].reasons,
    },
  ];
}
