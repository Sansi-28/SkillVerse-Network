import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from './api';

export function createSignalClient(baseUrl) {
  const url = baseUrl || API_BASE_URL;
  const client = new Client({
    webSocketFactory: () => new SockJS(`${url}/ws`),
    reconnectDelay: 2000,
    debug: () => {}, // Quiet logs in production
  });
  return client;
}
