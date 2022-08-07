declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      JWT_SECRET: string
      CLOUD_NAME: string
      API_KEY: string
      API_SECRET: string
      CLOUDINARY_URL: string
    }
  }
}

export {}