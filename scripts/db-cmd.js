// DB 명령어 실행 헬퍼
// .env 로드 → NODE_PATH 설정 → apps/web 디렉토리에서 drizzle-kit/tsx 실행
// 모노레포에서 drizzle-kit(루트)과 drizzle-orm(apps/web) 위치가 다른 문제를 해결

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 루트 디렉토리 기준으로 .env 파일 로드
const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env");

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    process.env[key] = value;
  }
}

// apps/web/node_modules를 모듈 검색 경로에 추가
// (drizzle-kit이 루트 node_modules에 있고, drizzle-orm은 apps/web에만 있으므로)
const webNodeModules = path.join(rootDir, "apps", "web", "node_modules");

const cmd = process.argv[2]; // push | seed | studio

// 추가 인자 전달 (예: push --force)
const extraArgs = process.argv.slice(3).join(" ");

const commands = {
  push: `node ../../node_modules/drizzle-kit/bin.cjs push ${extraArgs}`.trim(),
  studio: `node ../../node_modules/drizzle-kit/bin.cjs studio ${extraArgs}`.trim(),
  seed: `npx tsx src/lib/seed.ts ${extraArgs}`.trim(),
};

if (!commands[cmd]) {
  console.error(`사용법: node scripts/db-cmd.js [push|seed|studio]`);
  process.exit(1);
}

// drizzle-kit이 drizzle-orm을 찾을 수 있도록 NODE_PATH 설정
process.env.NODE_PATH = webNodeModules;

const webDir = path.join(rootDir, "apps", "web");

try {
  execSync(commands[cmd], {
    stdio: "inherit",
    cwd: webDir,
    env: {
      ...process.env,
      NODE_PATH: webNodeModules,
    },
  });
} catch (e) {
  process.exit(e.status || 1);
}
