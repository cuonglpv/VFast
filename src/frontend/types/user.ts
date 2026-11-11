export type UserRole = 'Employee' | 'Staff' | 'Manager' | 'Admin';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  tenant?: string;
  department: string;
  role: UserRole;
  assignedLicensesCount: number;
  lastActive: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

/** Shape currently consumed by the user management screen. */
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarBg: string;
  tenant: string;
  department: string;
  role: UserRole;
  assignedLicensesCount: number;
  lastActive: string;
  status: 'Active' | 'Inactive' | 'Pending';
}
