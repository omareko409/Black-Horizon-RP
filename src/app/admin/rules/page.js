"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSession } from "next-auth/react";

const RULE_ADMIN_ROLES = ["1531460117956923462", "1532009816623415368"];

export default function AdminRules() {
  const { data: session } = useSession();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", content: "", imageUrl: "", items: "" });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isRuleAdmin = session?.user?.roles?.some(role => RULE_ADMIN_ROLES.includes(role));

  const fetchRules = async () => {
    try {
      const q = query(collection(db, "rules"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      setRules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching rules", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const storageRef = ref(storage, `rules/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert("يرجى كتابة عنوان القانون");

    setUploading(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        finalImageUrl = await handleImageUpload();
      }

      // Convert items string (separated by new line) to array
      const itemsArray = formData.items ? formData.items.split("\n").filter(item => item.trim() !== "") : [];

      await addDoc(collection(db, "rules"), {
        title: formData.title,
        content: formData.content,
        imageUrl: finalImageUrl,
        items: itemsArray,
        createdAt: serverTimestamp()
      });

      alert("تمت إضافة القانون بنجاح!");
      setFormData({ title: "", content: "", imageUrl: "", items: "" });
      setImageFile(null);
      fetchRules();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إضافة القانون.");
    }
    setUploading(false);
  };

  const handleDeleteRule = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا القسم من القوانين؟")) {
      await deleteDoc(doc(db, "rules", id));
      fetchRules();
    }
  };

  if (!isRuleAdmin && session) {
    return (
      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center" }}>
        <h2 style={{ color: "var(--primary)" }}>عفواً، لا تملك صلاحية تعديل القوانين.</h2>
      </div>
    );
  }

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "2rem" }}>إدارة القوانين</h2>

      {/* Add Rule Form */}
      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "3rem" }}>
        <h3 style={{ marginBottom: "1.5rem" }}>إضافة قسم قوانين جديد</h3>
        <form onSubmit={handleAddRule}>
          <div className="form-group">
            <label>عنوان القسم (مثال: القوانين العامة)</label>
            <input type="text" className="form-control" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="form-group">
            <label>وصف عام للقسم (اختياري)</label>
            <textarea className="form-control" rows="3" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}></textarea>
          </div>

          <div className="form-group">
            <label>القوانين (اكتب كل قانون في سطر جديد)</label>
            <textarea className="form-control" rows="6" value={formData.items} onChange={(e) => setFormData({...formData, items: e.target.value})} placeholder="القانون الأول&#10;القانون الثاني..."></textarea>
          </div>

          <div className="form-group" style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label>رابط صورة للقانون (اختياري)</label>
              <input type="url" className="form-control" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
            </div>
            <div style={{ flex: 1 }}>
              <label>أو رفع صورة من الجهاز</label>
              <input type="file" className="form-control" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading ? "جاري الإضافة..." : "إضافة القانون"}
          </button>
        </form>
      </div>

      {/* List Existing Rules */}
      <h3 style={{ marginBottom: "1.5rem" }}>الأقسام الحالية</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {rules.map(rule => (
          <div key={rule.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h4 style={{ color: "var(--primary)", fontSize: "1.2rem", marginBottom: "0.5rem" }}>{rule.title}</h4>
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>يحتوي على {rule.items?.length || 0} قوانين.</span>
            </div>
            <button className="btn-primary" style={{ background: "transparent", border: "1px solid var(--primary)", padding: "8px 16px" }} onClick={() => handleDeleteRule(rule.id)}>حذف</button>
          </div>
        ))}
        {rules.length === 0 && <p>لا يوجد قوانين مضافة حالياً.</p>}
      </div>
    </div>
  );
}
