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

| 구분                | 사용 기술                                                                                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**        | ![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat-square&logo=react) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)              |
| **Styling**         | ![Styled Components](https://img.shields.io/badge/Styled--Components-5.3+-DB7093?style=flat-square&logo=styled-components) ![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white) |
| **상태 관리**       | ![Zustand](https://img.shields.io/badge/Zustand-4.4+-orange?style=flat-square)                                                                                                                                           |
| **HTTP 클라이언트** | ![Fetch API](https://img.shields.io/badge/Fetch_API-4285F4?style=flat-square)                                                                                                                                            |
| **Routing**         | ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white)                                                                                                    |
| **배포**            | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)                                                                                                                                      |
| **협업**            | ![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat-square&logo=discord&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=flat-square&logo=notion)                               |

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

- **프론트엔드**: [Vercel 배포 링크](#)
- **백엔드 API**: https://fandom-k-api.vercel.app/19-5/

## 📁 프로젝트 구조

```
📦 src
├── 📂 assets               # 정적 리소스
│   ├── 📂 image
│   ├── 📂 styles           # 전역 스타일
│   └── 📂 fonts
├── 📂 api                  # API 디렉토리
├── 📂 components           # 공통 컴포넌트 디렉토리
│   ├── 📂 Button           # 버튼 컴포넌트 디렉토리
│   ├── 📂 Header
│   ├── 📂 Loading
│   ├── 📂 Error
│   ├── 📂 Modal
│   └── 📂 IdolCard
├── 📂 pages                # 페이지 디렉토리
│   ├── 📂 Landing
│   ├── 📂 List
│   └── 📂 MyPage
├── 📂 hooks                # hook 디렉토리
├── 📂 store                # Zustand 스토어 디렉토리
└── 📂 utils                # 유틸리티 함수
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

### 1. 랜딩 페이지

- 이달의 아이돌 차트 (남성/여성 구분)
- 인기 순위 실시간 업데이트

### 2. 아이돌 리스트 페이지

- 전체 아이돌 목록 조회
- 관심 아이돌 추가/제거 기능

### 3. 마이페이지

- 관심 아이돌 관리
- 크레딧 충전 및 내역 확인
- 후원 및 투표 히스토리

## 👥 팀원

| 이름       | GitHub                                                                                                                          | 역할                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **김재승** | [![GitHub](https://img.shields.io/badge/GitHub-Sseung22-181717?style=flat-square&logo=github)](https://github.com/Sseung22)     | 공통 컴포넌트 & 랜딩/마이페이지        |
| **강지현** | [![GitHub](https://img.shields.io/badge/GitHub-Jihyun0522-181717?style=flat-square&logo=github)](https://github.com/Jihyun0522) | 공통 컴포넌트 & 리스트 페이지          |
| **이선영** | [![GitHub](https://img.shields.io/badge/GitHub-sylee86-181717?style=flat-square&logo=github)](https://github.com/sylee86)       | 공통 스타일 & API 통신 & 리스트 페이지 |

## 🎓 학습 포인트

- **React 컴포넌트 설계**: 재사용 가능한 컴포넌트 개발
- **상태 관리**: Zustand를 활용한 전역 상태 관리
- **API 통신**: RESTful API와의 효율적인 데이터 통신
- **팀 협업**: Git 브랜치 전략 및 코드 리뷰 프로세스

## 📜 라이센스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 감사의 글

이 프로젝트는 **코드잇 스프린트 Front-End 19기** 교육 과정의 팀 프로젝트로 제작되었습니다.
