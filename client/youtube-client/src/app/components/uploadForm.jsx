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

            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            });
            console.log(res.data)
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