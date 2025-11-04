import { defineConfig } from '@mastra/core';

export default defineConfig({
  bundler: {
    externals: ['axios', '@libsql/client'],
    // Exclude problematic modules from bundling
    exclude: ['@libsql/client', '@mastra/libsql'],
  },
});
