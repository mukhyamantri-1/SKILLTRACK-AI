// Realistic mock data for Government Dashboard Navigation Pages

export interface GovernmentInstitute {
  id: string;
  code: string;
  name: string;
  district: string;
  state: string;
  courses: string[];
  coursesCount: number;
  studentsTrained: number;
  studentsCertified: number;
  studentsPlaced: number;
  placementRate: number; // percentage
  grade: 'A+' | 'A' | 'B+' | 'B';
  contactPerson: string;
  phone: string;
}

export interface GovernmentCourse {
  id: string;
  code: string;
  name: string;
  institute: string;
  district: string;
  duration: string;
  nsqfLevel: number;
  students: number;
  placementRate: number; // percentage
  mainSkillGap: string;
  sector: string;
  employmentTrend: 'Growing' | 'Stable' | 'High Demand';
}

export interface GovernmentEmploymentOutcome {
  id: string;
  batchCode: string;
  program: string;
  institute: string;
  district: string;
  trained: number;
  certified: number;
  placed: number;
  currentlyEmployed: number;
  avgStartingSalary: string;
  avgCurrentSalary: string;
  retentionRate: number; // percentage
  epfoSyncStatus: 'Verified (EPFO Active)' | 'Pending Verification' | 'Direct Deposit Synced';
}

export interface GovernmentSkillGap {
  id: string;
  skill: string;
  studentsAffected: number;
  employerReportedGap: number; // percentage
  priority: 'High' | 'Medium' | 'Moderate' | 'Low';
  affectedSectors: string[];
  recommendedIntervention: string;
  estimatedUpskillingWeeks: number;
}

export interface GovernmentReportItem {
  id: string;
  reportCode: string;
  title: string;
  category: 'Employment Outcome' | 'Institute Performance' | 'Skill Gap' | 'Course Improvement';
  publicationDate: string;
  gazetteRef: string;
  reportingCycle: string;
  authorizingBody: string;
  summary: string;
  keyMetrics: { label: string; value: string }[];
  findings: string[];
  recommendations: string[];
}

// 1. INSTITUTES MOCK DATA
export const MOCK_GOV_INSTITUTES: GovernmentInstitute[] = [
  {
    id: 'inst-001',
    code: 'ITI-KAM-001',
    name: 'ABC Skill Institute',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    courses: ['Data Analytics & BI', 'Full Stack Web Dev', 'Cloud Operations'],
    coursesCount: 3,
    studentsTrained: 200,
    studentsCertified: 180,
    studentsPlaced: 150,
    placementRate: 83.3,
    grade: 'A+',
    contactPerson: 'Dr. Nilav Hazarika',
    phone: '+91 94350-12891'
  },
  {
    id: 'inst-002',
    code: 'ITI-DIB-014',
    name: 'XYZ Training Centre',
    district: 'Dibrugarh',
    state: 'Assam',
    courses: ['Industrial Automation & PLC', 'CNC Turning', 'Automotive Maintenance'],
    coursesCount: 3,
    studentsTrained: 180,
    studentsCertified: 160,
    studentsPlaced: 126,
    placementRate: 78.8,
    grade: 'A',
    contactPerson: 'Er. Pranab Gogoi',
    phone: '+91 98540-33421'
  },
  {
    id: 'inst-003',
    code: 'ITI-JOR-008',
    name: 'DEF Institute of Technical Skills',
    district: 'Jorhat',
    state: 'Assam',
    courses: ['Python Systems & Automation', 'Cyber Security Support', 'IT Helpdesk'],
    coursesCount: 3,
    studentsTrained: 150,
    studentsCertified: 135,
    studentsPlaced: 110,
    placementRate: 81.5,
    grade: 'A',
    contactPerson: 'Smti. Ananya Bordoloi',
    phone: '+91 97060-44912'
  },
  {
    id: 'inst-004',
    code: 'ITI-KAM-023',
    name: 'Pragati Skill Hub',
    district: 'Kamrup Rural',
    state: 'Assam',
    courses: ['Solar PV Installation', 'Electrical Substation Technician', 'HVAC Systems'],
    coursesCount: 3,
    studentsTrained: 250,
    studentsCertified: 215,
    studentsPlaced: 175,
    placementRate: 81.4,
    grade: 'A+',
    contactPerson: 'Shri Bikash Sarma',
    phone: '+91 94351-88204'
  },
  {
    id: 'inst-005',
    code: 'ITI-CAC-005',
    name: 'Brahmaputra Vocational Academy',
    district: 'Cachar',
    state: 'Assam',
    courses: ['Healthcare Assistant', 'Medical Lab Support', 'Emergency Care Attendant'],
    coursesCount: 3,
    studentsTrained: 220,
    studentsCertified: 160,
    studentsPlaced: 139,
    placementRate: 86.9,
    grade: 'A',
    contactPerson: 'Dr. Debabrata Roy',
    phone: '+91 94352-77119'
  },
  {
    id: 'inst-006',
    code: 'ITI-SON-011',
    name: 'Sonitpur Center for Advanced Trades',
    district: 'Sonitpur',
    state: 'Assam',
    courses: ['Precision Welding', 'Heavy Machinery Operations', 'Sheet Metal Fabrication'],
    coursesCount: 3,
    studentsTrained: 140,
    studentsCertified: 125,
    studentsPlaced: 98,
    placementRate: 78.4,
    grade: 'B+',
    contactPerson: 'Er. Kamal Saikia',
    phone: '+91 98640-55102'
  },
  {
    id: 'inst-007',
    code: 'ITI-NAG-009',
    name: 'Nagaon District Skill Institute',
    district: 'Nagaon',
    state: 'Assam',
    courses: ['Agri-Business Logistics', 'Cold Chain Management', 'Food Processing'],
    coursesCount: 3,
    studentsTrained: 110,
    studentsCertified: 95,
    studentsPlaced: 72,
    placementRate: 75.8,
    grade: 'B+',
    contactPerson: 'Shri Jiten Kalita',
    phone: '+91 94355-66778'
  }
];

