import {Kafka} from 'kafkajs';
import fs from 'fs'
import path from 'path'

class KafkaConfig {
    constructor() {
        this.kafka = new Kafka(
            {
                clientId: "youtube uploader",
                brokers: [],
                ssl: {
                    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")]
                },
                sasl: {
                    username: "",
                    password: "",
                    mechanism: ""
                }
            }
        );

        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer();
    }

    async produce(topic, messages) {
        try {
            const result = await this.producer.connect();
            console.log("kafka connected", result);

            await this.producer.send({
                topic: topic,
                messages: messages
            });

        } catch (error) {
            console.log(error);
        } finally {
            await this.producer.disconnect();
        }
    }

    async consume(topic, callback) {
        try {
            await this.consumer.connect();
            await this.consumer.subscribe({topic: topic, fromBeginning: true})
            await this.consumer.run({
                eachMessage: async ({topic, partition, message}) => {
                    const value = message.value.toString();
                    callback(value);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export default KafkaConfig;