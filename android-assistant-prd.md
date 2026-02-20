# Android Assistant SaaS - PRD

## Overview

Replace Google Assistant/Gemini with a custom Android app backed by OpenClaw gateway. Target both phone and Android Auto with voice-first AI interaction.

## Problem Statement

Google Assistant in Android Auto is unreliable, limited, and lacks customizability. Users who want better voice control in their cars have no viable alternatives. The current market gap is an AI assistant that actually works consistently in automotive environments.

## Solution

An Android app that connects to OpenClaw gateway (local or hosted) for AI processing, with full Android Auto integration via MediaBrowserService for voice interaction.

## Business Model

### Pricing Tiers

| Tier | Price | Gateway | Features |
|------|-------|----------|----------|
| Free | $0 | Local gateway only | Full app functionality, Android Auto support |
| Basic | $10/mo | Hosted gateway | Managed OpenClaw instance, 100K tokens/mo |
| Pro | $25/mo | Hosted gateway | Premium models, 500K tokens/mo, priority support |

### Revenue Streams

1. **Subscription revenue** from hosted gateway access
2. **Optional:** Enterprise tier for fleet management (future)

## Product Requirements

### Core Features (MVP)

#### Android App
- Voice capture and speech-to-text
- Text-to-speech response playback
- Local gateway configuration (WebSocket/HTTP)
- User authentication (Supabase Auth)
- Stripe billing integration
- Push notifications for gateway status

#### Android Auto
- Voice-first interface (MediaBrowserService)
- Hands-free operation
- Audio output integration
- Simplified UI for automotive use

#### Gateway Service
- Docker container provisioning (Fly.io/Railway)
- Per-user isolation
- Usage tracking and billing
- Health monitoring

### Non-Functional Requirements

- **Latency:** < 2s for voice-to-AI-to-voice round-trip
- **Uptime:** 99.5% for hosted gateway
- **Security:** End-to-end encryption for gateway communication
- **Compliance:** GDPR/privacy-by-design (local gateway option)

## Technical Architecture

### Android Stack
- **Language:** Kotlin
- **UI:** Jetpack Compose
- **Auto:** Android Auto (MediaBrowserService, MediaSession)
- **Voice:** Android SpeechRecognizer (STT), ElevenLabs/Google TTS
- **Networking:** OkHttp + WebSocket
- **DI:** Hilt/Koin
- **Async:** Kotlin Coroutines + Flow

### Gateway Stack
- **Orchestration:** OpenClaw (existing)
- **Hosting:** Fly.io or Railway (Docker containers)
- **Isolation:** Per-user containers or K8s pods
- **Monitoring:** Prometheus/Grafana

### Billing
- **Payment:** Stripe Checkout + Subscription API
- **Webhooks:** Gateway provisioning on subscription events
- **Usage:** OpenClaw token tracking + Stripe Metered Billing

### CI/CD (GitHub Actions)

```yaml
# Build pipeline for Mac + GitHub Runner
name: Android Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest  # GitHub Runner with Android SDK

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Grant execute permission for gradlew
        run: chmod +x gradlew

      - name: Build APK
        run: ./gradlew assembleDebug

      - name: Build Release Bundle
        run: ./gradlew bundleRelease

      - name: Run Tests
        run: ./gradlew test

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: app/build/outputs/apk/debug/*.apk

      - name: Upload Release Bundle
        uses: actions/upload-artifact@v4
        with:
          name: app-release
          path: app/build/outputs/bundle/release/*.aab
```

### Why GitHub Runner

Your Mac is underpowered. GitHub Actions `macos-latest` runner provides:
- Pre-installed Android SDK
- Fast build times (dedicated resources)
- Automated builds on every push
- Artifact storage for APK/AAB files
- Zero cost for open source or moderate private repo usage

## Development Phases

### Phase 1: MVP (8 weeks)
- Android app with voice I/O
- Local gateway integration
- Basic Android Auto support
- Manual testing

### Phase 2: Hosting (4 weeks)
- Automated gateway provisioning
- Stripe billing integration
- User account system
- Beta testing

### Phase 3: Polish (4 weeks)
- Production-ready UI
- Error handling and edge cases
- Performance optimization
- Launch preparation

## Success Metrics

- **User adoption:** 1,000 active users in 3 months
- **Conversion:** 15% free-to-paid conversion
- **Retention:** 60% month-over-month retention
- **NPS:** > 40

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Android Auto approval rejection | High | Follow MediaBrowserService guidelines closely, submit early |
| Gateway latency issues | Medium | Optimize Docker images, use edge deployment |
| Payment processing issues | Medium | Thorough Stripe testing, graceful failure handling |
| User churn | Low | Focus on reliability, clear value proposition |

## Open Questions

1. **TTS provider:** ElevenLabs (premium) or Google TTS (free but lower quality)?
2. **Staging environment:** Should we host a beta gateway for testing?
3. **Legal:** Any IP concerns with "assistant" terminology in app store?

---

**Last Updated:** 2026-02-20
**Status:** Planning → Ready for Development
