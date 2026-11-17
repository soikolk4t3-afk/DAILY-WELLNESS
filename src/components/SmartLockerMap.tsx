import React, { useRef, useState } from 'react';
import {
  Compass,
  ExternalLink,
  Lock,
  MapPin,
  Navigation,
  RotateCcw,
} from 'lucide-react';
import { DistrictFilter, SmartLockerLocation } from '../types';
import {
  DISTRICT_FILTER_OPTIONS,
  SMART_LOCKER_LOCATIONS,
} from '../data/mockData';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';

interface SmartLockerMapProps {
  selectedLocker: SmartLockerLocation | null;
  districtFilter: DistrictFilter;
  onSelectLocker: (locker: SmartLockerLocation) => void;
  onChangeDistrictFilter: (district: DistrictFilter) => void;
}

export const SmartLockerMap: React.FC<SmartLockerMapProps> = ({
  selectedLocker,
  districtFilter,
  onSelectLocker,
  onChangeDistrictFilter,
}) => {
  const { playSound } = useSoundFeedback();
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const dragStartRef = useRef<{
    x: number;
    y: number;
    origX: number;
    origY: number;
  } | null>(null);

  const activeDistrictSpec = DISTRICT_FILTER_OPTIONS.find(
    (d) => d.label === districtFilter
  );

  const panX = (activeDistrictSpec?.panX ?? 0) + dragOffset.x;
  const panY = (activeDistrictSpec?.panY ?? 0) + dragOffset.y;
  const zoomScale = activeDistrictSpec?.scale ?? 1;

  const handleDistrictTap = (district: Exclude<DistrictFilter, 'ALL'>) => {
    triggerHaptic('toggle');
    playSound('toggle');
    setDragOffset({ x: 0, y: 0 });

    if (districtFilter === district) {
      onChangeDistrictFilter('ALL');
      return;
    }

    onChangeDistrictFilter(district);
    const matching = SMART_LOCKER_LOCATIONS.find(
      (loc) => loc.districtShort === district
    );
    if (matching) {
      onSelectLocker(matching);
    }
  };

  const handleResetView = () => {
    triggerHaptic('tap');
    playSound('click');
    setDragOffset({ x: 0, y: 0 });
    onChangeDistrictFilter('ALL');
  };

  const handleMapPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      origX: dragOffset.x,
      origY: dragOffset.y,
    };
  };

  const handleMapPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx =
      ((e.clientX - dragStartRef.current.x) / Math.max(1, rect.width) / zoomScale) *
      100;
    const dy =
      ((e.clientY - dragStartRef.current.y) / Math.max(1, rect.height) / zoomScale) *
      100;
    setDragOffset({
      x: Math.max(-32, Math.min(32, dragStartRef.current.origX + dx)),
      y: Math.max(-28, Math.min(28, dragStartRef.current.origY + dy)),
    });
  };

  const handleMapPointerUp = () => {
    dragStartRef.current = null;
  };

  return (
    <div className="space-y-2 min-w-0">
      {/* Chọn nhanh quận TP.HCM (Không dùng GPS / theo dõi vị trí người dùng) */}
      <div className="flex flex-wrap items-center gap-1.5">
        {DISTRICT_FILTER_OPTIONS.map((dist) => {
          const active = districtFilter === dist.label;
          return (
            <button
              key={dist.label}
              type="button"
              onClick={() => handleDistrictTap(dist.label)}
              className={`min-h-[28px] px-2.5 rounded-lg border-[2px] border-[#141413] font-mono text-[10.5px] font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-[#FFD166] text-[#141413] shadow-none translate-x-[1px] translate-y-[1px]'
                  : 'bg-white text-[#141413] shadow-[2px_2px_0_#141413] hover:bg-[#FDF6E9]'
              }`}
            >
              {dist.label}
            </button>
          );
        })}
      </div>

      {/* Tactile Zine Map Card (gọn 175px) */}
      <div
        onPointerDown={handleMapPointerDown}
        onPointerMove={handleMapPointerMove}
        onPointerUp={handleMapPointerUp}
        onPointerCancel={handleMapPointerUp}
        className="relative border-2 border-[#141413] shadow-[4px_4px_0_#141413] rounded-lg overflow-hidden h-[175px] bg-[#F6EDD9] select-none touch-none cursor-grab active:cursor-grabbing"
        aria-label="Bản đồ vị trí tủ Smart Locker tại TP.HCM"
      >
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out origin-center"
          style={{
            transform: `translate(${panX}%, ${panY}%) scale(${zoomScale})`,
          }}
        >
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <rect width="400" height="220" fill="#F8F0DD" />

            <g fill="#EFE3C6" stroke="#141413" strokeOpacity="0.12" strokeWidth="1">
              <rect x="20" y="54" width="84" height="54" rx="6" />
              <rect x="122" y="18" width="90" height="56" rx="6" />
              <rect x="34" y="118" width="96" height="60" rx="6" />
              <rect x="142" y="96" width="84" height="58" rx="6" />
              <rect x="234" y="106" width="66" height="54" rx="6" />
              <rect x="180" y="166" width="94" height="46" rx="6" />
              <rect x="224" y="34" width="76" height="54" rx="6" />
              <rect x="312" y="14" width="78" height="66" rx="6" />
            </g>

            {/* Sông Sài Gòn */}
            <path
              d="M 275 0 C 260 38, 315 58, 304 94 C 292 132, 260 144, 282 184 C 294 205, 310 215, 326 220 L 352 220 C 334 206, 318 190, 308 172 C 292 142, 322 126, 332 90 C 342 52, 294 34, 304 0 Z"
              fill="#95D5B2"
              fillOpacity="0.6"
              stroke="#0F5C56"
              strokeOpacity="0.45"
              strokeWidth="1.4"
            />

            {/* Kênh Nhiêu Lộc - Thị Nghè */}
            <path
              d="M 10 104 Q 110 82, 195 100 T 290 84"
              fill="none"
              stroke="#95D5B2"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Trục đường chính TP.HCM */}
            <g stroke="#141413" strokeOpacity="0.22" strokeLinecap="round" fill="none">
              <path d="M 35 162 L 195 122 L 265 144" strokeWidth="2.4" />
              <path d="M 74 30 L 106 186" strokeWidth="2" />
              <path d="M 168 24 L 218 206" strokeWidth="2" />
              <path d="M 244 60 L 356 44" strokeWidth="2.4" strokeDasharray="5 4" />
              <path d="M 185 124 L 266 84 L 340 48" strokeWidth="2" />
            </g>

            <g
              fontFamily="JetBrains Mono, monospace"
              fontWeight="700"
              fontSize="8.5"
              fill="#141413"
              fillOpacity="0.48"
              letterSpacing="0.7"
            >
              <text x="32" y="72">TÂN BÌNH</text>
              <text x="148" y="34">GÒ VẤP</text>
              <text x="80" y="168">QUẬN 10</text>
              <text x="166" y="110">QUẬN 3</text>
              <text x="236" y="156">QUẬN 1</text>
              <text x="200" y="206">QUẬN 7</text>
              <text x="232" y="70">BÌNH THẠNH</text>
              <text x="318" y="32">THỦ ĐỨC</text>
            </g>
          </svg>

          {/* Chỉ hiển thị ghim cố định của các tủ Smart Locker */}
          {SMART_LOCKER_LOCATIONS.map((loc) => {
            const isSelected = selectedLocker?.id === loc.id;
            const isInDistrict =
              districtFilter === 'ALL' || districtFilter === loc.districtShort;

            return (
              <button
                key={loc.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('toggle');
                  playSound('toggle');
                  onSelectLocker(loc);
                  onChangeDistrictFilter(loc.districtShort);
                }}
                aria-label={`Chọn ${loc.name}`}
                style={{
                  left: `${loc.mapX}%`,
                  top: `${loc.mapY}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 cursor-pointer flex flex-col items-center ${
                  isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105'
                } ${!isInDistrict && !isSelected ? 'opacity-50' : 'opacity-100'}`}
              >
                <span
                  className={`px-2 py-1 rounded-lg border-[2px] border-[#141413] font-mono text-[9.5px] font-bold flex items-center gap-1 whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#FFD166] text-[#141413] shadow-[3px_3px_0_#141413]'
                      : 'bg-[#0F5C56] text-[#FDF6E9] shadow-[2px_2px_0_#141413]'
                  }`}
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{loc.districtShort}</span>
                </span>
                <span
                  className={`w-2 h-2 rotate-45 -mt-1 border-r-[2px] border-b-[2px] border-[#141413] ${
                    isSelected ? 'bg-[#FFD166]' : 'bg-[#0F5C56]'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Nhãn bảo mật vị trí cố định */}
        <div className="absolute top-2 left-2 z-30 px-2 py-0.5 rounded bg-white/95 border-[1.5px] border-[#141413] font-mono text-[9.5px] font-bold text-[#141413] flex items-center gap-1 pointer-events-none">
          <Compass className="w-3 h-3 text-[#0F5C56]" />
          <span>Vị trí tủ • Không theo dõi GPS</span>
        </div>

        {(districtFilter !== 'ALL' ||
          dragOffset.x !== 0 ||
          dragOffset.y !== 0) && (
          <button
            type="button"
            onClick={handleResetView}
            aria-label="Xem toàn bộ bản đồ TP.HCM"
            className="absolute top-2 right-2 z-30 px-2 py-0.5 rounded bg-white border-[1.5px] border-[#141413] shadow-[2px_2px_0_#141413] font-mono text-[9.5px] font-bold text-[#141413] flex items-center gap-1 cursor-pointer hover:bg-[#FFD166]"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Toàn TP</span>
          </button>
        )}

        <div className="absolute bottom-2 left-2 right-2 z-30 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-[#141413]/90 text-[#FDF6E9] font-mono text-[9.5px] font-semibold">
            Chạm vào ghim để chọn tủ nhận hàng
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[9px] font-bold text-[#141413] shrink-0">
            {SMART_LOCKER_LOCATIONS.length} TỦ 24/7
          </span>
        </div>
      </div>

      {/* Thẻ tủ đã chọn gọn 2 dòng (Selected Locker Card) */}
      {selectedLocker ? (
        <div className="rounded-xl bg-[#95D5B2] border-2 border-[#141413] shadow-[3px_3px_0_#141413] px-3 py-2.5 space-y-1 min-w-0">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <p className="font-display text-[13.5px] font-extrabold text-[#141413] leading-snug break-words min-w-0 flex-1">
              {selectedLocker.name}
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFD166] border-[1.5px] border-[#141413] font-mono text-[9.5px] font-bold text-[#141413] shrink-0 whitespace-nowrap">
              <Lock className="w-2.5 h-2.5 shrink-0" />
              <span>Tự nhận 24/7</span>
            </span>
          </div>
          <p className="text-[11.5px] font-semibold text-[#141413]/85 leading-snug break-words">
            {selectedLocker.addressHint} · Sẵn sàng sau 20 phút
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-white border-2 border-dashed border-[#141413] px-3 py-2.5 flex items-center justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <p className="font-display text-[13px] font-extrabold text-[#141413]">
              Chưa chọn tủ nhận hàng
            </p>
            <p className="text-[11.5px] font-medium text-[#141413]/75 leading-snug">
              Chạm vào 1 ghim tủ trên bản đồ để nhận 24/7.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('toggle');
              playSound('toggle');
              onChangeDistrictFilter(SMART_LOCKER_LOCATIONS[0].districtShort);
              onSelectLocker(SMART_LOCKER_LOCATIONS[0]);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#FFD166] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] font-mono text-[10.5px] font-bold text-[#141413] shrink-0 cursor-pointer"
          >
            Chọn Q.10
          </button>
        </div>
      )}
    </div>
  );
};

interface SmartLockerLocationCardProps {
  locker: SmartLockerLocation;
}

export const SmartLockerLocationCard: React.FC<SmartLockerLocationCardProps> = ({
  locker,
}) => {
  const { playSound } = useSoundFeedback();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${locker.lat},${locker.lng}`;

  return (
    <section
      aria-label="Vị trí tủ Smart Locker"
      className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] overflow-hidden min-w-0"
    >
      {/* Bản đồ mini chỉ hiển thị ghim cố định của tủ (KHÔNG điểm người dùng, KHÔNG đường đi, KHÔNG khoảng cách) */}
      <div className="relative h-[104px] bg-[#F8F0DD] border-b-[2px] border-[#141413] overflow-hidden">
        <svg
          viewBox="0 0 360 104"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <rect width="360" height="104" fill="#F8F0DD" />
          <g stroke="#141413" strokeOpacity="0.14" strokeWidth="1.5">
            <line x1="0" y1="32" x2="360" y2="32" />
            <line x1="0" y1="72" x2="360" y2="72" />
            <line x1="80" y1="0" x2="80" y2="104" />
            <line x1="180" y1="0" x2="180" y2="104" />
            <line x1="280" y1="0" x2="280" y2="104" />
          </g>
          {/* Ghim cố định duy nhất của tủ Smart Locker */}
          <circle
            cx="180"
            cy="52"
            r="16"
            fill="#95D5B2"
            fillOpacity="0.5"
          />
          <circle
            cx="180"
            cy="52"
            r="10"
            fill="#FFD166"
            stroke="#141413"
            strokeWidth="2.5"
          />
          <circle cx="180" cy="52" r="3.5" fill="#141413" />
        </svg>

        <span className="absolute top-2 left-2.5 px-2 py-0.5 rounded bg-white border-[1.5px] border-[#141413] font-mono text-[9.5px] font-bold text-[#141413]">
          {locker.lockerCode} • {locker.districtShort}
        </span>

        <span className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[9.5px] font-bold text-[#141413]">
          Vị trí tủ • Không theo dõi GPS
        </span>
      </div>

      {/* Hàng full-width hiển thị đủ tên & địa chỉ tủ (không bao giờ cắt chữ ...) */}
      <div className="p-3.5 space-y-2.5 min-w-0">
        <div className="min-w-0 space-y-0.5">
          <p className="font-display text-[14px] font-extrabold text-[#141413] leading-snug break-words">
            {locker.name}
          </p>
          <p className="text-[12px] font-medium text-[#141413]/80 leading-snug break-words">
            {locker.addressHint}
          </p>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            triggerHaptic('tap');
            playSound('click');
          }}
          className="w-full min-h-[40px] px-3 rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] border-[2px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-mono text-[11.5px] font-bold text-[#141413] flex items-center justify-center gap-1.5 transition-all"
        >
          <Navigation className="w-3.5 h-3.5 stroke-[2.4]" />
          <span>Chỉ đường tới tủ</span>
          <ExternalLink className="w-3.5 h-3.5 stroke-[2.4]" />
        </a>
      </div>
    </section>
  );
};
