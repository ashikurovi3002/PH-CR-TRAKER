import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adminRoutes from './routes/adminRoutes';
import ambassadorRoutes from './routes/ambassadorRoutes';
import bannerRoutes from './routes/bannerRoutes';
import publicRoutes from './routes/publicRoutes';

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP in dev if needed, or configure properly
app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]', {
  skip: (req) => req.url.startsWith('/_next/') || req.url.includes('favicon.ico')
}));
app.use(express.json());
app.use(cookieParser());

// Database Connection using Prisma
prisma.$connect()
  .then(() => console.log('Prisma connected to the database successfully!'))
  .catch((err) => console.error('Error connecting to the database with Prisma:', err));

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ambassador', ambassadorRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/public', publicRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  
  let statusCode = err.statusCode || 500;
  if (err.message === 'User already exists with this email') statusCode = 409;
  if (err.message === 'Invalid email or password') statusCode = 401;
  if (err.message === 'Unauthorized') statusCode = 401;
  
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ 
    success: false,
    message: message,
    data: null
  });
});

export default app;
