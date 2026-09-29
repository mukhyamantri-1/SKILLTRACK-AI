import {
  TraineeBio,
  CurrentEmployment,
  SkillCompetency,
  MicroCredential,
  WorkExperience,
  EmployerKpi,
  ActiveHireRecord,
  InstitutePerformance,
  SkillGapItem
} from '../types';

export const MOCK_TRAINEE_BIO: TraineeBio = {
  id: 'STU001',
  name: 'Rahul Sharma',
  apaarId: '8921-4402-9182',
  degree: 'Bachelor of Technology (B.Tech) in Computer Science & Engineering',
  degreeDistinction: 'First Class with Distinction',
  institution: 'Dibrugarh University Institute of Engineering & Technology (DUIET)',
  districtState: 'Dibrugarh, Assam (India)',
  stateMissionNode: 'Assam Skill Development Mission (ASDM)',
  issuanceDate: '12 January 2024',
  credentialTerm: 'Lifetime Sovereign Ledger',
  photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI5QbdIBuW1FrqfjUiRO242wyTKFZKJvGgVbu-V6pMYuhnmc3YKhlRnA754YeO06eJyq6_00EfmK78ddxRcWOfUq4aNdspx3Tgo47SVaAsHnk30TynBILc_efF-51PXcoccFCluTIHYrs4MsG0YcufDw5KODDWesay_C3OD3uQ5q0AiUJVRdwPJfq0Lqlg14p1SetBHdZZJFYNkGrwJOTPPCbGZGDL-L6ZqgliyedptqEtzT3KAEZMlw',
  registryHash: '#782914-9B04',
  lastHashVerified: '24 Oct 2024, 10:42 AM IST',
  sha256: 'e3b0c44298fc...78b901a',
  status: 'ACTIVE'
};

export const MOCK_CURRENT_EMPLOYMENT: CurrentEmployment = {
  designation: 'Data Analyst',
  engagementType: 'Full-Time Regular Engagement',
  companyName: 'ABC Technologies',
  cin: 'U72200DL2018PTC339102',
  department: 'Enterprise Business Intelligence',
  tenure: 'July 2023 – Present (Active)',
  verificationSource: "Confirmed via Employees' Provident Fund Organisation (EPFO) & Employer Direct Corporate API",
  epfAuth: 'EPF-AUTH: #OK-8812'
};

export const MOCK_COMPETENCIES: SkillCompetency[] = [
  {
    name: 'Python',
    level: 'Advanced',
    score: 94,
    benchmark: 'SkillTrack National Benchmark',
    verified: true,
    examType: 'Proctored Exam'
  },
  {
    name: 'SQL',
    level: 'Advanced',
    score: 91,
    benchmark: 'Relational Schema & Optimization',
    verified: true,
    examType: 'Proctored Exam'
  },
  {
    name: 'Microsoft Excel',
    level: 'Proficient',
    score: 88,
    benchmark: 'Advanced Modeling & Macros',
    verified: true,
    examType: 'Industry Sandbox'
  },
  {
    name: 'Power BI',
    level: 'Proficient',
    score: 86,
    benchmark: 'DAX & Dashboard Architecture',
    verified: true,
    examType: 'Proctored Project'
  }
];

export const MOCK_MICRO_CREDENTIALS: MicroCredential[] = [
  {
    id: 'SKT-CERT-DA-2023-4921',
    title: 'Data Analytics Master Program',
    issuingInstitute: 'ABC Skill Institute',
    partnerId: 'ASI-902',
    issueDate: 'June 2023',
    verifiedBy: 'SkillTrack AI',
    credentialId: 'NCVET-ACT-99120'
  },
  {
    id: 'SKT-CERT-PY-2023-1108',
    title: 'Python Programming & System Foundations',
    issuingInstitute: 'XYZ Institute of Technology',
    partnerId: 'XYZ-114',
    issueDate: 'March 2023',
    verifiedBy: 'SkillTrack AI',
    credentialId: 'NCVET-SYS-33018'
  }
];

export const MOCK_WORK_EXPERIENCE: WorkExperience = {
  role: 'Data Analyst Intern',
  company: 'ABC Technologies',
  period: 'January 2023 – June 2023',
  tenureDuration: '6 Months',
  location: 'Hybrid (Guwahati / Dibrugarh, Assam)',
  keyContribution: 'Built automated ETL pipelines and performance telemetry reports. Orchestrated SQL views and streamlined weekly analytics processing cycle times by 38%.',
  verifiedRef: 'Ref: ABC/HR/INT/2023-74',
  stamp: 'CONFIRMED-E-SIGN'
};

