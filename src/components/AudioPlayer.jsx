"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("https://files.catbox.moe/jhyfdi.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (newVol > 0 && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else if (newVol === 0 && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="audio-player-fixed glass-panel" style={{ display: "flex", alignItems: "center", gap: "15px", padding: "10px 20px" }}>
      <button 
        onClick={togglePlay}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {isPlaying ? <Volume2 size={26} color="var(--primary)" /> : <VolumeX size={26} color="var(--text-muted)" />}
      </button>
      
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
      />
    </div>
  );
}

