// Point d'entrée du serveur Express
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { testDBConnection } from "./config/db.js";

// Import des modèles pour synchronisation
import HealthEntry from "./models/HealthEntry.js";
import { Food } from "./models/Food.js";
import Activity from "./models/Activity.js";

// Import des routes
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";
import objectiveRoutes from "./routes/objective.routes.js";
import foodRoutes from "./routes/food.routes.js";
import goalsRoutes from "./routes/goals.routes.js";
import foodEntriesRouter from "./routes/foodEntries.js";
import openFoodFactsRoutes from "./routes/openFoodFacts.routes.js";
import activityRoutes from "./routes/activity.routes.js";

dotenv.config();

const app = express();

// Middleware
// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.options(/.*/, cors());
app.use(express.json());
app.use(cookieParser());

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/objectives", objectiveRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/food-entries", foodEntriesRouter);
app.use("/api/open-food-facts", openFoodFactsRoutes);
app.use("/api/activities", activityRoutes);

// Route de test
app.get("/api/healthcheck", (req, res) => {
  res.json({ ok: true, message: "API fonctionne 🚀" });
});

// Synchronisation des modèles
HealthEntry.sync({ alter: true })
  .then(() => console.log("✅ Table HealthEntry synchronisée"))
  .catch(err => console.error("❌ Erreur sync HealthEntry:", err));

Food.sync({ alter: true })
  .then(() => console.log("✅ Table Food synchronisée"))
  .catch(err => console.error("❌ Erreur sync Food:", err));

Activity.sync({ alter: true })
  .then(() => console.log("✅ Table Activity synchronisée"))
  .catch(err => console.error("❌ Erreur sync Activity:", err));

// Lancer serveur
const port = process.env.PORT || 4000;
app.listen(port, async () => {
  await testDBConnection();
  console.log(`🚀 API dispo sur http://localhost:${port}`);
});
