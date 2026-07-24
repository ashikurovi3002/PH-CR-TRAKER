import { Request, Response } from 'express';
import { AmbassadorService } from '../services/ambassadorService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

export class AmbassadorController {
  static getDashboard = catchAsync(async (req: any, res: Response) => {
    const userId = req.user.userId;
    const data = await AmbassadorService.getDashboard(userId);
    sendResponse(res, { statusCode: 200, data });
  });

  static getActivities = catchAsync(async (req: any, res: Response) => {
    const userId = req.user.userId;
    const activities = await AmbassadorService.getActivities(userId);
    sendResponse(res, { statusCode: 200, data: activities });
  });

  static getRedeems = catchAsync(async (req: any, res: Response) => {
    const userId = req.user.userId;
    const redeems = await AmbassadorService.getRedeems(userId);
    sendResponse(res, { statusCode: 200, data: redeems });
  });

  static getRewards = catchAsync(async (req: Request, res: Response) => {
    const rewards = await AmbassadorService.getRewards();
    sendResponse(res, { statusCode: 200, data: rewards });
  });

  static requestRedeem = catchAsync(async (req: any, res: Response) => {
    const userId = req.user.userId;
    const { rewardId } = req.body;
    
    const result = await AmbassadorService.requestRedeem(userId, parseInt(rewardId));
    sendResponse(res, { statusCode: 201, message: 'Redeem request submitted successfully', data: result });
  });

  static getLeaderboard = catchAsync(async (req: any, res: Response) => {
    const userId = req.user.userId;
    const { type } = req.query;
    const leaderboardData = await AmbassadorService.getLeaderboard(userId, type as string);
    sendResponse(res, { statusCode: 200, data: leaderboardData });
  });

  static updateProfile = catchAsync(async (req: any, res: Response) => {
    const userId = req.user.userId;
    const { name, phone, campus, department, clubName, profileImage, institutionType } = req.body;
    
    const updatedUser = await AmbassadorService.updateProfile(userId, { name, phone, campus, department, clubName, profileImage, institutionType });
    sendResponse(res, { statusCode: 200, message: 'Profile updated successfully', data: updatedUser });
  });

  static submitFeedback = catchAsync(async (req: any, res: Response) => {
    const userId = req.user.userId;
    const { message, rating } = req.body;
    if (!message) throw new Error("Message is required");
    
    const feedback = await AmbassadorService.submitFeedback(userId, message, rating ? parseInt(rating) : undefined);
    sendResponse(res, { statusCode: 201, message: 'Feedback submitted successfully', data: feedback });
  });

  static getFeedbacks = catchAsync(async (req: any, res: Response) => {
    const userId = req.user.userId;
    const feedbacks = await AmbassadorService.getFeedbacks(userId);
    sendResponse(res, { statusCode: 200, data: feedbacks });
  });
}
