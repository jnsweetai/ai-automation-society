# AI Automation Society 웹사이트 개선 작업 목록

## 📋 전체 작업 개요
AI Automation Society 웹사이트를 한국어 버전으로 개선하고, 회원가입/로그인 시스템, 커뮤니티 기능을 추가하는 프로젝트

---

## 🎯 Phase 1: 기본 설정 및 국제화

### 1.1 한글 번역 작업
- [ ] `index.html` 모든 텍스트 한글 번역
- [ ] `admin-login.html` 한글 번역
- [ ] `admin-dashboard.html` 한글 번역  
- [ ] `script.js` 알림 메시지 및 에러 메시지 한글 번역
- [ ] `admin-login.js` 메시지 한글 번역
- [ ] `admin-dashboard.js` 메시지 한글 번역
- [ ] HTML 문서의 `lang` 속성을 "ko"로 변경
- [ ] 페이지 제목 및 메타 태그 한글로 수정

### 1.2 챗봇 URL 업데이트
- [ ] `script.js`의 `openChatbot()` 함수에서 Dify URL 업데이트
- [ ] 새 URL: `https://udify.app/chatbot/xi9u52axJgSFaMT1`

---

## 🎨 Phase 2: UI/UX 개선

### 2.1 히어로 섹션 개선
- [ ] 기존 통계 정보 (members, online, admins) 제거
- [ ] 더 트렌디한 디자인으로 히어로 섹션 재구성
- [ ] 새로운 CTA 버튼 디자인 적용
- [ ] 현대적인 그라데이션 배경 추가
- [ ] 타이포그래피 개선 (폰트 크기, 간격 조정)

### 2.2 Case Studies 섹션 개선
- [ ] 모든 case 카드에서 progress bar 제거
- [ ] HTML에서 `.case-progress` 요소 삭제
- [ ] CSS에서 progress bar 관련 스타일 제거
- [ ] 카드 레이아웃 재조정 (progress bar 공간 활용)

---

## 🔐 Phase 3: 인증 시스템 구축

### 3.1 Supabase 인증 설정
- [ ] Supabase 프로젝트에서 Google OAuth 설정
- [ ] Google Cloud Console에서 OAuth 클라이언트 생성
- [ ] Supabase Auth 설정에서 Google 제공자 활성화
- [ ] 리디렉션 URL 설정

### 3.2 회원가입 페이지 생성
- [ ] `signup.html` 파일 생성
- [ ] Google 로그인 버튼 UI 구현
- [ ] 회원가입 폼 레이아웃 구성
- [ ] 반응형 디자인 적용

### 3.3 로그인 페이지 생성
- [ ] `login.html` 파일 생성
- [ ] Google 로그인 버튼 UI 구현
- [ ] 로그인 폼 레이아웃 구성
- [ ] 비밀번호 찾기 링크 추가

### 3.4 인증 JavaScript 로직
- [ ] `auth.js` 파일 생성
- [ ] Google OAuth 로그인 함수 구현
- [ ] 회원가입 처리 로직 구현
- [ ] 로그아웃 함수 구현
- [ ] 인증 상태 확인 함수 구현
- [ ] 사용자 세션 관리 로직

### 3.5 사용자 데이터베이스 설계
- [ ] Supabase에서 `users` 테이블 생성
- [ ] 컬럼: id, email, name, avatar_url, created_at, updated_at
- [ ] Row Level Security (RLS) 정책 설정
- [ ] 사용자 정보 저장 함수 구현

---

## 🔄 Phase 4: 네비게이션 시스템 개선

### 4.1 네비게이션 메뉴 수정
- [ ] 기존 "Admin" 링크 제거
- [ ] "회원가입" 링크 추가
- [ ] "로그인" 링크 추가
- [ ] 로그인 상태에 따른 메뉴 동적 변경
- [ ] 사용자 프로필 드롭다운 메뉴 추가

### 4.2 인증 상태 관리
- [ ] 페이지 로드 시 인증 상태 확인
- [ ] 로그인/로그아웃 상태에 따른 UI 변경
- [ ] 보호된 페이지 접근 제어

---

## 💬 Phase 5: 커뮤니티 기능 개발

