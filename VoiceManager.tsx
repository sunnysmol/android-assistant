import React, { useState, useEffect, useRef } from 'react';
import {
  SpeechRecognition,
  SpeechRecognitionOptions,
  VoiceResults,
} from 'react-native-voice';
import Tts from 'react-native-tts';

interface VoiceManagerProps {
  onTranscript: (text: string) => void;
  onResponse: (text: string) => void;
}

export const VoiceManager: React.FC<VoiceManagerProps> = ({
  onTranscript,
  onResponse,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Initialize TTS
    Tts.getInitStatus().then(() => {
      Tts.setDefaultLanguage('en-US');
      Tts.setDefaultRate(0.5);
      Tts.setDefaultPitch(1.0);
    });

    // Clean up on unmount
    return () => {
      Tts.stop();
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);

      // Configure speech recognition
      const options: SpeechRecognitionOptions = {
        onSpeechResults: (e: VoiceResults) => {
          if (e.value && e.value.length > 0) {
            const transcript = e.value[0];
            setIsListening(false);
            onTranscript(transcript);
          }
        },
        onSpeechEnd: () => {
          setIsListening(false);
        },
        onSpeechError: () => {
          setIsListening(false);
        },
        EXTRA_PARTIAL_RESULTS: false,
        REQUEST_PERMISSIONS_ANDROID: true,
      };

      await SpeechRecognition.start(options);
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await SpeechRecognition.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const speak = async (text: string) => {
    try {
      setIsSpeaking(true);
      await Tts.speak(text);
      setIsSpeaking(false);
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  return {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
  };
};
