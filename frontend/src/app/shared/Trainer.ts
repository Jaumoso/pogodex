export interface Trainer {
  id: number;
  username: string;
  passwordHash: string;
  role: Roles;
  advancedChecklist: boolean;
  createdAt: Date;
  updatedAt: Date;
}

enum Roles {
  Admin = 'Admin',
  User = 'User',
}
