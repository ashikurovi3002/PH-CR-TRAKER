import { Request, Response } from 'express';
import { PublicService } from '../services/publicService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

export class PublicController {
  static getBanners = catchAsync(async (req: Request, res: Response) => {
    const banners = await PublicService.getBanners();
    sendResponse(res, { statusCode: 200, data: banners });
  });

  static getStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await PublicService.getStats();
    sendResponse(res, { statusCode: 200, data: stats });
  });

  static getHeroes = catchAsync(async (req: Request, res: Response) => {
    const heroes = await PublicService.getHeroes();
    sendResponse(res, { statusCode: 200, data: heroes });
  });

  static getFeedbacks = catchAsync(async (req: Request, res: Response) => {
    const feedbacks = await PublicService.getFeedbacks();
    sendResponse(res, { statusCode: 200, data: feedbacks });
  });
}
