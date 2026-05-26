import { AgentId } from '../types';
import { useUIStore } from '../store/uiStore';

interface QueueItem {
  text: string;
  agentId: AgentId;
}

export class SpeechManager {
  private static instance: SpeechManager | null = null;
  private queue: QueueItem[] = [];
  private isPlaying = false;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  public static getInstance(): SpeechManager {
    if (!SpeechManager.instance) {
      SpeechManager.instance = new SpeechManager();
    }
    return SpeechManager.instance;
  }

  private loadVoices() {
    this.voices = window.speechSynthesis.getVoices();
  }

  // Queue a commentary line to be spoken aloud
  public speak(text: string, agentId: AgentId) {
    const isAudioOn = useUIStore.getState().isAudioOn;
    if (!isAudioOn) return;

    this.queue.push({ text, agentId });
    if (!this.isPlaying) {
      this.playNext();
    }
  }

  // Clear all pending queue items and cancel any ongoing speech
  public stop() {
    this.queue = [];
    this.isPlaying = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    useUIStore.setState({ activeSpeakingAgentId: null });
  }

  private playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      useUIStore.setState({ activeSpeakingAgentId: null });
      return;
    }

    this.isPlaying = true;
    const item = this.queue.shift()!;
    
    // Set UI speaking state so we can highlight active card
    useUIStore.setState({ activeSpeakingAgentId: item.agentId });

    const utterance = new SpeechSynthesisUtterance(item.text);
    this.currentUtterance = utterance;

    // Apply agent voice parameters
    this.applyVoiceSettings(utterance, item.agentId);

    utterance.onend = () => {
      this.playNext();
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      this.playNext();
    };

    window.speechSynthesis.speak(utterance);
  }

  private applyVoiceSettings(utterance: SpeechSynthesisUtterance, agentId: AgentId) {
    // 1. Locate best voice matching agent characteristics
    let matchedVoice: SpeechSynthesisVoice | null = null;

    if (agentId === 'local-fan') {
      // Prefer Indian English (en-IN) or Hindi (hi-IN)
      matchedVoice = this.voices.find(v => v.lang.includes('IN') || v.lang.includes('hi')) || null;
    } else if (agentId === 'emotion-analyst') {
      // Prefer expressive female voices (Zira, Google US Female)
      matchedVoice = this.voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.lang.includes('GB')) || null;
    } else if (agentId === 'tactical-coach') {
      // Prefer deep/professional male voices (David, Google US Male)
      matchedVoice = this.voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('google us')) || null;
    } else if (agentId === 'betting-risk') {
      // Monotone / Robot sounding voice
      matchedVoice = this.voices.find(v => v.name.toLowerCase().includes('google us') || v.name.toLowerCase().includes('david')) || null;
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    // 2. Fine-tune pitch and rate
    switch (agentId) {
      case 'emotion-analyst':
        utterance.pitch = 1.15;  // slightly high, dramatic
        utterance.rate = 0.92;   // slower, suspenseful
        break;
      case 'fan-agent':
        utterance.pitch = 1.25;  // excited, high energy
        utterance.rate = 1.12;   // fast paced
        break;
      case 'tactical-coach':
        utterance.pitch = 0.88;  // deep, authoritative
        utterance.rate = 0.88;   // analytical, slow
        break;
      case 'meme-agent':
        utterance.pitch = 1.10;  // playful
        utterance.rate = 1.05;   // casual
        break;
      case 'betting-risk':
        utterance.pitch = 0.75;  // very low monotone
        utterance.rate = 1.00;   // flat, steady
        break;
      case 'local-fan':
        utterance.pitch = 1.05;  // lively
        utterance.rate = 1.00;   // Hinglish speed
        break;
    }
  }
}

export const speechManager = SpeechManager.getInstance();
