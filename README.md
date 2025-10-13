# 🎤 팬덤케이(Fandom-K)

> 좋아하는 아이돌을 후원하고 투표할 수 있는 팬덤 플랫폼

## 🌟 프로젝트 소개

팬덤케이(Fandom-K)는 아이돌 팬덤을 위한 플랫폼으로, 좋아하는 아이돌을 후원하고 투표할 수 있는 종합적인 팬덤 플랫폼입니다. 팬들이 크레딧 충전을 통해 후원금을 보내고, 이달의 아이돌 인기 투표에 참여하며, 개인 관심 아이돌을 관리할 수 있습니다.

## 🗓️ 프로젝트 기간

2025/09/24 (수) ~ 2025/10/16 (목)

### ✨ 주요 기능

- 💰 **후원 시스템**: 크레딧을 충전하여 아이돌 후원
- 🗳️ **투표 시스템**: 이달의 아이돌 인기 투표 참여
- 📊 **실시간 차트**: 투표 순위별 아이돌 차트 확인
- 👤 **마이페이지**: 관심 아이돌 관리 및 개인화

## 🛠 기술 스택

| 구분                | 사용 기술                                                                                                                                                                                                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**        | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=white) |
| **Styling**         | ![Styled Components](https://img.shields.io/badge/Styled--Components-5.3+-DB7093?style=flat-square&logo=styled-components) ![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)                                                                                            |
| **상태 관리**       | ![Zustand](https://img.shields.io/badge/Zustand-4.4+-orange?style=flat-square)                                                                                                                                                                                                                                      |
| **HTTP 클라이언트** | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square)                                                                                                                                                                                                                                               |
| **Routing**         | ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white)                                                                                                                                                                                               |
| **배포**            | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)                                                                                                                                                                                                                                 |
| **협업**            | ![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat-square&logo=discord&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=flat-square&logo=notion)                                                                                                                          |

## 🚀 시작하기

### 필수 조건

- Node.js 18.0 이상
- npm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/codeit-Five/FandomK.git

# 프로젝트 디렉토리로 이동
cd FandomK

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 배포된 사이트

