"use client";
import { useMemo } from 'react';
import { QABot } from "@snf/qa-bot-core";
import { default as portalData } from "@/services/portalData.json";
import { useAuth } from "@/lib/auth/AuthContext";

let config = {};
try {
  config = require("@/config.json");
} catch {
  // config.json is optional; Chatbot will be hidden when it's missing
}

export default function Chatbot() {
  const { userStatus } = useAuth();
  const loginUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/login?url=${encodeURIComponent(window.location.origin + "/")}`;
  }, []);

  if (!config.qaToolApiUrl || !config.qaToolApiKey || userStatus !== "active") {
    return null;
  }

  return (
    <QABot
      apiKey={config.qaToolApiKey}
      qaEndpoint={config.qaToolApiUrl}
      welcomeMessage="Hello! How can I help you with FABRIC today?"
      primaryColor="#1f6a8c"
      secondaryColor="#5798bc"
      botName="FABRIC Q&A Tool"
      logo="https://github.com/user-attachments/assets/9aae9370-4a7a-4c6e-b07e-8879120b4389"
      isLoggedIn={userStatus === "active"}
      allowAnonAccess={false}
      loginUrl={loginUrl}
      footerText="About this tool"
      footerLink={portalData.learnArticles.guideForQATool}
    />
  );
}