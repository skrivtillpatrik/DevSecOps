import session from "express-session";
import SQLiteStore from "connect-sqlite3";

const SQLiteStoreSession = SQLiteStore(session);

export function setupSession(app) {
app.use(
  session({
    store: new SQLiteStoreSession({
      db: "sessions.sqlite",
      dir: "./db"
    }),
    secret: process.env.SESSION_SECRET,
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
    origin: 'http://localhost:3000',
    credentials: true
}));
};