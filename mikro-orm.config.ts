import { defineConfig } from "@mikro-orm/mongodb";
import "dotenv/config";
import { User } from "./entities/User";
import { Request } from "./entities/Request";

// Validate environment variables
if (!process.env.MONGODB_URI && process.env.NODE_ENV === "production") {
  throw new Error("MONGODB_URI is not defined in production environment");
}

export default defineConfig({
  clientUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/robin",
  dbName: process.env.MONGODB_DB_NAME || "robin",
  entities: [User, Request],
  entitiesTs: [User, Request],
  // forceEntityConstructor: false,
  debug: process.env.NODE_ENV !== "production" || process.env.DEBUG === "true",
  pool: {
    min: process.env.NODE_ENV === "production" ? 5 : 1,
    max: process.env.NODE_ENV === "production" ? 20 : 10,
  },
  // schemaGenerator: {
  //   disableForeignKeys: false,
  // },
  // Add this to prevent naming issues
  // discovery: {
  //   warnWhenNoEntities: true,
  //   requireEntitiesArray: true,
  // },
  // Add this to maintain naming conventions
  // namingStrategy: {
  //   entityToCollection: entityName => entityName.toLowerCase() + 's',
  //   entityToTableName: entityName => entityName.toLowerCase() + 's',
  // }
});