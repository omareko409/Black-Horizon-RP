"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ShieldCheck, Lock, Send, CheckCircle2 } from "lucide-react";

const WHITELIST_ROLE_ID = "1531461920136364112";

const CATEGORIES = [
  { id: "whitelist", name: "التقديم العام (الوايت ليست)" },
  { id: "police", name: "وزارة الداخلية (الشرطة)" },
  { id: "health", name: "وزارة الصحة (المراد)" },
];

export default function ApplyPage() {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState("whitelist");
  const [isOpen, setIsOpen] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const mainRoles = session?.user?.mainRoles || [];
  const hasWhitelistRole = mainRoles.includes(WHITELIST_ROLE_ID);

  const loadFormConfig = async (catId) => {
    setLoading(true);
    setSubmitted(false);
    setFormData({});
    try {
      const docRef = doc(db, "forms", catId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsOpen(data.isOpen !== false);
        setQuestions(data.questions || []);
      } else {
        setIsOpen(true);
        setQuestions([
          { id: "q1", label: "الاسم الخماسي الكامل (حقيقي)", type: "text", required: true },
          { id: "q2", label: "العمر الحقيقي", type: "text", required: true },
          { id: "q3", label: "خبراتك سابقة في الرول بلاي", type: "textarea", required: true }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFormConfig(selectedCategory);
  }, [selectedCategory]);

  const handleInputChange = (qId, value) => {
    setFormData((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "applications"), {
        category: selectedCategory,
        applicantId: session?.user?.id,
        applicantName: session?.user?.name,
        applicantImage: session?.user?.image,
        answers: formData,
        questions: questions,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Submission error", error);
      alert("حدث خطأ أثناء إرسال الطلب.");
    }
    setSubmitting(false);
  };

  // Check Whitelist requirement for Police/Health
  const requiresWhitelist = selectedCategory === "police" || selectedCategory === "health";
  const canApplyForCategory = !requiresWhitelist || hasWhitelistRole;

  return (
    <div className="container" style={{ paddingTop: "130px", paddingBottom: "100px", maxWidth: "850px" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, textTransform: "uppercase" }}>
          تقديم طلب انضمام <span style={{ color: "var(--primary)" }}>Black Horizon RP</span>
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.8rem", fontSize: "1.1rem" }}>
          اختر قسم التقديم وقم بملء النموذج بدقة
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", marginBottom: "3rem", flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={selectedCategory === cat.id ? "btn-cyber-primary" : "btn-cyber-outline"}
            style={{ 
              borderRadius: "50px", 
              fontSize: "1.1rem", 
              padding: "14px 32px",
              boxShadow: selectedCategory === cat.id ? "0 0 25px rgba(255, 0, 60, 0.6)" : "none",
              transition: "all 0.3s ease"
            }}
          >
            {cat.id === "whitelist" ? "📜 " : cat.id === "police" ? "🚓 " : "🏥 "}
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>جاري تحميل نموذج التقديم...</div>
      ) : submitted ? (
        <div className="cyber-card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <CheckCircle2 size={64} color="#10b981" style={{ margin: "0 auto 1.5rem auto" }} />
          <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#10b981", marginBottom: "1rem" }}>
            تم إرسال طلبك بنجاح! 🎉
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", lineHeight: 1.6 }}>
            سيتم مراجعة طلبك من قبل الإدارة المختصة وإبلاغك بالنتيجة عبر رسائل الديسكورد الخاصة.
          </p>
        </div>
      ) : !canApplyForCategory ? (
        <div className="cyber-card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <Lock size={60} color="var(--primary)" style={{ margin: "0 auto 1.5rem auto" }} />
          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--primary)", marginBottom: "1rem" }}>
            التقديم غير متاح لك حالياً ⛔
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", lineHeight: 1.6 }}>
            عفواً! التقديم على الوظائف الحكومية (الشرطة / الصحة) يتطلب الحصول على **رتبة الوايت ليست** أولاً في ديسكورد المدينة!
          </p>
        </div>
      ) : !isOpen ? (
        <div className="cyber-card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <Lock size={60} color="var(--primary)" style={{ margin: "0 auto 1.5rem auto" }} />
          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--primary)", marginBottom: "1rem" }}>
            التقديم مغلق حالياً 🔴
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.15rem" }}>
            نعتذر، تم إغلاق التقديم لهذا القسم من قبل الإدارة حالياً. يرجى المتابعة لاحقاً.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "3rem 2.5rem", borderRadius: "24px", border: "1px solid var(--glass-border)" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "2rem", color: "var(--primary)", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
            أسئلة التقديم - {CATEGORIES.find(c => c.id === selectedCategory)?.name}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "2.5rem" }}>
            {questions.map((q) => (
              <div key={q.id}>
                <label style={{ display: "block", marginBottom: "0.8rem", fontWeight: 700, fontSize: "1.1rem" }}>
                  {q.label} {q.required && <span style={{ color: "var(--primary)" }}>*</span>}
                </label>

                {q.type === "textarea" ? (
                  <textarea
                    rows={4}
                    required={q.required}
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      background: "rgba(0,0,0,0.5)",
                      border: "1px solid rgba(255,0,60,0.3)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontFamily: "inherit",
                      fontSize: "1rem"
                    }}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    required={q.required}
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      background: "rgba(0,0,0,0.5)",
                      border: "1px solid rgba(255,0,60,0.3)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontFamily: "inherit",
                      fontSize: "1rem"
                    }}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-cyber-primary"
            style={{ width: "100%", padding: "16px", fontSize: "1.2rem", justifyContent: "center", borderRadius: "50px" }}
          >
            {submitting ? "جاري الإرسال..." : "إرسال طلب التقديم 🔥"} <Send size={20} />
          </button>
        </form>
      )}
    </div>
  );
}
