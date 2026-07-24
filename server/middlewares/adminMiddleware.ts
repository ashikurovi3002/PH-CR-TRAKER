import { Response, NextFunction } from 'express';
import { sendResponse } from '../utils/sendResponse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.role !== 'admin') {
      sendResponse(res, { statusCode: 403, message: 'Forbidden: Admin access required' });
      return;
    }

    next();
  } catch (error) {
    sendResponse(res, { statusCode: 500, message: 'Internal server error' });
  }
};
