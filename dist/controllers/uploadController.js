"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const blob_1 = require("@vercel/blob");
class UploadController {
}
exports.UploadController = UploadController;
_a = UploadController;
UploadController.uploadFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.file) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 400,
            message: 'No file provided',
        });
        return;
    }
    const blob = await (0, blob_1.put)(req.file.originalname, req.file.buffer, {
        access: 'public',
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'File uploaded successfully',
        data: {
            url: blob.url,
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
        },
    });
});
UploadController.uploadMultipleFiles = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 400,
            message: 'No files provided',
        });
        return;
    }
    const uploadPromises = req.files.map(async (file) => {
        const blob = await (0, blob_1.put)(file.originalname, file.buffer, {
            access: 'public',
        });
        return {
            url: blob.url,
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        };
    });
    const fileData = await Promise.all(uploadPromises);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Files uploaded successfully',
        data: fileData,
    });
});
