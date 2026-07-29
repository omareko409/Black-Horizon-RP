"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSession } from "next-auth/react";

const ADMIN_ROLES = ["1531460117956923462", "1532009816623415368"]; 

export default function AdminMoments() {
  const { data: session } = useSession();
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "" });
  const [mediaFile, setMediaFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isAdmin = session?.user?.roles?.some(role => ADMIN_ROLES.includes(role));

  const fetchMoments = async () => {
    try {
      const q = query(collection(db, "moments"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setMoments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching moments", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  const handleMediaUpload = async () => {
    if (!mediaFile) return null;
    const storageRef = ref(storage, `moments/${Date.now()}_${mediaFile.name}`);
    await uploadBytes(storageRef, mediaFile);
    return await getDownloadURL(storageRef);
  };

  const handleAddMoment = async (e) => {
    e.preventDefault();
    if (!mediaFile) return alert("يرجى اختيار صورة أو مقطع فيديو!");

    setUploading(true);
    try {
      const mediaUrl = await handleMediaUpload();
      const isVideo = mediaFile.type.startsWith("video/");

      await addDoc(collection(db, "moments"), {
        title: formData.title,
        mediaUrl: mediaUrl,
        type: isVideo ? "video" : "image",
        createdAt: serverTimestamp()
      });

      alert("تمت الإضافة بنجاح!");
      setFormData({ title: "" });
      setMediaFile(null);
      fetchMoments();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الرفع.");
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("تأكيد الحذف؟")) {
      await deleteDoc(doc(db, "moments", id));
      fetchMoments();
    }
  };

  if (!isAdmin && session) return <h2 style={{ textAlign: "center", padding: "3rem" }}>لا تملك الصلاحية.</h2>;
  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "2rem" }}>إدارة أجمل اللحظات</h2>

      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "3rem" }}>
        <h3>إضافة لحظة جديدة</h3>
        <form onSubmit={handleAddMoment} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <input className="form-control" placeholder="عنوان المقطع (اختياري)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input type="file" className="form-control" accept="image/*,video/*" required onChange={e => setMediaFile(e.target.files[0])} />
          
          <button type="submit" className="btn-tech-glow" disabled={uploading}>
            {uploading ? "جاري الرفع..." : "إضافة"}
          </button>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {moments.map(m => (
          <div key={m.id} className="glass-panel" style={{ overflow: "hidden", textAlign: "center" }}>
            {m.type === "video" ? (
              <video src={m.mediaUrl} controls style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            ) : (
              <img src={m.mediaUrl} alt={m.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            )}
            <div style={{ padding: "1rem" }}>
              <h4>{m.title || "بدون عنوان"}</h4>
              <button className="btn-secondary" style={{ marginTop: "1rem", width: "100%" }} onClick={() => handleDelete(m.id)}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
