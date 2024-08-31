import express from 'express';
import dotenv from 'dotenv';

dotenv.configDotenv();

const app = express();

const port = process.env.PORT || 6000;

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});
