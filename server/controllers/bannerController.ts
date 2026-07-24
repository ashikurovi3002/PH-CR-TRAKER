import { Request, Response } from 'express';
import { BannerService } from '../services/bannerService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

export class BannerController {
  static getAllBanners = catchAsync(async (req: Request, res: Response) => {
    const banners = await BannerService.getAllBanners();
    sendResponse(res, { statusCode: 200, data: banners });
  });

  static createBanner = catchAsync(async (req: Request, res: Response) => {
    const { title, image, order } = req.body;
    
    if (!title || !image) {
      throw new Error("Title and Image are required");
    }

    const banner = await BannerService.createBanner({ title, image, order: order ? parseInt(order) : 0 });
    sendResponse(res, { statusCode: 201, message: 'Banner created successfully', data: banner });
  });

  static updateBanner = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, image, order } = req.body;
    
    const banner = await BannerService.updateBanner(parseInt(id as string), {
      title, 
      image, 
      order: order !== undefined ? parseInt(order) : undefined 
    });
    
    sendResponse(res, { statusCode: 200, message: 'Banner updated successfully', data: banner });
  });

  static deleteBanner = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await BannerService.deleteBanner(parseInt(id as string));
    sendResponse(res, { statusCode: 200, message: 'Banner deleted successfully' });
  });
}