// 2. COURSES MOCK DATA
export const MOCK_GOV_COURSES: GovernmentCourse[] = [
  {
    id: 'crs-001',
    code: 'NCVET-DA-601',
    name: 'Data Analytics & Business Intelligence Associate',
    institute: 'ABC Skill Institute',
    district: 'Kamrup Metropolitan',
    duration: '6 Months',
    nsqfLevel: 6,
    students: 200,
    placementRate: 83.3,
    mainSkillGap: 'Power BI & DAX Calculations',
    sector: 'IT & ITeS',
    employmentTrend: 'High Demand'
  },
  {
    id: 'crs-002',
    code: 'NCVET-IA-502',
    name: 'Industrial Automation & PLC Technician',
    institute: 'XYZ Training Centre',
    district: 'Dibrugarh',
    duration: '6 Months',
    nsqfLevel: 5,
    students: 180,
    placementRate: 78.8,
    mainSkillGap: 'SCADA Interfacing & Troubleshooting',
    sector: 'Manufacturing & Capital Goods',
    employmentTrend: 'Growing'
  },
  {
    id: 'crs-003',
    code: 'NCVET-PY-503',
    name: 'Python Systems & Enterprise Automation',
    institute: 'DEF Institute of Technical Skills',
    district: 'Jorhat',
    duration: '4 Months',
    nsqfLevel: 5,
    students: 150,
    placementRate: 81.5,
    mainSkillGap: 'SQL Database Optimization',
    sector: 'IT & Software Development',
    employmentTrend: 'High Demand'
  },
  {
    id: 'crs-004',
    code: 'NCVET-SP-404',
    name: 'Solar Photovoltaic Grid-Tied System Installer',
    institute: 'Pragati Skill Hub',
    district: 'Kamrup Rural',
    duration: '4 Months',
    nsqfLevel: 4,
    students: 250,
    placementRate: 81.4,
    mainSkillGap: 'Inverter Synchronization & Net Metering',
    sector: 'Green Energy & Power',
    employmentTrend: 'Growing'
  },
  {
    id: 'crs-005',
    code: 'NCVET-HA-405',
    name: 'Healthcare & Patient Care Assistant (General)',
    institute: 'Brahmaputra Vocational Academy',
    district: 'Cachar',
    duration: '9 Months',
    nsqfLevel: 4,
    students: 220,
    placementRate: 86.9,
    mainSkillGap: 'Electronic Medical Record (EMR) Entry',
    sector: 'Healthcare & Life Sciences',
    employmentTrend: 'High Demand'
  },
  {
    id: 'crs-006',
    code: 'NCVET-PW-406',
    name: 'TIG & MIG Precision Welder',
    institute: 'Sonitpur Center for Advanced Trades',
    district: 'Sonitpur',
    duration: '6 Months',
    nsqfLevel: 4,
    students: 140,
    placementRate: 78.4,
    mainSkillGap: 'Non-Destructive Testing (NDT) Quality Inspection',
    sector: 'Heavy Fabrication & Defense',
    employmentTrend: 'Stable'
  },
  {
    id: 'crs-007',
    code: 'NCVET-AL-407',
    name: 'Agri-Logistics & Warehouse Operations Specialist',
    institute: 'Nagaon District Skill Institute',
    district: 'Nagaon',
    duration: '4 Months',
    nsqfLevel: 4,
    students: 110,
    placementRate: 75.8,
    mainSkillGap: 'Advanced Excel & Inventory ERP',
    sector: 'Logistics & Supply Chain',
    employmentTrend: 'Growing'
  },
  {
    id: 'crs-008',
    code: 'NCVET-CS-608',
    name: 'Cloud Infrastructure & DevOps Associate',
    institute: 'ABC Skill Institute',
    district: 'Kamrup Metropolitan',
    duration: '6 Months',
    nsqfLevel: 6,
    students: 120,
    placementRate: 87.5,
    mainSkillGap: 'Docker & Kubernetes Pod Orchestration',
    sector: 'IT & Cloud Computing',
    employmentTrend: 'High Demand'
  }
];

