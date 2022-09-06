import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';

export const Role = (...roles: string[]): CustomDecorator<string> =>
  SetMetadata(ROLE_KEY, roles);
