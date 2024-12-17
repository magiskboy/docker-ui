export class WebSocketController {
  private socket: WebSocket;
  private reconnectAttemps: number;

  constructor(
    private readonly url: string, 
    private readonly onMessage: (event: MessageEvent) => void,
  ) {
    this.socket = new WebSocket(this.url);
    this.reconnectAttemps = 0;
  }

  initialize() {
    this.socket.onopen = () => {
      this.reconnectAttemps = 0;
      console.log('WebSocket Connected');
    }

    this.socket.onmessage = (event) => {
      this.onMessage(event);
    }

    this.socket.onerror = (event) => {
      console.error(event);
    }

    this.socket.onclose = () => {
      setTimeout(() => {
        this.reconnect();
      }, Math.pow(2, this.reconnectAttemps) * 1000);
    }
  }

  send(message: object) {
    try {
      const data = JSON.stringify(message);
      this.socket.send(data);
    } catch (e) {
      console.warn(e, message);
    }
  }

  private reconnect() {
    this.reconnectAttemps += 1;
    this.socket = new WebSocket(this.url);
    this.initialize();
  }
}

