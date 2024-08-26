import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from "./routes/upload.routes.js";
import cors from 'cors'

dotenv.config();

const app = express();

const port = process.env.PORT || 8080;
app.use(express.json())
app.use(cors({
    allowedHeaders: '*',
    origin: '*'
}));
app.use('/upload', uploadRoutes);

app.listen(port, () => {
    console.log(`app started on port${port}`);
});