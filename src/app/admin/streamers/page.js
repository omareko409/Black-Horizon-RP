"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSession } from "next-auth/react";

const ADMIN_ROLES = ["1531460117956923462", "1532009816623415368"]; // Rules/General Admins & Super Admin

export default function AdminStreamers() {
  const { data: session } = useSession();
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", link: "", followers: "" });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isAdmin = session?.user?.roles?.some(role => ADMIN_ROLES.includes(role));

  const fetchStreamers = async () => {
    try {
      const q = query(collection(db, "streamers"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setStreamers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching streamers", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStreamers();
  }, []);

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const storageRef = ref(storage, `streamers/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
  };

  const handleAddStreamer = async (e) => {
    e.preventDefault();
    if (!formData.name || !imageFile) return alert("يرجى إدخال اسم الاستريمر واختيار صورة!");

    setUploading(true);
    try {
      const imageUrl = await handleImageUpload();

      await addDoc(collection(db, "streamers"), {
        name: formData.name,
        link: formData.link,
        followers: formData.followers,
        imageUrl: imageUrl,
        createdAt: serverTimestamp()
      });

      alert("تمت الإضافة بنجاح!");
      setFormData({ name: "", link: "", followers: "" });
      setImageFile(null);
      fetchStreamers();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ.");
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("تأكيد الحذف؟")) {
      await deleteDoc(doc(db, "streamers", id));
      fetchStreamers();
    }
  };

  if (!isAdmin && session) return <h2 style={{ textAlign: "center", padding: "3rem" }}>لا تملك الصلاحية.</h2>;
  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "2rem" }}>إدارة الاستريمرز</h2>

      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "3rem" }}>
        <h3>إضافة استريمر جديد</h3>
        <form onSubmit={handleAddStreamer} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <input className="form-control" placeholder="اسم الاستريمر" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="form-control" placeholder="رابط البث (Twitch/YouTube)" required value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
          <input className="form-control" placeholder="عدد المتابعين (اختياري، مثلاً: 10K)" value={formData.followers} onChange={e => setFormData({...formData, followers: e.target.value})} />
          <input type="file" className="form-control" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
          
          <button type="submit" className="btn-tech-glow" disabled={uploading}>
            {uploading ? "جاري الرفع..." : "إضافة"}
          </button>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
        {streamers.map(s => (
          <div key={s.id} className="glass-panel" style={{ padding: "1.5rem", textAlign: "center" }}>
            <img src={s.imageUrl} alt={s.name} style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginBottom: "1rem" }} />
            <h4 style={{ marginBottom: "0.5rem" }}>{s.name}</h4>
            <a href={s.link} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", display: "block", marginBottom: "1rem" }}>رابط البث</a>
            <button className="btn-secondary" onClick={() => handleDelete(s.id)}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}
