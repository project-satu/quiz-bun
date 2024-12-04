import { RoleValue } from '@/constant/enum/role.type';

export function isAdmin(user: any) {
  if (user?.role?.value === RoleValue.ADMIN) {
    return true;
  }
}

export function isTeacher(user: any) {
  if (user?.role?.value === RoleValue.TEACHER) {
    return true;
  }
}
