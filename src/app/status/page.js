"use client";

import { useState, useEffect } from "react";

export default function StatusPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching server status from an API
    setTimeout(() => {
      setStatus({
        online: true,
        players: 124,
        maxPlayers: 256,
        ping: 45,
        uptime: "99.9%",
        lastRestart: "04:00 AM",
      });
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="container" style={{ paddingTop: "150px", minHeight: "100vh" }}>
      <h1 className="text-gradient animate-up" style={{ textAlign: "center", fontSize: "3.5rem", marginBottom: "3rem" }}>
        حالة السيرفر
      </h1>

      {loading ? (
        <div className="animate-up delay-1" style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <div className="loader-spinner" style={{ margin: "0 auto", marginBottom: "1rem" }}></div>
          جاري جلب بيانات السيرفر...
        </div>
      ) : (
        <div 
          className="glass-panel animate-up delay-1 status-card" 
          style={{ 
            maxWidth: "800px", 
            margin: "0 auto", 
            padding: "3rem",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Server Online Indicator */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "3rem" }}>
            <div className={`status-dot ${status?.online ? 'online' : 'offline'}`}></div>
            <h2 style={{ fontSize: "2rem", margin: 0 }}>
              {status?.online ? 'السيرفر يعمل الآن' : 'السيرفر متوقف'}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
            <div className="status-item">
              <div className="status-icon">🎮</div>
              <div className="status-label">اللاعبين المتصلين</div>
              <div className="status-value">{status?.players} / {status?.maxPlayers}</div>
            </div>
            
            <div className="status-item">
              <div className="status-icon">📶</div>
              <div className="status-label">جودة الاتصال (Ping)</div>
              <div className="status-value">{status?.ping} ms</div>
            </div>

            <div className="status-item">
              <div className="status-icon">⚡</div>
              <div className="status-label">نسبة التشغيل</div>
              <div className="status-value">{status?.uptime}</div>
            </div>

            <div className="status-item">
              <div className="status-icon">🔄</div>
              <div className="status-label">آخر تحديث/ريستارت</div>
              <div className="status-value">{status?.lastRestart}</div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .status-card {
          transition: all 0.4s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .status-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 40px rgba(217, 35, 35, 0.15);
          border-color: rgba(217, 35, 35, 0.3);
        }

        .status-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          box-shadow: 0 0 15px currentColor;
        }
        .status-dot.online {
          background-color: #4ade80;
          color: #4ade80;
          animation: blink 2s infinite ease-in-out;
        }
        .status-dot.offline {
          background-color: #f87171;
          color: #f87171;
        }

        @keyframes blink {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        .status-item {
          background: rgba(0, 0, 0, 0.4);
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        .status-item:hover {
          background: rgba(217, 35, 35, 0.1);
          border-color: rgba(217, 35, 35, 0.3);
          transform: translateY(-10px);
        }

        .status-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          transition: transform 0.3s ease;
        }
        .status-item:hover .status-icon {
          transform: scale(1.2) rotate(5deg);
        }

        .status-label {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .status-value {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--foreground);
        }
      `}} />
    </div>
  );
}
