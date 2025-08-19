import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "@locator/babel-jsx/dist",
            { env: "development" },
          ],
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3300,
  },
  // 👇 This makes sure build paths are relative (important if you host on IP/domain)
  base: './',
});
