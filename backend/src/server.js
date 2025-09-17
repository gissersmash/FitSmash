import foodEntriesRouter from "./routes/foodEntries.js";
// Point d'entrée du serveur Express
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";
import objectiveRoutes from "./routes/objective.routes.js";
import foodRoutes from "./routes/food.routes.js";
import goalsRoutes from "./routes/goals.routes.js";

dotenv.config();

import { testDBConnection } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.options(/.*/, cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/food-entries", foodEntriesRouter);

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.options(/.*/, cors());
app.use(express.json());
app.use(cookieParser());

// Route d'authentification
app.use("/api/auth", authRoutes); // On active les routes auth
app.use("/api/health", healthRoutes);  //  Active les routes santé
app.use("/api/objectives", objectiveRoutes); // Active les routes objectifs
app.use("/api/foods", foodRoutes); // Active les routes aliments
app.use("/api/goals", goalsRoutes); // Active les routes objectifs nutritionnels


// Test API
app.get("/api/healthcheck", (req, res) => {
  res.json({ ok: true, message: "API fonctionne 🚀" });
});


// Lancer serveur
const port = process.env.PORT || 4000;
app.listen(port, async () => {
  await testDBConnection();
  console.log(`🚀 API dispo sur http://localhost:${port}`);
});
