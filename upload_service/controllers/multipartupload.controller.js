import AWS from "aws-sdk";


export const initializeUpload = async (req, res) => {
    try {
        console.log('Initializing upload');
        const {fileName} = req.body;
        AWS.config.update({
            region: 'us-east-1',
            accessKeyId: process.env.AWS_SECRECT_ACCESS_ID,
            secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY
        });

        const s3 = new AWS.S3();

        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: fileName,
            ContentType: 'video/mp4',
            ACL: 'public-read'
        }
        const multiPartParams = await s3.createMultipartUpload(params).promise();

        return res.status(200).json({uploadId: params.uploadId});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Upload failed'});
    }
}

export const uploadChunk = async (req, res) => {
    try {
        const {filename, chunkIndex, uploadId} = req.body;
        const s3 = new AWS.S3({
            region: 'us-east-1',
            accessKeyId: process.env.AWS_SECRECT_ACCESS_ID,
            secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY
        });

        const bucketName = process.env.AWS_BUCKET;
        const partNumber = parseInt(chunkIndex) + 1;

        const params = {
            Bucket: bucketName,
            Key: filename,
            UploadId: uploadId,
            PartNumber: parseInt(chunkIndex) + 1,
            Body: req.file.buffer
        }

        const data = await s3.uploadPart(params).promise();
        res.status(200).json({success: true, ETag: data.ETag, partNumber: partNumber});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Upload failed'});
    }
}

export const completeUpload = async (req, res) => {
    try {
        console.log('Completing Upload');
        const {filename, totalChunks, uploadId} = req.body;
        const uploadParts = [];

        for (let i = 0; i < totalChunks; i++) {
            uploadParts.push({
                PartNumber: i + 1,
                ETag: req.body[`part${i + 1}`]
            });
        }

        const completeParams = {
            Bucket: process.env.AWS_BUCKET,
            Key: filename,
            UploadId: uploadId,
            MultipartUpload: {Parts: uploadParts}
        }

        const completeRes = await s3.completeMultipartUpload(completeParams).promise();
        return res.status(200).json({message: "Uploaded successfully"})

    } catch (error) {
        return res.status(500).json({message: 'Upload failed'});
    }
}

// const multiPartUploadFileToS3 = async (req, res) => {
//     const filePath = '';
//
//     if (!fs.exists(filePath)) {
//         console.log('File doesnot exists', filePath);
//         return res.status(400).send('File doesnot exist');
//     }
//
//     AWS.config.update({
//         region: 'us-east-1',
//         accessKeyId: process.env.AWS_SECRECT_ACCESS_ID,
//         secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY
//     });
//
//     const s3 = new AWS.S3();
//
//     const params = {
//         Bucket: process.env.AWS_BUCKET,
//         Key: `trial-key`,
//         ContentType: 'video/mp4',
//         ACL: 'public-read'
//     }
//
//     try {
//         const multiPartParams = await s3.createMultipartUpload(params).promise();
//         const fileSize = fs.statSync(filePath).size;
//         const chunkSize = 5 * 1024 * 1024;
//         const numParts = Math.ceil(fileSize / chunkSize);
//
//         const uploadedETags = [];
//         for (let i = 0; i < numParts; i++) {
//             const start = i * chunkSize;
//             const end = Math.min(start + chunkSize, fileSize);
//
//             const partParams = {
//                 Bucket: params.Bucket,
//                 Key: params.Key,
//                 UploadId: multiPartParams.UploadId,
//                 PartNumber: i + 1,
//                 Body: fs.createReadStream(filePath, {start, end}),
//                 ContentLength: end - start
//             }
//
//             const data = await s3.uploadPart(partParams).promise()
//             uploadedETags.push({partNumber: i + 1, ETag: data.ETag});
//         }
//
//         const completeParams = {
//             Bucket: uploadParams.Bucket,
//             Key: uploadParams.Key,
//             UploadId: multiPartParams.UploadId,
//             MultipartUpload: {Parts: uploadedETags}
//         }
//
//         console.log('Complete Multipart Upload');
//         const completeRes = await s3.completeMultipartUpload(completeParams).promise()
//         console.log(completeRes);
//
//         return res.status(200).send('File Uploaded Successfully')
//
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send('File Could not be uploaded')
//
//     }
//
// }
export default multiPartUploadFileToS3;