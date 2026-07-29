"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function StreamersSection() {
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreamers = async () => {
      try {
        const q = query(collection(db, "streamers"), orderBy("createdAt", "desc"), limit(6));
        const snapshot = await getDocs(q);
        setStreamers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching streamers", error);
      }
      setLoading(false);
    };
    fetchStreamers();
  }, []);

  if (loading) return null; // Or a skeleton loader
  if (streamers.length === 0) return null;

  return (
    <section className="container animate-up delay-3" style={{ paddingBottom: "100px" }}>
      <h2 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: "1px", marginBottom: "3rem" }}>
        أبرز صانعي المحتوى
      </h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
        {streamers.map((s) => (
          <a key={s.id} href={s.link} target="_blank" rel="noreferrer" className="glass-panel" style={{ padding: "2rem", textAlign: "center", textDecoration: "none", transition: "transform 0.3s ease", display: "block" }}>
            <div style={{
              width: "120px", height: "120px", borderRadius: "50%", margin: "0 auto 1rem",
              background: `url(${s.imageUrl}) center/cover no-repeat`,
              boxShadow: "0 0 20px rgba(88, 101, 242, 0.4)",
              border: "3px solid #5865F2"
            }} />
            <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "0.5rem" }}>{s.name}</h3>
            {s.followers && <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{s.followers} متابع</p>}
          </a>
        ))}
      </div>
    </section>
  );
}
