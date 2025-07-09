import { Request, Response, RequestHandler } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class AuthController {
  private authService = new AuthService();

  register: RequestHandler = async (req: Request, res: Response) => {
    const dto = plainToInstance(LoginDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(400).json({ message: 'Validation failed', errors });
      return;
    }

    // Manual validation for name in registration
    if (!dto.name) {
      res.status(400).json({ message: 'Validation failed', errors: [{ msg: 'Name is required for registration', param: 'name' }] });
      return;
    }

    try {
      const result = await this.authService.registerUser(dto);
      res.status(201).json({
        message: 'Registration successful. Please check your email to verify.',
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Registration failed' });
    }
  };

  login: RequestHandler = async (req: Request, res: Response) => {
    const dto = plainToInstance(LoginDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(400).json({ message: 'Validation failed', errors });
      return;
    }

    try {
      const result = await this.authService.login(dto.email, dto.password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Login failed' });
    }
  };

  verifyEmail: RequestHandler = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
      await this.authService.verifyEmail(token);
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Email verification failed' });
    }
  };
}