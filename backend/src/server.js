import http from "http";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { createSocketServer } from "./sockets/index.js";

const server = http.createServer(app);
const io = createSocketServer(server);

app.set("io", io);

const start = async () => {
  await connectDatabase();
  server.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
