import { Router } from 'express';
import { getUsers, addUser } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a user
 */
router.post('/users', addUser);

export default router;
