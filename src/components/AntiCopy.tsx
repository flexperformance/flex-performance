"use client";

import { useEffect } from "react";

export default function AntiCopy() {
  useEffect(() => {
    // 1. Bloquer le clic droit
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Bloquer les raccourcis clavier de copie et d'inspection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "x", "u", "s", "p"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
      if (e.key === "F12") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}