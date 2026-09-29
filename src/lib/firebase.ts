import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where
} from 'firebase/firestore';
import { app, db, auth, googleProvider } from '../firebase';

export { app, db, auth, googleProvider };

// ============================================================
// READ FUNCTIONS
// ============================================================

export async function getTraineeBio(traineeId: string) {
  try {
    const snap = await getDoc(doc(db, 'traineeBios', traineeId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error('getTraineeBio error:', err);
    return null;
  }
}

export async function getCompetencies(traineeId: string): Promise<any> {
  const docRef = doc(db, 'competencies', traineeId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.items || [];
  }
  return [];
}

export async function getMicroCredentials(traineeId: string): Promise<any> {
  const docRef = doc(db, 'microCredentials', traineeId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.items || [];
  }
  return [];
}

export async function getCurrentEmployment(traineeId: string): Promise<any> {
  const docRef = doc(db, 'currentEmployments', traineeId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function getWorkExperience(traineeId: string): Promise<any> {
  const docRef = doc(db, 'workExperiences', traineeId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return (data.items && data.items[0]) || null;
  }
  return null;
}

export async function getEmployerKpis(employerId: string): Promise<any> {
  const docRef = doc(db, 'employerKpis', employerId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function getActiveHires(employerId: string): Promise<any> {
  const q = query(
    collection(db, 'activeHireRecords'),
    where('employerId', '==', employerId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getInstitutesPerformance(): Promise<any> {
  const snap = await getDocs(collection(db, 'institutesPerformance'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getSkillGaps(): Promise<any> {
  const snap = await getDocs(collection(db, 'govSkillGaps'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getGovernmentInstitutes(): Promise<any> {
  const snap = await getDocs(collection(db, 'institutesGov'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getGovernmentCourses(): Promise<any> {
  const snap = await getDocs(collection(db, 'coursesGov'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getGovernmentEmployment(): Promise<any> {
  const snap = await getDocs(collection(db, 'govEmploymentTable'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getGovernmentSkillGaps(): Promise<any> {
  const snap = await getDocs(collection(db, 'govSkillGaps'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getGovernmentReports(): Promise<any> {
  const snap = await getDocs(collection(db, 'govReports'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getGovernmentMetrics(): Promise<any> {
  const docRef = doc(db, 'govMetrics', 'state-maharashtra');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

export async function getTraineesByInstitute(instituteId: string): Promise<any> {
  try {
    const q = query(
      collection(db, 'traineeBios'),
      where('instituteId', '==', instituteId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const allSnap = await getDocs(collection(db, 'traineeBios'));
    const matched = allSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter((t: any) =>
        t.instituteId === instituteId ||
        t.institutionId === instituteId ||
        t.institute === instituteId ||
        (t.id && t.id.includes(instituteId))
      );
    return matched.length > 0 ? matched : allSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('getTraineesByInstitute error:', err);
    return [];
  }
}

export async function getTraineeFullProfile(traineeId: string): Promise<any> {
  const [bio, competencies, microCredentials, employment] = await Promise.all([
    getTraineeBio(traineeId),
    getCompetencies(traineeId),
    getMicroCredentials(traineeId),
    getCurrentEmployment(traineeId)
  ]);
  return {
    bio,
    competencies,
    microCredentials,
    employment
  };
}

// ============================================================
// WRITE FUNCTIONS — For employer portal
// ============================================================

export async function createEmploymentRecord(traineeId: string, data: any): Promise<any> {
  const docRef = doc(db, 'currentEmployments', traineeId);
  await setDoc(docRef, {
    traineeId,
    ...data,
    createdAt: new Date().toISOString()
  });
  return traineeId;
}

export async function createFeedbackRecord(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'feedbackRecords'), {
    ...data,
    submittedAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function getEmployers(): Promise<any> {
  const snap = await getDocs(collection(db, 'employers'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getEmployerTrustScores(): Promise<any> {
  const snap = await getDocs(collection(db, 'employerTrustScores'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAttritionReasons(): Promise<any> {
  const snap = await getDocs(collection(db, 'attritionReasons'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getTraineeCompetencies(traineeId: string) {
  try {
    const snap = await getDoc(doc(db, 'competencies', traineeId));
    if (!snap.exists()) return [];
    const data: any = snap.data();
    return Array.isArray(data?.items) ? data.items : [];
  } catch (err) {
    console.error('getTraineeCompetencies error:', err);
    return [];
  }
}

export async function getTraineeCredentials(traineeId: string) {
  try {
    const snap = await getDoc(doc(db, 'microCredentials', traineeId));
    if (!snap.exists()) return [];
    const data: any = snap.data();
    return Array.isArray(data?.items) ? data.items : [];
  } catch (err) {
    console.error('getTraineeCredentials error:', err);
    return [];
  }
}

export async function getTraineeWorkExperiences(traineeId: string) {
  try {
    const snap = await getDoc(doc(db, 'workExperiences', traineeId));
    if (!snap.exists()) return [];
    const data: any = snap.data();
    return Array.isArray(data?.items) ? data.items : [];
  } catch (err) {
    console.error('getTraineeWorkExperiences error:', err);
    return [];
  }
}

export async function getTraineeEmployment(traineeId: string) {
  try {
    const snap = await getDoc(doc(db, 'currentEmployments', traineeId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error('getTraineeEmployment error:', err);
    return null;
  }
}

export async function getFullTraineeIndex() {
  try {
    const snap = await getDocs(collection(db, 'traineeBios'));
    return snap.docs.map((d) => {
      const data: any = d.data();
      return {
        id: d.id,
        name: data.name || '',
        district: data.district || '',
        category: data.category || '',
        gender: data.gender || '',
        status: data.employmentStatus || data.status || '',
        course: data.courseName || '',
        institute: data.institution || '',
      };
    });
  } catch (err) {
    console.error('getFullTraineeIndex error:', err);
    return [];
  }
}

export async function getFullCompetencyIndex() {
  try {
    const snap = await getDocs(collection(db, 'competencies'));
    const rows: any[] = [];
    snap.docs.forEach((d) => {
      const data: any = d.data();
      const traineeId = d.id;
      const items = Array.isArray(data.items) ? data.items : [];
      items.forEach((item: any) => {
        rows.push({
          traineeId,
          skill: item.name || '',
          level: item.level || '',
          score: item.score ?? 0,
        });
      });
    });
    return rows;
  } catch (err) {
    console.error('getFullCompetencyIndex error:', err);
    return [];
  }
}

export async function getFullCredentialIndex() {
  try {
    const snap = await getDocs(collection(db, 'microCredentials'));
    const rows: any[] = [];
    snap.docs.forEach((d) => {
      const data: any = d.data();
      const traineeId = d.id;
      const items = Array.isArray(data.items) ? data.items : [];
      items.forEach((item: any) => {
        rows.push({
          traineeId,
          title: item.title || '',
          issuer: item.issuingInstitute || '',
          date: item.issueDate || '',
          verified: item.verified === true,
        });
      });
    });
    return rows;
  } catch (err) {
    console.error('getFullCredentialIndex error:', err);
    return [];
  }
}

export async function getFullHireIndex() {
  try {
    const snap = await getDocs(collection(db, 'activeHireRecords'));
    return snap.docs.map((d) => {
      const data: any = d.data();
      return {
        id: d.id,
        name: data.name || '',
        employerId: data.employerId || '',
        role: data.role || '',
        salary: data.salary || '',
        status: data.isAuditPending ? 'pending' : 'active',
      };
    });
  } catch (err) {
    console.error('getFullHireIndex error:', err);
    return [];
  }
}

export async function getFullCourseIndex() {
  try {
    const snap = await getDocs(collection(db, 'coursesGov'));
    return snap.docs.map((d) => {
      const data: any = d.data();
      return {
        id: d.id,
        name: data.name || '',
        students: data.students ?? 0,
        placementRate: data.placementRate ?? 0,
      };
    });
  } catch (err) {
    console.error('getFullCourseIndex error:', err);
    return [];
  }
}

export async function getFullAttritionIndex() {
  try {
    const snap = await getDocs(collection(db, 'attritionReasons'));
    const counts: Record<string, number> = {};
    snap.docs.forEach((d) => {
      const data: any = d.data();
      const reason = data.reason || 'Unknown';
      counts[reason] = (counts[reason] || 0) + 1;
    });
    return Object.entries(counts).map(([reason, count]) => ({ reason, count }));
  } catch (err) {
    console.error('getFullAttritionIndex error:', err);
    return [];
  }
}