// 3. EMPLOYMENT OUTCOMES MOCK DATA
export const MOCK_GOV_EMPLOYMENT_METRICS = {
  studentsTrained: 1250,
  certified: 1075,
  certificationRate: 86.0,
  placed: 878,
  placementRate: 70.2,
  currentlyEmployed: 712,
  employmentRate: 57.0,
  averageStartingSalary: '₹23,800',
  averageStartingSalaryLpa: '₹2.85 LPA',
  averageCurrentSalary: '₹28,600',
  averageCurrentSalaryLpa: '₹3.43 LPA',
  salaryGrowth: '+20.2%',
  retentionRate: '81.1%', // 6-month post placement retention
  epfoSyncCoverage: '94.2%'
};

export const MOCK_GOV_EMPLOYMENT_TABLE: GovernmentEmploymentOutcome[] = [
  {
    id: 'emp-001',
    batchCode: 'BATCH-2024-DA01',
    program: 'Data Analytics Master Program',
    institute: 'ABC Skill Institute',
    district: 'Kamrup Metropolitan',
    trained: 200,
    certified: 180,
    placed: 150,
    currentlyEmployed: 128,
    avgStartingSalary: '₹25,000 / mo',
    avgCurrentSalary: '₹31,500 / mo',
    retentionRate: 85.3,
    epfoSyncStatus: 'Verified (EPFO Active)'
  },
  {
    id: 'emp-002',
    batchCode: 'BATCH-2024-IA02',
    program: 'Industrial Automation & PLC',
    institute: 'XYZ Training Centre',
    district: 'Dibrugarh',
    trained: 180,
    certified: 160,
    placed: 126,
    currentlyEmployed: 101,
    avgStartingSalary: '₹23,500 / mo',
    avgCurrentSalary: '₹27,800 / mo',
    retentionRate: 80.2,
    epfoSyncStatus: 'Verified (EPFO Active)'
  },
  {
    id: 'emp-003',
    batchCode: 'BATCH-2024-PY01',
    program: 'Python Systems & Automation',
    institute: 'DEF Institute of Technical Skills',
    district: 'Jorhat',
    trained: 150,
    certified: 135,
    placed: 110,
    currentlyEmployed: 94,
    avgStartingSalary: '₹24,200 / mo',
    avgCurrentSalary: '₹29,000 / mo',
    retentionRate: 85.5,
    epfoSyncStatus: 'Verified (EPFO Active)'
  },
  {
    id: 'emp-004',
    batchCode: 'BATCH-2024-SP03',
    program: 'Solar Photovoltaic Grid Installer',
    institute: 'Pragati Skill Hub',
    district: 'Kamrup Rural',
    trained: 250,
    certified: 215,
    placed: 175,
    currentlyEmployed: 139,
    avgStartingSalary: '₹23,800 / mo',
    avgCurrentSalary: '₹28,200 / mo',
    retentionRate: 79.4,
    epfoSyncStatus: 'Direct Deposit Synced'
  },
  {
    id: 'emp-005',
    batchCode: 'BATCH-2024-HA01',
    program: 'Healthcare Assistant (General)',
    institute: 'Brahmaputra Vocational Academy',
    district: 'Cachar',
    trained: 220,
    certified: 160,
    placed: 139,
    currentlyEmployed: 118,
    avgStartingSalary: '₹22,500 / mo',
    avgCurrentSalary: '₹26,400 / mo',
    retentionRate: 84.9,
    epfoSyncStatus: 'Verified (EPFO Active)'
  },
  {
    id: 'emp-006',
    batchCode: 'BATCH-2024-PW02',
    program: 'Precision Welding & Heavy Fab',
    institute: 'Sonitpur Center for Advanced Trades',
    district: 'Sonitpur',
    trained: 140,
    certified: 125,
    placed: 98,
    currentlyEmployed: 76,
    avgStartingSalary: '₹21,800 / mo',
    avgCurrentSalary: '₹25,200 / mo',
    retentionRate: 77.5,
    epfoSyncStatus: 'Pending Verification'
  },
  {
    id: 'emp-007',
    batchCode: 'BATCH-2024-AL01',
    program: 'Agri-Logistics & Warehouse Ops',
    institute: 'Nagaon District Skill Institute',
    district: 'Nagaon',
    trained: 110,
    certified: 95,
    placed: 72,
    currentlyEmployed: 56,
    avgStartingSalary: '₹21,000 / mo',
    avgCurrentSalary: '₹24,500 / mo',
    retentionRate: 77.8,
    epfoSyncStatus: 'Direct Deposit Synced'
  }
];

