"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function MomentsSection() {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const q = query(collection(db, "moments"), orderBy("createdAt", "desc"), limit(4));
        const snapshot = await getDocs(q);
        setMoments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching moments", error);
      }
      setLoading(false);
    };
    fetchMoments();
  }, []);

  if (loading) return null;
  if (moments.length === 0) return null;

  return (
    <section className="container animate-up delay-3" style={{ paddingBottom: "100px" }}>
      <h2 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: "1px", marginBottom: "3rem" }}>
        أجمل اللحظات
      </h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
        {moments.map((m) => (
          <div key={m.id} className="glass-panel" style={{ overflow: "hidden", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            {m.type === "video" ? (
              <video src={m.mediaUrl} controls style={{ width: "100%", height: "250px", objectFit: "cover", display: "block" }} />
            ) : (
              <img src={m.mediaUrl} alt={m.title} style={{ width: "100%", height: "250px", objectFit: "cover", display: "block" }} />
            )}
            {m.title && (
              <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)" }}>
                <h3 style={{ fontSize: "1.2rem", margin: 0, color: "#fff" }}>{m.title}</h3>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
