import { request } from '@playwright/test';

export default async function globalSetup(config) {
  const api = await request.newContext({
    baseURL: 'http://localhost:3000'
  });

  // Skapa testanvändare via API eller direkt i databasen
  await api.post('/api/users', {
    data: {
      name: 'e2etestUser',
      password: 'defaultPassword'
    }
  });
  console.log("Testanvändare skapad");

  await api.dispose();
}
