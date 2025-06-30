import { useContext } from "react";
import { AuthContext} from "@/context/AuthContext.ts";

export function useAuth() {
  const ctx = useContext(AuthContext);
  // Αυτό το Error σημαίνει ότι δεν μπορούμε να χρησιμοποιήσουμε το
  // useAuth εκτός του AuthProvider στο app.tsx
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}