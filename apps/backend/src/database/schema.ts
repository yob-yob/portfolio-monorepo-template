import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text().notNull(),
  age: p.integer().notNull(),
  email: p.text().notNull().unique(),
});

export const posts = p.pgTable("posts", {
  id: p.serial().primaryKey(),
  title: p.text().notNull(),
  content: p.text().notNull(),
  userId: p
    .integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: p.timestamp().notNull().defaultNow(),
  updatedAt: p
    .timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;


export const table = {
  users,
  posts
} as const

export type Table = typeof table
