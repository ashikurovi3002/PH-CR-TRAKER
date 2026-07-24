"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorController = void 0;
const ambassadorService_1 = require("../services/ambassadorService");
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
class AmbassadorController {
}
exports.AmbassadorController = AmbassadorController;
_a = AmbassadorController;
AmbassadorController.getDashboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const data = await ambassadorService_1.AmbassadorService.getDashboard(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
AmbassadorController.getActivities = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const activities = await ambassadorService_1.AmbassadorService.getActivities(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: activities });
});
AmbassadorController.getRedeems = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const redeems = await ambassadorService_1.AmbassadorService.getRedeems(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: redeems });
});
AmbassadorController.getRewards = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const rewards = await ambassadorService_1.AmbassadorService.getRewards();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: rewards });
});
AmbassadorController.requestRedeem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const { rewardId } = req.body;
    const result = await ambassadorService_1.AmbassadorService.requestRedeem(userId, parseInt(rewardId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Redeem request submitted successfully', data: result });
});
AmbassadorController.getLeaderboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const { type } = req.query;
    const leaderboardData = await ambassadorService_1.AmbassadorService.getLeaderboard(userId, type);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: leaderboardData });
});
AmbassadorController.updateProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const { name, phone, campus, department, clubName, profileImage, institutionType } = req.body;
    const updatedUser = await ambassadorService_1.AmbassadorService.updateProfile(userId, { name, phone, campus, department, clubName, profileImage, institutionType });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Profile updated successfully', data: updatedUser });
});
AmbassadorController.submitFeedback = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const { message, rating } = req.body;
    if (!message)
        throw new Error("Message is required");
    const feedback = await ambassadorService_1.AmbassadorService.submitFeedback(userId, message, rating ? parseInt(rating) : undefined);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Feedback submitted successfully', data: feedback });
});
AmbassadorController.getFeedbacks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const feedbacks = await ambassadorService_1.AmbassadorService.getFeedbacks(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: feedbacks });
});
