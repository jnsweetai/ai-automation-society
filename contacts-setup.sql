-- AI 자동화 소사이어티 - 문의하기 폼 전용 데이터베이스 설정
-- Supabase SQL Editor에서 실행할 스크립트

-- 문의하기 테이블 생성
CREATE TABLE IF NOT EXISTS contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    response TEXT
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- Row Level Security (RLS) 정책 설정
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 권한 (모든 사용자가 읽을 수 있음)
CREATE POLICY "문의하기 공개 읽기" ON contacts FOR SELECT USING (true);

-- 공개 쓰기 권한 (인증 없이 문의하기 작성 가능)
CREATE POLICY "문의하기 공개 쓰기" ON contacts FOR INSERT WITH CHECK (true);

-- 테스트 데이터 확인용 뷰 생성
CREATE OR REPLACE VIEW recent_contacts AS
SELECT 
    id, name, email, 
    SUBSTRING(message, 1, 100) as message_preview,
    status, created_at
FROM contacts 
ORDER BY created_at DESC 
LIMIT 10; 