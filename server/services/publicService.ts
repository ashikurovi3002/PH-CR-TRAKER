import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PublicService {
  static async getBanners() {
    return await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async getStats() {
    const totalAmbassadors = await prisma.user.count({
      where: { role: 'ambassador', status: 'ACTIVE' }
    });

    const totalPointsResult = await prisma.user.aggregate({
      where: { role: 'ambassador' },
      _sum: { totalPoints: true }
    });

    const totalInstitutions = await prisma.user.findMany({
      where: { role: 'ambassador' },
      select: { campus: true },
      distinct: ['campus']
    });

    const totalRedeems = await prisma.redeemRequest.count({
      where: { status: 'COMPLETED' }
    });

    return {
      totalAmbassadors,
      totalPoints: totalPointsResult._sum.totalPoints || 0,
      totalInstitutions: totalInstitutions.length,
      totalRedeems
    };
  }

  static async getHeroes() {
    return await prisma.user.findMany({
      where: { role: 'ambassador', status: 'ACTIVE' },
      orderBy: { totalPoints: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        campus: true,
        profileImage: true,
        totalPoints: true
      }
    });
  }

  static async getFeedbacks() {
    return await prisma.feedback.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: {
          select: {
            name: true,
            campus: true,
            profileImage: true
          }
        }
      }
    });
  }
}
