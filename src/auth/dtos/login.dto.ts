import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name is required for registration' })
  name?: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;
}