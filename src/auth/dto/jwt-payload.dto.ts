export class JwtPayloadDto{
  email: string;
  id: number;
  role: number;
  iat?: number;
  exp?: number;
}