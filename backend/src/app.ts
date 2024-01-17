import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { Server as IoServer } from "socket.io";
import { Server } from "http";
// import swaggerUi from "swagger-ui-express";
// import YAML from "yamljs";
// import { handleSocketConnection } from "./ws/ws.js";

//api-sepcs
// const swaggerDocument = YAML.load("./api-specs/swagger.yaml");

config();

const app = express();

// socket.io
const httpServer = new Server(app);
const io = new IoServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_DOMAIN,
    credentials: true,
  },
  pingTimeout: 60000,
});

//api-docs

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//middlewares
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// remove it in production
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

// const namespace = io.of("/ws/v1");
// handleSocketConnection(namespace);

export { app, httpServer, io };
