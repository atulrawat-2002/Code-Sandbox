import express from "express";
import cors from "cors";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "./routes/index.js";
import morgan from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import chokidar from "chokidar";
import path from "node:path";
import { handleEditorSocketEvents } from "./socketHandlers/editorHandler.js";
import { handleContainerCreate } from "./containers/handleContainerCreate.js";
import { WebSocketServer } from "ws";
import { handleTerminalCreation } from "./containers/handleTerminalCreation.js";
import fs from "fs/promises";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const editorNameSpace = io.of("/editor");
export let sequence = [0];
export let isRenaming = [false];

editorNameSpace.on("connection", (socket) => {
  const projectId = socket.handshake.query.projectId;
  handleEditorSocketEvents(socket, editorNameSpace);

  if (projectId) {
    var watcher = chokidar.watch("./projects", {
      ignored: /node_modules/,
      persistent: true,
      ignoreInitial: true,
      usePolling: true,
      interval: 300,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
    });

    watcher.on("all", (event, path) => {

    });

    socket.on("renameFile", async ({ oldPath, newPath }) => {
      const oldAbs = path.resolve(oldPath);
      const newAbs = path.resolve(newPath);

      try {
        // watcher.unwatch(oldAbs);
        const response = await fs.rename(oldAbs, newAbs);
        socket.emit("fileRenameSuccess", {
          data: newAbs,
        });
      } catch (error) {
        socket.emit("error", {
          data: error.message,
        });
      } finally {
        // watcher.add(newAbs)
      }
    });
  }

  socket.on("disconnect", async () => {
    await watcher.close();
  });
});

app.use("/api", apiRouter);

server.listen(PORT, (error) => {
  if (error) {
    console.log("Error while listening ", error);
  }
  console.log(
    `**********************App is listening on port no. ${PORT} And this is the first log****************`,
    ++sequence[0]
  );
});

const webSocketForTerminal = new WebSocketServer({
  noServer: true,
});

server.on("upgrade", (req, tcp, head) => {
  const isTerminal = req?.url.includes("/terminal");

  if (isTerminal) {
    const projectId = req.url.split("=")[1];
    handleContainerCreate(projectId, webSocketForTerminal, req, tcp, head);
  }
});

webSocketForTerminal.on("connection", (ws, req, container, port) => {

  editorNameSpace.emit("getPortSuccess", { port: port });

  handleTerminalCreation(ws, container);

  ws.on("close", () => {

      try {
        
        container.remove({ force: true }, (err, data) => {
          if (err) {
            console.log("error while removing the container index.js file", err);
          }
        });
      } catch (error) {
        console.log("Error removing container when terminal socker disconnect", error);
        
      }
    
    
  });
});
