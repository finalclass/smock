import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4000',
    headless: true,
  },
  webServer: {
    command: 'set -a && . ../.env && set +a && dune exec bin/main.exe',
    url: 'http://localhost:4000/login',
    reuseExistingServer: true,
    timeout: 60000,
  },
});
