-- MED DZ shared document library schema (PostgreSQL)
-- Apply only after provisioning the intended Render PostgreSQL database.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','owner')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS medical_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  byte_size BIGINT NOT NULL CHECK (byte_size > 0),
  sha256 CHAR(64) NOT NULL,
  storage_key TEXT NOT NULL,
  title TEXT,
  document_type TEXT CHECK (document_type IN ('course','summary','historical_exam','correction','qcm_series','book','other')),
  specialty TEXT,
  university TEXT,
  academic_year TEXT,
  language TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  ai_confidence NUMERIC(4,3),
  ai_status TEXT NOT NULL DEFAULT 'pending' CHECK (ai_status IN ('pending','processing','approved','quarantined','rejected','failed')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','community')),
  rights_status TEXT NOT NULL DEFAULT 'unknown' CHECK (rights_status IN ('unknown','user_confirmed','public_domain','licensed','restricted')),
  moderation_reason TEXT,
  page_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(owner_user_id, sha256)
);

CREATE INDEX IF NOT EXISTS idx_med_docs_public_search
  ON medical_documents (visibility, ai_status, document_type, specialty, university, academic_year);
CREATE INDEX IF NOT EXISTS idx_med_docs_owner ON medical_documents(owner_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS document_ai_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES medical_documents(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_doc_events_created ON document_ai_events(created_at DESC);

CREATE TABLE IF NOT EXISTS document_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES medical_documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  message TEXT NOT NULL,
  citations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_doc_chat_history ON document_chat_messages(document_id,user_id,created_at);

-- Owner-only account overview. No document moderation controls are exposed here.
CREATE OR REPLACE VIEW owner_account_overview AS
SELECT id, email, display_name, role, status, created_at, last_login_at
FROM app_users;

CREATE OR REPLACE VIEW owner_usage_summary AS
SELECT
  (SELECT count(*) FROM app_users) AS total_accounts,
  (SELECT count(*) FROM app_users WHERE status = 'active') AS active_accounts,
  (SELECT count(*) FROM app_users WHERE created_at >= date_trunc('day', now())) AS accounts_today,
  (SELECT count(*) FROM medical_documents WHERE created_at >= date_trunc('day', now())) AS documents_today,
  (SELECT count(*) FROM medical_documents WHERE ai_status = 'approved' AND visibility = 'community') AS community_documents,
  (SELECT count(*) FROM medical_documents WHERE ai_status IN ('pending','processing','quarantined')) AS documents_under_review;
