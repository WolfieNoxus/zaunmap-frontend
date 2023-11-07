import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'ewbzkm',
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
  },
})