export const MOCK_EMPLOYER_KPIS: EmployerKpi = {
  candidatesVerified: 128,
  candidatesVerifiedGrowth: '+12 this mo.',
  hiredViaSkillTrack: 34,
  hiredSubtitle: 'NCVET Apprenticeships & Regular Trainees',
  currentlyEmployed: 29,
  retentionRate: '85.3% Retention',
  feedbackPending: 7,
  feedbackSubtitle: 'Action Required: Q3 Outcome Survey Due'
};

export const MOCK_ACTIVE_HIRES: ActiveHireRecord[] = [
  {
    id: 'STU001',
    name: 'Rahul Sharma',
    initials: 'RS',
    role: 'Data Analyst',
    department: 'Enterprise BI Dept.',
    joiningDate: '15 July 2023',
    tenure: '1 yr 4 mos',
    salary: '₹ 5,10,000 / yr',
    salaryGrowth: '+21.4% increment',
    epfoStatus: 'Active EPFO Sync',
    lastFeedbackAudit: '18 April 2024',
    auditBadge: 'Q2 Outcome Audit',
    isAuditPending: false
  },
  {
    id: 'STU084',
    name: 'Priya Das',
    initials: 'PD',
    role: 'Associate Cloud Specialist',
    department: 'Infrastructure Operations',
    joiningDate: '10 Jan 2024',
    tenure: '10 mos',
    salary: '₹ 4,50,000 / yr',
    salaryGrowth: 'Starting: ₹ 4.2L',
    epfoStatus: 'Active EPFO Sync',
    lastFeedbackAudit: '05 Aug 2024',
    auditBadge: 'Q2 Audit Validated',
    isAuditPending: false
  },
  {
    id: 'STU112',
    name: 'Anupam Barua',
    initials: 'AB',
    role: 'DevOps Trainee',
    department: 'Platform Engineering',
    joiningDate: '01 Mar 2024',
    tenure: '8 mos',
    salary: '₹ 3,80,000 / yr',
    salaryGrowth: 'Apprenticeship Scale',
    epfoStatus: 'Active EPFO Sync',
    lastFeedbackAudit: 'Pending Q3',
    isAuditPending: true
  }
];

export const MOCK_GOV_METRICS = {
  studentsTrained: 1000,
  certified: 850,
  placed: 700,
  currentlyEmployed: 550,
  averageSalary: '₹24,000',
  startingSalary: '₹21,000',
  attritionCount: 200,
  reportCycle: 'FY 2025-26',
  filterHash: 'AS-2026-ALL-DGT-0092'
};

export const MOCK_INSTITUTES_PERFORMANCE: InstitutePerformance[] = [
  {
    id: 'abc',
    name: 'ABC Skill Institute',
    trained: 200,
    certified: 180,
    placed: 150,
    employed: 120,
    avgSalary: '₹25,000'
  },
  {
    id: 'xyz',
    name: 'XYZ Training Centre',
    trained: 180,
    certified: 160,
    placed: 126,
    employed: 98,
    avgSalary: '₹23,500'
  },
  {
    id: 'def',
    name: 'DEF Institute',
    trained: 150,
    certified: 135,
    placed: 110,
    employed: 91,
    avgSalary: '₹24,200'
  },
  {
    id: 'pragati',
    name: 'Pragati Skill Hub',
    trained: 250,
    certified: 215,
    placed: 175,
    employed: 142,
    avgSalary: '₹23,800'
  },
  {
    id: 'brahmaputra',
    name: 'Brahmaputra Academy',
    trained: 220,
    certified: 160,
    placed: 139,
    employed: 99,
    avgSalary: '₹22,500'
  }
];

export const MOCK_SKILL_GAPS: SkillGapItem[] = [
  {
    rank: 1,
    skill: 'Power BI',
    gapPercent: 38,
    priority: 'High Priority'
  },
  {
    rank: 2,
    skill: 'Advanced Excel',
    gapPercent: 27,
    priority: 'Medium'
  },
  {
    rank: 3,
    skill: 'SQL',
    gapPercent: 21,
    priority: 'Moderate'
  }
];
