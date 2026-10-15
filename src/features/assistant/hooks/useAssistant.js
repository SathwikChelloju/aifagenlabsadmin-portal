import { useState, useEffect, useCallback } from "react";
import { assistantService } from "../services/assistantService";

export function useAssistant(activePage = "dashboard") {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(() => assistantService.getMessages());
  const [isProcessing, setIsProcessing] = useState(() => assistantService.getIsProcessing());

  useEffect(() => {
    const unsubscribe = assistantService.subscribe((state) => {
      setMessages([...state.messages]);
      setIsProcessing(state.isProcessing);
    });
    return unsubscribe;
  }, []);

  const openAssistant = useCallback(() => setIsOpen(true), []);
  const closeAssistant = useCallback(() => setIsOpen(false), []);
  const toggleAssistant = useCallback(() => setIsOpen((prev) => !prev), []);
  const toggleExpanded = useCallback(() => setIsExpanded((prev) => !prev), []);

  const sendMessage = useCallback(
    async (prompt) => {
      if (!prompt || !prompt.trim()) return;
      await assistantService.sendQuestion({ prompt, activePage });
    },
    [activePage]
  );

  const clearMessages = useCallback(() => {
    assistantService.clearHistory();
    setMessages(assistantService.getMessages());
    setIsProcessing(false);
  }, []);

  return {
    isOpen,
    isExpanded,
    messages,
    isProcessing,
    openAssistant,
    closeAssistant,
    toggleAssistant,
    toggleExpanded,
    sendMessage,
    clearMessages,
  };
}
