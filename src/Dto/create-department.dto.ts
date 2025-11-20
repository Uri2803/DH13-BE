import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  code: string;   // ví dụ: "CNTT"

  @IsString()
  @IsNotEmpty()
  name: string;   // ví dụ: "Khoa Công nghệ Thông tin"
}
