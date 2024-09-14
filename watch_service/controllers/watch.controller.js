import AWS from 'aws-sdk';

async function generateSignedUrl(videoKey) {
    const s3 = new AWS.S3({
        region: 'us-east-1',
        accessKeyId: process.env.AWS_SECRECT_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY
    });

    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: videoKey,
        Expires: 3600
    }

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', params, (err, url) => {
            if (err) {
                reject(err);
            } else {
                resolve(url);
            }
        })
    });
}

const watchVideo = async (req, res) => {
    try {
        const videoKey = req.query.key;
        const signedUrl = await generateSignedUrl(videoKey);

        return res.json({signedUrl});
    } catch (err) {
        console.log(err);

        return res.status(500).json({error: 'Internal Sever Error'});
    }
}

export default watchVideo;