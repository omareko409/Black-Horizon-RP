"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Wait for everything to load, including 3D elements
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 1200); // Wait for fade out animation
    }, 3000); // 3 seconds cinematic intro

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 1.2s ease-in-out",
        pointerEvents: "none"
      }}
    >
      <img 
        src="https://files.catbox.moe/3hvxas.png" 
        alt="Logo" 
        style={{ 
          width: "200px", 
          marginBottom: "2rem",
          animation: "cinematicZoom 3s ease-out forwards",
          filter: "drop-shadow(0 0 30px rgba(217, 35, 35, 0.4))"
        }} 
      />
      
      <h1 
        style={{ 
          color: "white", 
          fontSize: "3rem", 
          fontWeight: 900, 
          letterSpacing: "4px",
          fontFamily: "'Cairo', sans-serif",
          animation: "cinematicText 2.5s ease-out forwards",
          opacity: 0,
          textShadow: "0 0 20px rgba(255,255,255,0.5)"
        }}
      >
        مرحباً بك في المدينة
      </h1>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cinematicZoom {
          0% { transform: scale(0.8); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes cinematicText {
          0% { transform: translateY(30px); opacity: 0; filter: blur(10px); }
          30% { transform: translateY(30px); opacity: 0; filter: blur(10px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
      `}} />
    </div>
  );
}
