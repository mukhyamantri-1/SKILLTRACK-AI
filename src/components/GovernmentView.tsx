/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SkillTrackLogo } from './SkillTrackLogo';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  getGovernmentMetrics,
  getInstitutesPerformance,
  getGovernmentSkillGaps,
  getGovernmentReports,
  getGovernmentCourses,
  getTraineeBio,
  getTraineesByInstitute,
  getTraineeFullProfile,
  getEmployers,
  getEmployerTrustScores,
  getAttritionReasons,
  getFullTraineeIndex,
  getFullCompetencyIndex,
  getFullCredentialIndex,
  getFullHireIndex,
  getFullCourseIndex,
  getFullAttritionIndex
} from '../lib/firebase';

interface GovernmentViewProps {
  onChangeRole?: () => void;
}

const TABS = [
  'DASHBOARD',
  'INSTITUTES',
  'COURSES',
  'EMPLOYMENT OUTCOMES',
  'SKILL GAPS',
  'EMPLOYERS',
  'REPORTS'
];

const DISTRICTS = ['All Districts', 'Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Kolhapur'];
const YEARS = ['2026', '2025', '2024'];

const MINISTRIES = [
  { name: 'MSDE', subtitle: 'Skill Development' },
  { name: 'NCVET', subtitle: 'Vocational Education' },
  { name: 'DGT', subtitle: 'General Training' },
  { name: 'NSDC', subtitle: 'Skill Corporation' },
  { name: 'Skill India', subtitle: 'Kaushal Bharat' },
  { name: 'PMKVY', subtitle: 'Kaushal Vikas Yojana' },
  { name: 'DigiLocker', subtitle: 'Digital Document Wallet' },
  { name: 'India.gov.in', subtitle: 'National Portal' },
];

const INDUSTRY = [
  { name: 'Accenture', subtitle: 'IT Services' },
  { name: 'TCS', subtitle: 'IT Services' },
  { name: 'Infosys', subtitle: 'IT Services' },
  { name: 'Wipro', subtitle: 'IT Services' },
  { name: 'HDFC Bank', subtitle: 'Banking' },
  { name: 'Bajaj Auto', subtitle: 'Manufacturing' },
  { name: 'Mahindra', subtitle: 'Automotive' },
  { name: 'Reliance', subtitle: 'Retail' },
  { name: 'Apollo Hospitals', subtitle: 'Healthcare' },
  { name: 'Tata Motors', subtitle: 'Automotive' },
  { name: 'Thermax', subtitle: 'Engineering' },
  { name: 'Tech Mahindra', subtitle: 'IT Services' },
];

type Detail =
  | { type: 'institute'; id: string; name: string }
  | { type: 'student'; id: string; name: string }
  | { type: 'course'; id: string; name: string }
  | { type: 'employer'; id: string; name: string }
  | null;

