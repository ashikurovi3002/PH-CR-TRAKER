import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

export class UploadController {
  static uploadFile = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      sendResponse(res, {
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

    sendResponse(res, {
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

  static uploadMultipleFiles = catchAsync(async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      sendResponse(res, {
        statusCode: 400,
        message: 'No files provided',
      });
      return;
    }

    const protocol = req.protocol;
    const host = req.get('host') || 'localhost:5001';
    const baseUrl = process.env.API_URL || `${protocol}://${host}`;

    const fileData = req.files.map((file: any) => ({
      url: `${baseUrl}/uploads/${file.filename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    }));

    sendResponse(res, {
      statusCode: 200,
      message: 'Files uploaded successfully',
      data: fileData,
    });
  });
}
