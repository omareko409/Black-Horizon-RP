"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const features = [
  {
    id: "partner",
    title: "شريكك في الإجرام",
    desc: "نظام عصابات متطور يمنحك السيطرة الكاملة على مناطق النفوذ وتجارة الأسلحة.",
    image: "https://files.catbox.moe/example-gang.jpg", // Placeholder
    tooltip: "زيادة في أرباح العصابات بنسبة 20% هذا الأسبوع",
    tooltipPos: { top: "20%", right: "10%" }
  },
  {
    id: "decisions",
    title: "قرارات أكثر ذكاءً",
    desc: "نظام اقتصادي واقعي مبني على العرض والطلب، حيث كل دولار تصرفه يؤثر على المدينة.",
    image: "https://files.catbox.moe/example-eco.jpg",
    tooltip: "اقتصاد متوازن 100%",
    tooltipPos: { top: "40%", right: "20%" }
  },
  {
    id: "control",
    title: "برج المراقبة الذكي",
    desc: "نظام شرطة متكامل مع كاميرات مراقبة ورادارات ذكية في كل أنحاء المدينة.",
    image: "https://files.catbox.moe/example-police.jpg",
    tooltip: "تغطية أمنية شاملة",
    tooltipPos: { top: "30%", right: "15%" }
  }
];

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(features[0].id);

  const activeFeature = features.find(f => f.id === activeTab);

  return (
    <div style={{ display: "flex", gap: "4rem", alignItems: "center", minHeight: "500px", marginTop: "100px" }}>
      
      {/* Sidebar Tabs */}
      <div style={{ flex: "0 0 350px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {features.map((feature) => (
          <div 
            key={feature.id}
            className={`feature-tab ${activeTab === feature.id ? 'active' : ''}`}
            onClick={() => setActiveTab(feature.id)}
          >
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem", transition: "color 0.3s ease", color: activeTab === feature.id ? "white" : "var(--text-muted)" }}>
              {feature.title}
            </h3>
            {activeTab === feature.id && (
              <p style={{ fontSize: "1rem", lineHeight: "1.6", margin: 0, animation: "slideUpFade 0.5s ease" }}>
                {feature.desc}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Content Pane */}
      <div style={{ flex: 1, position: "relative" }}>
        <div 
          className="glass-panel" 
          style={{ 
            height: "400px", 
            width: "100%", 
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          {/* Mock Graphic Lines (simulating data charts) */}
          <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.2 }}>
             <path d="M0,300 Q100,200 200,250 T400,150 T600,200" fill="none" stroke="#2DD4BF" strokeWidth="3" />
             <path d="M0,350 Q150,250 250,300 T500,200 T700,100" fill="none" stroke="#6366F1" strokeWidth="2" />
          </svg>

          {/* We would use an actual image tag here, but using a placeholder box for now */}
          <div style={{ textAlign: "center", zIndex: 1 }}>
             <h2 style={{ color: "rgba(255,255,255,0.2)", fontSize: "2rem" }}>صورة أو لوحة تحكم للعبة هنا</h2>
          </div>

          {/* Floating Tooltip */}
          {activeFeature && (
            <div 
              key={activeFeature.id} // Re-mounts to re-trigger animation
              className="floating-tooltip"
              style={{ top: activeFeature.tooltipPos.top, right: activeFeature.tooltipPos.right }}
            >
              <div className="tooltip-icon-check">
                <Check size={14} strokeWidth={4} />
              </div>
              {activeFeature.tooltip}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
