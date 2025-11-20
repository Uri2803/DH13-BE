import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDepartmentDto } from 'src/Dto/create-department.dto';
import { DepartmentService } from './department.service';

@Controller('department')
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) {}

    @Get()
    findAll() {
        return this.departmentService.findAll();
    }

    @Post()
    create(@Body() dto: CreateDepartmentDto) {
        return this.departmentService.create(dto);
    }
}
