import http from "http";
import app from "./app";
import { PORT } from "./config/env";
import { initSocket } from "./socket";

const server = http.createServer(app);

initSocket(server);

server.listen(PORT as number, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});