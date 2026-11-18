# App Store keywords 1.7.1: Japan, Korea, Vietnam, Indonesia, Chinese (18 November 2026)

Proposal for the keyword fields of `ja`, `ko`, `zh-Hans`, `vi` and `id` in version 1.7.1, plus one subtitle suggestion (Japan).
The fields are in `store/metadata/zoekwoorden-1.7.1/asia.json`. Nothing was uploaded and nothing was committed. Live version
today: 1.7.0 (released 17 November), with the names and subtitles of 1.6.1 (checked live) and 0 ratings in all these
storefronts.

## Bottom line

1. **We only reach the top 12 when few apps match every word of the search.** That happens almost only for "sudoku + genre
   word" (VN *sudoku thám tử* #1, ID *sudoku misteri* #2, KR *범죄 스도쿠* #7, JP *数独 犯人* #4, *ナンプレ 探偵* #4). On real,
   frequently suggested terms we are outside the top 12 everywhere, even when the words are in our name or subtitle and
   most of the top 10 has under 100 ratings (KR *추리 스도쿠*, which is our own name; VN *game phá án*; ID *game misteri*;
   JP *犯人探し*). With 0 ratings and about 7 downloads a day, a keyword alone does not lift us past a dozen small genre apps.
2. **So the keyword field can only win rare combinations.** The new fields cover more real combinations for the same
   characters, and add a handful of real terms whose top 10 is small or off-topic. Expect gains in the long tail, not on
   探偵, 추리게임 or game thám tử.
3. **Japan: the subtitle is the lever.** 探偵 has the weakest top 10 of all big Japanese genre words (111 / 25 / 4 ratings)
   and 容疑者 already ranks #12 from the keyword field alone. The suggestion moves both, plus パズル, into the subtitle.
4. **zh-Hans does not count in Taiwan or Hong Kong.** Measured, and in line with Apple's table. It counts in Singapore and the
   US only, where we reach no top 12 even on our own name. A Traditional Chinese (zh-Hant) localization is the real opening
   there; that is outside this proposal.

## Method

All public sources, no App Store Connect, on 18 November 2026 between 22:25 and 23:35 CET. Scripts and raw data:
`/private/tmp/claude-501/-Users-jaimycai/4b665c0e-1f47-4ec1-80b1-80218956e1fb/scratchpad/kw-asia/`.

1. **Real terms.** Apple's search-hints endpoint (`MZSearchHints`, store front per country) for about 430 prefixes: every
   seed (detective, mystery/riddle, logic, puzzle, sudoku/number place, deduction, culprit, case, brain training, suspect,
   crime, clue, noir) in the local language and the seed plus a space; for Japan and Korea also its first one to four
   characters and the seed plus common next characters; for Vietnam and Indonesia also "game " and "sudoku " plus a letter. "Hint" in the tables: `"prefix" #n` = suggestion n after typing that prefix.
2. **Competition.** For about 320 term × storefront pairs: the App Store web search (`apps.apple.com/<cc>/iphone/search`,
   logged out, not personalised) for the real top 12 in store order, and the iTunes lookup API for the rating count of each
   app in that storefront. "On topic" = how many of the top 10 are detective, mystery or logic apps (yes 8+, mixed 5 to 7,
   no 4 or fewer), checked by hand for the terms that matter.
