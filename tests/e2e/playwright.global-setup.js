import { request } from '@playwright/test';

export default async function globalSetup(config) {
  const api = await request.newContext({
    baseURL: 'http://localhost:3000'
  });

  // Create test user for all tests
  await api.post('/api/users', {
    data: {
      name: 'e2etestUser',
      password: 'defaultPassword'
    }
  });
  console.log("Test user created: e2etestUser");

  await api.dispose();
}
