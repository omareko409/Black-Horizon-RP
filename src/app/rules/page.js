"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function RulesPage() {
  const [activeSection, setActiveSection] = useState("");
  const [rulesData, setRulesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const q = query(collection(db, "rules"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        const fetchedRules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRulesData(fetchedRules);
        if (fetchedRules.length > 0) {
          setActiveSection(fetchedRules[0].id);
        }
      } catch (error) {
        console.error("Error fetching rules", error);
      }
      setLoading(false);
    };
    fetchRules();
  }, []);

  if (loading) {
    return <div className="container" style={{ paddingTop: "120px", textAlign: "center", minHeight: "100vh" }}>جاري تحميل القوانين...</div>;
  }

  if (rulesData.length === 0) {
    return <div className="container" style={{ paddingTop: "120px", textAlign: "center", minHeight: "100vh" }}>لا توجد قوانين حالياً.</div>;
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Background FX */}
      <div className="cyber-bg" />

      {/* Rules Banner Header with Custom Image */}
      <div 
        style={{ 
          width: "100%", 
          minHeight: "35vh", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          alignItems: "center", 
          textAlign: "center", 
          paddingTop: "120px", 
          paddingBottom: "40px",
          background: `linear-gradient(to bottom, rgba(7, 7, 9, 0.7) 0%, rgba(7, 7, 9, 0.9) 100%), url('https://i.postimg.cc/V0n4BMWB/image.jpg') center/cover no-repeat`,
          borderBottom: "1px solid rgba(255, 0, 60, 0.3)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.8)"
        }}
      >
        <h1 className="animate-up" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", fontWeight: 900, marginBottom: "0.8rem", textShadow: "0 4px 20px rgba(0,0,0,0.9)" }}>
          قوانين وسياسة <span style={{ color: "var(--primary)", textShadow: "0 0 25px rgba(255,0,60,0.8)" }}>المدينة</span>
        </h1>
        <p className="animate-up delay-1" style={{ fontSize: "1.15rem", color: "#e4e4e7", maxWidth: "650px", lineHeight: "1.6" }}>
          يرجى قراءة القوانين والالتزام بها لضمان بيئة لعب أدوار عادلة وممتعة لجميع اللاعبين
        </p>
      </div>

      <div className="container" style={{ paddingTop: "40px", paddingBottom: "80px", display: "flex", gap: "2rem", position: "relative", zIndex: 2 }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: "300px", flexShrink: 0 }}>
        <div className="glass-panel" style={{ padding: "1.5rem", position: "sticky", top: "120px" }}>
          <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "10px" }}>الأقسام</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            {rulesData.map((section) => (
              <li key={section.id}>
                <button 
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    width: "100%",
                    textAlign: "right",
                    background: activeSection === section.id ? "rgba(217, 35, 35, 0.2)" : "transparent",
                    color: activeSection === section.id ? "var(--primary)" : "var(--foreground)",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    fontFamily: "inherit",
                    borderLeft: activeSection === section.id ? "4px solid var(--primary)" : "4px solid transparent"
                  }}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Content Area */}
      <main style={{ flex: 1 }}>
        {rulesData.map((section) => (
          <div 
            key={section.id} 
            className="glass-panel" 
            style={{ 
              padding: "3rem", 
              marginBottom: "2rem",
              display: activeSection === section.id ? "block" : "none",
              animation: "fadeIn 0.5s ease"
            }}
          >
            <h1 className="text-primary" style={{ marginBottom: "2rem", fontSize: "2.5rem" }}>{section.title}</h1>
            
            {section.imageUrl && (
              <img src={section.imageUrl} alt={section.title} style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "10px", marginBottom: "2rem" }} />
            )}

            {section.content && (
              <p style={{ lineHeight: "2", fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "1.5rem", whiteSpace: "pre-wrap" }}>
                {section.content}
              </p>
            )}

            {section.items && section.items.length > 0 && (
              <ul style={{ listStyle: "none" }}>
                {section.items.map((item, index) => (
                  <li 
                    key={index} 
                    style={{ 
                      marginBottom: "1rem", 
                      padding: "1rem", 
                      background: "rgba(0,0,0,0.4)", 
                      borderRadius: "8px",
                      border: "1px solid var(--glass-border)",
                      display: "flex",
                      gap: "15px",
                      alignItems: "flex-start",
                      lineHeight: "1.8",
                      fontSize: "1.1rem"
                    }}
                  >
                    <span style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "1.2rem" }}>{index + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
      </div>
    </div>
  );
}
