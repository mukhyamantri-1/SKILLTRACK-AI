import React, { useState } from 'react';
import { MOCK_GOV_SKILL_GAPS, GovernmentSkillGap } from '../../data/governmentPagesData';

interface SkillGapsPageProps {
  onToast: (title: string, subtitle: string) => void;
}

export const SkillGapsPage: React.FC<SkillGapsPageProps> = ({ onToast }) => {
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedGapDetail, setSelectedGapDetail] = useState<GovernmentSkillGap | null>(null);
  const [adoptedRecommendations, setAdoptedRecommendations] = useState<Record<string, boolean>>({});

  const filteredGaps = MOCK_GOV_SKILL_GAPS.filter((gap) => {
    if (selectedPriority === 'all') return true;
    return gap.priority === selectedPriority;
  });

  const totalAffectedStudents = MOCK_GOV_SKILL_GAPS.reduce((acc, curr) => acc + curr.studentsAffected, 0);

  const handleAdoptRecommendation = (id: string, title: string) => {
    setAdoptedRecommendations(prev => ({ ...prev, [id]: true }));
    onToast('Curriculum Directive Dispatched', `Adopted advisory: "${title}" across state accredited ITIs`);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Page Title & Gazette Identification */}
      <div className="bg-white rounded border border-[#C7D8E8] p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-jetbrains font-bold uppercase tracking-wider text-[#005A9C] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            INDUSTRY-ACADEMIA DEFICIT MATRIX • FORM 9B STATUTORY SURVEY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09244B] tracking-tight mt-1">
            Statewide Vocational Skill Gap Analysis
          </h1>
          <div className="h-1 w-20 bg-[#E06D10] mt-2 mb-1.5 rounded-full"></div>
          <p className="text-xs sm:text-sm text-[#475569]">
            Continuous employer feedback telemetry aggregated across 420 corporate employers identifying competencies requiring urgent curriculum reinforcement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToast('Advisory Exported', 'Downloaded complete State Skill Deficit Advisory Dossier')}
            className="px-3.5 py-1.5 bg-white border border-[#C7D8E8] text-[#09244B] hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-[#005A9C]">download</span>
            Download Deficit Matrix
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-[#005A9C] text-white hover:bg-[#09244B] rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print Gazette Matrix
          </button>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Affected Students</span>
            <span className="material-symbols-outlined text-[20px] text-[#E06D10]">group_off</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#09244B] font-jetbrains">
              {totalAffectedStudents.toLocaleString()}
            </span>
            <span className="text-[11px] text-amber-700 block font-semibold mt-0.5">Assessed in FY 2025-26</span>
          </div>
        </div>

        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Top Critical Skill Gap</span>
            <span className="material-symbols-outlined text-[20px] text-red-600">priority_high</span>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#09244B] font-jetbrains">
              Power BI
            </span>
            <span className="text-[11px] text-red-700 block font-bold mt-0.5">38% Employer Gap (380 Students)</span>
          </div>
        </div>

        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Participating Employers</span>
            <span className="material-symbols-outlined text-[20px] text-[#005A9C]">corporate_fare</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#005A9C] font-jetbrains">
              420
            </span>
            <span className="text-[11px] text-slate-500 block font-semibold mt-0.5">Form 9B Audits Submitted</span>
          </div>
        </div>

        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">AI Interventions Ready</span>
            <span className="material-symbols-outlined text-[20px] text-[#15803D]">psychology</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#15803D] font-jetbrains">
              3 Modules
            </span>
            <span className="text-[11px] text-[#15803D] block font-semibold mt-0.5">DGT Approved Directives</span>
          </div>
        </div>
      </div>

      {/* 3. Skill Gaps Table (Exact Prompt Requirement) */}
      {/* 
        Skill | Students Affected | Employer-Reported Gap | Priority
        Example:
        Power BI | 380 | 38% | High
        Advanced Excel | 270 | 27% | Medium
        SQL | 210 | 21% | Medium
      */}
      <div className="bg-white rounded border border-[#C7D8E8] shadow-sm overflow-hidden">
        <div className="bg-[#EBF4FC] px-4 sm:px-6 py-3 border-b border-[#C7D8E8] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#005A9C]">tune</span>
            <span className="text-sm font-extrabold text-[#09244B]">
              Employer-Reported Skill Gap Matrix
            </span>
          </div>
          
          {/* Priority Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#09244B]">Filter Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1 bg-white border border-[#C7D8E8] rounded text-[#09244B] font-semibold text-xs focus:outline-none focus:border-[#005A9C]"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority Only</option>
              <option value="Medium">Medium Priority Only</option>
              <option value="Moderate">Moderate Priority Only</option>
              <option value="Low">Low Priority Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E293B] border-collapse">
            <thead>
              <tr className="bg-[#09244B] text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Skill</th>
                <th className="py-3 px-4">Students Affected</th>
                <th className="py-3 px-4">Employer-Reported Gap</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Primary Affected Sectors</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C7D8E8]">
              {filteredGaps.map((gap, idx) => (
                <tr key={`${gap.id}-${idx}`} className="hover:bg-[#F8FAFC] transition-colors">
                  
                  {/* Skill */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#EBF4FC] text-[#005A9C] flex items-center justify-center font-bold text-xs border border-[#C7D8E8]">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-[#09244B] text-sm">{gap.skill}</span>
                    </div>
                  </td>

                  {/* Students Affected */}
                  <td className="py-3.5 px-4 font-jetbrains">
                    <span className="text-sm font-bold text-[#09244B] block">
                      {gap.studentsAffected}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Trainees Flagged
                    </span>
                  </td>

                  {/* Employer-Reported Gap */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            gap.priority === 'High' ? 'bg-[#E06D10]' :
                            gap.priority === 'Medium' ? 'bg-[#005A9C]' : 'bg-[#15803D]'
                          }`}
                          style={{ width: `${gap.employerReportedGap * 2.2}%` }}
                        ></div>
                      </div>
                      <span className="font-jetbrains font-extrabold text-sm text-[#09244B]">
                        {gap.employerReportedGap}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Deficit Frequency
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-jetbrains font-bold text-xs ${
                      gap.priority === 'High' ? 'bg-red-100 text-red-800 border border-red-200' :
                      gap.priority === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      gap.priority === 'Moderate' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {gap.priority === 'High' ? 'error' : gap.priority === 'Medium' ? 'warning' : 'info'}
                      </span>
                      {gap.priority}
                    </span>
                  </td>

                  {/* Primary Affected Sectors */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {gap.affectedSectors.map((sec, i) => (
                        <span key={i} className="bg-slate-100 text-[#09244B] px-1.5 py-0.5 rounded text-[10px] border border-slate-200">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedGapDetail(gap)}
                      className="px-2.5 py-1 bg-[#EBF4FC] hover:bg-[#D4E8F8] text-[#005A9C] font-bold rounded text-xs transition-colors cursor-pointer border border-[#C7D8E8]"
                    >
                      View Advisory
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#F8FAFC] px-4 sm:px-6 py-3 border-t border-[#C7D8E8] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>Gaps compiled through post-hire performance audits and quarterly Form 9B submissions.</span>
          <span className="font-jetbrains font-semibold text-[#09244B]">
            Assam State Council for Vocational Training (SCVT) Review Active
          </span>
        </div>
      </div>

      {/* 4. AI Recommendation Section (Exact Prompt Requirement) */}
      <div className="bg-white rounded border border-[#C7D8E8] shadow-sm overflow-hidden">
        <div className="bg-[#09244B] px-4 sm:px-6 py-3 text-white flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#E06D10]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-amber-300">psychology</span>
            <div>
              <span className="text-sm font-extrabold block">DGT AI Curriculum &amp; Policy Optimization Recommendations</span>
              <span className="text-[11px] text-slate-300 font-jetbrains">
                Automated synthesized interventions based on employer feedback &amp; placement telemetry
              </span>
            </div>
          </div>
          <span className="bg-[#E06D10] text-white text-[11px] font-jetbrains font-bold px-2.5 py-1 rounded">
            DGT-AI ENGINE V3.2
          </span>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Recommendation 1: Power BI Lab Mandatory Hours */}
          <div className="bg-[#F8FAFC] rounded border border-[#C7D8E8] p-4 flex flex-col justify-between shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded font-jetbrains">
                  HIGH IMPACT INTERVENTION
                </span>
                <span className="text-[11px] font-jetbrains text-slate-500">40 Hours / Batch</span>
              </div>
              <h2 className="text-sm font-bold text-[#09244B] mt-1">
                Mandate 40 Hours Practical Power BI &amp; DAX Lab
              </h2>
              <p className="text-xs text-[#475569] leading-relaxed">
                Add structured live enterprise dashboarding capstone projects in Semester 2 of all Data Analytics programs to address the 38% deficit reported by employers.
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-jetbrains text-[#15803D] font-bold">+18.5% Projected Placement</span>
              <button
                type="button"
                onClick={() => handleAdoptRecommendation('rec-1', 'Power BI & DAX Capstone Directive')}
                disabled={adoptedRecommendations['rec-1']}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                  adoptedRecommendations['rec-1']
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                    : 'bg-[#005A9C] text-white hover:bg-[#09244B]'
                }`}
              >
                {adoptedRecommendations['rec-1'] ? 'Directive Adopted ✓' : 'Adopt Policy Directive'}
              </button>
            </div>
          </div>

          {/* Recommendation 2: Advanced Excel Proctored Mastery */}
          <div className="bg-[#F8FAFC] rounded border border-[#C7D8E8] p-4 flex flex-col justify-between shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded font-jetbrains">
                  MEDIUM IMPACT INTERVENTION
                </span>
                <span className="text-[11px] font-jetbrains text-slate-500">25 Hours / Batch</span>
              </div>
              <h2 className="text-sm font-bold text-[#09244B] mt-1">
                Advanced Excel &amp; Financial Modeling Certification
              </h2>
              <p className="text-xs text-[#475569] leading-relaxed">
                Mandate practical evaluations on dynamic array formulas (XLOOKUP, LAMBDA), automated Power Query pipelines, and corporate financial model reconciliation.
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-jetbrains text-[#15803D] font-bold">+14.2% Wage Increment Boost</span>
              <button
                type="button"
                onClick={() => handleAdoptRecommendation('rec-2', 'Advanced Excel Certification Directive')}
                disabled={adoptedRecommendations['rec-2']}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                  adoptedRecommendations['rec-2']
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                    : 'bg-[#005A9C] text-white hover:bg-[#09244B]'
                }`}
              >
                {adoptedRecommendations['rec-2'] ? 'Directive Adopted ✓' : 'Adopt Policy Directive'}
              </button>
            </div>
          </div>

          {/* Recommendation 3: SQL Terminal Simulation Kit */}
          <div className="bg-[#F8FAFC] rounded border border-[#C7D8E8] p-4 flex flex-col justify-between shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded font-jetbrains">
                  CURRICULUM UPGRADE
                </span>
                <span className="text-[11px] font-jetbrains text-slate-500">Direct Sandbox Access</span>
              </div>
              <h2 className="text-sm font-bold text-[#09244B] mt-1">
                Deploy Multi-Tenant SQL Sandbox Terminal Labs
              </h2>
              <p className="text-xs text-[#475569] leading-relaxed">
                Supply all ITIs with hosted PostgreSQL/MySQL sandbox environments where students troubleshoot slow queries, build indexes, and execute transactional stored procedures.
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-jetbrains text-[#15803D] font-bold">Mitigates 21% Deficit</span>
              <button
                type="button"
                onClick={() => handleAdoptRecommendation('rec-3', 'SQL Sandbox Terminal Directive')}
                disabled={adoptedRecommendations['rec-3']}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                  adoptedRecommendations['rec-3']
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                    : 'bg-[#005A9C] text-white hover:bg-[#09244B]'
                }`}
              >
                {adoptedRecommendations['rec-3'] ? 'Directive Adopted ✓' : 'Adopt Policy Directive'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Detail Advisory Modal */}
      {selectedGapDetail && (
        <div className="fixed inset-0 z-50 bg-[#09244B]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl max-w-lg w-full overflow-hidden border border-[#C7D8E8] animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#09244B] px-5 py-3.5 text-white flex items-center justify-between border-b-2 border-[#E06D10]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-300">tune</span>
                <div>
                  <span className="text-xs font-bold block">{selectedGapDetail.skill} Deficit Dossier</span>
                  <span className="text-[10px] text-slate-300 font-jetbrains">Priority: {selectedGapDetail.priority}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGapDetail(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">Students Affected</span>
                  <span className="text-base font-extrabold font-jetbrains text-[#09244B]">{selectedGapDetail.studentsAffected} Trainees</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">Employer Reported Deficit</span>
                  <span className="text-base font-extrabold font-jetbrains text-[#E06D10]">{selectedGapDetail.employerReportedGap}%</span>
                </div>
              </div>

              <div className="p-3 bg-[#EBF4FC] rounded border border-[#C7D8E8]">
                <span className="font-bold text-[#09244B] block mb-1">Recommended Pedagogical Intervention:</span>
                <p className="text-xs text-[#334155] leading-relaxed">
                  {selectedGapDetail.recommendedIntervention}
                </p>
                <span className="text-[11px] font-jetbrains text-[#005A9C] font-semibold block mt-1.5">
                  Estimated Upskilling Duration: {selectedGapDetail.estimatedUpskillingWeeks} Weeks
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedGapDetail(null)}
                  className="px-4 py-1.5 bg-[#F1F5F9] text-[#09244B] rounded font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGapDetail(null);
                    onToast('Advisory Exported', `Generated training partner advisory for ${selectedGapDetail.skill}`);
                  }}
                  className="px-4 py-1.5 bg-[#005A9C] text-white rounded font-bold hover:bg-[#09244B] cursor-pointer"
                >
                  Export Center Advisory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
