import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BannerService {
  static async getAllBanners() {
    return await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async createBanner(data: { title: string; image: string; order?: number }) {
    return await prisma.banner.create({
      data: {
        title: data.title,
        image: data.image,
        order: data.order !== undefined ? data.order : 0
      }
    });
  }

  static async updateBanner(id: number, data: { title?: string; image?: string; order?: number }) {
    return await prisma.banner.update({
      where: { id },
      data
    });
  }

  static async deleteBanner(id: number) {
    return await prisma.banner.delete({
      where: { id }
    });
  }
}
