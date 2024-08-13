import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>
  ) {
  };

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException("user not found");
    return user;
  }

  findByEmail(email: string): Promise<User> {
    return this.repo.findOne({ where: { email } });
  }

  findAll(): Promise<User []> {
    return this.repo.find();
  }

  async create(newUser: CreateUserDto): Promise<User> {
    const user = this.repo.create(newUser);
    return await this.repo.save(user);
  }

  async update(id: number, updateUser: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUser);
    return await this.repo.save(user);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (!result.affected)
      throw new NotFoundException(`User with id ${id} not found`);
    return { message: "User deleted successfully" };
  }

}
