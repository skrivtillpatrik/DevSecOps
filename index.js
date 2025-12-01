import express from 'express';
import usersRouter from './src/routes.js'; // adjust path if needed

const app = express();

app.use(express.json());
app.use('/users', usersRouter);

// Only start the server when not running tests
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

export default app;