import express from 'express';
import dotenv from 'dotenv';
import watchRoute from "./routes/watch.route.js";
import cors from 'cors';

dotenv.config();

const port = process.env.PORT || 5656;
const app = express();
app.use(cors({
    allowedHeaders: ['*'],
    origin: '*'
}));

app.use(express.json());

app.use('watch', watchRoute);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});