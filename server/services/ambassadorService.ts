import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AmbassadorService {
  static async getDashboard(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pointTransactions: { take: 5, orderBy: { createdAt: 'desc' }, include: { activity: true } }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate Rank
    const usersRanked = await prisma.user.findMany({
      where: { role: 'ambassador' },
      orderBy: { totalPoints: 'desc' },
      select: { id: true, totalPoints: true }
    });
    
    const rank = usersRanked.findIndex(u => u.id === userId) + 1;
    const totalActivitiesCompleted = await prisma.pointTransaction.count({ where: { userId } });
    
    // Fetch active rewards to determine next goal
    const rewards = await prisma.reward.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { requiredPoints: 'asc' }
    });
    const availableRewards = rewards.length;
    const nextReward = rewards.find(r => r.requiredPoints > user.totalPoints);
    const nextRewardGoal = nextReward ? nextReward.requiredPoints : null;

    // Fetch the admin assigned to this ambassador's institution type
    let adminWhere: any = { role: 'admin' };
    if (user.institutionType) {
      adminWhere.institutionType = user.institutionType;
    }
    const adminContact = await prisma.user.findFirst({
      where: adminWhere,
      select: { name: true, phone: true, email: true }
    });

    return {
      totalPoints: user.totalPoints,
      rank: rank > 0 ? rank : null,
      activities: user.pointTransactions,
      availableRewards,
      nextRewardGoal,
      totalActivitiesCompleted,
      adminContact
    };
  }

  static async getActivities(userId: number) {
    return await prisma.pointTransaction.findMany({
      where: { userId },
      include: { activity: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getRedeems(userId: number) {
    return await prisma.redeemRequest.findMany({
      where: { userId },
      include: { reward: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getRewards() {
    return await prisma.reward.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { requiredPoints: 'asc' }
    });
  }

  static async requestRedeem(userId: number, rewardId: number) {
    return await prisma.$transaction(async (prisma) => {
      const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!reward || reward.status !== 'ACTIVE') {
        throw new Error('Reward not found or unavailable');
      }

      if (reward.stock <= 0) {
        throw new Error('Reward out of stock');
      }

      if (!user || user.totalPoints < reward.requiredPoints) {
        throw new Error('Insufficient points');
      }

      // Deduct points and reduce stock
      await prisma.user.update({
        where: { id: userId },
        data: { totalPoints: { decrement: reward.requiredPoints } }
      });

      await prisma.reward.update({
        where: { id: reward.id },
        data: { stock: { decrement: 1 } }
      });

      const redeem = await prisma.redeemRequest.create({
        data: { userId, rewardId: reward.id }
      });

      return redeem;
    });
  }

  static async getLeaderboard(userId: number, type?: string) {
    // Fetch all active ambassadors
    const allAmbassadors = await prisma.user.findMany({
      where: { role: 'ambassador', status: 'ACTIVE' },
      select: { id: true, name: true, campus: true, totalPoints: true, profileImage: true },
      orderBy: { totalPoints: 'desc' }
    });

    const totalAmbassadors = allAmbassadors.length;
    const userIndex = allAmbassadors.findIndex(u => u.id === userId);
    const userRank = userIndex !== -1 ? userIndex + 1 : null;
    const userStats = userIndex !== -1 ? allAmbassadors[userIndex] : null;

    // Return top 100 for the list
    const leaders = allAmbassadors.slice(0, 100);

    return {
      leaders,
      totalAmbassadors,
      userRank,
      userPoints: userStats ? userStats.totalPoints : 0
    };
  }

  static async updateProfile(userId: number, data: { name?: string; phone?: string; campus?: string; department?: string; clubName?: string; profileImage?: string; institutionType?: string }) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, phone: true, campus: true, department: true, clubName: true, profileImage: true, institutionType: true }
    });
  }

  // Feedback
  static async submitFeedback(userId: number, message: string, rating?: number) {
    return await prisma.feedback.create({
      data: {
        userId,
        message,
        rating
      }
    });
  }

  static async getFeedbacks(userId: number) {
    return await prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
