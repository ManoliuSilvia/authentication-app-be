import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto{
  @IsEmail()
  @IsNotEmpty({ message: 'Email must be added' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Username must be added' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password name must be added' })
  password: string;
}