// Drizzle Kit 설정
// wb_ 프리픽스 테이블만 관리 (Strapi 테이블 제외)

import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "wikiboard",
  },
  tablesFilter: ["wb_*"],
} satisfies Config;
