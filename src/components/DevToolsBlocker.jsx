"use client";

import { useEffect } from "react";

export default function DevToolsBlocker() {
  useEffect(() => {
    const blockEvent = (e) => {
      // Disable F12 (keyCode 123)
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+Shift+K
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        ["I", "i", "J", "j", "C", "c", "K", "k"].includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Disable Ctrl+U (View Source) & Ctrl+S
      if ((e.ctrlKey || e.metaKey) && ["U", "u", "S", "s"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const disableContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Attach with capture phase = true to intercept before anything else
    window.addEventListener("keydown", blockEvent, true);
    window.addEventListener("contextmenu", disableContextMenu, true);

    return () => {
      window.removeEventListener("keydown", blockEvent, true);
      window.removeEventListener("contextmenu", disableContextMenu, true);
    };
  }, []);

  return null;
}
