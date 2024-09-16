import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegStatic)

const convertToHLS = async () => {
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

    const mp4FileName = '';
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
    console.log(`HLS master m3u8 playlist generated`);

}