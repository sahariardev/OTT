import express from "express";
import {uploadFileToS3} from "../controllers/upload.controller.js";
import multer from 'multer'

const router = express.Router();
const upload = multer();

router.post('/', upload.single('file'), uploadFileToS3);
export default router;