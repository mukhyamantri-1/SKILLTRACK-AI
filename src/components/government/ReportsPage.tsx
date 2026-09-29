import React, { useState } from 'react';
import { MOCK_GOV_REPORTS, GovernmentReportItem } from '../../data/governmentPagesData';
import { ReportViewModal } from './ReportViewModal';

interface ReportsPageProps {
  onToast: (title: string, subtitle: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onToast }) => {
  const [selectedReport, setSelectedReport] = useState<GovernmentReportItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = MOCK_GOV_REPORTS.filter((rep) => {
    return (
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.reportCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Page Title & Gazette Identification */}
      <div className="bg-white rounded border border-[#C7D8E8] p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-jetbrains font-bold uppercase tracking-wider text-[#005A9C] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            CENTRAL GAZETTE REPOSITORY • STATUTORY AUDIT BULLETINS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09244B] tracking-tight mt-1">
            Government Audit &amp; Policy Reports
          </h1>
          <div className="h-1 w-20 bg-[#E06D10] mt-2 mb-1.5 rounded-full"></div>
          <p className="text-xs sm:text-sm text-[#475569]">
            Official state publications, verified longitudinal employment telemetry, and statutory recommendations for vocational education authorities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToast('Gazette Archive Synced', 'Verified cryptographic SHA-256 signatures for all 4 state audit reports')}
            className="px-3.5 py-1.5 bg-white border border-[#C7D8E8] text-[#09244B] hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-[#005A9C]">lock_reset</span>
            Verify Digital Signatures
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-[#005A9C] text-white hover:bg-[#09244B] rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print Gazette Index
          </button>
        </div>
      </div>

      {/* 2. Search / Filter Bar */}
      <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report title, code, or keyword..."
            className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#C7D8E8] rounded text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#005A9C]"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[16px] text-slate-400">search</span>
        </div>
        <div className="flex items-center gap-2 text-[#475569] font-jetbrains text-[11px] self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>4 Audited Gazette Bulletins Published for FY 2025-26</span>
        </div>
      </div>

      {/* 3. The 4 Requested Reports Grid (Exact Prompt Requirement) */}
      {/* 
        - Employment Outcome Report
        - Institute Performance Report
        - Skill Gap Report
        - Course Improvement Report
        Each with a "View Report" button.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded border border-[#C7D8E8] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            {/* Card Header */}
            <div>
              <div className="bg-[#EBF4FC] px-5 py-3 border-b border-[#C7D8E8] flex items-center justify-between">
                <span className="text-[10px] font-jetbrains font-bold uppercase tracking-wider text-[#005A9C] bg-white px-2 py-0.5 rounded border border-[#C7D8E8]">
                  {report.category}
                </span>
                <span className="text-[11px] text-[#475569] font-jetbrains">
                  {report.publicationDate}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-[#09244B]/5 text-[#005A9C] flex items-center justify-center shrink-0 border border-[#C7D8E8]">
                    <span className="material-symbols-outlined text-[24px]">
                      {report.category === 'Employment Outcome' ? 'trending_up' :
                       report.category === 'Institute Performance' ? 'domain' :
                       report.category === 'Skill Gap' ? 'tune' : 'school'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-base font-extrabold text-[#09244B] leading-snug">
                      {report.title}
                    </h2>
                    <span className="text-[11px] text-slate-500 font-jetbrains mt-0.5">
                      Ref: {report.reportCode}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#334155] leading-relaxed line-clamp-3">
                  {report.summary}
                </p>

                {/* Key Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  {report.keyMetrics.slice(0, 4).map((km, i) => (
                    <div key={i} className="bg-[#F8FAFC] p-2 rounded border border-slate-200 flex flex-col">
                      <span className="text-[10px] text-slate-500 font-medium">{km.label}</span>
                      <span className="text-xs font-bold text-[#09244B] font-jetbrains">{km.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Action Footer with "View Report" button */}
            <div className="bg-[#F8FAFC] px-5 py-3 border-t border-[#C7D8E8] flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-jetbrains flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                DGT Approved
              </span>
              <button
                type="button"
                onClick={() => setSelectedReport(report)}
                className="px-4 py-1.5 bg-[#005A9C] hover:bg-[#09244B] text-white font-bold rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                View Report
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Official Archive Certification Banner */}
      <div className="bg-[#09244B] text-white p-4 sm:p-5 rounded border border-[#C7D8E8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px] text-amber-300">security</span>
          </div>
          <div>
            <span className="font-bold block">Digital Gazette Repository &amp; Sovereign Data Trust</span>
            <span className="text-[11px] text-slate-300">
              All published documents comply with Section 4 of the Public Records Act and NCVET Gazette Notification guidelines.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToast('Master Archive Exported', 'Downloading consolidated PDF package containing all 4 quarterly audit reports')}
          className="px-3.5 py-1.5 bg-[#E06D10] hover:bg-[#C25A07] text-white font-bold rounded flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm text-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">folder_zip</span>
          Download All Reports (.ZIP)
        </button>
      </div>

      {/* Interactive Report View Modal */}
      {selectedReport && (
        <ReportViewModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onToast={onToast}
        />
      )}

    </div>
  );
};
