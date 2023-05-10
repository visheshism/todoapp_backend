import { config } from "dotenv";
config({
    path: "./data/creds.env"
})

export const { PORT, MONGO_URI, JWT_SECRET, FRONTEND_URL, ADMIN_EMAIL, ADMIN_EMAIL_PASSWORD, ADMIN_EMAIL_HOST, ADMIN_EMAIL_PORT } = process.env