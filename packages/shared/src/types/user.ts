/** 사용자 역할 (권한) */
export type UserRole = 'admin' | 'editor' | 'member';

/** 사용자 상태 */
export type UserStatus = 'active' | 'suspended' | 'deactivated';

/** 인증 모드 */
export type AuthMode = 'LOCAL' | 'SSO' | 'TRUSTED';

/** 사용자 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  xp: number;
  level: number;
  auth_mode: AuthMode;
  created_at: string;
  updated_at: string;
}

/** XP 이벤트 (활동 로그) */
export interface XpEvent {
  id: number;
  user_id: string;
  action: string;         // 예: 'term_view', 'download', 'edit_suggest'
  xp_amount: number;
  description: string;
  created_at: string;
}

/** 감사 로그 */
export interface AuditLog {
  id: number;
  admin_id: string;
  action: string;
  target_type: string;    // 예: 'user', 'term', 'article'
  target_id: string;
  details: string;
  created_at: string;
}
