import { AppDataSource } from '../config/data-source';
import { User } from '../models/user.entity';
import bcrypt from 'bcrypt';

const userRepo = AppDataSource.getRepository(User);

export const getAllUsers = () => userRepo.find();

export const getUserById = (id: number) => userRepo.findOneBy({ id });

export const createUser = async (data: Partial<User>) => {
  if (!data.email || !data.password || !data.name) {
    throw new Error('Name, email, and password are required');
  }

  const existingUser = await userRepo.findOneBy({ email: data.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = userRepo.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    isVerified: true, // Admin-created users are considered verified
  });

  return userRepo.save(user);
};

export const updateUser = async (id: number, data: Partial<User>) => {
  // Optional: Re-hash password if updated
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  await userRepo.update(id, data);
  return getUserById(id);
};

export const deleteUser = (id: number) => userRepo.delete(id);
