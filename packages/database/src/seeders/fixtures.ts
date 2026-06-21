export const TEAM_NAMES = ["Team A", "Team B", "Team C"] as const;

export type TeamName = (typeof TEAM_NAMES)[number];

export const ORG_COUNT = 5;
export const TEAMS_PER_ORG = 3;
export const MEMBERS_PER_TEAM = 5;

export const SCENARIO_USERS = {
  user1: {
    name: "User One",
    email: "user-1@seed.local",
  },
  user2: {
    name: "User Two",
    email: "user-2@seed.local",
  },
  user3: {
    name: "User Three",
    email: "user-3@seed.local",
  },
  user4: {
    name: "User Four",
    email: "user-4@seed.local",
  },
  user5: {
    name: "Sean",
    email: "sean@yob-yob.com",
  },
} as const;

export function orgName(index: number): string {
  return `Organization ${index}`;
}

export function orgSlug(index: number): string {
  return `organization-${index}`;
}

export function fillerEmail(
  orgIndex: number,
  teamIndex: number,
  memberIndex: number
): string {
  return `seed.org${orgIndex}.team${teamIndex}.member${memberIndex}@seed.local`;
}

export function fillerName(
  orgIndex: number,
  teamIndex: number,
  memberIndex: number
): string {
  return `Org ${orgIndex} Team ${teamIndex} Member ${memberIndex}`;
}
