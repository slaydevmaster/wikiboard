// 어드민 패널 커스터마이징 설정
// 관리자 UI의 로고, 테마, 로케일 등을 설정합니다.

export default {
  config: {
    // 지원 로케일 목록
    locales: ["ko", "en"],

    // 튜토리얼 팝업 비활성화
    tutorials: false,

    // 알림 설정
    notifications: {
      releases: false, // 새 릴리스 알림 비활성화
    },

    // 테마 커스터마이징 (필요시 수정)
    // theme: {
    //   light: {},
    //   dark: {},
    // },
  },

  // 어드민 부트스트랩 (앱 초기화 시 실행)
  bootstrap(app: any) {
    // 여기에 어드민 패널 초기화 로직을 추가할 수 있습니다.
    // 예: 커스텀 필드 등록, 훅 추가 등
    console.log("[WikiBoard CMS] 어드민 패널이 초기화되었습니다.");
  },
};
