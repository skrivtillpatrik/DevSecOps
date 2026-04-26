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
    const server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

    // Handle server errors
    server.on('error', (err) => {
        console.error('Server error:', err);
        process.exit(1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });

    // Keep the process alive
    process.on('SIGINT', () => {
        console.log('Received SIGINT, shutting down gracefully');
        server.close(() => {
            process.exit(0);
        });
    });

    process.on('SIGTERM', () => {
        console.log('Received SIGTERM, shutting down gracefully');
        server.close(() => {
            process.exit(0);
        });
    });
}

// // Only export when imported as module (for testing)
// if (import.meta.url === `file://${process.argv[1]}`) {
//     // Running directly, don't export
// } else {
//     export default app;
// }

export default app;
