import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SigninUserDto{
  @IsEmail()
  @IsNotEmpty({ message: 'Email must be added' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password name must be added' })
  password: string;
}