- **프론트엔드**: [Fandom-K](https://fandom-k-19-5.vercel.app/)
- **백엔드 API**: https://fandom-k-api.vercel.app/19-5/

## 📁 프로젝트 구조

```

├── 📂 .github              # GitHub 설정 파일
├── 📦 src
│   ├── 📂 api                   # API 디렉토리
│   ├── 📂 assets                # 정적 리소스
│   │   ├── 📂 fonts             # 폰트 디렉토리
│   │   ├── 📂 image             # 이미지 디렉토리
│   │   └── 📂 styles            # 전역 스타일
│   ├── 📂 components            # 공통 컴포넌트 디렉토리
│   │   ├── 📂 Button            # 버튼 컴포넌트
│   │   ├── 📂 Header            # 헤더 컴포넌트
│   │   ├── 📂 IdolCard          # 아이돌 프로필 컴포넌트
│   │   ├── 📂 Modal             # 모달 컴포넌트
│   │   └── 📂 OptionCard        # 라디오 버튼 컴포넌트
│   ├── 📂 hooks                 # Custom Hook 디렉토리
│   ├── 📂 pages                 # 페이지 디렉토리
│   │   ├── 📂 Landing
│   │   ├── 📂 List              # 목록 페이지
│   │   │   ├── 📂 Chart
│   │   │   ├── 📂 CreditSection
│   │   │   ├── 📂 Donate
│   │   │   └── 📂 DonateSection
│   │   ├── 📂 MyPage
│   │   └── 📂 NotFoundPage
│   ├── ⚛️ App.jsx
│   └── ⚛️ main.jsx
├── ⚙️ .env                 # 환경변수
├── 📝 .eslintrc.json       # ESLint 설정 파일
├── 📝 .prettierrc.json     # Prettier 설정 파일
├── 🔷 favicon.svg          # favorite icon
├── 📄 index.html           # 진입 HTML
├── 📦 package-lock.json    # 의존성 고정 파일
├── 📦 package.json         # 프로젝트 메타 정보
├── ⬆️ vercel.json          # Vercel 배포 설정
└── ⚡ vite.config.js       # Vite 설정
```

## 🔗 API 문서

- **Swagger UI**: https://fandom-k-api.vercel.app/docs/
- **Base URL**: https://fandom-k-api.vercel.app/19-5/

### 주요 API 엔드포인트

```javascript
// 아이돌 목록 조회
GET /idols

// 아이돌 차트 조회 (성별별)
GET /charts/{gender}

// 후원하기
POST /donations
{
  "deadline": "2025-09-26T14:54:53.282Z",
  "targetDonation": 1000,
  "subtitle": "응원 메시지",
  "title": "후원 제목",
  "idolId": 1
}

// 투표하기
POST /votes
{
  "idolId": 1
}
```

## 🎯 주요 페이지

### 🏠랜딩 페이지

- Fandom-K에 대한 전반적인 정보와 주요 기능을 소개

### 🎁후원을 기다리는 조공 / 🏆이달의 차트

- 크레딧 확인 : 사용자가 가지고 있는 크레딧을 확인
- 후원을 기다리는 조공 : 아이돌 후원 내용 및 목표 달성률, 기간을 슬라이드를 통해 확인하고 참여
- 이달의 차트 : 쿠표를 통해 아이돌 순위를 반영하고, 실시간 차트 변동을 확인

### 🪙충전하기 모달

- 사용자가 충전을 원하는 크레딧 금액을 선택하고 충전을 진행

### 💸후원하기 모달

- 후원할 조공을 확인하고 사용자가 입력한 크레딧을 후원

### 🗳️투표하기 모달

- 크레딧을 이용해 선택한 아이돌에게 투표하고, 결과를 반영

### ⚙️마이 페이지

- 관심이 있는 아이돌을 리스트로 관리하고 확인

### 🚫NotFound 페이지

- 잘못된 경로로 접근했을 때, 에러를 안내하고 이전 또는 메인 페이지로 이동

## 👥 팀원

| <img src="https://github.com/Sseung22.png" alt="Sseung22" width="100"> | <img src="https://github.com/Jihyun0522.png" alt="Jihyun0522" width="100"> | <img src="https://github.com/sylee86.png" alt="sylee86" width="100"> |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [김재승](https://github.com/Sseung22)                                  | [강지현](https://github.com/Jihyun0522)                                    | [이선영](https://github.com/sylee86)                                 |

## 🏷️역할

🖥️ **김재승**

- **초기 세팅**
  - GitHub Issue, PR 템플릿 세팅
  - 라우팅 설정

- **공통 컴포넌트**
  - 공통 Header 컴포넌트 구현

- **랜딩 페이지**
  - 랜딩 페이지 구현

- **마이 페이지**
  - localStorage 기반 관심 아이돌 관리 기능
  - 리스트로 관심 아이돌 확인

- **배포**

- **발표 및 발표 자료 제작**

🖥️ **강지현**

- **초기 세팅**
  - 프로젝트 워크플로우 및 개발 컨벤션 정리
  - 디렉토리 초기 세팅

- **공통 컴포넌트**
  - 버튼 공통 컴포넌트 구현
  - 아이돌 프로필 공통 컴포넌트 구현
  - 모달 공통 컴포넌트 구현
  - 라디오 버튼 공통 컴포넌트 구현

- **목록 페이지 크레딧 표시/후원을 기다리는 조공**
  - 스켈레톤 로딩 UI 구현 (`react-loading-skeleton` 활용)
  - 캐러셀 기능 구현 (`embla-carousel-react` 활용)

- **NotFound 페이지**
  - NotFound 페이지 UI 구현

- **문서화**
  - README.md 정리

🖥️ **이선영**

- **초기 세팅**
  - 디렉토리 초기 세팅
  - 공통 style 정의

- **API 통신**
  - AXIOS를 활용한 API 통신 구현
  - 응답 인터셉터를 통한 에러 처리 통일화
  - 통합된 에러 처리 구현
  - toast 알림 구현

- **크레딧 상태 관리**
  - `Zustand`를 활용하여 크레딧 전역 상태 관리 구현

- **목록 페이지 이달의 차트**
  - 여자/남자 아이돌 차트 탭 구현
  - 총 투표수 기준 순위 정렬 기능
  - 투표하기 모달 구현

## 🎓 학습 포인트

- **React 컴포넌트 설계**: 재사용 가능한 컴포넌트 개발
- **상태 관리**: Zustand를 활용한 전역 상태 관리
- **API 통신**: RESTful API와의 효율적인 데이터 통신
- **팀 협업**: Git 브랜치 전략 및 코드 리뷰 프로세스

## 📜 라이센스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 감사의 글

이 프로젝트는 **코드잇 스프린트 Front-End 19기** 교육 과정의 팀 프로젝트로 제작되었습니다.
