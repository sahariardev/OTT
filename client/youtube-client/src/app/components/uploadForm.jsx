'use client'
import React, {useState} from 'react';
import axios from "axios";

const UploadForm = () => {

    const [selectedFile, setSelectedFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleFileUpload(selectedFile);
    }

    const handleFileUpload = async (file) => {
        try {

            const chunkSize = 100 * 1024 * 1024;
            const totalchunks = Math.ceil(file.size / chunkSize);

            console.log(file.size);
            console.log(chunkSize);
            console.log(totalchunks);

            let start = 0;
            for (let chunkIndex = 0; chunkIndex < totalchunks; chunkIndex++) {
                const chunk = file.slice(start, start + chunkSize);
                start = start + chunkSize;

                const formData = new FormData();
                formData.append("filename", file.name);
                formData.append("chunk", chunk);
                formData.append("totalChunks", totalchunks);
                formData.append("chunkIndex", chunkIndex);

                const res = await axios.post('http://localhost:8080/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(res.data)

            }
        } catch (error) {
            console.log('Something went wrong' + error);
        }
    }


    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange}/>
                <button
                    className="inline-flex text-white bg-indigo-500 border-0 py-2
                px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                    Upload
                </button>
            </form>
        </div>
    );
};

export default UploadForm;