import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import Tts from 'react-native-tts';

class VoiceService {
  private isListening: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechError = this.onSpeechError;
    
    // Initialize TTS
    Tts.setDefaultLanguage('en-IN');
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);
  }

  private onSpeechResults = (event: SpeechResultsEvent) => {
    if (event.value && event.value.length > 0) {
      const text = event.value[0];
      console.log('🎤 Voice recognized:', text);
      
      if (this.onResultCallback) {
        this.onResultCallback(text);
      }
    }
  };

  private onSpeechError = (event: SpeechErrorEvent) => {
    console.error('❌ Voice error:', event.error);
    
    if (this.onErrorCallback) {
      this.onErrorCallback(event.error?.message || 'Voice recognition error');
    }
    
    this.isListening = false;
  };

  async startListening(
    onResult: (text: string) => void,
    onError?: (error: string) => void,
    timeout: number = 5000
  ): Promise<void> {
    try {
      if (this.isListening) {
        await this.stopListening();
      }

      this.onResultCallback = onResult;
      this.onErrorCallback = onError || null;

      await Voice.start('en-IN');
      this.isListening = true;
      console.log('🎤 Voice listening started');

      // Auto-stop after timeout
      setTimeout(async () => {
        if (this.isListening) {
          await this.stopListening();
        }
      }, timeout);
    } catch (error) {
      console.error('❌ Error starting voice:', error);
      throw error;
    }
  }

  async stopListening(): Promise<void> {
    try {
      await Voice.stop();
      this.isListening = false;
      console.log('🎤 Voice listening stopped');
    } catch (error) {
      console.error('❌ Error stopping voice:', error);
    }
  }

  async speak(text: string): Promise<void> {
    try {
      await Tts.speak(text);
      console.log('🔊 Speaking:', text);
    } catch (error) {
      console.error('❌ Error speaking:', error);
      throw error;
    }
  }

  async stopSpeaking(): Promise<void> {
    try {
      await Tts.stop();
      console.log('🔊 Speaking stopped');
    } catch (error) {
      console.error('❌ Error stopping speech:', error);
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  async destroy(): Promise<void> {
    try {
      await Voice.destroy();
      Voice.removeAllListeners();
      this.isListening = false;
      this.onResultCallback = null;
      this.onErrorCallback = null;
    } catch (error) {
      console.error('❌ Error destroying voice:', error);
    }
  }

  // Extract patient data from natural language
  extractPatientData(text: string): {
    name?: string;
    age?: number;
    gender?: string;
    symptoms?: string;
  } {
    const data: any = {};

    // Extract name (pattern: "patient [name]" or "name is [name]")
    const nameMatch = text.match(/(?:patient|name is?)\s+([a-zA-Z\s]+?)(?:\s+age|\s+\d+|,|$)/i);
    if (nameMatch) {
      data.name = nameMatch[1].trim();
    }

    // Extract age (pattern: "age [number]" or "[number] years")
    const ageMatch = text.match(/(?:age|aged?)\s+(\d+)|(\d+)\s+years?/i);
    if (ageMatch) {
      data.age = parseInt(ageMatch[1] || ageMatch[2]);
    }

    // Extract gender
    if (/\b(male|man|boy)\b/i.test(text)) {
      data.gender = 'Male';
    } else if (/\b(female|woman|girl)\b/i.test(text)) {
      data.gender = 'Female';
    }

    // Extract symptoms (everything after gender/age or from "complaining of")
    const symptomsMatch = text.match(/(?:complaining of|symptoms?|suffering from)\s+(.+)/i);
    if (symptomsMatch) {
      data.symptoms = symptomsMatch[1].trim();
    } else {
      // If no explicit symptoms marker, take text after age/gender
      const afterInfoMatch = text.match(/(?:\d+\s+years?|male|female)\s+(.+)/i);
      if (afterInfoMatch) {
        data.symptoms = afterInfoMatch[1].trim();
      }
    }

    return data;
  }
}

export default new VoiceService();