### 5.1 커뮤니티 데이터베이스 설계
- [ ] `posts` 테이블 생성 (id, title, content, author_id, created_at, updated_at)
- [ ] `comments` 테이블 생성 (id, post_id, author_id, content, created_at)
- [ ] `likes` 테이블 생성 (id, post_id, user_id, created_at)
- [ ] RLS 정책 설정

### 5.2 커뮤니티 페이지 생성
- [ ] `community.html` 파일 생성
- [ ] 게시글 목록 레이아웃 구성
- [ ] 게시글 작성 폼 구현
- [ ] 게시글 상세 페이지 모달 구현

### 5.3 커뮤니티 JavaScript 로직
- [ ] `community.js` 파일 생성
- [ ] 게시글 목록 불러오기 함수
- [ ] 게시글 작성 함수
- [ ] 게시글 수정/삭제 함수
- [ ] 댓글 기능 구현
- [ ] 좋아요 기능 구현

### 5.4 커뮤니티 UI/UX
- [ ] 게시글 카드 디자인
- [ ] 글쓰기 에디터 구현 (마크다운 지원)
- [ ] 검색 및 필터링 기능
- [ ] 페이지네이션 구현

---

## 📊 Phase 6: 관리자 기능 개선

### 6.1 Case Studies 관리 시스템
- [ ] `case_studies` 테이블 생성
- [ ] 관리자 대시보드에 Case Studies 관리 섹션 추가
- [ ] Case Studies 추가/수정/삭제 기능 구현
- [ ] 이미지 업로드 기능 구현
- [ ] YouTube 비디오 임베드 기능

### 6.2 관리자 권한 관리
- [ ] 사용자 역할 시스템 구현 (user, admin)
- [ ] 관리자 전용 페이지 접근 제어
- [ ] 관리자 대시보드 개선

---

## 📝 Phase 7: 문의하기 시스템 완성

### 7.1 문의하기 데이터베이스 연결
- [ ] 기존 Supabase 연결 코드 검증
- [ ] `contacts` 테이블 구조 확인 및 최적화
- [ ] 문의하기 폼 제출 테스트
- [ ] 에러 처리 개선

### 7.2 문의하기 관리 기능
- [ ] 관리자 대시보드에 문의 내역 표시
- [ ] 문의 상태 관리 (읽음/답변완료 등)
- [ ] 이메일 알림 기능 (선택사항)

---

## 🧪 Phase 8: 테스트 및 배포

### 8.1 기능 테스트
- [ ] 회원가입/로그인 테스트
- [ ] 커뮤니티 기능 테스트
- [ ] 관리자 기능 테스트
- [ ] 반응형 디자인 테스트
- [ ] 브라우저 호환성 테스트

### 8.2 성능 최적화
- [ ] 이미지 최적화
- [ ] CSS/JS 파일 압축
- [ ] 로딩 성능 개선
- [ ] SEO 최적화

### 8.3 보안 검토
- [ ] XSS 취약점 검사
- [ ] SQL Injection 방지 확인
- [ ] HTTPS 적용
- [ ] 환경변수로 민감 정보 관리

---

## 📋 우선순위 및 예상 소요시간

### High Priority (필수)
- Phase 1: 기본 설정 및 국제화 (2-3일)
- Phase 3: 인증 시스템 구축 (3-4일)
- Phase 4: 네비게이션 시스템 개선 (1-2일)

### Medium Priority (중요)
- Phase 2: UI/UX 개선 (2-3일)
- Phase 5: 커뮤니티 기능 개발 (4-5일)
- Phase 7: 문의하기 시스템 완성 (1일)

### Low Priority (선택사항)
- Phase 6: 관리자 기능 개선 (2-3일)
- Phase 8: 테스트 및 배포 (2-3일)

**총 예상 소요시간: 17-24일**

---

## 📝 참고사항
- 각 Phase는 독립적으로 진행 가능하도록 설계
- Supabase 설정은 미리 완료 필요
- Google OAuth 설정은 Google Cloud Console 접근 권한 필요
- 커뮤니티 기능은 참고사이트의 YouTube Resources 구조를 참조 