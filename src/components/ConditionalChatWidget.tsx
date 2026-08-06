"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";

export default function ConditionalChatWidget() {
  const pathname = usePathname();

  // 🚫 Masque le widget sur /admin, /admin/suivi, etc.
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <ChatWidget />;
}