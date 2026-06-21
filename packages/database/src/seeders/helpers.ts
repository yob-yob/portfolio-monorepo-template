import { createId } from "@paralleldrive/cuid2";
import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../db.ts";
import {
  accounts,
  members,
  organizations,
  teamMembers,
  teams,
  users,
} from "../schemas/auth.ts";

export interface SeedUser {
  email: string;
  id: string;
  name: string;
}

export interface SeedOrganization {
  id: string;
  name: string;
  slug: string;
}

export interface SeedTeam {
  id: string;
  name: string;
  organizationId: string;
}

export function hashSeedPassword(password: string): Promise<string> {
  return hashPassword(password);
}

export async function insertUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<SeedUser> {
  const userId = createId();
  const now = new Date();

  await db.insert(users).values({
    id: userId,
    name,
    email,
    emailVerified: false,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(accounts).values({
    id: createId(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  return { id: userId, name, email };
}

export async function insertOrganization(
  name: string,
  slug: string,
  ownerUserId: string
): Promise<SeedOrganization> {
  const organizationId = createId();
  const now = new Date();

  await db.insert(organizations).values({
    id: organizationId,
    name,
    slug,
    createdAt: now,
  });

  await db.insert(members).values({
    id: createId(),
    organizationId,
    userId: ownerUserId,
    role: "owner",
    createdAt: now,
  });

  return { id: organizationId, name, slug };
}

export async function insertTeam(
  name: string,
  organizationId: string,
  createdByUserId: string
): Promise<SeedTeam> {
  const teamId = createId();
  const now = new Date();

  await db.insert(teams).values({
    id: teamId,
    name,
    organizationId,
    createdAt: now,
    updatedAt: now,
    description: "",
    color: "#ffffff",
    createdBy: createdByUserId,
  });

  return { id: teamId, name, organizationId };
}

async function findOrgMember(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const existing = await db
    .select({ id: members.id })
    .from(members)
    .where(
      and(
        eq(members.userId, userId),
        eq(members.organizationId, organizationId)
      )
    )
    .limit(1);

  return existing.length > 0;
}

export async function insertOrgMember(
  userId: string,
  organizationId: string,
  role: "member" | "admin" | "owner",
  teamId?: string
): Promise<void> {
  const now = new Date();

  if (!(await findOrgMember(userId, organizationId))) {
    await db.insert(members).values({
      id: createId(),
      organizationId,
      userId,
      role,
      createdAt: now,
    });
  }

  if (teamId) {
    await insertTeamMember(userId, teamId);
  }
}

export async function insertTeamMember(
  userId: string,
  teamId: string
): Promise<void> {
  await db.insert(teamMembers).values({
    id: createId(),
    teamId,
    userId,
    createdAt: new Date(),
  });
}
