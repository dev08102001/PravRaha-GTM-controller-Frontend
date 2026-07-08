import { io } from "socket.io-client";

// Socket.IO is used ONLY by the Agent Monitor.
const SOCKET_URL = "http://localhost:9077/agents";

export function createAgentSocket() {
  return io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    autoConnect: true,
  });
}
