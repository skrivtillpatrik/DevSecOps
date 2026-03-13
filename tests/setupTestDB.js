import { beforeEach } from "vitest";
import { initDatabase, createSchema } from "../backend/db.js";

initDatabase();
createSchema();

// beforeEach(() => {
//   process.env.NODE_ENV = "test";
//   initDatabase();
//   createSchema();
// });
