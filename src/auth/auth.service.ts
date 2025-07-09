import { AppDataSource } from '../config/data-source';
import { User } from '../models/user.entity';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { LoginDto } from './dtos/login.dto';

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async registerUser(dto: LoginDto): Promise<{ token: string; user: Partial<User> }> {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('EMAIL_USER or EMAIL_PASS environment variable is not defined');
    }
    if (!process.env.APP_URL) {
      throw new Error('APP_URL environment variable is not defined');
    }

    const existing = await this.userRepo.findOneBy({ email: dto.email });
    if (existing) {
      throw new Error('Email already exists');
    }

    // Validate name for registration
    if (!dto.name) {
      throw new Error('Name is required for registration');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      isVerified: false,
    });

    const savedUser = await this.userRepo.save(user);

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email:</p>
        <a href="${process.env.APP_URL}/api/auth/verify-email/${token}">Verify Email</a>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error('Error sending email:', err);
      throw new Error('Could not send verification email');
    }

    return {
      token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        isVerified: savedUser.isVerified,
      },
    };
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<User> }> {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    const user = await this.userRepo.findOneBy({ email });

    if (!user) throw new Error('Invalid credentials');
    if (!user.isVerified) throw new Error('Please verify your email');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    };
  }

  async verifyEmail(token: string): Promise<void> {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & { email: string };
      const user = await this.userRepo.findOneBy({ email: decoded.email });

      if (!user) throw new Error('Invalid token');
      if (user.isVerified) throw new Error('Email already verified');

      user.isVerified = true;
      await this.userRepo.save(user);
    } catch {
      throw new Error('Invalid or expired token');
    }
  }
}