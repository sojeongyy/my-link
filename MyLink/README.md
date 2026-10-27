# 마이링크 (MyLink)

> **나만의 링크트리 포트폴리오 서비스**  
> AI 코딩 패러다임과 바이브 코딩 실습 프로젝트

---

## 📌 프로젝트 소개
- **프로젝트명**: 마이링크 (MyLink)
- **개발자**: 김소정 ([@sojeongyy](https://github.com/sojeongyy))
- **저장소**: [https://github.com/sojeongyy/my-link](https://github.com/sojeongyy/my-link)
- **배포 주소 (Live Demo)**: 아래 배포 URL 항목 참조

---

## 🚀 주요 기능
1. **프로필 소개 섹션**
   - 프로필 사진, 이름, 직무/태그라인, 감성적인 소개글
   - 좋아요(Heart) 인터랙션 및 방문자 수 카운터
2. **동적 링크 목록 (Linktree 형태)**
   - 깃허브, 블로그, 포트폴리오, 소셜 링크 제공
   - 아코디언 상세 정보 토글 (프로젝트 주요 성과 및 상세 내용)
   - 링크 클릭 시 외부 사이트 이동 및 인터랙션
3. **방명록 & 프로필 편집 & 공유 기능**
   - 로컬 스토리지를 활용한 실시간 프로필 커스텀
   - 방명록 작성 및 링크 공유 팝업

---

## 🛠 기술 스택
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript, React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 📁 프로젝트 폴더 구조
```text
my-link/
├── MyLink/                  # 마이링크 전용 안내 및 문서 폴더
│   └── README.md
├── src/
│   ├── app/                 # Next.js App Router (page.tsx, layout.tsx, globals.css)
│   ├── components/profile/  # 프로필 뷰, 링크 카드, 방명록, 공유 모달
│   ├── data/                # 초기 프로필 및 링크 데이터 (initialProfile.ts)
│   └── types/               # 타입 정의 (profile.ts)
├── public/                  # 정적 이미지 및 에셋
├── package.json
└── tsconfig.json
```
