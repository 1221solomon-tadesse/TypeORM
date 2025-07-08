import { AppDataSource } from '../config/data-source';
import { User } from '../models/user.entity';

export const getAllUsers = async () => {
  return AppDataSource.getRepository(User).find();
};

export const createUser = async (userData: Partial<User>) => {
  const repo = AppDataSource.getRepository(User);
  const newUser = repo.create(userData);
  return repo.save(newUser);
};
