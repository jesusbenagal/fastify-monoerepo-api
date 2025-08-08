import { Server as IOServer } from "socket.io";
import type { FastifyInstance } from "fastify";

let io: IOServer | null = null;

export function initIO(app: FastifyInstance) {
  io = new IOServer(app.server, {
    cors: { origin: "*" },
  });
  io.on("connection", (socket) => {
    app.log.info({ id: socket.id }, "socket connected");
    socket.on("disconnect", () =>
      app.log.info({ id: socket.id }, "socket disconnected"),
    );
  });
}

export function getIO(): IOServer {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}
