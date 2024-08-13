import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "../_guards/auth.guard";
import { AdminGuard } from "../_guards/admin.guard";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService
    ) {}

  @Get('/by-email/:email')
  getByEmail(@Param('email') email: string){
    return this.userService.findByEmail(email);
  }

  // USER CRUD OPERATIONS
  @Get()
  getAllUsers(){
    return this.userService.findAll();
  }

  @Get('/:id')
  getUser(@Param('id') id: string){
    const userId = parseInt(id);
    return this.userService.findOne(userId);
  }

  @Post()
  createUser(@Body() newUser:CreateUserDto){
    return this.userService.create(newUser);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() updateUser:UpdateUserDto){
    return this.userService.update(parseInt(id), updateUser);
  }

  @UseGuards(AdminGuard)
  @Delete("/:id")
  deleteUser(@Param('id') id: string){
    return this.userService.remove(parseInt(id));
  }
}
