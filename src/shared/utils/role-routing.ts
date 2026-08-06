import { UserRole } from "@/src/shared/api/types/data-contracts";

type RoleInput = { roles?: UserRole[] | string[] | null } | null | undefined;

export const isCourierUser = (user: RoleInput): boolean =>
  Array.isArray(user?.roles) && user.roles.includes(UserRole.CURRIER);

export const isCustomerUser = (user: RoleInput): boolean =>
  Array.isArray(user?.roles) && user.roles.includes(UserRole.CUSTOMER);

export const getHomeRouteForUser = (user: RoleInput): any => {
  if (isCourierUser(user)) {
    return "/(protected-tabs)" as const;
  }

  if (isCustomerUser(user)) {
    return "/(client-tabs)" as const;
  }

  return "/(auth)" as const;
};

export const getPrimaryRoleForUser = (
  user: RoleInput,
): UserRole.CURRIER | UserRole.CUSTOMER | null => {
  if (isCourierUser(user)) return UserRole.CURRIER;
  if (isCustomerUser(user)) return UserRole.CUSTOMER;
  return null;
};
