---
name: sns-plan
description: Plan a week of Korean SNS posts (Threads, Instagram Reels/carousels, YouTube Shorts) from a list of topics. Use when the user asks for a 주간 계획, 콘텐츠 캘린더, 게시 시간표, or "what should I post this week" for a Korean account. Applies the tested daily timetable, the 70/30 how-to/news ratio, one "check yours" Threads post per day, 12-hour speed rule, and writes a voice.md if the account has none.
---

# 한 주 SNS 계획 (sns-plan)

소재 목록(또는 "이번 주 뭐 올리지")을 받아 플랫폼별 한 주 시간표를 짠다. 세 계정을 매일 7편씩 자동으로 돌리며 조정해 온 시간표와 비율(`references/schedule.md`)을 쓴다.

## 먼저
- `~/.claude/sns/voice.md` 가 없으면 `references/voice.md` 양식을 복사해 사용자와 함께 채운다(계정·누구에게·말투·금지·고정 요소·잘 된 글 3개). 팩의 모든 스킬이 이 파일을 읽는다.
- 지난주 숫자가 있으면 `sns-audit` 를 먼저 돌려 잘 된 첫 줄 꼴·형식을 안다.

## 절차
1. **소재를 갈래로 나눈다**: 써먹는 법 / 소식 / 성공담 / 내 것 확인 / 의견·논쟁 / 지원사업·마감. 비율은 써먹는 법 70, 소식 30. 소식은 반드시 "그래서 이렇게 써라"로 끝나게 각도를 적는다.
2. **시간표에 앉힌다**(쓰레드 중심 계정 기준: 08·10·14·16·20·23시 단독 글 + 12:00·18:30·21:00 세트). 00~08시 없음. 하루 6개 안팎. 큰 소식은 그날 가장 앞 시간으로, 발표 12시간 안에.
3. **하루 한 편은 '내 것 확인형'** 쓰레드(대상 + 지금 내 것에 생긴 일 → 확인법 → 할 일 → 한 단어 질문). 소재가 소식이든 자료든 이 각도를 먼저 찾는다.
4. **형식을 정한다**: 쓰레드 글(th-post) / 릴스 대본(ig-reel) / 카드뉴스 10장(ig-carousel) / 쇼츠 제목(yt-short). 새 기능 발표 당일은 쓰레드 사진 글이 먼저, 쇼츠는 결과물이 있을 때만.
5. **같은 날 같은 주제 반복 금지**, 세트 영상을 쓰레드에 영상으로 올리지 않기. 최근 10편과 나란히 놓고 틀이 같아 보이면 소재 갈래나 첫 줄 꼴을 바꾼다.
6. 끝 문장(댓글 키워드)과 이번 주 키워드를 정한다. 월요일 "주간 AI 소식" 캐러셀 1편을 넣는다.

## 출력 형식
```
이번 주 목표: (한 줄) · 비율: 써먹기 N / 소식 N / 성공담 N
키워드(댓글→링크): …

| 요일 | 시각 | 플랫폼·형식 | 갈래 | 소재 | 첫 줄 각도(꼴) | 만들 스킬 |
|---|---|---|---|---|---|---|
| 월 | 08:00 | 쓰레드 글 | 정보 | … | 바로잡기 | th-post |
…

점검: 내 것 확인형 하루 1 ✔ · 같은 주제 중복 없음 ✔ · 새벽 없음 ✔ · 12시간 규칙 해당 소재: …
```

## 하지 않는 것
- 소재를 지어내지 않는다. 사용자가 준 소재와 1차 출처가 있는 것만.
- 수익·부업 소재. 남의 창작물을 그대로 쓰는 계획.
- 하루 9개 이상(조회가 꺾인다).
