export type UserRole = 'Employee' | 'Staff' | 'Manager' | 'Admin';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: UserRole;
  assignedLicensesCount: number;
  lastActive: string;
  status: 'Active' | 'Inactive' | 'Pending';
}
