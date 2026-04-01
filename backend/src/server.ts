import { createServer } from "http";
import app from "./app";
import { PORT } from "./config/env";
import { initSocket } from "./socket";
import { setSocketIO } from "./socket/socketInstance";
import { Server } from "socket.io";

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

setSocketIO(io);

httpServer.listen(PORT as number, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
