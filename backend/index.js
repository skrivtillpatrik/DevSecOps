import express from 'express';
import router from './routes/routes.js'; // adjust path if needed
import authRouter from './routes/auth.js';
import calendarRouter from './routes/calendarRoutes.js';
import {initDatabase, createSchema} from './db.js';
import { setupSession } from './session.js';
import dotenv from "dotenv";
import { fileURLToPath } from "url";




const app = express();

dotenv.config({ path: fileURLToPath(new URL(".env", import.meta.url)) });
initDatabase();
createSchema();

setupSession(app);

app.use(express.json());
app.use('/api', router);
app.use('/api', authRouter);
app.use('/api', calendarRouter);


// Only start the server when not running tests
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

export default app;