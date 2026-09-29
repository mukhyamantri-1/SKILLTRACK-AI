import React from 'react';
import { GovernmentReportItem } from '../../data/governmentPagesData';

interface ReportViewModalProps {
  report: GovernmentReportItem | null;
  onClose: () => void;
  onToast: (title: string, subtitle: string) => void;
}

export const ReportViewModal: React.FC<ReportViewModalProps> = ({
  report,
  onClose,
  onToast
}) => {
  if (!report) return null;

  const handlePrintOrDownload = () => {
    onToast('Official Gazette Exported', `Generated verifiable PDF dossier for ${report.reportCode}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09244B]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded border-2 border-[#09244B] shadow-2xl max-w-3xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Official Header Banner */}
        <div className="bg-[#09244B] px-5 py-4 text-white flex items-start justify-between border-b-2 border-[#E06D10]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-[24px] text-amber-300">description</span>
            </div>
            <div>
              <span className="text-[10px] font-jetbrains uppercase tracking-wider text-amber-300 block font-semibold">
                GOVERNMENT OF INDIA • GAZETTE AUDIT DOSSIER
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                {report.title}
              </h2>
              <span className="text-xs text-slate-300 font-jetbrains">
                Ref Code: {report.reportCode} • Published: {report.publicationDate}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Close Report"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Gazette Metadata Strip */}
        <div className="bg-[#EBF4FC] px-5 py-2.5 border-b border-[#C7D8E8] flex flex-wrap items-center justify-between gap-2 text-xs text-[#09244B]">
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[16px] text-[#005A9C]">policy</span>
            <span>{report.gazetteRef}</span>
          </div>
          <div className="flex items-center gap-2 font-jetbrains text-[11px] text-[#475569]">
            <span className="bg-white px-2 py-0.5 rounded border border-[#C7D8E8] font-bold text-[#005A9C]">
              {report.reportingCycle}
            </span>
            <span className="text-[#15803D] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span> Digital Sign-off
            </span>
          </div>
        </div>

        {/* Report Body Content */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto flex flex-col gap-5 text-xs text-[#1E293B]">
          
          {/* Executive Summary */}
          <div className="flex flex-col gap-1.5 bg-[#F8FAFC] p-4 rounded border border-[#C7D8E8]">
            <span className="font-bold text-[#09244B] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#005A9C]">summarize</span>
              Executive Audit Summary
            </span>
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
              {report.summary}
            </p>
            <span className="text-[11px] text-[#64748B] italic mt-1">
              Authorizing Body: {report.authorizingBody}
            </span>
          </div>

          {/* Key Stat Tiles */}
          <div>
            <span className="font-bold text-[#09244B] uppercase tracking-wider text-[11px] block mb-2">
              Key Audited Telemetry Metrics
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {report.keyMetrics.map((km, idx) => (
                <div key={idx} className="bg-[#EBF4FC]/70 p-2.5 rounded border border-[#C7D8E8] flex flex-col">
                  <span className="text-[11px] text-[#64748B] font-semibold">{km.label}</span>
                  <span className="text-sm font-extrabold text-[#09244B] font-jetbrains mt-0.5">{km.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Audit Findings */}
          <div>
            <span className="font-bold text-[#09244B] uppercase tracking-wider text-[11px] block mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#005A9C]">fact_check</span>
              Substantive Audit Findings
            </span>
            <ul className="space-y-2">
              {report.findings.map((finding, idx) => (
                <li key={idx} className="p-2.5 bg-[#F8FAFC] rounded border border-[#C7D8E8] flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#005A9C] text-white flex items-center justify-center shrink-0 font-jetbrains text-[10px] font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-[#1E293B] leading-relaxed">{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Recommendations */}
          <div>
            <span className="font-bold text-[#09244B] uppercase tracking-wider text-[11px] block mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#15803D]">recommend</span>
              Statutory Recommendations &amp; Directives
            </span>
            <div className="p-3 bg-[#EBF4FC]/40 rounded border border-[#C7D8E8] space-y-2">
              {report.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#15803D] shrink-0 mt-0.5">task_alt</span>
                  <span className="text-[#09244B] font-medium">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Gazette Certification Stamp */}
          <div className="p-3 bg-amber-50 rounded border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-amber-900 font-jetbrains">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-amber-600">verified_user</span>
              <span>SHA-256 HASH: e4b8c91a039d54f828a1ce7163892c9f</span>
            </div>
            <span className="text-slate-600">CERTIFIED DGT GAZETTE REPOSITORY</span>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="bg-[#F8FAFC] px-5 py-3 border-t border-[#C7D8E8] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-[#64748B] font-jetbrains">
            ISO 27001 Certified NIC Sovereign Vault
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white border border-[#C7D8E8] text-[#09244B] font-bold rounded hover:bg-slate-100 cursor-pointer text-xs"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrintOrDownload}
              className="px-3.5 py-1.5 bg-[#005A9C] hover:bg-[#09244B] text-white font-bold rounded flex items-center gap-1.5 cursor-pointer text-xs transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Download PDF Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
