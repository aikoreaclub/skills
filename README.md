# AI Korea Club Skills

**한국어 쓰레드·인스타·쇼츠를 운영하는 에이전트 스킬 팩.** 매일 7편을 올리는 계정의 규칙과 숫자를 그대로 넣었고, 검사 스크립트 8개는 Node만 있으면 돌아갑니다. 클로드 코드·코덱스·커서·안티그래비티 등 [Agent Skills](https://agentskills.io) 형식을 읽는 도구 어디서나 씁니다.

Agent skills that run a Korean SNS account (Threads, Instagram Reels/carousels, YouTube Shorts): post, reply, script, caption, title, plan, audit, de-AI. Built from the rules of an account that posts 7 pieces a day, with the Korean viral-post numbers behind every rule, and 8 dependency-free Node scripts that score your drafts before you post.

## 30초 설치 / Install

```bash
npx skills add aikoreaclub/skills                       # 팩 전체 / all
npx skills add aikoreaclub/skills --skill th-post       # 하나만 / one
```
직접 넣으려면 `skills/<이름>` 폴더째 `~/.claude/skills/`(개인) 또는 프로젝트의 `.claude/skills/`에 복사하세요. 코덱스는 `~/.agents/skills/`.
설치 뒤 `skills/sns-plan/references/voice.md` 를 `~/.claude/sns/voice.md` 로 복사해 10분만 채우세요. 모든 스킬이 그 파일로 당신 계정의 말투와 독자를 압니다.

## 고치기 전 → 후 (실제 글, 2026-10-28)

**전** — 290자, 처음 듣는 말 다섯 개(레딧·미니맥스·토막·설명 글·돈 내는 영상 사이트), 올린 지 41분에 좋아요 1. `th_check.mjs` 22점.
> 레딧에서 화제가 된 괴수 영상, 미니맥스 Hailuo로 만들었다고 합니다 / 구름 위 괴수가 전투기에게 파란 불을 뿜는 1분짜리 영상인데, 7초 토막을 만드는 데 10분씩 걸렸다고 설명 글에 적혀 있습니다 / …

**후** — 약 150자, 첫 줄은 '아는 이름 vs 한 사람', 중간에 뒤집기, 끝은 한 단어로 답할 질문. 95점.
> 고질라급 괴수 영화 장면, 한 사람이 집 컴퓨터로 공짜로 만듦
> 구름 위 괴수가 전투기한테 파란 불 뿜는 1분짜리 / 7초 만드는 데 10분씩 걸렸대
> 근데 댓글 1등은 칭찬이 아니라 "괴수가 산보다 커서 말이 안 됨" ㅋㅋ
> 영상으로 보고 싶은 장면 하나 대 봐

검사기가 왜 그렇게 봤는지도 같이 말합니다: 담담한 소식 첫 줄은 조회 4만 넘은 한국어 쓰레드 16편 중 0편, 단정하는 의견 한 줄이 없는 꿀팁 글은 420회, 본문 링크는 16편 모두 0개.

## [Stop the AI Slop] 한국 SNS 운영 ALL-in-one 팩

AI가 쓴 티 나는 쓰레드 글·릴스 대본·카드뉴스를 실제로 퍼진 글의 규칙으로 고쳐요. 쓰레드 글과 답글, 릴스 대본, 카드뉴스 10장, 인스타 캡션, 쇼츠 제목, 한 주 계획, 성과 복기, AI 티 걷어내기. 명령 9개.

세 계정에 매일 7편을 올리는 운영 규칙 그대로예요. 한국어 쓰레드 바이럴 49편, 조회 50만 넘은 한국 쇼츠 82편, 우리 글 125편을 분석한 숫자가 참고 파일에 들어 있고, 검사 스크립트 8개는 설치 없이(Node만) 돌아가요.

| 명령 | 하는 일 | 실제로 도는 스크립트 |
|---|---|---|
| [`/th-post`](skills/th-post/) | 소식이나 자료를 받아 한국어 쓰레드에서 퍼지는 글로 다시 써요. | `th_check.mjs` |
| [`/th-reply`](skills/th-reply/) | 내 글에 달린 답글마다 그 사람 말을 받아 1~2줄로 답해요. | `reply_check.mjs` |
| [`/ig-reel`](skills/ig-reel/) | 소식이나 팁을 30~60초 세로 영상 이야기로 써요. | `hook_score.mjs` |
| [`/ig-carousel`](skills/ig-carousel/) | 글 하나를 1080×1350 카드뉴스 10장 그림 파일로 만들어요. | `carousel_html.mjs` |
| [`/ig-caption`](skills/ig-caption/) | 릴스·카드뉴스 캡션을 검색되고 공유되게 써요. | `caption_check.mjs` |
| [`/yt-short`](skills/yt-short/) | 유튜브 쇼츠 제목 3~5안을 쉬운 말·큰 의미·질문형 규칙으로 쓰고 검사 스크립트로 나란히 점수 매겨요. | `title_check.mjs` |
| [`/sns-plan`](skills/sns-plan/) | 소재 목록을 받아 쓰레드·릴스·카드뉴스·쇼츠 한 주 시간표를 짜요. | — |
| [`/sns-audit`](skills/sns-audit/) | 편별 조회·저장·답글 CSV를 주면 내 계정 기준선(P25·중앙·P75), 편별 배수, 첫 줄 꼴별 중앙값, 병목(노출·시청·가치)과 다음 조치를 규칙대로 내요. | `audit.mjs` |
| [`/sns-human`](skills/sns-human/) | 쓰레드·캡션·쇼츠 대본처럼 짧은 한국어 글의 AI 티를 20패턴 + 말끝 분포로 잡아내고, 사실은 그대로 둔 채 사람 글처럼 고쳐요. | `kr_ai_tone.mjs` |


## 어디서 나온 규칙인가
- 한국어 AI·IT·직장 쓰레드 바이럴 49편(조회 4만+ 16편 vs 1천 미만 12편) + 전체 분야 47편 — 글 페이지에서 조회·답글·공유를 직접 읽었습니다. `skills/th-post/references/first-lines.md`
- 조회 50만 넘은 한국어 AI·업무 쇼츠 82편 — 첫 문장 유형·길이·말 속도·컷 간격·자막 위치를 측정했습니다. `skills/ig-reel/references/hooks.md`
- 우리 계정 쓰레드 125편·릴스 92편 — 길이별 조회 중앙값, 첫 줄 꼴별 배수, 저장할 물건 유무에 따른 저장률.
- 각 스킬 폴더의 `examples/01.md` 는 그 스킬을 실제로 돌린 결과를 고치지 않고 실은 것입니다. 실행 증거 없는 스킬은 올리지 않습니다.

한국어 설명과 회원 전용 스킬(정부 AI 지원사업 찾기, 마케터 프롬프트 52개, AI 직원 8명 팀): **https://aikoreaclub.com/skills/**

## 규칙
- 폴더 하나 = 스킬 하나. `SKILL.md`(머리글 name·description + 본문) + `scripts/`·`references/`·`examples/`.
- 비밀값·개인정보 금지. 본문은 한국어, 머리글 description 은 영어.
- 고칠 점은 이슈로 남겨 주세요. 다음 판에 반영하고 이름을 남깁니다.

## 라이선스 / License
MIT © 2026 IMP Entertainment (AI Korea Club). 스킬 안의 출처 표기는 지우지 말아 주세요.
