import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function createSignalClient(baseUrl) {
  const client = new Client({
    webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
    reconnectDelay: 2000
  });
  return client;
}

