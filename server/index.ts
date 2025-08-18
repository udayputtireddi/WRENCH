import express from "express";
import cors from "cors";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Server operational" });
  });

  return app;
}
