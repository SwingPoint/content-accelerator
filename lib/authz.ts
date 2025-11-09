/**
 * lib/authz.ts
 * Role-based authorization helpers
 */

import { Role } from '@prisma/client';
import { prisma } from './db';

export type Permission = 
  | 'view_content'
  | 'edit_content'
  | 'approve_content'
  | 'manage_members'
  | 'manage_settings'
  | 'delete_project';

const rolePermissions: Record<Role, Permission[]> = {
  OWNER: [
    'view_content',
    'edit_content',
    'approve_content',
    'manage_members',
    'manage_settings',
    'delete_project',
  ],
  STAFF: [
    'view_content',
    'edit_content',
    'approve_content',
  ],
  CLIENT: [
    'view_content',
  ],
};

/**
 * Check if a user has a specific permission in a workspace
 */
export async function hasPermission(
  userId: string,
  workspaceId: string,
  permission: Permission
): Promise<boolean> {
  const membership = await prisma.membership.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });

  if (!membership) return false;

  return rolePermissions[membership.role].includes(permission);
}

/**
 * Get user's role in a workspace
 */
export async function getUserRole(
  userId: string,
  workspaceId: string
): Promise<Role | null> {
  const membership = await prisma.membership.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });

  return membership?.role ?? null;
}

/**
 * Check if user can perform action
 */
export function canPerformAction(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

/**
 * Require permission or throw
 */
export async function requirePermission(
  userId: string,
  workspaceId: string,
  permission: Permission
): Promise<void> {
  const allowed = await hasPermission(userId, workspaceId, permission);
  if (!allowed) {
    throw new Error(`Unauthorized: requires ${permission}`);
  }
}

