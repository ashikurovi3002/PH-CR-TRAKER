"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const adminService_1 = require("../services/adminService");
const authService_1 = require("../services/authService");
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
class AdminController {
}
exports.AdminController = AdminController;
_a = AdminController;
// Users
AdminController.updateProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const adminId = req.user.userId;
    const { name, phone, profileImage, password, institutionType } = req.body;
    const updatedAdmin = await adminService_1.AdminService.updateProfile(adminId, { name, phone, profileImage, password, institutionType });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Profile updated successfully', data: updatedAdmin });
});
AdminController.getDashboardStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const adminId = req.user.userId;
    const stats = await adminService_1.AdminService.getDashboardStats(adminId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: stats });
});
AdminController.createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await authService_1.AuthService.registerUser(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'User created successfully', data: user });
});
AdminController.getUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const adminId = req.user.userId;
    const users = await adminService_1.AdminService.getUsers(adminId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: users });
});
AdminController.getUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const user = await adminService_1.AdminService.getUser(parseInt(id));
    if (!user) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'User not found' });
        return;
    }
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: user });
});
AdminController.updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { status, institutionType } = req.body;
    const user = await adminService_1.AdminService.updateUser(parseInt(id), { status, institutionType });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'User updated', data: user });
});
AdminController.deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await adminService_1.AdminService.deleteUser(parseInt(id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'User deleted successfully' });
});
// Activities
AdminController.createActivity = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { title, description, points, startDate, endDate } = req.body;
    const activity = await adminService_1.AdminService.createActivity({
        title,
        description,
        points: parseInt(points),
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Activity created', data: activity });
});
AdminController.getActivities = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const activities = await adminService_1.AdminService.getActivities();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: activities });
});
AdminController.updateActivity = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { title, description, points, status, startDate, endDate } = req.body;
    const activity = await adminService_1.AdminService.updateActivity(parseInt(id), {
        title,
        description,
        points: points ? parseInt(points) : undefined,
        status,
        startDate: startDate ? new Date(startDate) : (startDate === null ? null : undefined),
        endDate: endDate ? new Date(endDate) : (endDate === null ? null : undefined)
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Activity updated', data: activity });
});
AdminController.deleteActivity = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await adminService_1.AdminService.deleteActivity(parseInt(id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Activity deleted' });
});
// Points
AdminController.bulkAddPoints = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userIds, activityId, points, note } = req.body;
    const addedBy = req.user.userId;
    if (!Array.isArray(userIds) || userIds.length === 0) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'userIds array is required' });
        return;
    }
    const result = await adminService_1.AdminService.bulkAddPoints({
        userIds: userIds.map((id) => parseInt(id)),
        activityId: parseInt(activityId),
        points: parseInt(points),
        note,
        addedBy
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: `Points added successfully to ${result.count} users`, data: result });
});
AdminController.addPoints = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId, activityId, points, note } = req.body;
    const addedBy = req.user.userId;
    const result = await adminService_1.AdminService.addPoints({
        userId: parseInt(userId),
        activityId: parseInt(activityId),
        points: parseInt(points),
        note,
        addedBy
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Points added successfully', data: result });
});
AdminController.getPointsHistory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const adminId = req.user.userId;
    const history = await adminService_1.AdminService.getPointsHistory(adminId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: history });
});
// Rewards
AdminController.createReward = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, image, description, requiredPoints, stock } = req.body;
    const reward = await adminService_1.AdminService.createReward({
        name, image, description, requiredPoints: parseInt(requiredPoints), stock: parseInt(stock)
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Reward created', data: reward });
});
AdminController.getRewards = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const rewards = await adminService_1.AdminService.getRewards();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: rewards });
});
AdminController.updateReward = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { name, image, description, requiredPoints, stock, status } = req.body;
    const reward = await adminService_1.AdminService.updateReward(parseInt(id), {
        name, image, description, requiredPoints: requiredPoints ? parseInt(requiredPoints) : undefined, stock: stock ? parseInt(stock) : undefined, status
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Reward updated', data: reward });
});
AdminController.deleteReward = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await adminService_1.AdminService.deleteReward(parseInt(id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Reward deleted' });
});
// Redeems
AdminController.getRedeems = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const adminId = req.user.userId;
    const redeems = await adminService_1.AdminService.getRedeems(adminId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: redeems });
});
AdminController.updateRedeemStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const redeem = await adminService_1.AdminService.updateRedeemStatus(parseInt(id), status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Redeem status updated', data: redeem });
});
// Feedbacks
AdminController.getFeedbacks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const adminId = req.user.userId;
    const feedbacks = await adminService_1.AdminService.getFeedbacks(adminId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: feedbacks });
});
AdminController.updateFeedback = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { status, message } = req.body;
    const feedback = await adminService_1.AdminService.updateFeedback(parseInt(id), { status, message });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Feedback updated', data: feedback });
});
