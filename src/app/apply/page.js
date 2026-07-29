"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ApplyPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    realName: "",
    age: "",
    discordName: "",
    reason: "",
    experience: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (status === "loading") {
    return <div className="container" style={{ paddingTop: "120px", textAlign: "center" }}>جاري التحميل...</div>;
  }

  if (!session) {
    return (
      <div className="container" style={{ paddingTop: "120px", textAlign: "center", minHeight: "100vh" }}>
        <h1 style={{ marginBottom: "2rem" }}>التقديم للمدينة</h1>
        <div className="glass-panel" style={{ padding: "3rem", maxWidth: "500px", margin: "0 auto" }}>
          <h2 style={{ marginBottom: "1rem" }}>يجب تسجيل الدخول أولاً</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
            لا يمكنك التقديم إلا بعد ربط حساب الديسكورد الخاص بك.
          </p>
          <button className="btn-primary" onClick={() => signIn("discord")}>
            تسجيل الدخول بديسكورد
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "applications"), {
        ...formData,
        userId: session.user.id,
        userName: session.user.name,
        userAvatar: session.user.image,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting application", error);
      alert("حدث خطأ أثناء إرسال التقديم.");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="container" style={{ paddingTop: "120px", textAlign: "center", minHeight: "100vh" }}>
        <div className="glass-panel" style={{ padding: "3rem", maxWidth: "500px", margin: "0 auto" }}>
          <h2 style={{ color: "#4ade80", marginBottom: "1rem" }}>تم إرسال التقديم بنجاح!</h2>
          <p style={{ color: "var(--text-muted)" }}>
            الرجاء انتظار رد الإدارة. سيتم إرسال رسالة لك على الخاص في ديسكورد عند القبول.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "120px", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>نموذج التقديم</h1>
      
      <div className="glass-panel" style={{ padding: "3rem", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "2rem", padding: "1rem", background: "rgba(0,0,0,0.3)", borderRadius: "8px" }}>
          <img src={session.user.image} alt="Avatar" style={{ width: "50px", borderRadius: "50%" }} />
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>مقدم الطلب:</div>
            <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{session.user.name}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>الاسم الحقيقي</label>
            <input 
              required 
              type="text" 
              className="form-control" 
              value={formData.realName}
              onChange={(e) => setFormData({...formData, realName: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>العمر</label>
            <input 
              required 
              type="number" 
              className="form-control" 
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>لماذا تريد الانضمام إلى سيرفرنا؟</label>
            <textarea 
              required 
              className="form-control" 
              rows="4"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            ></textarea>
          </div>

          <div className="form-group">
            <label>خبرتك السابقة في الرول بلاي</label>
            <textarea 
              required 
              className="form-control" 
              rows="4"
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
            ></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={submitting}>
            {submitting ? "جاري الإرسال..." : "إرسال التقديم"}
          </button>
        </form>
      </div>
    </div>
  );
}
