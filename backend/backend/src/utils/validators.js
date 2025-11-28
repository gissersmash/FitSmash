// Fonctions de validation
import { z } from "zod";

// Vérifie que les données d'inscription sont valides
export const registerSchema = z.object({
  username: z.string().min(3).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

// Vérifie les données de connexion
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});
