import express from 'express';
import userRoutes from './routes/user.routes';
import { swaggerUi, swaggerSpec } from './docs/swagger';
import authRoutes from './auth/auth.routes';

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes);
export default app;
