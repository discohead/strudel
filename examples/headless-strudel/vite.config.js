
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173
  },
  optimizeDeps: {
    include: ['@strudel/core', '@strudel/mini', '@strudel/transpiler', '@strudel/webaudio', '@strudel/tonal']
  }
});
      