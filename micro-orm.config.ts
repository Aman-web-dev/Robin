import { defineConfig } from "@mikro-orm/mongodb";
import "dotenv/config";
import { User } from "./entities/User";
import { Request } from "./entities/Request";

// Ensure environment variables are loaded and validated
if (!process.env.MONGODB_URI && process.env.NODE_ENV === "production") {
  throw new Error("MONGODB_URI is not defined in production environment");
}

export default defineConfig({
  clientUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/robin",
  dbName: process.env.MONGODB_DB_NAME || "robin", // Explicitly set database name
  entities: [User, Request], // For production (compiled JS)
  entitiesTs: [User, Request], // For development (TS)
  forceEntityConstructor: true,
  debug: process.env.NODE_ENV !== "production", // Enable debug logs in development
  // Ensure collection names match entity names (lowercase by default)
  schemaGenerator: {
    disableForeignKeys: true, // MongoDB doesn't use foreign keys
  },
  // Add connection pooling for production
  pool: {
    min: process.env.NODE_ENV === "production" ? 5 : 1,
    max: process.env.NODE_ENV === "production" ? 20 : 10,
  },
});