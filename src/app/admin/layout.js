"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ADMIN_ROLES = [
  "1532005442602008677",
  "1532006548430393486",
  "1531460117956923462",
  "1532009816623415368"
];

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="container" style={{ paddingTop: "120px", textAlign: "center" }}>جاري التحقق من الصلاحيات...</div>;
  }

  if (!session) return null;

  const hasAdminRole = session.user.roles.some(role => ADMIN_ROLES.includes(role));

  if (!hasAdminRole) {
    return (
      <div className="container" style={{ paddingTop: "120px", textAlign: "center" }}>
        <h2 style={{ color: "var(--primary)" }}>عفواً، لا تملك صلاحية الدخول لهذه الصفحة!</h2>
        <p>يجب أن تمتلك رتبة إدارية في سيرفر الديسكورد للوصول إلى لوحة التحكم.</p>
        <Link href="/" className="btn-primary" style={{ display: "inline-block", marginTop: "20px" }}>العودة للرئيسية</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "120px", display: "flex", gap: "2rem", minHeight: "100vh" }}>
      <aside style={{ width: "260px", borderLeft: "1px solid var(--glass-border)", paddingLeft: "1rem" }}>
        <h3 style={{ marginBottom: "1.5rem", color: "var(--primary)" }}>⚙️ لوحة الإدارة</h3>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
          <li><Link href="/admin" className="btn-cyber-outline" style={{ display: "block", textAlign: "center", fontSize: "0.95rem" }}>📊 نظرة عامة</Link></li>
          <li><Link href="/admin/forms" className="btn-cyber-outline" style={{ display: "block", textAlign: "center", fontSize: "0.95rem" }}>📝 مصمم النماذج (Form Builder)</Link></li>
          <li><Link href="/admin/applications" className="btn-cyber-outline" style={{ display: "block", textAlign: "center", fontSize: "0.95rem" }}>📋 طلبات التقديم</Link></li>
          <li><Link href="/admin/rules" className="btn-cyber-outline" style={{ display: "block", textAlign: "center", fontSize: "0.95rem" }}>📜 إدارة القوانين</Link></li>
          <li><Link href="/admin/streamers" className="btn-cyber-outline" style={{ display: "block", textAlign: "center", fontSize: "0.95rem" }}>🎥 إدارة الاستريمرز</Link></li>
          <li><Link href="/admin/moments" className="btn-cyber-outline" style={{ display: "block", textAlign: "center", fontSize: "0.95rem" }}>🎬 أجمل اللحظات</Link></li>
        </ul>
      </aside>
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