// 4. SKILL GAPS MOCK DATA (Matches Prompt Specifications Exact)
export const MOCK_GOV_SKILL_GAPS: GovernmentSkillGap[] = [
  {
    id: 'gap-001',
    skill: 'Power BI',
    studentsAffected: 380,
    employerReportedGap: 38,
    priority: 'High',
    affectedSectors: ['Data Analytics', 'Business Intelligence', 'Corporate Financial Operations'],
    recommendedIntervention: 'Add 40 hours of mandatory hands-on dashboard design, DAX calculated measures, and live SQL database connectivity in Semester 2.',
    estimatedUpskillingWeeks: 4
  },
  {
    id: 'gap-002',
    skill: 'Advanced Excel',
    studentsAffected: 270,
    employerReportedGap: 27,
    priority: 'Medium',
    affectedSectors: ['Agri-Logistics', 'Financial Auditing', 'Supply Chain ERP'],
    recommendedIntervention: 'Conduct structured proctored masterclasses on Power Query data cleansing, dynamic arrays (XLOOKUP/FILTER), and macro scripting.',
    estimatedUpskillingWeeks: 3
  },
  {
    id: 'gap-003',
    skill: 'SQL',
    studentsAffected: 210,
    employerReportedGap: 21,
    priority: 'Medium',
    affectedSectors: ['IT & Enterprise Software', 'E-Commerce Analytics', 'Banking Support'],
    recommendedIntervention: 'Deploy interactive sandbox terminal labs focusing on complex multi-table joins, subqueries, indexing strategies, and execution plans.',
    estimatedUpskillingWeeks: 3
  },
  {
    id: 'gap-004',
    skill: 'Cloud Fundamentals (AWS/Azure)',
    studentsAffected: 165,
    employerReportedGap: 16.5,
    priority: 'Medium',
    affectedSectors: ['Cloud Operations', 'DevOps Support', 'Enterprise IT'],
    recommendedIntervention: 'Provide government-subsidized cloud credits and practical VPC, IAM, and container configuration labs.',
    estimatedUpskillingWeeks: 4
  },
  {
    id: 'gap-005',
    skill: 'Python Automation & Scripting',
    studentsAffected: 145,
    employerReportedGap: 14.5,
    priority: 'Moderate',
    affectedSectors: ['Data Engineering', 'Systems Testing', 'Automated Reporting'],
    recommendedIntervention: 'Integrate Pandas data wrangling modules and scheduled CRON script building into foundational training curricula.',
    estimatedUpskillingWeeks: 3
  },
  {
    id: 'gap-006',
    skill: 'PLC Ladder Logic & SCADA',
    studentsAffected: 110,
    employerReportedGap: 11,
    priority: 'Low',
    affectedSectors: ['Automotive Assembly', 'Packaging Manufacturing', 'Tea Estate Processing'],
    recommendedIntervention: 'Equip district ITI labs with Siemens & Allen-Bradley hardware simulation kits for hands-on fault-tracing.',
    estimatedUpskillingWeeks: 2
  }
];

