"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const q = query(collection(db, "applications"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications", error);
      }
      setLoading(false);
    };
    fetchApplications();
  }, []);

  const handleAccept = async (appId, targetUserId) => {
    try {
      const res = await fetch("/api/admin/accept-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId })
      });
      
      if (res.ok) {
        // Update Firestore status
        await updateDoc(doc(db, "applications", appId), {
          status: "accepted"
        });
        // Update local state
        setApplications(apps => apps.map(app => app.id === appId ? { ...app, status: "accepted" } : app));
        alert("تم القبول مبدئياً وتم إعطاء الرتبة وإرسال رسالة بنجاح!");
      } else {
        alert("حدث خطأ أثناء الاتصال بالبوت.");
      }
    } catch (error) {
      console.error(error);
      alert("خطأ في النظام.");
    }
  };

  if (loading) return <div>جاري تحميل التقديمات...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "2rem" }}>طلبات التقديم للمدينة</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {applications.length === 0 ? (
          <p>لا توجد طلبات تقديم حالياً.</p>
        ) : (
          applications.map(app => (
            <div key={app.id} className="glass-panel" style={{ padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                  <img src={app.userAvatar} alt="Avatar" style={{ width: "40px", borderRadius: "50%" }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{app.userName}</h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>ID: {app.userId}</span>
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem", color: "var(--text-muted)" }}>
                  <div><strong>الاسم الحقيقي:</strong> {app.realName}</div>
                  <div><strong>العمر:</strong> {app.age}</div>
                </div>
                
                <div style={{ marginBottom: "1rem" }}>
                  <strong>سبب الانضمام:</strong>
                  <p style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "5px", marginTop: "5px" }}>{app.reason}</p>
                </div>
                
                <div>
                  <strong>الخبرة السابقة:</strong>
                  <p style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "5px", marginTop: "5px" }}>{app.experience}</p>
                </div>
              </div>

              <div style={{ marginLeft: "2rem", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", borderRight: "1px solid var(--glass-border)", paddingRight: "2rem" }}>
                <span style={{ 
                  padding: "5px 15px", 
                  borderRadius: "20px", 
                  fontSize: "0.9rem",
                  background: app.status === "accepted" ? "rgba(74, 222, 128, 0.2)" : "rgba(255, 255, 255, 0.1)",
                  color: app.status === "accepted" ? "#4ade80" : "white" 
                }}>
                  {app.status === "accepted" ? "مقبول مبدئياً" : "قيد المراجعة"}
                </span>
                
                {app.status !== "accepted" && (
                  <button 
                    className="btn-primary" 
                    onClick={() => handleAccept(app.id, app.userId)}
                  >
                    قبول مبدئياً
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
