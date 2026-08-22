import { LanguageCode } from '../types';

const LANG_MAPPING: Record<LanguageCode, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  zh: 'zh-CN',
  pt: 'pt-BR',
  ru: 'ru-RU',
  ar: 'ar-SA'
};

export class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  public speak(text: string, lang: LanguageCode = 'en') {
    if (!this.synth) return;
    this.synth.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAPPING[lang] || 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Try to find native voice
    const voices = this.synth.getVoices();
    const nativeVoice = voices.find(v => v.lang.startsWith(LANG_MAPPING[lang].split('-')[0]));
    if (nativeVoice) {
      utterance.voice = nativeVoice;
    }

    this.synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public startListening(
    lang: LanguageCode,
    onResult: (text: string) => void,
    onError: (err: any) => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser. Please type your message.');
      return;
    }

    this.recognition.lang = LANG_MAPPING[lang] || 'en-US';

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Speech recognition start error:', e);
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }
}

export const speechService = new SpeechService();
