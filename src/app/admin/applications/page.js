"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { Check, X, ShieldAlert, Award, User, Calendar } from "lucide-react";

const SUPER_ADMINS = ["1531460117956923462", "1532009816623415368"];
const POLICE_ADMINS = ["1526502942494949376", "1526503214881443861"];
const HEALTH_ADMINS = ["1532420174404255936", "1532370272387334246"];

const DEPT_GUILD_ID = "1526502762878210098";
const MAIN_GUILD_ID = "1531459871902404738";

export default function ApplicationsAdmin() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const mainRoles = session?.user?.mainRoles || [];
  const deptRoles = session?.user?.deptRoles || [];
  const allUserRoles = [...mainRoles, ...deptRoles];

  const isSuperAdmin = SUPER_ADMINS.some(r => allUserRoles.includes(r));
  const isPoliceAdmin = POLICE_ADMINS.some(r => allUserRoles.includes(r));
  const isHealthAdmin = HEALTH_ADMINS.some(r => allUserRoles.includes(r));

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "applications"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter by admin permission
      const filtered = docs.filter(app => {
        if (isSuperAdmin) return true;
        if (app.category === "police" && isPoliceAdmin) return true;
        if (app.category === "health" && isHealthAdmin) return true;
        if (app.category === "whitelist" && isSuperAdmin) return true;
        return false;
      });

      setApplications(filtered);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [session]);

  const handleAction = async (app, actionType) => {
    setProcessingId(app.id);

    let roleId = "";
    let guildId = MAIN_GUILD_ID;
    let message = "";
    let isReject = false;
    let statusText = "accepted";

    if (actionType === "police_initial") {
      roleId = "1526503765832892577";
      guildId = DEPT_GUILD_ID;
      message = "🎉 مبروك! لقد تم **قبولك مبدئياً** في وزارة الداخلية (الشرطة). يرجى التوجه لسيرفر الشرطة لإكمال المقابلة الشخصية.";
    } else if (actionType === "police_final") {
      roleId = "1532047410300457020";
      guildId = DEPT_GUILD_ID;
      message = "🎖️ مبروك! لقد تم **قبولك نهائياً** وتعيينك رسمياً في كادر وزارة الداخلية!";
    } else if (actionType === "health_initial") {
      roleId = "1532491505997058148";
      guildId = DEPT_GUILD_ID;
      message = "🎉 مبروك! لقد تم **قبولك مبدئياً** في وزارة الصحة. يرجى التوجه لسيرفر الصحة لإكمال المقابلة الشخصية.";
    } else if (actionType === "health_final") {
      roleId = "1532421646575468615";
      guildId = DEPT_GUILD_ID;
      message = "🩺 مبروك! لقد تم **قبولك نهائياً** وتعيينك رسمياً في كادر وزارة الصحة!";
    } else if (actionType === "whitelist_accept") {
      roleId = "1531461920136364112";
      guildId = MAIN_GUILD_ID;
      message = "🎉 مبروك! تم قبول طلبك ورتبة الوايت ليست بنجاح في مدينة Black Horizon RP!";
    } else if (actionType === "reject") {
      isReject = true;
      statusText = "rejected";
      message = "❌ نعتذر منك، لقد تم رفض طلب التقديم الخاص بك في الوقت الحالي. نرحب بتقديمك مرة أخرى مستقبلاً.";
    }

    try {
      // 1. Call Discord API Endpoint
      await fetch("/api/admin/accept-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: app.applicantId,
          roleId,
          guildId,
          message,
          isReject
        })
      });

      // 2. Update Firestore Doc Status
      await updateDoc(doc(db, "applications", app.id), {
        status: statusText,
        reviewedBy: session?.user?.name || "Admin",
        reviewedAt: new Date().toISOString()
      });

      // Update local state
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: statusText } : a));
      alert("تم تنفيذ الإجراء وإرسال الإشعار للمتقدم بنجاح! 🎉");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء تنفيذ الإجراء.");
    }
    setProcessingId(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "1.5rem" }}>
        إدارة طلبات التقديم <span style={{ color: "var(--primary)" }}>(Applications)</span>
      </h1>

      {loading ? (
        <div>جاري تحميل الطلبات...</div>
      ) : applications.length === 0 ? (
        <div className="cyber-card" style={{ padding: "3rem", textAlign: "center" }}>لا توجد طلبات تقديم حالياً لحسابك.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {applications.map((app) => (
            <div key={app.id} className="glass-panel" style={{ padding: "2rem", border: "1px solid var(--glass-border)", borderRadius: "20px" }}>
              
              {/* Header Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img src={app.applicantImage || "https://cdn.discordapp.com/embed/avatars/0.png"} alt="" style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: "1.2rem", margin: 0, fontWeight: 800 }}>{app.applicantName}</h3>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>ID: {app.applicantId}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ background: "rgba(255,0,60,0.15)", border: "1px solid var(--primary)", color: "#fff", padding: "4px 14px", borderRadius: "50px", fontSize: "0.9rem", fontWeight: "bold" }}>
                    {app.category === "police" ? "🚓 وزارة الداخلية" : app.category === "health" ? "🏥 وزارة الصحة" : "📜 الوايت ليست"}
                  </span>

                  <span style={{
                    background: app.status === "accepted" ? "rgba(16,185,129,0.2)" : app.status === "rejected" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)",
                    color: app.status === "accepted" ? "#10b981" : app.status === "rejected" ? "#ef4444" : "#f59e0b",
                    padding: "4px 14px", borderRadius: "50px", fontSize: "0.9rem", fontWeight: "bold"
                  }}>
                    {app.status === "accepted" ? "مقبول ✅" : app.status === "rejected" ? "مرفوض ❌" : "قيد الانتظار ⏳"}
                  </span>
                </div>
              </div>

              {/* Answers View */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2rem" }}>
                {app.questions?.map((q, idx) => (
                  <div key={idx} style={{ background: "rgba(0,0,0,0.4)", padding: "1.2rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.95rem", marginBottom: "0.4rem" }}>
                      س: {q.label}
                    </div>
                    <div style={{ color: "#fff", fontSize: "1.05rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      ج: {app.answers?.[q.id] || "لا توجد إجابة"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons based on category */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
                {app.category === "police" && (
                  <>
                    <button
                      disabled={processingId === app.id}
                      onClick={() => handleAction(app, "police_initial")}
                      className="btn-cyber-primary"
                      style={{ borderRadius: "50px", fontSize: "0.95rem", padding: "10px 20px" }}
                    >
                      🚓 مقبول مبدئياً شرطة
                    </button>
                    <button
                      disabled={processingId === app.id}
                      onClick={() => handleAction(app, "police_final")}
                      className="btn-cyber-primary"
                      style={{ borderRadius: "50px", fontSize: "0.95rem", padding: "10px 20px", background: "linear-gradient(45deg, #10b981, #059669)" }}
                    >
                      👮‍♂️ مقبول نهائي شرطة
                    </button>
                  </>
                )}

                {app.category === "health" && (
                  <>
                    <button
                      disabled={processingId === app.id}
                      onClick={() => handleAction(app, "health_initial")}
                      className="btn-cyber-primary"
                      style={{ borderRadius: "50px", fontSize: "0.95rem", padding: "10px 20px" }}
                    >
                      🚑 مقبول مبدئياً صحة
                    </button>
                    <button
                      disabled={processingId === app.id}
                      onClick={() => handleAction(app, "health_final")}
                      className="btn-cyber-primary"
                      style={{ borderRadius: "50px", fontSize: "0.95rem", padding: "10px 20px", background: "linear-gradient(45deg, #10b981, #059669)" }}
                    >
                      👨‍⚕️ مقبول نهائي صحة
                    </button>
                  </>
                )}

                {app.category === "whitelist" && (
                  <button
                    disabled={processingId === app.id}
                    onClick={() => handleAction(app, "whitelist_accept")}
                    className="btn-cyber-primary"
                    style={{ borderRadius: "50px", fontSize: "0.95rem", padding: "10px 20px", background: "linear-gradient(45deg, #10b981, #059669)" }}
                  >
                    ✅ قبول الوايت ليست
                  </button>
                )}

                <button
                  disabled={processingId === app.id}
                  onClick={() => handleAction(app, "reject")}
                  className="btn-cyber-outline"
                  style={{ borderRadius: "50px", fontSize: "0.95rem", padding: "10px 20px", borderColor: "#ef4444", color: "#ef4444" }}
                >
                  ❌ رفض الطلب
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
