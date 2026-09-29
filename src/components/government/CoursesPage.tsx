import React, { useState, useMemo } from 'react';
import { MOCK_GOV_COURSES, GovernmentCourse } from '../../data/governmentPagesData';

interface CoursesPageProps {
  onToast: (title: string, subtitle: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<GovernmentCourse | null>(null);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return MOCK_GOV_COURSES.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.mainSkillGap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.institute.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesInstitute =
        selectedInstitute === 'all' || course.institute === selectedInstitute;

      const matchesSector =
        selectedSector === 'all' || course.sector === selectedSector;

      return matchesSearch && matchesInstitute && matchesSector;
    });
  }, [searchQuery, selectedInstitute, selectedSector]);

  // Aggregate stats
  const totalEnrolled = useMemo(() => {
    return filteredCourses.reduce((acc, curr) => acc + curr.students, 0);
  }, [filteredCourses]);

  const avgCoursePlacement = useMemo(() => {
    if (filteredCourses.length === 0) return 0;
    const sum = filteredCourses.reduce((acc, curr) => acc + curr.placementRate, 0);
    return (sum / filteredCourses.length).toFixed(1);
  }, [filteredCourses]);

  const uniqueInstitutes = Array.from(new Set(MOCK_GOV_COURSES.map(c => c.institute)));
  const uniqueSectors = Array.from(new Set(MOCK_GOV_COURSES.map(c => c.sector)));

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Page Title & Gazette Identification */}
      <div className="bg-white rounded border border-[#C7D8E8] p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-jetbrains font-bold uppercase tracking-wider text-[#005A9C] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            NCVET • NATIONAL SKILL QUALIFICATION FRAMEWORK (NSQF)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09244B] tracking-tight mt-1">
            Approved Vocational Courses &amp; Trades
          </h1>
          <div className="h-1 w-20 bg-[#E06D10] mt-2 mb-1.5 rounded-full"></div>
          <p className="text-xs sm:text-sm text-[#475569]">
            Comprehensive registry of NSQF-aligned modular training curricula, enrollment statistics, and detected curriculum skill gaps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToast('Curriculum Syllabus Exported', 'Downloaded complete NSQF Level 4-6 syllabus package')}
            className="px-3.5 py-1.5 bg-white border border-[#C7D8E8] text-[#09244B] hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-[#005A9C]">menu_book</span>
            Download NSQF Syllabi
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-[#005A9C] text-white hover:bg-[#09244B] rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print Course Gazette
          </button>
        </div>
      </div>

      {/* 2. Metric Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Active Courses</span>
            <span className="material-symbols-outlined text-[20px] text-[#005A9C]">school</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#09244B] font-jetbrains">
              {filteredCourses.length}
            </span>
            <span className="text-[11px] text-[#005A9C] block font-semibold mt-0.5">NSQF Level 4, 5 &amp; 6</span>
          </div>
        </div>

        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Enrolled Trainees</span>
            <span className="material-symbols-outlined text-[20px] text-[#09244B]">group_add</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#09244B] font-jetbrains">
              {totalEnrolled.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 block font-semibold mt-0.5">Across All Batches</span>
          </div>
        </div>

        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Avg. Placement</span>
            <span className="material-symbols-outlined text-[20px] text-[#15803D]">verified</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#15803D] font-jetbrains">
              {avgCoursePlacement}%
            </span>
            <span className="text-[11px] text-[#15803D] block font-semibold mt-0.5">Verified Corporate Offers</span>
          </div>
        </div>

        <div className="bg-white rounded border border-[#C7D8E8] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Skill Gap Alerts</span>
            <span className="material-symbols-outlined text-[20px] text-[#E06D10]">warning</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#E06D10] font-jetbrains">
              6
            </span>
            <span className="text-[11px] text-amber-700 block font-semibold mt-0.5">Syllabus Review Advised</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded border border-[#C7D8E8] shadow-sm overflow-hidden">
        <div className="bg-[#EBF4FC] px-4 sm:px-6 py-2.5 border-b border-[#C7D8E8] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#09244B]">
            <span className="material-symbols-outlined text-[18px]">filter_alt</span>
            <span className="text-xs font-bold uppercase tracking-wider">Filter Course Directory</span>
          </div>
          <span className="text-[11px] text-[#475569] font-jetbrains">
            Showing {filteredCourses.length} of {MOCK_GOV_COURSES.length} Courses
          </span>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Search Input */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#09244B]">Search Course, Code, or Skill Gap</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Data Analytics, Power BI, Python..."
                className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#C7D8E8] rounded text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#005A9C]"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[16px] text-slate-400">search</span>
            </div>
          </div>

          {/* Institute Filter */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#09244B]">Filter by Institute</label>
            <select
              value={selectedInstitute}
              onChange={(e) => setSelectedInstitute(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#F8FAFC] border border-[#C7D8E8] rounded text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#005A9C]"
            >
              <option value="all">All Institutes</option>
              {uniqueInstitutes.map((inst, i) => (
                <option key={i} value={inst}>{inst}</option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#09244B]">Filter by Industry Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#F8FAFC] border border-[#C7D8E8] rounded text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#005A9C]"
            >
              <option value="all">All Industry Sectors</option>
              {uniqueSectors.map((sec, i) => (
                <option key={i} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. The Courses Table (Matches exact user specification) */}
      <div className="bg-white rounded border border-[#C7D8E8] shadow-sm overflow-hidden">
        <div className="bg-[#EBF4FC] px-4 sm:px-6 py-3 border-b border-[#C7D8E8] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#005A9C]">menu_book</span>
            <span className="text-sm font-extrabold text-[#09244B]">
              Course Performance &amp; Main Skill Gap Matrix
            </span>
          </div>
          <span className="text-xs text-[#005A9C] font-jetbrains font-semibold">
            Industry 4.0 Standard Audited
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E293B] border-collapse">
            <thead>
              <tr className="bg-[#09244B] text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Institute</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4">Placement Rate</th>
                <th className="py-3 px-4">Main Skill Gap</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C7D8E8]">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#64748B]">
                    No courses matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course, idx) => (
                  <tr key={`${course.id}-${idx}`} className="hover:bg-[#F8FAFC] transition-colors">
                    
                    {/* Course Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#09244B] text-sm">{course.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-jetbrains text-[11px] text-[#64748B]">{course.code}</span>
                          <span className="bg-[#EBF4FC] text-[#005A9C] px-1.5 py-0.5 rounded text-[10px] font-bold font-jetbrains border border-[#C7D8E8]">
                            NSQF Level {course.nsqfLevel}
                          </span>
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            {course.sector}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Institute */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#09244B] block">{course.institute}</span>
                      <span className="text-[11px] text-slate-500">{course.district}</span>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 font-jetbrains">
                      <span className="bg-slate-100 text-[#09244B] px-2 py-1 rounded font-bold text-xs inline-block">
                        {course.duration}
                      </span>
                    </td>

                    {/* Students */}
                    <td className="py-3.5 px-4 font-jetbrains">
                      <span className="text-sm font-bold text-[#09244B] block">{course.students}</span>
                      <span className="text-[10px] text-slate-500">Trained &amp; Evaluated</span>
                    </td>

                    {/* Placement Rate */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-jetbrains font-extrabold text-sm text-[#15803D]">
                          {course.placementRate}%
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          course.employmentTrend === 'High Demand' ? 'bg-emerald-100 text-emerald-800' :
                          course.employmentTrend === 'Growing' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {course.employmentTrend}
                        </span>
                      </div>
                    </td>

                    {/* Main Skill Gap */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1.5 rounded font-medium text-xs max-w-xs">
                        <span className="material-symbols-outlined text-[16px] text-[#E06D10] shrink-0">priority_high</span>
                        <span>{course.mainSkillGap}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCourseDetail(course)}
                        className="px-3 py-1.5 bg-[#EBF4FC] hover:bg-[#D4E8F8] text-[#005A9C] font-bold rounded text-xs transition-colors cursor-pointer border border-[#C7D8E8]"
                      >
                        Syllabus Audit
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[#F8FAFC] px-4 sm:px-6 py-3 border-t border-[#C7D8E8] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>Curricula standardized in alignment with National Occupational Standards (NOS).</span>
          <span className="font-jetbrains font-semibold text-[#005A9C]">
            NCVET Gazette Notification: 2026-ASSAM-DGT-71
          </span>
        </div>
      </div>

      {/* Course Audit Modal */}
      {selectedCourseDetail && (
        <div className="fixed inset-0 z-50 bg-[#09244B]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl max-w-lg w-full overflow-hidden border border-[#C7D8E8] animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#09244B] px-5 py-3.5 text-white flex items-center justify-between border-b-2 border-[#E06D10]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-300">school</span>
                <div>
                  <span className="text-xs font-bold block">{selectedCourseDetail.name}</span>
                  <span className="text-[10px] text-slate-300 font-jetbrains">{selectedCourseDetail.code}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourseDetail(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">Hosting Institute</span>
                  <span className="text-sm font-bold text-[#09244B]">{selectedCourseDetail.institute}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">NSQF Alignment</span>
                  <span className="text-sm font-extrabold text-[#005A9C]">Level {selectedCourseDetail.nsqfLevel} Certified</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">Training Duration</span>
                  <span className="text-sm font-bold font-jetbrains text-[#09244B]">{selectedCourseDetail.duration}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded border border-[#C7D8E8]">
                  <span className="text-[#64748B] block text-[11px]">Placement Conversion</span>
                  <span className="text-sm font-extrabold font-jetbrains text-[#15803D]">{selectedCourseDetail.placementRate}%</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#E06D10]">priority_high</span>
                  Identified Employer Skill Gap:
                </span>
                <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                  {selectedCourseDetail.mainSkillGap}
                </p>
                <span className="text-[11px] text-amber-700 block mt-1">
                  Recommended Action: Add 30-40 hours practical lab modules before final trade testing.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedCourseDetail(null)}
                  className="px-4 py-1.5 bg-[#F1F5F9] text-[#09244B] rounded font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourseDetail(null);
                    onToast('Curriculum Advisory Sent', `Dispatched curriculum revision guidelines for ${selectedCourseDetail.name}`);
                  }}
                  className="px-4 py-1.5 bg-[#005A9C] text-white rounded font-bold hover:bg-[#09244B] cursor-pointer"
                >
                  Issue Curriculum Directive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
