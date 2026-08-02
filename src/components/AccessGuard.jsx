"use client";

import { useSession, signIn } from "next-auth/react";
import { ShieldAlert, LogIn, ExternalLink } from "lucide-react";

const CITIZEN_ROLE_ID = "1531491517956923404";

export default function AccessGuard({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#070709", color: "#fff" }}>
        <h2>جاري التحقق من الهوية والصلاحيات...</h2>
      </div>
    );
  }

  // Case 1: Not logged in
  if (!session) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#070709", padding: "2rem", textAlign: "center", position: "relative" }}>
        <div className="cyber-bg" />
        <div className="cyber-card" style={{ maxWidth: "550px", padding: "3rem 2rem" }}>
          <ShieldAlert size={60} color="var(--primary)" style={{ marginBottom: "1.5rem" }} />
          <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "1rem" }}>سجل دخولك أولاً 🔒</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "2rem", lineHeight: 1.6 }}>
            مرحباً بك في **Black Horizon RP**. يجب عليك تسجيل الدخول بحساب ديسكورد للوصول إلى صفحات وميزات الموقع.
          </p>
          <button 
            onClick={() => signIn("discord")} 
            style={{ 
              background: "#5865F2", 
              color: "#ffffff", 
              fontSize: "1.2rem", 
              fontWeight: 800, 
              padding: "16px 44px", 
              borderRadius: "50px", 
              border: "none", 
              cursor: "pointer", 
              boxShadow: "0 0 30px rgba(88, 101, 242, 0.6)",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              transition: "transform 0.2s ease, background 0.2s ease"
            }}
          >
            تسجيل الدخول بديسكورد <LogIn size={22} />
          </button>
        </div>
      </div>
    );
  }

  const mainRoles = session.user.mainRoles || [];
  const hasCitizenRole = mainRoles.includes(CITIZEN_ROLE_ID);

  // Case 2: Not in server or missing Citizen Role
  if (!hasCitizenRole) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#070709", padding: "2rem", textAlign: "center", position: "relative" }}>
        <div className="cyber-bg" />
        <div className="cyber-card" style={{ maxWidth: "600px", padding: "3rem 2rem" }}>
          <ShieldAlert size={60} color="var(--primary)" style={{ marginBottom: "1.5rem" }} />
          <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "1rem", color: "var(--primary)" }}>عفواً! لا تملك الصلاحية ⛔</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            أهلاً بك <strong>{session.user.name}</strong>. يرجى التأكد من انضمامك لسيرفر ديسكورد المدينة والحصول على رتبة المواطن <code style={{ color: "var(--primary)" }}>({CITIZEN_ROLE_ID})</code> لتتمكن من تصفح الموقع.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://discord.gg/" target="_blank" rel="noreferrer" className="btn-cyber-primary">
              انضم لسيرفر الديسكورد <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Fully Authorized Citizen
  return <>{children}</>;
}
