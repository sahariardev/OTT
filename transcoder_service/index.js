import express from 'express';
import dotenv from 'dotenv';
import KafkaConfig from "./kafka/kafka";


dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 6000;

app.get('/', (req, res) => {
    res.send('Transcoder service client');
});

const kafkaconfig = new KafkaConfig();

kafkaconfig.consume("transcode", (value) => {
    console.log("got data from kafka", value);
});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});
