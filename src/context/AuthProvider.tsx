import {type ReactNode, useEffect, useState} from "react";
import {deleteCookie, getCookie, setCookie} from "@/utils/cookies.ts";
import {jwtDecode} from "jwt-decode";
import {login, type LoginFields} from "@/api/login.ts";
import {AuthContext} from "./AuthContext.ts";

type JwtPayload = {
  email?: string;
  tenant_id?: string;
}

export const AuthProvider = ({children}:{children: ReactNode}) => {

  const [ accessToken, setAccessToken ] = useState<string | null>(null);
  const [ tenantId, setTenantId ] = useState<string | null>(null);
  const [ loading, setLoading ] = useState<boolean>(true);

  useEffect(() => {
    const token = getCookie("access_token");
    setAccessToken(token ?? null);  // token αλλιώς θα είναι null

    // decode to get tenant id
    if (token) {
      try {
        const decoded:JwtPayload = jwtDecode(token);
        console.log(decoded);
        setTenantId(decoded.tenant_id ?? null)
      } catch {
        setTenantId(null);
      }
    } else {
      setTenantId(null);
    }

    // Αφού πήραμε το tenant id, τώρα θα εμφανιστεί το περιεχόμενο
    setLoading(false);

  }, []);

  const loginUser = async (fields: LoginFields) => {
    const res = await login(fields)
    setCookie("access_token", res.access_token, {
      expires: 1,
      sameSite: "Lax",
      secure: false, // επειδή τρέχουμε σε localhost, αλλιώς πάντα true
      path: "/"
    })

    setAccessToken(res.access_token);

    try {
      const decoded: JwtPayload = jwtDecode(res.access_token);
      setTenantId(decoded.tenant_id ?? null);
    } catch {
      setTenantId(null);
    }

    setLoading(false);
  }

  const logoutUser = () => {
    deleteCookie("access_token");
    setAccessToken(null);
    setTenantId(null);
  }

  return (
      <AuthContext.Provider
        value={{
          isAuthenticated: !!accessToken, // αν υπάρχει είναι authenticated
          accessToken,
          tenantId,
          loginUser,
          logoutUser,
          loading
        }}
      >
        {loading ? null : children}
      </AuthContext.Provider>
    )
};