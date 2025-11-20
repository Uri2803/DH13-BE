import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDepartmentDto } from 'src/Dto/create-department.dto';
import { Department } from 'src/entities/department.entity';
import { Repository } from 'typeorm';
@Injectable()
export class DepartmentService {

    constructor(
        @InjectRepository(Department)
        private readonly departmentRepo : Repository<Department>
    ){}
   async create(dto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.departmentRepo.findOne({
      where: [{ code: dto.code }, { name: dto.name }],
    });

    if (existing) {
      if (existing.code === dto.code) {
        throw new BadRequestException(`Mã đơn vị ${dto.code} đã tồn tại`);
      }
      if (existing.name === dto.name) {
        throw new BadRequestException(`Tên đơn vị ${dto.name} đã tồn tại`);
      }
    }

    const dept = this.departmentRepo.create({
      code: dto.code,
      name: dto.name,
    });

    return this.departmentRepo.save(dept);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepo.find();
  }
  


}
