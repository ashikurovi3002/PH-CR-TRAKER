"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicController = void 0;
const publicService_1 = require("../services/publicService");
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
class PublicController {
}
exports.PublicController = PublicController;
_a = PublicController;
PublicController.getBanners = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const banners = await publicService_1.PublicService.getBanners();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: banners });
});
PublicController.getStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const stats = await publicService_1.PublicService.getStats();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: stats });
});
PublicController.getHeroes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const heroes = await publicService_1.PublicService.getHeroes();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: heroes });
});
PublicController.getFeedbacks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const feedbacks = await publicService_1.PublicService.getFeedbacks();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: feedbacks });
});
