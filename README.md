# Android Assistant

AI-powered Android assistant with OpenClaw gateway integration and Android Auto support.

## Overview

Replace Google Assistant/Gemini with a custom React Native app backed by OpenClaw gateway.

## Features

- 🎤 Voice capture and speech-to-text
- 💬 AI responses via OpenClaw gateway
- 🚗 Android Auto integration (coming soon)
- 🔐 End-to-end encryption
- 💳 Subscription-based hosted gateway

## Quick Start

### Prerequisites

- Node.js 20+
- React Native CLI
- Android Studio (for local development)

### Installation

```bash
npm install
npm run android
```

### Building with GitHub Actions

This repo uses GitHub Actions for automated builds on `ubuntu-latest` runners.

- Every push to `main` triggers a build
- APKs and AABs are uploaded as artifacts
- Download from Actions tab: https://github.com/sunnysmol/android-assistant/actions

## Development

### Project Structure

```
android-assistant/
├── App.tsx              # Main app component
├── package.json         # Dependencies
├── .github/
│   └── workflows/
│       └── build-android.yml  # CI/CD pipeline
└── android/             # Native Android code (generated)
```

### Gateway Configuration

The app will connect to OpenClaw gateway via WebSocket/HTTP. Configuration UI coming soon.

## License

MIT
