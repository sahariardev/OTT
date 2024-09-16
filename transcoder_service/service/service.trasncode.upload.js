import dotenv from "dotenv";
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegStatic);

dotenv.config()

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY
});

const mp4FileName = 'temp.mp4'
const bucketName = process.env.AWS_BUCKET;
const hlsFolder = 'hls';

const s3ToS3 = async (fileName) => {
    try {

        const mp4FilePath = `${mp4FileName}`;
        const writeStream = fs.createWriteStream('local.mp4');
        const readStream = s3.getObject({Bucket: bucketName, Key: mp4FilePath}).createReadStream();

        readStream.pipe(writeStream);

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        console.log('Downloaded s3 mp4 file locally');

        const resolutions = [
            {
                resolutions: '320x180',
                videRate: '500k',
                audioRate: '64k',
                bandwidth: 676800
            },
            {
                resolutions: '320x180',
                videRate: '500k',
                audioRate: '64k',
                bandwidth: 1353600
            },
            {
                resolutions: '320x180',
                videRate: '500k',
                audioRate: '64k',
                bandwidth: 3230400
            }
        ];

        const variantPlayLists = [];

        for (const {resolution, videRate, audioRate, bandwidth} of resolutions) {
            const outputFilename = `${mp4FileName.replace('.', '_')}_${resolution}.m3u8`;
            const segmentFilename = `${mp4FileName.replace('.', '_')}_${resolution}_%03d.ts`;
            const outputFilenameWithFolder = `output/${outputFilename}`;

            await new Promise((resolve, reject) => {
                ffmpeg(mp4FileName).outputOptions([
                    `-c:v h264`,
                    `-b:v ${videRate}`,
                    `-c:a aac`,
                    `-b:a ${audioRate}`,
                    `-vf scale=${resolution}`,
                    `-f hls`,
                    `-hls_time 10`,
                    `-hls_list_size 0`,
                    `-hls_segment_filename output/${segmentFileName}`
                ]).output(outputFilenameWithFolder)
                    .on('end', () => resolve())
                    .on('error', (error) => reject(error))
                    .run();
            });

            const variantPlaylist = {
                resolution,
                outputFilename,
                bandwidth
            };

            variantPlayLists.push(variantPlaylist);
        }

        let masterPlaylist = variantPlayLists.map((variantPlayList) => {
            const {resolution, outputFilename, bandwidth} = variantPlayList;
            return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFilename}`;
        }).join('\n');

        masterPlaylist = `#EXTM3U\n` + masterPlaylist;
        const masterPlaylistFileName = `${mp4FileName.replace(
            '.',
            '_'
        )}_master.m3u8`;
        const masterPlaylistPath = `output/${masterPlaylistFileName}`;
        fs.writeFileSync(masterPlaylistPath, masterPlaylist);
        fs.unlink('local.mp4');

        const files = fs.readdirSync('output');

        for(const file of files) {
            if (!file.startsWith(mp4FileName.replace('.', '_'))) {
                continue;
            }

            const filePath = path.join('output', file);
            const fileStream = fs.createReadStream(filePath);

            const uploadParams = {
                Bucket: bucketName,
                Key: `output/${file}`,
                Body: fileStream,
                ContentType: file.endsWith('.ts') ? 'video/mp2t' : file.endsWith('.m3u8') ? 'application/x-mpegURL' : null
            }

            await s3.upload(uploadParams).promise();
            fs.unlinkSync(filePath);
        }

        console.log(`Uploaded files files`);

    } catch (error) {
        console.error('Error', error);
    }
}
