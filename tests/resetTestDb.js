import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Hitta absolut sökväg till denna fil
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bygg sökvägen till testdatabasen
// Går från /tests → /backend/db/database.test.sqlite
const dbPath = path.join(__dirname, "..", "backend", "db", "database.test.sqlite");

console.log("Resetting test database at:", dbPath);

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log("✔ Test database removed");
} else {
  console.log("ℹ No test database found (nothing to remove)");
}