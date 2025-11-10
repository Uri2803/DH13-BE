import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Code, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { RealtimeGateway } from '../realtime/realtime.service';
import {DelegateInfo} from 'src/entities/delegate_info.entity';
import { Department } from 'src/entities/department.entity';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly realtime: RealtimeGateway,
        @InjectRepository(DelegateInfo)
        private readonly delegateInfoRepository: Repository<DelegateInfo>,
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>
    ) {}

    async findAll(): Promise<User[]> {
        const users = await this.userRepository.find({ relations: ['department', 'delegateInfo'] });
        return plainToInstance(User, users);
    }
    async getById(id: number): Promise<User | null> {
        return this.userRepository.findOne({where: {id}, relations: ['department', 'delegateInfo']});
    }

   async updatePassword(userId: number, newPassword: string): Promise<void> {
       const hashedPassword = await bcrypt.hash(newPassword, 10);
       await this.userRepository.update(userId, { password: hashedPassword });
   }

   async getByCode(code: string): Promise<User | null> {
       try{
            const user = await this.userRepository.findOne({ where: { code }, relations: ['department'] });
            return user;
        } catch(err){
            console.error('Error fetching user by code:', err);
            return null;
        }
    }

    async setCurrentRefreshToken(refreshToken : string, userId : number){
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userId, {
        currentHashedRefreshToken,
        });
    }
        

   async isPasswordValid(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
       
       return bcrypt.compare(plainTextPassword, hashedPassword);
   }


   async checkin(delegateId: number) {
    const delegateInfo = await this.delegateInfoRepository.findOne({ where: { id: delegateId } });
    if (!delegateInfo) return null;

    delegateInfo.checkedIn = true;
    delegateInfo.checkinTime = new Date();

    const updatedDelegate = await this.delegateInfoRepository.save(delegateInfo);

    this.realtime.emitCheckinUpdated({
        delegateId: updatedDelegate.id,
        checkedIn: true,
        checkinTime: updatedDelegate.checkinTime.toISOString(),
    });

    return updatedDelegate;
    }



//    async checkout(delegateId: number) {
//     const now = new Date();
//     await this.delegateInfoRepository.update({ id: delegateId }, { checkedIn: false, checkinTime: null });
//     this.realtime.emitCheckinUpdated({
//       delegateId,
//       checkedIn: false,
//       checkinTime: null,
//     });
//     return this.delegateInfoRepository.findOne({ where: { id: delegateId }});
//   }


    async updateInfor(info: any){
        try{
            const userInfor = await this.delegateInfoRepository.findOne({where: {code: info.code}})
        
            return this.delegateInfoRepository.update({code :info.code}, info)

        }catch(err){
            console.log('error updating user', err.message);
        }
    }

    async getUserByDepartment(id: number){
        try {
        if (id === undefined) {
            return new HttpException(
            {
                status: HttpStatus.BAD_REQUEST,
                error: 'Id is required',
            },
            HttpStatus.BAD_REQUEST,
            );
        }

        const department = await this.departmentRepository.findOne({
            where: { id },
        });

        if (!department) {
            return new HttpException(
            'Department does not exist',
            HttpStatus.NOT_FOUND,
            );
        }

        const users = await this.userRepository.find({
            where: { department: { id } }, 
        });
        if (!users) {
            return new HttpException(
            'Users with this department Id do not exist',
            HttpStatus.NOT_FOUND,
            );
        }
        return users;
        } catch (error: any) {
        console.log(error.message);
        throw new HttpException(
            'Users with this id does not exist',
            HttpStatus.NOT_FOUND,
        );
        }
    }

    // src/modules/user/user.service.ts
        async findDelegates() {
            return this.userRepository.find({
                where: { role: 'delegate' },
                relations: ['department', 'delegateInfo'],
            });
        }

    async findDelegateById(id: number) {
        return this.delegateInfoRepository.findOne({
            where: { id },
            relations: ['user', 'user.department'],
        });
    }


     async setCurrentRefreshTokenHash(hash: string, userId: number) {
        await this.userRepository.update(userId, { currentHashedRefreshToken: hash });
    }

      async clearCurrentRefreshToken(userId: number) {
        await this.userRepository.update(userId, { currentHashedRefreshToken: '' });
    }


    
}
