// Strapi 관리자 비밀번호 재설정 스크립트
// 사용법: node scripts/reset-admin-password.js

const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const readline = require("readline");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log("=== Strapi 관리자 비밀번호 재설정 ===\n");

  // DB 연결 정보
  const dbConfig = {
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    user: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "wikiboard",
  };

  let connection;
  try {
    // DB 연결
    console.log(`📡 DB 연결 중... (${dbConfig.host}:${dbConfig.port}/${dbConfig.database})`);
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ DB 연결 성공\n");

    // 관리자 목록 조회
    const [admins] = await connection.query(
      "SELECT id, email, username, firstname, lastname FROM admin_users ORDER BY id"
    );

    if (admins.length === 0) {
      console.log("❌ 관리자 계정이 없습니다.");
      console.log("   먼저 Strapi를 실행하여 관리자를 생성하세요: npm run dev:cms");
      rl.close();
      await connection.end();
      return;
    }

    console.log("현재 관리자 계정 목록:");
    admins.forEach((admin) => {
      console.log(
        `  [${admin.id}] ${admin.email} (${admin.firstname || ""} ${admin.lastname || ""})`
      );
    });
    console.log("");

    // 재설정할 계정 선택
    const targetIdStr = await ask("재설정할 관리자 ID 입력 (엔터 = 1번): ");
    const targetId = targetIdStr.trim() || "1";

    const targetAdmin = admins.find((a) => a.id.toString() === targetId);
    if (!targetAdmin) {
      console.log(`❌ ID ${targetId}를 찾을 수 없습니다.`);
      rl.close();
      await connection.end();
      return;
    }

    console.log(`\n선택된 계정: ${targetAdmin.email}\n`);

    // 새 비밀번호 입력
    const newPassword = await ask("새 비밀번호 (최소 8자): ");

    if (newPassword.length < 8) {
      console.log("❌ 비밀번호는 최소 8자 이상이어야 합니다.");
      rl.close();
      await connection.end();
      return;
    }

    // 비밀번호 해시 생성
    console.log("\n🔐 비밀번호 해시 생성 중...");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // DB 업데이트
    console.log("💾 DB 업데이트 중...");
    await connection.query("UPDATE admin_users SET password = ? WHERE id = ?", [
      hashedPassword,
      targetId,
    ]);

    console.log("\n✅ 비밀번호가 성공적으로 재설정되었습니다!");
    console.log(`   이메일: ${targetAdmin.email}`);
    console.log(`   새 비밀번호: ${newPassword}`);
    console.log("\n이제 Strapi Admin 패널에서 로그인할 수 있습니다.");
    console.log("http://localhost:1337/admin");
  } catch (error) {
    console.error("\n❌ 오류 발생:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.log("\nDB 연결 실패. MariaDB가 실행 중인지 확인하세요:");
      console.log("  npm run docker:dev");
    } else if (error.code === "ER_NO_SUCH_TABLE") {
      console.log("\nadmin_users 테이블이 없습니다. Strapi를 먼저 실행하세요:");
      console.log("  npm run dev:cms");
    }
  } finally {
    rl.close();
    if (connection) {
      await connection.end();
    }
  }
}

main();
