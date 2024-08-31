import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from "./routes/upload.routes.js";
import cors from 'cors'
import kafkaPublisherRoute from "./routes/kafka.publisher.route.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 8080;
app.use(express.json())
app.use(cors({
    allowedHeaders: '*',
    origin: '*'
}));
app.use('/upload', uploadRoutes);
app.use('/publish', kafkaPublisherRoute);
app.listen(port, () => {
    console.log(`app started on port${port}`);
});