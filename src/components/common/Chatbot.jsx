import React from "react";
import { QABot } from "@snf/qa-bot-core";
import configData from "../../config.json";

function MyChatBot(){
  return (
    <div>
      <QABot
        apiKey={configData.qaToolApiKey}
        qaEndpoint={configData.qaToolApiUrl}
        welcomeMessage="Hello! How can I help you today?"
        primaryColor="#1f6a8c"
        secondaryColor="#5798bc"
        botName="FABRIC Q&A Tool"
        logo="https://github.com/user-attachments/assets/9aae9370-4a7a-4c6e-b07e-8879120b4389"      
      />
    </div>
  );
};

export default MyChatBot;