export const GovernmentView: React.FC<GovernmentViewProps> = ({ onChangeRole }) => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Detail>(null);

  const [metrics, setMetrics] = useState<any>(null);
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [trustScores, setTrustScores] = useState<any[]>([]);
  const [attritionReasons, setAttritionReasons] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLanguage, setAiLanguage] = useState<'en' | 'hi'>('en');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<'en' | 'hi'>('en');
  const [chatDataLoaded, setChatDataLoaded] = useState(false);
  const [chatFullData, setChatFullData] = useState<any>({
    trainees: [],
    competencies: [],
    credentials: [],
    hires: [],
    courses: [],
    attrition: [],
  });
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchStudent, setSearchStudent] = useState<any>(null);
  const [searchingStudent, setSearchingStudent] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [visitorCount, setVisitorCount] = useState(151744354);

  const [reportType, setReportType] = useState('institute');
  const [reportInstitute, setReportInstitute] = useState('');
  const [reportDistrict, setReportDistrict] = useState('All Districts');
  const [reportCourse, setReportCourse] = useState('');
  const [reportEmployer, setReportEmployer] = useState('');
  const [reportYear, setReportYear] = useState('2026');

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    (async () => {
      try {
        const [m, i, sg, rp, cs, emp, ts, ar] = await Promise.all([
          getGovernmentMetrics(),
          getInstitutesPerformance(),
          getGovernmentSkillGaps(),
          getGovernmentReports(),
          getGovernmentCourses(),
          getEmployers(),
          getEmployerTrustScores(),
          getAttritionReasons()
        ]);
        setMetrics(m || null);
        setInstitutes(Array.isArray(i) ? i : []);
        setSkillGaps(Array.isArray(sg) ? sg : []);
        setReports(Array.isArray(rp) ? rp : []);
        setCourses(Array.isArray(cs) ? cs : []);
        setEmployers(Array.isArray(emp) ? emp : []);
        setTrustScores(Array.isArray(ts) ? ts : []);
        setAttritionReasons(Array.isArray(ar) ? ar : []);
      } catch (err) {
        console.warn('Government fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const q = searchQuery.trim();
    const isIdPattern = /^MAH-[A-Z]+-\d+$/i.test(q);
    if (!isIdPattern) {
      setSearchStudent(null);
      return;
    }
    setSearchingStudent(true);
    getTraineeBio(q)
      .then((r: any) => setSearchStudent(r))
      .catch(() => setSearchStudent(null))
      .finally(() => setSearchingStudent(false));
  }, [searchQuery]);

  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);

  const filteredInstitutes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return institutes.filter((i: any) =>
      (i.name || '').toLowerCase().includes(q) ||
      (i.id || '').toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery, institutes]);

  const showDropdown = searchOpen && searchQuery.trim().length >= 2;

  const handleInstituteClick = (inst: any) => {
    setDetail({ type: 'institute', id: inst.id, name: inst.name });
    setSearchOpen(false);
    window.scrollTo({ top: 0 });
  };
  const handleStudentClick = (student: any) => {
    setDetail({ type: 'student', id: student.id, name: student.name });
    setSearchOpen(false);
    window.scrollTo({ top: 0 });
  };
  const handleCourseClick = (course: any) => {
    setDetail({ type: 'course', id: course.id, name: course.name });
    window.scrollTo({ top: 0 });
  };
  const handleEmployerClick = (emp: any) => {
    setDetail({ type: 'employer', id: emp.id || emp.employerId, name: emp.name || emp.employerName });
    window.scrollTo({ top: 0 });
  };
  const goDashboard = () => {
    setDetail(null);
    setActiveTab('DASHBOARD');
  };

  const mergedEmployers = useMemo(() => {
    return employers.map((e: any) => {
      const ts = trustScores.find((t: any) =>
        (t.employerId || t.id) === (e.id || e.employerId)
      );
      return {
        ...e,
        trustScore: ts?.compositeScore || 0,
        trustGrade: ts?.grade || 'unknown',
        feedbackRate: ts?.feedbackSubmissionRate || 0,
        retentionRate: ts?.retentionRate || 0,
        dataConsistency: ts?.dataConsistency || 0,
        partnershipTenure: ts?.partnershipTenure || 0,
        badges: ts?.badges || [],
        lastEvaluated: ts?.lastEvaluated || ''
      };
    }).sort((a, b) => a.trustScore - b.trustScore);
  }, [employers, trustScores]);

  const districtSummary = useMemo(() => {
    const byDistrict: Record<string, any> = {};
    institutes.forEach((i: any) => {
      const d = i.district || 'Unknown';
      if (!byDistrict[d]) {
        byDistrict[d] = { district: d, trained: 0, certified: 0, placed: 0, employed: 0 };
      }
      byDistrict[d].trained += i.trained || 0;
      byDistrict[d].certified += i.certified || 0;
      byDistrict[d].placed += i.placed || 0;
      byDistrict[d].employed += i.employed || 0;
    });
    return Object.values(byDistrict).sort((a: any, b: any) => a.district.localeCompare(b.district));
  }, [institutes]);

  const groupedAttrition = useMemo(() => {
    const byReason: Record<string, number> = {};
    attritionReasons.forEach((a: any) => {
      const r = a.reason || 'Unknown';
      byReason[r] = (byReason[r] || 0) + 1;
    });
    const total = Object.values(byReason).reduce((s: number, x: any) => s + x, 0);
    return Object.entries(byReason)
      .map(([reason, count]) => ({ reason, count, percent: total > 0 ? Math.round((count / total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [attritionReasons]);

  const topPerformers = useMemo(() => {
    return institutes
      .map((i: any) => {
        const trained = i.trained || 0;
        const placed = i.placed || 0;
        const placementRate = trained > 0 ? Math.round((placed / trained) * 1000) / 10 : 0;
        return { ...i, placementRate };
      })
      .sort((a: any, b: any) => b.placementRate - a.placementRate)
      .slice(0, 5);
  }, [institutes]);

  const watchlist = useMemo(() => {
    return institutes
      .map((i: any) => {
        const trained = i.trained || 0;
        const placed = i.placed || 0;
        const placementRate = trained > 0 ? Math.round((placed / trained) * 1000) / 10 : 0;
        return { ...i, placementRate };
      })
      .filter((i: any) => i.placementRate < 70 && i.placementRate > 0)
      .sort((a: any, b: any) => a.placementRate - b.placementRate);
  }, [institutes]);

  const generateInstituteReport = (instituteId: string) => {
    const inst = institutes.find((i: any) =>
      i.id === instituteId || i.instituteId === instituteId || i.name === instituteId
    );

    if (!inst) {
      showToast('Institute not found');
      return;
    }

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = 210;
    const pageH = 297;
    const margin = 18;
    const contentW = pageW - margin * 2;

    const trained = inst.trained || 0;
    const certified = inst.certified || 0;
    const placed = inst.placed || 0;
    const employed = inst.employed || 0;
    const placementRate = trained > 0 ? Math.round((placed / trained) * 1000) / 10 : 0;
    const retentionRate = placed > 0 ? Math.round((employed / placed) * 1000) / 10 : 0;
    const avgSalary = inst.avgSalary || '—';
    const reportCode = 'DGT/INST-PERF/2026/' + (inst.id || 'XXX').replace('INS-', '');
    const now = new Date();
    const genDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const genTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const NAVY: [number, number, number] = [11, 61, 145];
    const ORANGE: [number, number, number] = [234, 88, 12];
    const SLATE: [number, number, number] = [71, 85, 105];
    const LIGHT_BG: [number, number, number] = [254, 249, 243];

    // ---------- PAGE 1: COVER ----------
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, 0, pageW, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('GOVERNMENT OF INDIA', margin, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Ministry of Skill Development & Entrepreneurship', margin, 20);
    doc.text('Directorate General of Training', margin, 25);
    doc.text('SkillTrack AI - National Outcome Monitoring Portal', margin, 30);

    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('INSTITUTE PERFORMANCE', margin, 70);
    doc.text('REPORT', margin, 82);

    doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
    doc.rect(margin, 88, 40, 1.2, 'F');

    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text(inst.name || 'Unknown Institute', margin, 105);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text('Report Code: ' + reportCode, margin, 115);
    doc.text('Report Cycle: FY 2025-26', margin, 121);
    doc.text('District: ' + (inst.district || '—'), margin, 127);
    doc.text('Generated: ' + genDate + ', ' + genTime + ' IST', margin, 133);

    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, pageH - 30, pageW, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('This report is generated from verified data in the SkillTrack AI Firestore database.', margin, pageH - 18);
    doc.text('Data sources: institutesPerformance . traineeBios . currentEmployments . employerTrustScores', margin, pageH - 13);
    doc.text('Page 1 of 8 | SkillTrack AI . National Outcome Monitoring Portal', pageW - margin, pageH - 8, { align: 'right' });

    // ---------- HELPERS ----------
    const addPageHeader = (title: string, pageNum: number) => {
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.rect(0, 0, pageW, 18, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('SKILLTRACK AI . INSTITUTE PERFORMANCE REPORT', margin, 11);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(inst.name || '', pageW - margin, 7, { align: 'right' });
      doc.text('Page ' + pageNum + ' of 8', pageW - margin, 12, { align: 'right' });

      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, margin, 32);
      doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
      doc.rect(margin, 36, 30, 0.8, 'F');
    };

    const addPageFooter = (pageNum: number) => {
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, pageH - 15, pageW - margin, pageH - 15);
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by SkillTrack AI . ' + genDate, margin, pageH - 10);
      doc.text('Page ' + pageNum + ' of 8', pageW - margin, pageH - 10, { align: 'right' });
    };

    // ---------- PAGE 2: EXECUTIVE SUMMARY ----------
    doc.addPage();
    addPageHeader('EXECUTIVE SUMMARY', 2);
    addPageFooter(2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const summary1 = 'During the FY 2025-26 cycle, ' + (inst.name || 'this institute') + ' trained ' + trained + ' candidates, of whom ' + certified + ' were certified and ' + placed + ' were placed in formal employment. The placement rate of ' + placementRate + '% ' + (placementRate >= 70 ? 'exceeds' : placementRate >= 50 ? 'is comparable to' : 'is below') + ' the state target.';

    const summary2 = 'Of the ' + placed + ' placed candidates, ' + employed + ' remain currently employed, resulting in a retention rate of ' + retentionRate + '%. The average starting salary recorded is ' + avgSalary + ', which ' + (placementRate >= 70 ? 'reflects strong employer demand for these graduates' : 'indicates scope for wage improvement through curriculum upgrades') + '.';

    const summary3 = 'Key recommendation: ' + (placementRate >= 70 ? 'Sustain current placement performance and expand employer partnerships in the same sector.' : 'Focus on strengthening employer linkages, adding industry-aligned modules, and providing pre-placement training. Target: raise placement rate by 15% in the next cycle.');

    const s1 = doc.splitTextToSize(summary1, contentW);
    doc.text(s1, margin, 50);
    let y = 50 + s1.length * 5 + 5;

    const s2 = doc.splitTextToSize(summary2, contentW);
    doc.text(s2, margin, y);
    y += s2.length * 5 + 5;

    const s3 = doc.splitTextToSize(summary3, contentW);
    doc.text(s3, margin, y);

    // ---------- PAGE 3: INSTITUTE PROFILE ----------
    doc.addPage();
    addPageHeader('INSTITUTE PROFILE', 3);
    addPageFooter(3);

    autoTable(doc, {
      startY: 45,
      head: [['Field', 'Value']],
      body: [
        ['Institute Name', inst.name || '—'],
        ['Institute Code', inst.id || inst.instituteId || '—'],
        ['District', inst.district || '—'],
        ['City', inst.city || '—'],
        ['Report Cycle', 'FY 2025-26'],
        ['Report Code', reportCode],
      ],
      theme: 'grid',
      headStyles: { fillColor: NAVY, textColor: 255, fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10, textColor: 40 },
      alternateRowStyles: { fillColor: LIGHT_BG },
      margin: { left: margin, right: margin },
    });

    // ---------- PAGE 4: PERFORMANCE METRICS ----------
    doc.addPage();
    addPageHeader('PERFORMANCE METRICS', 4);
    addPageFooter(4);

    autoTable(doc, {
      startY: 45,
      head: [['Stage', 'Count', 'Percentage of Trained']],
      body: [
        ['Trained', String(trained), '100.0%'],
        ['Certified', String(certified), (trained > 0 ? Math.round((certified / trained) * 1000) / 10 : 0) + '%'],
        ['Placed', String(placed), placementRate + '%'],
        ['Currently Employed', String(employed), (trained > 0 ? Math.round((employed / trained) * 1000) / 10 : 0) + '%'],
      ],
      theme: 'grid',
      headStyles: { fillColor: NAVY, textColor: 255, fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10, textColor: 40 },
      alternateRowStyles: { fillColor: LIGHT_BG },
      margin: { left: margin, right: margin },
    });

    // ---------- PAGE 5: STATE COMPARISON ----------
    doc.addPage();
    addPageHeader('COMPARISON WITH STATE AVERAGES', 5);
    addPageFooter(5);

    const stateTrained = institutes.reduce((s: number, i: any) => s + (i.trained || 0), 0);
    const statePlaced = institutes.reduce((s: number, i: any) => s + (i.placed || 0), 0);
    const stateEmployed = institutes.reduce((s: number, i: any) => s + (i.employed || 0), 0);
    const stateAvgPlacement = stateTrained > 0 ? Math.round((statePlaced / stateTrained) * 1000) / 10 : 0;
    const stateAvgRetention = statePlaced > 0 ? Math.round((stateEmployed / statePlaced) * 1000) / 10 : 0;

    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'This Institute', 'State Average', 'Status']],
      body: [
        ['Placement Rate', placementRate + '%', stateAvgPlacement + '%', placementRate >= stateAvgPlacement ? 'Above State Average' : 'Below State Average'],
        ['Retention Rate', retentionRate + '%', stateAvgRetention + '%', retentionRate >= stateAvgRetention ? 'Above State Average' : 'Below State Average'],
        ['Avg Starting Salary', avgSalary, 'Rs. 28,882', '—'],
      ],
      theme: 'grid',
      headStyles: { fillColor: NAVY, textColor: 255, fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10, textColor: 40 },
      alternateRowStyles: { fillColor: LIGHT_BG },
      margin: { left: margin, right: margin },
    });

    // ---------- PAGE 6: SKILL GAPS ----------
    doc.addPage();
    addPageHeader('SKILL GAPS IDENTIFIED', 6);
    addPageFooter(6);

    if (skillGaps.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('No skill gap data available for this cycle.', margin, 55);
    } else {
      autoTable(doc, {
        startY: 45,
        head: [['Skill', 'Students Affected', 'Gap %', 'Priority']],
        body: skillGaps.slice(0, 15).map((g: any) => [
          g.skill || '—',
          String(g.studentsAffected || 0),
          String(g.employerReportedGap || 0) + '%',
          g.priority || '—',
        ]),
        theme: 'grid',
        headStyles: { fillColor: NAVY, textColor: 255, fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 10, textColor: 40 },
        alternateRowStyles: { fillColor: LIGHT_BG },
        margin: { left: margin, right: margin },
      });
    }

    // ---------- PAGE 7: EMPLOYER PARTNERSHIPS ----------
    doc.addPage();
    addPageHeader('EMPLOYER PARTNERSHIPS', 7);
    addPageFooter(7);

    const topEmployers = mergedEmployers.slice(0, 10);
    if (topEmployers.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('No employer data available.', margin, 55);
    } else {
      autoTable(doc, {
        startY: 45,
        head: [['Company', 'Industry', 'Trust Score', 'Grade']],
        body: topEmployers.map((e: any) => [
          e.name || e.employerName || '—',
          e.industry || '—',
          String(e.trustScore || 0),
          e.trustGrade || '—',
        ]),
        theme: 'grid',
        headStyles: { fillColor: NAVY, textColor: 255, fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 10, textColor: 40 },
        alternateRowStyles: { fillColor: LIGHT_BG },
        margin: { left: margin, right: margin },
      });
    }

    // ---------- PAGE 8: AUDIT & SIGNATURE ----------
    doc.addPage();
    addPageHeader('AUDIT STATEMENT & SIGNATURE', 8);
    addPageFooter(8);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Sources', margin, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const sources = [
      '- institutesPerformance - Institute-level aggregate metrics',
      '- traineeBios - Verified trainee profiles',
      '- currentEmployments - Active employment records (EPFO-verified)',
      '- employerTrustScores - Employer reliability scores',
      '- govSkillGaps - Employer-reported skill gaps',
    ];
    let sy = 58;
    sources.forEach(s => {
      doc.text(s, margin, sy);
      sy += 5;
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Verification', margin, sy + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Filter Hash: ' + reportCode.replace(/\//g, '-'), margin, sy + 15);
    doc.text('Generated On: ' + genDate + ', ' + genTime + ' IST', margin, sy + 20);
    doc.text('Issued By: SkillTrack AI - Government of India', margin, sy + 25);

    doc.setDrawColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - 60, margin + 60, pageH - 60);
    doc.line(pageW - margin - 60, pageH - 60, pageW - margin, pageH - 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('Director General', margin, pageH - 55);
    doc.text('Date of Issue', pageW - margin - 60, pageH - 55);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('Directorate General of Training', margin, pageH - 50);
    doc.text(genDate, pageW - margin - 60, pageH - 50);

    // ---------- SAVE ----------
    const safeName = (inst.name || 'Report').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = 'Institute_Performance_' + safeName + '_' + reportCode.split('/').pop() + '.pdf';
    doc.save(filename);
    showToast('PDF downloaded: ' + filename);
  };

  const generateDistrictReport = (districtName: string) => {
    const allInst = institutes;
    let filtered = allInst;
    if (districtName && districtName !== 'All Districts') {
      filtered = allInst.filter((i: any) =>
        (i.district || '').toLowerCase().includes(districtName.toLowerCase())
      );
      if (filtered.length === 0) filtered = allInst;
    }

    // Aggregate by district
    const byDistrict: Record<string, any> = {};
    filtered.forEach((i: any) => {
      const d = i.district || 'Unknown';
      if (!byDistrict[d]) byDistrict[d] = { district: d, trained: 0, certified: 0, placed: 0, employed: 0 };
      byDistrict[d].trained += i.trained || 0;
      byDistrict[d].certified += i.certified || 0;
      byDistrict[d].placed += i.placed || 0;
      byDistrict[d].employed += i.employed || 0;
    });
    const rows = Object.values(byDistrict).sort((a: any, b: any) => b.trained - a.trained);

    const totalTrained = rows.reduce((s: number, r: any) => s + r.trained, 0);
    const totalCertified = rows.reduce((s: number, r: any) => s + r.certified, 0);
    const totalPlaced = rows.reduce((s: number, r: any) => s + r.placed, 0);
    const totalEmployed = rows.reduce((s: number, r: any) => s + r.employed, 0);
    const placementRate = totalTrained > 0 ? Math.round((totalPlaced / totalTrained) * 1000) / 10 : 0;
    const retentionRate = totalPlaced > 0 ? Math.round((totalEmployed / totalPlaced) * 1000) / 10 : 0;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = 210;
    const pageH = 297;
    const margin = 18;
    const contentW = pageW - margin * 2;

    const reportCode = 'DGT/DIST-OUT/2026/' + (districtName && districtName !== 'All Districts' ? districtName.toUpperCase().slice(0, 6) : 'ALL');
    const now = new Date();
    const genDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const genTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const NAVY: [number, number, number] = [11, 61, 145];
    const ORANGE: [number, number, number] = [234, 88, 12];
    const SLATE: [number, number, number] = [71, 85, 105];
    const LIGHT_BG: [number, number, number] = [254, 249, 243];

    const reportTitle = districtName && districtName !== 'All Districts'
      ? districtName + ' District'
      : 'All Maharashtra Districts';

    // ---------- PAGE 1: COVER ----------
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, 0, pageW, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('GOVERNMENT OF INDIA', margin, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Ministry of Skill Development & Entrepreneurship', margin, 20);
    doc.text('Directorate General of Training', margin, 25);
    doc.text('SkillTrack AI - National Outcome Monitoring Portal', margin, 30);

    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('DISTRICT-WISE', margin, 70);
    doc.text('OUTCOMES REPORT', margin, 82);

    doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
    doc.rect(margin, 88, 40, 1.2, 'F');

    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text(reportTitle, margin, 105);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text('Report Code: ' + reportCode, margin, 115);
    doc.text('Report Cycle: FY 2025-26', margin, 121);
    doc.text('Districts Covered: ' + rows.length, margin, 127);
    doc.text('Generated: ' + genDate + ', ' + genTime + ' IST', margin, 133);

    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, pageH - 30, pageW, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('This report aggregates verified outcome data by district.', margin, pageH - 18);
    doc.text('Data sources: institutesPerformance . traineeBios . currentEmployments . attritionReasons', margin, pageH - 13);
    doc.text('Page 1 of 6 | SkillTrack AI . National Outcome Monitoring Portal', pageW - margin, pageH - 8, { align: 'right' });

    const addPageHeader = (title: string, pageNum: number) => {
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.rect(0, 0, pageW, 18, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('SKILLTRACK AI . DISTRICT-WISE OUTCOMES REPORT', margin, 11);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(reportTitle, pageW - margin, 7, { align: 'right' });
      doc.text('Page ' + pageNum + ' of 6', pageW - margin, 12, { align: 'right' });

      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, margin, 32);
      doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
      doc.rect(margin, 36, 30, 0.8, 'F');
    };

    const addPageFooter = (pageNum: number) => {
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, pageH - 15, pageW - margin, pageH - 15);
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by SkillTrack AI . ' + genDate, margin, pageH - 10);
      doc.text('Page ' + pageNum + ' of 6', pageW - margin, pageH - 10, { align: 'right' });
    };

    // ---------- PAGE 2: EXECUTIVE SUMMARY ----------
    doc.addPage();
    addPageHeader('EXECUTIVE SUMMARY', 2);
    addPageFooter(2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const topDistrict = rows[0];
    const bottomDistrict = rows[rows.length - 1];

    const s1 = 'This report covers ' + rows.length + ' districts across Maharashtra. A total of ' + totalTrained + ' candidates were trained, ' + totalCertified + ' were certified, and ' + totalPlaced + ' were placed in formal employment. The aggregate placement rate is ' + placementRate + '% with a retention rate of ' + retentionRate + '%.';

    const s2 = topDistrict && bottomDistrict && rows.length > 1
      ? 'The top-performing district is ' + topDistrict.district + ' with ' + topDistrict.trained + ' trained and ' + topDistrict.placed + ' placed. The lowest-performing district is ' + bottomDistrict.district + ' with ' + bottomDistrict.trained + ' trained and ' + bottomDistrict.placed + ' placed. This variance indicates scope for targeted interventions in the underperforming district.'
      : 'District-level data shows consistent performance across the covered area.';

    const s3 = 'Key recommendation: ' + (placementRate >= 70
      ? 'Maintain the current trajectory and expand employer partnerships across all districts to sustain performance.'
      : 'Prioritize employer engagement in the bottom 3 districts. Introduce district-specific skill gap programs aligned with local industry demand.');

    const t1 = doc.splitTextToSize(s1, contentW);
    doc.text(t1, margin, 50);
    let y = 50 + t1.length * 5 + 5;
    const t2 = doc.splitTextToSize(s2, contentW);
    doc.text(t2, margin, y);
    y += t2.length * 5 + 5;
    const t3 = doc.splitTextToSize(s3, contentW);
    doc.text(t3, margin, y);

    // ---------- PAGE 3: DISTRICT TABLE ----------
    doc.addPage();
    addPageHeader('DISTRICT-LEVEL METRICS', 3);
    addPageFooter(3);

    autoTable(doc, {
      startY: 45,
      head: [['District', 'Trained', 'Certified', 'Placed', 'Employed', 'Retention %']],
      body: rows.map((r: any) => {
        const ret = r.placed > 0 ? Math.round((r.employed / r.placed) * 1000) / 10 : 0;
        return [
          r.district,
          String(r.trained),
          String(r.certified),
          String(r.placed),
          String(r.employed),
          ret + '%',
        ];
      }),
      theme: 'grid',
      headStyles: { fillColor: NAVY, textColor: 255, fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 9, textColor: 40 },
      alternateRowStyles: { fillColor: LIGHT_BG },
      margin: { left: margin, right: margin },
    });

    // ---------- PAGE 4: ATTRITION ANALYSIS ----------
    doc.addPage();
    addPageHeader('ATTRITION ANALYSIS', 4);
    addPageFooter(4);

    if (groupedAttrition.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('No attrition data available.', margin, 55);
    } else {
      autoTable(doc, {
        startY: 45,
        head: [['Reason', 'Count', 'Percentage']],
        body: groupedAttrition.map((a: any) => [
          a.reason || '—',
          String(a.count || 0),
          String(a.percent || 0) + '%',
        ]),
        theme: 'grid',
        headStyles: { fillColor: NAVY, textColor: 255, fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 10, textColor: 40 },
        alternateRowStyles: { fillColor: LIGHT_BG },
        margin: { left: margin, right: margin },
      });
    }

    // ---------- PAGE 5: TOP VS BOTTOM DISTRICTS ----------
    doc.addPage();
    addPageHeader('PERFORMANCE VARIANCE', 5);
    addPageFooter(5);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('Top Performing Districts', margin, 50);

    autoTable(doc, {
      startY: 55,
      head: [['Rank', 'District', 'Placed', 'Retention %']],
      body: rows.slice(0, 3).map((r: any, i: number) => {
        const ret = r.placed > 0 ? Math.round((r.employed / r.placed) * 1000) / 10 : 0;
        return [String(i + 1), r.district, String(r.placed), ret + '%'];
      }),
      theme: 'grid',
      headStyles: { fillColor: [21, 128, 61], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 9, textColor: 40 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      margin: { left: margin, right: margin },
    });

    const lastY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('Lowest Performing Districts', margin, lastY);

    autoTable(doc, {
      startY: lastY + 5,
      head: [['Rank', 'District', 'Placed', 'Retention %']],
      body: [...rows].reverse().slice(0, 3).map((r: any, i: number) => {
        const ret = r.placed > 0 ? Math.round((r.employed / r.placed) * 1000) / 10 : 0;
        return [String(i + 1), r.district, String(r.placed), ret + '%'];
      }),
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 9, textColor: 40 },
      alternateRowStyles: { fillColor: [254, 242, 242] },
      margin: { left: margin, right: margin },
    });

    // ---------- PAGE 6: AUDIT & SIGNATURE ----------
    doc.addPage();
    addPageHeader('AUDIT STATEMENT & SIGNATURE', 6);
    addPageFooter(6);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Sources', margin, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const sources = [
      '- institutesPerformance - District-level aggregate metrics',
      '- traineeBios - Verified trainee profiles',
      '- currentEmployments - Active employment records',
      '- attritionReasons - Categorized attrition events',
    ];
    let sy = 58;
    sources.forEach(s => {
      doc.text(s, margin, sy);
      sy += 5;
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Verification', margin, sy + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Filter Hash: ' + reportCode.replace(/\//g, '-'), margin, sy + 15);
    doc.text('Generated On: ' + genDate + ', ' + genTime + ' IST', margin, sy + 20);
    doc.text('Issued By: SkillTrack AI - Government of India', margin, sy + 25);

    doc.setDrawColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - 60, margin + 60, pageH - 60);
    doc.line(pageW - margin - 60, pageH - 60, pageW - margin, pageH - 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('Director General', margin, pageH - 55);
    doc.text('Date of Issue', pageW - margin - 60, pageH - 55);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('Directorate General of Training', margin, pageH - 50);
    doc.text(genDate, pageW - margin - 60, pageH - 50);

    const safeName = reportTitle.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = 'District_Report_' + safeName + '_2026.pdf';
    doc.save(filename);
    showToast('PDF downloaded: ' + filename);
  };

  const generateStateReport = () => {
    const totalTrained = institutes.reduce((s: number, i: any) => s + (i.trained || 0), 0);
    const totalCertified = institutes.reduce((s: number, i: any) => s + (i.certified || 0), 0);
    const totalPlaced = institutes.reduce((s: number, i: any) => s + (i.placed || 0), 0);
    const totalEmployed = institutes.reduce((s: number, i: any) => s + (i.employed || 0), 0);
    const placementRate = totalTrained > 0 ? Math.round((totalPlaced / totalTrained) * 1000) / 10 : 0;
    const retentionRate = totalPlaced > 0 ? Math.round((totalEmployed / totalPlaced) * 1000) / 10 : 0;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = 210;
    const pageH = 297;
    const margin = 18;
    const contentW = pageW - margin * 2;

    const reportCode = 'DGT/STATE-SUM/2026/MH-ALL';
    const now = new Date();
    const genDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const genTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const NAVY: [number, number, number] = [11, 61, 145];
    const ORANGE: [number, number, number] = [234, 88, 12];
    const SLATE: [number, number, number] = [71, 85, 105];
    const LIGHT_BG: [number, number, number] = [254, 249, 243];

    // ---------- PAGE 1: COVER ----------
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, 0, pageW, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('GOVERNMENT OF INDIA', margin, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Ministry of Skill Development & Entrepreneurship', margin, 20);
    doc.text('Directorate General of Training', margin, 25);
    doc.text('SkillTrack AI - National Outcome Monitoring Portal', margin, 30);

    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('STATE SUMMARY', margin, 70);
    doc.text('REPORT', margin, 82);

    doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
    doc.rect(margin, 88, 40, 1.2, 'F');

    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text('Maharashtra - All Districts', margin, 105);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text('Report Code: ' + reportCode, margin, 115);
    doc.text('Report Cycle: FY 2025-26', margin, 121);
    doc.text('Institutes Covered: ' + institutes.length, margin, 127);
    doc.text('Generated: ' + genDate + ', ' + genTime + ' IST', margin, 133);

    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, pageH - 30, pageW, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('This is the official state-level outcome summary for FY 2025-26.', margin, pageH - 18);
    doc.text('Data sources: institutesPerformance . traineeBios . currentEmployments . attritionReasons', margin, pageH - 13);
    doc.text('Page 1 of 6 | SkillTrack AI . National Outcome Monitoring Portal', pageW - margin, pageH - 8, { align: 'right' });

    const addPageHeader = (title: string, pageNum: number) => {
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.rect(0, 0, pageW, 18, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('SKILLTRACK AI . STATE SUMMARY REPORT', margin, 11);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Maharashtra', pageW - margin, 7, { align: 'right' });
      doc.text('Page ' + pageNum + ' of 6', pageW - margin, 12, { align: 'right' });

      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, margin, 32);
      doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
      doc.rect(margin, 36, 30, 0.8, 'F');
    };

    const addPageFooter = (pageNum: number) => {
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, pageH - 15, pageW - margin, pageH - 15);
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by SkillTrack AI . ' + genDate, margin, pageH - 10);
      doc.text('Page ' + pageNum + ' of 6', pageW - margin, pageH - 10, { align: 'right' });
    };

    // ---------- PAGE 2: EXECUTIVE SUMMARY ----------
    doc.addPage();
    addPageHeader('EXECUTIVE SUMMARY', 2);
    addPageFooter(2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const s1 = 'The state of Maharashtra reported ' + totalTrained + ' trained candidates across ' + institutes.length + ' institutes in FY 2025-26. Of these, ' + totalCertified + ' were certified and ' + totalPlaced + ' were placed in formal employment. The aggregate placement rate is ' + placementRate + '% with a retention rate of ' + retentionRate + '%.';

    const sortedByPlacement = [...institutes].sort((a: any, b: any) => {
      const ra = a.trained > 0 ? a.placed / a.trained : 0;
      const rb = b.trained > 0 ? b.placed / b.trained : 0;
      return rb - ra;
    });
    const topInst = sortedByPlacement[0];
    const bottomInst = sortedByPlacement[sortedByPlacement.length - 1];

    const s2 = topInst && bottomInst
      ? 'The top-performing institute is ' + topInst.name + ' with a placement rate of ' + (topInst.trained > 0 ? Math.round((topInst.placed / topInst.trained) * 1000) / 10 : 0) + '%. The lowest-performing institute is ' + bottomInst.name + ' with ' + (bottomInst.trained > 0 ? Math.round((bottomInst.placed / bottomInst.trained) * 1000) / 10 : 0) + '%. This spread indicates targeted intervention opportunities.'
      : 'Institute-level performance is spread across a normal distribution.';

    const s3 = 'Key recommendation: ' + (placementRate >= 70
      ? 'Maharashtra is ahead of the state target. Continue scaling employer partnerships and prioritize retention programs in high-attrition sectors.'
      : 'Aggregate placement rate is below target. Focus policy intervention on the bottom 5 institutes, expand employer tie-ups, and refresh curriculum to close identified skill gaps.');

    const t1 = doc.splitTextToSize(s1, contentW);
    doc.text(t1, margin, 50);
    let y = 50 + t1.length * 5 + 5;
    const t2 = doc.splitTextToSize(s2, contentW);
    doc.text(t2, margin, y);
    y += t2.length * 5 + 5;
    const t3 = doc.splitTextToSize(s3, contentW);
    doc.text(t3, margin, y);

    // ---------- PAGE 3: STATE KPIs ----------
    doc.addPage();
    addPageHeader('STATE-WIDE KEY METRICS', 3);
    addPageFooter(3);

    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: [
        ['Total Trained', String(totalTrained)],
        ['Total Certified', String(totalCertified)],
        ['Total Placed', String(totalPlaced)],
        ['Currently Employed', String(totalEmployed)],
        ['Aggregate Placement Rate', placementRate + '%'],
        ['Aggregate Retention Rate', retentionRate + '%'],
        ['Institutes Reporting', String(institutes.length)],
        ['Report Cycle', 'FY 2025-26'],
      ],
      theme: 'grid',
      headStyles: { fillColor: NAVY, textColor: 255, fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10, textColor: 40 },
      alternateRowStyles: { fillColor: LIGHT_BG },
      margin: { left: margin, right: margin },
    });

    // ---------- PAGE 4: TOP 5 INSTITUTES ----------
    doc.addPage();
    addPageHeader('TOP & BOTTOM INSTITUTES', 4);
    addPageFooter(4);

    const withRate = institutes.map((i: any) => ({
      ...i,
      rate: i.trained > 0 ? Math.round((i.placed / i.trained) * 1000) / 10 : 0,
    }));

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('Top 5 Performing Institutes', margin, 50);

    autoTable(doc, {
      startY: 55,
      head: [['Rank', 'Institute', 'District', 'Placement %']],
      body: [...withRate].sort((a: any, b: any) => b.rate - a.rate).slice(0, 5).map((i: any, idx: number) => [
        String(idx + 1),
        (i.name || '').substring(0, 40),
        i.district || '—',
        i.rate + '%',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [21, 128, 61], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8, textColor: 40 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      margin: { left: margin, right: margin },
    });

    const lastY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('Bottom 5 Performing Institutes', margin, lastY);

    autoTable(doc, {
      startY: lastY + 5,
      head: [['Rank', 'Institute', 'District', 'Placement %']],
      body: [...withRate].sort((a: any, b: any) => a.rate - b.rate).slice(0, 5).map((i: any, idx: number) => [
        String(idx + 1),
        (i.name || '').substring(0, 40),
        i.district || '—',
        i.rate + '%',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8, textColor: 40 },
      alternateRowStyles: { fillColor: [254, 242, 242] },
      margin: { left: margin, right: margin },
    });

    // ---------- PAGE 5: ATTRITION ----------
    doc.addPage();
    addPageHeader('ATTRITION ANALYSIS', 5);
    addPageFooter(5);

    if (groupedAttrition.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('No attrition data available.', margin, 55);
    } else {
      autoTable(doc, {
        startY: 45,
        head: [['Reason', 'Count', 'Percentage']],
        body: groupedAttrition.map((a: any) => [
          a.reason || '—',
          String(a.count || 0),
          String(a.percent || 0) + '%',
        ]),
        theme: 'grid',
        headStyles: { fillColor: NAVY, textColor: 255, fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 10, textColor: 40 },
        alternateRowStyles: { fillColor: LIGHT_BG },
        margin: { left: margin, right: margin },
      });
    }

    // ---------- PAGE 6: AUDIT ----------
    doc.addPage();
    addPageHeader('AUDIT STATEMENT & SIGNATURE', 6);
    addPageFooter(6);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Sources', margin, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const sources = [
      '- institutesPerformance - State-wide aggregate metrics',
      '- traineeBios - Verified trainee profiles',
      '- currentEmployments - Active employment records',
      '- attritionReasons - Categorized attrition events',
    ];
    let sy = 58;
    sources.forEach(s => {
      doc.text(s, margin, sy);
      sy += 5;
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Verification', margin, sy + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Filter Hash: ' + reportCode.replace(/\//g, '-'), margin, sy + 15);
    doc.text('Generated On: ' + genDate + ', ' + genTime + ' IST', margin, sy + 20);
    doc.text('Issued By: SkillTrack AI - Government of India', margin, sy + 25);

    doc.setDrawColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - 60, margin + 60, pageH - 60);
    doc.line(pageW - margin - 60, pageH - 60, pageW - margin, pageH - 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('Director General', margin, pageH - 55);
    doc.text('Date of Issue', pageW - margin - 60, pageH - 55);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('Directorate General of Training', margin, pageH - 50);
    doc.text(genDate, pageW - margin - 60, pageH - 50);

    const filename = 'State_Summary_Maharashtra_2026.pdf';
    doc.save(filename);
    showToast('PDF downloaded: ' + filename);
  };

  const generateCourseReport = (courseId: string) => {
    let list = [...courses];
    if (courseId && list.some((c: any) => c.id === courseId || c.name === courseId)) {
      list = list.filter((c: any) => c.id === courseId || c.name === courseId);
    }

    const enriched = list.map((c: any) => {
      const trained = c.students || c.trained || 0;
      const placed = c.placed || 0;
      const rate = trained > 0 ? Math.round((placed / trained) * 1000) / 10 : (c.placementRate || 0);
      return { ...c, _trained: trained, _placed: placed, _rate: rate };
    }).sort((a: any, b: any) => b._rate - a._rate);

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = 210;
    const pageH = 297;
    const margin = 18;
    const contentW = pageW - margin * 2;

    const reportCode = 'DGT/COURSE-PERF/2026/ALL';
    const now = new Date();
    const genDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const genTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const NAVY: [number, number, number] = [11, 61, 145];
    const ORANGE: [number, number, number] = [234, 88, 12];
    const SLATE: [number, number, number] = [71, 85, 105];
    const LIGHT_BG: [number, number, number] = [254, 249, 243];

    // ---------- PAGE 1: COVER ----------
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, 0, pageW, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('GOVERNMENT OF INDIA', margin, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Ministry of Skill Development & Entrepreneurship', margin, 20);
    doc.text('Directorate General of Training', margin, 25);
    doc.text('SkillTrack AI - National Outcome Monitoring Portal', margin, 30);

    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('COURSE PERFORMANCE', margin, 70);
    doc.text('REPORT', margin, 82);

    doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
    doc.rect(margin, 88, 40, 1.2, 'F');

    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text('All Approved Courses', margin, 105);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text('Report Code: ' + reportCode, margin, 115);
    doc.text('Report Cycle: FY 2025-26', margin, 121);
    doc.text('Courses Covered: ' + enriched.length, margin, 127);
    doc.text('Generated: ' + genDate + ', ' + genTime + ' IST', margin, 133);

    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, pageH - 30, pageW, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('This report ranks courses by placement performance.', margin, pageH - 18);
    doc.text('Data sources: coursesGov . institutesPerformance . traineeBios', margin, pageH - 13);
    doc.text('Page 1 of 5 | SkillTrack AI . National Outcome Monitoring Portal', pageW - margin, pageH - 8, { align: 'right' });

    const addPageHeader = (title: string, pageNum: number) => {
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.rect(0, 0, pageW, 18, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('SKILLTRACK AI . COURSE PERFORMANCE REPORT', margin, 11);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('All Courses', pageW - margin, 7, { align: 'right' });
      doc.text('Page ' + pageNum + ' of 5', pageW - margin, 12, { align: 'right' });

      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, margin, 32);
      doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
      doc.rect(margin, 36, 30, 0.8, 'F');
    };

    const addPageFooter = (pageNum: number) => {
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, pageH - 15, pageW - margin, pageH - 15);
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by SkillTrack AI . ' + genDate, margin, pageH - 10);
      doc.text('Page ' + pageNum + ' of 5', pageW - margin, pageH - 10, { align: 'right' });
    };

    // ---------- PAGE 2: EXECUTIVE SUMMARY ----------
    doc.addPage();
    addPageHeader('EXECUTIVE SUMMARY', 2);
    addPageFooter(2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const totalTrained = enriched.reduce((s: number, c: any) => s + c._trained, 0);
    const totalPlaced = enriched.reduce((s: number, c: any) => s + c._placed, 0);
    const avgRate = totalTrained > 0 ? Math.round((totalPlaced / totalTrained) * 1000) / 10 : 0;
    const topCourse = enriched[0];
    const bottomCourse = enriched[enriched.length - 1];

    const s1 = 'This report covers ' + enriched.length + ' approved courses across Maharashtra. Combined, these courses trained ' + totalTrained + ' candidates and placed ' + totalPlaced + ' of them, yielding an aggregate placement rate of ' + avgRate + '%.';

    const s2 = topCourse && bottomCourse && enriched.length > 1
      ? 'The highest-performing course is ' + topCourse.name + ' with a placement rate of ' + topCourse._rate + '%. The lowest-performing course is ' + bottomCourse.name + ' at ' + bottomCourse._rate + '%. This gap indicates opportunities to transfer best practices from top to bottom performers.'
      : 'Course-level performance shows consistent results across the curriculum.';

    const s3 = 'Key recommendation: ' + (avgRate >= 70
      ? 'Maintain current curriculum structure. Consider expanding the top 3 courses to additional institutes.'
      : 'Review curriculum for the bottom 5 courses. Introduce employer co-designed modules, add practical labs, and refresh trainer profiles. Target: raise average placement rate to 75%.');

    const t1 = doc.splitTextToSize(s1, contentW);
    doc.text(t1, margin, 50);
    let y = 50 + t1.length * 5 + 5;
    const t2 = doc.splitTextToSize(s2, contentW);
    doc.text(t2, margin, y);
    y += t2.length * 5 + 5;
    const t3 = doc.splitTextToSize(s3, contentW);
    doc.text(t3, margin, y);

    // ---------- PAGE 3: COURSE RANKING ----------
    doc.addPage();
    addPageHeader('COURSE RANKING BY PLACEMENT', 3);
    addPageFooter(3);

    autoTable(doc, {
      startY: 45,
      head: [['Rank', 'Course', 'Institute', 'Trained', 'Placed', 'Rate %']],
      body: enriched.slice(0, 25).map((c: any, i: number) => [
        String(i + 1),
        (c.name || '—').substring(0, 30),
        (c.instituteName || c.institute || '—').substring(0, 25),
        String(c._trained),
        String(c._placed),
        c._rate + '%',
      ]),
      theme: 'grid',
      headStyles: { fillColor: NAVY, textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8, textColor: 40 },
      alternateRowStyles: { fillColor: LIGHT_BG },
      margin: { left: margin, right: margin },
    });

    // ---------- PAGE 4: TOP 5 ----------
    doc.addPage();
    addPageHeader('TOP 5 COURSES', 4);
    addPageFooter(4);

    autoTable(doc, {
      startY: 45,
      head: [['Rank', 'Course', 'Trained', 'Placed', 'Rate %']],
      body: enriched.slice(0, 5).map((c: any, i: number) => [
        String(i + 1),
        (c.name || '—').substring(0, 40),
        String(c._trained),
        String(c._placed),
        c._rate + '%',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [21, 128, 61], textColor: 255, fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10, textColor: 40 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      margin: { left: margin, right: margin },
    });

    const lastY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('Bottom 5 Courses', margin, lastY);

    autoTable(doc, {
      startY: lastY + 5,
      head: [['Rank', 'Course', 'Trained', 'Placed', 'Rate %']],
      body: [...enriched].reverse().slice(0, 5).map((c: any, i: number) => [
        String(i + 1),
        (c.name || '—').substring(0, 40),
        String(c._trained),
        String(c._placed),
        c._rate + '%',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38], textColor: 255, fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10, textColor: 40 },
      alternateRowStyles: { fillColor: [254, 242, 242] },
      margin: { left: margin, right: margin },
    });

    // ---------- PAGE 5: AUDIT ----------
    doc.addPage();
    addPageHeader('AUDIT STATEMENT & SIGNATURE', 5);
    addPageFooter(5);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Sources', margin, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const sources = [
      '- coursesGov - Approved course catalog',
      '- institutesPerformance - Institute-level metrics',
      '- traineeBios - Verified trainee profiles',
    ];
    let sy = 58;
    sources.forEach(s => {
      doc.text(s, margin, sy);
      sy += 5;
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Verification', margin, sy + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Filter Hash: ' + reportCode.replace(/\//g, '-'), margin, sy + 15);
    doc.text('Generated On: ' + genDate + ', ' + genTime + ' IST', margin, sy + 20);
    doc.text('Issued By: SkillTrack AI - Government of India', margin, sy + 25);

    doc.setDrawColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - 60, margin + 60, pageH - 60);
    doc.line(pageW - margin - 60, pageH - 60, pageW - margin, pageH - 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('Director General', margin, pageH - 55);
    doc.text('Date of Issue', pageW - margin - 60, pageH - 55);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('Directorate General of Training', margin, pageH - 50);
    doc.text(genDate, pageW - margin - 60, pageH - 50);

    const filename = 'Course_Performance_All_2026.pdf';
    doc.save(filename);
    showToast('PDF downloaded: ' + filename);
  };

  const generateEmployerReport = (employerId: string) => {
    let list = [...mergedEmployers];
    if (employerId && list.some((e: any) => (e.id || e.employerId) === employerId)) {
      list = list.filter((e: any) => (e.id || e.employerId) === employerId);
    }

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = 210;
    const pageH = 297;
    const margin = 18;
    const contentW = pageW - margin * 2;

    const reportCode = 'DGT/EMPLOYER-TRUST/2026/ALL';
    const now = new Date();
    const genDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const genTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const NAVY: [number, number, number] = [11, 61, 145];
    const ORANGE: [number, number, number] = [234, 88, 12];
    const SLATE: [number, number, number] = [71, 85, 105];
    const LIGHT_BG: [number, number, number] = [254, 249, 243];

    // ---------- PAGE 1: COVER ----------
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, 0, pageW, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('GOVERNMENT OF INDIA', margin, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Ministry of Skill Development & Entrepreneurship', margin, 20);
    doc.text('Directorate General of Training', margin, 25);
    doc.text('SkillTrack AI - National Outcome Monitoring Portal', margin, 30);

    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('EMPLOYER TRUST', margin, 70);
    doc.text('REPORT', margin, 82);

    doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
    doc.rect(margin, 88, 40, 1.2, 'F');

    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text('All Registered Employers', margin, 105);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text('Report Code: ' + reportCode, margin, 115);
    doc.text('Report Cycle: FY 2025-26', margin, 121);
    doc.text('Employers Covered: ' + list.length, margin, 127);
    doc.text('Generated: ' + genDate + ', ' + genTime + ' IST', margin, 133);

    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, pageH - 30, pageW, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('Trust scores are computed from feedback rate, retention, consistency, and tenure.', margin, pageH - 18);
    doc.text('Data sources: employers . employerKpis . employerTrustScores . feedbackRecords', margin, pageH - 13);
    doc.text('Page 1 of 4 | SkillTrack AI . National Outcome Monitoring Portal', pageW - margin, pageH - 8, { align: 'right' });

    const addPageHeader = (title: string, pageNum: number) => {
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.rect(0, 0, pageW, 18, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('SKILLTRACK AI . EMPLOYER TRUST REPORT', margin, 11);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('All Employers', pageW - margin, 7, { align: 'right' });
      doc.text('Page ' + pageNum + ' of 4', pageW - margin, 12, { align: 'right' });

      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, margin, 32);
      doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
      doc.rect(margin, 36, 30, 0.8, 'F');
    };

    const addPageFooter = (pageNum: number) => {
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, pageH - 15, pageW - margin, pageH - 15);
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by SkillTrack AI . ' + genDate, margin, pageH - 10);
      doc.text('Page ' + pageNum + ' of 4', pageW - margin, pageH - 10, { align: 'right' });
    };

    // ---------- PAGE 2: EXECUTIVE SUMMARY ----------
    doc.addPage();
    addPageHeader('EXECUTIVE SUMMARY', 2);
    addPageFooter(2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const avgTrust = list.length > 0 ? Math.round(list.reduce((s: number, e: any) => s + (e.trustScore || 0), 0) / list.length * 10) / 10 : 0;
    const trustedCount = list.filter((e: any) => e.trustGrade === 'trusted').length;
    const watchlistCount = list.filter((e: any) => e.trustGrade === 'watchlist').length;
    const criticalCount = list.filter((e: any) => e.trustGrade === 'critical' || e.trustGrade === 'unknown').length;

    const s1 = 'This report covers ' + list.length + ' registered employers. The average trust score is ' + avgTrust + ' out of 100. Of these, ' + trustedCount + ' are classified as trusted partners, ' + watchlistCount + ' are on the watchlist, and ' + criticalCount + ' require intervention.';

    const s2 = 'Trust scores are composite metrics derived from four indicators: feedback submission rate, retention rate, data consistency, and partnership tenure. Employers with higher scores consistently provide timely feedback and retain placed candidates longer.';

    const s3 = 'Key recommendation: ' + (watchlistCount + criticalCount > 0
      ? 'Schedule review meetings with the ' + (watchlistCount + criticalCount) + ' employers below the trusted threshold. Improve data-sharing agreements to raise feedback compliance.'
      : 'All employers are operating above the trusted threshold. Continue quarterly monitoring and consider expanding partnerships with top performers.');

    const t1 = doc.splitTextToSize(s1, contentW);
    doc.text(t1, margin, 50);
    let y = 50 + t1.length * 5 + 5;
    const t2 = doc.splitTextToSize(s2, contentW);
    doc.text(t2, margin, y);
    y += t2.length * 5 + 5;
    const t3 = doc.splitTextToSize(s3, contentW);
    doc.text(t3, margin, y);

    // ---------- PAGE 3: EMPLOYER TABLE ----------
    doc.addPage();
    addPageHeader('EMPLOYER TRUST SCORES', 3);
    addPageFooter(3);

    autoTable(doc, {
      startY: 45,
      head: [['Company', 'Industry', 'Score', 'Feedback %', 'Retention %', 'Grade']],
      body: list.map((e: any) => [
        (e.name || e.employerName || '—').substring(0, 25),
        (e.industry || '—').substring(0, 15),
        String(e.trustScore || 0),
        String(e.feedbackRate || 0) + '%',
        String(e.retentionRate || 0) + '%',
        (e.trustGrade || '—').toUpperCase(),
      ]),
      theme: 'grid',
      headStyles: { fillColor: NAVY, textColor: 255, fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 9, textColor: 40 },
      alternateRowStyles: { fillColor: LIGHT_BG },
      margin: { left: margin, right: margin },
    });

    // ---------- PAGE 4: AUDIT ----------
    doc.addPage();
    addPageHeader('AUDIT STATEMENT & SIGNATURE', 4);
    addPageFooter(4);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Sources', margin, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const sources = [
      '- employers - Registered employer master data',
      '- employerKpis - Aggregated performance metrics',
      '- employerTrustScores - Composite trust scores',
      '- feedbackRecords - Historical feedback submissions',
    ];
    let sy = 58;
    sources.forEach(s => {
      doc.text(s, margin, sy);
      sy += 5;
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Verification', margin, sy + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Filter Hash: ' + reportCode.replace(/\//g, '-'), margin, sy + 15);
    doc.text('Generated On: ' + genDate + ', ' + genTime + ' IST', margin, sy + 20);
    doc.text('Issued By: SkillTrack AI - Government of India', margin, sy + 25);

    doc.setDrawColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - 60, margin + 60, pageH - 60);
    doc.line(pageW - margin - 60, pageH - 60, pageW - margin, pageH - 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('Director General', margin, pageH - 55);
    doc.text('Date of Issue', pageW - margin - 60, pageH - 55);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('Directorate General of Training', margin, pageH - 50);
    doc.text(genDate, pageW - margin - 60, pageH - 50);

    const filename = 'Employer_Trust_All_2026.pdf';
    doc.save(filename);
    showToast('PDF downloaded: ' + filename);
  };

  const generateSkillGapReport = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = 210;
    const pageH = 297;
    const margin = 18;
    const contentW = pageW - margin * 2;

    const reportCode = 'DGT/SKILL-GAP/2026/ALL';
    const now = new Date();
    const genDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const genTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const NAVY: [number, number, number] = [11, 61, 145];
    const ORANGE: [number, number, number] = [234, 88, 12];
    const SLATE: [number, number, number] = [71, 85, 105];
    const LIGHT_BG: [number, number, number] = [254, 249, 243];

    // ---------- PAGE 1: COVER ----------
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, 0, pageW, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('GOVERNMENT OF INDIA', margin, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Ministry of Skill Development & Entrepreneurship', margin, 20);
    doc.text('Directorate General of Training', margin, 25);
    doc.text('SkillTrack AI - National Outcome Monitoring Portal', margin, 30);

    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('SKILL GAP', margin, 70);
    doc.text('ANALYSIS REPORT', margin, 82);

    doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
    doc.rect(margin, 88, 40, 1.2, 'F');

    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text('Employer-Reported Competency Gaps', margin, 105);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text('Report Code: ' + reportCode, margin, 115);
    doc.text('Report Cycle: FY 2025-26', margin, 121);
    doc.text('Skill Gaps Identified: ' + skillGaps.length, margin, 127);
    doc.text('Generated: ' + genDate + ', ' + genTime + ' IST', margin, 133);

    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, pageH - 30, pageW, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('Skill gaps are aggregated from employer feedback across all placements.', margin, pageH - 18);
    doc.text('Data sources: govSkillGaps . feedbackRecords . employers', margin, pageH - 13);
    doc.text('Page 1 of 5 | SkillTrack AI . National Outcome Monitoring Portal', pageW - margin, pageH - 8, { align: 'right' });

    const addPageHeader = (title: string, pageNum: number) => {
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.rect(0, 0, pageW, 18, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('SKILLTRACK AI . SKILL GAP ANALYSIS REPORT', margin, 11);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('State-wide', pageW - margin, 7, { align: 'right' });
      doc.text('Page ' + pageNum + ' of 5', pageW - margin, 12, { align: 'right' });

      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, margin, 32);
      doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
      doc.rect(margin, 36, 30, 0.8, 'F');
    };

    const addPageFooter = (pageNum: number) => {
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, pageH - 15, pageW - margin, pageH - 15);
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by SkillTrack AI . ' + genDate, margin, pageH - 10);
      doc.text('Page ' + pageNum + ' of 5', pageW - margin, pageH - 10, { align: 'right' });
    };

    // ---------- PAGE 2: EXECUTIVE SUMMARY ----------
    doc.addPage();
    addPageHeader('EXECUTIVE SUMMARY', 2);
    addPageFooter(2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const highCount = skillGaps.filter((g: any) => g.priority === 'High').length;
    const medCount = skillGaps.filter((g: any) => g.priority === 'Medium').length;
    const lowCount = skillGaps.filter((g: any) => g.priority === 'Low').length;
    const totalAffected = skillGaps.reduce((s: number, g: any) => s + (g.studentsAffected || 0), 0);

    const s1 = 'Employer feedback across Maharashtra identified ' + skillGaps.length + ' distinct skill gaps affecting ' + totalAffected + ' trainees. Of these, ' + highCount + ' are classified as high-priority, ' + medCount + ' as medium, and ' + lowCount + ' as low priority.';

    const s2 = 'Skill gap priority is determined by the number of employers reporting the gap and the number of trainees affected. High-priority gaps require immediate curriculum intervention; medium-priority gaps can be addressed through supplementary training modules.';

    const s3 = 'Key recommendation: ' + (highCount > 0
      ? 'Immediately update curriculum for the ' + highCount + ' high-priority skill gaps. Partner with industry bodies to co-design the new modules. Track post-intervention placement rates for the affected cohort.'
      : 'All identified gaps are low or medium priority. Continue quarterly monitoring and refresh curriculum at the next revision cycle.');

    const t1 = doc.splitTextToSize(s1, contentW);
    doc.text(t1, margin, 50);
    let y = 50 + t1.length * 5 + 5;
    const t2 = doc.splitTextToSize(s2, contentW);
    doc.text(t2, margin, y);
    y += t2.length * 5 + 5;
    const t3 = doc.splitTextToSize(s3, contentW);
    doc.text(t3, margin, y);

    // ---------- PAGE 3: ALL SKILL GAPS ----------
    doc.addPage();
    addPageHeader('ALL SKILL GAPS', 3);
    addPageFooter(3);

    if (skillGaps.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('No skill gap data available.', margin, 55);
    } else {
      autoTable(doc, {
        startY: 45,
        head: [['Skill', 'Students Affected', 'Gap %', 'Priority']],
        body: skillGaps.map((g: any) => [
          (g.skill || '—').substring(0, 35),
          String(g.studentsAffected || 0),
          String(g.employerReportedGap || 0) + '%',
          g.priority || '—',
        ]),
        theme: 'grid',
        headStyles: { fillColor: NAVY, textColor: 255, fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 9, textColor: 40 },
        alternateRowStyles: { fillColor: LIGHT_BG },
        margin: { left: margin, right: margin },
      });
    }

    // ---------- PAGE 4: RECOMMENDED INTERVENTIONS ----------
    doc.addPage();
    addPageHeader('RECOMMENDED INTERVENTIONS', 4);
    addPageFooter(4);

    if (skillGaps.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('No interventions to recommend.', margin, 55);
    } else {
      autoTable(doc, {
        startY: 45,
        head: [['Skill', 'Priority', 'Recommended Intervention']],
        body: skillGaps.slice(0, 15).map((g: any) => [
          (g.skill || '—').substring(0, 25),
          g.priority || '—',
          (g.recommendedIntervention || 'Curriculum update recommended').substring(0, 60),
        ]),
        theme: 'grid',
        headStyles: { fillColor: NAVY, textColor: 255, fontSize: 8, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8, textColor: 40 },
        alternateRowStyles: { fillColor: LIGHT_BG },
        margin: { left: margin, right: margin },
      });
    }

    // ---------- PAGE 5: AUDIT ----------
    doc.addPage();
    addPageHeader('AUDIT STATEMENT & SIGNATURE', 5);
    addPageFooter(5);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Sources', margin, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const sources = [
      '- govSkillGaps - Employer-reported skill gaps',
      '- feedbackRecords - Historical feedback submissions',
      '- employers - Registered employer master data',
    ];
    let sy = 58;
    sources.forEach(s => {
      doc.text(s, margin, sy);
      sy += 5;
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Verification', margin, sy + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Filter Hash: ' + reportCode.replace(/\//g, '-'), margin, sy + 15);
    doc.text('Generated On: ' + genDate + ', ' + genTime + ' IST', margin, sy + 20);
    doc.text('Issued By: SkillTrack AI - Government of India', margin, sy + 25);

    doc.setDrawColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - 60, margin + 60, pageH - 60);
    doc.line(pageW - margin - 60, pageH - 60, pageW - margin, pageH - 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('Director General', margin, pageH - 55);
    doc.text('Date of Issue', pageW - margin - 60, pageH - 55);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('Directorate General of Training', margin, pageH - 50);
    doc.text(genDate, pageW - margin - 60, pageH - 50);

    const filename = 'Skill_Gap_Analysis_2026.pdf';
    doc.save(filename);
    showToast('PDF downloaded: ' + filename);
  };

  const callGemini = async (
    userPrompt: string,
    systemContext: string,
    model: string = 'gemini-3.1-flash-lite'
  ): Promise<string> => {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to .env');
    }

    const cascade = [
      model,
      'gemini-3.8-flash',
      'gemini-3.8-pro',
      'gemma-3-27b-it',
      'gemini-2.5-flash-lite'
    ].filter((m, i, arr) => arr.indexOf(m) === i);

    let lastErr = '';

    for (let i = 0; i < cascade.length; i++) {
      const currentModel = cascade[i];
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + currentModel + ':generateContent?key=' + apiKey;

      const body = {
        contents: [
          {
            role: 'user',
            parts: [{ text: systemContext + '\n\n---\n\nUSER QUESTION:\n' + userPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192
        }
      };

      try {
        console.log('[GEMINI] attempt ' + (i + 1) + '/' + cascade.length + ' with ' + currentModel);
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim()) {
            console.log('[GEMINI] success with ' + currentModel);
            return text;
          }
          lastErr = 'Empty response from ' + currentModel;
          console.warn('[GEMINI] ' + lastErr);
        } else {
          const errText = await res.text();
          lastErr = currentModel + ' returned ' + res.status;
          console.warn('[GEMINI] ' + lastErr + ': ' + errText.substring(0, 150));

          if (res.status !== 429 && res.status !== 500 && res.status !== 503) {
            throw new Error('Gemini API error ' + res.status + ': ' + errText.substring(0, 100));
          }
        }
      } catch (err: any) {
        if (err?.message?.startsWith('Gemini API error')) throw err;
        lastErr = err?.message || 'network error';
        console.warn('[GEMINI] ' + currentModel + ' exception: ' + lastErr);
      }
    }

    throw new Error('All models exhausted. Last: ' + lastErr);
  };

  const pcmToWav = (pcmBytes: Uint8Array, sampleRate: number, channels: number): Blob => {
    const bytesPerSample = 2;
    const blockAlign = channels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = pcmBytes.length;
    const headerSize = 44;
    const buffer = new ArrayBuffer(headerSize + dataSize);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, dataSize, true);

    new Uint8Array(buffer, headerSize).set(pcmBytes);
    return new Blob([buffer], { type: 'audio/wav' });
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const speakText = async (text: string) => {
    if (!text || !text.trim()) return;

    try {
      stopSpeaking();
      setIsSpeaking(true);

      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        showToast('No API key');
        setIsSpeaking(false);
        return;
      }

      const clean = text.replace(/[*_`#>]/g, ' ').replace(/\s+/g, ' ').trim();
      const cacheKey = clean.substring(0, 200);

      const cached = audioCacheRef.current.get(cacheKey);
      if (cached) {
        console.log('[TTS] replaying from cache');
        const audio = new Audio(cached);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
        return;
      }

      const ttsModels = ['gemini-3.8-flash-tts', 'gemini-3.1-flash-tts-preview'];
      let audioPart: any = null;
      let usedModel = '';

      for (const ttsModel of ttsModels) {
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + ttsModel + ':generateContent?key=' + apiKey;
        const body = {
          contents: [{ parts: [{ text: clean }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' }
              }
            }
          }
        };

        try {
          console.log('[TTS] trying ' + ttsModel);
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });

          if (res.ok) {
            const data = await res.json();
            const found = data?.candidates?.[0]?.content?.parts?.find(
              (p: any) => p.inlineData && p.inlineData.mimeType && p.inlineData.mimeType.startsWith('audio/')
            );
            if (found) {
              audioPart = found;
              usedModel = ttsModel;
              break;
            }
          } else {
            const errText = await res.text();
            console.warn('[TTS] ' + ttsModel + ' returned ' + res.status + ': ' + errText.substring(0, 150));
            if (res.status !== 429 && res.status !== 500 && res.status !== 503) {
              break;
            }
          }
        } catch (err: any) {
          console.warn('[TTS] ' + ttsModel + ' exception: ' + (err?.message || 'unknown'));
        }
      }

      if (!audioPart) {
        showToast('Voice unavailable. Try again shortly.');
        setIsSpeaking(false);
        return;
      }

      console.log('[TTS] success with ' + usedModel);

      const mimeType = audioPart.inlineData.mimeType;
      const base64Audio = audioPart.inlineData.data;
      const binaryString = atob(base64Audio);
      const pcmBytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        pcmBytes[i] = binaryString.charCodeAt(i);
      }

      let blob: Blob;
      if (mimeType.startsWith('audio/l16') || mimeType.startsWith('audio/pcm')) {
        const rateMatch = mimeType.match(/rate=(\d+)/);
        const channelsMatch = mimeType.match(/channels=(\d+)/);
        const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
        const channels = channelsMatch ? parseInt(channelsMatch[1], 10) : 1;
        blob = pcmToWav(pcmBytes, sampleRate, channels);
      } else {
        blob = new Blob([pcmBytes], { type: mimeType });
      }

      const audioUrl = URL.createObjectURL(blob);
      audioCacheRef.current.set(cacheKey, audioUrl);
      console.log('[TTS] cached. cache size: ' + audioCacheRef.current.size);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (err: any) {
      console.error('[TTS] fatal: ' + (err?.message || 'unknown'));
      showToast('Voice error');
      setIsSpeaking(false);
    }
  };

  const loadChatData = async () => {
    if (chatDataLoaded) return;
    try {
      console.log('[CHAT] loading full data...');
      const [trainees, competencies, credentials, hires, courses, attrition] = await Promise.all([
        getFullTraineeIndex(),
        getFullCompetencyIndex(),
        getFullCredentialIndex(),
        getFullHireIndex(),
        getFullCourseIndex(),
        getFullAttritionIndex(),
      ]);
      setChatFullData({ trainees, competencies, credentials, hires, courses, attrition });
      setChatDataLoaded(true);
      console.log('[CHAT] data loaded. trainee rows:', trainees.length, '| competency rows:', competencies.length, '| credential rows:', credentials.length);
    } catch (err) {
      console.error('[CHAT] load error:', err);
    }
  };

  const buildChatContext = (): string => {
    const data = chatFullData;
    const traineeRows = data.trainees.map((t: any) =>
      [t.id, t.name, t.district, t.category, t.gender, t.status, t.course, t.institute].join(' | ')
    ).join('\n');

    const compRows = data.competencies.map((c: any) =>
      [c.traineeId, c.skill, c.level, c.score].join(' | ')
    ).join('\n');

    const credRows = data.credentials.map((c: any) =>
      [c.traineeId, c.title, c.issuer, c.date, c.verified ? 'verified' : 'pending'].join(' | ')
    ).join('\n');

    const hireRows = data.hires.map((h: any) =>
      [h.id, h.name, h.employerId, h.role, h.salary, h.status].join(' | ')
    ).join('\n');

    const courseRows = data.courses.map((c: any) =>
      [c.id, c.name, c.students, c.placementRate].join(' | ')
    ).join('\n');

    const attritionRows = data.attrition.map((a: any) =>
      [a.reason, a.count].join(' | ')
    ).join('\n');

    const instRows = institutes.map((i: any) =>
      [i.name, i.district, i.trained, i.certified, i.placed, i.employed, i.avgSalary].join(' | ')
    ).join('\n');

    const empRows = mergedEmployers.map((e: any) =>
      [e.name || e.employerName, e.industry, e.trustScore, e.trustGrade, e.feedbackRate, e.retentionRate].join(' | ')
    ).join('\n');

    const skillRows = skillGaps.map((g: any) =>
      [g.skill, g.studentsAffected, g.employerReportedGap, g.priority].join(' | ')
    ).join('\n');

    return [
      '=== STATE METRICS ===',
      'Trained: ' + (metrics?.totalTrainees || 0) + ' | Certified: ' + (metrics?.totalCertified || 0) + ' | Placed: ' + (metrics?.totalPlaced || 0) + ' | Employed: ' + (metrics?.currentlyEmployed || 0) + ' | Avg Salary: Rs. ' + (metrics?.avgSalary || 0),
      '',
      '=== TRAINEES (id | name | district | category | gender | status | course | institute) ===',
      traineeRows,
      '',
      '=== COMPETENCIES (traineeId | skill | level | score) ===',
      compRows,
      '',
      '=== CREDENTIALS (traineeId | title | issuer | date | status) ===',
      credRows,
      '',
      '=== ACTIVE HIRES (id | name | employerId | role | salary | status) ===',
      hireRows,
      '',
      '=== COURSES (id | name | students | placementRate) ===',
      courseRows,
      '',
      '=== ATTRITION REASONS (reason | count) ===',
      attritionRows,
      '',
      '=== INSTITUTES (name | district | trained | certified | placed | employed | avgSalary) ===',
      instRows,
      '',
      '=== EMPLOYERS (name | industry | trustScore | grade | feedbackRate | retentionRate) ===',
      empRows,
      '',
      '=== SKILL GAPS (skill | studentsAffected | gapPercent | priority) ===',
      skillRows,
    ].join('\n');
  };

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;

    const userMessage = { role: 'user' as const, text };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const context = buildChatContext();
      const isHindi = chatLanguage === 'hi';
      const langInstruction = isHindi
        ? 'Respond in Hindi (Devanagari script). Keep technical terms like SQL, Power BI, and proper names in English where clearer, but write all sentences in Hindi.'
        : 'Respond in English.';

      const systemPrompt = 'You are the SkillTrack AI Assistant for the Ministry of Skill Development & Entrepreneurship, Government of India.\n\nYou help government officers understand skill development data from Maharashtra. Answer questions using ONLY the data provided below.\n\nRULES:\n- Answer in 1 to 3 sentences. No more.\n- Use actual numbers from the data when relevant.\n- If the data does not contain the answer, say so briefly and suggest what you can help with.\n- No markdown. No bullet points. No headers. Just plain text.\n- Be direct. Do not add preamble like "Based on the data" — just answer.\n\n' + langInstruction + '\n\n=== FULL DATA ===\n' + context + '\n=== END DATA ===';

      const result = await callGemini(text, systemPrompt);
      setChatMessages((prev) => [...prev, { role: 'assistant', text: result }]);
    } catch (err: any) {
      console.error('[CHAT] error:', err);
      setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, I could not reach the AI. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div
      className="dp-gov min-h-screen bg-[#F3F5F8] text-[#141C2B]"
    >
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-left { animation: marqueeLeft 60s linear infinite; }
        .marquee-right { animation: marqueeRight 60s linear infinite; }
        .marquee-container:hover .marquee-left,
        .marquee-container:hover .marquee-right { animation-play-state: paused; }
      `}</style>
      <style>{`
  .dp-gov {
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  }
  .dp-gov .dp-serif {
    font-family: 'Noto Serif', Georgia, 'Times New Roman', serif;
  }
  .dp-tricolor {
    height: 3px;
    width: 100%;
    background: linear-gradient(90deg, #E8730C 0 33.33%, #ffffff 33.33% 66.66%, #0F7A3D 66.66% 100%);
  }
`}</style>

      {/* TOP STRIP */}
      <div className="bg-[#0B2A4A] text-white text-[12px] py-2 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <span className="inline-flex items-center mr-2 shrink-0" style={{ width: '20px', height: '14px' }}>
              <svg viewBox="0 0 30 20" width="20" height="14" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="20" fill="#FF9933"/>
                <rect y="6.66" width="30" height="6.66" fill="#FFFFFF"/>
                <rect y="13.33" width="30" height="6.66" fill="#138808"/>
                <circle cx="15" cy="10" r="2" fill="none" stroke="#000080" strokeWidth="0.3"/>
              </svg>
            </span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" style={{ flexShrink: 0, marginRight: 8 }}>
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3.2" />
              <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
            </svg>
            <span className="font-semibold">
              भारत सरकार | GOVERNMENT OF INDIA &nbsp;·&nbsp; Ministry of Skill Development &amp; Entrepreneurship
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <span className="hidden md:inline">Screen Reader</span>
            <span>|</span>
            <span className="font-mono">A-</span>
            <span className="font-mono">A</span>
            <span className="font-mono font-bold">A+</span>
            <span>|</span>
            <span className="font-semibold text-white">English</span>
            <span>|</span>
            <span>हिन्दी</span>
            <span>|</span>
            <span className="hidden lg:inline">Helpdesk: 1800-11-2024</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-white border-b border-[#E3E8EF]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 60 60" width="48" height="48" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <circle cx="30" cy="30" r="26" fill="#ea580c" />
                <circle cx="30" cy="30" r="22" fill="#FFFFFF" />
                <circle cx="30" cy="30" r="18" fill="none" stroke="#ea580c" strokeWidth="1.5" />
                <circle cx="30" cy="30" r="3" fill="#ea580c" />
                <g stroke="#ea580c" strokeWidth="1" strokeLinecap="round">
                  <line x1="30" y1="12" x2="30" y2="18" />
                  <line x1="30" y1="42" x2="30" y2="48" />
                  <line x1="12" y1="30" x2="18" y2="30" />
                  <line x1="42" y1="30" x2="48" y2="30" />
                  <line x1="17" y1="17" x2="21" y2="21" />
                  <line x1="39" y1="39" x2="43" y2="43" />
                  <line x1="43" y1="17" x2="39" y2="21" />
                  <line x1="21" y1="39" x2="17" y2="43" />
                  <line x1="30" y1="18" x2="30" y2="42" strokeWidth="0.5" />
                  <line x1="18" y1="30" x2="42" y2="30" strokeWidth="0.5" />
                  <line x1="21.5" y1="21.5" x2="38.5" y2="38.5" strokeWidth="0.5" />
                  <line x1="38.5" y1="21.5" x2="21.5" y2="38.5" strokeWidth="0.5" />
                </g>
              </svg>
              <div className="hidden md:flex flex-col leading-tight">
                <div className="text-[11px] font-semibold text-[#c2410c] leading-tight">
                  कौशल विकास और
                </div>
                <div className="text-[11px] font-semibold text-[#c2410c] leading-tight">
                  उद्यमशीलता मंत्रालय
                </div>
                <div className="w-full border-t border-[#e7d7c0] my-1" />
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#0b3d91] leading-tight">
                  Ministry of Skill Development
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#0b3d91] leading-tight">
                  &amp; Entrepreneurship
                </div>
                <div className="text-[9px] text-[#64748b] mt-0.5">
                  Government of India
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-px h-10 bg-[#c7d8e8]" />
            <SkillTrackLogo />
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <div ref={searchRef} className="relative w-[280px] lg:w-[360px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search student ID or institute name (e.g. MAH-PUN-001, NSDC Pune)"
                className="w-full h-11 pl-10 pr-4 bg-[#F8FAFC] border border-[#E3E8EF] rounded-md text-[13px] text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#E8730C] focus:ring-2 focus:ring-[#E8730C]/10"
              />
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#c7d8e8] rounded-md shadow-lg z-50 max-h-[420px] overflow-y-auto">
                  {filteredInstitutes.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-[#f8fafc] text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#e5e7eb]">
                        Institutes
                      </div>
                      {filteredInstitutes.map((inst: any) => (
                        <button
                          key={inst.id}
                          onClick={() => handleInstituteClick(inst)}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#f8fafc] border-b border-[#f1f5f9] last:border-0"
                        >
                          <div className="text-[13px] font-semibold text-[#0b3d91]">{inst.name}</div>
                          <div className="text-[11px] text-[#64748b]">{inst.id}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchStudent && (
                    <div>
                      <div className="px-4 py-2 bg-[#f8fafc] text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#e5e7eb]">
                        Students
                      </div>
                      <button
                        onClick={() => handleStudentClick(searchStudent)}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#f8fafc]"
                      >
                        <div className="text-[13px] font-semibold text-[#0b3d91]">{searchStudent.name}</div>
                        <div className="text-[11px] text-[#64748b]">{searchStudent.id} · {searchStudent.institution || ''}</div>
                      </button>
                    </div>
                  )}
                  {filteredInstitutes.length === 0 && !searchStudent && !searchingStudent && (
                    <div className="px-4 py-6 text-center text-[12px] text-[#94a3b8]">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                  {searchingStudent && (
                    <div className="px-4 py-3 text-[12px] text-[#64748b] border-t border-[#f1f5f9]">
                      Searching for student…
                    </div>
                  )}
                </div>
              )}
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FDEEE1] text-[#B85C08] text-[12px] font-semibold border border-[#F5D0A9]">
              Government Officer (MSDE / DGT)
            </span>
            {onChangeRole && (
              <button
                onClick={onChangeRole}
                className="text-[13px] font-medium px-3 py-1.5 rounded border border-[#E8730C] text-[#E8730C] hover:bg-[#FDEEE1]"
              >
                Logout
              </button>
            )}
          </div>
        </div>
        <div className="dp-tricolor"></div>
      </header>

      {/* SUBNAV */}
      <nav className="bg-white border-b border-[#E3E8EF]">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setDetail(null); }}
              className={
                'px-4 py-3 text-[12px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ' +
                (activeTab === tab
                  ? 'text-[#0B2A4A] border-b-2 border-[#E8730C]'
                  : 'text-[#6B7A8D] hover:text-[#0B2A4A]')
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* ANNOUNCEMENT TICKER */}
      <div className="bg-[#0b3d91] text-white text-[12px] py-2 px-4 overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 hidden sm:inline">
              Live Updates
            </span>
          </div>
          <div className="marquee-container overflow-hidden flex-1">
            <div className="marquee-left flex gap-8 whitespace-nowrap">
              <span>
                FY {metrics?.reportCycle || '2025-26'} report cycle now live
                &nbsp;•&nbsp; New institutes onboarded this quarter
                &nbsp;•&nbsp; Employer feedback window open
                &nbsp;•&nbsp; {metrics?.totalTrainees || 0} trainees tracked across Maharashtra
                &nbsp;•&nbsp; FY {metrics?.reportCycle || '2025-26'} report cycle now live
                &nbsp;•&nbsp; New institutes onboarded this quarter
                &nbsp;•&nbsp; Employer feedback window open
                &nbsp;•&nbsp; {metrics?.totalTrainees || 0} trainees tracked across Maharashtra
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-24 text-[#475569]">Loading dashboard…</div>
        ) : detail ? (
          detail.type === 'institute' ? (
            <InstituteDetail id={detail.id} name={detail.name} onBack={goDashboard} onStudentClick={handleStudentClick} />
          ) : detail.type === 'student' ? (
            <StudentDetail id={detail.id} onBack={goDashboard} />
          ) : detail.type === 'course' ? (
            <CourseDetail id={detail.id} name={detail.name} onBack={goDashboard} />
          ) : detail.type === 'employer' ? (
            <EmployerDetail id={detail.id} onBack={() => { setDetail(null); setActiveTab('EMPLOYERS'); }} />
          ) : null
        ) : activeTab === 'DASHBOARD' ? (
          <DashboardContent />
        ) : activeTab === 'INSTITUTES' ? (
          <InstitutesGrid onInstituteClick={handleInstituteClick} />
        ) : activeTab === 'COURSES' ? (
          <CoursesList onCourseClick={handleCourseClick} />
        ) : activeTab === 'EMPLOYMENT OUTCOMES' ? (
          <EmploymentOutcomes />
        ) : activeTab === 'SKILL GAPS' ? (
          <SkillGapsFull />
        ) : activeTab === 'EMPLOYERS' ? (
          <EmployersList onEmployerClick={handleEmployerClick} />
        ) : activeTab === 'REPORTS' ? (
          <ReportsList />
        ) : null}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#09244b] text-white mt-12">
        {/* Compliance badges */}
        <div className="max-w-[1200px] mx-auto px-4 -mt-8 relative z-10 mb-8">
          <div className="bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-[#e5e7eb] px-6 py-5">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { label: 'GIGW Compliant', icon: '✓' },
                { label: 'India.gov.in', icon: '🇮🇳' },
                { label: 'ISO 27001:2022', icon: '🔒' },
                { label: 'NCVET Verified', icon: '📋' },
                { label: 'MSDE', icon: '🏛️' },
                { label: 'DPDP Act 2023', icon: '⚖️' }
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[16px]">{b.icon}</span>
                  <span className="text-[11px] font-semibold text-[#334155] whitespace-nowrap">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-[12px]">
          <div>
            <div className="text-[12px] font-bold text-amber-300 uppercase tracking-wider mb-3">About</div>
            <div className="flex flex-col gap-1.5 text-slate-300">
              <a href="#" className="hover:text-white">About SkillTrack AI</a>
              <a href="#" className="hover:text-white">Contact Us</a>
              <a href="#" className="hover:text-white">Help &amp; Support</a>
              <a href="#" className="hover:text-white">Disclaimer</a>
            </div>
          </div>
          <div>
            <div className="text-[12px] font-bold text-amber-300 uppercase tracking-wider mb-3">What We Offer</div>
            <div className="flex flex-col gap-1.5 text-slate-300">
              <a href="#" className="hover:text-white">Dashboards</a>
              <a href="#" className="hover:text-white">Institutes</a>
              <a href="#" className="hover:text-white">Courses</a>
              <a href="#" className="hover:text-white">Reports</a>
            </div>
          </div>
          <div>
            <div className="text-[12px] font-bold text-amber-300 uppercase tracking-wider mb-3">Quick Links</div>
            <div className="flex flex-col gap-1.5 text-slate-300">
              <a href="#" className="hover:text-white">MSDE</a>
              <a href="#" className="hover:text-white">NCVET</a>
              <a href="#" className="hover:text-white">DGT</a>
              <a href="#" className="hover:text-white">NSDC</a>
              <a href="#" className="hover:text-white">DigiLocker</a>
            </div>
          </div>
          <div>
            <div className="text-[12px] font-bold text-amber-300 uppercase tracking-wider mb-3">Contact</div>
            <div className="flex flex-col gap-1.5 text-slate-300">
              <span>Helpdesk: 1800-11-2024</span>
              <span>support@skilltrack.gov.in</span>
              <span>Toll-Free: 1800-202-4400</span>
            </div>
            <div className="flex gap-3 mt-3">
              <span className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-[13px]">f</span>
              <span className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-[13px]">in</span>
              <span className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-[13px]">X</span>
              <span className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-[13px]">▶</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>© 2026 Ministry of Skill Development &amp; Entrepreneurship, Government of India</span>
            <div className="flex items-center gap-4">
              <span>Last Modified: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>·</span>
              <span className="text-amber-300 font-mono">Visitor Count: {visitorCount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#09244b] text-white text-[13px] px-5 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {/* FLOATING SIDE BUTTONS */}
      {!chatOpen && (
        <button
          type="button"
          onClick={() => { setChatOpen(true); loadChatData(); }}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#0B2A4A] hover:bg-[#123A63] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Open AI Assistant"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-2rem)] bg-white rounded-2xl border border-[#E3E8EF] flex flex-col overflow-hidden" style={{ boxShadow: '0 6px 20px rgba(11,42,74,.08)' }}>
          <div className="flex items-center justify-between px-4 h-14 border-b border-[#E3E8EF] bg-[#0B2A4A] text-white shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#E8730C] flex items-center justify-center text-white text-[12px] font-bold">AI</span>
              <span className="text-[14px] font-semibold text-white dp-serif">Assistant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="inline-flex rounded border border-white/25 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setChatLanguage('en')}
                  className={
                    'text-[11px] font-bold px-2 py-1 ' +
                    (chatLanguage === 'en' ? 'bg-[#E8730C] text-white' : 'bg-white/10 text-white/80')
                  }
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setChatLanguage('hi')}
                  className={
                    'text-[11px] font-bold px-2 py-1 border-l border-white/25 ' +
                    (chatLanguage === 'hi' ? 'bg-[#E8730C] text-white' : 'bg-white/10 text-white/80')
                  }
                >
                  हिं
                </button>
              </div>
              <button
                type="button"
                onClick={() => showToast('Live mode coming in the next step')}
                className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center text-white/80"
                title="Live voice mode"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center text-white/80"
                aria-label="Close chat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F8FAFC]">
            {chatMessages.length === 0 && !chatLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-12 h-12 rounded-full bg-[#0B2A4A] flex items-center justify-center text-white text-[16px] font-bold mb-3">
                  AI
                </div>
                <div className="text-[14px] font-semibold text-slate-800 mb-1">SkillTrack Assistant</div>
                <div className="text-[12px] text-slate-500 mb-4">Ask me about the data</div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Try: "How many institutes?"<br />
                  "Which employer has the highest trust score?"<br />
                  "What are the top skill gaps?"
                </div>
              </div>
            )}

            {chatMessages.map((m, i) => (
              <div key={i} className={'flex mb-3 ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={
                    'max-w-[80%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ' +
                    (m.role === 'user'
                      ? 'bg-[#0B2A4A] text-white rounded-2xl rounded-br-sm'
                      : 'bg-white text-[#141C2B] border border-[#E3E8EF] rounded-2xl rounded-bl-sm')
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex mb-3 justify-start">
                <div className="bg-white border border-[#E3E8EF] rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {!chatDataLoaded && chatMessages.length === 0 && (
              <div className="text-center text-[11px] text-slate-400 mt-4">Loading data...</div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-[#E3E8EF] p-3 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                placeholder={chatLanguage === 'hi' ? 'संदेश लिखें...' : 'Type a message...'}
                disabled={chatLoading}
                className="flex-1 h-10 px-4 bg-[#F8FAFC] border border-[#E3E8EF] rounded-full text-[13px] text-[#141C2B] placeholder-[#9CA9B8] focus:outline-none focus:border-[#E8730C] disabled:opacity-60"
              />
              <button
                type="button"
                onClick={sendChatMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="w-10 h-10 rounded-full bg-[#E8730C] text-white flex items-center justify-center hover:bg-[#C25A00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Send"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function DashboardContent() {
    const top3 = topPerformers.slice(0, 3);
    return (
      <>
        <div className="dp-hero relative overflow-hidden rounded-2xl p-14 mb-6 bg-gradient-to-br from-[#0B2A4A] to-[#123A63] text-white">
          <svg
            className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-10 pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.6"
          >
            <circle cx="100" cy="100" r="40" />
            <circle cx="100" cy="100" r="55" />
            <circle cx="100" cy="100" r="70" />
            <circle cx="100" cy="100" r="85" />
            <circle cx="100" cy="100" r="12" />
            <g strokeWidth="0.4">
              <path d="M100 12v176M12 100h176M37 37l126 126M163 37L37 163" />
            </g>
          </svg>
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/25 mb-4">
              <svg viewBox="0 0 60 80" width="18" height="22" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 4 L42 12 L42 28 C42 40 36 50 30 56 C24 50 18 40 18 28 L18 12 Z" fill="#ffffff"/>
                <circle cx="30" cy="30" r="6" fill="none" stroke="#ea580c" strokeWidth="1.5"/>
                <circle cx="30" cy="30" r="3" fill="#ea580c"/>
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">MSDE</span>
            </div>
            <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#E8730C] mb-3">
              DGT-EVAL-SYS · Official Audit Record
            </div>
            <h1 className="dp-serif text-[36px] sm:text-[40px] font-bold leading-tight tracking-tight">
              <div>Skill Development &amp; Employment Outcome</div>
              <div className="mt-1">
                <span className="bg-[#ea580c] text-white px-2 inline-block">Dashboard</span>
              </div>
            </h1>
            <p className="text-[15px] text-white/85 mt-4 max-w-[720px]">
              Maharashtra · Report Cycle {metrics?.reportCycle || 'FY 2025-26'}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-[#0F7A3D]/25 text-[#7BD1A2] border border-[#0F7A3D]/40">✓ NCVET Verified</span>
              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-[#E8730C]/25 text-[#F5A662] border border-[#E8730C]/40">⚡ Live Data</span>
              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">🔒 DPDP Compliant</span>
            </div>
          </div>

          <div className="relative flex flex-wrap items-center gap-6 mt-6 pt-5 border-t border-white/10">
            {[
              { label: 'Verified Credentials', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Employer Feedback', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z' },
              { label: 'Skill Gap Insights', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { label: 'Govt. Dashboard Access', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E8730C] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <span className="text-[12px] font-medium text-white">{f.label}</span>
              </div>
            ))}
            <button
              onClick={() => window.print()}
              className="ml-auto text-[12px] font-semibold px-4 py-2 rounded border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              Print Report
            </button>
          </div>
        </div>

        <div className="-mt-8 relative z-10 px-4 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <KpiCard label="Students Trained" value={metrics?.totalTrainees?.toLocaleString() || '—'} />
            <KpiCard label="Certified" value={metrics?.totalCertified?.toLocaleString() || '—'} />
            <KpiCard label="Placed" value={metrics?.totalPlaced?.toLocaleString() || '—'} />
            <KpiCard label="Currently Employed" value={metrics?.currentlyEmployed?.toLocaleString() || '—'} />
            <KpiCard label="Avg Starting Salary" value={metrics?.avgSalary ? `₹${metrics.avgSalary.toLocaleString()}` : '—'} />
          </div>
        </div>

        {/* PARTNERS MARQUEE */}
        <div className="bg-[#F8FAFC] border border-[#E3E8EF] rounded-2xl mb-6 py-8 overflow-hidden">
          <div className="text-center mb-4">
            <h2 className="text-[20px] font-bold text-[#0B2A4A] dp-serif">Our Partners</h2>
          </div>
          <div className="marquee-container">
            <div className="marquee-left flex gap-3 mb-3" style={{ width: 'max-content' }}>
              {[...MINISTRIES, ...MINISTRIES].map((m, i) => (
                <div key={i} className="bg-white border border-[#e5e7eb] rounded-md px-5 py-2.5 min-w-[180px] flex flex-col items-center justify-center">
                  <div className="text-[13px] font-bold text-[#475569] whitespace-nowrap">{m.name}</div>
                  <div className="text-[10px] text-[#94a3b8] whitespace-nowrap mt-0.5">{m.subtitle}</div>
                </div>
              ))}
            </div>
            <div className="marquee-right flex gap-3" style={{ width: 'max-content' }}>
              {[...INDUSTRY, ...INDUSTRY].map((m, i) => (
                <div key={i} className="bg-white border border-[#e5e7eb] rounded-md px-5 py-2.5 min-w-[180px] flex flex-col items-center justify-center">
                  <div className="text-[13px] font-bold text-[#475569] whitespace-nowrap">{m.name}</div>
                  <div className="text-[10px] text-[#94a3b8] whitespace-nowrap mt-0.5">{m.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-[#F8FAFC] border-l-4 border-[#E8730C] rounded-r-xl p-7">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-16 h-16 shrink-0 rounded-full bg-[#0B2A4A] text-white flex items-center justify-center font-bold text-[20px]">
                NM
              </div>
              <div className="flex-1">
                <p className="text-[18px] italic text-[#0B2A4A] leading-relaxed dp-serif">
                  "Skill development of the new generation is a national need and is the foundation of Aatmnirbhar Bharat."
                </p>
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B7A8D] mt-3">
                  — Government of India
                </div>
                <div className="text-[12px] text-[#6B7A8D]">
                  Ministry of Skill Development &amp; Entrepreneurship
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border-r-4 border-[#E8730C] rounded-l-xl p-7">
            <div className="flex flex-col-reverse sm:flex-row gap-5 items-start">
              <div className="flex-1 sm:text-right">
                <p className="text-[15px] italic text-[#0B2A4A] leading-relaxed">
                  New skills such as AI, machine learning, and automation are transforming industries and highlighting the critical need for continuous learning. The Government of India is committed to fostering a culture of lifelong learning, ensuring our workforce adapts to rapidly changing technologies.
                </p>
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B7A8D] mt-3">
                  — Skill India Digital Mission
                </div>
              </div>
              <div className="w-16 h-16 shrink-0 rounded-full bg-[#E8730C] text-white flex items-center justify-center font-bold text-[20px]">
                SI
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E3E8EF] rounded-xl p-7">
            <div className="text-[11px] font-bold text-[#E8730C] uppercase tracking-[0.14em] mb-2">
              Our Vision
            </div>
            <p className="text-[15px] text-[#6B7A8D] leading-relaxed">
              To close the loop between skill training and real employment outcomes — through verified data, AI-powered analytics, and evidence-based policy for every trainee in Maharashtra.
            </p>
          </div>
        </div>

        {/* PROMO BANNER */}
        <div className="bg-gradient-to-br from-[#E8EEF6] to-[#D6E1F0] border border-[#C6D5EA] rounded-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0B2A4A] text-[11px] font-bold uppercase tracking-[0.14em] border border-[#C6D5EA] mb-4">
                ✨ AI-verified Employment Passport
              </div>
              <h2 className="text-[26px] font-bold text-[#0B2A4A] dp-serif leading-tight mb-3">
                Every Trainee Gets a Digital Employment Passport
              </h2>
              <p className="text-[15px] text-[#6B7A8D] leading-relaxed mb-4">
                Showcase verified skills, certifications, and employment outcomes in one shareable digital document.
              </p>
              <div className="flex items-center gap-2 mb-3">
                {['RS', 'PD', 'AB', 'NK', 'SK'].map((initials, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[#0B2A4A] text-white flex items-center justify-center text-[11px] font-bold border-2 border-white">
                    {initials}
                  </div>
                ))}
                <span className="text-[12px] text-[#475569] ml-1">&amp; many more</span>
              </div>
              <div className="text-[11px] text-[#64748b] mb-4">Thousands of verified passports issued</div>
              <button
                onClick={() => showToast('Sample passport view coming soon')}
                className="text-[14px] font-semibold text-white bg-[#E8730C] hover:bg-[#C25A00] px-6 py-3 rounded-lg transition-colors"
              >
                View Sample Passport →
              </button>
            </div>
            <div className="relative w-full md:w-[220px] h-[160px] shrink-0">
              <div className="absolute top-4 left-4 w-[160px] h-[130px] bg-white border border-[#bfdbfe] rounded shadow-md"></div>
              <div className="absolute top-0 left-0 w-[170px] h-[140px] bg-white border border-[#bfdbfe] rounded shadow-lg p-3">
                <div className="text-[9px] font-bold text-[#0b3d91] mb-1">DIGITAL PASSPORT</div>
                <div className="text-[11px] font-bold text-[#1e293b]">Rahul Sharma</div>
                <div className="text-[8px] text-[#64748b] mb-2">MAH-PUN-001</div>
                <div className="grid grid-cols-6 gap-0.5 w-[40px] h-[40px] absolute bottom-2 right-2">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className={(i * 7 + 3) % 3 === 0 ? 'bg-black' : 'bg-white'}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BUILDING A SKILLED MAHARASHTRA */}
        <div className="bg-white border border-[#E3E8EF] rounded-2xl p-10 mb-6">
          <h2 className="text-[28px] font-bold text-[#0B2A4A] dp-serif text-center mb-10">
            Building a Skilled Maharashtra
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FDEEE1] flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-[#E8730C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#0B2A4A] mb-2">Citizen Centric</h3>
              <p className="text-[14px] text-[#6B7A8D] leading-relaxed">
                Designed to meet the skilling needs of Maharashtra's diverse and aspirational population
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FDEEE1] flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-[#E8730C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#0B2A4A] mb-2">Career Focussed</h3>
              <p className="text-[14px] text-[#6B7A8D] leading-relaxed">
                Track every trainee from training to placement to retention
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FDEEE1] flex items-center justify-center mb-5">
                <div className="flex flex-col gap-1">
                  <div className="bg-white border border-[#ea580c] text-[#c2410c] text-[10px] font-semibold px-2 py-0.5 rounded">नमस्ते</div>
                  <div className="bg-white border border-[#ea580c] text-[#c2410c] text-[10px] font-semibold px-2 py-0.5 rounded">नमस्कार</div>
                </div>
              </div>
              <h3 className="text-[17px] font-semibold text-[#0B2A4A] mb-2">Multilingual</h3>
              <p className="text-[14px] text-[#6B7A8D] leading-relaxed">
                Access the portal in English, Hindi, or Marathi
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => showToast('Coming soon')}
              className="text-[14px] font-semibold text-white bg-[#E8730C] hover:bg-[#C25A00] px-6 py-3 rounded-lg transition-colors"
            >
              Learn More →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
          <div className="lg:col-span-3 bg-white border border-[#E3E8EF] rounded-2xl overflow-hidden">
            <div className="bg-[#FDEEE1] px-5 py-4 border-b border-[#F5D0A9] flex items-center justify-between">
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#B85C08]">⚠️ Watchlist</span>
              <span className="text-[12px] text-[#B85C08]">{watchlist.length} institutes &lt; 70% placement</span>
            </div>
            <div className="p-4 space-y-2">
              {watchlist.length === 0 ? (
                <div className="text-[13px] text-[#15803d] py-4 text-center">✅ All institutes above threshold</div>
              ) : (
                watchlist.map((inst: any, i: number) => (
                  <button
                    key={inst.id || i}
                    onClick={() => handleInstituteClick(inst)}
                    className="w-full text-left flex items-center justify-between p-4 bg-white hover:bg-[#F8FAFC] rounded-lg border border-[#E3E8EF]"
                  >
                    <div>
                      <div className="text-[13px] font-semibold text-[#0b3d91]">{inst.name}</div>
                      <div className="text-[11px] text-[#64748b]">{inst.id} · {inst.district || '—'}</div>
                    </div>
                    <div className="text-[15px] font-bold text-[#E8730C]" style={{ fontVariantNumeric: 'tabular-nums' }}>{inst.placementRate}%</div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#E3E8EF] rounded-2xl overflow-hidden">
            <div className="bg-[#E6F3EB] px-5 py-4 border-b border-[#B7DCC5] flex items-center justify-between">
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#0F7A3D]">🏆 Top Performers</span>
            </div>
            <div className="p-4 space-y-3">
              {top3.map((inst: any, i: number) => (
                <button
                  key={inst.id || i}
                  onClick={() => handleInstituteClick(inst)}
                  className={
                    'w-full text-left flex items-center gap-3 p-4 rounded-lg border border-[#E3E8EF] ' +
                    (i === 0 ? 'bg-[#FEF8E7]' : i === 1 ? 'bg-[#F3F5F8]' : 'bg-[#FDEEE1]')
                  }
                >
                  <span className="text-[26px]">{['🥇', '🥈', '🥉'][i]}</span>
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold text-[#0B2A4A]">{inst.name}</div>
                    <div className="text-[11px] text-[#64748b]">{inst.district}</div>
                  </div>
                  <div className="text-[16px] font-bold text-[#0F7A3D]" style={{ fontVariantNumeric: 'tabular-nums' }}>{inst.placementRate}%</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  function InstitutesGrid({ onInstituteClick }: { onInstituteClick: (inst: any) => void }) {
    const [filter, setFilter] = useState('');
    const [districtFilter, setDistrictFilter] = useState('All Districts');
    const [sortBy, setSortBy] = useState<'placement' | 'trained' | 'name'>('placement');

    const enriched = institutes.map((i: any) => {
      const trained = i.trained || 0;
      const placed = i.placed || 0;
      const placementRate = trained > 0 ? Math.round((placed / trained) * 1000) / 10 : 0;
      return { ...i, placementRate };
    });

    const filtered = enriched
      .filter((i: any) =>
        (!filter || (i.name || '').toLowerCase().includes(filter.toLowerCase()) ||
          (i.id || '').toLowerCase().includes(filter.toLowerCase()))
        && (districtFilter === 'All Districts' || (i.district || '').toLowerCase().includes(districtFilter.toLowerCase()))
      )
      .sort((a: any, b: any) => {
        if (sortBy === 'placement') return b.placementRate - a.placementRate;
        if (sortBy === 'trained') return (b.trained || 0) - (a.trained || 0);
        return (a.name || '').localeCompare(b.name || '');
      });

    return (
      <div>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h1 className="text-[28px] font-bold text-[#0b3d91] mb-1 tracking-tight">Institutes</h1>
          <div className="w-16 h-1 bg-[#ea580c] rounded-full my-2" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by name or code"
              className="h-10 px-3 border border-[#c7d8e8] rounded text-[13px] focus:outline-none focus:border-[#ea580c]"
            />
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="h-10 px-3 border border-[#c7d8e8] rounded text-[13px]"
            >
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-3 border border-[#c7d8e8] rounded text-[13px]"
            >
              <option value="placement">Sort: Placement rate</option>
              <option value="trained">Sort: Trained count</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((inst: any, i: number) => {
            const dot = inst.placementRate >= 80 ? '#15803d' : inst.placementRate >= 70 ? '#ea580c' : '#dc2626';
            const gradeBg = inst.grade === 'A+' ? '#d1fae5' : inst.grade === 'A' ? '#dbeafe' : inst.grade === 'B+' ? '#fef3c7' : '#f1f5f9';
            const gradeFg = inst.grade === 'A+' ? '#065f46' : inst.grade === 'A' ? '#1e40af' : inst.grade === 'B+' ? '#92400e' : '#475569';
            return (
              <button
                key={inst.id || i}
                onClick={() => onInstituteClick(inst)}
                className="text-left bg-white border border-[#c7d8e8] rounded-lg p-5 hover:border-[#ea580c] hover:shadow-[0_8px_24px_rgba(234,88,12,0.08)] transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-[#0b3d91] truncate">{inst.name}</div>
                    <div className="text-[11px] text-[#64748b] mt-0.5">{inst.id} · {inst.district || '—'}</div>
                  </div>
                  {inst.grade && (
                    <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: gradeBg, color: gradeFg }}>
                      {inst.grade}
                    </span>
                  )}
                </div>
                <div className="border-t border-[#e5e7eb] my-3" />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-[20px] font-bold text-[#0b3d91] font-mono leading-none">{inst.trained}</div>
                    <div className="text-[10px] text-[#64748b] uppercase mt-1">Trained</div>
                  </div>
                  <div>
                    <div className="text-[20px] font-bold text-[#15803d] font-mono leading-none">{inst.placed}</div>
                    <div className="text-[10px] text-[#64748b] uppercase mt-1">Placed</div>
                  </div>
                  <div>
                    <div className="text-[20px] font-bold text-[#ea580c] font-mono leading-none">{inst.employed}</div>
                    <div className="text-[10px] text-[#64748b] uppercase mt-1">Employed</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e5e7eb]">
                  <span className="text-[11px] text-[#64748b]">Placement</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#0b3d91] font-mono">{inst.placementRate}%</span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: dot }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function CoursesList({ onCourseClick }: { onCourseClick: (c: any) => void }) {
    const enriched = courses.map((c: any) => ({
      ...c,
      _placementRate: c.placementRate || 0
    })).sort((a: any, b: any) => b._placementRate - a._placementRate);

    return (
      <div>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h1 className="text-[28px] font-bold text-[#0b3d91] mb-1 tracking-tight">Approved Courses</h1>
          <div className="w-16 h-1 bg-[#ea580c] rounded-full my-2" />
          <p className="text-[13px] text-[#475569]">Ranked by placement rate (best first)</p>
        </div>

        <div className="bg-white border border-[#c7d8e8] rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#ebf4fc] text-[#0b3d91] text-[11px] uppercase tracking-wider border-b border-[#c7d8e8]">
                  <th className="py-2.5 px-3 font-bold">Course</th>
                  <th className="py-2.5 px-3 font-bold">Institute</th>
                  <th className="py-2.5 px-3 font-bold">Duration</th>
                  <th className="py-2.5 px-3 font-bold">Trained</th>
                  <th className="py-2.5 px-3 font-bold">Placed %</th>
                  <th className="py-2.5 px-3 font-bold">Skill Gap</th>
                  <th className="py-2.5 px-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map((c: any, i: number) => (
                  <tr key={c.id || i} onClick={() => onCourseClick(c)} className="border-b border-[#c7d8e8] hover:bg-[#fef9f3] cursor-pointer">
                    <td className="py-2.5 px-3 font-semibold text-[#0b3d91]">{c.name}</td>
                    <td className="py-2.5 px-3">{c.instituteName || c.institute || '—'}</td>
                    <td className="py-2.5 px-3">{c.duration || '—'}</td>
                    <td className="py-2.5 px-3 font-mono">{c.students || '—'}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#ea580c]">{c._placementRate ? c._placementRate + '%' : '—'}</td>
                    <td className="py-2.5 px-3">
                      {c.mainSkillGap ? (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          {c.mainSkillGap.substring(0, 20)}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-[11px] font-bold text-[#ea580c]">View →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function EmploymentOutcomes() {
    const totals = districtSummary.reduce((acc: any, d: any) => ({
      trained: acc.trained + d.trained,
      certified: acc.certified + d.certified,
      placed: acc.placed + d.placed,
      employed: acc.employed + d.employed
    }), { trained: 0, certified: 0, placed: 0, employed: 0 });

    return (
      <div>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h1 className="text-[28px] font-bold text-[#0b3d91] mb-1 tracking-tight">Employment Outcomes — By District</h1>
          <div className="w-16 h-1 bg-[#ea580c] rounded-full my-2" />
          <p className="text-[13px] text-[#475569]">Longitudinal outcomes grouped by district</p>
        </div>

        <div className="bg-white border border-[#c7d8e8] rounded-lg overflow-hidden mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#ebf4fc] text-[#0b3d91] text-[11px] uppercase tracking-wider border-b border-[#c7d8e8]">
                  <th className="py-2.5 px-3 font-bold">District</th>
                  <th className="py-2.5 px-3 font-bold">Trained</th>
                  <th className="py-2.5 px-3 font-bold">Certified</th>
                  <th className="py-2.5 px-3 font-bold">Placed</th>
                  <th className="py-2.5 px-3 font-bold">Employed</th>
                  <th className="py-2.5 px-3 font-bold">Retention</th>
                </tr>
              </thead>
              <tbody>
                {districtSummary.map((d: any, i: number) => {
                  const retention = d.placed > 0 ? Math.round((d.employed / d.placed) * 1000) / 10 : 0;
                  return (
                    <tr key={i} className="border-b border-[#c7d8e8] hover:bg-[#fef9f3]">
                      <td className="py-2.5 px-3 font-semibold text-[#0b3d91]">{d.district}</td>
                      <td className="py-2.5 px-3 font-mono">{d.trained}</td>
                      <td className="py-2.5 px-3 font-mono text-[#005a9c]">{d.certified}</td>
                      <td className="py-2.5 px-3 font-mono text-[#15803d]">{d.placed}</td>
                      <td className="py-2.5 px-3 font-mono text-[#ea580c]">{d.employed}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#ea580c]">{retention}%</td>
                    </tr>
                  );
                })}
                <tr className="bg-[#fef9f3] border-t-2 border-[#ea580c] font-bold text-[#0b3d91]">
                  <td className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Total</td>
                  <td className="py-2.5 px-3 font-mono">{totals.trained}</td>
                  <td className="py-2.5 px-3 font-mono">{totals.certified}</td>
                  <td className="py-2.5 px-3 font-mono">{totals.placed}</td>
                  <td className="py-2.5 px-3 font-mono">{totals.employed}</td>
                  <td className="py-2.5 px-3 font-mono">
                    {totals.placed > 0 ? Math.round((totals.employed / totals.placed) * 1000) / 10 : 0}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-[#c7d8e8] rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="bg-[#fef9f3] px-4 py-3 border-b border-[#e7d7c0] flex items-center justify-between">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[#c2410c]">Why Employees Leave</span>
            <span className="text-[11px] font-semibold text-[#ea580c]">✨ AI Analysis Coming</span>
          </div>
          <div className="p-4 space-y-3">
            {groupedAttrition.length === 0 ? (
              <div className="text-[13px] text-[#64748b] text-center py-4">No attrition data available</div>
            ) : (
              groupedAttrition.map((a: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[13px] font-medium text-[#0b3d91]">{a.reason}</span>
                    <span className="text-[12px] font-mono text-[#64748b]">{a.count} ({a.percent}%)</span>
                  </div>
                  <div className="w-full bg-[#e5e7eb] h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ea580c] rounded-full" style={{ width: `${a.percent}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  function SkillGapsFull() {
    const generateAI = async () => {
      setAiLoading(true);
      setAiAnalysis(null);
      try {
        const gapsSummary = skillGaps.map((g: any) =>
          '- ' + (g.skill || 'Unknown') + ': ' + (g.studentsAffected || 0) + ' students affected, ' + (g.employerReportedGap || 0) + '% employer gap, priority ' + (g.priority || 'Unknown')
        ).join('\n');

        const institutionSummary = institutes.slice(0, 8).map((i: any) =>
          '- ' + (i.name || 'Unknown') + ' (' + (i.district || '—') + '): ' + (i.trained || 0) + ' trained, ' + (i.placed || 0) + ' placed'
        ).join('\n');

        const isHindi = aiLanguage === 'hi';
        const langInstruction = isHindi
          ? 'Respond entirely in Hindi (Devanagari script). Keep technical skill names and proper nouns in English where clearer, but write all sentences in Hindi.'
          : 'Respond entirely in English.';

        const systemContext = `You are a senior policy analyst for the SkillTrack AI - National Outcome Monitoring Portal, working for the Ministry of Skill Development & Entrepreneurship, Government of India.

Your job is to analyze skill development data from Maharashtra and produce a professional, structured policy brief for government officers. The brief will be read by senior officials and spoken aloud during presentations, so it must be clear, specific, and actionable.

============ CURRENT STATE DATA (Maharashtra, FY 2025-26) ============

STATE-WIDE METRICS:
- Total Trained: ${metrics?.totalTrainees || 0}
- Certified: ${metrics?.totalCertified || 0}
- Placed: ${metrics?.totalPlaced || 0}
- Currently Employed: ${metrics?.currentlyEmployed || 0}
- Average Starting Salary: Rs. ${metrics?.avgSalary || 0}

EMPLOYER-REPORTED SKILL GAPS:
${gapsSummary}

REPRESENTATIVE INSTITUTES:
${institutionSummary}

============ YOUR TASK ============

Produce a structured policy brief with EXACTLY this format. Do not add extra headings. Do not use markdown symbols like ** or ## or bullets with dashes. Use plain text with numbered steps.

The brief must have four sections in this order:

1. SITUATION SUMMARY
Write exactly 2 complete sentences describing which skill gaps are most critical and how many candidates are affected. Include the specific numbers from the data.

2. ROOT CAUSE ANALYSIS
Write exactly 2 complete sentences explaining why these gaps exist. Consider curriculum lag, trainer availability, or industry demand.

3. RECOMMENDED ACTIONS
Write exactly 4 numbered action steps (1. through 4.). Each step must be one complete sentence. Make each step concrete: which skills, which institutes, which industries, what timeline.

4. EXPECTED OUTCOME
Write 1 complete sentence describing the expected impact and timeframe.

LANGUAGE: ${langInstruction}

IMPORTANT: Every sentence must be complete. Do not stop mid-sentence. The total brief must be 180-220 words. Be specific with numbers. Do not use markdown.`;

        const userPrompt = 'Produce the structured policy brief with the four sections: Situation Summary, Root Cause Analysis, Recommended Actions (5 numbered steps), and Expected Outcome.';

        const result = await callGemini(userPrompt, systemContext);
        setAiAnalysis(result);
        showToast('AI analysis complete');
      } catch (err: any) {
        console.error('[AI ERROR]', err);
        showToast('AI analysis failed: ' + (err?.message || 'unknown error'));
      } finally {
        setAiLoading(false);
      }
    };

    return (
      <div>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-[28px] font-bold text-[#0b3d91] mb-1 tracking-tight">Skill Gap Analysis</h1>
              <div className="w-16 h-1 bg-[#ea580c] rounded-full my-2" />
              <p className="text-[13px] text-[#475569]">Employer-reported competency gaps across the state</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="inline-flex rounded border border-[#c7d8e8] overflow-hidden">
                <button
                  type="button"
                  onClick={() => { setAiLanguage('en'); stopSpeaking(); }}
                  className={
                    'text-[12px] font-bold px-3 py-1.5 transition-colors ' +
                    (aiLanguage === 'en'
                      ? 'bg-[#0b3d91] text-white'
                      : 'bg-white text-[#475569] hover:bg-[#ebf4fc]')
                  }
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => { setAiLanguage('hi'); stopSpeaking(); }}
                  className={
                    'text-[12px] font-bold px-3 py-1.5 transition-colors border-l border-[#c7d8e8] ' +
                    (aiLanguage === 'hi'
                      ? 'bg-[#0b3d91] text-white'
                      : 'bg-white text-[#475569] hover:bg-[#ebf4fc]')
                  }
                >
                  हिं
                </button>
              </div>
              <button
                type="button"
                onClick={generateAI}
                disabled={aiLoading}
                className="text-[12px] font-semibold bg-[#fff8f0] border border-[#fed7aa] text-[#ea580c] px-3 py-1.5 rounded hover:bg-[#fef3c7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading ? '✨ Analyzing…' : '✨ Generate AI Recommendations'}
              </button>
              {aiAnalysis && (
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speakText(aiAnalysis);
                    }
                  }}
                  className={
                    'text-[12px] font-semibold px-3 py-1.5 rounded transition-colors border ' +
                    (isSpeaking
                      ? 'bg-[#ea580c] text-white border-[#ea580c] hover:bg-[#c2410c]'
                      : 'bg-white text-[#475569] border-[#c7d8e8] hover:bg-[#ebf4fc]')
                  }
                >
                  {isSpeaking ? '⏹ Stop' : '🔊 Speak'}
                </button>
              )}
            </div>
          </div>
        </div>

        {aiAnalysis && (
          <div className="bg-gradient-to-br from-[#fff8f0] to-[#fef3c7] border border-[#fed7aa] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[16px]">✨</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c]">AI Strategic Recommendation</span>
              <span className="text-[10px] font-mono text-[#92400e] ml-auto">Gemini 3.8 Flash · {aiLanguage === 'hi' ? 'हिंदी' : 'English'}</span>
            </div>
            <div className="text-[13.5px] text-[#78350f] leading-relaxed whitespace-pre-wrap">
              {aiAnalysis}
            </div>
            <div className="text-[10px] text-[#92400e] mt-4 pt-3 border-t border-[#fed7aa]">
              AI-generated from current Firestore data · Verify before policy action
            </div>
          </div>
        )}

        {aiLoading && !aiAnalysis && (
          <div className="bg-[#fff8f0] border border-[#fed7aa] rounded-lg p-8 mb-5 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#ea580c] border-t-transparent rounded-full animate-spin" />
              <span className="text-[13px] text-[#c2410c] font-medium">Gemini is analyzing the skill gaps…</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGaps.map((gap: any, i: number) => (
            <div key={gap.id || i} className="bg-white border border-[#c7d8e8] rounded-lg p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[14px] font-bold text-[#0b3d91]">{gap.skill}</span>
                <span className={
                  'text-[10px] font-bold uppercase px-2 py-0.5 rounded ' +
                  (gap.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                   gap.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                   'bg-emerald-100 text-emerald-800')
                }>
                  {gap.priority}
                </span>
              </div>
              <div className="text-[12px] text-[#475569] mb-2">{gap.studentsAffected} students affected</div>
              <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-[#ea580c]" style={{ width: `${Math.min((gap.employerReportedGap || 0) * 2.5, 100)}%` }} />
              </div>
              <div className="text-[11px] text-[#64748b] leading-relaxed">{gap.recommendedIntervention || ''}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function EmployersList({ onEmployerClick }: { onEmployerClick: (e: any) => void }) {
    return (
      <div>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h1 className="text-[28px] font-bold text-[#0b3d91] mb-1 tracking-tight">Employer Partners</h1>
          <div className="w-16 h-1 bg-[#ea580c] rounded-full my-2" />
          <p className="text-[13px] text-[#475569]">Sorted by Trust Score — lowest first</p>
        </div>

        <div className="bg-white border border-[#c7d8e8] rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#ebf4fc] text-[#0b3d91] text-[11px] uppercase tracking-wider border-b border-[#c7d8e8]">
                  <th className="py-2.5 px-3 font-bold">Company</th>
                  <th className="py-2.5 px-3 font-bold">Industry</th>
                  <th className="py-2.5 px-3 font-bold">Trust Score</th>
                  <th className="py-2.5 px-3 font-bold">Feedback %</th>
                  <th className="py-2.5 px-3 font-bold">Retention %</th>
                  <th className="py-2.5 px-3 font-bold">Grade</th>
                  <th className="py-2.5 px-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {mergedEmployers.map((e: any, i: number) => {
                  const gradeBg = e.trustGrade === 'trusted' ? '#d1fae5' :
                                  e.trustGrade === 'watchlist' ? '#fef3c7' : '#fee2e2';
                  const gradeFg = e.trustGrade === 'trusted' ? '#065f46' :
                                  e.trustGrade === 'watchlist' ? '#92400e' : '#991b1b';
                  const scoreColor = e.trustScore >= 85 ? '#15803d' :
                                     e.trustScore >= 70 ? '#ea580c' : '#dc2626';
                  return (
                    <tr key={e.id || i} onClick={() => onEmployerClick(e)} className="border-b border-[#c7d8e8] hover:bg-[#fef9f3] cursor-pointer">
                      <td className="py-2.5 px-3 font-semibold text-[#0b3d91]">{e.name || e.employerName}</td>
                      <td className="py-2.5 px-3">{e.industry || '—'}</td>
                      <td className="py-2.5 px-3"><span className="font-mono font-bold text-[15px]" style={{ color: scoreColor }}>{e.trustScore}</span></td>
                      <td className="py-2.5 px-3 font-mono">{e.feedbackRate}%</td>
                      <td className="py-2.5 px-3 font-mono">{e.retentionRate}%</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ background: gradeBg, color: gradeFg }}>
                          {e.trustGrade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right"><span className="text-[11px] font-bold text-[#ea580c]">View →</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function EmployerDetail({ id, onBack }: { id: string; onBack: () => void }) {
    const employer = mergedEmployers.find((e: any) => (e.id || e.employerId) === id);
    if (!employer) {
      return (
        <div>
          <button onClick={onBack} className="mb-4 text-[13px] text-[#ea580c] hover:underline font-semibold">← Back</button>
          <div className="text-center py-16 text-[#64748b]">Employer not found.</div>
        </div>
      );
    }
    const scoreColor = employer.trustScore >= 85 ? '#15803d' : employer.trustScore >= 70 ? '#ea580c' : '#dc2626';
    return (
      <div>
        <button onClick={onBack} className="mb-4 text-[13px] text-[#ea580c] hover:underline font-semibold">← Back to Employers</button>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c] mb-1">Employer Detail</div>
          <h1 className="text-[28px] font-bold text-[#0b3d91] tracking-tight">{employer.name || employer.employerName}</h1>
          <div className="w-16 h-1 bg-[#ea580c] rounded-full my-2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[13px] text-[#334155]">
            <div>CIN: <strong className="font-mono">{employer.cin || '—'}</strong></div>
            <div>GSTIN: <strong className="font-mono">{employer.gstin || '—'}</strong></div>
            <div>Industry: <strong>{employer.industry || '—'}</strong></div>
            <div>City: <strong>{employer.city || '—'}, {employer.state || ''}</strong></div>
            <div>Contact: <strong>{employer.contactPerson || '—'}</strong></div>
            <div>Email: <strong className="font-mono">{employer.contactEmail || '—'}</strong></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <div className="bg-[#fef9f3] border border-[#e7d7c0] rounded-lg p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-[11px] uppercase tracking-wider text-[#92400e] mb-2">Trust Score</div>
            <div className="text-[56px] font-bold font-mono leading-none" style={{ color: scoreColor }}>{employer.trustScore}</div>
            <div className="text-[11px] text-[#78350f] mt-2">out of 100</div>
            <span className="inline-block mt-3 text-[11px] font-bold uppercase px-3 py-1 rounded"
              style={{ background: employer.trustGrade === 'trusted' ? '#d1fae5' :
                       employer.trustGrade === 'watchlist' ? '#fef3c7' : '#fee2e2',
                       color: employer.trustGrade === 'trusted' ? '#065f46' :
                              employer.trustGrade === 'watchlist' ? '#92400e' : '#991b1b' }}>
              {employer.trustGrade}
            </span>
          </div>
          <div className="lg:col-span-2 bg-white border border-[#c7d8e8] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h2 className="text-[14px] font-bold uppercase tracking-wide text-[#0b3d91] mb-4">Score Breakdown</h2>
            <div className="space-y-3">
              <ScoreBar label="Feedback Submission Rate" value={employer.feedbackRate} />
              <ScoreBar label="Retention Rate" value={employer.retentionRate} />
              <ScoreBar label="Data Consistency" value={employer.dataConsistency} />
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#334155]">Partnership Tenure</span>
                <span className="font-mono font-semibold text-[#0b3d91]">{employer.partnershipTenure} years</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#fff8f0] border border-[#fed7aa] rounded-lg p-5 text-center">
          <div className="text-[13px] font-bold text-[#ea580c] mb-1">✨ AI Trust Analysis</div>
          <div className="text-[12px] text-[#92400e]">AI-powered breakdown of this employer&apos;s reliability patterns coming soon</div>
        </div>
      </div>
    );
  }

  function InstituteDetail({ id, name, onBack, onStudentClick }: { id: string; name: string; onBack: () => void; onStudentClick: (s: any) => void }) {
    const [trainees, setTrainees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      (async () => {
        try {
          const t = await getTraineesByInstitute(id);
          setTrainees(Array.isArray(t) ? t : []);
        } catch (err) {
          console.warn('Trainees fetch error:', err);
        } finally {
          setLoading(false);
        }
      })();
    }, [id]);
    const inst = institutes.find((x: any) => x.id === id) || {};
    const genderSplit = trainees.reduce((acc: any, t: any) => { const g = t.gender || 'Unknown'; acc[g] = (acc[g] || 0) + 1; return acc; }, {});
    const categorySplit = trainees.reduce((acc: any, t: any) => { const c = t.category || 'Unknown'; acc[c] = (acc[c] || 0) + 1; return acc; }, {});
    const districtSplit = trainees.reduce((acc: any, t: any) => { const d = t.district || 'Unknown'; acc[d] = (acc[d] || 0) + 1; return acc; }, {});
    const total = trainees.length || 1;
    return (
      <div>
        <button onClick={onBack} className="mb-4 text-[13px] text-[#ea580c] hover:underline font-semibold">← Back to Dashboard</button>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c] mb-1">Institute Detail</div>
          <h1 className="text-[28px] font-bold text-[#0b3d91] tracking-tight">{name}</h1>
          <div className="w-16 h-1 bg-[#ea580c] rounded-full my-2" />
          <div className="text-[13px] text-[#475569]">
            Code: <strong>{inst.id || id}</strong>
            {inst.district && <> · District: <strong>{inst.district}</strong></>}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
          <KpiCard label="Trained" value={inst.trained ?? '—'} />
          <KpiCard label="Certified" value={inst.certified ?? '—'} />
          <KpiCard label="Placed" value={inst.placed ?? '—'} />
          <KpiCard label="Employed" value={inst.employed ?? '—'} />
          <KpiCard label="Avg Salary" value={inst.avgSalary ?? '—'} />
        </div>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-[14px] font-bold text-[#0b3d91] uppercase tracking-wide mb-4">Student Demographics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-[#64748b] mb-2">Gender</div>
              {Object.entries(genderSplit).map(([k, v]: any) => (
                <div key={k} className="flex justify-between text-[13px] mb-1">
                  <span className="text-[#334155]">{k}</span>
                  <span className="font-mono font-semibold text-[#0b3d91]">{v} ({Math.round((v / total) * 100)}%)</span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-[#64748b] mb-2">Category</div>
              {Object.entries(categorySplit).map(([k, v]: any) => (
                <div key={k} className="flex justify-between text-[13px] mb-1">
                  <span className="text-[#334155]">{k}</span>
                  <span className="font-mono font-semibold text-[#0b3d91]">{v} ({Math.round((v / total) * 100)}%)</span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-[#64748b] mb-2">Districts</div>
              {Object.entries(districtSplit).slice(0, 6).map(([k, v]: any) => (
                <div key={k} className="flex justify-between text-[13px] mb-1">
                  <span className="text-[#334155]">{k}</span>
                  <span className="font-mono font-semibold text-[#0b3d91]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#c7d8e8] rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="bg-[#005a9c] text-white px-4 py-2.5">
            <span className="text-[13px] font-bold uppercase tracking-wider">Enrolled Students ({trainees.length})</span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-[#64748b] text-[13px]">Loading students…</div>
          ) : trainees.length === 0 ? (
            <div className="p-8 text-center text-[#64748b] text-[13px]">No students found for this institute.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-[#ebf4fc] text-[#0b3d91] text-[11px] uppercase tracking-wider border-b border-[#c7d8e8]">
                    <th className="py-2.5 px-3 font-bold">Name</th>
                    <th className="py-2.5 px-3 font-bold">Student ID</th>
                    <th className="py-2.5 px-3 font-bold">Course</th>
                    <th className="py-2.5 px-3 font-bold">Category</th>
                    <th className="py-2.5 px-3 font-bold">Status</th>
                    <th className="py-2.5 px-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trainees.map((t: any, i: number) => (
                    <tr key={t.id || i} onClick={() => onStudentClick(t)} className="border-b border-[#c7d8e8] hover:bg-[#fef9f3] cursor-pointer">
                      <td className="py-2.5 px-3 font-semibold text-[#0b3d91]">{t.name}</td>
                      <td className="py-2.5 px-3 font-mono text-[12px]">{t.id}</td>
                      <td className="py-2.5 px-3">{t.courseName || '—'}</td>
                      <td className="py-2.5 px-3">{t.category || '—'}</td>
                      <td className="py-2.5 px-3">
                        <span className={'text-[10px] font-bold uppercase px-2 py-0.5 rounded ' + (t.employmentStatus === 'placed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}>
                          {t.employmentStatus || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right"><span className="text-[11px] font-bold text-[#ea580c]">View →</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  function StudentDetail({ id, onBack }: { id: string; onBack: () => void }) {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      (async () => {
        try {
          const p = await getTraineeFullProfile(id);
          setProfile(p);
        } catch (err) { console.warn('Profile fetch error:', err); } finally { setLoading(false); }
      })();
    }, [id]);

    if (loading) return (<div><button onClick={onBack} className="mb-4 text-[13px] text-[#ea580c] hover:underline font-semibold">← Back</button><div className="text-center py-16 text-[#64748b]">Loading passport…</div></div>);
    if (!profile || !profile.bio) return (<div><button onClick={onBack} className="mb-4 text-[13px] text-[#ea580c] hover:underline font-semibold">← Back</button><div className="text-center py-16 text-[#64748b]">No data found for this student.</div></div>);

    const bio = profile.bio;
    const comps = profile.competencies || [];
    const certs = profile.microCredentials || [];
    const emp = profile.employment;

    return (
      <div>
        <button onClick={onBack} className="mb-4 text-[13px] text-[#ea580c] hover:underline font-semibold">← Back</button>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {bio.photoUrl ? (
              <img src={bio.photoUrl} alt={bio.name} className="w-24 h-28 object-cover rounded border border-[#c7d8e8]" />
            ) : (
              <div className="w-24 h-28 rounded bg-[#fef9f3] flex items-center justify-center text-[#ea580c] font-bold text-[24px] border border-[#e7d7c0]">
                {(bio.name || '?').slice(0, 1)}
              </div>
            )}
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c] mb-1">Digital Employment Passport (Read-only)</div>
              <h1 className="text-[28px] font-bold text-[#0b3d91] tracking-tight">{bio.name}</h1>
              <div className="w-16 h-1 bg-[#ea580c] rounded-full my-2" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[13px] text-[#334155]">
                <div>Student ID: <strong className="font-mono">{bio.id}</strong></div>
                <div>APAAR: <strong className="font-mono">{bio.apaarId || '—'}</strong></div>
                <div>Institute: <strong>{bio.institution || '—'}</strong></div>
                <div>Course: <strong>{bio.courseName || '—'}</strong></div>
                <div>District: <strong>{bio.districtState || '—'}</strong></div>
                <div>Status: <strong>{bio.status || '—'}</strong></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-[14px] font-bold text-[#0b3d91] uppercase tracking-wide mb-3">Assessed Skills</h2>
          {comps.length === 0 ? <div className="text-[13px] text-[#64748b]">No skills recorded.</div> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comps.map((c: any, i: number) => (
                <div key={i} className="border border-[#c7d8e8] rounded p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[13px] font-semibold text-[#0b3d91]">{c.name}</span>
                    <span className="font-mono text-[13px] font-bold text-[#ea580c]">{c.score}/100</span>
                  </div>
                  <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ea580c]" style={{ width: `${c.score}%` }} />
                  </div>
                  <div className="text-[11px] text-[#64748b] mt-1">{c.level} · {c.examType || 'Verified'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-[14px] font-bold text-[#0b3d91] uppercase tracking-wide mb-3">Certifications</h2>
          {certs.length === 0 ? <div className="text-[13px] text-[#64748b]">No certifications recorded.</div> : (
            <div className="space-y-2">
              {certs.map((c: any, i: number) => (
                <div key={i} className="border border-[#c7d8e8] rounded p-3 flex justify-between items-start gap-3">
                  <div>
                    <div className="text-[13px] font-semibold text-[#0b3d91]">{c.title}</div>
                    <div className="text-[12px] text-[#64748b]">{c.issuingInstitute || 'Institute'} · Issued {c.issueDate || '—'}</div>
                    {c.credentialId && <div className="text-[11px] text-[#94a3b8] font-mono mt-0.5">Credential ID: {c.credentialId}</div>}
                  </div>
                  {c.verified && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 whitespace-nowrap">Verified</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-[14px] font-bold text-[#0b3d91] uppercase tracking-wide mb-3">Employment Record</h2>
          {!emp ? <div className="text-[13px] text-[#64748b]">Not yet placed.</div> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
              <div>Company: <strong>{emp.companyName || '—'}</strong></div>
              <div>Designation: <strong>{emp.designation || '—'}</strong></div>
              <div>Annual CTC: <strong className="font-mono">₹{emp.annualCTC?.toLocaleString() || '—'}</strong></div>
              <div>Hire Date: <strong>{emp.hireDate || '—'}</strong></div>
              <div>Status: <strong>{emp.status || '—'}</strong></div>
              <div>EPFO: <strong>{emp.epfoStatus || '—'}</strong></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function CourseDetail({ id, name, onBack }: { id: string; name: string; onBack: () => void }) {
    const course = courses.find((c: any) => c.id === id) || {};
    return (
      <div>
        <button onClick={onBack} className="mb-4 text-[13px] text-[#ea580c] hover:underline font-semibold">← Back</button>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c] mb-1">Course Detail</div>
          <h1 className="text-[28px] font-bold text-[#0b3d91] tracking-tight">{name}</h1>
          <div className="w-16 h-1 bg-[#ea580c] rounded-full my-2" />
          <div className="text-[13px] text-[#475569]">
            Code: <strong className="font-mono">{course.id || id}</strong>
            {course.duration && <> · Duration: <strong>{course.duration}</strong></>}
            {course.nsqfLevel && <> · NSQF: <strong>Level {course.nsqfLevel}</strong></>}
          </div>
        </div>
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-[14px] font-bold text-[#0b3d91] uppercase tracking-wide mb-3">Skills Taught</h2>
          {Array.isArray(course.skillsTaught) && course.skillsTaught.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {course.skillsTaught.map((s: string, i: number) => (
                <span key={i} className="text-[12px] bg-[#fef9f3] text-[#c2410c] px-3 py-1 rounded-full border border-[#e7d7c0]">{s}</span>
              ))}
            </div>
          ) : <div className="text-[13px] text-[#64748b]">No skill list available.</div>}
        </div>
      </div>
    );
  }

  function ReportsList() {
    const reportTypes = [
      { value: 'institute', label: 'Institute Performance Report' },
      { value: 'district', label: 'District-wise Outcomes Report' },
      { value: 'course', label: 'Course Performance Report' },
      { value: 'employer', label: 'Employer Trust Report' },
      { value: 'skillgap', label: 'Skill Gap Analysis Report' },
      { value: 'state', label: 'State Summary Report' },
    ];

    const currentReport = reportTypes.find(r => r.value === reportType);

    const previewRows = React.useMemo(() => {
      if (reportType === 'institute') {
        let list = [...institutes];
        if (reportInstitute) {
          list = list.filter((i: any) =>
            i.id === reportInstitute ||
            i.instituteId === reportInstitute ||
            i.name === reportInstitute
          );
        }
        if (reportDistrict && reportDistrict !== 'All Districts') {
          list = list.filter((i: any) =>
            (i.district || '').toLowerCase().includes(reportDistrict.toLowerCase())
          );
        }
        return list.slice(0, 5).map((i: any) => {
          const trained = i.trained || 0;
          const placed = i.placed || 0;
          const rate = trained > 0 ? Math.round((placed / trained) * 1000) / 10 : 0;
          return { col1: i.name, col2: String(trained), col3: String(placed), col4: rate + '%' };
        });
      }

      if (reportType === 'district') {
        const byDistrict: Record<string, any> = {};
        institutes.forEach((i: any) => {
          const d = i.district || 'Unknown';
          if (!byDistrict[d]) byDistrict[d] = { district: d, trained: 0, placed: 0, employed: 0 };
          byDistrict[d].trained += i.trained || 0;
          byDistrict[d].placed += i.placed || 0;
          byDistrict[d].employed += i.employed || 0;
        });
        let list = Object.values(byDistrict);
        if (reportDistrict && reportDistrict !== 'All Districts') {
          list = list.filter((d: any) => d.district.toLowerCase().includes(reportDistrict.toLowerCase()));
        }
        return list.slice(0, 5).map((d: any) => {
          const ret = d.placed > 0 ? Math.round((d.employed / d.placed) * 1000) / 10 : 0;
          return { col1: d.district, col2: String(d.trained), col3: String(d.placed), col4: ret + '%' };
        });
      }

      if (reportType === 'course') {
        let list = [...courses];
        if (reportCourse) {
          list = list.filter((c: any) => c.id === reportCourse);
        }
        return list.slice(0, 5).map((c: any) => ({
          col1: c.name || '—',
          col2: c.instituteName || c.institute || '—',
          col3: String(c.students || 0),
          col4: c.placementRate ? c.placementRate + '%' : '—',
        }));
      }

      if (reportType === 'employer') {
        let list = [...mergedEmployers];
        if (reportEmployer) {
          list = list.filter((e: any) => (e.id || e.employerId) === reportEmployer);
        }
        return list.slice(0, 5).map((e: any) => ({
          col1: e.name || e.employerName || '—',
          col2: e.industry || '—',
          col3: String(e.trustScore || 0),
          col4: e.trustGrade || '—',
        }));
      }

      if (reportType === 'skillgap') {
        return skillGaps.slice(0, 5).map((g: any) => ({
          col1: g.skill || '—',
          col2: String(g.studentsAffected || 0),
          col3: String(g.employerReportedGap || 0) + '%',
          col4: g.priority || '—',
        }));
      }

      return [];
    }, [reportType, reportInstitute, reportDistrict, reportCourse, reportEmployer, institutes, courses, mergedEmployers, skillGaps]);

    const previewHeaders = React.useMemo(() => {
      if (reportType === 'institute') return ['Institute Name', 'Trained', 'Placed', 'Placement %'];
      if (reportType === 'district') return ['District', 'Trained', 'Placed', 'Retention %'];
      if (reportType === 'course') return ['Course', 'Institute', 'Trained', 'Placement %'];
      if (reportType === 'employer') return ['Company', 'Industry', 'Trust Score', 'Grade'];
      if (reportType === 'skillgap') return ['Skill', 'Students Affected', 'Gap %', 'Priority'];
      return ['Item', 'Value 1', 'Value 2', 'Value 3'];
    }, [reportType]);

    return (
      <div>
        {/* HEADER */}
        <div className="bg-white border border-[#c7d8e8] rounded-lg p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h1 className="text-[28px] font-bold text-[#0b3d91] mb-1 tracking-tight">Government Reports</h1>
          <div className="w-16 h-1 bg-[#ea580c] rounded-full my-2" />
          <p className="text-[13px] text-[#475569]">
            Generate detailed analytics reports and download them as PDF
          </p>
        </div>

        {/* STEP 1: CHOOSE REPORT TYPE */}
        <div className="bg-white border border-[#c7d8e8] rounded-lg overflow-hidden mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="bg-[#fef9f3] px-4 py-2.5 border-b border-[#e7d7c0] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#ea580c] text-white text-[11px] font-bold flex items-center justify-center">1</span>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#c2410c]">Choose Report Type</span>
          </div>
          <div className="p-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full h-11 px-4 bg-[#f8fafc] border border-[#c7d8e8] rounded text-[14px] text-[#1e293b] font-medium focus:outline-none focus:border-[#ea580c]"
            >
              {reportTypes.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* STEP 2: FILTERS (adaptive) */}
        <div className="bg-white border border-[#c7d8e8] rounded-lg overflow-hidden mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="bg-[#fef9f3] px-4 py-2.5 border-b border-[#e7d7c0] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#ea580c] text-white text-[11px] font-bold flex items-center justify-center">2</span>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#c2410c]">Filter Parameters</span>
            <span className="ml-auto text-[10px] text-[#92400e]">(Optional)</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reportType === 'institute' && (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#0b3d91] uppercase tracking-wide">Institute</label>
                <select
                  value={reportInstitute}
                  onChange={(e) => setReportInstitute(e.target.value)}
                  className="text-[13px] px-2.5 py-2 bg-[#f8fafc] border border-[#c7d8e8] rounded focus:outline-none focus:border-[#ea580c]"
                >
                  <option value="">All Institutes</option>
                  {institutes.map((i: any) => (
                    <option key={i.id} value={i.id || i.instituteId}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {reportType === 'district' && (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#0b3d91] uppercase tracking-wide">District</label>
                <select
                  value={reportDistrict}
                  onChange={(e) => setReportDistrict(e.target.value)}
                  className="text-[13px] px-2.5 py-2 bg-[#f8fafc] border border-[#c7d8e8] rounded focus:outline-none focus:border-[#ea580c]"
                >
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}

            {reportType === 'course' && (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#0b3d91] uppercase tracking-wide">Course</label>
                <select
                  value={reportCourse}
                  onChange={(e) => setReportCourse(e.target.value)}
                  className="text-[13px] px-2.5 py-2 bg-[#f8fafc] border border-[#c7d8e8] rounded focus:outline-none focus:border-[#ea580c]"
                >
                  <option value="">All Courses</option>
                  {courses.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {reportType === 'employer' && (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#0b3d91] uppercase tracking-wide">Employer</label>
                <select
                  value={reportEmployer}
                  onChange={(e) => setReportEmployer(e.target.value)}
                  className="text-[13px] px-2.5 py-2 bg-[#f8fafc] border border-[#c7d8e8] rounded focus:outline-none focus:border-[#ea580c]"
                >
                  <option value="">All Employers</option>
                  {mergedEmployers.map((e: any) => (
                    <option key={e.id || e.employerId} value={e.id || e.employerId}>
                      {e.name || e.employerName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#0b3d91] uppercase tracking-wide">Year</label>
              <select
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                className="text-[13px] px-2.5 py-2 bg-[#f8fafc] border border-[#c7d8e8] rounded focus:outline-none focus:border-[#ea580c]"
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* STEP 3: PREVIEW */}
        <div className="bg-white border border-[#c7d8e8] rounded-lg overflow-hidden mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="bg-[#fef9f3] px-4 py-2.5 border-b border-[#e7d7c0] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#ea580c] text-white text-[11px] font-bold flex items-center justify-center">3</span>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#c2410c]">Preview</span>
            <span className="ml-auto text-[10px] text-[#92400e]">Shows first 5 rows</span>
          </div>
          <div className="p-4">
            {previewRows.length === 0 ? (
              <div className="text-[13px] text-[#64748b] py-6 text-center">
                No preview available for this selection.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr className="bg-[#ebf4fc] text-[#0b3d91] text-[10px] uppercase tracking-wider border-b border-[#c7d8e8]">
                      {previewHeaders.map((header, idx) => (
                        <th key={idx} className="py-2 px-3 font-bold">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row: any, idx: number) => (
                      <tr key={idx} className="border-b border-[#f1f5f9]">
                        <td className="py-2 px-3 text-[#0b3d91] font-semibold">{row.col1}</td>
                        <td className="py-2 px-3 font-mono">{row.col2}</td>
                        <td className="py-2 px-3 font-mono">{row.col3}</td>
                        <td className="py-2 px-3 font-mono">{row.col4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-[11px] text-[#64748b] mt-3 text-right">
                  Total records in full report: {reportType === 'institute' ? institutes.length : reportType === 'course' ? courses.length : reportType === 'employer' ? mergedEmployers.length : reportType === 'skillgap' ? skillGaps.length : 7}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 4: DOWNLOAD BUTTON */}
        <div className="bg-white border border-[#c7d8e8] rounded-lg overflow-hidden mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="bg-[#fef9f3] px-4 py-2.5 border-b border-[#e7d7c0] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#ea580c] text-white text-[11px] font-bold flex items-center justify-center">4</span>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#c2410c]">Generate Report</span>
          </div>
          <div className="p-4">
            <button
              onClick={() => {
                try {
                  if (reportType === 'institute') {
                    const instId = reportInstitute || (institutes[0] && (institutes[0].id || institutes[0].instituteId));
                    if (!instId) {
                      showToast('Please select an institute');
                      return;
                    }
                    generateInstituteReport(instId);
                  } else if (reportType === 'district') {
                    generateDistrictReport(reportDistrict);
                  } else if (reportType === 'state') {
                    generateStateReport();
                  } else if (reportType === 'course') {
                    generateCourseReport(reportCourse);
                  } else if (reportType === 'employer') {
                    generateEmployerReport(reportEmployer);
                  } else if (reportType === 'skillgap') {
                    generateSkillGapReport();
                  } else {
                    showToast('This report type is coming in the next step');
                  }
                } catch (err) {
                  console.error('PDF generation error:', err);
                  showToast('Failed to generate PDF. Check console.');
                }
              }}
              className="w-full py-3.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-[14px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Generate &amp; Download PDF
            </button>
            <p className="text-[11px] text-[#64748b] text-center mt-3">
              Selected: <strong className="text-[#0b3d91]">{currentReport?.label}</strong>
              {reportYear && <> · Year: <strong className="text-[#0b3d91]">{reportYear}</strong></>}
            </p>
          </div>
        </div>

        {/* PRE-MADE STATUTORY REPORTS */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#e7d7c0]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#92400e]">
              Official Statutory Reports
            </span>
            <div className="h-px flex-1 bg-[#e7d7c0]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((r: any, i: number) => (
              <div key={r.id || i} className="bg-white border border-[#c7d8e8] rounded-lg p-5 hover:border-[#ea580c] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#c2410c] mb-1">
                  {r.category || 'Report'}
                </div>
                <h3 className="text-[16px] font-bold text-[#0b3d91] mb-1">{r.title}</h3>
                <div className="text-[11px] font-mono text-[#94a3b8] mb-2">
                  {r.reportCode || ''} · {r.publicationDate || ''}
                </div>
                <p className="text-[12px] text-[#475569] leading-relaxed mb-3">{r.summary || ''}</p>
                <button
                  onClick={() => showToast('Statutory report PDF coming soon')}
                  className="text-[12px] font-bold text-[#ea580c] hover:underline"
                >
                  Download Report →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

function KpiCard({ label, value }: { label: string; value: string | number }) {
  const [displayed, setDisplayed] = React.useState<string | number>(value);

  React.useEffect(() => {
    const str = String(value);
    const isNumeric = /^\d+$/.test(str.replace(/,/g, ''));

    if (!isNumeric) {
      setDisplayed(value);
      return;
    }

    const target = parseInt(str.replace(/,/g, ''), 10);
    let current = 0;
    const steps = 30;
    const increment = target / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current = Math.round(increment * step);
      if (step >= steps) {
        setDisplayed(target);
        clearInterval(interval);
      } else {
        setDisplayed(current);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [value]);

  const isNumericValue = typeof displayed === 'number';
  const formatted = isNumericValue ? displayed.toLocaleString('en-IN') : displayed;

  return (
    <div className="bg-white border border-[#E3E8EF] rounded-xl overflow-hidden transition-all hover:-translate-y-0.5" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.06)' }}>
      <div className="p-5 flex flex-col gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#E8EEF6] flex items-center justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#0B2A4A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="M7 15l4-4 4 4 5-6" />
          </svg>
        </div>
        <div className="text-[11px] uppercase tracking-[0.06em] text-[#6B7A8D] font-semibold leading-tight">{label}</div>
        <div className="text-[28px] font-bold text-[#141C2B] leading-none tracking-[-0.02em]" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatted}
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 85 ? '#15803d' : value >= 70 ? '#ea580c' : '#dc2626';
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[13px] text-[#334155]">{label}</span>
        <span className="font-mono font-semibold text-[13px]" style={{ color }}>{value}</span>
      </div>
      <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default GovernmentView;
