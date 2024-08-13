import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService) {
  }

  async signUp(email: string, username: string, password: string) {
    const foundUser = await this.userService.findByEmail(email);
    if (foundUser) {
      throw new BadRequestException("email already exists");
    }
    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + "." + hash.toString("hex");
    const newUser: CreateUserDto = { email, username, password: result };
    const user =  await this.userService.create(newUser);
    const payload = {email: user.email, id: user.id, role: user.role};
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async validateUser(email: string, password: string){
    const foundUser = await this.userService.findByEmail(email);
    if (!foundUser) {
      throw new NotFoundException("email not found");
    }
    const [salt, hash] = foundUser.password.split(".");
    const newHash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash !== newHash.toString("hex"))
      throw new BadRequestException("wrong password provided");
    return foundUser;
  }

  async signIn(email: string, password: string) {
    const user =await this.validateUser(email,password);
    const payload = {email: user.email, id: user.id, role: user.role};
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
