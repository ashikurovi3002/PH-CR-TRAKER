import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';
import { AuthService } from '../services/authService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

export class AdminController {
  // Users
  static updateProfile = catchAsync(async (req: any, res: Response) => {
    const adminId = req.user.userId;
    const { name, phone, profileImage, password, institutionType } = req.body;
    const updatedAdmin = await AdminService.updateProfile(adminId, { name, phone, profileImage, password, institutionType });
    sendResponse(res, { statusCode: 200, message: 'Profile updated successfully', data: updatedAdmin });
  });

  static getDashboardStats = catchAsync(async (req: any, res: Response) => {
    const adminId = req.user.userId;
    const stats = await AdminService.getDashboardStats(adminId);
    sendResponse(res, { statusCode: 200, data: stats });
  });

  static createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await AuthService.registerUser(req.body);
    sendResponse(res, { statusCode: 201, message: 'User created successfully', data: user });
  });

  static getUsers = catchAsync(async (req: any, res: Response) => {
    const adminId = req.user.userId;
    const users = await AdminService.getUsers(adminId);
    sendResponse(res, { statusCode: 200, data: users });
  });

  static getUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await AdminService.getUser(parseInt(id as string));
    if (!user) {
      sendResponse(res, { statusCode: 404, message: 'User not found' });
      return;
    }
    sendResponse(res, { statusCode: 200, data: user });
  });

  static updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, institutionType } = req.body;
    
    const user = await AdminService.updateUser(parseInt(id as string), { status, institutionType });
    sendResponse(res, { statusCode: 200, message: 'User updated', data: user });
  });

  static deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await AdminService.deleteUser(parseInt(id as string));
    sendResponse(res, { statusCode: 200, message: 'User deleted successfully' });
  });

  // Activities
  static createActivity = catchAsync(async (req: Request, res: Response) => {
    const { title, description, points, startDate, endDate } = req.body;
    const activity = await AdminService.createActivity({ 
      title, 
      description, 
      points: parseInt(points),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });
    sendResponse(res, { statusCode: 201, message: 'Activity created', data: activity });
  });

  static getActivities = catchAsync(async (req: Request, res: Response) => {
    const activities = await AdminService.getActivities();
    sendResponse(res, { statusCode: 200, data: activities });
  });

  static updateActivity = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, points, status, startDate, endDate } = req.body;
    
    const activity = await AdminService.updateActivity(parseInt(id as string), { 
      title, 
      description, 
      points: points ? parseInt(points) : undefined, 
      status,
      startDate: startDate ? new Date(startDate) : (startDate === null ? null : undefined),
      endDate: endDate ? new Date(endDate) : (endDate === null ? null : undefined)
    });
    sendResponse(res, { statusCode: 200, message: 'Activity updated', data: activity });
  });

  static deleteActivity = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await AdminService.deleteActivity(parseInt(id as string));
    sendResponse(res, { statusCode: 200, message: 'Activity deleted' });
  });

  // Points
  static bulkAddPoints = catchAsync(async (req: any, res: Response) => {
    const { userIds, activityId, points, note } = req.body;
    const addedBy = req.user.userId;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      sendResponse(res, { statusCode: 400, message: 'userIds array is required' });
      return;
    }

    const result = await AdminService.bulkAddPoints({ 
      userIds: userIds.map((id: any) => parseInt(id)), 
      activityId: parseInt(activityId), 
      points: parseInt(points), 
      note, 
      addedBy 
    });

    sendResponse(res, { statusCode: 201, message: `Points added successfully to ${result.count} users`, data: result });
  });

  static addPoints = catchAsync(async (req: any, res: Response) => {
    const { userId, activityId, points, note } = req.body;
    const addedBy = req.user.userId;

    const result = await AdminService.addPoints({ 
      userId: parseInt(userId), 
      activityId: parseInt(activityId), 
      points: parseInt(points), 
      note, 
      addedBy 
    });

    sendResponse(res, { statusCode: 201, message: 'Points added successfully', data: result });
  });

  static getPointsHistory = catchAsync(async (req: any, res: Response) => {
    const adminId = req.user.userId;
    const history = await AdminService.getPointsHistory(adminId);
    sendResponse(res, { statusCode: 200, data: history });
  });

  // Rewards
  static createReward = catchAsync(async (req: Request, res: Response) => {
    const { name, image, description, requiredPoints, stock } = req.body;
    const reward = await AdminService.createReward({ 
      name, image, description, requiredPoints: parseInt(requiredPoints), stock: parseInt(stock) 
    });
    sendResponse(res, { statusCode: 201, message: 'Reward created', data: reward });
  });

  static getRewards = catchAsync(async (req: Request, res: Response) => {
    const rewards = await AdminService.getRewards();
    sendResponse(res, { statusCode: 200, data: rewards });
  });

  static updateReward = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, image, description, requiredPoints, stock, status } = req.body;
    
    const reward = await AdminService.updateReward(parseInt(id as string), { 
      name, image, description, requiredPoints: requiredPoints ? parseInt(requiredPoints) : undefined, stock: stock ? parseInt(stock) : undefined, status 
    });
    sendResponse(res, { statusCode: 200, message: 'Reward updated', data: reward });
  });

  static deleteReward = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await AdminService.deleteReward(parseInt(id as string));
    sendResponse(res, { statusCode: 200, message: 'Reward deleted' });
  });

  // Redeems
  static getRedeems = catchAsync(async (req: any, res: Response) => {
    const adminId = req.user.userId;
    const redeems = await AdminService.getRedeems(adminId);
    sendResponse(res, { statusCode: 200, data: redeems });
  });

  static updateRedeemStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; 
    
    const redeem = await AdminService.updateRedeemStatus(parseInt(id as string), status);
    sendResponse(res, { statusCode: 200, message: 'Redeem status updated', data: redeem });
  });

  // Feedbacks
  static getFeedbacks = catchAsync(async (req: any, res: Response) => {
    const adminId = req.user.userId;
    const feedbacks = await AdminService.getFeedbacks(adminId);
    sendResponse(res, { statusCode: 200, data: feedbacks });
  });

  static updateFeedback = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, message } = req.body;
    
    const feedback = await AdminService.updateFeedback(parseInt(id as string), { status, message });
    sendResponse(res, { statusCode: 200, message: 'Feedback updated', data: feedback });
  });
}
