import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authenticationService: AuthenticationService
    ) {}



   @Get('test')
   async test() {
       return this.userService.findAll();
   }

   @Post('login')
   async login() {
       return this.authenticationService.login('testuser', 'testpassword');
   }
}
