import session from "express-session";
import SQLiteStore from "connect-sqlite3";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const SQLiteStoreSession = SQLiteStore(session);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupSession(app) {
  let origins = process.env.CORS_ORIGINS;

  if (!origins) {
    console.warn("CORS_ORIGINS not set in environment variables, defaulting to http://localhost:3000,http://localhost:3001,http://localhost:8080");
    origins = "http://localhost:3000,http://localhost:3001,http://localhost:8080";
  } else {
    console.log("CORS_ORIGINS set to:", origins);
  }

  let sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    console.warn("SESSION_SECRET not set in environment variables, defaulting to 'default_session_secret'");
    sessionSecret = "default_session_secret";
  } else {
    console.log("SESSION_SECRET is set.");
  } 

  const allowedOrigins = origins.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    session({
      store: new SQLiteStoreSession({
        db: "sessions.sqlite",
        dir: path.join(__dirname, "db")
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    })
  )
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true
  }));
};