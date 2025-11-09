import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/common/enum";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor (
        private readonly reflector: Reflector
    ){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requireRole = this.reflector.getAllAndOverride<Role[]>('role', [
            context.getHandler(),
            context.getClass()
        ])
        if(!requireRole){

            return true;
        }
        

        const {user}=context.switchToHttp().getRequest();
        console.log(user)
        return requireRole.some((role)=> user.role == role)
    }

}