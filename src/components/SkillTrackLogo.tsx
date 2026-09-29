import React from 'react';

interface SkillTrackLogoProps {
  className?: string;
  showText?: boolean;
  subtitle?: string;
  badgeText?: string;
  textColor?: 'dark' | 'light';
}

export const SkillTrackLogo: React.FC<SkillTrackLogoProps> = ({
  className = 'h-8',
  showText = true,
  subtitle = 'Digital Skill & Employment Registry',
  badgeText,
  textColor = 'dark'
}) => {
  return (
    <div className={`flex items-center gap-2.5 min-w-max select-none ${textColor === 'light' ? 'text-white' : 'text-[#00183b]'}`}>
      {/* Precision Vector Emblem (as shown in Image 6 & 7) */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} aspect-square`}
        >
          {/* Outer Rounded Container */}
          <rect width="48" height="48" rx="10" fill="#0A2540" />
          
          {/* Circular dial with saffron dashed marks */}
          <circle
            cx="24"
            cy="24"
            r="16"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeDasharray="2.5 3"
            strokeLinecap="round"
          />
          
          {/* Blue dial markers at 12, 3, 6, 9 */}
          <line x1="24" y1="10" x2="24" y2="13.5" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="24" x2="34.5" y2="24" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="24" y1="38" x2="24" y2="34.5" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="24" x2="13.5" y2="24" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Center Checkmark */}
          <path
            d="M17.5 24.5L22 29L31 18.5"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold tracking-tight leading-none text-[17px] ${textColor === 'light' ? 'text-white' : 'text-[#00183b]'}`}>
              SkillTrack <span className="text-[#0284c7]">AI</span>
            </span>
            {badgeText && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-[2px] bg-[#0f2d59] text-white text-[10px] font-bold uppercase tracking-wider">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <span className={`text-[11px] font-medium leading-tight mt-0.5 ${textColor === 'light' ? 'text-slate-300' : 'text-[#44474f]'}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
