import express from 'express';
import router from './routes/routes.js'; // adjust path if needed
import { setupSession } from './session.js';




const app = express();
setupSession(app);

app.use(express.json());
app.use('/api', router);


// Only start the server when not running tests
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

export default app;