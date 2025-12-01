import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js'; // Adjust the path to your app file

describe('Routes', () => {
    it('should return 200 for the root route', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent route', async () => {
        const response = await request(app).get('/non-existent');
        expect(response.status).toBe(404);
    });

    // Add more route tests as needed
});