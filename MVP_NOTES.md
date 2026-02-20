# MVP Implementation Notes

## What's Working

1. **UI Components:**
   - Chat interface with message bubbles
   - Connection status indicator
   - Text input and send button
   - Voice input button (simulated for now)

2. **Gateway Client:**
   - WebSocket connection to OpenClaw gateway
   - Auto-reconnect logic
   - Message handling (user/assistant)
   - Error handling

3. **Architecture:**
   - Clean separation of concerns (Voice, Gateway, UI)
   - React hooks for state management
   - TypeScript for type safety

## What's Mocked (Needs Native Implementation)

1. **Voice Recognition:**
   - Currently: Simulated with setTimeout
   - Needs: `react-native-voice` native integration
   - Will use: Android's `SpeechRecognizer`

2. **Text-to-Speech:**
   - Currently: Simulated with setTimeout
   - Needs: `react-native-tts` native integration
   - Will use: Android's `TextToSpeech`

## How to Run (Full Setup)

When you have Android Studio and proper React Native setup:

```bash
# Install dependencies
npm install

# Generate Android folder (if not present)
npx react-native init --skip-install

# Run on device/emulator
npm run android
```

## Testing Without Native Modules

The current code will run in React Native's web preview or with Expo, but voice features won't work without native modules.

For a real app, you need:
- Android Studio with SDK
- Android device or emulator
- `react-native-voice` and `react-native-tts` properly linked

## Gateway Connection

The app tries to connect to `ws://localhost:8080` by default.

To test with a real OpenClaw gateway:
1. Run OpenClaw locally
2. Start the gateway with WebSocket enabled
3. Update the URL in App.tsx if needed

## Next Steps for Full MVP

1. Generate `android/` folder with `npx react-native init`
2. Build and install on Android device
3. Test voice recognition (STT)
4. Test text-to-speech (TTS)
5. Connect to real OpenClaw gateway
6. Verify end-to-end flow

## Known Limitations

- No Android Auto integration yet
- No authentication for hosted gateway
- No subscription/billing UI
- No settings/config screen
- Voice features mocked

All of these are planned for post-MVP.
