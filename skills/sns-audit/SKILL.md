---
name: sns-audit
description: Post-mortem for a Korean SNS account from a CSV of posts. Use when the user asks 성과 분석, 왜 안 됐지, 복기, 주간 리뷰, or pastes view/like/save numbers for Threads, Instagram, or Shorts. Computes the account's own baseline (P25/median/P75), outlier multiples per post, medians by format and first-line shape, a bottleneck label (reach/watch/value) per post, and the next action rule; runs scripts/audit.mjs.
---

# SNS 성과 복기 (sns-audit)

편별 숫자를 받아 "뭐가 됐고 뭐가 안 됐는지"를 계정 기준선으로 판정한다. 남의 벤치마크 숫자가 아니라 **내 계정 최근 30일의 P25·중앙·P75**가 기준이다(외부 숫자 기준은 2026-11-07 버렸다). 계정 전체가 낮을 때 '기준 안'으로 숨는 문제는 다른 계정 숫자와 함께 봐서 막는다.

## 입력
CSV 한 장(`references/posts.example.csv` 꼴). 머리: `date,platform,format,hook,views,reach,likes,replies,saves,shares,watch_pct,duration_sec`. 없는 칸은 비운다. `hook` 은 첫 줄 꼴 이름(바로잡기·대상 찌르기·아는 이름 vs 한 사람·해 봤더니·비교·투표·담담한 소식 / 릴스는 문제 공감·숨은 기능·질문·결과 먼저·새 소식 선언). 사용자가 캡처나 표로 주면 CSV로 옮겨 적는다.

## 절차
1. `node scripts/audit.mjs posts.csv --days 30` 을 돌린다. 플랫폼마다 기준선, 형식별·첫 줄 꼴별 조회 중앙, 편별 배수(조회÷계정 중앙)와 병목, 다음 조치가 나온다.
2. **병목 읽는 법**(규칙 계산이지 원인 확정이 아니다):
   - 노출(첫 줄·표지·시간대): 조회가 P25 아래인데 시청 비율은 멀쩡
   - 시청(첫 3초·전개): 조회도 시청 비율도 P25 아래
   - 가치(저장할 물건 없음): 조회는 기준 안인데 저장/천이 P25 아래
3. **배수 2 이상 편**의 공통점(첫 줄 꼴·소재 갈래·시간대)을 적고, **0.5 미만 편**의 공통점을 적는다. 쓰레드는 답글÷좋아요(판정·투표 요청 글은 약 0.4, 없는 글 0.06)도 본다.
4. **다음 조치는 규칙대로**: 최근 5편 중앙이 P25 아래면 편 단위 손질이 아니라 포맷 수준 개편(소재 갈래·첫 줄 형식·화면 컨셉 중 하나)을 정해 3편 48시간 판정. 잘 된 꼴이 있으면 다음 주 비율 절반 이상으로. 둘 다 아니면 첫 줄 꼴 하나를 바꿔 3편 시험.
5. 결과를 "결론 3줄 → 표 → 다음 주 할 것 3개"로 보여 준다. '계정이 원래 이렇다'로 끝내지 않는다.

## 출력 형식
```
결론
- 잘 된 꼴: … (배수 …)
- 안 된 꼴: … (배수 …)
- 병목: 노출 N편 · 시청 N편 · 가치 N편

(audit.mjs 표)

다음 주 할 것
1. …
2. …
3. …
```

## 하지 않는 것
- 팔로워 수·좋아요 수 자체를 목표로 삼지 않는다(도달·저장·답글이 신호).
- 알고리즘 탓, 계정 상태 탓으로 끝내지 않는다. 바로 우리 쪽 개선 조치로.
- 숫자를 지어내거나 추정치를 실측처럼 쓰지 않는다. 추정은 '추정'이라고 적는다.
