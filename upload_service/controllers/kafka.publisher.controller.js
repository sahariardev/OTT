import KafkaConfig from "../kafka/kafka.js";

const sendMessageToKafka = async (req, res) => {
    try {
        const message = req.body;
        const kafkaconfig = new KafkaConfig();
        const msgs = [
            {
                key: "key1",
                value: JSON.stringify(message)
            }
        ];
        const result = await kafkaconfig.produce("transcode", message);

        return res.status(200).json({message: "message successfully uploaded"});
    } catch (error) {
        console.log(error)
    }
}

export default sendMessageToKafka;