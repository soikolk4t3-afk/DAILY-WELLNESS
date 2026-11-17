import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isDarkStatus?: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isDarkStatus = false,
  containerRef,
}) => {
  return (
    <div className="h-[100dvh] w-full sm:zine-backdrop sm:p-4 flex flex-col items-center justify-center overflow-hidden bg-[#FDF6E9] min-h-0">
      <div
        ref={containerRef}
        className={`relative w-full h-full sm:max-w-[430px] sm:h-[min(860px,92dvh)] sm:max-h-full sm:border-[3px] sm:border-[#141413] sm:rounded-[24px] sm:shadow-[8px_8px_0_#141413] flex flex-col overflow-hidden min-h-0 min-w-0 transition-colors duration-200 ${
          isDarkStatus ? 'bg-[#141413]' : 'bg-[#FDF6E9]'
        }`}
        role="region"
        aria-label="HCMC Daily Wellness"
      >
        {children}
      </div>
    </div>
  );
};
