"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

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
        </nav>

        {/* Auth Button (Left in RTL) */}
        <div className="floating-auth">
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

