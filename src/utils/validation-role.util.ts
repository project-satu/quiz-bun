import { RoleValue } from '@/constant/enum/role.type';
import { HttpException, HttpStatus } from '@nestjs/common';

export function isAdmin(user: any) {
  if (user?.role?.value === RoleValue.ADMIN) {
    return true
  }
}

export function isTeacher(user: any) {
  if (user?.role?.value === RoleValue.TEACHER) {
    return true
  }
}