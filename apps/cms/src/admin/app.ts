// 어드민 패널 커스터마이징
// - 유료 전환/광고 UI 숨김
// - 한국어 번역 개선 (직역 → 자연스러운 표현)

export default {
  config: {
    // 한국어만 지원
    locales: ["ko"],

    // 튜토리얼 팝업 비활성화
    tutorials: false,

    // 릴리스 알림 비활성화
    notifications: {
      releases: false,
    },

    translations: {
      ko: {
        // ──────────────────────────────────
        // 메뉴/네비게이션
        // ──────────────────────────────────
        "app.components.LeftMenu.navbrand.title": "WikiBoard CMS",
        "app.components.LeftMenu.navbrand.workplace": "콘텐츠 관리",

        // ──────────────────────────────────
        // 공통 액션
        // ──────────────────────────────────
        "global.save": "저장",
        "global.cancel": "취소",
        "global.delete": "삭제",
        "global.confirm": "확인",
        "global.close": "닫기",
        "global.back": "뒤로",
        "global.next": "다음",
        "global.finish": "완료",
        "global.publish": "발행",
        "global.unpublish": "발행 취소",
        "global.last-change.redo": "다시 실행",
        "global.last-change.undo": "실행 취소",
        "global.last-changes.discard": "변경 취소",
        "global.profile.settings": "프로필 설정",

        // ──────────────────────────────────
        // 토글/체크박스
        // ──────────────────────────────────
        "app.components.ToggleCheckbox.enabled-label": "켜짐",
        "app.components.ToggleCheckbox.disabled-label": "꺼짐",
        "app.components.ToggleCheckbox.on-label": "예",
        "app.components.ToggleCheckbox.off-label": "아니오",

        // ──────────────────────────────────
        // 콘텐츠 관리
        // ──────────────────────────────────
        "content-manager.containers.list.draft": "초안",
        "content-manager.containers.list.published": "발행됨",
        "content-manager.popUpWarning.warning.publish-question":
          "이 항목을 발행하시겠습니까?",
        "content-manager.popUpWarning.warning.unpublish":
          "발행을 취소하시겠습니까?",
        "content-manager.success.record.delete": "삭제되었습니다.",
        "content-manager.success.record.publish": "발행되었습니다.",
        "content-manager.success.record.unpublish": "발행이 취소되었습니다.",
        "content-manager.success.record.save": "저장되었습니다.",
        "content-manager.components.DynamicZone.add-compo": "컴포넌트 추가",
        "content-manager.components.empty-repeatable":
          "항목이 없습니다. 아래 버튼으로 추가하세요.",
        "content-manager.components.repeatable.reorder": "드래그하여 순서 변경",

        // ──────────────────────────────────
        // 콘텐츠 구조 (Content Type Builder)
        // ──────────────────────────────────
        "content-type-builder.header.title": "콘텐츠 구조",
        "content-type-builder.modalForm.attribute.text.type-selection":
          "텍스트 유형 선택",

        // ──────────────────────────────────
        // 미디어 라이브러리
        // ──────────────────────────────────
        "upload.header.actions.upload-assets": "파일 올리기",
        "upload.modal.header.browse": "파일 찾아보기",
        "upload.content.not-found": "파일이 없습니다.",
        "upload.asset.dialog.header": "파일 상세",

        // ──────────────────────────────────
        // 입력/폼 유효성 검사
        // ──────────────────────────────────
        "components.Input.error.validation.required": "필수 항목입니다.",
        "components.Input.error.validation.unique": "이미 사용 중입니다.",
        "components.Input.error.validation.min":
          "{min}자 이상 입력하세요.",
        "components.Input.error.validation.max":
          "{max}자까지 입력 가능합니다.",
        "components.Input.error.validation.email":
          "올바른 이메일을 입력하세요.",
        "components.Input.error.validation.combobox.invalid":
          "올바르지 않은 값입니다.",

        // ──────────────────────────────────
        // 블록 에디터
        // ──────────────────────────────────
        "components.Blocks.popover.link.rel": "Rel (선택)",
        "components.Blocks.popover.link.rel.placeholder":
          "noopener, nofollow, noreferrer",
        "components.Blocks.popover.link.target": "대상 (선택)",
        "components.Blocks.popover.link.target.placeholder":
          "_blank, _self, _parent, _top",

        // ──────────────────────────────────
        // 설정
        // ──────────────────────────────────
        "Settings.permissions.users.listview.header.subtitle":
          "관리자 계정을 관리합니다.",
        "Settings.roles.list.title": "역할 목록",
        "Settings.roles.list.description": "역할별 접근 권한을 설정합니다.",
        "Settings.webhooks.title": "웹훅",
        "Settings.webhooks.list.description":
          "이벤트 발생 시 외부 URL로 알림을 보냅니다.",
        "Settings.apiTokens.title": "API 토큰",
        "Settings.apiTokens.description": "API 접근 토큰을 관리합니다.",
        "Settings.apiTokens.copy.lastWarning":
          "이 토큰은 다시 볼 수 없습니다. 지금 복사하세요.",
        "Settings.review-workflows.page.title": "워크플로우",

        // ──────────────────────────────────
        // 플러그인/마켓플레이스
        // ──────────────────────────────────
        "app.components.PluginCard.compatible": "호환 가능",
        "app.components.PluginCard.compatibleCommunity": "커뮤니티 호환",
        "app.components.PluginCard.more-details": "자세히 보기",
        "app.components.NpsSurvey.select-rating": "평점 선택",

        // ──────────────────────────────────
        // 홈페이지 위젯
        // ──────────────────────────────────
        "HomePage.addWidget.title": "위젯 추가",
        "HomePage.addWidget.noWidgetsAvailable":
          "추가할 수 있는 위젯이 없습니다.",
        "HomePage.addWidget.button": "위젯 추가",
        "HomePage.widget.delete": "삭제",
        "HomePage.widget.drag": "드래그하여 이동",

        // ──────────────────────────────────
        // 유료 전환/프리미엄 — 빈 문자열로 안 보이게 처리
        // (Cloud 플러그인 비활성화와 CSS 숨김으로 이중 차단)
        // ──────────────────────────────────
        "components.premiumFeature.title": " ",
        "app.components.UpsellBanner.button": " ",
        "app.components.UpsellBanner.intro": " ",
        "app.components.UpsellBanner.text": " ",
        "app.components.FreeTrialEndedModal.title": " ",
        "app.components.FreeTrialEndedModal.description": " ",
        "app.components.FreeTrialEndedModal.button.downgrade": " ",
        "app.components.FreeTrialEndedModal.button.upgrade": " ",
        "app.components.FreeTrialEndedModal.notice.title": " ",
        "app.components.FreeTrialEndedModal.notice.item1": " ",
        "app.components.FreeTrialEndedModal.notice.item2": " ",
        "app.components.FreeTrialEndedModal.notice.item3": " ",
        "app.components.FreeTrialEndedModal.notice.item4": " ",
        "app.components.FreeTrialWelcomeModal.title": " ",
        "app.components.FreeTrialWelcomeModal.button": " ",
        "app.components.FreeTrialWelcomeModal.description1": " ",
        "app.components.FreeTrialWelcomeModal.description2": " ",
        "app.components.LeftMenu.trialCountdown.endedAt": " ",
        "app.components.LeftMenu.trialCountdown.endsAt": " ",

        // ──────────────────────────────────
        // 가이드 투어 (간결하게)
        // ──────────────────────────────────
        "tours.stepCount": "{currentStep}/{tourLength}",
        "tours.skip": "건너뛰기",
        "tours.next": "다음",
        "tours.gotIt": "확인",
        "tours.overview.title": "시작하기",
        "tours.overview.subtitle": "주요 기능을 둘러보세요.",
        "tours.overview.close": "닫기",
        "tours.overview.tasks": "시작 가이드",
        "tours.overview.contentTypeBuilder.label": "콘텐츠 구조 만들기",
        "tours.overview.contentManager.label": "콘텐츠 작성 및 발행",
        "tours.overview.apiTokens.label": "API 토큰 발급",
        "tours.overview.strapiCloud.label": " ",
        "tours.overview.strapiCloud.link": " ",
        "tours.overview.tour.link": "시작",
        "tours.overview.tour.done": "완료",
        "tours.overview.close.description": "가이드를 닫을까요?",
        "tours.overview.completed": "{completed}% 완료",
        "tours.profile.title": "가이드 투어",
        "tours.profile.description": "가이드를 다시 시작할 수 있습니다.",
        "tours.profile.reset": "투어 다시 시작",
        "tours.profile.notification.success.reset":
          "투어가 초기화되었습니다.",

        // 콘텐츠 구조 투어
        "tours.contentTypeBuilder.Introduction.title": "콘텐츠 구조",
        "tours.contentTypeBuilder.Introduction.content":
          "이곳에서 콘텐츠의 구조를 만들고 관리합니다.",
        "tours.contentTypeBuilder.CollectionTypes.title": "컬렉션 타입",
        "tours.contentTypeBuilder.CollectionTypes.content":
          "게시물, 상품 등 여러 항목을 관리할 때 사용합니다.",
        "tours.contentTypeBuilder.SingleTypes.title": "싱글 타입",
        "tours.contentTypeBuilder.SingleTypes.content":
          "홈페이지 설정 등 한 건만 관리할 때 사용합니다.",
        "tours.contentTypeBuilder.Components.title": "컴포넌트",
        "tours.contentTypeBuilder.Components.content":
          "한번 만들어 여러 곳에서 재사용할 수 있는 블록입니다.",

        // 콘텐츠 관리 투어
        "tours.contentManager.Introduction.title": "콘텐츠 관리",
        "tours.contentManager.Introduction.content":
          "콘텐츠를 작성하고 관리하는 곳입니다.",
        "tours.contentManager.CreateNewEntry.title": "새 항목 만들기",
        "tours.contentManager.CreateNewEntry.content":
          "\"새 항목 만들기\" 버튼으로 콘텐츠를 추가합니다.",
        "tours.contentManager.Fields.title": "필드 입력",
        "tours.contentManager.Fields.content": "각 필드에 내용을 입력하세요.",
        "tours.contentManager.Publish.title": "발행",
        "tours.contentManager.Publish.content":
          "\"발행\" 버튼으로 콘텐츠를 공개합니다.",

        // API 토큰 투어
        "tours.apiTokens.Introduction.title": "API 토큰",
        "tours.apiTokens.Introduction.content":
          "외부에서 API에 접근할 수 있는 토큰을 발급합니다.",
      },
    },
  },

  // 어드민 초기화 — 유료 전환/광고 UI 숨기기
  bootstrap() {
    const style = document.createElement("style");
    style.textContent = `
      /* Strapi 유료 전환/Cloud/외부 광고 링크 숨김 */
      a[href*="strapi.io/pricing"],
      a[href*="strapi.io/cloud"],
      a[href*="strapi.io/enterprise"],
      a[href*="strapi.io/trial"],
      a[href*="cloud.strapi.io"],
      a[target="_blank"][href*="market.strapi.io"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  },
};
