import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'a7bq2k',
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
  },
})