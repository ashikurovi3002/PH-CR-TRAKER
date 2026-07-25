import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { put } from '@vercel/blob';

export class UploadController {
  static uploadFile = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      sendResponse(res, {
        statusCode: 400,
        message: 'No file provided',
      });
      return;
    }

    const blob = await put(req.file.originalname, req.file.buffer, {
      access: 'public',
    });

    sendResponse(res, {
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

  static uploadMultipleFiles = catchAsync(async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      sendResponse(res, {
        statusCode: 400,
        message: 'No files provided',
      });
      return;
    }

    const uploadPromises = req.files.map(async (file: any) => {
      const blob = await put(file.originalname, file.buffer, {
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

    sendResponse(res, {
      statusCode: 200,
      message: 'Files uploaded successfully',
      data: fileData,
    });
  });
}
