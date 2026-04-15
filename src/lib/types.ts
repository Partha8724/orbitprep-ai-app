export type UserRole = "student" | "admin";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_premium: boolean;
  created_at: string;
};
