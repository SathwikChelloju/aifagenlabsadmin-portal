import { useState, useEffect, useRef, useCallback } from "react";
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  createSpeechRecognizer,
  createVoiceAgentUtterance,
  speakText,
  stopSpeaking as cancelSpeech,
} from "../services/voiceService";

/**
 * useVoiceAssistant Hook
 * Manages Web Speech recognition, speech synthesis, and coordinates
 * with the existing chatbot message submission pipeline.
 *
 * Implements real-time voice agent behavior: speaks key user names and
 * concise conversational summaries rather than line-by-line database dumps.
 */
export function useVoiceAssistant({
  messages = [],
  isProcessing = false,
  onSendMessage,
  isOpen = false,
}) {
  const [mode, setMode] = useState("chat"); // "chat" | "voice"
  const [voiceStatus, setVoiceStatus] = useState("idle"); // "idle" | "listening" | "processing" | "speaking" | "error"
  const [transcript, setTranscript] = useState("");
  const [spokenResponse, setSpokenResponse] = useState("");
  const [voiceError, setVoiceError] = useState(null);

  const recognitionRef = useRef(null);
  const lastSpokenIdRef = useRef(null);
  const pendingQuestionRef = useRef(null);

  const isRecognitionSupported = isSpeechRecognitionSupported();
  const isSynthesisSupported = isSpeechSynthesisSupported();

  // Stop active speech playback
  const stopSpeaking = useCallback(() => {
    cancelSpeech();
    setVoiceStatus((prev) => (prev === "speaking" ? "idle" : prev));
  }, []);

  // Stop active recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        console.warn("Error aborting recognition:", e);
      }
      recognitionRef.current = null;
    }
  }, []);

  // Start speech recognition for a single turn
  const startListening = useCallback(() => {
    if (!isRecognitionSupported) {
      setVoiceError(
        "Voice input is not supported in this browser. Please use Chrome, Edge, or Safari, or switch to Chat mode."
      );
      setVoiceStatus("error");
      return;
    }

    // Cancel ongoing speech playback before listening
    stopSpeaking();
    stopListening();

    setTranscript("");
    setVoiceError(null);
    pendingQuestionRef.current = "";

    try {
      const recognition = createSpeechRecognizer({
        onStart: () => {
          setVoiceStatus("listening");
        },
        onResult: (event) => {
          let currentInterim = "";
          let finalFound = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0]?.transcript || "";
            if (event.results[i].isFinal) {
              finalFound += transcriptPiece;
            } else {
              currentInterim += transcriptPiece;
            }
          }

          const combined = (finalFound || currentInterim).trim();
          if (combined) {
            setTranscript(combined);
            pendingQuestionRef.current = combined;
          }
        },
        onError: (event) => {
          console.warn("Speech recognition error:", event.error);
          if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            setVoiceError(
              "Microphone permission was denied. Please allow microphone access in your browser site permissions to use Voice mode."
            );
            setVoiceStatus("error");
          } else if (event.error === "no-speech") {
            setVoiceError("No speech detected. Please tap the microphone and speak clearly.");
            setVoiceStatus("error");
          } else if (event.error === "aborted") {
            // User intentionally cancelled or switched mode
            setVoiceStatus("idle");
          } else {
            setVoiceError(`Voice recognition error (${event.error}). Please try again.`);
            setVoiceStatus("error");
          }
        },
        onEnd: () => {
          const textToSend = pendingQuestionRef.current?.trim();
          recognitionRef.current = null;

          if (textToSend) {
            setVoiceStatus("processing");
            // Reuse the existing chatbot submission pipeline!
            onSendMessage(textToSend);
          } else {
            setVoiceStatus((prev) => (prev === "listening" ? "idle" : prev));
          }
        },
      });

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setVoiceError("Unable to activate microphone. Please check your browser permissions.");
      setVoiceStatus("error");
    }
  }, [isRecognitionSupported, onSendMessage, stopListening, stopSpeaking]);

  // Handle mode switching
  const handleModeChange = useCallback(
    (newMode) => {
      if (newMode === mode) return;

      // Always stop active speech and listening when switching modes
      stopSpeaking();
      stopListening();
      setVoiceError(null);
      setTranscript("");
      setVoiceStatus("idle");
      setMode(newMode);
    },
    [mode, stopListening, stopSpeaking]
  );

  // Speak assistant response aloud when in Voice mode as a real-time voice agent
  useEffect(() => {
    if (mode !== "voice" || isProcessing) return;

    // Find the latest message
    const latestMessage = messages[messages.length - 1];
    if (
      latestMessage &&
      latestMessage.sender === "assistant" &&
      latestMessage.text &&
      latestMessage.id !== lastSpokenIdRef.current
    ) {
      lastSpokenIdRef.current = latestMessage.id;

      // Formulate conversational voice utterance (speaking user names & highlights)
      const spokenText = createVoiceAgentUtterance(latestMessage);
      setSpokenResponse(spokenText);

      if (!isSynthesisSupported) {
        return;
      }

      speakText(spokenText, {
        onStart: () => setVoiceStatus("speaking"),
        onEnd: () => setVoiceStatus("idle"),
        onError: () => setVoiceStatus("idle"),
      });
    }
  }, [messages, isProcessing, mode, isSynthesisSupported]);

  // Cleanup on assistant panel close or unmount
  useEffect(() => {
    if (!isOpen) {
      cancelSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort errors on cleanup
        }
        recognitionRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      cancelSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort errors on cleanup
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const effectiveVoiceStatus =
    isProcessing && mode === "voice"
      ? "processing"
      : voiceStatus;

  return {
    mode,
    setMode: handleModeChange,
    voiceStatus: effectiveVoiceStatus,
    transcript,
    spokenResponse,
    voiceError,
    isRecognitionSupported,
    isSynthesisSupported,
    isListening: effectiveVoiceStatus === "listening",
    isSpeaking: effectiveVoiceStatus === "speaking",
    isProcessingQuery: isProcessing || effectiveVoiceStatus === "processing",
    startListening,
    stopListening,
    stopSpeaking,
  };
}
