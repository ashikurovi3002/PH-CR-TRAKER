"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
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
    // Construct the backend URL for the file
    // Generate a full URL using the request protocol and host, or fallback to localhost:5001
    const protocol = req.protocol;
    const host = req.get('host') || 'localhost:5001';
    const baseUrl = process.env.API_URL || `${protocol}://${host}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'File uploaded successfully',
        data: {
            url: fileUrl,
            filename: req.file.filename,
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
    const protocol = req.protocol;
    const host = req.get('host') || 'localhost:5001';
    const baseUrl = process.env.API_URL || `${protocol}://${host}`;
    const fileData = req.files.map((file) => ({
        url: `${baseUrl}/uploads/${file.filename}`,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
    }));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Files uploaded successfully',
        data: fileData,
    });
});
