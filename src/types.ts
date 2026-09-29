export type ActiveView = 'student' | 'employer' | 'government';
export type PortalRole = 'student' | 'employer' | 'government';

export interface TraineeBio {
  id: string;
  name: string;
  apaarId: string;
  degree: string;
  degreeDistinction: string;
  institution: string;
  districtState: string;
  stateMissionNode: string;
  issuanceDate: string;
  credentialTerm: string;
  photoUrl: string;
  registryHash: string;
  lastHashVerified: string;
  sha256: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CurrentEmployment {
  designation: string;
  engagementType: string;
  companyName: string;
  cin: string;
  department: string;
  tenure: string;
  verificationSource: string;
  epfAuth: string;
}

export interface SkillCompetency {
  name: string;
  level: 'Advanced' | 'Proficient' | 'Intermediate';
  score: number;
  benchmark: string;
  verified: boolean;
  examType: string;
}

export interface MicroCredential {
  id: string;
  title: string;
  issuingInstitute: string;
  partnerId: string;
  issueDate: string;
  verifiedBy: string;
  credentialId: string;
}

export interface WorkExperience {
  role: string;
  company: string;
  period: string;
  tenureDuration: string;
  location: string;
  keyContribution: string;
  verifiedRef: string;
  stamp: string;
}

export interface EmployerKpi {
  candidatesVerified: number;
  candidatesVerifiedGrowth: string;
  hiredViaSkillTrack: number;
  hiredSubtitle: string;
  currentlyEmployed: number;
  retentionRate: string;
  feedbackPending: number;
  feedbackSubtitle: string;
}

export interface ActiveHireRecord {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  joiningDate: string;
  tenure: string;
  salary: string;
  salaryGrowth?: string;
  epfoStatus: string;
  lastFeedbackAudit: string;
  auditBadge?: string;
  isAuditPending?: boolean;
}

export interface InstitutePerformance {
  id: string;
  name: string;
  trained: number;
  certified: number;
  placed: number;
  employed: number;
  avgSalary: string;
}

export interface SkillGapItem {
  rank: number;
  skill: string;
  gapPercent: number;
  priority: 'High Priority' | 'Medium' | 'Moderate';
}
