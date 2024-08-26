'use client'
import React, {useState} from 'react';
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), {ssr: false});

const Room = () => {

    const [userStream, setUserStream] = useState();

    const callUser = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        setUserStream(stream);
    }

    return (
        <div className="container m-4">
            <div >
                <ReactPlayer url='https://www.youtube.com/watch?v=LXb3EKWsInQ' controls={true} width="400px"/>
            </div>
            <button
                className="inline-flex text-white bg-indigo-500 border-0 py-2
                px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                onClick={callUser}
            >
                Call
            </button>
            <div >
                <ReactPlayer url={userStream} controls={true} width="400px"/>
            </div>
        </div>
    );
};

export default Room;