// 데이터베이스 설정
// 환경변수 DB_TYPE으로 'postgres' 또는 'mariadb'를 선택할 수 있습니다.
// 기본값은 'sqlite'로, 별도 설정 없이 로컬 개발이 가능합니다.

import path from "path";

// 데이터베이스 타입별 연결 설정을 반환하는 헬퍼 함수
const getDatabaseConnection = (dbType: string) => {
  switch (dbType) {
    case "postgres":
      return {
        client: "postgres",
        connection: {
          host: process.env.DATABASE_HOST || "127.0.0.1",
          port: parseInt(process.env.DATABASE_PORT || "5432", 10),
          database: process.env.DATABASE_NAME || "wikiboard",
          user: process.env.DATABASE_USERNAME || "strapi",
          password: process.env.DATABASE_PASSWORD || "strapi",
          ssl: process.env.DATABASE_SSL === "true"
            ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" }
            : false,
          schema: process.env.DATABASE_SCHEMA || "public",
        },
        pool: {
          min: parseInt(process.env.DATABASE_POOL_MIN || "2", 10),
          max: parseInt(process.env.DATABASE_POOL_MAX || "10", 10),
        },
      };

    case "mariadb":
    case "mysql":
      return {
        client: "mysql",
        connection: {
          host: process.env.DATABASE_HOST || "127.0.0.1",
          port: parseInt(process.env.DATABASE_PORT || "3306", 10),
          database: process.env.DATABASE_NAME || "wikiboard",
          user: process.env.DATABASE_USERNAME || "strapi",
          password: process.env.DATABASE_PASSWORD || "strapi",
          ssl: process.env.DATABASE_SSL === "true"
            ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" }
            : false,
        },
        pool: {
          min: parseInt(process.env.DATABASE_POOL_MIN || "2", 10),
          max: parseInt(process.env.DATABASE_POOL_MAX || "10", 10),
        },
      };

    // 기본값: SQLite (로컬 개발용)
    default:
      return {
        client: "better-sqlite3",
        connection: {
          filename: path.join(
            __dirname,
            "..",
            process.env.DATABASE_FILENAME || ".tmp/data.db"
          ),
        },
        useNullAsDefault: true,
      };
  }
};

export default ({ env }) => {
  // DB_TYPE 환경변수로 데이터베이스 종류 결정
  const dbType = env("DB_TYPE", "sqlite").toLowerCase();

  return {
    connection: getDatabaseConnection(dbType),
  };
};
