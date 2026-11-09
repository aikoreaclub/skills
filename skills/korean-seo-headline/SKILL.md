---
name: korean-seo-headline
description: Write Korean news/blog headlines that rank in Naver and Google. Use when the user asks for a Korean article title, SEO title, meta description, or search keywords for a Korean-language post (news, blog, press release, product page). Produces a display headline, a search title, 2-3 keywords in standardized Korean spelling, and a 120-character description.
---

# 한국어 검색 제목 스킬 (korean-seo-headline)

한국어 글의 제목을 **읽는 제목**과 **검색 제목**으로 나눠 만든다. 네이버와 구글에서 실제로 검색되는 말을 제목 앞에 두고, 화면에 보이는 제목은 신문 헤드라인 문법으로 쓴다. AI Korea Club(aikoreaclub.com)이 매일 AI 뉴스 기사에 쓰는 규칙 그대로다.

## 언제 쓰나
- 뉴스·블로그·보도자료·상품 설명·공지 글의 제목을 지을 때
- 이미 쓴 제목이 "검색에 안 걸린다"고 할 때
- 메타 설명(description)과 검색어(keywords)를 함께 달라고 할 때

## 절차
1. 글(또는 요약)을 읽고 **핵심 대상**을 하나 정한다. 회사·제품·기능·제도·사람 이름 중 사람들이 검색창에 실제로 치는 것. 비유어("움직이는 그림")가 아니라 실제 이름("GIF", "이미지 2.6").
2. **검색어 2~3개**를 고른다. 표기는 `references/naming.md` 의 통일표대로(ChatGPT→챗GPT, Claude→클로드 …). 일반명사(AI, 기술, 서비스, 발표)는 검색어로 쓰지 않는다. 첫 검색어가 핵심 대상.
3. **읽는 제목(헤드라인)** 을 쓴다. 규칙:
   - 주어(회사·제품·사람)가 맨 앞, 서술은 현재형("~한다", "~낸다") 또는 명사 종결("출시", "공개", "최저")
   - 18~28자. "~했다" 과거형 서술문 금지
   - 핵심어 하나만 작은따옴표, 두 토막이면 말줄임표(…) 한 번, 물음표 제목은 하루 1건까지
   - 낚시·과장·감탄사 금지
4. **검색 제목(seoTitle)** 을 쓴다. 28~40자, 첫 검색어가 맨 앞, 헤드라인과 같은 사실만, 비유어 대신 실제 기능·제품 이름. 구글은 약 30자, 네이버는 약 25자 뒤를 자르므로 핵심은 앞 25자 안에.
5. **설명문(description)** 을 쓴다. 100~120자, 헤드라인에 없는 정보(숫자·날짜·대상)로 시작, 검색어 하나를 자연스럽게 포함, 마침표로 끝.
6. 아래 출력 형식으로 내고, 마지막 줄에 "왜 이 검색어인가"를 한 줄 적는다.

## 출력 형식
```
읽는 제목: …
검색 제목: …
검색어: 가, 나, 다
설명문: …
근거: …(검색어를 고른 이유 한 줄)
```

## 예시
입력 요약: 오픈AI가 11월 4일 챗GPT에 새 이미지 기능 '이미지 2.6'을 내놓아 짧게 움직이는 GIF를 만들 수 있게 됐다.
```
읽는 제목: 오픈AI, 챗GPT로 '움직이는 그림' 만든다
검색 제목: 챗GPT GIF 만들기 기능 출시, 오픈AI 이미지 2.6
검색어: 챗GPT, 오픈AI, 이미지 2.6
설명문: 11월 4일 나온 챗GPT 이미지 2.6으로 사진이나 글 한 줄에서 움직이는 GIF를 만들 수 있어요. 무료 이용자도 쓸 수 있는지, 어디서 켜는지 정리했어요.
근거: 사람들은 "움직이는 그림"이 아니라 "챗GPT GIF"로 검색한다.
```

## 하지 않는 것
- 메타 키워드 태그나 해시태그 나열을 권하지 않는다(네이버·구글 순위에 반영되지 않음).
- 같은 대상을 두 표기로 섞지 않는다(ChatGPT/챗GPT). 통일표 우선.
- 한자, 영어 약어만으로 된 제목, 느낌표.
