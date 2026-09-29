import React, { useState } from 'react';
import { PortalRole } from '../types';
import { SkillTrackLogo } from './SkillTrackLogo';

interface RoleSelectionLandingProps {
  onEnterPortal?: (role: PortalRole) => void;
  initialRole?: PortalRole | null;
}

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  onEnterPortal,
  initialRole = null
}) => {
  const [selectedRole, setSelectedRole] = useState<PortalRole | null>(initialRole);

  // Helper to format role name for display
  const getRoleDisplayName = (role: PortalRole | string): string => {
    const lower = (role || '').toLowerCase().trim();
    if (lower === 'student') return 'Student';
    if (lower === 'employer') return 'Employer';
    if (lower === 'government' || lower === 'government official') return 'Government Official';
    return role;
  };

  const handleProceedClick = () => {
    if (!selectedRole) return;
    if (onEnterPortal) {
      onEnterPortal(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-public-sans antialiased flex flex-col justify-between">
      {/* ================= 1. OFFICIAL TOP SOVEREIGN BAR ================= */}
      <header className="w-full bg-white border-b border-[#C7D8E8] shadow-sm">
        {/* Sovereign Tricolor Header Strip */}
        <div className="bg-[#00183b] text-white py-1 px-4 text-[11px] font-semibold border-b border-white/10">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#E06D10]" />
              <span>भारत सरकार | GOVERNMENT OF INDIA</span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-slate-200 hidden sm:inline">Ministry of Skill Development &amp; Entrepreneurship</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-[11px]">
              <div className="hidden md:flex items-center gap-1 font-jetbrains bg-white/10 px-2 py-0.5 rounded">
                <span className="cursor-pointer hover:text-white">A-</span>
                <span className="cursor-pointer hover:text-white">A</span>
                <span className="cursor-pointer font-bold text-white">A+</span>
              </div>
              <span className="hidden sm:inline text-slate-400">|</span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-white">English</span>
                <span>|</span>
                <span className="hover:text-white cursor-pointer text-slate-300">हिन्दी</span>
              </div>
              <span className="text-slate-400">|</span>
              <span className="text-amber-300 font-medium">Toll-Free: 1800-11-2024</span>
            </div>
          </div>
        </div>

        {/* Portal Identification Banner */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <SkillTrackLogo
              className="h-9"
              showText={true}
              subtitle="National Outcome Monitoring Portal"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Ashoka Stambha Emblem */}
            <div className="flex items-center gap-2.5 bg-[#f0f4fa] border border-[#d2dfef] px-3 py-1.5 rounded">
              <svg className="w-6 h-7 text-[#005A9C] shrink-0" viewBox="0 0 24 28" fill="currentColor">
                <path d="M12 2C8 2 6 5 6 7c0 2 1 3 2 4-2 1-3 3-3 6h14c0-3-1-5-3-6 1-1 2-2 2-4 0-2-2-5-6-5zm-4 17v2h8v-2H8zm-1 3v2h10v-2H7z" opacity="0.9" />
                <circle cx="12" cy="11" r="2" fill="#00183b" />
                <circle cx="12" cy="25" r="1.5" fill="#E06D10" />
              </svg>
              <div className="hidden sm:flex flex-col">
                <span className="text-[9px] font-bold tracking-widest text-[#09244B] uppercase">सत्यमेव जयते</span>
                <span className="text-[10px] font-semibold text-[#005A9C]">DGT • MSDE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= 2. MAIN ROLE SELECTION CONTENT ================= */}
      <main className="flex-grow flex items-center justify-center py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl w-full flex flex-col items-center">
          
          {/* Welcome Header */}
          <div className="text-center mb-6 sm:mb-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3FC] border border-[#C2DBF7] text-[#005A9C] text-xs font-bold tracking-wide uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#005A9C] animate-pulse"></span>
              National Outcome Monitoring Portal
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#09244B] tracking-tight">
              Welcome to SkillTrack AI
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium mt-2.5">
              Please select your role to continue
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full">
            
            {/* 1. STUDENT CARD */}
            <div
              id="role-card-student"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedRole('student')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedRole('student');
                }
              }}
              className={`relative text-left rounded-xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between border-2 bg-white ${
                selectedRole === 'student'
                  ? 'border-[#1e3a8a] ring-4 ring-blue-600/15 shadow-lg shadow-blue-950/5 translate-y-[-2px]'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Selected Badge Indicator (Blue border + filled radio dot) */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                    selectedRole === 'student'
                      ? 'bg-[#1e3a8a] text-white shadow-md'
                      : 'bg-emerald-50 text-[#006d30] border border-emerald-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[32px]">school</span>
                </div>

                {/* Radio Dot indicator: filled dot if selected */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors bg-white shrink-0 ${
                    selectedRole === 'student'
                      ? 'border-[#1e3a8a]'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedRole === 'student' && (
                    <div className="w-3 h-3 rounded-full bg-[#1e3a8a]" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="text-xl font-bold text-[#09244B]">
                    Student
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Trainee
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Access your Digital Employment Passport
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#006d30]">
                <span>Candidate Portal</span>
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </div>
            </div>

            {/* 2. EMPLOYER CARD */}
            <div
              id="role-card-employer"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedRole('employer')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedRole('employer');
                }
              }}
              className={`relative text-left rounded-xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between border-2 bg-white ${
                selectedRole === 'employer'
                  ? 'border-[#1e3a8a] ring-4 ring-blue-600/15 shadow-lg shadow-blue-950/5 translate-y-[-2px]'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Selected Badge Indicator (Blue border + filled radio dot) */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                    selectedRole === 'employer'
                      ? 'bg-[#1e3a8a] text-white shadow-md'
                      : 'bg-blue-50 text-[#005A9C] border border-blue-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[32px]">apartment</span>
                </div>

                {/* Radio Dot indicator: filled dot if selected */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors bg-white shrink-0 ${
                    selectedRole === 'employer'
                      ? 'border-[#1e3a8a]'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedRole === 'employer' && (
                    <div className="w-3 h-3 rounded-full bg-[#1e3a8a]" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="text-xl font-bold text-[#09244B]">
                    Employer
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Enterprise
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Verify Employment Passports and update employee outcomes
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#005A9C]">
                <span>Statutory Verification</span>
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
            </div>

            {/* 3. GOVERNMENT OFFICIAL CARD */}
            <div
              id="role-card-government"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedRole('government')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedRole('government');
                }
              }}
              className={`relative text-left rounded-xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between border-2 bg-white ${
                selectedRole === 'government'
                  ? 'border-[#1e3a8a] ring-4 ring-blue-600/15 shadow-lg shadow-indigo-950/5 translate-y-[-2px]'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Selected Badge Indicator (Blue border + filled radio dot) */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                    selectedRole === 'government'
                      ? 'bg-[#1e3a8a] text-white shadow-md'
                      : 'bg-amber-50 text-[#09244B] border border-amber-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[32px]">account_balance</span>
                </div>

                {/* Radio Dot indicator: filled dot if selected */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors bg-white shrink-0 ${
                    selectedRole === 'government'
                      ? 'border-[#1e3a8a]'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedRole === 'government' && (
                    <div className="w-3 h-3 rounded-full bg-[#1e3a8a]" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="text-xl font-bold text-[#09244B]">
                    Government Official
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    MSDE / DGT
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Monitor employment outcomes, skill gaps and training impact
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#E06D10]">
                <span>State &amp; National Analytics</span>
                <span className="material-symbols-outlined text-[18px]">query_stats</span>
              </div>
            </div>

          </div>

          {/* ================= 3. PROCEED ACTION BUTTON ================= */}
          <div className="mt-10 flex flex-col items-center w-full max-w-md">
            <button
              type="button"
              id="btn-proceed-role"
              disabled={!selectedRole}
              onClick={handleProceedClick}
              className={`w-full py-4 px-8 rounded-lg font-bold text-base transition-all duration-200 flex items-center justify-center gap-3 ${
                selectedRole
                  ? 'bg-[#1e3a8a] hover:bg-[#172554] text-white shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span className="tracking-wider text-base font-extrabold">PROCEED</span>
              <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
            </button>

            {!selectedRole ? (
              <p className="text-xs text-slate-500 font-medium mt-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-slate-400">info</span>
                Click on a role above to proceed into the system
              </p>
            ) : (
              <p className="text-xs text-slate-600 font-medium mt-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-blue-700">check_circle</span>
                Role selected: <span className="font-bold text-[#09244B] capitalize">{getRoleDisplayName(selectedRole)}</span>
              </p>
            )}
          </div>

        </div>
      </main>

      {/* ================= 4. GOVERNMENT STATUTORY FOOTER ================= */}
      <footer className="w-full bg-white border-t border-[#C7D8E8] py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-[#09244B]">SkillTrack AI • National Outcome Monitoring Portal</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>Ministry of Skill Development and Entrepreneurship</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Designed &amp; Maintained by NIC</span>
            <span>•</span>
            <span>Government of India</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
