import { useMemo } from 'react';
import { QABot } from "@snf/qa-bot-core";
import configData from "@/config.json";
import { default as portalData } from "@/services/portalData.json";

export default function Chatbot() {
  const loginUrl = useMemo(() => {
    return `${window.location.origin}/login`;
  }, []);

  return (
    <QABot
      apiKey={configData.qaToolApiKey}
      qaEndpoint={configData.qaToolApiUrl}
      welcomeMessage="Hello! How can I help you with FABRIC today?"
      primaryColor="#1f6a8c"
      secondaryColor="#5798bc"
      botName="FABRIC Q&A Tool"
      logo="https://github.com/user-attachments/assets/9aae9370-4a7a-4c6e-b07e-8879120b4389"
      isLoggedIn={true}
      allowAnonAccess={false}
      loginUrl={loginUrl}
      footerText="About this tool"
      footerLink={portalData.learnArticles.guideForQATool}
    />
  );
}