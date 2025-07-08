import { Request, Response } from 'express';
import { getAllUsers, createUser } from '../services/user.service';

export const getUsers = async (_: Request, res: Response) => {
  const users = await getAllUsers();
  res.json(users);
};

export const addUser = async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
};
