-- RLS 정책 추가 설정 (contacts 테이블용)
-- Supabase SQL Editor에서 실행

-- RLS 활성화 (이미 되어있을 수 있음)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (혹시 충돌 방지)
DROP POLICY IF EXISTS "문의하기 공개 읽기" ON contacts;
DROP POLICY IF EXISTS "문의하기 공개 쓰기" ON contacts;

-- 새로운 정책 생성
CREATE POLICY "Allow public read access" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON contacts FOR INSERT WITH CHECK (true);

-- 테스트용 정책 (모든 권한 허용) - 필요시에만 사용
-- CREATE POLICY "Allow all access" ON contacts FOR ALL USING (true) WITH CHECK (true);

-- 현재 RLS 상태 확인
SELECT schemaname, tablename, rowsecurity, hasoids 
FROM pg_tables 
WHERE tablename = 'contacts';

-- 현재 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'contacts'; 