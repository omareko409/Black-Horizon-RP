"use client";

import Link from "next/link";
import { FileText, ShieldAlert, Video, Image, ArrowLeft } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "1rem" }}>
        مرحباً بك في <span style={{ color: "var(--primary)" }}>لوحة تحكم السيرفر ⚙️</span>
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "2.5rem" }}>
        اختر أحد الأقسام الإدارية أدناه لإدارة محتوى الموقع وطلبات التقديم والقوانين.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        {/* Card 1: Applications */}
        <Link href="/admin/applications" className="cyber-card" style={{ textDecoration: "none" }}>
          <FileText size={36} color="var(--primary)" style={{ marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>طلبات التقديم</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>مراجعة وحبول/رفض طلبات الانضمام للسيرفر</p>
        </Link>

        {/* Card 2: Rules */}
        <Link href="/admin/rules" className="cyber-card" style={{ textDecoration: "none" }}>
          <ShieldAlert size={36} color="var(--primary)" style={{ marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>إدارة القوانين</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>إضافة وتعديل وحذف أقسام وبنود قوانين المدينة</p>
        </Link>

        {/* Card 3: Streamers */}
        <Link href="/admin/streamers" className="cyber-card" style={{ textDecoration: "none" }}>
          <Video size={36} color="var(--primary)" style={{ marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>صناع المحتوى</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>إضافة وتعديل روابط وصور استريمرز السيرفر</p>
        </Link>

        {/* Card 4: Moments */}
        <Link href="/admin/moments" className="cyber-card" style={{ textDecoration: "none" }}>
          <Image size={36} color="var(--primary)" style={{ marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>أجمل اللحظات</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>رفع وتعديل مقاطع الفيديو والصور البارزة</p>
        </Link>
      </div>
    </div>
  );
}
