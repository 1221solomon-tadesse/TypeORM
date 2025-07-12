import { Request, Response, RequestHandler } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../services/user.service';
import { CreateUserDto } from '../dto/user.dto';

export class UserController {
  listUsers: RequestHandler = async (_req: Request, res: Response) => {
    const users = await getAllUsers();
    res.json(users); 
  };

  getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user); 
  };

  registerUser: RequestHandler = async (req: Request, res: Response) => {
     const dto = plainToInstance(CreateUserDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    const user = await createUser(dto);
    res.status(201).json(user); 
  };

  editUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const dto = req.body;
    const updated = await updateUser(id, dto);
    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(updated); 
  };

  removeUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await deleteUser(id);
    res.status(204).send(); 
  };
}