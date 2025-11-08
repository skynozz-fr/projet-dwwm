import path from "path";
import express from "express";
import dotenv from "dotenv";
import { configureApp } from "./config/express";

// Charge le .env du dossier back
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Configure l'application avec tous les middlewares et routes
configureApp(app);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`✅ API fc-popcorn en ligne: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});