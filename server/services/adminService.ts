import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class AdminService {
  // Users
  static async updateProfile(adminId: number, data: { name?: string, phone?: string, profileImage?: string, password?: string, institutionType?: string }) {
    const dataToUpdate: any = {};
    if (data.name) dataToUpdate.name = data.name;
    if (data.phone) dataToUpdate.phone = data.phone;
    if (data.profileImage) dataToUpdate.profileImage = data.profileImage;
    if (data.institutionType) dataToUpdate.institutionType = data.institutionType;
    if (data.password) {
      dataToUpdate.password = await bcrypt.hash(data.password, 10);
    }
    
    return await prisma.user.update({
      where: { id: adminId },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, phone: true, profileImage: true, role: true }
    });
  }
  static async getUsers(adminId: number) {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    const whereClause: any = { role: 'ambassador' };
    
    // Filter by admin's institution type if they have one assigned
    if (admin && admin.institutionType) {
      whereClause.institutionType = admin.institutionType;
    }

    return await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true, name: true, email: true, phone: true, campus: true, department: true, clubName: true, status: true, totalPoints: true, createdAt: true, institutionType: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getDashboardStats(adminId: number) {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    const whereClause: any = { role: 'ambassador' };
    
    if (admin && admin.institutionType) {
      whereClause.institutionType = admin.institutionType;
    }

    const [
      totalUsers,
      totalActivities,
      pendingRedeems,
      totalFeedbacks,
      pendingFeedbacks,
      totalBanners
    ] = await Promise.all([
      prisma.user.count({ where: whereClause }),
      prisma.activity.count(),
      prisma.redeemRequest.count({ where: { status: 'PENDING' } }),
      prisma.feedback.count(),
      prisma.feedback.count({ where: { status: 'PENDING' } }),
      prisma.banner.count()
    ]);

    // Leaderboard logic
    const allAmbassadors = await prisma.user.findMany({
      where: whereClause,
      select: { id: true, name: true, campus: true, totalPoints: true, profileImage: true },
      orderBy: { totalPoints: 'desc' },
      take: 10
    });

    return {
      users: totalUsers,
      totalActivities,
      pendingRedeems,
      totalFeedbacks,
      pendingFeedbacks,
      totalBanners,
      leaderboard: allAmbassadors
    };
  }

  static async getUser(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: { pointTransactions: { include: { activity: true } }, redeemRequests: { include: { reward: true } } }
    });
  }

  static async updateUser(id: number, data: { status?: string; institutionType?: string | null }) {
    if (data.status && !['PENDING', 'ACTIVE', 'BLOCKED'].includes(data.status)) {
      throw new Error('Invalid status');
    }
    return await prisma.user.update({
      where: { id },
      data
    });
  }

  static async deleteUser(id: number) {
    return await prisma.$transaction([
      prisma.pointTransaction.deleteMany({ where: { userId: id } }),
      prisma.redeemRequest.deleteMany({ where: { userId: id } }),
      prisma.feedback.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } })
    ]);
  }

  // Activities
  static async createActivity(data: { title: string; description?: string; points: number; startDate?: Date; endDate?: Date }) {
    return await prisma.activity.create({ data });
  }

  static async getActivities() {
    return await prisma.activity.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async updateActivity(id: number, data: { title?: string; description?: string; points?: number; status?: string; startDate?: Date | null; endDate?: Date | null }) {
    return await prisma.activity.update({
      where: { id },
      data
    });
  }

  static async deleteActivity(id: number) {
    return await prisma.activity.delete({ where: { id } });
  }

  // Points
  static async bulkAddPoints(data: { userIds: number[]; activityId: number; points: number; note?: string; addedBy: number }) {
    return await prisma.$transaction(async (prisma) => {
      // Create multiple transactions
      const transactionsData = data.userIds.map(userId => ({
        userId,
        activityId: data.activityId,
        points: data.points,
        note: data.note,
        addedBy: data.addedBy
      }));
      
      await prisma.pointTransaction.createMany({ data: transactionsData });

      // Update all users points
      const updatedUsers = await Promise.all(data.userIds.map(userId => 
        prisma.user.update({
          where: { id: userId },
          data: { totalPoints: { increment: data.points } }
        })
      ));

      return { count: data.userIds.length };
    });
  }

  static async addPoints(data: { userId: number; activityId: number; points: number; note?: string; addedBy: number }) {
    return await prisma.$transaction(async (prisma) => {
      const transaction = await prisma.pointTransaction.create({ data });

      const user = await prisma.user.update({
        where: { id: data.userId },
        data: { totalPoints: { increment: data.points } }
      });

      return { transaction, totalPoints: user.totalPoints };
    });
  }

  static async getPointsHistory(adminId: number) {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    const whereClause: any = {};
    if (admin && admin.institutionType) {
      whereClause.user = { institutionType: admin.institutionType };
    }

    return await prisma.pointTransaction.findMany({
      where: whereClause,
      include: { user: { select: { name: true, email: true, institutionType: true } }, activity: { select: { title: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Rewards
  static async createReward(data: { name: string; image?: string; description?: string; requiredPoints: number; stock: number }) {
    return await prisma.reward.create({ data });
  }

  static async getRewards() {
    return await prisma.reward.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async updateReward(id: number, data: { name?: string; image?: string; description?: string; requiredPoints?: number; stock?: number; status?: string }) {
    return await prisma.reward.update({
      where: { id },
      data
    });
  }

  static async deleteReward(id: number) {
    return await prisma.reward.delete({ where: { id } });
  }

  // Redeems
  static async getRedeems(adminId: number) {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    const whereClause: any = {};
    if (admin && admin.institutionType) {
      whereClause.user = { institutionType: admin.institutionType };
    }

    return await prisma.redeemRequest.findMany({
      where: whereClause,
      include: { user: { select: { name: true, campus: true, email: true, institutionType: true } }, reward: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateRedeemStatus(id: number, status: string) {
    if (status === 'REJECTED') {
      await prisma.$transaction(async (prisma) => {
        const redeem = await prisma.redeemRequest.findUnique({ where: { id }, include: { reward: true } });
        if (redeem && redeem.status !== 'REJECTED') {
          await prisma.user.update({
            where: { id: redeem.userId },
            data: { totalPoints: { increment: redeem.reward.requiredPoints } }
          });
        }
      });
    }

    return await prisma.redeemRequest.update({
      where: { id },
      data: { status }
    });
  }

  // Feedbacks
  static async getFeedbacks(adminId: number) {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    const whereClause: any = {};
    if (admin && admin.institutionType) {
      whereClause.user = { institutionType: admin.institutionType };
    }

    return await prisma.feedback.findMany({
      where: whereClause,
      include: { user: { select: { name: true, email: true, institutionType: true, campus: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateFeedback(id: number, data: { status?: string; message?: string }) {
    return await prisma.feedback.update({
      where: { id },
      data
    });
  }
}
