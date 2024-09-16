import {useEffect, useRef} from "react";
import Hls from 'hls.js'

const VideoPlayer = () => {

    const videoRef = useRef(null);
    const src = '';

    useEffect(() => {

        const video = videoRef.current;

        if (Hls.isSupported()) {

            const hls = new Hls();
            hls.attachMedia(video);
            hls.loadSource(src);
            hls.on(Hls.Events.MANIFEST_PARSED, function (){
               console.log('Plating video');
               video.play();
            });
        } else {
            throw Error('HLS is not supported');
        }
    }, [src]);

    return (
        <div>
            <video ref={videoRef}></video>
        </div>
    );
}

export default VideoPlayer;