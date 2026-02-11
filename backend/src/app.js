import express from "express"
import cors from "cors"
import cookieParse from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParse())

import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";

app.use('/api/v1/admin', adminRoutes);
// app.use('/api/v1/user', userRoutes);


export {app}