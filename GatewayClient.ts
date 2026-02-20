interface GatewayMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface GatewayConfig {
  url: string;  // WebSocket URL for local or hosted gateway
  apiKey?: string;  // Optional: For hosted gateway auth
}

export class GatewayClient {
  private ws: WebSocket | null = null;
  private config: GatewayConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  constructor(config: GatewayConfig) {
    this.config = config;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          console.log('Gateway connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onclose = () => {
          console.log('Gateway disconnected');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('Gateway error:', error);
          reject(error);
        };

        this.ws.onmessage = (event) => {
          try {
            const message: GatewayMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * this.reconnectAttempts;

      console.log(`Attempting to reconnect in ${delay}ms...`);

      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnect failed:', error);
        });
      }, delay);
    }
  }

  private handleMessage(message: GatewayMessage): void {
    // This will be handled by the component's callback
    if (this.onMessageCallback) {
      this.onMessageCallback(message);
    }
  }

  private onMessageCallback: ((message: GatewayMessage) => void) | null = null;

  onMessage(callback: (message: GatewayMessage) => void): void {
    this.onMessageCallback = callback;
  }

  sendMessage(content: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('Gateway not connected');
    }

    const message: GatewayMessage = {
      type: 'user',
      content,
      timestamp: Date.now(),
    };

    this.ws.send(JSON.stringify(message));
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
