// lib/signalr/simple-signalr.ts - SỬA LẠI
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import { Constants } from "../constants/constants";

class SimpleSignalR {
  private connection: HubConnection | null = null;
  private url: string;
  private isConnecting = false;

  constructor(url: string) {
    this.url = url;
  }

  async connect(): Promise<void> {
    // Đã đang kết nối thì bỏ qua
    if (this.connection?.state === "Connected") {
      console.log("✅ Already connected");
      return;
    }

    // Đang kết nối thì đợi
    if (this.isConnecting) {
      console.log("⏳ Waiting for existing connection...");
      return;
    }

    this.isConnecting = true;

    try {
      // Tạo connection mới nếu chưa có
      if (!this.connection) {
        console.log("🔗 Creating new SignalR connection...");

        this.connection = new HubConnectionBuilder()
          .withUrl(this.url, {
            transport:
              HttpTransportType.WebSockets | HttpTransportType.LongPolling,
            skipNegotiation: false,
            withCredentials: false,
            logger: LogLevel.Debug,
          })
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: (retryContext) => {
              if (retryContext.previousRetryCount >= 3) {
                return 10000; // 10 seconds after 3 attempts
              }
              return Math.min(
                1000 * Math.pow(2, retryContext.previousRetryCount),
                10000
              );
            },
          })
          .configureLogging(LogLevel.Warning)
          .build();

        // Setup event handlers
        this.setupEventHandlers();
      }

      // Chỉ start nếu chưa connected
      if (this.connection.state !== "Connected") {
        console.log("🔄 Starting SignalR connection...");
        await this.connection.start();

        console.log("✅ SignalR Connected successfully");
        console.log("🔗 State:", this.connection.state);
        console.log("📡 Connection ID:", this.connection.connectionId);
      }
    } catch (error) {
      console.error("❌ SignalR Connection Failed:", error);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.onclose((error) => {
      console.log(
        "🔌 SignalR connection closed",
        error ? `with error: ${error.message}` : ""
      );
      this.isConnecting = false;
    });

    this.connection.onreconnecting((error) => {
      console.log(
        "🔄 SignalR reconnecting...",
        error ? `Error: ${error.message}` : ""
      );
    });

    this.connection.onreconnected((connectionId) => {
      console.log("✅ SignalR reconnected. Connection ID:", connectionId);
    });
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("🔌 SignalR disconnected");
      } catch (error) {
        console.error("Error disconnecting SignalR:", error);
      } finally {
        this.connection = null;
        this.isConnecting = false;
      }
    }
  }

  // Gửi message đến server - THÊM CHECK STATE
  async send(method: string, ...args: any[]): Promise<any> {
    if (!this.connection) {
      throw new Error(
        "SignalR connection not initialized. Call connect() first."
      );
    }

    if (this.connection.state !== "Connected") {
      console.warn(
        `⚠️ Cannot send "${method}" - Connection state: ${this.connection.state}`
      );

      // Tự động thử connect lại nếu chưa connected
      if (this.connection.state === "Disconnected") {
        console.log("🔄 Attempting to reconnect before sending...");
        await this.connect();
      } else {
        throw new Error(
          `Cannot send data. Connection state: ${this.connection.state}`
        );
      }
    }

    try {
      console.log(`📤 Sending "${method}" with args:`, args);
      const result = await this.connection.invoke(method, ...args);
      console.log(`📥 "${method}" response:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Error sending "${method}":`, error);
      throw error;
    }
  }

  // Lắng nghe event
  on(eventName: string, callback: (data: any) => void): void {
    if (this.connection) {
      console.log(`👂 Listening for "${eventName}" event`);
      this.connection.on(eventName, callback);
    }
  }

  // Hủy lắng nghe
  off(eventName: string): void {
    this.connection?.off(eventName);
  }

  // Kiểm tra kết nối
  isConnected(): boolean {
    return this.connection?.state === "Connected";
  }

  // Get current state
  getState(): string {
    return this.connection?.state || "Disconnected";
  }

  // Wait for connection to be ready
  async waitForConnection(timeoutMs = 10000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      if (this.isConnected()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw new Error(
      `Timeout waiting for SignalR connection after ${timeoutMs}ms`
    );
  }
}

// Tạo instance
const getSignalRUrl = () => {
  const baseUrl = Constants.API_BASE;
  const url = `${baseUrl}/orderHub`;
  console.log("🔗 SignalR URL:", url);
  return url;
};

export const signalR = new SimpleSignalR(getSignalRUrl());
