---
name: th-reply
description: Reply to comments under your Korean Threads posts so the conversation continues. Use when the user pastes replies/comments from Threads (or Instagram) and wants short human replies in Korean, or asks what to answer. Writes 1-2 line replies that pick up the commenter's own words, skips spam and sensitive questions, and checks the batch with scripts/reply_check.mjs.
---

# 쓰레드 답글 쓰기 (th-reply)

내 글 아래 달린 답글에 사람처럼 짧게 답해 대화를 한 번 더 잇는다. 쓰레드는 대화가 오가는 글을 퍼뜨린다. 하루 답글 30~40개를 받던 계정이 남의 답글에 한 번도 답하지 않자(10/8부터) 하루 노출이 20,354에서 100~500으로 떨어졌다. 그 뒤 이 규칙으로 답글을 달기 시작했다.

## 입력
원글(postText)과 답글 목록(id, text). 사용자가 캡처나 붙여 넣기로 주면 목록으로 정리해 시작한다. `~/.claude/sns/voice.md` 가 있으면 말투를 따른다.

## 답 쓰는 법
1. **1~2줄, 80자 안쪽.** 줄 끝 마침표 없음. 이모지 0~1개. 한자 금지.
2. **그 사람 말에서 한 단어를 집어 이어 간다.** "감사합니다", "좋은 의견이에요"로 시작하거나 끝내지 않는다.
3. **절반쯤은 가벼운 되물음으로 끝낸다.** "어디에 써 보실 거예요?", "그건 해 보셨어요?" 매번은 아니다.
4. **질문이면 원글에 있는 사실만으로 답한다.** 모르면 "그건 원문에도 안 나와 있어요". 숫자·사실을 지어내지 않는다.
5. **링크·사이트 주소·"DM 주세요"·"프로필 링크" 금지.** 쓰레드가 링크 답글을 막은 적이 있다. 홍보 문장도 금지.
6. **트집·반박**: 맞으면 인정, 틀렸으면 원글 근거 하나로 부드럽게. 싸우지 않는다.
7. **수익·부업 말 금지.**

## 건너뛰기(skip)
- 스팸·광고·링크만 있는 답글·욕설·정치·종교 싸움·개인정보 → `skip`
- "ㅋㅋ", 이모지 하나만 있는 답글은 건너뛰지 않고 짧게 받는다("ㅋㅋㅋ 그치")
- 건강·법·돈처럼 판단이 민감한 질문 → `skip` + `"sensitive": true` (사람이 답한다)

## 출력 형식
모든 답글을 빠짐없이 한 번씩 넣는다.
```json
{"replies":[{"id":"1","reply":"…"},{"id":"2","skip":"광고","sensitive":false}]}
```
JSON을 파일로 저장하고 `node scripts/reply_check.mjs replies.json` 으로 길이·마침표·링크·인사치레·되물음 비율을 확인한 뒤, 사람이 읽기 좋은 목록(답글 원문 → 내 답)으로도 보여 준다.

## 말투 본보기
- 친근한 반말 계정: "ㅋㅋ 그 트집 나도 봤음, 근데 7초에 10분이면 집 컴퓨터치곤 빠른 편이야"
- 존댓말 운영팀: "맞아요, 그 부분이 제일 헷갈리죠 혹시 어떤 도구 쓰세요?"
- 1인칭 캐릭터: "나도 처음엔 그랬어… 근데 한 번 해 보니까 생각보다 쉽더라"
