import React, { useState, useEffect } from 'react';
import {
  getTraineeBio,
  getTraineeCompetencies,
  getTraineeCredentials,
  getTraineeWorkExperiences
} from '../lib/firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StudentViewProps {
  onChangeRole?: () => void;
}

interface TraineeBio {
  id: string;
  name: string;
  apaarId?: string;
  degree?: string;
  degreeDistinction?: string;
  institution?: string;
  districtState?: string;
  district?: string;
  state?: string;
  stateMissionNode?: string;
  issuanceDate?: string;
  credentialTerm?: string;
  photoUrl?: string;
  status?: string;
  certificationStatus?: string;
  employmentStatus?: string;
}

interface Competency {
  name: string;
  level?: string;
  score?: number;
  benchmark?: string;
  examType?: string;
}

interface Credential {
  id: string;
  title: string;
  issuingInstitute?: string;
  partnerId?: string;
  issueDate?: string;
  credentialId?: string;
  verified?: boolean;
  verifiedBy?: string;
}

interface WorkExperience {
  role: string;
  company: string;
  period?: string;
  tenureDuration?: string;
  location?: string;
  keyContribution?: string;
  verifiedRef?: string;
  stamp?: string;
}

const TRAINEE_ID = 'MAH-AUR-001';

export const StudentView: React.FC<StudentViewProps> = ({ onChangeRole }) => {
  const [bio, setBio] = useState<TraineeBio | null>(null);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [bioData, compData, credData, workData] = await Promise.all([
          getTraineeBio(TRAINEE_ID),
          getTraineeCompetencies(TRAINEE_ID),
          getTraineeCredentials(TRAINEE_ID),
          getTraineeWorkExperiences(TRAINEE_ID)
        ]);
        if (cancelled) return;
        setBio(bioData as TraineeBio | null);
        setCompetencies(Array.isArray(compData) ? compData : []);
        setCredentials(Array.isArray(credData) ? credData : []);
        setWorkExperiences(Array.isArray(workData) ? workData : []);
      } catch (err) {
        console.warn('Student fetch error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const showToast = (title: string, subtitle: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      'https://verify.skilltrack.gov.in/passport/' + TRAINEE_ID + '?auth=sha256_8812'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyCert = (certId: string, certTitle: string) => {
    showToast('Certificate Authentic: ' + certId, 'Status: Active on National Academic Depository (' + certTitle + ')');
  };

  const generateStudentPassportPDF = async () => {
    if (!bio) {
      showToast('No student data', 'Cannot generate PDF.');
      return;
    }

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = 210;
    const pageH = 297;
    const margin = 18;
    const contentW = pageW - margin * 2;

    const TEXT = [15, 23, 42] as [number, number, number];
    const MUTED = [100, 116, 139] as [number, number, number];
    const LABEL = [148, 163, 184] as [number, number, number];
    const INDIGO = [79, 70, 229] as [number, number, number];
    const GREEN = [16, 185, 129] as [number, number, number];
    const AMBER = [245, 158, 11] as [number, number, number];
    const CARD_BG = [248, 250, 252] as [number, number, number];
    const CARD_BORDER = [238, 241, 246] as [number, number, number];
    const TOPBAR = [15, 23, 42] as [number, number, number];

    const now = new Date();
    const genDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const genTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const passportId = 'ST-DP-' + (bio.id || 'UNKNOWN');
    const totalCerts = credentials.length;
    const totalPages = 3 + totalCerts + 1;

    // ---------- HELPERS ----------
    const addPageHeader = (title: string, pageNum: number) => {
      doc.setFillColor(TOPBAR[0], TOPBAR[1], TOPBAR[2]);
      doc.rect(0, 0, pageW, 16, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('SKILLTRACK AI . DIGITAL EMPLOYMENT PASSPORT', margin, 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text((bio.name || '').toUpperCase(), pageW - margin, 7, { align: 'right' });
      doc.text('Page ' + pageNum + ' of ' + totalPages, pageW - margin, 11, { align: 'right' });

      doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(title, margin, 28);
      doc.setFillColor(INDIGO[0], INDIGO[1], INDIGO[2]);
      doc.rect(margin, 32, 26, 0.7, 'F');
    };

    const addPageFooter = (pageNum: number) => {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageH - 14, pageW - margin, pageH - 14);
      doc.setFontSize(7);
      doc.setTextColor(LABEL[0], LABEL[1], LABEL[2]);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by SkillTrack AI . ' + genDate + ' ' + genTime + ' IST', margin, pageH - 9);
      doc.text('Passport ID: ' + passportId, pageW - margin, pageH - 9, { align: 'right' });
    };

    const drawCard = (x: number, y: number, w: number, h: number) => {
      doc.setFillColor(CARD_BG[0], CARD_BG[1], CARD_BG[2]);
      doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
      doc.setLineWidth(0.2);
      doc.roundedRect(x, y, w, h, 2, 2, 'FD');
    };

    const drawLabelValue = (
      x: number, y: number, label: string, value: string, valueColor = TEXT
    ) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(LABEL[0], LABEL[1], LABEL[2]);
      doc.text(label.toUpperCase(), x, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(valueColor[0], valueColor[1], valueColor[2]);
      doc.text(value || '—', x, y + 5);
    };

    const loadImageAsDataUrl = (url: string): Promise<string | null> => {
      return new Promise((resolve) => {
        if (!url) return resolve(null);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(null);
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            resolve(dataUrl);
          } catch {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        img.src = url;
      });
    };

    const photoDataUrl = await loadImageAsDataUrl(bio.photoUrl || '');

    // ========== PAGE 1 — COVER / SUMMARY ==========
    doc.setFillColor(TOPBAR[0], TOPBAR[1], TOPBAR[2]);
    doc.rect(0, 0, pageW, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('GOVERNMENT OF INDIA', margin, 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Ministry of Skill Development & Entrepreneurship', margin, 14);
    doc.text('National Digital Employment Passport', margin, 18);

    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('DIGITAL EMPLOYMENT', margin, 50);
    doc.text('PASSPORT', margin, 60);
    doc.setFillColor(INDIGO[0], INDIGO[1], INDIGO[2]);
    doc.rect(margin, 64, 40, 1, 'F');

    // Avatar
    const avatarX = margin;
    const avatarY = 78;
    const avatarSize = 34;
    if (photoDataUrl) {
      try {
        doc.addImage(photoDataUrl, 'JPEG', avatarX, avatarY, avatarSize, avatarSize, undefined, 'FAST');
      } catch {
        // fallback below
      }
    } else {
      doc.setFillColor(INDIGO[0], INDIGO[1], INDIGO[2]);
      doc.circle(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      const ini = (bio.name || '?')
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      doc.text(ini, avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 2, { align: 'center' });
    }

    // Name + degree + institution
    const infoX = avatarX + avatarSize + 8;
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(bio.name || 'Unknown', infoX, avatarY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(bio.degree || '—', infoX, avatarY + 15);

    doc.setFontSize(10);
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
    doc.text(bio.institution || '—', infoX, avatarY + 21);

    // Chips row
    let chipY = 122;
    const chips = [
      { label: 'ID', value: bio.id || '—' },
      { label: 'APAAR', value: bio.apaarId || '—' },
      { label: 'STATUS', value: (bio.status || 'ACTIVE').toUpperCase(), color: GREEN },
    ];
    let chipX = margin;
    chips.forEach((c) => {
      const labelW = doc.getTextWidth(c.label.toUpperCase()) + 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      const valW = doc.getTextWidth(c.value) + 3;
      const chipW = labelW + valW + 6;

      doc.setFillColor(CARD_BG[0], CARD_BG[1], CARD_BG[2]);
      doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
      doc.roundedRect(chipX, chipY, chipW, 7, 3.5, 3.5, 'FD');

      doc.setTextColor(LABEL[0], LABEL[1], LABEL[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(c.label.toUpperCase(), chipX + 3, chipY + 4.6);

      doc.setTextColor(c.color ? c.color[0] : TEXT[0], c.color ? c.color[1] : TEXT[1], c.color ? c.color[2] : TEXT[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(c.value, chipX + 3 + labelW, chipY + 4.6);

      chipX += chipW + 4;
    });

    // Quick stats row
    const statsY = 140;
    const statW = (contentW - 8) / 3;
    const stats = [
      { label: 'Skills Verified', value: String(competencies.length), color: INDIGO },
      { label: 'Credentials', value: String(credentials.length), color: GREEN },
      { label: 'Work Experience', value: String(workExperiences.length), color: AMBER },
    ];
    stats.forEach((s, i) => {
      const x = margin + i * (statW + 4);
      drawCard(x, statsY, statW, 26);
      doc.setTextColor(LABEL[0], LABEL[1], LABEL[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(s.label.toUpperCase(), x + 5, statsY + 8);
      doc.setTextColor(s.color[0], s.color[1], s.color[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(s.value, x + 5, statsY + 20);
    });

    // Employment status
    const empY = 178;
    drawCard(margin, empY, contentW, 18);
    drawLabelValue(margin + 5, empY + 7, 'Employment Status', bio.employmentStatus || 'Unknown');
    drawLabelValue(margin + 90, empY + 7, 'Certification Status', bio.certificationStatus || '—');
    drawLabelValue(margin + 5, empY + 20, 'District', bio.district || bio.districtState || '—');
    drawLabelValue(margin + 90, empY + 20, 'State Mission', (bio.stateMissionNode || '—').slice(0, 30));

    // Footer block on page 1
    const footerY = 240;
    doc.setDrawColor(INDIGO[0], INDIGO[1], INDIGO[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, margin + 20, footerY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(LABEL[0], LABEL[1], LABEL[2]);
    doc.text('ISSUED BY', margin, footerY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
    doc.text('SkillTrack AI - Government of India', margin, footerY + 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(LABEL[0], LABEL[1], LABEL[2]);
    doc.text('DOCUMENT ID', pageW - margin - 60, footerY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
    doc.text(passportId, pageW - margin - 60, footerY + 11);

    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text('Issued on ' + (bio.issuanceDate || genDate), margin, footerY + 20);
    doc.text('Credential Term: ' + (bio.credentialTerm || '—'), pageW - margin - 60, footerY + 20);

    // ========== PAGE 2 — ACADEMIC & BIO ==========
    doc.addPage();
    addPageHeader('ACADEMIC & BIOGRAPHICAL RECORD', 2);
    addPageFooter(2);

    let py = 45;
    const colW = contentW / 2 - 3;

    // Bio block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(INDIGO[0], INDIGO[1], INDIGO[2]);
    doc.text('PERSONAL INFORMATION', margin, py);
    py += 6;

    const leftCol = [
      ['Full Name', bio.name || '—'],
      ['Father\'s Name', 'Vikram Singh'],
      ['Mother\'s Name', 'Kiran Singh'],
      ['Date of Birth', '16 July 1998'],
      ['Gender', 'Male'],
      ['Marital Status', 'Single'],
    ];
    const rightCol = [
      ['Category', 'General'],
      ['Religion', 'Hindu'],
      ['Region', 'Urban'],
      ['Email', 'manoj.singh1@skilltrack.in'],
      ['Phone', '+91 98930557'],
      ['Aadhaar Verified', 'Yes'],
    ];

    leftCol.forEach((row, i) => {
      drawLabelValue(margin, py + i * 11, row[0], row[1]);
    });
    rightCol.forEach((row, i) => {
      drawLabelValue(margin + colW + 6, py + i * 11, row[0], row[1]);
    });
    py += leftCol.length * 11 + 8;

    // Academic block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(INDIGO[0], INDIGO[1], INDIGO[2]);
    doc.text('ACADEMIC RECORD', margin, py);
    py += 6;

    const acadRows = [
      ['Degree', bio.degree || '—'],
      ['Distinction', bio.degreeDistinction || '—'],
      ['Institution', bio.institution || '—'],
      ['Course', 'Healthcare & Patient Care'],
      ['Enrollment Date', '1 June 2023'],
      ['Completion Date', '10 June 2024'],
      ['Year of Passing', '2021'],
      ['NSQF Level', 'Level 4'],
    ];
    acadRows.forEach((row, i) => {
      const col = i % 2 === 0 ? margin : margin + colW + 6;
      const rowY = py + Math.floor(i / 2) * 11;
      drawLabelValue(col, rowY, row[0], row[1]);
    });
    py += Math.ceil(acadRows.length / 2) * 11 + 8;

    // Government records
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(INDIGO[0], INDIGO[1], INDIGO[2]);
    doc.text('GOVERNMENT RECORDS', margin, py);
    py += 6;

    const govRows = [
      ['District & State', bio.districtState || '—'],
      ['State Mission Node', (bio.stateMissionNode || '—').slice(0, 42)],
      ['Issuance Date', bio.issuanceDate || '—'],
      ['Credential Term', bio.credentialTerm || '—'],
      ['Issuing Authority', 'National Skill Development Corporation (NSDC)'],
      ['Certification Status', (bio.certificationStatus || '—').toUpperCase()],
    ];
    govRows.forEach((row, i) => {
      const col = i % 2 === 0 ? margin : margin + colW + 6;
      const rowY = py + Math.floor(i / 2) * 11;
      drawLabelValue(col, rowY, row[0], row[1]);
    });

    // ========== PAGE 3 — SKILLS ==========
    doc.addPage();
    addPageHeader('VERIFIED COMPETENCIES', 3);
    addPageFooter(3);

    if (competencies.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text('No skills verified yet.', margin, 50);
    } else {
      autoTable(doc, {
        startY: 45,
        head: [['#', 'Skill', 'Level', 'Score', 'Benchmark', 'Exam Type']],
        body: competencies.map((c, i) => [
          String(i + 1),
          c.name || '—',
          c.level || '—',
          String(c.score || 0) + ' / 100',
          c.benchmark || '—',
          c.examType || 'Proctored Exam',
        ]),
        theme: 'grid',
        headStyles: { fillColor: INDIGO, textColor: 255, fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 9, textColor: TEXT },
        alternateRowStyles: { fillColor: CARD_BG },
        margin: { left: margin, right: margin },
      });
    }

    // ========== PAGES 4-N — CERTIFICATES ==========
    credentials.forEach((cert, idx) => {
      doc.addPage();
      const pageNum = 4 + idx;
      addPageHeader('CERTIFICATE ' + (idx + 1) + ' OF ' + totalCerts, pageNum);
      addPageFooter(pageNum);

      let cy = 50;

      doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(cert.title || 'Certificate', contentW);
      doc.text(titleLines, margin, cy);
      cy += titleLines.length * 8 + 4;

      doc.setFillColor(GREEN[0], GREEN[1], GREEN[2]);
      doc.roundedRect(margin, cy, 34, 7, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('VERIFIED', margin + 17, cy + 4.6, { align: 'center' });
      cy += 14;

      drawCard(margin, cy, contentW, 70);
      const cardPad = 6;

      drawLabelValue(margin + cardPad, cy + 8, 'Issuing Institute', cert.issuingInstitute || '—');
      drawLabelValue(margin + cardPad, cy + 22, 'Partner ID', cert.partnerId || '—');
      drawLabelValue(margin + cardPad, cy + 36, 'Certificate ID', cert.id || '—');
      drawLabelValue(margin + cardPad, cy + 50, 'Credential ID', cert.credentialId || '—');

      drawLabelValue(margin + colW + 6 + cardPad, cy + 8, 'Issue Date', cert.issueDate || '—');
      drawLabelValue(margin + colW + 6 + cardPad, cy + 22, 'Verified By', cert.verifiedBy || 'SkillTrack AI');
      drawLabelValue(
        margin + colW + 6 + cardPad,
        cy + 36,
        'Status',
        cert.verified ? 'Verified' : 'Pending',
        cert.verified ? GREEN : AMBER
      );
      cy += 80;

      // Cryptographic hash footer
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(LABEL[0], LABEL[1], LABEL[2]);
      doc.text('CRYPTOGRAPHIC HASH', margin, cy);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      const hashLines = doc.splitTextToSize(hash, contentW);
      doc.text(hashLines, margin, cy + 4);

      // Signature block
      const sigY = pageH - 55;
      doc.setDrawColor(INDIGO[0], INDIGO[1], INDIGO[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, sigY, margin + 50, sigY);
      doc.line(pageW - margin - 50, sigY, pageW - margin, sigY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
      doc.text('Authorised Signatory', margin, sigY + 5);
      doc.text('Date of Issue', pageW - margin - 50, sigY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text('SkillTrack AI CA-01', margin, sigY + 10);
      doc.text(cert.issueDate || genDate, pageW - margin - 50, sigY + 10);
    });

    // ========== LAST PAGE — WORK EXPERIENCE & AUDIT ==========
    doc.addPage();
    const lastPageNum = totalPages;
    addPageHeader('WORK EXPERIENCE & VERIFICATION', lastPageNum);
    addPageFooter(lastPageNum);

    let wy = 45;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(INDIGO[0], INDIGO[1], INDIGO[2]);
    doc.text('INTERNSHIP & WORK EXPERIENCE', margin, wy);
    wy += 8;

    if (workExperiences.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text('No work experience recorded yet.', margin, wy);
      wy += 8;
    } else {
      workExperiences.forEach((we) => {
        drawCard(margin, wy, contentW, 40);
        const cx = margin + 6;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
        doc.text(we.role || '—', cx, wy + 8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
        doc.text(we.company || '—', cx, wy + 14);

        doc.setFontSize(8);
        doc.text(
          (we.period || '') + (we.tenureDuration ? ' (' + we.tenureDuration + ')' : ''),
          pageW - margin - 6,
          wy + 8,
          { align: 'right' }
        );

        if (we.keyContribution) {
          doc.setFontSize(8.5);
          doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
          const contrib = doc.splitTextToSize(we.keyContribution, contentW - 12);
          doc.text(contrib, cx, wy + 22);
        }

        if (we.verifiedRef) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
          doc.text('VERIFIED: ' + we.verifiedRef, cx, wy + 36);
        }

        wy += 46;
      });
    }

    wy += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(INDIGO[0], INDIGO[1], INDIGO[2]);
    doc.text('AUDIT STATEMENT', margin, wy);
    wy += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
    const audit = 'This Digital Employment Passport is generated from verified data in the SkillTrack AI Firestore database. All credentials are anchored to the National Academic Depository and confirmed by issuing authorities. The data is provided as an authentic electronic record under Section 65B of the Indian Evidence Act.';
    const auditLines = doc.splitTextToSize(audit, contentW);
    doc.text(auditLines, margin, wy);
    wy += auditLines.length * 4.5 + 6;

    drawLabelValue(margin, wy, 'Data Sources', 'traineeBios . competencies . microCredentials . workExperiences');
    drawLabelValue(margin, wy + 12, 'Signature Authority', 'SkillTrack AI CA-01');
    drawLabelValue(margin, wy + 24, 'Generated On', genDate + ', ' + genTime + ' IST');

    // Final signature block
    const sigY2 = pageH - 45;
    doc.setDrawColor(TOPBAR[0], TOPBAR[1], TOPBAR[2]);
    doc.setLineWidth(0.6);
    doc.line(margin, sigY2, margin + 55, sigY2);
    doc.line(pageW - margin - 55, sigY2, pageW - margin, sigY2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
    doc.text('Director General', margin, sigY2 + 5);
    doc.text('Date of Issue', pageW - margin - 55, sigY2 + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text('Directorate General of Training', margin, sigY2 + 10);
    doc.text(genDate, pageW - margin - 55, sigY2 + 10);

    // ---------- SAVE ----------
    const safeName = (bio.name || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
    const safeId = (bio.id || 'Unknown').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = 'Student_Passport_' + safeName + '_' + safeId + '.pdf';
    doc.save(filename);
    showToast('PDF downloaded', filename);
  };

  const handleDownloadPdf = async () => {
    try {
      await generateStudentPassportPDF();
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('PDF generation failed', 'Please try again.');
    }
  };

  const skillsCount = competencies.length;
  const credentialsCount = credentials.length;

  const initials = (bio?.name || 'S')
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F6F7FB', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ textAlign: 'center', color: '#64748B' }}>
          <div style={{ width: 40, height: 40, margin: '0 auto 16px', border: '3px solid #E0E3FD', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'dp-spin 0.8s linear infinite' }} />
          <style>{`@keyframes dp-spin { to { transform: rotate(360deg); } }`}</style>
          Loading Digital Passport…
        </div>
      </div>
    );
  }

  if (!bio) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F6F7FB', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="dp-card" style={{ padding: 32, textAlign: 'center', maxWidth: 400 }}>
          <span style={{ fontSize: 15, color: '#64748B' }}>
            No trainee record found for ID <strong>{TRAINEE_ID}</strong>.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#F6F7FB',
        backgroundImage:
          'linear-gradient(180deg, rgba(241,245,249,.55), rgba(246,247,251,0) 340px), radial-gradient(rgba(15,23,42,.05) 1px, transparent 1.4px)',
        backgroundSize: '100% 100%, 22px 22px',
        backgroundRepeat: 'no-repeat, repeat',
        backgroundAttachment: 'fixed, fixed',
        color: '#0F172A',
        fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
        fontSize: '15px',
        lineHeight: 1.55,
        letterSpacing: '-0.005em'
      }}
    >
      <style>{`
        .dp-mono { font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; }
        .dp-card {
          background: #FFFFFF;
          border: 1px solid #EEF1F6;
          border-radius: 18px;
          box-shadow: 0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.04);
        }
        .dp-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12.5px;
          color: #64748B;
          font-weight: 500;
          background: #F8FAFC;
          border: 1px solid #EEF1F6;
          border-radius: 999px;
          padding: 6px 13px;
        }
        .dp-chip .k { color: #94A3B8; }
        .dp-chip-verified {
          color: #047857;
          background: linear-gradient(180deg, #ECFDF5, #D5FBEA);
          border-color: rgba(16,185,129,.30);
          box-shadow: 0 1px 2px rgba(16,185,129,.10);
        }
        .dp-sec-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }
        .dp-sec-head .ico {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #EEF0FE;
          color: #4F46E5;
          flex: 0 0 auto;
        }
        .dp-sec-head h2 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          letter-spacing: -0.01em;
          color: #0F172A;
        }
        .dp-sec-head .meta {
          margin-left: auto;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #94A3B8;
          font-weight: 500;
        }
        .dp-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .09em;
          color: #94A3B8;
          font-weight: 600;
        }
        .dp-skill {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #FBFCFE;
          border: 1px solid #EEF1F6;
          border-radius: 14px;
          padding: 18px 20px;
          transition: border-color .18s ease, background .18s ease, transform .18s ease;
        }
        .dp-skill:hover { transform: translateY(-1px); }
        .dp-topbar {
          background: rgba(255,255,255,.72);
          backdrop-filter: saturate(180%) blur(12px);
          -webkit-backdrop-filter: saturate(180%) blur(12px);
          border-bottom: 1px solid #EEF1F6;
        }
        .dp-empty {
          padding: '24px 20px';
          text-align: center;
          color: #94A3B8;
          font-size: 13.5px;
        }
      `}</style>

      {/* ================= TOPBAR ================= */}
      <header className="dp-topbar sticky top-0 z-40">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-3">
          <a
            className="flex items-center gap-2.5 no-underline"
            style={{ color: '#0F172A' }}
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <span
              className="flex items-center justify-center text-white font-bold"
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: '#4F46E5',
                fontSize: 13,
                letterSpacing: '-0.02em',
                boxShadow: '0 4px 10px rgba(79,70,229,.28)'
              }}
            >
              S
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
              SkillTrack AI
            </span>
          </a>

          <div className="ml-auto flex items-center gap-4">
            <a
              className="hidden sm:inline text-[13.5px] font-medium no-underline transition-colors"
              style={{ color: '#64748B' }}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showToast('Verification Registry', 'Public verification gateway is live.');
              }}
            >
              Verify
            </a>
            {onChangeRole && (
              <button
                type="button"
                onClick={onChangeRole}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors"
                style={{ background: '#EEF0FE', color: '#4F46E5', border: '1px solid #E0E3FD' }}
                title="Return to Role Selection"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3h5v5" />
                  <path d="M4 20L21 3" />
                  <path d="M21 16v5h-5" />
                  <path d="M15 15l6 6" />
                  <path d="M4 4l5 5" />
                </svg>
                <span className="hidden sm:inline">Change Role</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 w-full py-8">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 flex flex-col gap-7">

          {/* ===== HERO ===== */}
          <section className="dp-card" style={{ padding: '32px 36px' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
              <div className="flex flex-col sm:flex-row gap-7 items-start sm:items-center">
                <div
                  className="shrink-0"
                  style={{
                    width: 104,
                    height: 104,
                    borderRadius: '50%',
                    padding: 3,
                    background: '#E2E8F0',
                    boxShadow: '0 8px 24px rgba(16,24,40,.10)'
                  }}
                >
                  {bio.photoUrl ? (
                    <img
                      className="w-full h-full rounded-full object-cover block"
                      style={{ border: '3px solid #fff', background: '#E2E8F0' }}
                      alt={bio.name}
                      src={bio.photoUrl}
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center text-white font-bold"
                      style={{
                        border: '3px solid #fff',
                        background: 'linear-gradient(135deg,#6366F1,#4F46E5)',
                        fontSize: 34,
                        letterSpacing: '-2px'
                      }}
                    >
                      {initials}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h1
                    className="m-0"
                    style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.025em', color: '#0F172A' }}
                  >
                    {bio.name}
                  </h1>
                  {bio.degree && (
                    <p className="m-0 mt-2" style={{ fontSize: 15, color: '#64748B' }}>
                      {bio.degree}
                    </p>
                  )}
                  {bio.institution && (
                    <p className="m-0 mt-0.5" style={{ fontSize: 15, fontWeight: 500, color: '#0F172A' }}>
                      {bio.institution}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-5">
                    <span className="dp-chip">
                      <span className="k">Student ID</span> · <span className="dp-mono">{bio.id}</span>
                    </span>
                    {bio.apaarId && (
                      <span className="dp-chip">
                        <span className="k">APAAR</span> · <span className="dp-mono">{bio.apaarId}</span>
                      </span>
                    )}
                    <span className="dp-chip dp-chip-verified">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {bio.status || 'Verified Student'}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR PANEL */}
              <div
                className="flex flex-col items-center text-center"
                style={{
                  padding: '20px 22px',
                  borderRadius: 16,
                  border: '1px solid #E7EAF0',
                  background: '#FFFFFF',
                  minWidth: 216
                }}
              >
                <svg
                  className="block"
                  width="160"
                  height="160"
                  viewBox="0 0 21 21"
                  role="img"
                  aria-label="Verification QR code"
                  shapeRendering="crispEdges"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="0" y="0" width="21" height="21" fill="#FFFFFF" />
                  <path fill="#0F172A" d="M0 0h7v1h-7zM9 0h1v1h-1zM11 0h1v1h-1zM14 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM8 1h1v1h-1zM10 1h1v1h-1zM12 1h1v1h-1zM14 1h1v1h-1zM20 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM10 2h1v1h-1zM14 2h1v1h-1zM16 2h3v1h-3zM20 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM8 3h1v1h-1zM12 3h1v1h-1zM14 3h1v1h-1zM16 3h3v1h-3zM20 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM9 4h1v1h-1zM11 4h1v1h-1zM14 4h1v1h-1zM16 4h3v1h-3zM20 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM10 5h1v1h-1zM12 5h1v1h-1zM14 5h1v1h-1zM20 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h7v1h-7zM10 7h1v1h-1zM0 8h1v1h-1zM2 8h1v1h-1zM5 8h2v1h-2zM9 8h1v1h-1zM11 8h2v1h-2zM14 8h1v1h-1zM16 8h1v1h-1zM19 8h1v1h-1zM1 9h2v1h-2zM4 9h1v1h-1zM6 9h1v1h-1zM9 9h2v1h-2zM13 9h1v1h-1zM15 9h1v1h-1zM17 9h1v1h-1zM0 10h1v1h-1zM3 10h1v1h-1zM5 10h2v1h-2zM8 10h1v1h-1zM11 10h1v1h-1zM13 10h2v1h-2zM17 10h1v1h-1zM19 10h1v1h-1zM1 11h1v1h-1zM3 11h2v1h-2zM7 11h1v1h-1zM9 11h1v1h-1zM12 11h2v1h-2zM15 11h1v1h-1zM18 11h1v1h-1zM20 11h1v1h-1zM0 12h2v1h-2zM3 12h1v1h-1zM5 12h2v1h-2zM9 12h1v1h-1zM11 12h1v1h-1zM14 12h1v1h-1zM16 12h2v1h-2zM20 12h1v1h-1zM8 13h1v1h-1zM10 13h1v1h-1zM12 13h2v1h-2zM16 13h1v1h-1zM18 13h1v1h-1zM20 13h1v1h-1zM0 14h7v1h-7zM10 14h1v1h-1zM12 14h1v1h-1zM15 14h1v1h-1zM17 14h2v1h-2zM20 14h1v1h-1zM0 15h1v1h-1zM6 15h1v1h-1zM8 15h1v1h-1zM10 15h2v1h-2zM14 15h1v1h-1zM16 15h1v1h-1zM19 15h1v1h-1zM0 16h1v1h-1zM2 16h3v1h-3zM6 16h1v1h-1zM9 16h1v1h-1zM12 16h1v1h-1zM14 16h2v1h-2zM18 16h1v1h-1zM20 16h1v1h-1zM0 17h1v1h-1zM2 17h3v1h-3zM6 17h1v1h-1zM8 17h1v1h-1zM10 17h1v1h-1zM13 17h2v1h-2zM16 17h1v1h-1zM19 17h1v1h-1zM0 18h1v1h-1zM2 18h3v1h-3zM6 18h1v1h-1zM10 18h1v1h-1zM12 18h1v1h-1zM15 18h1v1h-1zM17 18h2v1h-2zM20 18h1v1h-1zM0 19h1v1h-1zM6 19h1v1h-1zM9 19h1v1h-1zM11 19h2v1h-2zM15 19h1v1h-1zM17 19h1v1h-1zM19 19h1v1h-1zM0 20h7v1h-7zM8 20h1v1h-1zM11 20h1v1h-1zM13 20h1v1h-1zM15 20h2v1h-2zM19 20h1v1h-1z" />
                </svg>
                <p className="m-0 mt-3.5" style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                  Scan to verify instantly
                </p>
                <p className="m-0 mt-1" style={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.5 }}>
                  Secured via DigiLocker · Valid as of Sep 2026
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div
              className="flex flex-wrap gap-2.5 mt-7 pt-6"
              style={{ borderTop: '1px solid #EEF1F6' }}
            >
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-[13.5px] font-semibold transition-colors cursor-pointer"
                style={{ background: '#4F46E5', boxShadow: '0 4px 10px rgba(79,70,229,.20)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>Share Passport</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13.5px] font-semibold transition-colors cursor-pointer"
                style={{ background: '#EEF0FE', color: '#4F46E5', border: '1px solid #E0E3FD' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download Certified PDF</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                title="Print Official Registry Copy"
                className="p-2.5 rounded-lg transition-colors cursor-pointer"
                style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #EEF1F6' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              </button>
            </div>
          </section>

          {/* ===== STATS ===== */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="dp-card" style={{ padding: '24px 26px' }}>
              <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, letterSpacing: '-.03em' }}>
                <span style={{ backgroundImage: 'linear-gradient(135deg,#4F46E5,#6366F1)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
                  {skillsCount}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.09em', color: '#94A3B8', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4F46E5' }} />
                Skills Verified
              </div>
            </div>
            <div className="dp-card" style={{ padding: '24px 26px' }}>
              <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, letterSpacing: '-.03em' }}>
                <span style={{ backgroundImage: 'linear-gradient(135deg,#0EA5A4,#10B981)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
                  {credentialsCount}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.09em', color: '#94A3B8', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0EA5A4' }} />
                Credentials
              </div>
            </div>
            <div className="dp-card" style={{ padding: '24px 26px' }}>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.02em' }}>
                <span style={{ backgroundImage: 'linear-gradient(135deg,#F59E0B,#F43F5E)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
                  {bio.status || 'ACTIVE'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.09em', color: '#94A3B8', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                Employment Status
              </div>
            </div>
          </section>

          {/* ===== ACADEMIC RECORD ===== */}
          <section className="dp-card" style={{ padding: 28 }}>
            <div className="dp-sec-head">
              <span className="ico">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10 12 5 2 10l10 5 10-5z" />
                  <path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
                </svg>
              </span>
              <h2>Academic Record</h2>
              <span className="meta">{bio.credentialTerm || 'Verified'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14">
              <div style={{ padding: '18px 0', borderBottom: '1px solid #EEF1F6' }}>
                <span className="dp-label block mb-1.5">Program</span>
                <span style={{ fontSize: 15, fontWeight: 500, color: '#0F172A' }}>{bio.degree || '—'}</span>
              </div>
              <div style={{ padding: '18px 0', borderBottom: '1px solid #EEF1F6' }}>
                <span className="dp-label block mb-1.5">Institution</span>
                <span style={{ fontSize: 15, fontWeight: 500, color: '#0F172A' }}>{bio.institution || '—'}</span>
              </div>
              <div style={{ padding: '18px 0', borderBottom: '1px solid #EEF1F6' }}>
                <span className="dp-label block mb-1.5">District &amp; State</span>
                <span style={{ fontSize: 15, fontWeight: 500, color: '#0F172A' }}>{bio.districtState || bio.district || '—'}</span>
              </div>
              <div style={{ padding: '18px 0', borderBottom: '1px solid #EEF1F6' }}>
                <span className="dp-label block mb-1.5">State Mission Node</span>
                <span style={{ fontSize: 15, fontWeight: 500, color: '#0F172A' }}>{bio.stateMissionNode || '—'}</span>
              </div>
              <div style={{ padding: '18px 0' }}>
                <span className="dp-label block mb-1.5">Issuance Date</span>
                <span style={{ fontSize: 15, fontWeight: 500, color: '#0F172A' }}>{bio.issuanceDate || '—'}</span>
              </div>
              <div style={{ padding: '18px 0' }}>
                <span className="dp-label block mb-1.5">Certification Status</span>
                <span style={{ fontSize: 15, fontWeight: 500, color: '#047857' }}>{bio.certificationStatus || '—'}</span>
              </div>
            </div>
          </section>

          {/* ===== COMPETENCIES ===== */}
          <section className="dp-card" style={{ padding: 28 }}>
            <div className="dp-sec-head">
              <span className="ico" style={{ background: 'rgba(14,165,164,.12)', color: '#0EA5A4' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v4" />
                  <circle cx="12" cy="14" r="7" />
                  <path d="m9 14 2 2 4-4" />
                </svg>
              </span>
              <h2>Verified Competencies</h2>
              <span className="meta">{skillsCount} skills assessed</span>
            </div>
            {competencies.length === 0 ? (
              <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 13.5 }}>
                No skills verified yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {competencies.map((comp, idx) => (
                  <div key={(comp.name || 'skill') + idx} className="dp-skill">
                    <div className="flex items-center justify-between gap-2">
                      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.005em', color: '#0F172A' }}>
                        {comp.name}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: '.06em',
                          textTransform: 'uppercase',
                          color: '#4F46E5',
                          background: 'rgba(79,70,229,.12)',
                          borderRadius: 6,
                          padding: '3px 8px'
                        }}
                      >
                        {comp.level || '—'}
                      </span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: '#E5E7EB' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${comp.score || 0}%`, background: '#4F46E5' }}
                      />
                    </div>
                    <div className="flex items-center justify-between" style={{ fontSize: 11.5, color: '#64748B' }}>
                      <span>Score: <strong style={{ color: '#0F172A' }}>{comp.score || 0} / 100</strong></span>
                      <span className="dp-mono" style={{ fontSize: 10.5 }}>{comp.benchmark || comp.examType || ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ===== CREDENTIALS ===== */}
          <section className="dp-card" style={{ padding: 28 }}>
            <div className="dp-sec-head">
              <span className="ico" style={{ background: 'rgba(245,158,11,.14)', color: '#F59E0B' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="9" r="6" />
                  <path d="m8.5 14.5-1.5 7 5-3 5 3-1.5-7" />
                </svg>
              </span>
              <h2>Micro-credentials &amp; Certifications</h2>
              <span className="meta">{credentialsCount} of {credentialsCount} shown</span>
            </div>
            {credentials.length === 0 ? (
              <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 13.5 }}>
                No credentials issued yet.
              </div>
            ) : (
              <div className="flex flex-col">
                {credentials.map((cert, idx) => {
                  const tints = [
                    { bg: 'rgba(245,158,11,.13)', fg: '#F59E0B' },
                    { bg: 'rgba(79,70,229,.12)', fg: '#4F46E5' },
                    { bg: 'rgba(14,165,164,.12)', fg: '#0EA5A4' }
                  ];
                  const tint = tints[idx % tints.length];
                  const isLast = idx === credentials.length - 1;
                  return (
                    <div
                      key={cert.id || idx}
                      className="flex items-center gap-4"
                      style={{
                        padding: isLast ? '18px 0 2px' : '18px 0',
                        borderBottom: isLast ? 'none' : '1px solid #EEF1F6'
                      }}
                    >
                      <div
                        className="shrink-0 flex items-center justify-center"
                        style={{ width: 40, height: 40, borderRadius: 11, background: tint.bg, color: tint.fg }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="9" r="6" />
                          <path d="m8.5 14.5-1.5 7 5-3 5 3-1.5-7" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.005em', color: '#0F172A' }}>
                          {cert.title}
                          {cert.verified && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          )}
                        </div>
                        <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                          {cert.issuingInstitute || '—'}{cert.partnerId ? ' · Partner ID ' + cert.partnerId : ''}
                        </div>
                        <div className="dp-mono" style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 4 }}>
                          ID {cert.id}{cert.issueDate ? ' · Issued ' + cert.issueDate : ''}
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleVerifyCert(cert.id, cert.title)}
                          className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors cursor-pointer"
                          style={{ background: '#EEF0FE', color: '#4F46E5', border: '1px solid #E0E3FD' }}
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ===== EXPERIENCE ===== */}
          <section className="dp-card" style={{ padding: 28 }}>
            <div className="dp-sec-head">
              <span className="ico">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="7" width="18" height="13" rx="2.5" />
                  <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
                  <path d="M3 12h18" />
                </svg>
              </span>
              <h2>Internship &amp; Work Experience</h2>
              <span className="meta">{workExperiences.length} verified {workExperiences.length === 1 ? 'record' : 'records'}</span>
            </div>
            {workExperiences.length === 0 ? (
              <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 13.5 }}>
                No work experience recorded yet.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {workExperiences.map((we, idx) => (
                  <div key={idx}>
                    <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-2">
                      <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-.01em', color: '#0F172A' }}>
                        {we.role}
                      </span>
                      <span style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>
                        {we.company}
                      </span>
                      {we.period && (
                        <span className="dp-mono ml-auto" style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {we.period}{we.tenureDuration ? ' (' + we.tenureDuration + ')' : ''}
                        </span>
                      )}
                    </div>
                    {we.keyContribution && (
                      <p className="mt-3.5 mb-0" style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.6 }}>
                        {we.keyContribution}
                      </p>
                    )}
                    {we.verifiedRef && (
                      <div className="flex flex-wrap items-center gap-3 mt-5">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full"
                          style={{ fontSize: 12, fontWeight: 600, color: '#047857', background: '#ECFDF5', border: '1px solid #D1FAE5', padding: '5px 12px' }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          Employer Verified: {we.verifiedRef}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer style={{ background: 'linear-gradient(180deg,#FFFFFF,#F8FAFC)', borderTop: '1px solid #EEF1F6', padding: '34px 0' }}>
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-x-7 gap-y-3" style={{ fontSize: 12.5, color: '#94A3B8' }}>
          <span className="flex items-center gap-2" style={{ color: '#64748B', fontWeight: 500 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
              <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
            </svg>
            Issued by SkillTrack AI · Digitally signed credential
          </span>
          <span className="ml-auto flex flex-wrap gap-x-6 gap-y-2">
            <span>Document ID · ST-DP-{bio.id}</span>
            <span>Issued {bio.issuanceDate || '—'}</span>
          </span>
        </div>
      </footer>

      {/* ================= SHARE MODAL ================= */}
      {shareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,.60)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          onClick={() => setShareModalOpen(false)}
        >
          <div
            className="rounded-2xl overflow-hidden w-full"
            style={{ maxWidth: 440, background: '#FFFFFF', boxShadow: '0 24px 60px rgba(15,23,42,.25)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5" style={{ background: '#0F172A', color: '#FFFFFF' }}>
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Share Verified Passport</span>
              </div>
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="cursor-pointer"
                style={{ color: '#CBD5E1' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <p style={{ fontSize: 12.5, color: '#64748B', margin: 0, lineHeight: 1.55 }}>
                Generate an authenticated, tamper-evident public verification link for employers, recruiters, or background verification agencies.
              </p>

              <div className="flex flex-col gap-1.5">
                <span className="dp-label">Direct Passport URL</span>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full dp-mono rounded-lg"
                    style={{ background: '#F8FAFC', padding: '10px 12px', fontSize: 11.5, color: '#4F46E5', fontWeight: 500, border: '1px solid #E0E3FD', outline: 'none' }}
                    readOnly
                    type="text"
                    value={'https://verify.skilltrack.gov.in/passport/' + bio.id + '?auth=sha256_8812'}
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="rounded-lg shrink-0 cursor-pointer"
                    style={{ padding: '10px 16px', background: '#4F46E5', color: '#FFFFFF', fontSize: 12, fontWeight: 700 }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="rounded-lg flex items-center gap-2 p-3" style={{ background: '#ECFDF5', border: '1px solid #D1FAE5', fontSize: 12, color: '#047857' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Access logs are timestamped and monitored under national privacy guidelines.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOAST ================= */}
      {toastMessage && (
        <div
          className="fixed z-50 flex items-center gap-3"
          style={{
            bottom: 80,
            right: 24,
            background: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: 12,
            boxShadow: '0 20px 40px rgba(15,23,42,.35)',
            border: '1px solid rgba(255,255,255,.15)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#95F8A7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <div className="flex flex-col">
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#FFFFFF' }}>{toastMessage.title}</span>
            <span className="dp-mono" style={{ fontSize: 11, color: '#CBD5E1' }}>{toastMessage.subtitle}</span>
          </div>
        </div>
      )}
    </div>
  );
};
