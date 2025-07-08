import { AppDataSource } from '../config/data-source';
import { User } from '../models/user.entity';

const userRepo = AppDataSource.getRepository(User);

export const getAllUsers = () => userRepo.find();

export const getUserById = (id: number) => userRepo.findOneBy({ id });

export const createUser = (data: Partial<User>) => {
  const user = userRepo.create(data);
  return userRepo.save(user);
};

export const updateUser = async (id: number, data: Partial<User>) => {
  await userRepo.update(id, data);
  return getUserById(id);
};

export const deleteUser = (id: number) => userRepo.delete(id);
