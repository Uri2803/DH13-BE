import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Code, DeepPartial, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { RealtimeGateway } from '../realtime/realtime.service';
import {DelegateInfo} from 'src/entities/delegate_info.entity';
import { Department } from 'src/entities/department.entity';
import { CreateDelegateDto } from 'src/Dto/create-delegate.dto';
import multer from 'multer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly realtime: RealtimeGateway,
        @InjectRepository(DelegateInfo)
        private readonly delegateInfoRepository: Repository<DelegateInfo>,
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,
        private readonly configService: ConfigService,
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
        checkinTime: updatedDelegate.checkinTime
        ? updatedDelegate.checkinTime.toISOString()
        : undefined,
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



    async resetCheckin() {
    await this.delegateInfoRepository
        .createQueryBuilder()
        .update()
        .set({ checkedIn: false })
        .execute();
    }


    /////------------------//////

    // user.service.ts (trong UserService)
    async createOne(
    dto: CreateDelegateDto,
    avatarFile?: Express.Multer.File,
    ): Promise<User> {
        console.log(dto.dateOfBirth)
    // 1. Tìm department
    const department = await this.departmentRepository.findOne({
        where: { code: dto.departmentCode },
    });
    if (!department) {
        throw new BadRequestException(
        `Không tìm thấy khoa với code=${dto.departmentCode}`,
        );
    }

    // 2. Check email + code
    const codeToSave = dto.code || dto.delegateCode;
    const where: any[] = [{ email: dto.email }];
    if (codeToSave) where.push({ code: codeToSave });

    const existingUser = await this.userRepository.findOne({ where });

    if (existingUser) {
        if (existingUser.email === dto.email) {
        throw new BadRequestException(`Email ${dto.email} đã tồn tại`);
        }
        if (codeToSave && existingUser.code === codeToSave) {
        throw new BadRequestException(`Mã ${codeToSave} đã tồn tại`);
        }
    }

    // 3. Password
    const rawPassword = dto.password || dto.dateOfBirth || '123';
    const hashed = await bcrypt.hash(rawPassword, 10);

    // 4. Avatar
    let avaPath: string | undefined;
    if (avatarFile) {
    const baseUrl = this.configService.get<string>('PUBLIC_URL') || 'http://localhost:3000';

    // phòng trường hợp windows path có \
    const fileName = avatarFile.filename.replace(/\\/g, '/');

    // URL public đầy đủ
    avaPath = `${baseUrl}/uploads/avatars/${fileName}`;
    }

    // 5. Tạo User
    const user = new User();
    user.email = dto.email;
    user.name = dto.name;
    if (dto.mssv) user.mssv = dto.mssv;
    if (codeToSave) user.code = codeToSave;
    user.password = hashed;
    user.role = 'delegate';
    user.department = department;
    if (avaPath) user.ava = avaPath;
    user.hasContactInfo = false;

    await this.userRepository.save(user);

    // 6. Tạo DelegateInfo
    const info = new DelegateInfo();
    info.user = user;
    info.department = department;

    if (dto.delegateCode) info.code = dto.delegateCode;
    if (dto.position) info.position = dto.position;
    if (dto.mssv_or_mscb || dto.mssv)
        info.mssv_or_mscb = dto.mssv_or_mscb || dto.mssv;
    if (dto.dateOfBirth) info.dateOfBirth = dto.dateOfBirth;
    if (dto.gender) info.gender = dto.gender;
    if (dto.religion) info.religion = dto.religion;
    if (dto.ethnicity) info.ethnicity = dto.ethnicity;
    if (dto.joinUnionDate) info.joinUnionDate = dto.joinUnionDate;
    if (dto.joinAssociationDate)
        info.joinAssociationDate = dto.joinAssociationDate;
    if (dto.isPartyMember !== undefined)
        info.isPartyMember = dto.isPartyMember;
    if (dto.studentYear !== undefined) info.studentYear = dto.studentYear;
    if (dto.academicScore !== undefined)
        info.academicScore = dto.academicScore;
    if (dto.achievements) info.achievements = dto.achievements;
    if (dto.shirtSize) info.shirtSize = dto.shirtSize;
    if (dto.phone) info.phone = dto.phone;
    if (dto.emailContact || dto.email)
        info.email = dto.emailContact || dto.email;

    // mặc định
    info.checkedIn = false;

    await this.delegateInfoRepository.save(info);

    // 7. Trả về user kèm relations
    const fullUser = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['department', 'delegateInfo'],
    });

    return fullUser ?? user;
    }

}