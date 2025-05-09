export type TUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  role: string;
  created_at?: string;
  updated_at?: string;
  phone: string | null;
  profile?: string | null;
  department_id?: string;
  avatar?: string; // URL to the user's avatar image
  is_disable?: 1 | 0; // Whether the user is disabled
  last_login_at?: {
    created_at: string;
    ip_address: string;
    user_agent: string;
  };
  departments: {
    id: string;
    name: string;
  }[];
};
