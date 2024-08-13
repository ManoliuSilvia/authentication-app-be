import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { SigninUserDto } from "./dto/signin.dto";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Request as RequestExpress } from "express";
import { AuthGuard } from "../_guards/auth.guard";
import { UserService } from "../user/user.service";
import { User } from "../user/user.entity";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService,
              private userService: UserService) {
  }

  @Post("/signup")
  signUpUser(@Body() signUpUser: CreateUserDto) {
    const { email, username, password } = signUpUser;
    return this.authService.signUp(email, username, password);
  }


  @Post("/signin")
  async signInUser(@Body() signinUser: SigninUserDto, @Request() request: RequestExpress) {
    const response =  await this.authService.signIn(signinUser.email, signinUser.password);
    request.user = response;
    return response;
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  async getProfile(@Request() request: RequestExpress & {user: User}) {
    return await this.userService.findOne(request.user.id);
  }
}
