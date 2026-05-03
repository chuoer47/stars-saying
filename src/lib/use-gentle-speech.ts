"use client";

import { useCallback, useEffect, useState } from "react";

import { canUseSpeechPlayback, primeSpeechVoices, speakGently, stopSpeech } from "@/lib/speech";

export function useGentleSpeech() {
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const stop = useCallback(() => {
    stopSpeech();
    setActiveSpeechId(null);
  }, []);

  const play = useCallback(
    (speechId: string, text: string) => {
      if (activeSpeechId === speechId) {
        stop();
        return false;
      }

      setActiveSpeechId(speechId);
      const started = speakGently(text, {
        onEnd: () => setActiveSpeechId((current) => (current === speechId ? null : current)),
        onError: () => setActiveSpeechId((current) => (current === speechId ? null : current)),
      });

      if (!started) {
        setActiveSpeechId(null);
      }

      return started;
    },
    [activeSpeechId, stop],
  );

  useEffect(() => {
    const dispose = primeSpeechVoices(() => {
      setIsSpeechSupported(canUseSpeechPlayback());
    });

    return () => {
      dispose();
      stopSpeech();
    };
  }, []);

  return {
    activeSpeechId,
    isSpeechSupported,
    play,
    stop,
  };
}
