"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BannerService {
    static async getAllBanners() {
        return await prisma.banner.findMany({
            orderBy: { order: 'asc' }
        });
    }
    static async createBanner(data) {
        return await prisma.banner.create({
            data: {
                title: data.title,
                image: data.image,
                order: data.order !== undefined ? data.order : 0
            }
        });
    }
    static async updateBanner(id, data) {
        return await prisma.banner.update({
            where: { id },
            data
        });
    }
    static async deleteBanner(id) {
        return await prisma.banner.delete({
            where: { id }
        });
    }
}
exports.BannerService = BannerService;