// 5. REPORTS MOCK DATA (With the 4 requested reports)
export const MOCK_GOV_REPORTS: GovernmentReportItem[] = [
  {
    id: 'rep-001',
    reportCode: 'DGT/EMP-OUT/2026/Q1-094',
    title: 'Employment Outcome Report',
    category: 'Employment Outcome',
    publicationDate: '15 March 2026',
    gazetteRef: 'Gazette of India Extraordinary Part II Sec 3(i)',
    reportingCycle: 'FY 2025-26 (Annual Post-Placement Longitudinal Audit)',
    authorizingBody: 'Directorate General of Training (DGT) & National Council for Vocational Education and Training (NCVET)',
    summary: 'Comprehensive longitudinal analysis verifying 1,250 trained candidates across 7 accredited state institutes. Highlights an 86% certification rate, 70.2% verified placement, and an 81.1% 6-month retention rate corroborating direct EPFO payroll sync.',
    keyMetrics: [
      { label: 'Total Assessed Trainees', value: '1,250' },
      { label: 'Certified Count', value: '1,075 (86.0%)' },
      { label: 'Verified Placements', value: '878 (70.2%)' },
      { label: 'Active 6-Month Retention', value: '712 (81.1%)' },
      { label: 'Average Starting Salary', value: '₹23,800/mo' },
      { label: 'Average Current Salary', value: '₹28,600/mo (+20.2%)' }
    ],
    findings: [
      'Candidates certified in NSQF Level 6 IT & Cloud courses demonstrated the fastest placement cycle (avg. 22 days from course completion).',
      'Longitudinal salary trajectory shows an average increment of 20.2% within 12 months for trainees remaining with their initial employer.',
      'EPFO automatic database cross-referencing validated 94.2% of reported formal employment entries without manual employer intervention.',
      'Retention rates in manufacturing and healthcare sectors exceeded 84%, while tech support reported 78% due to lateral mobility.'
    ],
    recommendations: [
      'Expand mandatory 3-month apprenticeship linkages for all non-IT trades to elevate immediate hiring conversion to >80%.',
      'Institute dynamic wage indexation benchmarks for remote rural districts to incentivize regional talent retention.',
      'Mandate automated quarterly Form 9B statutory return submissions by all empaneled corporate employers.'
    ]
  },
  {
    id: 'rep-002',
    reportCode: 'DGT/INST-PERF/2026/A-042',
    title: 'Institute Performance Report',
    category: 'Institute Performance',
    publicationDate: '10 March 2026',
    gazetteRef: 'NCVET Quality Assurance Notification Ref: QA/2026/INST/77',
    reportingCycle: 'Annual Accreditation & Quality Assurance Cycle 2025-26',
    authorizingBody: 'National Quality Assurance Framework (NQAF) Inspection Board',
    summary: 'Evaluates pedagogical efficiency, infrastructure standards, trainer-to-student ratios, and placement performance across all registered government and private training partners in Assam and the North-East Zone.',
    keyMetrics: [
      { label: 'Total Audited Centers', value: '7 Centers' },
      { label: 'Grade A+ Institutes', value: '2 (28.6%)' },
      { label: 'Grade A Institutes', value: '3 (42.8%)' },
      { label: 'Grade B+ Institutes', value: '2 (28.6%)' },
      { label: 'Avg Trainer Qualification Index', value: '92.4 / 100' },
      { label: 'Lab Infrastructure Compliance', value: '96.8%' }
    ],
    findings: [
      'ABC Skill Institute (Kamrup Metro) and Pragati Skill Hub (Kamrup Rural) ranked highest in overall operational efficiency and employer satisfaction.',
      'Trainer retention in specialized engineering trades improved by 14% following the introduction of the National Trainer Honorarium scheme.',
      'Sonitpur Center and Nagaon District Skill Institute require lab instrumentation upgrades for modern CNC and automated packaging simulators.',
      'Digital attendance biometrics adherence reached 99.1% across all monitored classrooms.'
    ],
    recommendations: [
      'Disburse targeted modernization capital grants to Sonitpur and Nagaon centers for simulation hardware upgrades.',
      'Establish regional trainer exchange residencies with premier national institutes (NSTI Kolkata and NSTI Bengaluru).',
      'Reward top-performing institutes (Grade A+) with increased enrollment quotas and bonus state training subsidies.'
    ]
  },
  {
    id: 'rep-003',
    reportCode: 'DGT/SKILL-GAP/2026/SG-118',
    title: 'Skill Gap Report',
    category: 'Skill Gap',
    publicationDate: '02 March 2026',
    gazetteRef: 'DGT Labour Market Intelligence Bulletin Vol 18',
    reportingCycle: 'State Skill Matrix & Industry Deficit Evaluation 2025-26',
    authorizingBody: 'Ministry of Skill Development & Entrepreneurship Policy Research Unit',
    summary: 'Synthesizes qualitative appraisal feedback from 420 industrial employers and quantitative skill assessment tests. Identifies acute curriculum mismatches in Power BI, Advanced Excel, and Cloud Systems.',
    keyMetrics: [
      { label: 'Participating Employers', value: '420 Enterprises' },
      { label: 'Highest Deficit Skill', value: 'Power BI (38% Gap)' },
      { label: 'Second Deficit Skill', value: 'Adv Excel (27% Gap)' },
      { label: 'Third Deficit Skill', value: 'SQL Tuning (21% Gap)' },
      { label: 'Total Affected Trainees', value: '860 Students' },
      { label: 'Curriculum Revision Urgency', value: 'Immediate (High Priority)' }
    ],
    findings: [
      '380 candidates in Data Analytics programs experienced probation delays due to unfamiliarity with enterprise Power BI DAX calculations.',
      '27% of logistics and finance employers reported that fresh recruits lacked knowledge of dynamic Excel array functions (XLOOKUP, LAMBDA).',
      '21% of software development employers observed deficits in indexing and relational database execution plan diagnosis.',
      'Strong employer demand exists for multi-disciplinary candidates possessing both functional domain skills and automated scripting literacy.'
    ],
    recommendations: [
      'Incorporate a standardized 40-hour hands-on Business Intelligence module across all vocational commerce and IT curricula.',
      'Mandate pre-certification testing on real-world industry case datasets rather than multiple-choice theoretical assessments.',
      'Launch state-funded bootcamps during the final 4 weeks of training specifically covering the identified top 3 deficit areas.'
    ]
  },
  {
    id: 'rep-004',
    reportCode: 'DGT/CRS-REV/2026/CI-061',
    title: 'Course Improvement Report',
    category: 'Course Improvement',
    publicationDate: '24 February 2026',
    gazetteRef: 'NCVET Curriculum Modernization Directive CMD-2026-Assam',
    reportingCycle: 'Triennial NSQF Curriculum Modernization Review',
    authorizingBody: 'Central Staff Training and Research Institute (CSTARI) & Sector Skill Councils',
    summary: 'Detailed actionable roadmap for updating course syllabi, lab practical modules, credit structures, and NSQF alignment across 8 major vocational trades to match Industry 4.0 standards.',
    keyMetrics: [
      { label: 'Courses Evaluated', value: '8 Core Trades' },
      { label: 'Proposed Syllabus Updates', value: '34 Module Additions' },
      { label: 'Hours Added to Practical Labs', value: '+120 Hours' },
      { label: 'Digital Credit Integration', value: '100% (Academic Bank of Credits)' },
      { label: 'Projected Placement Boost', value: '+12.5%' },
      { label: 'Target Rollout Date', value: 'July 2026 (Monsoon Session)' }
    ],
    findings: [
      'The current Data Analytics curriculum allocated 70% time to theoretical concepts and only 30% to live industry project sandboxes.',
      'Solar PV installation courses required immediate inclusion of hybrid inverter synchronization and bidirectional net metering regulations.',
      'Healthcare assistant trainees demonstrated high clinical competence but struggled with Hospital Information Management Systems (HIMS).',
      'Vocational students expressed strong preference for modular stackable micro-credentials verifiable via DigiLocker.'
    ],
    recommendations: [
      'Adopt the 60:40 practical-to-theory model mandated under the National Education Policy (NEP 2020) and NSQF framework.',
      'Partner with leading industry software providers (Microsoft, Oracle, Siemens) to integrate industry-recognized certification vouchers.',
      'Establish regional examination hackathons where student final projects are evaluated directly by corporate hiring panels.'
    ]
  }
];
