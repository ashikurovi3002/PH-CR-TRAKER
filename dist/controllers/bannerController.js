"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerController = void 0;
const bannerService_1 = require("../services/bannerService");
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
class BannerController {
}
exports.BannerController = BannerController;
_a = BannerController;
BannerController.getAllBanners = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const banners = await bannerService_1.BannerService.getAllBanners();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: banners });
});
BannerController.createBanner = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { title, image, order } = req.body;
    if (!title || !image) {
        throw new Error("Title and Image are required");
    }
    const banner = await bannerService_1.BannerService.createBanner({ title, image, order: order ? parseInt(order) : 0 });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Banner created successfully', data: banner });
});
BannerController.updateBanner = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { title, image, order } = req.body;
    const banner = await bannerService_1.BannerService.updateBanner(parseInt(id), {
        title,
        image,
        order: order !== undefined ? parseInt(order) : undefined
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Banner updated successfully', data: banner });
});
BannerController.deleteBanner = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await bannerService_1.BannerService.deleteBanner(parseInt(id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Banner deleted successfully' });
});
