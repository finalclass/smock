import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:6500',
    headless: true,
  },
  webServer: {
    command: 'rm -rf data/*.sqlite data/*.sqlite-shm data/*.sqlite-wal && set -a && source ../.env && set +a && SMOCK_ADMIN_KEY=admin SMOCK_ADMIN_EMAIL=cap dune exec bin/main.exe',
    url: 'http://localhost:6500/login',
    reuseExistingServer: true,
    timeout: 60000,
  },
});
