import { FRONTEND_URL } from "./env.js";

export const corsOptions = {
    origin: [FRONTEND_URL],
    methods: ['GET', 'POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }