import { createContext } from "react";

type AuthContextProps = {
  isAuthenticated: boolean;
  accessToken: string | null;
  tenantId: string | null;
  loginUser: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);