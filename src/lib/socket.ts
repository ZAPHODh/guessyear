'use client';

import { io } from "socket.io-client";

const socketURL = process.env.NEXT_PUBLIC_WS_SERVER || 'ws://localhost:3001';

export const socket = io(socketURL, {
  autoConnect: false,
  path: '/api/socket',
  transports: ['websocket', 'polling'],
  upgrade: true,
  rememberUpgrade: true,
  timeout: 10000,
  forceNew: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

