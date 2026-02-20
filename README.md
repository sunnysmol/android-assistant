# Android Assistant

AI-powered Android assistant built with Aimybox SDK.

## Features

- 🎤 Voice recognition (Google Speech-to-Text)
- 💬 AI responses via Aimybox dialog API
- 🔊 Text-to-speech (Google TTS)
- 🚀 Native Kotlin implementation
- 🔐 Modular and customizable

## Quick Start

### Prerequisites

- Android Studio Hedgehog or later
- JDK 17
- Android SDK 34

### Building

```bash
./gradlew assembleDebug
```

### Running on Device

```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Configuration

1. Get an API key from [Aimybox Console](https://help.aimybox.com/en/article/quick-start-s9rswy/)
2. Replace `your-api-key-here` in `AssistantApplication.kt`
3. Build and install the app

## Integration with OpenClaw Gateway

This app currently uses Aimybox's dialog API. To integrate with OpenClaw gateway:

1. Create a custom `AimyboxDialogApi` implementation
2. Connect to OpenClaw gateway via WebSocket
3. Process messages and route to/from Aimybox components

See `GatewayClient.ts` (old React Native version) for WebSocket implementation reference.

## Tech Stack

- **Language:** Kotlin
- **UI Framework:** Native Android + Aimybox SDK
- **Voice:** Google Speech-to-Text + Text-to-Speech
- **Build Tool:** Gradle

## License

MIT
