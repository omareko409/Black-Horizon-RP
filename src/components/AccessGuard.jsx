"use client";

import { useSession, signIn } from "next-auth/react";
import { ShieldAlert, LogIn, ExternalLink } from "lucide-react";

const CITIZEN_ROLE_ID = "1531491517956923404";
const WHITELIST_ROLE_ID = "1531461920136364112";

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
  const hasAllowedRole = mainRoles.includes(CITIZEN_ROLE_ID) || mainRoles.includes(WHITELIST_ROLE_ID);

  // Case 2: Not in server or missing allowed roles
  if (!hasAllowedRole) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#070709", padding: "2rem", textAlign: "center", position: "relative" }}>
        <div className="cyber-bg" />
        <div className="cyber-card" style={{ maxWidth: "600px", padding: "3.5rem 2rem" }}>
          <ShieldAlert size={64} color="var(--primary)" style={{ marginBottom: "1.5rem" }} />
          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "1rem", color: "var(--primary)" }}>تنبيه الهوية والصلاحية ⛔</h2>
          <p style={{ color: "#ffffff", fontSize: "1.2rem", marginBottom: "1.8rem", lineHeight: 1.8, fontWeight: 700 }}>
            أنت لم تكن في السيرفر أو يوجد مشكلة فنية، برجاء تواصل مع الإدارة.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
            مرحباً {session.user.name}، يرجى التأكد من تواجدك في سيرفر المدينة وحصولك على الرتبة المعتمدة.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://discord.gg/PmhbYNPSn" target="_blank" rel="noreferrer" className="btn-cyber-primary" style={{ borderRadius: "50px" }}>
              انضم لسيرفر الديسكورد <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Fully Authorized
  return <>{children}</>;
}
