# AI Korea Club Skills (AKC 스킬)

한국 사람에게 필요한 에이전트 스킬 모음. 클로드 코드·코덱스·커서 등 [Agent Skills](https://agentskills.io) 형식을 읽는 도구 어디서나 씁니다. 전부 실제로 돌려 본 결과(각 폴더 `examples/`)가 붙어 있어요.
Agent skills for Korean users: Korean SEO headlines, Korean government AI grants, Claude onboarding in Korean, and more. Each skill ships with a real run log in `examples/`.

더 많은 스킬(회원용 포함)과 한국어 설명: **https://aikoreaclub.com/skills/**

## 설치 / Install

```
npx skills add aikoreaclub/skills                       # 전부
npx skills add aikoreaclub/skills --skill <스킬 이름>     # 하나만
```
직접 넣으려면 폴더째 `.claude/skills/`(프로젝트) 또는 `~/.claude/skills/`(개인)에 복사하세요.

## 스킬 / Skills

| 스킬 | 설명 | 설치 |
|---|---|---|
| [클로드·클로드 코드 한국어 시작](skills/claude-code-korean-start/) `claude-code-korean-start` | 처음 쓰는 사람을 30분 안에 계정·앱·첫 설정·첫 결과물(회의 메모→보고서)까지 한국어로 데려가요. 클로드 코드 설치와 한국 사용자가 자주 막히는 오류 답도 들어 있어요. | `npx skills add aikoreaclub/skills --skill claude-code-korean-start` |
| [한국어 검색 제목](skills/korean-seo-headline/) `korean-seo-headline` | 글 하나를 주면 읽는 제목·검색 제목·검색어 3개·설명문을 네이버·구글에 걸리는 규칙으로 만들어요. AI Korea Club이 매일 뉴스에 쓰는 규칙 그대로예요. | `npx skills add aikoreaclub/skills --skill korean-seo-headline` |

## 규칙
- 폴더 하나 = 스킬 하나. `SKILL.md`(머리글 name·description + 본문), 필요하면 `references/`·`scripts/`·`examples/`.
- 실행 증거 없는 스킬은 올리지 않습니다. 고칠 점은 이슈로 남겨 주세요. 다음 판에 반영하고 이름을 남깁니다.
- 비밀값·개인정보 금지. 본문은 한국어, 머리글 description 은 영어 한 줄 요약.

## 라이선스 / License
MIT © 2026 IMP Entertainment (AI Korea Club). 스킬 안의 출처 표기는 지우지 말아 주세요.
