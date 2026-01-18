import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  userId: string;
  username: string;
}

export function verifyToken(token?: string): AuthPayload | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

    return decoded;
  } catch (error) {
    return null;
  }
}
