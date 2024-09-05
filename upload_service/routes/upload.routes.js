import express from "express";
import {uploadFileToS3} from "../controllers/upload.controller.js";
import multer from 'multer'
import {completeUpload, initializeUpload, uploadChunk} from "../controllers/multipartupload.controller.js";

const router = express.Router();
const upload = multer();

router.post('/initialize', upload.none(), initializeUpload);
router.post('/', upload.single('chunk'), uploadChunk);
router.post('/complete', completeUpload);

export default router;