3. **Our rank.** Our place in that top 12, or ">12". For a few terms also the iTunes Search API (`limit=200`); it ranks
   differently from the store (容疑者: web #12, API #46), so it only says "far" or "very far".
4. **Indexing tests.** Searches for "crimson ledger" plus one word that appears only in one field, with a nonsense control
   word.
5. **Check.** `checkfields.js` (scratch) applies the rules of this task and reuses the MURDER and MURDER_TR regexes from
   `store/metadata/check-1.6.js`. All five fields pass, as does Japanese variant B with the suggested subtitle.

## Did the hints endpoint work?

Yes, in all seven storefronts tried (JP `143462-9`, KR `143466-13`, VN `143471`, ID `143476`, TW `143470-18`, SG, US), with
the language part where one exists. Three limits:

- After about 200 requests in a few minutes it answered 429 with a `Retry-After` of about 25 minutes, and opened again at
  the top of the hour. Other jobs on this Mac were calling Apple at the same time, so the budget was shared. The crawl was
  therefore cut to seeds plus short prefixes for KR, VN, ID and SG (JP got the fullest crawl).
- The iTunes Search API answered 403 for most of the session, so it was used for a few terms only; the web search page
  replaced it. The web page's own rating counts are unusable (Japanese "1.2万" style and missing on event cards), hence the
  lookup API for counts.
- Chinese hints in Singapore and the US are sparse and mostly app names.

## Which localizations count per storefront

| Storefront | Apple's table | Measured here |
|---|---|---|
| Japan | Japanese + English (US) | "crimson ledger whodunnit" (en-US/en-GB word) finds us, "…whodunit" does not; en-US earlier proven to count, en-GB not (Nov research). Our #2 on *mystery sudoku* in Japan comes from en-US. |
| Korea | Korean + English (UK) | "…whodunnit" finds us |
| Vietnam | English (UK) default + Vietnamese | "…whodunnit" finds us |
| Indonesia | English (UK) default + Indonesian | "…whodunnit" finds us |
| Taiwan | Chinese (Traditional) + English (UK) | zh-Hans **not** indexed: "…侦探", "…偵探", "…九宫格" give 0 results, "…whodunnit" finds us |
| Hong Kong | Chinese (Traditional) + English (UK) | not completed (control only); same table row as Taiwan |
| Singapore | English (UK) default + Chinese (Simplified) | zh-Hans indexed ("…推理", "…证明" find us) |
| United States | English (US) + 8 others incl. Chinese (Simplified), Korean, Vietnamese | not retested |

So `ja` also feeds on `en-US`, and `ko`, `vi` and `id` sit next to `en-GB`. Apple does not join words across two
localizations, so each field must hold its own combinations.

## How Apple splits words here (measured)

- **Japanese, Korean and Chinese are matched by parts.** "…探し" finds us (only inside 犯人探し), "…体操" (inside 頭の体操),
  "…퀴즈" (inside 추리퀴즈), "…证明" (inside 不在场证明). Queries are split too: "…탐정퍼즐" and "…범죄스도쿠" find us with the
  parts in separate fields, a control "…zzqqvv퍼즐" does not; "…事件解決" and "…推理数独" find us the same way. So a compound
  is only needed when both parts are missing.
- **Exception: Chinese words that are one entry in the dictionary.** "…逻辑推理" does not find us, although 逻辑 and 推理 are
  both in our fields. Such compounds must be written out.
- **The 100 limit is characters, not bytes.** 추리퀴즈 sits at byte ~200 of the Korean field and 不在场证明 at byte ~170 of the
  Chinese field; both are found.
- **Rank follows the name and subtitle, then popularity.** Combinations with a name word win (JP *ナンプレ 謎解き* #1,
  *数独 犯人* #4); words only in the keyword field reach the top 12 only when nearly nobody else matches.

## Candidates per storefront

Columns: our rank in the store's top 12 today (">12" = not in it; API rank where measured, "not in API list" = not among
the API's results); rating counts of #1, #5 and #10 in that storefront, with the number of the top 10 under 100 ratings.

### Japan (JP): name ナンプレ×謎解き, subtitle 犯人探しの推理ゲーム・広告なし

Biggest storefront. Every big genre word is outside our reach today; we are in the top 12 only on name combinations and on
容疑者. Of the real terms, 探偵, 容疑者 and the 推理 + パズル family have the smallest top 10s.

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| 探偵 | detective | "探" #2 | >12 (not in API list) | 111 / 25 / 4 (5 <100) | yes | keep; best target, needs the subtitle |
| 推理 | deduction | "推理" #1 | >12 | 573 / 32,730 / 3,504 (2 <100) | yes | in subtitle; top 10 too strong |
| 推理ゲーム | deduction game | "推理" #2 | >12 (not in API list) | 573 / 193,457 / 5,724 (3 <100) | yes | in subtitle; won't win (#5 has 193k ratings) |
| 推理パズル | deduction puzzle | "推理" #4 | >12 (not in API list) | 151 / 11 / 111 (5 <100) | yes | covered by 推理 + パズル; target via subtitle |
| 探偵 推理ゲーム | detective deduction game | "探" #2 as 探偵 推理ゲーム 無料 | >12 (not in API list) | 7 / 3 / 151 (5 <100) | yes | covered (探偵 + 推理 + ゲーム) |
| 推理 探偵 | deduction detective | "推理" #8 | >12 | 29,471 / 3,435 / 3 (6 <100) | yes | covered |
| 謎解き 推理 | mystery-solving deduction | "推理 " #3 | >12 (not in API list) | 193,457 / 7 / 1 (3 <100) | yes | covered (name + subtitle); still >12 |
| ロジックパズル 推理 | logic puzzle deduction | "推理 " #4 | >12 (not in API list) | 151 / 155 / 12 (6 <100) | yes | covered; keep ロジック, パズル |
| パズルゲーム 推理 | puzzle game deduction | "推理 " #5 | >12 (not in API list) | 11 / 151 / 85 (7 <100) | yes | covered |
| 推理ロジック | deduction logic | "推理" #7 | >12 | 151 / 2,708 / 3,087 (3 <100) | yes | covered |
| 犯人探し | finding the culprit | "犯人" #4 | >12 (API 52) | 11 / 333 / 2 (5 <100) | yes | in subtitle; still >12 |
| 犯人は誰だ | who is the culprit? | "犯人" #2 | >12 | 6 / 449 / 3,296 (3 <100) | yes | add 誰 (1 char); hint is also an app name |
| 犯人当て | guess the culprit | app name only ("犯人当" #1) | >12 | 2 / 1,266 / 2,907 (5 <100) | yes | add 当て (2 chars) |
| 容疑者 | suspect | "容疑者" #3 | 12 (API 46) | 55 / 8 / 18 (9 <100) | mixed | keep; #12 today; into subtitle |
| 事件簿 | casebook | "事件" #3 | >12 | 1,927 / 722 / 1 (4 <100) | yes | add (replaces 事件, covers it) |
| 事件解決 | case solved | "事件" #4 | >12 | 10,107 / 12,498 / 2,612 (0 <100) | yes | keep 解決 (2 chars); won't win |
| 手がかり | clue | "手がかり" #6 | >12 (API 112) | 699 / 22 / 4 (6 <100) | yes | keep |
| 捜査 | investigation | "捜査" #1 | >12 (not in API list) | 10,791 / 57 / 2 (6 <100) | yes | keep |
| 刑事 | police detective | "刑事" #1 | >12 | 4 / 1,173 / 1 (3 <100) | mixed | keep (2 chars) |
| 論理的思考 | logical thinking | "論" #3 | >12 | 2 / 45 / 0 (5 <100) | mixed | add |
| 論理パズル | logic puzzle | "論" #1 | >12 | 151 / 2,280 / 11 (3 <100) | yes | covered by 論理(的思考) + パズル |
| ロジックパズル | logic puzzle | "ロジ" #2 | >12 | 59,539 / 5,217 / 2 (1 <100) | yes | keep ロジック; top 10 strong |
| 謎解きパズル | mystery-solving puzzle | "謎" #5 | >12 | 2,087 / 325 / 248,909 (0 <100) | mixed | covered; top 10 strong |
| 謎解き探偵 | mystery-solving detective | "謎解き探" #1 | >12 (not in API list) | 5 / 3,653 / 38 (3 <100) | yes | covered |
| ナンプレ 広告なし | number place, no ads | "ナン" #9 | >12 | 5,369 / 237 / 15 (2 <100) | yes | covered (name + subtitle); plain sudoku apps win |
| ナンプレ 難しい | number place, hard | "ナンプレ " #9 | >12 | 17,064 / 3 / 2 (3 <100) | yes | add 難しい |
| ナンプレ 頭の体操 | number place brain teaser | "頭の体操" #5 | >12 | 15,050 / 995 / 434 (3 <100) | yes | keep 頭の体操 |
| ナンプレ 探偵 | number place detective | no | 4 | 10 / 0 / 0 (9 <100) | yes | works today; keep 探偵 |
| ナンプレ 推理 | number place deduction | no | 10 | 82 / 0 / 0 (7 <100) | yes | works today |
| 数独 犯人 | sudoku culprit | no | 4 | 1 / 0 / 4 (10 <100) | yes | works today; keep 数独 |
| 謎解き ナンプレ | mystery-solving number place | no | 2 | 0 / 0 / 22,687 (5 <100) | yes | works today (name) |
| 脳トレ | brain training | "脳トレ" #1 | >12 | 70,910 / 576,771 / 24,227 (0 <100) | no | keep (3 chars); won't win |
| ミステリー | mystery | "ミステリー" #1 | >12 | 96,949 / 1,332 / 246 (1 <100) | yes | keep; won't win alone |
| サスペンス | suspense | "サスペ" #1 | >12 | 3,296 / 14,143 / 7,659 (2 <100) | mixed | keep |
| サスペンスゲーム | suspense game | "サスペ" #3 | >12 | 30 / 111 / 1 (5 <100) | yes | covered (サスペンス + ゲーム) |
| 犯罪ゲーム | crime game | "犯罪" #2 | >12 | 35,736 / 23 / 0 (5 <100) | no | keep 犯罪 (2 chars); top is crime-city games |
| 名探偵 | great detective | "名探偵" #5 | >12 | 2,164 / 3,504 / 30 (3 <100) | yes | keep low; Detective Conan owns it |
| 推理クイズ | deduction quiz | "推理ク" #1 | >12 | 11 / 465 / 96,949 (2 <100) | yes | not added: the game is not a quiz |
| ロジカルシンキング | logical thinking (business) | "ロジ" #10 | >12 | 2 / 10 / 1 (8 <100) | no | not added: business-skill apps |
| 推理アドベンチャー | deduction adventure | "推理" #5 | >12 | 714 / 1 / 17 (6 <100) | yes | not added: not an adventure game |
| アリバイ | alibi | "アリバイ" #2 | >12 | 1 / 1 / 180,550 (5 <100) | no | drop: hint is アリババ, top is off-topic |
| mystery sudoku | (en-US field) | no | 2 | 0 / 1 / 73 (8 <100) | mixed | works today via en-US |

### Korea (KR): name 추리 스도쿠, subtitle 광고 없는 범인 찾기 탐정 게임

At least twelve Korean genre apps share 추리, 스도쿠, 탐정 and 범인, so even our own name phrase stays outside the top 12. What
works is the word the others avoid: 범죄 (crime), because they use 살인 (murder).

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| 추리게임 | deduction game | "추" #1 | >12 | 592 / 4,365 / 13 (2 <100) | mixed | keep (most typed form) |
| 탐정게임 | detective game | "탐정" #1 | >12 | 592 / 3,574 / 73 (3 <100) | yes | drop: "탐정 게임" is in the subtitle |
| 추리 퍼즐 | deduction puzzle | "추리퍼" #1 | >12 | 49 / 3 / 9 (8 <100) | mixed | add 추리퍼즐 |
| 추리 스도쿠 | deduction sudoku | "추리 스" #2 | >12 | 6 / 10 / 0 (7 <100) | yes | our name; 12+ genre apps share it |
| 범인 찾기 | find the culprit | "범인" #1 | >12 | 592 / 0 / 0 (7 <100) | yes | in subtitle; still >12 |
| 범인 | culprit | "범인" #2 | >12 | 928 / 49 / 3 (5 <100) | yes | in subtitle |
| 논리퍼즐 | logic puzzle | "논" #4 | >12 | 461 / 49 / 2 (4 <100) | yes | keep |
| 추리퀴즈 | deduction quiz | "추리" #10 | >12 | 783 / 49 / 12 (6 <100) | yes | keep |
| 미스터리 추리 | mystery deduction | "미스터리 추" #1 | >12 | 343 / 2 / 0 (5 <100) | yes | covered |
| 수수께끼 | riddle, mystery | "수수" #1 | >12 | 592 / 3,812 / 15 (1 <100) | no | keep |
| 명탐정 스도쿠 | great-detective sudoku | "명탐정" #5 | 3 | 1 / – / – (3 <100) | mixed | works today (#3); keep 명탐정. Also another app's name |
| 범죄 스도쿠 | crime sudoku | no | 7 | 49 / 0 / 0 (10 <100) | yes | works today (#7); keep 범죄 |
| 스도쿠 광고 | sudoku ads(-free) | "스도" #9 | >12 | 388 / 12 / 0 (7 <100) | yes | covered (name + subtitle); plain sudoku apps win |
| 스도쿠 오프라인 | sudoku offline | "스도" #3 | >12 | 388 / 6 / 0 (6 <100) | yes | keep 오프라인 |
| 단서 | clue | "단서" #2 | >12 | 105 / 62 / 2 (6 <100) | mixed | keep |
| 수사게임 | investigation game | "수사" #1 | >12 | 461 / 863 / 9 (5 <100) | yes | keep 수사 |
| 용의자 | suspect | no | >12 | 5 / 49 / 1 (7 <100) | yes | keep |
| 형사 | police detective | "형사" #5 | >12 | 128 / 87 / 0 (7 <100) | no | keep (2 chars); top is legal portals |
| 크라임씬 | Crime Scene (TV show) | "크라임" #1 | >12 | 2,874 / 0 / 1 (5 <100) | mixed | add 크라임 only |
| 두뇌 트레이닝 | brain training | "두뇌" #2 | >12 | 6,328 / 806 / 11,251 (2 <100) | no | not added |
| 미궁게임 | labyrinth riddle game | "미궁" #3 | >12 | 15 / 1 / 88 (8 <100) | no | not added: other genre |
| 숫자 퍼즐 | number puzzle | "숫자 퍼즐" #1 | >12 | 6,157 / 856 / 9 (3 <100) | no | not added: no numbers in the game |
| 스도쿠 클래식 | classic sudoku | "스도" #2 | >12 | 13,565 / 15 / 3,767 (4 <100) | yes | not added: not classic sudoku |

### Vietnam (VN): name Sudoku Thám Tử, subtitle Game phá án, không quảng cáo

"sudoku + genre word" is ours (#1 to #4). The Vietnamese genre terms have small top 10s, but other small apps hold them.

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| game suy luận | deduction game | "suy luận" #2 | >12 | 9 / 0 / 0 (10 <100) | mixed | keep suy, luận |
| suy luận | deduction | "suy luận" #1 | >12 | 9 / 64 / 3 (10 <100) | mixed | keep |
| tư duy logic | logical thinking | "tư duy" #1 | >12 | 71 / 25,957 / 3 (8 <100) | mixed | add tư, duy |
| trò chơi thám tử | detective game | "thám tử" #1 | >12 | 7,151 / 428 / 0 (6 <100) | mixed | keep trò, chơi |
| game thám tử | detective game | "thám tử" #3 | >12 | 7,151 / 2 / 53,681 (7 <100) | yes | covered (name + subtitle) |
| trinh thám | detective fiction | "trinh thám" #2 | >12 | 381 / 7,151 / 0 (6 <100) | yes | keep trinh |
| game trinh thám | detective game | "trinh thám" #1 | >12 | 381 / 0 / 0 (5 <100) | mixed | covered |
| game phá án | case-cracking game | "phá án" #1 | >12 | 9 / 1,176 / 4 (6 <100) | yes | in subtitle; still >12 |
| trò chơi phá án | case-cracking game | "phá án" #4 | >12 | 9 / 423 / 0 (7 <100) | mixed | covered |
| game thám tử phá án | detective case game | no | 5 | 9 / 0 / 1 (7 <100) | yes | works today |
| sudoku thám tử | detective sudoku | no | 1 | 0 / 0 / – (8 <100) | yes | works today (name) |
| sudoku phá án | case sudoku | app name only | 3 | 3,597 / 0 / – (7 <100) | yes | works today |
| sudoku bí ẩn | mystery sudoku | no | 4 | 8,938 / 1 / 2 (9 <100) | yes | works today; keep bí, ẩn |
| sudoku trinh thám | detective sudoku | no | 3 | 0 / 1 / – (9 <100) | yes | works today; keep trinh |
| sudoku không quảng cáo | sudoku without ads | "sudoku " #1 | >12 | 315 / 20 / 1,607 (4 <100) | yes | covered (name + subtitle); plain sudoku apps win |
| sudoku offline | sudoku offline | "sudoku " #2 | >12 | 18,574 / 315 / 0 (7 <100) | yes | keep offline |
| game điều tra | investigation game | "điều tra" #7 | >12 | 39 / 53 / 804 (8 <100) | yes | keep điều, tra |
| tìm manh mối | find clues | "manh mối" #1 | >12 | 381 / 475 / 0 (7 <100) | yes | add tìm, manh, mối |
| game trí tuệ | brain game | "game t" #2 | >12 | 292,734 / 14,938 / 552,409 (0 <100) | no | drop trí, tuệ: giants |
| câu đố | riddle, puzzle | "câu đố" #6 | >12 | 292,734 / 652 / 27,230 (1 <100) | no | keep (cheap) |
| giải đố | solve puzzles | "giải đố" #2 | >12 | 7,871 / 1,385 / 675 (0 <100) | no | keep giải |
| game tội phạm | crime game | "tội phạm" #3 | >12 | 238 / 44 / 142 (7 <100) | no | keep tội, phạm (cheap); top is police games |
| nghi phạm | suspect | no | >12 | 14,378 / 0 / 804 (5 <100) | no | drop nghi: no hint |
| logic puzzle | (English, en-GB) | "logic" #4 | >12 | 9 / 6 / 0 (6 <100) | yes | covered by en-GB subtitle |
| rèn luyện trí não | brain training | "rèn luyện trí não" #1 | >12 | 43,066 / 0 / 1 (7 <100) | no | not added |

### Indonesia (ID): name Sudoku Misteri, subtitle Game detektif, asah otak

Same picture as Vietnam. The investigation words (investigasi, penyelidikan) are real and their top 10s are tiny and on topic.

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| game detektif | detective game | "game d" #10 | >12 | 2,695 / 0 / 8,332 (5 <100) | yes | in subtitle |
| game offline detektif | offline detective game | "detektif " #1 | >12 | 2,695 / 189 / 66 (7 <100) | mixed | keep offline |
| permainan detektif | detective game | "detektif " #6 | >12 | 2,695 / 182 / 0 (6 <100) | yes | add permainan |
| game misteri | mystery game | "misteri" #1 | >12 | 1,301 / 13 / 0 (6 <100) | yes | covered (name + subtitle); still >12 |
| game kasus | case game | "kasus" #1 | >12 | 1,301 / 0 / 0 (7 <100) | yes | keep kasus |
| game investigasi | investigation game | "investigasi" #1 | >12 | 0 / 0 / 0 (7 <100) | yes | add investigasi |
| investigasi | investigation | "investigasi" #2 | >12 | 182 / 0 / 1 (7 <100) | yes | add |
| penyelidikan | investigation, inquiry | "penyelidikan" #1 | >12 | 2,695 / 0 / 0 (8 <100) | mixed | add |
| game kriminal | crime game | "kriminal" #2 | >12 | 2,695 / 13 / 8,332 (4 <100) | yes | keep kriminal |
| sudoku kriminal | crime sudoku | no | 8 | 72 / 15 / 0 (10 <100) | yes | works today (#8) |
| sudoku detektif | detective sudoku | no | 8 | 1 / 0 / 0 (10 <100) | yes | works today (#8) |
| sudoku misteri | mystery sudoku | app name only | 2 | 0 / 0 / 0 (10 <100) | yes | works today (name) |
| sudoku offline | sudoku offline | "sudoku" #3 | >12 | 1 / 0 / 0 (7 <100) | yes | keep offline |
| sudoku no ads | (English, en-GB) | "sudoku" #9 | >12 | 33 / 5 / 0 (6 <100) | yes | covered by en-GB |
| game logika | logic game | "logika" #1 | >12 | 45,254 / 2 / 739 (2 <100) | yes | keep logika |
| teka teki | riddle, puzzle | "teka teki " #9 | >12 | 45,254 / 1,726 / 1,303 (0 <100) | mixed | keep |
| tebak | guess (word/picture games) | "tebak" #9 | >12 | 9,054 / 696 / 400 (0 <100) | no | drop |
| tes logika | logic test | "logika" #8 | >12 | 6 / 5,079 / 1 (8 <100) | no | not added: IQ tests |
| siapa pelaku | who did it | no | 1 | 0 / – / – (1 <100) | no | drop siapa: only one app matches, no hint |
| pelaku | culprit | no | >12 | 14 / 170 / 0 (9 <100) | mixed | keep (cheap) |
| tersangka | suspect | no | >12 | 2,695 / 582 / 0 (6 <100) | mixed | drop: no hint |
| petunjuk | clue | no | >12 | 29,339 / 0 / 72 (5 <100) | mixed | drop: hints are "petunjuk arah kiblat" |
| game asah otak | brain game | "asah otak" #2 | >12 | 45,254 / 322 / 21,102 (1 <100) | mixed | in subtitle; top 10 strong |

### Chinese (zh-Hans), measured in Singapore

Not indexed in Taiwan or Hong Kong (see above). In Singapore it is the second language next to en-GB and we are outside the
top 12 on every Chinese term, including 侦探推理 and 侦探数独 from our own name. Hints from Singapore and the US.

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| 侦探 | detective | US: "侦探" #1 | >12 | 5 / 2 / 957 (8 <100) | yes | in name |
| 侦探推理 | detective deduction | "侦探" #4 | >12 | 0 / 6 / 0 (9 <100) | yes | in name; still >12 |
| 侦探数独 | detective sudoku | no | >12 | 0 / 0 / 0 (10 <100) | yes | in name; still >12 |
| 推理游戏 | deduction game | US: "推理游戏" #1 | >12 | 147 / 31 / 6 (9 <100) | yes | keep |
| 解谜游戏 | puzzle-solving game | US: "解谜" #1 | >12 | 45 / 981 / 6 (6 <100) | yes | in subtitle |
| 逻辑推理 | logical reasoning | app names only | >12 | 147 / 2 / 4 (9 <100) | yes | add (search does not split it) |
| 益智游戏 | puzzle/brain game | "益智" #1 | >12 | 45 / 1,457 / 0 (3 <100) | mixed | add (replaces 益智) |
| 破案 | crack the case | US: "破案" #1 | >12 | 1,640 / 3 / 0 (8 <100) | yes | in subtitle |
| 烧脑 | brain-burning | no | >12 | 5 / 0 / 93 (9 <100) | no | keep |
| 悬疑 | suspense | no | >12 | 137 / 25 / 21 (9 <100) | yes | keep |
| 数独 无广告 | sudoku no ads | no | >12 | 17 / 4 / 37 (9 <100) | yes | covered |

## Chosen fields

Characters counted as Unicode characters; bytes for information (see the 100-character finding above).

| Locale | Keywords | Chars | Bytes |
|---|---|---:|---:|
| ja (A, current subtitle; in the JSON) | `探偵,容疑者,数独,パズル,ロジック,論理的思考,事件簿,解決,手がかり,捜査,刑事,証言,脳トレ,ミステリー,サスペンス,頭の体操,オフライン,誰,当て,毎日,難しい,犯罪,暇つぶし,名探偵` | 96 | 242 |
| ja (B, with the suggested subtitle) | `ゲーム,数独,ロジック,論理的思考,事件簿,解決,手がかり,捜査,刑事,証言,脳トレ,ミステリー,サスペンス,頭の体操,オフライン,誰,当て,毎日,難しい,犯罪,暇つぶし,名探偵` | 89 | 225 |
| ko | `추리게임,논리퍼즐,추리퍼즐,추리퀴즈,두뇌퍼즐,수수께끼,범죄,사건,미스터리,명탐정,용의자,단서,증거,수사,형사,오프라인,매일,알리바이,크라임,논리,퍼즐` | 83 | 209 |
| zh-Hans | `探案,刑侦,犯罪,悬疑,烧脑,线索,谜题,神探,益智游戏,离线,逻辑推理,逻辑思维,九宫格,脑力,嫌疑人,证词,智力,休闲,悬案,每日,不在场证明,侦探游戏,推理游戏,谜案` | 86 | 212 |
| vi | `trinh,logic,trò,chơi,câu,đố,giải,suy,luận,bí,ẩn,điều,tra,offline,vụ,phạm,tội,tư,duy,tìm,manh,mối` | 96 | 122 |
| id | `teka,teki,logika,offline,tanpa,iklan,kasus,kriminal,investigasi,penyelidikan,pelaku,permainan` | 93 | 93 |

All pass: at most 100 characters, no space after a comma, no word from that locale's name or subtitle, no duplicates, no
other app's name, no "free" word, no murder word (MURDER and MURDER_TR from `check-1.6.js`), and for `vi` none of the pairs
sát+nhân, hung+thủ, án+mạng across name, subtitle and keywords.

**Japanese subtitle suggestion (23 characters): 探偵の推理パズル・容疑者から犯人探し・広告なし**
("A detective's deduction puzzle · find the culprit among the suspects · no ads"). Why the data supports it:

- The current subtitle leans on 推理ゲーム, whose top 10 holds a 193,457-rating app at #5; it does not rank us (not in the
  API list), and 犯人探し from the same subtitle does not reach the top 12 either.
- 探偵 is suggestion #2 after one character, its top 10 is the smallest of the big Japanese genre words (111 / 25 / 4 ratings,
  5 under 100), and 8 of those 10 carry it in the name. From the keyword field we are not even in the API's 148 results.
- 容疑者 already ranks #12 from the keyword field; 9 of its top 10 have under 100 ratings and several are photo-maker apps.
- 推理パズル (#4 after 推理) has 5 of 10 under 100 ratings. The new subtitle keeps 推理, 犯人探し and 広告なし, so nothing that
  works now is lost; ゲーム moves to the keyword field (variant B).

No subtitle change is suggested for Korea, Vietnam, Indonesia or Chinese: there the subtitle words themselves (범인 찾기,
game phá án, game misteri) stay outside the top 12, so the data does not show that another
subtitle would do better.

## Dropped terms and why

| Locale | Dropped | Why |
|---|---|---|
| ja | 推理パズル | Covered by 推理 (subtitle) + パズル; Japanese search matches the parts. |
| ja | 論理, 事件 | Covered by 論理的思考 and 事件簿, which contain them. |
| ja | アリバイ | The hint is アリババ (an online shop); its top 10 is off-topic. |
| ko | 탐정게임 | "탐정 게임" is in the subtitle. |
| ko | 논리게임, 두뇌 | Covered by 논리 + 게임 (subtitle) and by 두뇌퍼즐. |
| zh-Hans | 益智, 逻辑 | Covered by 益智游戏, 逻辑推理, 逻辑思维. |
| zh-Hans | 密室 | Locked-room / escape-room genre; does not describe the game. |
| vi | trí, tuệ | game trí tuệ is real but its top 10 runs to 552,409 ratings; no chance, and the space buys tư duy logic. |
| vi | nghi | nghi phạm (suspect) has no hint and an off-topic top 10. |
| id | tebak | Hints are word and picture guessing games. |
| id | siapa | siapa pelaku has no hint; we are #1 only because no other app matches. |
| id | tersangka, petunjuk | No hint for tersangka; petunjuk's hints are "petunjuk arah kiblat" (prayer direction). |
| id | puzzle | English; en-GB already carries "puzzle" in Indonesia. |

Considered and not added: 推理クイズ (the game is a puzzle, not a quiz; 추리퀴즈 stays in Korean because it was already
approved and is a common genre label there), ロジカルシンキング and tes logika (business-skill and IQ-test apps),
推理アドベンチャー (not an adventure game), 숫자 퍼즐 and 数字パズル (no numbers in the game), 스도쿠 클래식 (not classic sudoku),
미궁게임 and 두뇌 트레이닝 (other genres), 크라임씬 and "kriminal case" (a TV show and the app Criminal Case), and 명탐정 스도쿠 as a
phrase (also the name of another Korean app; only the generic word 명탐정 stays).

## Terms I expect the most from

1. **容疑者 (JP, suspect).** Suggestion #3 for 容疑者; we are #12 today from the keyword field alone; 9 of the top 10 under 100
   ratings (55 / 8 / 18), several of them photo-maker apps. With the subtitle suggestion, the most likely new top 10.
2. **探偵 (JP, detective).** Suggestion #2 after one character; the smallest top 10 of the big Japanese genre words (111 / 25 /
   4, 5 under 100). Needs the subtitle suggestion; from the keyword field alone we are not in the API's 148 results.
3. **推理パズル and its family (JP: パズルゲーム 推理, ロジックパズル 推理).** Suggestions #4 for 推理 and #4 and #5 for "推理 ";
   5 to 7 of each top 10 under 100 ratings. Covered by 推理 + パズル (+ ロジック); stronger with パズル in the subtitle.
4. **game investigasi, investigasi, penyelidikan (ID).** Each the #1 or #2 suggestion for its prefix; the top 10 of game
   investigasi is all detective games with 0 / 0 / 0 ratings at #1, #5, #10. New in the field.
5. **tư duy logic (VN, logical thinking).** The #1 suggestion after "tư duy"; 8 of the top 10 under 100 ratings (71 / 25,957 /
   3), mostly brain-training apps. New in the field.

Already working and kept: KR 명탐정 스도쿠 (#3) and 범죄 스도쿠 (#7), VN sudoku thám tử (#1), sudoku trinh thám (#3), sudoku bí
ẩn (#4), ID sudoku misteri (#2), sudoku detektif and sudoku kriminal (#8), JP 数独 犯人 and ナンプレ 探偵 (#4).

## What to watch

- **数独 stays in the Japanese field** as decided in November, although Nikoli claims it as a trademark. Remove it if you want
  to be strict; we then lose *数独 犯人* (#4).
- **en-US counts in Japan.** Any change to the en-US field also changes Japan.
- **Measure again** 7 and 14 days after 1.7.1 goes live: the "works today" rows plus 探偵, 容疑者, 推理パズル, 추리 퍼즐,
  tư duy logic, game investigasi, penyelidikan, with the same web search page.
- **Not known:** search volumes (Apple does not publish them; a hint only shows that a term is typed), how much a keyword
  weighs against downloads and ratings, and Hong Kong's index (only a control search was done).
