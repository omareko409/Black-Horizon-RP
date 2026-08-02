"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { Plus, Trash2, Save, Power, Check } from "lucide-react";

const CATEGORIES = [
  { id: "whitelist", name: "التقديم العام (الوايت ليست)" },
  { id: "police", name: "وزارة الداخلية (الشرطة)" },
  { id: "health", name: "وزارة الصحة (المراد)" },
];

const SUPER_ADMINS = ["1531460117956923462", "1532009816623415368"];
const POLICE_ADMINS = ["1526502942494949376", "1526503214881443861"];
const HEALTH_ADMINS = ["1532420174404255936", "1532370272387334246"];

export default function FormBuilder() {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState("whitelist");
  const [isOpen, setIsOpen] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const mainRoles = session?.user?.mainRoles || [];
  const deptRoles = session?.user?.deptRoles || [];
  const allUserRoles = [...mainRoles, ...deptRoles];

  const isSuperAdmin = SUPER_ADMINS.some(r => allUserRoles.includes(r));
  const isPoliceAdmin = POLICE_ADMINS.some(r => allUserRoles.includes(r));
  const isHealthAdmin = HEALTH_ADMINS.some(r => allUserRoles.includes(r));

  // Determine allowed categories for current user
  const allowedCategories = CATEGORIES.filter(cat => {
    if (isSuperAdmin) return true;
    if (cat.id === "police" && isPoliceAdmin) return true;
    if (cat.id === "health" && isHealthAdmin) return true;
    return false;
  });

  const loadFormConfig = async (catId) => {
    setLoading(true);
    try {
      const docRef = doc(db, "forms", catId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsOpen(data.isOpen !== false);
        setQuestions(data.questions || []);
      } else {
        // Default initial questions if none exist
        setIsOpen(true);
        setQuestions([
          { id: "q1", label: "الاسم الخماسي الكامل (حقيقي)", type: "text", required: true },
          { id: "q2", label: "العمر الحقيقي", type: "text", required: true },
          { id: "q3", label: "خبراتك سابقة في الرول بلاي", type: "textarea", required: true }
        ]);
      }
    } catch (e) {
      console.error("Error loading form config", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (allowedCategories.length > 0) {
      // Set to first allowed if selected is not allowed
      const isAllowed = allowedCategories.some(c => c.id === selectedCategory);
      if (!isAllowed) {
        setSelectedCategory(allowedCategories[0].id);
        loadFormConfig(allowedCategories[0].id);
      } else {
        loadFormConfig(selectedCategory);
      }
    }
  }, [selectedCategory, session]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: `q_${Date.now()}`, label: "", type: "text", required: true }
    ]);
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "forms", selectedCategory), {
        categoryId: selectedCategory,
        isOpen: isOpen,
        questions: questions,
        updatedAt: serverTimestamp(),
        updatedBy: session?.user?.name || "Admin"
      });
      alert("تم حفظ النموذج بنجاح! 🎉");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الحفظ.");
    }
    setSaving(false);
  };

  if (allowedCategories.length === 0) {
    return <h2 style={{ textAlign: "center", padding: "3rem" }}>لا تملك صلاحية لتعديل النماذج.</h2>;
  }

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "1.5rem" }}>
        مصمم النماذج <span style={{ color: "var(--primary)" }}>(Form Builder)</span>
      </h1>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {allowedCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={selectedCategory === cat.id ? "btn-cyber-primary" : "btn-cyber-outline"}
            style={{ borderRadius: "50px" }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div>جاري تحميل الإعدادات...</div>
      ) : (
        <div className="glass-panel" style={{ padding: "2rem", border: "1px solid var(--glass-border)" }}>
          
          {/* Status Toggle (Open/Closed) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>حالة التقديم</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>يمكنك فتح أو إغلاق التقديم لهذا القسم في أي وقت</p>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                background: isOpen ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                border: `2px solid ${isOpen ? "#10b981" : "#ef4444"}`,
                color: isOpen ? "#10b981" : "#ef4444",
                padding: "10px 24px",
                borderRadius: "50px",
                fontWeight: "bold",
                fontSize: "1.1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Power size={18} /> {isOpen ? "التقديم مفتوح 🟢" : "التقديم مغلق 🔴"}
            </button>
          </div>

          {/* Questions Builder */}
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.5rem" }}>أسئلة النموذج</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
            {questions.map((q, index) => (
              <div key={q.id || index} className="cyber-card" style={{ padding: "1.5rem", position: "relative" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 40px", gap: "1rem", alignItems: "center" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="نص السؤال..."
                    value={q.label}
                    onChange={(e) => handleUpdateQuestion(index, "label", e.target.value)}
                  />

                  <select
                    className="form-control"
                    value={q.type}
                    onChange={(e) => handleUpdateQuestion(index, "type", e.target.value)}
                  >
                    <option value="text">نص قصير (Input)</option>
                    <option value="textarea">نص طويل (Paragraph)</option>
                  </select>

                  <button
                    onClick={() => handleDeleteQuestion(index)}
                    style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button className="btn-cyber-outline" onClick={handleAddQuestion} style={{ borderRadius: "50px" }}>
              إضافة سؤال جديد <Plus size={18} />
            </button>

            <button className="btn-cyber-primary" onClick={handleSave} disabled={saving} style={{ borderRadius: "50px", padding: "12px 36px" }}>
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"} <Save size={18} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
