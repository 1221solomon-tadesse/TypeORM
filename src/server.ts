import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import app from './app';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('DB connected');
    app.listen(PORT, () => {
      console.log(`Server is running: http://localhost:${PORT}`);
      console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });
