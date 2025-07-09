import jwt from 'jsonwebtoken';

export function generateVerificationToken(userId: number) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });
}
