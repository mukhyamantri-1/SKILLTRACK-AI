/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PortalRole } from './types';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { StudentView } from './components/StudentView';
import { EmployerView } from './components/EmployerView';
import { GovernmentView } from './components/GovernmentView';

export default function App() {
  const [activeRole, setActiveRole] = useState<PortalRole | null>(null);

  if (!activeRole) {
    return (
      <RoleSelectionLanding
        onEnterPortal={(role) => setActiveRole(role)}
        initialRole={activeRole}
      />
    );
  }

  return (
    <div className="relative min-h-screen">
      {activeRole === 'student' && (
        <StudentView onChangeRole={() => setActiveRole(null)} />
      )}
      {activeRole === 'employer' && (
        <EmployerView onChangeRole={() => setActiveRole(null)} />
      )}
      {activeRole === 'government' && (
        <GovernmentView onChangeRole={() => setActiveRole(null)} />
      )}
    </div>
  );
}
