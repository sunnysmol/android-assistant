import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { GatewayClient, GatewayMessage } from './GatewayClient';

interface VoiceManagerResult {
  isListening: boolean;
  isSpeaking: boolean;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  speak: (text: string) => Promise<void>;
}

// Temporary mock since we don't have native modules in this workspace
const useVoiceManager = (): VoiceManagerResult => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  return {
    isListening,
    isSpeaking,
    startListening: async () => {
      setIsListening(true);
      // In real app, this would trigger SpeechRecognition
    },
    stopListening: async () => {
      setIsListening(false);
    },
    speak: async (text: string) => {
      setIsSpeaking(true);
      // In real app, this would trigger TTS
      setTimeout(() => setIsSpeaking(false), 1000);
    },
  };
};

function App(): React.JSX.Element {
  const [gatewayUrl, setGatewayUrl] = useState('ws://localhost:8080');
  const [messages, setMessages] = useState<GatewayMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [gatewayClient, setGatewayClient] = useState<GatewayClient | null>(null);

  const voice = useVoiceManager();

  useEffect(() => {
    // Auto-connect to gateway on mount
    const client = new GatewayClient({ url: gatewayUrl });

    client
      .connect()
      .then(() => {
        setIsConnected(true);
        setGatewayClient(client);

        // Listen for incoming messages
        client.onMessage((message: GatewayMessage) => {
          setMessages((prev) => [...prev, message]);

          // Speak assistant responses
          if (message.type === 'assistant') {
            voice.speak(message.content);
          }
        });
      })
      .catch((error) => {
        console.error('Failed to connect to gateway:', error);
        setIsConnected(false);
      });

    return () => {
      client.disconnect();
    };
  }, [gatewayUrl]);

  const handleVoiceInput = async () => {
    if (!gatewayClient || !isConnected) {
      console.error('Gateway not connected');
      return;
    }

    // Start voice recognition (in real app)
    await voice.startListening();

    // For MVP, simulate voice input after 2 seconds
    setTimeout(() => {
      const simulatedText = "Hello, how are you?";
      setCurrentInput(simulatedText);
      voice.stopListening();
    }, 2000);
  };

  const handleSend = () => {
    if (!currentInput.trim() || !gatewayClient) {
      return;
    }

    const userMessage: GatewayMessage = {
      type: 'user',
      content: currentInput,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    gatewayClient.sendMessage(currentInput);
    setCurrentInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title}>Android Assistant</Text>
          <Text style={styles.subtitle}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </Text>
        </View>

        <View style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.type === 'user' ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.type === 'user' ? styles.userText : styles.assistantText,
                ]}
              >
                {msg.content}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type or speak your message..."
            placeholderTextColor="#888"
            value={currentInput}
            onChangeText={setCurrentInput}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.button,
              styles.sendButton,
              !currentInput.trim() && styles.disabledButton,
            ]}
            onPress={handleSend}
            disabled={!currentInput.trim()}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.voiceContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.voiceButton,
              voice.isListening && styles.listeningButton,
            ]}
            onPress={handleVoiceInput}
            disabled={voice.isSpeaking}
          >
            {voice.isListening ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🎤 Speak</Text>
            )}
          </TouchableOpacity>

          {voice.isSpeaking && (
            <Text style={styles.speakingText}>🔊 Speaking...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  messagesContainer: {
    padding: 16,
    minHeight: 200,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6200ea',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2c2c2c',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#ffffff',
  },
  assistantText: {
    color: '#e0e0e0',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    maxHeight: 120,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: '#6200ea',
  },
  disabledButton: {
    opacity: 0.5,
  },
  voiceButton: {
    backgroundColor: '#03dac6',
  },
  listeningButton: {
    backgroundColor: '#cf6679',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  voiceContainer: {
    alignItems: 'center',
    padding: 24,
  },
  speakingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#a0a0a0',
  },
});

export default App;
