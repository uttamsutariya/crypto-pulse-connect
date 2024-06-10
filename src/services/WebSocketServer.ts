import WebSocket, { Server } from 'ws';
import config from '../utils/config';
import { KafkaMessage } from '../types/kafkaMessage';

interface Message {
  action: 'subscribe' | 'unsubscribe';
  symbol: string;
}

class WebSocketServer {
  private server: Server;
  private rooms: Record<string, Set<WebSocket>>;

  constructor() {
    this.server = new WebSocket.Server({ port: config.websocket.port });
    this.rooms = {};
  }

  start(): void {
    this.server.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: string) => {
        const { action, symbol }: Message = JSON.parse(message);
        if (action === 'subscribe') {
          this.subscribe(ws, symbol);
        }
        if (action === 'unsubscribe') {
          this.unsubscribe(ws, symbol);
        }
      });

      ws.on('close', () => {
        this.removeClientFromRoom(ws);
      });
    });
  }

  private subscribe(ws: WebSocket, symbol: string): void {
    if (!this.rooms[symbol]) {
      this.rooms[symbol] = new Set();
    }
    this.rooms[symbol].add(ws);
  }

  private unsubscribe(ws: WebSocket, symbol: string): void {
    if (this.rooms[symbol].has(ws)) {
      this.rooms[symbol].delete(ws);
    }
  }

  private removeClientFromRoom(ws: WebSocket): void {
    for (const symbol in this.rooms) {
      if (this.rooms[symbol].has(ws)) {
        this.rooms[symbol].delete(ws);
        if (this.rooms[symbol].size === 0) {
          delete this.rooms[symbol];
        }
      }
    }
  }

  broadcast(symbol: string, data: KafkaMessage): void {
    const clients = this.rooms[symbol];
    if (clients) {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  }
}

export default WebSocketServer;
