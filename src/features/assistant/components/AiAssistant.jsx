import React from "react";
import AssistantLauncher from "./AssistantLauncher";
import AssistantPanel from "./AssistantPanel";
import { useAssistant } from "../hooks/useAssistant";

/**
 * AiAssistant Component
 * Complete floating assistant integrating the persistent launcher and conversational panel.
 * Designed to be mounted globally inside AdminLayout.
 */
export default function AiAssistant({ activePage = "dashboard", darkMode = false }) {
  const {
    isOpen,
    isExpanded,
    messages,
    isProcessing,
    closeAssistant,
    toggleAssistant,
    toggleExpanded,
    sendMessage,
    clearMessages,
  } = useAssistant(activePage);

  return (
    <>
      <AssistantLauncher
        isOpen={isOpen}
        onClick={toggleAssistant}
        darkMode={darkMode}
      />

      <AssistantPanel
        isOpen={isOpen}
        isExpanded={isExpanded}
        onClose={closeAssistant}
        onToggleExpanded={toggleExpanded}
        messages={messages}
        isProcessing={isProcessing}
        onSendMessage={sendMessage}
        onClearHistory={clearMessages}
        activePage={activePage}
        darkMode={darkMode}
      />
    </>
  );
}
