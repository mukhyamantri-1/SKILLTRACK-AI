import React, { useState, useMemo } from 'react';
import { MOCK_GOV_INSTITUTES, GovernmentInstitute } from '../../data/governmentPagesData';

interface InstitutesPageProps {
  onToast: (title: string, subtitle: string) => void;
}

export const InstitutesPage: React.FC<InstitutesPageProps> = ({ onToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedInstituteDetail, setSelectedInstituteDetail] = useState<GovernmentInstitute | null>(null);

  // Filter institutes
  const filteredInstitutes = useMemo(() => {
    return MOCK_GOV_INSTITUTES.filter((inst) => {
      const matchesSearch =
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.courses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDistrict =
        selectedDistrict === 'all' ||
        inst.district.toLowerCase().includes(selectedDistrict.toLowerCase());

      const matchesGrade =
        selectedGrade === 'all' || inst.grade === selectedGrade;

      return matchesSearch && matchesDistrict && matchesGrade;
    });
  }, [searchQuery, selectedDistrict, selectedGrade]);

  // Aggregate stats
  const totalTrained = useMemo(() => {
    return filteredInstitutes.reduce((acc, curr) => acc + curr.studentsTrained, 0);
  }, [filteredInstitutes]);

  const avgPlacementRate = useMemo(() => {
    if (filteredInstitutes.length === 0) return 0;
    const sum = filteredInstitutes.reduce((acc, curr) => acc + curr.placementRate, 0);
    return (sum / filteredInstitutes.length).toFixed(1);
  }, [filteredInstitutes]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Page Title & Gazette Identification */}
      <div className="bg-white rounded border border-[#C7D8E8] p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-jetbrains font-bold uppercase tracking-wider text-[#005A9C] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            DGT-EVAL-SYS • ACCREDITED TRAINING PARTNER REGISTRY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09244B] tracking-tight mt-1">
            Accredited Vocational Institutes &amp; Centers
          </h1>
          <div className="h-1 w-20 bg-[#E06D10] mt-2 mb-1.5 rounded-full"></div>
          <p className="text-xs sm:text-sm text-[#475569]">
            Official state registry of certified Industrial Training Institutes (ITIs) and vocational hubs under MSDE &amp; NCVET.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToast('Roster Exported', `Generated CSV export for ${filteredInstitutes.length} accredited institutes`)}
            className="px-3.5 py-1.5 bg-white border border-[#C7D8E8] text-[#09244B] hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-[#005A9C]">download</span>
            Export Institute Directory
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-[#005A9C] text-white hover:bg-[#09244B] rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print Directory
          </button>
        </div>
      </div>

      {/* 2. Quick Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Institutes</span>
            <span className="material-symbols-outlined text-[20px] text-[#005A9C]">domain</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#09244B] font-jetbrains">
              {filteredInstitutes.length}
            </span>
            <span className="text-[11px] text-[#005A9C] block font-semibold mt-0.5">NCVET Grade A/A+ Audited</span>
          </div>
        </div>

        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Districts Monitored</span>
            <span className="material-symbols-outlined text-[20px] text-[#E06D10]">location_on</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#09244B] font-jetbrains">
              6
            </span>
            <span className="text-[11px] text-slate-500 block font-semibold mt-0.5">Assam State Zone</span>
          </div>
        </div>

        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Students Trained</span>
            <span className="material-symbols-outlined text-[20px] text-[#15803D]">groups</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#09244B] font-jetbrains">
              {totalTrained.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#15803D] block font-semibold mt-0.5">Verified Biometric Enrollment</span>
          </div>
        </div>

        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Avg. Placement Rate</span>
            <span className="material-symbols-outlined text-[20px] text-[#15803D]">trending_up</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#15803D] font-jetbrains">
              {avgPlacementRate}%
            </span>
            <span className="text-[11px] text-slate-500 block font-semibold mt-0.5">Target Benchmark: 70%</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Parameters */}
      <div className="bg-white rounded border border-[#C7D8E8] shadow-sm overflow-hidden">
        <div className="bg-[#EBF4FC] px-4 sm:px-6 py-2.5 border-b border-[#C7D8E8] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#09244B]">
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="text-xs font-bold uppercase tracking-wider">Search &amp; Filter Institutes</span>
          </div>
          <span className="text-[11px] text-[#475569] font-jetbrains">
            Showing {filteredInstitutes.length} of {MOCK_GOV_INSTITUTES.length} Institutes
          </span>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Search Box */}
          <div className="flex flex-col gap-1 sm:col-span-1">
            <label className="font-bold text-[#09244B]">Search by Institute Name, Trade, or Code</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. ABC Skill Institute, Kamrup, Data Analytics..."
                className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#C7D8E8] rounded text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#005A9C]"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[16px] text-slate-400">search</span>
            </div>
          </div>

          {/* District Filter */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#09244B]">Filter by District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#F8FAFC] border border-[#C7D8E8] rounded text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#005A9C]"
            >
              <option value="all">All Districts (Statewide)</option>
              <option value="Kamrup Metropolitan">Kamrup Metropolitan</option>
              <option value="Kamrup Rural">Kamrup Rural</option>
              <option value="Dibrugarh">Dibrugarh</option>
              <option value="Jorhat">Jorhat</option>
              <option value="Cachar">Cachar</option>
              <option value="Sonitpur">Sonitpur</option>
              <option value="Nagaon">Nagaon</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#09244B]">Accreditation Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#F8FAFC] border border-[#C7D8E8] rounded text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#005A9C]"
            >
              <option value="all">All Accreditation Grades</option>
              <option value="A+">Grade A+ (Distinction)</option>
              <option value="A">Grade A (Compliant)</option>
              <option value="B+">Grade B+ (Provisionally Approved)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. The Institutes Table (Matches exact user specification) */}
      <div className="bg-white rounded border border-[#C7D8E8] shadow-sm overflow-hidden">
        <div className="bg-[#EBF4FC] px-4 sm:px-6 py-3 border-b border-[#C7D8E8] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#005A9C]">account_balance</span>
            <span className="text-sm font-extrabold text-[#09244B]">
              Registered Training Partner Performance Directory
            </span>
          </div>
          <span className="text-xs text-[#005A9C] font-jetbrains font-semibold">
            NCVET NQAF Audit Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E293B] border-collapse">
            <thead>
              <tr className="bg-[#09244B] text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Institute Name</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Courses</th>
                <th className="py-3 px-4">Students Trained</th>
                <th className="py-3 px-4">Placement Rate</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C7D8E8]">
              {filteredInstitutes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    No accredited institutes matched your query criteria.
                  </td>
                </tr>
              ) : (
                filteredInstitutes.map((inst, idx) => (
                  <tr key={`${inst.id}-${idx}`} className="hover:bg-[#F8FAFC] transition-colors">
                    
                    {/* Institute Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#09244B] text-sm">{inst.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-jetbrains text-[11px] text-[#64748B]">{inst.code}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold font-jetbrains ${
                            inst.grade === 'A+' ? 'bg-emerald-100 text-emerald-800' :
                            inst.grade === 'A' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            Grade {inst.grade}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* District */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-[#09244B] font-medium">
                        <span className="material-symbols-outlined text-[15px] text-[#E06D10]">pin_drop</span>
                        <span>{inst.district}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 ml-4 block">{inst.state}</span>
                    </td>

                    {/* Courses */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 max-w-xs">
                        <span className="font-bold text-[#005A9C]">
                          {inst.coursesCount} Specialized Trades
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {inst.courses.map((c, i) => (
                            <span key={i} className="bg-[#EBF4FC] text-[#09244B] px-2 py-0.5 rounded text-[10px] border border-[#C7D8E8]/60">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Students Trained */}
                    <td className="py-3.5 px-4 font-jetbrains">
                      <span className="text-sm font-bold text-[#09244B] block">
                        {inst.studentsTrained}
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        {inst.studentsCertified} Certified
                      </span>
                    </td>

                    {/* Placement Rate */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#15803D] h-full rounded-full"
                            style={{ width: `${Math.min(inst.placementRate, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-jetbrains font-extrabold text-sm text-[#15803D]">
                          {inst.placementRate}%
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748B] block mt-0.5">
                        {inst.studentsPlaced} of {inst.studentsTrained} Placed
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedInstituteDetail(inst)}
                        className="px-3 py-1.5 bg-[#EBF4FC] hover:bg-[#D4E8F8] text-[#005A9C] font-bold rounded text-xs transition-colors cursor-pointer border border-[#C7D8E8]"
                      >
                        View Dossier
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[#F8FAFC] px-4 sm:px-6 py-3 border-t border-[#C7D8E8] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>Direct integration with NCVET Portal &amp; National Skill Development Mission (NSDM).</span>
          <span className="font-jetbrains font-semibold text-[#09244B]">
            Registry Updated: Daily 00:00 IST Synchronized
          </span>
        </div>
      </div>

      {/* Institute Detail Modal */}
      {selectedInstituteDetail && (
        <div className="fixed inset-0 z-50 bg-[#09244B]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl max-w-lg w-full overflow-hidden border border-[#C7D8E8] animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#09244B] px-5 py-3.5 text-white flex items-center justify-between border-b-2 border-[#E06D10]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-300">domain</span>
                <div>
                  <span className="text-xs font-bold block">{selectedInstituteDetail.name}</span>
                  <span className="text-[10px] text-slate-300 font-jetbrains">{selectedInstituteDetail.code}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInstituteDetail(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">District / Location</span>
                  <span className="text-sm font-bold text-[#09244B]">{selectedInstituteDetail.district}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">Accreditation Grade</span>
                  <span className="text-sm font-extrabold text-[#005A9C]">Grade {selectedInstituteDetail.grade}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">Total Students Trained</span>
                  <span className="text-sm font-bold font-jetbrains text-[#09244B]">{selectedInstituteDetail.studentsTrained}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">Verified Placement Rate</span>
                  <span className="text-sm font-extrabold font-jetbrains text-[#15803D]">{selectedInstituteDetail.placementRate}%</span>
                </div>
              </div>

              <div className="p-3 bg-[#EBF4FC] rounded border border-[#C7D8E8]">
                <span className="font-bold text-[#09244B] block mb-1">Approved Trade Offerings:</span>
                <ul className="list-disc list-inside space-y-1 text-[#334155]">
                  {selectedInstituteDetail.courses.map((crs, i) => (
                    <li key={i}>{crs}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8] flex justify-between items-center">
                <div>
                  <span className="text-[#64748B] text-[11px] block">Center Superintendent</span>
                  <span className="font-bold text-[#09244B]">{selectedInstituteDetail.contactPerson}</span>
                </div>
                <span className="font-jetbrains font-semibold text-[#005A9C]">{selectedInstituteDetail.phone}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedInstituteDetail(null)}
                  className="px-4 py-1.5 bg-[#F1F5F9] text-[#09244B] rounded font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedInstituteDetail(null);
                    onToast('Audit Dossier Exported', `Downloaded full compliance report for ${selectedInstituteDetail.name}`);
                  }}
                  className="px-4 py-1.5 bg-[#005A9C] text-white rounded font-bold hover:bg-[#09244B] cursor-pointer"
                >
                  Download Audit Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
