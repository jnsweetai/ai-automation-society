-- AI 자동화 소사이어티 웹사이트 데이터베이스 설정
-- Supabase SQL Editor에서 실행할 스크립트

-- 1. 문의하기 테이블 (contacts) - 이미 존재할 수 있음
CREATE TABLE IF NOT EXISTS contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    response TEXT
);

-- 2. 커뮤니티 게시글 테이블 (posts)
CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'published'
);

-- 3. 댓글 테이블 (comments)
CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    like_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published'
);

-- 4. 케이스 스터디 테이블 (case_studies)
CREATE TABLE IF NOT EXISTS case_studies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'Easy',
    tags TEXT[],
    youtube_url VARCHAR(500),
    template_url VARCHAR(500),
    icon_class VARCHAR(50) DEFAULT 'fas fa-cog',
    order_index INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    status VARCHAR(20) DEFAULT 'published'
);

-- 5. 뉴스레터 구독자 테이블 (newsletter_subscribers)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    preferences JSONB DEFAULT '{}'::jsonb
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(is_featured);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id);

CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category);
CREATE INDEX IF NOT EXISTS idx_case_studies_order ON case_studies(order_index);
CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON case_studies(is_featured);

-- Row Level Security (RLS) 정책 설정
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 권한 (모든 사용자가 읽을 수 있음)
CREATE POLICY "공개 읽기 - contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "공개 읽기 - posts" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "공개 읽기 - comments" ON comments FOR SELECT USING (status = 'published');
CREATE POLICY "공개 읽기 - case_studies" ON case_studies FOR SELECT USING (status = 'published');

-- 공개 쓰기 권한 (인증 없이 작성 가능)
CREATE POLICY "공개 쓰기 - contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "공개 쓰기 - posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "공개 쓰기 - comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "공개 쓰기 - newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- 업데이트 트리거 함수 (updated_at 자동 갱신)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 초기 데이터 삽입 (케이스 스터디 예시)
INSERT INTO case_studies (title, description, category, difficulty_level, tags, icon_class, order_index) VALUES
('AI 자동화 시작하기', 'AI 자동화 소사이어티에 오신 것을 환영합니다! 이 커뮤니티가 어떻게 작동하는지 이해하고 최고의 경험을 얻으시려면 여기서 시작해주세요.', '여기서 시작', 'Easy', ARRAY['시작', '가이드'], 'fas fa-play-circle', 1),
('n8n 자동화 마스터클래스', '최고의 n8n 마스터클래스에 오신 것을 환영합니다! 완전 초보자든 어느 정도 경험이 있든, 이 포괄적인 코스가 여러분을 제로에서 히어로로 만들어드립니다.', 'n8n 마스터클래스', 'Mid', ARRAY['n8n', '자동화', '마스터클래스'], 'fas fa-brain', 2),
('n8n에서 AI 에이전트 구축하기', '이 코스는 n8n에서 AI 에이전트 구축과 관련하여 제가 만든 모든 비디오를 포함합니다. 간단한 챗봇부터 복잡한 멀티 에이전트 시스템까지.', 'AI 에이전트', 'Difficult', ARRAY['AI', 'n8n', '에이전트'], 'fas fa-robot', 3),
('비즈니스 프로세스 자동화', 'AI와 노코드 도구를 사용하여 복잡한 비즈니스 프로세스를 자동화하는 방법을 배우세요. 성공적인 구현 사례의 실제 예시들.', '비즈니스', 'Mid', ARRAY['비즈니스', '프로세스', '자동화'], 'fas fa-chart-line', 4),
('이메일 마케팅 자동화', '고객 행동과 선호도에 자동으로 반응하는 지능적인 이메일 마케팅 캠페인을 만드는 방법을 알아보세요.', '이메일', 'Easy', ARRAY['이메일', '마케팅'], 'fas fa-envelope', 5),
('데이터 처리 및 분석', '데이터 수집, 처리, 분석 워크플로우를 자동화하세요. AI 기반 자동화로 원시 데이터를 실행 가능한 인사이트로 변환합니다.', '데이터', 'Mid', ARRAY['데이터', '분석'], 'fas fa-database', 6)
ON CONFLICT DO NOTHING;

-- 뷰 생성 (자주 사용되는 쿼리 최적화)
CREATE OR REPLACE VIEW public_posts AS
SELECT 
    id, title, content, author_name, category, tags, 
    view_count, like_count, created_at, updated_at, is_featured
FROM posts 
WHERE status = 'published' 
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW featured_case_studies AS
SELECT 
    id, title, description, category, difficulty_level, 
    tags, icon_class, view_count, download_count
FROM case_studies 
WHERE status = 'published' AND is_featured = true
ORDER BY order_index ASC;

-- 함수 생성 (게시글 조회수 증가)
CREATE OR REPLACE FUNCTION increment_post_views(post_id_param BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE posts 
    SET view_count = view_count + 1 
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- 함수 생성 (케이스 스터디 다운로드 수 증가)
CREATE OR REPLACE FUNCTION increment_case_study_downloads(case_study_id_param BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE case_studies 
    SET download_count = download_count + 1 
    WHERE id = case_study_id_param;
END;
$$ LANGUAGE plpgsql; 