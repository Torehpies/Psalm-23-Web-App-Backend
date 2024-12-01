export type Permission = "create_item" | "update_item" | "read_item" | "delete_item";
export type Role = "admin" | "manager" | "baker" | "barista" | "cashier" | "helper";

const rolePermissions: Record<Role, Permission[]>={
  admin: ["create_item", "update_item", "read_item", "delete_item"],
  manager: ["create_item", "update_item", "read_item", "delete_item"],
  baker: ["create_item", "update_item", "read_item", "delete_item"],
  barista: ["create_item", "update_item", "read_item", "delete_item"],
  cashier: ["create_item", "update_item", "read_item", "delete_item"],
  helper: ["create_item", "update_item", "read_item", "delete_item"],
};
// Function to get permissions for a specific role
export function getRolePermissions(role: Role): Permission[] {
    return rolePermissions[role] || [];
}
  