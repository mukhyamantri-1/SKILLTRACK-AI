/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  getEmployerKpis,
  getActiveHires,
  getTraineeBio,
  createFeedbackRecord
} from '../lib/firebase';

const CURRENT_EMPLOYER_ID = 'EMP-ACC-01';
const CURRENT_EMPLOYER_NAME = 'Accenture';

interface EmployerViewProps {
  onChangeRole?: () => void;
}

type View = 'home' | 'feedback' | 'hires' | 'search';

export const EmployerView: React.FC<EmployerViewProps> = ({ onChangeRole }) => {
  const [view, setView] = useState<View>('home');
  const [loading, setLoading] = useState(true);
  const [employerName] = useState(CURRENT_EMPLOYER_NAME);
  const [hires, setHires] = useState<any[]>([]);
  const [pendingHires, setPendingHires] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [form, setForm] = useState({
    stillEmployed: true,
    currentSalary: '',
    promoted: false,
    performanceRating: 'Good',
    exitReason: '',
    notes: ''
  });

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [hiresFilter, setHiresFilter] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    (async () => {
      try {
        const [h] = await Promise.all([
          getActiveHires(CURRENT_EMPLOYER_ID),
          getEmployerKpis(CURRENT_EMPLOYER_ID)
        ]);
        const hiresArr = Array.isArray(h) ? h : [];
        setHires(hiresArr);
        const pending = hiresArr.filter((x: any) => x.isAuditPending === true);
        setPendingHires(pending);
        setPendingCount(pending.length);
      } catch (err) {
        console.warn('Employer fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setView('search');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  async function submitFeedback() {
    const hire = pendingHires[currentIndex];
    if (!hire) return;
    try {
      await createFeedbackRecord({
        traineeId: hire.traineeId || hire.id,
        employerId: CURRENT_EMPLOYER_ID,
        stillEmployed: form.stillEmployed,
        currentSalary: form.stillEmployed ? parseInt(form.currentSalary || '0', 10) : 0,
        promoted: form.promoted,
        performanceRating: form.performanceRating,
        exitReason: form.stillEmployed ? 'N/A' : form.exitReason,
        officerRemarks: form.notes,
        submittedAt: new Date().toISOString()
      });

      setForm({
        stillEmployed: true,
        currentSalary: '',
        promoted: false,
        performanceRating: 'Good',
        exitReason: '',
        notes: ''
      });

      const remaining = pendingHires.length - 1;
      if (remaining > 0) {
        setPendingHires((prev) => prev.slice(1));
        setPendingCount(remaining);
        setCurrentIndex(0);
        showToast('Feedback submitted · ' + remaining + ' remaining');
      } else {
        setPendingHires([]);
        setPendingCount(0);
        setCurrentIndex(0);
        setView('home');
        showToast('All feedback submitted. Thank you.');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not submit. Try again.');
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchLoading(true);
    setSearched(true);
    try {
      const r = await getTraineeBio(query.trim());
      setSearchResult(r);
    } catch (err) {
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  }

  const filteredHires = hiresFilter.trim()
    ? hires.filter((h: any) =>
        (h.name || '').toLowerCase().includes(hiresFilter.toLowerCase()) ||
        (h.traineeId || h.id || '').toLowerCase().includes(hiresFilter.toLowerCase())
      )
    : hires;

  return (
    <div
      className="min-h-screen bg-[#fafafa] text-[#111827]"
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      {/* NAV */}
      <nav className="border-b border-[#e5e7eb] bg-white sticky top-0 z-30">
        <div className="max-w-[1120px] mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-tight text-[#111827]">
            SkillTrack
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f3f4f6] text-[13px] font-medium text-[#374151]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
              {employerName}
            </span>
            {onChangeRole && (
              <button
                onClick={onChangeRole}
                className="text-[13px] text-[#6b7280] hover:text-[#111827]"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
        {loading ? (
          <div className="text-center text-[14px] text-[#9ca3af] pt-24">
            Loading…
          </div>
        ) : view === 'home' ? (
          <HomeScreen />
        ) : view === 'feedback' ? (
          <FeedbackScreen />
        ) : view === 'hires' ? (
          <HiresScreen />
        ) : (
          <SearchScreen />
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white text-[13px] px-5 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );

  // ============================================================
  // HOME
  // ============================================================
  function HomeScreen() {
    const hasPending = pendingCount > 0;

    return (
      <div>
        <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#9ca3af] mb-3">
          Good morning
        </div>
        <h1 className="text-[36px] font-medium tracking-[-0.02em] text-[#111827] mb-8 leading-tight">
          {employerName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mb-8">
          {/* FEEDBACK CARD */}
          {hasPending ? (
            <div className="relative rounded-2xl border border-[#fef3c7] bg-[#fffbeb] p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(217,119,6,0.08)]">
              <div className="w-10 h-10 rounded-full bg-[#fef3c7] flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-2.99l-6.93-12a2 2 0 00-3.48 0l-6.93 12A2 2 0 005.07 19z" />
                </svg>
              </div>
              <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#b45309] mb-2">
                Pending
              </div>
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className="text-[56px] font-medium leading-none tracking-[-0.03em] text-[#d97706]"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  {pendingCount}
                </span>
                <span className="text-[15px] text-[#92400e] leading-snug pb-1">
                  feedback request{pendingCount === 1 ? '' : 's'} to review
                </span>
              </div>
              <button
                onClick={() => { setCurrentIndex(0); setView('feedback'); }}
                className="group mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[14px] font-medium rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#2563eb]/10"
              >
                Review now
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#a7f3d0] bg-[#ecfdf5] p-7">
              <div className="w-10 h-10 rounded-full bg-[#a7f3d0] flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#065f46] mb-2">
                All caught up
              </div>
              <div className="text-[20px] font-medium tracking-[-0.01em] text-[#065f46] mb-1">
                No pending feedback
              </div>
              <p className="text-[14px] text-[#047857] leading-relaxed mt-1">
                We'll notify you when there's something new.
              </p>
            </div>
          )}

          {/* HIRES CARD */}
          <button
            onClick={() => setView('hires')}
            className="group text-left rounded-2xl border border-[#e5e7eb] bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d1d5db] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          >
            <div className="w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#9ca3af] mb-2">
              Active
            </div>
            <div
              className="text-[32px] font-medium tracking-[-0.02em] text-[#111827] leading-none"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {hires.length}
            </div>
            <div className="text-[14px] text-[#6b7280] mt-1 flex items-center gap-1">
              active hires
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
            </div>
          </button>
        </div>

        <div className="border-t border-[#e5e7eb] mb-4" />

        <button
          onClick={() => setView('search')}
          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-[#f3f4f6] transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center group-hover:bg-white transition-colors">
              <svg className="w-4 h-4 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-[15px] font-medium text-[#111827]">
              Search a candidate by ID
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#9ca3af] border border-[#e5e7eb] rounded px-2 py-1 bg-white">
            ⌘K
          </span>
        </button>
      </div>
    );
  }

  // ============================================================
  // FEEDBACK
  // ============================================================
  function FeedbackScreen() {
    const hire = pendingHires[currentIndex];

    if (!hire) {
      return (
        <div>
          <button
            onClick={() => setView('home')}
            className="text-[14px] text-[#6b7280] hover:text-[#111827] mb-8 flex items-center gap-1"
          >
            ← Home
          </button>
          <p className="text-[15px] text-[#4b5563]">No pending feedback.</p>
        </div>
      );
    }

    const total = pendingCount;
    const current = currentIndex + 1;
    const progress = total > 0 ? (current / total) * 100 : 0;
    const firstName = (hire.name || '').split(' ')[0] || 'this trainee';

    return (
      <div>
        <button
          onClick={() => setView('home')}
          className="text-[14px] text-[#6b7280] hover:text-[#111827] mb-8 flex items-center gap-1"
        >
          ← Home
        </button>

        <div className="h-1 bg-[#e5e7eb] rounded-full overflow-hidden mb-10">
          <div
            className="h-full bg-[#2563eb] transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#9ca3af] mb-3">
          Feedback {current} of {total}
        </div>

        <h2 className="text-[26px] font-medium tracking-[-0.02em] text-[#111827] mb-1">
          {hire.name}
        </h2>
        <p className="text-[14px] text-[#6b7280] mb-10">
          {hire.traineeId || hire.id} · {hire.role || 'Trainee'}
        </p>

        <div className="space-y-10">
          <div>
            <label className="block text-[15px] text-[#111827] font-medium mb-3">
              Is {firstName} still employed with you?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, stillEmployed: true })}
                className={
                  'h-12 rounded-lg text-[14px] font-medium transition-all border focus:outline-none focus:ring-4 focus:ring-[#2563eb]/10 ' +
                  (form.stillEmployed
                    ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm'
                    : 'bg-white text-[#374151] border-[#e5e7eb] hover:border-[#d1d5db]')
                }
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, stillEmployed: false })}
                className={
                  'h-12 rounded-lg text-[14px] font-medium transition-all border focus:outline-none focus:ring-4 focus:ring-[#2563eb]/10 ' +
                  (!form.stillEmployed
                    ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm'
                    : 'bg-white text-[#374151] border-[#e5e7eb] hover:border-[#d1d5db]')
                }
              >
                No, left
              </button>
            </div>
          </div>

          {form.stillEmployed ? (
            <>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-2">
                  Current annual salary
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#9ca3af]">₹</span>
                  <input
                    type="number"
                    value={form.currentSalary}
                    onChange={(e) => setForm({ ...form, currentSalary: e.target.value })}
                    placeholder="650000"
                    className="w-full h-12 pl-9 pr-4 bg-white border border-[#e5e7eb] rounded-lg text-[15px] text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[15px] text-[#111827] font-medium mb-3">
                  Any promotion since last review?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, promoted: true })}
                    className={
                      'h-12 rounded-lg text-[14px] font-medium transition-all border focus:outline-none focus:ring-4 focus:ring-[#2563eb]/10 ' +
                      (form.promoted
                        ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm'
                        : 'bg-white text-[#374151] border-[#e5e7eb] hover:border-[#d1d5db]')
                    }
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, promoted: false })}
                    className={
                      'h-12 rounded-lg text-[14px] font-medium transition-all border focus:outline-none focus:ring-4 focus:ring-[#2563eb]/10 ' +
                      (!form.promoted
                        ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm'
                        : 'bg-white text-[#374151] border-[#e5e7eb] hover:border-[#d1d5db]')
                    }
                  >
                    No
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-2">
                Reason for leaving
              </label>
              <select
                value={form.exitReason}
                onChange={(e) => setForm({ ...form, exitReason: e.target.value })}
                className="w-full h-12 px-4 bg-white border border-[#e5e7eb] rounded-lg text-[15px] text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
              >
                <option value="">Select a reason</option>
                <option value="better_opportunity">Better opportunity</option>
                <option value="family">Family reasons</option>
                <option value="health">Health</option>
                <option value="relocation">Relocation</option>
                <option value="performance">Performance</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[15px] text-[#111827] font-medium mb-3">
              Overall performance
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Excellent', 'Good', 'Average', 'Below Average'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, performanceRating: r })}
                  className={
                    'h-11 rounded-lg text-[13px] font-medium transition-all border px-2 focus:outline-none focus:ring-4 focus:ring-[#2563eb]/10 ' +
                    (form.performanceRating === r
                      ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm'
                      : 'bg-white text-[#374151] border-[#e5e7eb] hover:border-[#d1d5db]')
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-2">
              Additional notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Add any context…"
              className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-lg text-[15px] text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 resize-none transition-all"
            />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#e5e7eb] flex items-center justify-between">
          <button
            onClick={() => setView('home')}
            className="text-[15px] text-[#6b7280] hover:text-[#111827]"
          >
            Skip for now
          </button>
          <button
            onClick={submitFeedback}
            className="group inline-flex items-center gap-2 px-5 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[14px] font-medium rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#2563eb]/10"
          >
            Submit feedback
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // HIRES
  // ============================================================
  function HiresScreen() {
    return (
      <div>
        <button
          onClick={() => setView('home')}
          className="text-[14px] text-[#6b7280] hover:text-[#111827] mb-8 flex items-center gap-1"
        >
          ← Home
        </button>

        <h2 className="text-[26px] font-medium tracking-[-0.02em] text-[#111827] mb-1">
          All hires
        </h2>
        <p className="text-[14px] text-[#6b7280] mb-8">
          {hires.length} employee{hires.length === 1 ? '' : 's'}
        </p>

        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={hiresFilter}
            onChange={(e) => setHiresFilter(e.target.value)}
            placeholder="Filter by name or ID"
            className="w-full h-11 pl-10 pr-4 bg-[#f3f4f6] rounded-lg text-[14px] text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10 border border-transparent focus:border-[#2563eb] transition-all"
          />
        </div>

        <div className="border-t border-[#f3f4f6]">
          {filteredHires.map((h: any, i: number) => {
            const isPending = h.isAuditPending === true;
            return (
              <button
                key={i}
                onClick={() => {
                  if (isPending) {
                    const idx = pendingHires.findIndex(
                      (p: any) => (p.traineeId || p.id) === (h.traineeId || h.id)
                    );
                    if (idx >= 0) {
                      setCurrentIndex(idx);
                      setView('feedback');
                    }
                  }
                }}
                className="w-full flex items-center justify-between py-4 border-b border-[#f3f4f6] hover:bg-[#fafafa] transition-colors text-left px-2 -mx-2 rounded"
              >
                <div>
                  <div className="text-[15px] font-medium text-[#111827]">
                    {h.name}
                  </div>
                  <div className="text-[13px] text-[#6b7280] mt-0.5">
                    {h.traineeId || h.id} · {h.role || 'Trainee'} · Joined {h.joiningDate || '—'}
                  </div>
                </div>
                <div>
                  {isPending ? (
                    <span className="text-[11px] uppercase tracking-wide font-semibold text-[#92400e] bg-[#fef3c7] px-2.5 py-1 rounded-full">
                      Pending
                    </span>
                  ) : (
                    <span className="text-[11px] uppercase tracking-wide font-semibold text-[#065f46] bg-[#d1fae5] px-2.5 py-1 rounded-full">
                      Up to date
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {filteredHires.length === 0 && (
          <div className="text-center py-16 text-[14px] text-[#9ca3af]">
            No matches.
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // SEARCH
  // ============================================================
  function SearchScreen() {
    return (
      <div>
        <button
          onClick={() => { setView('home'); setSearched(false); setQuery(''); setSearchResult(null); }}
          className="text-[14px] text-[#6b7280] hover:text-[#111827] mb-8 flex items-center gap-1"
        >
          ← Home
        </button>

        <h2 className="text-[26px] font-medium tracking-[-0.02em] text-[#111827] mb-1">
          Search candidate
        </h2>
        <p className="text-[14px] text-[#6b7280] mb-8">
          Enter a candidate ID to view or submit feedback.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="MAH-PUN-001"
            className="flex-1 h-12 px-4 bg-white border border-[#e5e7eb] rounded-lg text-[15px] text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 transition-all"
          />
          <button
            type="submit"
            disabled={searchLoading}
            className="h-12 px-5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[14px] font-medium rounded-lg disabled:opacity-50 transition-colors"
          >
            {searchLoading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {searched && !searchLoading && searchResult && (
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center shrink-0">
                <span className="text-[15px] font-semibold text-[#2563eb]">
                  {(searchResult.name || '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-[17px] font-medium text-[#111827] mb-0.5">
                  {searchResult.name}
                </div>
                <div className="text-[13px] text-[#6b7280]">
                  {searchResult.id} · {searchResult.institution || 'Institution'}
                </div>
                {searchResult.courseName && (
                  <div className="text-[13px] text-[#6b7280] mt-0.5">
                    {searchResult.courseName}
                  </div>
                )}
              </div>
            </div>
            {(() => {
              const idx = pendingHires.findIndex(
                (p: any) => (p.traineeId || p.id) === searchResult.id
              );
              return idx >= 0 ? (
                <button
                  onClick={() => {
                    setCurrentIndex(idx);
                    setView('feedback');
                  }}
                  className="group mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[14px] font-medium rounded-lg transition-all"
                >
                  Submit feedback
                  <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
                </button>
              ) : (
                <div className="mt-5 inline-flex items-center gap-2 text-[13px] text-[#065f46] bg-[#ecfdf5] border border-[#a7f3d0] px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  No pending feedback for this candidate.
                </div>
              );
            })()}
          </div>
        )}

        {searched && !searchLoading && !searchResult && (
          <div className="text-center py-16 text-[14px] text-[#9ca3af]">
            No candidate found with this ID.
          </div>
        )}
      </div>
    );
  }
};

export default EmployerView;
