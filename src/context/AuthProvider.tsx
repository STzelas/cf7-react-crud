import {type ReactNode, useEffect, useState} from "react";
import {getCookie} from "@/utils/cookies.ts";
import {jwtDecode} from "jwt-decode";

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

  return (
    <>

    </>
  )
}