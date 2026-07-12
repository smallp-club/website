/**
 * Supabase Database-Types — Handpflege, gespiegelt aus
 * supabase/migrations/0001_member_foundation.sql.
 *
 * Sobald das Supabase-Projekt live ist, ersetzen wir das durch
 * `supabase gen types typescript --linked > src/lib/supabase/types.gen.ts`
 * und re-exportieren von hier aus.
 */

export type PromptKey =
  | 'das_hab_ich_mal_geglaubt'
  | 'das_hat_mich_entlastet'
  | 'das_hat_mich_begleitet'
  | 'das_hab_ich_anderen_gesagt'
  | 'das_wuensche_ich_mir';

export type AgeRange =
  | 'unter_20'
  | '20_29'
  | '30_39'
  | '40_49'
  | '50_plus';

export type StoryStatus = 'pending' | 'approved' | 'rejected';
export type ProfileRole = 'member' | 'admin';
export type AdminAction =
  | 'approve'
  | 'reject'
  | 'ban'
  | 'unban'
  | 'role_change'
  | 'mfa_enroll'
  | 'mfa_unenroll'
  | 'mfa_backup_regen'
  | 'mfa_verify';
export type AdminTargetType = 'story' | 'user' | 'blocklist' | 'mfa';

export interface ProfileRow {
  user_id: string;
  pseudonym: string;
  pseudonym_changed_at: string | null;
  role: ProfileRole;
  first_submission_allowed_at: string | null;
  newsletter_opt_in: boolean;
  onboarding_completed_at: string | null;
  mfa_enrolled_at: string | null;
  created_at: string;
}

export interface MfaBackupCodeRow {
  id: string;
  user_id: string;
  code_hash: string;
  used_at: string | null;
  created_at: string;
}

export interface MfaBackupCodeInsert {
  id?: string;
  user_id: string;
  code_hash: string;
  used_at?: string | null;
  created_at?: string;
}

export interface StoryRow {
  id: string;
  user_id: string;
  pseudonym: string;
  prompt_key: PromptKey;
  body: string;
  age_range: AgeRange | null;
  status: StoryStatus;
  flags: string[];
  reports_count: number;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
}

export interface BlocklistRow {
  id: string;
  email_hash: string;
  ip_hash: string | null;
  reason: string | null;
  banned_at: string;
  banned_by: string | null;
}

export interface ContentShingleRow {
  shingle: string;
  story_id: string;
  created_at: string;
}

export interface StoryReportRow {
  id: string;
  story_id: string;
  reported_at: string;
  reporter_ip_hash: string | null;
  reason: string | null;
}

export interface AdminAuditLogRow {
  id: string;
  admin_id: string;
  action: AdminAction;
  target_type: AdminTargetType;
  target_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ProfileInsert {
  user_id: string;
  pseudonym: string;
  pseudonym_changed_at?: string | null;
  role?: ProfileRole;
  first_submission_allowed_at?: string | null;
  newsletter_opt_in?: boolean;
  onboarding_completed_at?: string | null;
  created_at?: string;
}

export interface StoryInsert {
  id?: string;
  user_id: string;
  pseudonym: string;
  prompt_key: PromptKey;
  body: string;
  age_range?: AgeRange | null;
  status?: StoryStatus;
  flags?: string[];
  reports_count?: number;
  created_at?: string;
  approved_at?: string | null;
  approved_by?: string | null;
}

export interface BlocklistInsert {
  id?: string;
  email_hash: string;
  ip_hash?: string | null;
  reason?: string | null;
  banned_at?: string;
  banned_by?: string | null;
}

export interface ContentShingleInsert {
  shingle: string;
  story_id: string;
  created_at?: string;
}

export interface StoryReportInsert {
  id?: string;
  story_id: string;
  reported_at?: string;
  reporter_ip_hash?: string | null;
  reason?: string | null;
}

export interface AdminAuditLogInsert {
  id?: string;
  admin_id: string;
  action: AdminAction;
  target_type: AdminTargetType;
  target_id: string;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      stories: {
        Row: StoryRow;
        Insert: StoryInsert;
        Update: Partial<StoryRow>;
        Relationships: [];
      };
      blocklist: {
        Row: BlocklistRow;
        Insert: BlocklistInsert;
        Update: Partial<BlocklistRow>;
        Relationships: [];
      };
      content_shingles: {
        Row: ContentShingleRow;
        Insert: ContentShingleInsert;
        Update: Partial<ContentShingleRow>;
        Relationships: [];
      };
      story_reports: {
        Row: StoryReportRow;
        Insert: StoryReportInsert;
        Update: Partial<StoryReportRow>;
        Relationships: [];
      };
      admin_audit_log: {
        Row: AdminAuditLogRow;
        Insert: AdminAuditLogInsert;
        Update: Partial<AdminAuditLogRow>;
        Relationships: [];
      };
      mfa_backup_codes: {
        Row: MfaBackupCodeRow;
        Insert: MfaBackupCodeInsert;
        Update: Partial<MfaBackupCodeRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      detect_brigading_wave: {
        Args: { p_shingles: string[] };
        Returns: { story_id: string; shingle: string }[];
      };
      increment_report_count: {
        Args: { p_story_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
