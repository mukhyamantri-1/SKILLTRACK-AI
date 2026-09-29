import React, { useState, useMemo } from 'react';
import {
  MOCK_GOV_EMPLOYMENT_METRICS,
  MOCK_GOV_EMPLOYMENT_TABLE,
  GovernmentEmploymentOutcome
} from '../../data/governmentPagesData';

interface EmploymentOutcomesPageProps {
  onToast: (title: string, subtitle: string) => void;
}

export const EmploymentOutcomesPage: React.FC<EmploymentOutcomesPageProps> = ({ onToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedOutcomeDetail, setSelectedOutcomeDetail] = useState<GovernmentEmploymentOutcome | null>(null);

  const filteredOutcomes = useMemo(() => {
    return MOCK_GOV_EMPLOYMENT_TABLE.filter((row) => {
      const matchesSearch =
        row.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.institute.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.batchCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDistrict =
        selectedDistrict === 'all' || row.district.toLowerCase().includes(selectedDistrict.toLowerCase());

      return matchesSearch && matchesDistrict;
    });
  }, [searchQuery, selectedDistrict]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Page Title & Gazette Identification */}
      <div className="bg-white rounded border border-[#C7D8E8] p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-jetbrains font-bold uppercase tracking-wider text-[#005A9C] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            LONGITUDINAL EMPLOYMENT VERIFICATION • EPFO &amp; DIRECT TAX SYNCED
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09244B] tracking-tight mt-1">
            Employment Outcomes &amp; Retention Registry
          </h1>
          <div className="h-1 w-20 bg-[#E06D10] mt-2 mb-1.5 rounded-full"></div>
          <p className="text-xs sm:text-sm text-[#475569]">
            Official evaluation of candidate placement, wage increments, 6-month retention ratios, and EPFO active social security status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToast('EPFO Sync Refreshed', 'Successfully cross-referenced 1,250 candidate records against EPFO UAN databases')}
            className="px-3.5 py-1.5 bg-white border border-[#C7D8E8] text-[#09244B] hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-[#15803D]">sync</span>
            Refresh EPFO Sync
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-[#005A9C] text-white hover:bg-[#09244B] rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print Employment Gazette
          </button>
        </div>
      </div>

      {/* 2. Required 7 Metric Cards (Exact Prompt Requirement) */}
      {/* 
        - Students Trained
        - Certified
        - Placed
        - Currently Employed
        - Average Starting Salary
        - Average Current Salary
        - Retention Rate
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-3.5">
        
        {/* 1. Students Trained */}
        <div className="bg-white rounded border border-[#C7D8E8] p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Students Trained</span>
            <span className="material-symbols-outlined text-[18px] text-[#09244B]">school</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-[#09244B] font-jetbrains block">
              {MOCK_GOV_EMPLOYMENT_METRICS.studentsTrained.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Biometric Validated</span>
          </div>
        </div>

        {/* 2. Certified */}
        <div className="bg-white rounded border border-[#C7D8E8] p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Certified</span>
            <span className="material-symbols-outlined text-[18px] text-[#005A9C]">workspace_premium</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-[#005A9C] font-jetbrains block">
              {MOCK_GOV_EMPLOYMENT_METRICS.certified.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#005A9C] font-semibold block mt-0.5">
              {MOCK_GOV_EMPLOYMENT_METRICS.certificationRate}% Passed
            </span>
          </div>
        </div>

        {/* 3. Placed */}
        <div className="bg-white rounded border border-[#C7D8E8] p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Placed</span>
            <span className="material-symbols-outlined text-[18px] text-[#15803D]">how_to_reg</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-[#15803D] font-jetbrains block">
              {MOCK_GOV_EMPLOYMENT_METRICS.placed.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#15803D] font-semibold block mt-0.5">
              {MOCK_GOV_EMPLOYMENT_METRICS.placementRate}% Rate
            </span>
          </div>
        </div>

        {/* 4. Currently Employed */}
        <div className="bg-white rounded border border-[#C7D8E8] p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Currently Employed</span>
            <span className="material-symbols-outlined text-[18px] text-[#15803D]">verified_user</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-[#15803D] font-jetbrains block">
              {MOCK_GOV_EMPLOYMENT_METRICS.currentlyEmployed.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Active on Payroll</span>
          </div>
        </div>

        {/* 5. Average Starting Salary */}
        <div className="bg-white rounded border border-[#C7D8E8] p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Avg. Starting Salary</span>
            <span className="material-symbols-outlined text-[18px] text-[#005A9C]">payments</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-[#005A9C] font-jetbrains block">
              {MOCK_GOV_EMPLOYMENT_METRICS.averageStartingSalary}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
              {MOCK_GOV_EMPLOYMENT_METRICS.averageStartingSalaryLpa}
            </span>
          </div>
        </div>

        {/* 6. Average Current Salary */}
        <div className="bg-white rounded border border-[#C7D8E8] p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Avg. Current Salary</span>
            <span className="material-symbols-outlined text-[18px] text-[#E06D10]">trending_up</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-[#E06D10] font-jetbrains block">
              {MOCK_GOV_EMPLOYMENT_METRICS.averageCurrentSalary}
            </span>
            <span className="text-[10px] text-[#15803D] font-bold block mt-0.5">
              {MOCK_GOV_EMPLOYMENT_METRICS.salaryGrowth} YoY Increment
            </span>
          </div>
        </div>

        {/* 7. Retention Rate */}
        <div className="bg-white rounded border border-[#C7D8E8] p-3.5 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Retention Rate</span>
            <span className="material-symbols-outlined text-[18px] text-[#15803D]">schedule</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-[#15803D] font-jetbrains block">
              {MOCK_GOV_EMPLOYMENT_METRICS.retentionRate}
            </span>
            <span className="text-[10px] text-[#15803D] font-semibold block mt-0.5">6-Month Continuous</span>
          </div>
        </div>

      </div>

      {/* 3. Search / Filter Parameters */}
      <div className="bg-white rounded border border-[#C7D8E8] shadow-sm overflow-hidden">
        <div className="bg-[#EBF4FC] px-4 sm:px-6 py-2.5 border-b border-[#C7D8E8] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#09244B]">
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="text-xs font-bold uppercase tracking-wider">Search Outcome Registry</span>
          </div>
          <span className="text-[11px] text-[#475569] font-jetbrains">
            Showing {filteredOutcomes.length} Monitored Program Batches
          </span>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#09244B]">Search Program, Institute, or Batch Code</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Data Analytics, ABC Skill Institute, BATCH-2024..."
                className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#C7D8E8] rounded text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#005A9C]"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[16px] text-slate-400">search</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#09244B]">Filter by District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#F8FAFC] border border-[#C7D8E8] rounded text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#005A9C]"
            >
              <option value="all">All Districts (Statewide)</option>
              <option value="Kamrup">Kamrup</option>
              <option value="Dibrugarh">Dibrugarh</option>
              <option value="Jorhat">Jorhat</option>
              <option value="Cachar">Cachar</option>
              <option value="Sonitpur">Sonitpur</option>
              <option value="Nagaon">Nagaon</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Simple Employment Outcome Table (Exact Prompt Requirement) */}
      <div className="bg-white rounded border border-[#C7D8E8] shadow-sm overflow-hidden">
        <div className="bg-[#EBF4FC] px-4 sm:px-6 py-3 border-b border-[#C7D8E8] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#005A9C]">table_chart</span>
            <span className="text-sm font-extrabold text-[#09244B]">
              Longitudinal Employment Outcomes Table
            </span>
          </div>
          <span className="text-xs text-[#15803D] font-jetbrains font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            EPFO Active Sync
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E293B] border-collapse">
            <thead>
              <tr className="bg-[#09244B] text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Batch / Program</th>
                <th className="py-3 px-4">Institute &amp; District</th>
                <th className="py-3 px-4">Trained</th>
                <th className="py-3 px-4">Certified</th>
                <th className="py-3 px-4">Placed</th>
                <th className="py-3 px-4">Employed</th>
                <th className="py-3 px-4">Avg Starting Salary</th>
                <th className="py-3 px-4">Avg Current Salary</th>
                <th className="py-3 px-4">Retention</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C7D8E8]">
              {filteredOutcomes.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[#64748B]">
                    No employment outcome batches matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOutcomes.map((row, idx) => (
                  <tr key={`${row.id}-${idx}`} className="hover:bg-[#F8FAFC] transition-colors">
                    
                    {/* Batch / Program */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#09244B] text-sm">{row.program}</span>
                        <span className="font-jetbrains text-[11px] text-[#64748B]">{row.batchCode}</span>
                      </div>
                    </td>

                    {/* Institute & District */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#09244B] block">{row.institute}</span>
                      <span className="text-[11px] text-slate-500">{row.district}</span>
                    </td>

                    {/* Trained */}
                    <td className="py-3.5 px-4 font-jetbrains font-bold text-[#09244B]">
                      {row.trained}
                    </td>

                    {/* Certified */}
                    <td className="py-3.5 px-4 font-jetbrains font-bold text-[#005A9C]">
                      {row.certified}
                    </td>

                    {/* Placed */}
                    <td className="py-3.5 px-4 font-jetbrains font-bold text-[#15803D]">
                      {row.placed}
                    </td>

                    {/* Employed */}
                    <td className="py-3.5 px-4 font-jetbrains font-bold text-[#15803D]">
                      {row.currentlyEmployed}
                    </td>

                    {/* Avg Starting Salary */}
                    <td className="py-3.5 px-4 font-jetbrains font-bold text-[#005A9C]">
                      {row.avgStartingSalary}
                    </td>

                    {/* Avg Current Salary */}
                    <td className="py-3.5 px-4 font-jetbrains font-bold text-[#E06D10]">
                      {row.avgCurrentSalary}
                    </td>

                    {/* Retention */}
                    <td className="py-3.5 px-4">
                      <span className="font-jetbrains font-extrabold text-[#15803D] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block">
                        {row.retentionRate}%
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOutcomeDetail(row)}
                        className="px-2.5 py-1 bg-[#EBF4FC] hover:bg-[#D4E8F8] text-[#005A9C] font-bold rounded text-xs transition-colors cursor-pointer border border-[#C7D8E8]"
                      >
                        EPFO Audit
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[#F8FAFC] px-4 sm:px-6 py-3 border-t border-[#C7D8E8] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>Direct integration with Employees Provident Fund Organisation (EPFO) &amp; Income Tax PAN verification.</span>
          <span className="font-jetbrains font-semibold text-[#15803D]">
            EPFO Active Status Rate: 94.2% Verified
          </span>
        </div>
      </div>

      {/* Outcome Detail Modal */}
      {selectedOutcomeDetail && (
        <div className="fixed inset-0 z-50 bg-[#09244B]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl max-w-lg w-full overflow-hidden border border-[#C7D8E8] animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#09244B] px-5 py-3.5 text-white flex items-center justify-between border-b-2 border-[#E06D10]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-300">verified</span>
                <div>
                  <span className="text-xs font-bold block">{selectedOutcomeDetail.program}</span>
                  <span className="text-[10px] text-slate-300 font-jetbrains">{selectedOutcomeDetail.batchCode}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOutcomeDetail(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">Training Institute</span>
                  <span className="text-sm font-bold text-[#09244B]">{selectedOutcomeDetail.institute}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">EPFO Sync Status</span>
                  <span className="text-xs font-extrabold text-[#15803D]">{selectedOutcomeDetail.epfoSyncStatus}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">Starting Remuneration</span>
                  <span className="text-sm font-bold font-jetbrains text-[#005A9C]">{selectedOutcomeDetail.avgStartingSalary}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">Current Salary (1 Yr Post)</span>
                  <span className="text-sm font-extrabold font-jetbrains text-[#E06D10]">{selectedOutcomeDetail.avgCurrentSalary}</span>
                </div>
              </div>

              <div className="p-3 bg-[#EBF4FC] rounded border border-[#C7D8E8]">
                <span className="font-bold text-[#09244B] block mb-1">Longitudinal Conversion Funnel:</span>
                <div className="flex items-center justify-between text-center font-jetbrains pt-1">
                  <div>
                    <span className="text-base font-extrabold text-[#09244B] block">{selectedOutcomeDetail.trained}</span>
                    <span className="text-[10px] text-slate-500">Trained</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-slate-400">arrow_forward</span>
                  <div>
                    <span className="text-base font-extrabold text-[#005A9C] block">{selectedOutcomeDetail.certified}</span>
                    <span className="text-[10px] text-slate-500">Certified</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-slate-400">arrow_forward</span>
                  <div>
                    <span className="text-base font-extrabold text-[#15803D] block">{selectedOutcomeDetail.placed}</span>
                    <span className="text-[10px] text-slate-500">Placed</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-slate-400">arrow_forward</span>
                  <div>
                    <span className="text-base font-extrabold text-[#15803D] block">{selectedOutcomeDetail.currentlyEmployed}</span>
                    <span className="text-[10px] text-slate-500">Retained</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedOutcomeDetail(null)}
                  className="px-4 py-1.5 bg-[#F1F5F9] text-[#09244B] rounded font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOutcomeDetail(null);
                    onToast('Audit Record Exported', `Downloaded EPFO verification certificate for ${selectedOutcomeDetail.batchCode}`);
                  }}
                  className="px-4 py-1.5 bg-[#005A9C] text-white rounded font-bold hover:bg-[#09244B] cursor-pointer"
                >
                  Export EPFO Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
