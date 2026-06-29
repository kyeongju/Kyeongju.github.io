# Portfolio · DevOps · AI Platform Engineer

프로젝트와 아키텍처를 정리하는 개인 포트폴리오. [Astro](https://astro.build) + GitHub Pages.

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:4321
```

## 빌드

```bash
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 미리보기
```

## 콘텐츠 추가

| 종류 | 위치 | 설명 |
|------|------|------|
| 프로젝트 | `src/content/projects/*.mdx` | 문제 → 판단/설계 → 아키텍처 → 성과(수치) |
| 아키텍처 | `src/content/architecture/*.mdx` | 재사용 가능한 설계 패턴 기록 |

- 아키텍처 다이어그램은 ` ```mermaid ` 코드블록으로 작성합니다(코드로 버전관리되는 다이어그램).
- 프런트매터 스키마는 `src/content.config.ts` 참고.
- 사이트 전역 정보(타이틀/스킬/링크)는 `src/config.ts`에서 수정.

## 배포

`main`(또는 `master`)에 push하면 `.github/workflows/deploy.yml`이 자동 빌드·배포합니다.

> 최초 1회: 저장소 **Settings → Pages → Source: GitHub Actions** 로 설정.

## 개인정보

직접적인 개인정보(실명/연락처/주소/회사명)는 포함하지 않습니다. 공개해도 되는 링크만 `src/config.ts`의 `links`에 선택적으로 채우세요.
