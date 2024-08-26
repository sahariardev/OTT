import AWS from 'aws-sdk';
import fs from 'fs';

export const uploadFileToS3 = (req, res) => {
    if (!req.file) {
        console.log('file not present in request');
        return;
    }

    const file = req.file;

    AWS.config.update({
        region: 'us-east-1',
        accessKeyId: process.env.AWS_SECRECT_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY
    });

    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: file.originalname,
        Body: file.buffer
    }

    const s3 = new AWS.S3();

    s3.upload(params, (err, data) => {
        if (err) {
            res.status(404).send('File could not be uploaded');
        } else {
            res.status(200).send('File uploaded successfully')
        }
    });
}
