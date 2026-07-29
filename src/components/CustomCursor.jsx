"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || 
          e.target.tagName.toLowerCase() === 'button' ||
          e.target.closest('a') || 
          e.target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Small dot */}
      <div 
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: "6px",
          height: "6px",
          backgroundColor: "#fff",
          boxShadow: "0 0 10px 2px #fff",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 10000,
          transition: "transform 0.1s ease",
        }}
      />
      {/* Outer Glow Circle */}
      <div 
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: "40px",
          height: "40px",
          border: "1px solid rgba(217, 35, 35, 0.5)",
          boxShadow: "0 0 20px 5px rgba(217, 35, 35, 0.3)",
          borderRadius: "50%",
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.8 : 1})`,
          backgroundColor: isHovering ? "rgba(217, 35, 35, 0.15)" : "transparent",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "transform 0.25s ease-out, background-color 0.2s ease, width 0.2s, height 0.2s",
        }}
      />
    </>
  );
}
