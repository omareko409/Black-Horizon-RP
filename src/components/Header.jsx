"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  const mainRoles = session?.user?.mainRoles || [];
  const deptRoles = session?.user?.deptRoles || [];
  const allRoles = [...mainRoles, ...deptRoles];

  const ADMIN_ROLES = [
    "1531460117956923462", "1532009816623415368",
    "1526502942494949376", "1526503214881443861",
    "1532420174404255936", "1532370272387334246"
  ];

  const isAdmin = ADMIN_ROLES.some(r => allRoles.includes(r));

  return (
    <header className="floating-header">
      <div className="floating-header-container">
        
        {/* Logo (Right in RTL) */}
        <Link href="/" className="floating-logo">
          <img src="https://files.catbox.moe/3hvxas.png" alt="Server Logo" />
        </Link>

        {/* Links (Center) */}
        <nav className="floating-nav-links">
          <Link href="/">الرئيسية</Link>
          <Link href="/apply">التقديم</Link>
          <Link href="/rules">القوانين</Link>
          <Link href="/status">حالة السيرفر</Link>
          {isAdmin && (
            <Link href="/admin" style={{ color: "var(--primary)", fontWeight: "bold" }}>⚡ لوحة الإدارة</Link>
          )}
        </nav>

        {/* Auth Button (Left in RTL) */}
        <div className="floating-auth" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <a 
            href="https://discord.gg/PmhbYNPSn" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-discord-join-nav"
          >
            💬 انضم للديسكورد
          </a>
          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button className="btn-pill-discord" onClick={() => signOut()}>تسجيل الخروج</button>
              <img 
                src={session.user.image} 
                alt="Avatar" 
                style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid #5865F2" }}
              />
            </div>
          ) : (
            <button className="btn-pill-discord" onClick={() => signIn("discord")}>تسجيل الدخول</button>
          )}
        </div>
        
      </div>
    </header>
  );
}

