// Drizzle ORM 테이블 스키마
// wb_ 프리픽스로 Strapi 테이블과 분리
// Auth.js Drizzle 어댑터와 호환

import {
  mysqlTable,
  varchar,
  text,
  int,
  datetime,
  primaryKey,
  index,
  timestamp,
} from "drizzle-orm/mysql-core";

// === Auth.js 호환 테이블 ===

export const users = mysqlTable("wb_users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }),
  image: varchar("image", { length: 512 }),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  xp: int("xp").notNull().default(0),
  level: int("level").notNull().default(1),
  authMode: varchar("auth_mode", { length: 20 }).notNull().default("LOCAL"),
  emailVerified: datetime("email_verified"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const accounts = mysqlTable("wb_accounts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: int("expires_at"),
  tokenType: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  idToken: text("id_token"),
  sessionState: varchar("session_state", { length: 255 }),
});

export const sessions = mysqlTable("wb_sessions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: datetime("expires").notNull(),
});

export const verificationTokens = mysqlTable(
  "wb_verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expires: datetime("expires").notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
);

// === 커스텀 테이블 ===

export const xpEvents = mysqlTable(
  "wb_xp_events",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: varchar("action", { length: 100 }).notNull(),
    xpAmount: int("xp_amount").notNull(),
    description: varchar("description", { length: 500 }).notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("idx_xp_events_user").on(table.userId),
    index("idx_xp_events_created").on(table.createdAt),
  ]
);
