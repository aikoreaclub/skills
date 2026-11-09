---
name: ig-carousel
description: Make a 10-slide Korean Instagram carousel (1080x1350) as files, not just copy. Use when the user asks for 카드뉴스, 캐러셀, 인스타 슬라이드, or wants to turn an article/tip into swipeable slides in Korean. Writes slides.json (cover hook, one message per slide, changing layouts, save slide) and renders HTML + PNG with scripts/carousel_html.mjs.
---

# 인스타 카드뉴스 10장 만들기 (ig-carousel)

글 하나를 인스타 캐러셀 10장으로 만든다. 원고만 주는 게 아니라 **1080×1350 그림 파일 10장**까지 낸다. 하루 1~3편 카드뉴스를 만들어 쓰레드·인스타에 올리는 계정의 장 구성·레이아웃 규칙이다.

## 절차
1. **장 구성(10장 고정)**: 1 표지 훅 / 2~3 무슨 일(2장은 단독으로도 훅이 되게) / 4~9 한 장 한 메시지 / 10 저장·팔로우·공유. 항목이 여럿이면 한 장에 한 항목.
2. **표지**: 대상을 콕 집는 두세 줄(15자 안팎씩) + 작은 윗말(kicker). "그러나…/근데…"로 끊어 궁금증을 남겨도 된다. 날짜 머리말은 발표 24시간 안 속보에만.
3. **이야기 순서**: 왜 중요한가 → 실제 사례 → 여기서 이렇게 하면 된다(단계별) → 함정 → 정리 → 저장. 목록을 한 장에 몰아넣지 않는다.
4. **레이아웃은 장마다 바꾼다.** 연달아 같은 판 금지. 판 7종: `cover`(표지) · `photo`(위 사진) · `accent`(주황 바탕) · `dark-list`(차콜 목록, items) · `quote`(사진 위 인용, 사진 필수) · `steps`(실제 화면 캡처 + 설명) · `save`(마지막).
5. **글자**: 화면 문구는 존댓말로 말끝을 섞는다(~어요·~입니다·~죠·~인데요). 줄바꿈은 원고에서 직접(`\n`). 줄표(—) 나열, "무엇: 무엇" 제목, 한자, 한글 명조체 금지.
6. **사진**: 장마다 소재에 맞는 사진이 있으면 `img` 에 경로. 글자만 있는 미색 인용 판은 금지(스크립트가 photo 판으로 바꾼다). 실제 앱 화면 캡처를 쓸 때는 계정 이름·개인 정보를 가린다.
7. **출처**는 캡션이 아니라 장 아래 작게(`source`). 핵심 1~2개만.
8. `slides.json` 을 `references/slides.example.json` 꼴로 쓰고 `node scripts/carousel_html.mjs slides.json out` 을 돌린다. `out/carousel.html` 과 `out/01.png`~`10.png` 가 나온다(PNG는 playwright-core 가 있을 때. 없으면 HTML을 브라우저로 열어 캡처).
9. 10장을 한 장짜리 모아보기로 보고 "틀만 같고 내용만 바꾼 것처럼 보이는지" 확인한다.

## 출력
- `slides.json`(원고) · `out/carousel.html` · `out/01~10.png`
- 캡션은 `ig-caption` 스킬로 따로 쓴다. 마지막 장과 캡션의 끝 문장은 같은 댓글 키워드 문장으로.

## 하지 않는 것
- 글자만 있는 장 연속. 정지 이미지에 가짜 확대·이동.
- 남의 캐러셀 배치·색·문구 구성을 그대로 따라 하기.
- 경고로 끝내기("조심하세요"). 반드시 "그래서 이렇게 하세요"로.
