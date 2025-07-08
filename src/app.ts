import express from 'express';
import userRoutes from './routes/user.routes';
import { swaggerUi, swaggerSpec } from './docs/swagger';

const app = express();

app.use(express.json());

// ✅ Add Swagger route here
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Add your API routes here
app.use('/api', userRoutes);

export default app;
