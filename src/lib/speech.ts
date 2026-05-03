"use client";

function getVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }

  return window.speechSynthesis.getVoices();
}

function pickGentleChineseVoice() {
  const voices = getVoices();
  const preferredNames = [
    "xiaoxiao",
    "xiaoyi",
    "ting-ting",
    "tingting",
    "meijia",
    "huihui",
    "female",
    "女",
  ];

  return (
    voices.find((voice) => {
      const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
      return voice.lang.toLowerCase().startsWith("zh") && preferredNames.some((item) => name.includes(item));
    }) ??
    voices.find((voice) => voice.lang.toLowerCase() === "zh-cn") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("zh"))
  );
}

export function canUseSpeechPlayback() {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

export function stopSpeech() {
  if (!canUseSpeechPlayback()) {
    return;
  }

  window.speechSynthesis.cancel();
}

export function speakGently(text: string, options?: { onEnd?: () => void; onError?: () => void }) {
  if (!canUseSpeechPlayback() || !text.trim()) {
    return false;
  }

  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(text.trim());
  const voice = pickGentleChineseVoice();

  utterance.lang = voice?.lang ?? "zh-CN";
  utterance.voice = voice ?? null;
  utterance.rate = 0.82;
  utterance.pitch = 1.16;
  utterance.volume = 0.92;
  utterance.onend = () => options?.onEnd?.();
  utterance.onerror = () => options?.onError?.();

  window.speechSynthesis.speak(utterance);
  return true;
}

export function primeSpeechVoices(callback: () => void) {
  if (!canUseSpeechPlayback()) {
    callback();
    return () => {};
  }

  const run = () => callback();
  window.speechSynthesis.addEventListener("voiceschanged", run);
  run();

  return () => window.speechSynthesis.removeEventListener("voiceschanged", run);
}
