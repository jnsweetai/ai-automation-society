# AI Automation Society

AI Automation Society 프로젝트에 오신 것을 환영합니다.

---

## 프로젝트 개요

AI Automation Society는 AI 기반 자동화와 커뮤니티 기능을 제공하는 웹사이트입니다.  
한국어로 제공되며, Supabase를 통한 데이터 관리와 챗봇 연동, 그리고 최신 프론트엔드 빌드 환경(Vite)을 적용하였습니다.

---

## 주요 기능 및 완료 내역

- **전체 한글화**: 모든 UI, 메시지, 메타 태그 한글 번역
- **챗봇 연동**: Dify 기반 챗봇(udify.app)과 연동, CSP 정책 준수
- **Supabase 연동**: 
  - 문의하기 폼 Supabase 연동 완료
  - 환경변수로 보안 강화 (로컬 .env, Vercel 환경변수 등록)
  - contacts 테이블 RLS 정책 설정
  - 성공/실패 메시지 및 성공 모달(팝업) 표시/닫기 기능 구현
- **환경변수 관리**: Vite 환경변수(`.env` 파일, Vercel 대시보드)로 민감 정보 관리
- **빌드 및 개발 환경**: 
  - Vite 기반 모듈 번들링
  - .gitignore, package.json, vite.config.js 설정
  - src/main.js 엔트리 포인트 구성
- **불필요한 관리자/테스트 파일 및 요소 완전 제거**
- **반응형 네비게이션 및 메뉴 구조 단순화**
- **CSP 정책 대응**: 인라인 스크립트 제거, JS 이벤트 바인딩 방식 적용

---

## 개발 및 실행 방법

1. **환경변수 파일 생성**
   - 프로젝트 루트에 `.env` 파일을 생성하고 아래와 같이 입력하세요:
     ```
     VITE_SUPABASE_URL=여기에_프로젝트_URL
     VITE_SUPABASE_ANON_KEY=여기에_anon_key
     ```
   - **Vercel 배포 시에는 Vercel 대시보드에서 동일한 환경변수를 등록해야 합니다.**

2. **의존성 설치**
   ```
   npm install
   ```

3. **개발 서버 실행**
   ```
   npm run dev
   ```
   - 브라우저에서 `http://localhost:3000` 접속
   - 문의하기 폼 테스트 가능
   - 챗봇 연동 확인 가능

4. **빌드**
   ```
   npm run build
   ```

---

## 문의 및 기여

- 문의는 웹사이트의 "문의하기" 폼을 이용해 주세요.
- 기여를 원하시면 PR을 보내주시거나, 이슈를 등록해 주세요.

---

## 기타 참고사항

- Supabase는 문의하기 기능에만 사용됩니다.
- 챗봇은 외부 서비스(udify.app)와 연동되어 있습니다.
- 모든 JavaScript 코드는 src/main.js에서 관리됩니다.
- 성공 모달(팝업)은 닫기 버튼 및 바깥 클릭으로 닫을 수 있습니다.
