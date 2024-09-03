import AWS from 'aws-sdk';

export const uploadFileToS3 = (req, res) => {
    if (!req.files || !req.files['chunk'] || !req.body['totalChunks'] || !req.body['chunkIndex']) {
        console.log('file not present in request');
        return res.status(400).send('No file received');
    }

    const chunk = req.files['chunk'];
    const filename = req.body['filename'];
    const totalChunks = parseInt(req.body['totalChunks']);
    const chunkIndex = parseInt(req.body['chunkIndex']);

    if (totalChunks && chunkIndex) {
        AWS.config.update({
            region: 'us-east-1',
            accessKeyId: process.env.AWS_SECRECT_ACCESS_ID,
            secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY
        });

        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `${filename}_${chunkIndex}`,
            Body: chunk[0].buffer
        }

        const s3 = new AWS.S3();

        s3.upload(params, (err, data) => {
            if (err) {
                return res.status(404).send('File could not be uploaded');
            } else {
                return res.status(200).send('File uploaded successfully')
            }
        });
    }
}
