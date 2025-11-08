import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        const users = await this.userRepository.find();
        return plainToInstance(User, users);
    }
    async getById(id: number): Promise<User | null> {
        return this.userRepository.findOne({where: {id}, relations: ['department']});
    }

   async updatePassword(userId: number, newPassword: string): Promise<void> {
       const hashedPassword = await bcrypt.hash(newPassword, 10);
       await this.userRepository.update(userId, { password: hashedPassword });
   }

   async getByCode(code: string): Promise<User | null> {
       return this.userRepository.findOne({ where: { code }, relations: ['department'] });
   }

   async isPasswordValid(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
       return bcrypt.compare(plainTextPassword, hashedPassword);
   }



   



    
}
