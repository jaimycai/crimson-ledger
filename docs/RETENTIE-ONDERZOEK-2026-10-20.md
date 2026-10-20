# Crimson Ledger: onboarding and retention research (20-10-2026)

Labels: [S] strong (primary data or the product itself), [M] medium (credible outlet, or developer talk with numbers), [W] weak (blog, vendor or anecdote).

## 0. Your numbers
- The sample is small. With 63 players, D1 25% has a 95% interval of about 14–36%, and D7 5% is about 3 people. Seeing D1 move from 25% to 35% would take about 330 players per arm. Steer on first-session steps first.
- Your case percentages are cumulative reach, so churn and failure are mixed.
- The biggest leak is from practice done (70%) to case 1 solved (48%), right where guidance stops. The largest relative drop typically comes at the end of a tutorial: alexandremacmillan.com/2018/11/28/optimizing-your-tutorial-and-your-first-session/ [W]

## 1. First-session flows of comparable apps
- **LinkedIn Queens/Zip/Tango** (linkedin.com/help/linkedin/answer/a6296670 and /a6269510 [S])
  - About 2 taps from the hub to the puzzle; guests can play.
  - No up-front notification ask. The "Keep your streak" toggle sits on the streak card of the results page.
  - A freeze is earned after 5 wins (max 2, applied automatically).
  - After a win: your time vs. your company and CEOs, share, next game. No paywall.
- **NYT Games** (uiland.design/screens/nyt-games/screens/7303e1b0-c20a-4e3b-ac60-f64df3d1436c/flows/onboarding [S]; help.nytimes.com [S])
  - About 15 screens to the first puzzle: account, 7-day trial, notification soft ask, ATT, terms, then How to Play.
  - Notification ask right after the trial starts: "Enable notifications to be reminded before your trial ends."
  - Per-game streaks, no freeze. After a solve: [Share Your Score] [Play Spelling Bee].
- **Duolingo** (botsi.com/resources/flows/apps/duolingo [S]; pageflows.com/post/ios/onboarding/duolingo/ [S])
  - 22–25 screens to the first exercise, including a daily-goal picker ("I'm committed").
  - Notification primer: "I'll remind you to practice so it becomes a habit!" Timing differs by build: before lesson 1 in one, after lesson 2 in another.
  - The paywall now comes before lesson 1.
- **Elevate and Lumosity** (botsi.com/resources/flows/apps/elevate [S]; screensdesign.com/apps/lumosity-brain-training/ [S])
  - Order: surveys, test game, score, paywall, notification ask ("Reminders help you build good habits"), widget offer.
  - Elevate grants 2 freezes at account creation (support.elevateapp.com [S]).
- **Block Blast**: a cold notification prompt at step 2 and about 4 screens to the board. appsroo.com/apps/1617391485/block-blast [S]
- **Puzzmo**: opens straight on Today, with no wall. Push is opt-in in settings only. A lost streak comes back after 3 days of play. blog.puzzmo.com/posts/2026/10/19/daily-challenge-release/ [S]
- **Clues by Sam and Murdle**: the daily puzzle sits on the home page. Murdle says "New to Murdle? Try the daily mini first!" Clues by Sam shows a speed percentile and an emoji share after the solve. Neither sends push. cluesbysam.com, murdle.com [S]
- **Murdoku-likes**
  - Murder Sudoku: Tiny Crimes is testing tutorial-first onboarding and an arrow to the Daily Challenge while it waits.
  - Whodoku's home has a daily card with week dots, "Streak 0 days" and PLAY CASE.
  - Sources: apps.apple.com/us/app/id6776382837 and /id6787716218 [S]
- **Enigmic**: asks for a rating after every solve, including the first; the developer admits it "is clearly getting in the way". play.google.com/store/apps/details?id=com.tangramgamestudio.enigmic [M]
- **Unverified**: Royal Match, Two Dots and Good Sudoku. No free flow library covers them.

**Pattern:** free daily-puzzle apps put the puzzle 0–2 taps away and offer a reminder after a win, tied to the streak. The long flows (NYT, Duolingo, Elevate) exist to sell subscriptions.

## 2. Benchmarks
| Source | D1 | D7 | D28/30 |
|---|---|---|---|
| GameAnalytics puzzle median, 2024 | 19.7–20.7% | 4.3–4.8% | 1.1–1.3% |
| GameAnalytics puzzle top 25%, North America, Q1 2024 | 32.4% | 11.7% | 4.5% |
| GameAnalytics all genres P50/P75/P90, 2025 | 22/30/40% | 4/6–7/11–12% | 0.7% (P50) |
| Adjust puzzle, 2024 | 20% | 7% | 2% |
| AppsFlyer puzzle, Q3 2022 | 31.9% | 12.2% | 5.4% |

Sources by row:
- gameanalytics.com/reports/2025-mobile-gaming-benchmarks [S]
- investgame.net/wp-content/uploads/2024/06/gameanalytics-q1-2024-mobile-games-benchmarks.pdf [S]
- gameanalytics.com/reports/2026-mobile-pc-gaming-benchmarks [S]
- adjust.com/blog/puzzle-games-trends-strategies/ [S]
- business.mistplay.com/resources/mobile-game-retention-benchmarks [M]

The "40/20/10" rule is folklore (gamedeveloper.com/business/5-metrics-every-mobile-game-developer-must-track [W]). Sensor Tower's numbers are paywalled.

**Verdict:** your D1 is above the puzzle median but below the top quartile. Your D7 is at the median; the top quartile's D7 is about twice yours.

## 3. Tactics with measured effects
- **Get into play sooner**
  - Moving Duolingo's sign-up back a few steps gave about +20% DAU: review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker/ [M]
  - Product tours: 72% complete a 3-step tour, 16% a 7-step one (SaaS data): chameleon.io/blog/mastering-product-tours [M]
- **Early wins**
  - EA's difficulty adjustment in a match-3 game added up to 9% engagement: archives.iw3c2.org/www2017/proceedings/companion/p465.pdf [S]
  - More day-0 wins went with higher D1; fixing the early win rate added 5 points of D1: developers.meta.com/horizon/blog/build-faster-earn-more-how-to-get-started-with-in-game-analytics/ [M]
  - LinkedIn targets a 60–70% first-time win rate (Naavik interview): gameindustrylibrary.com [M]
- **Asking for notifications**
  - Apple advises asking in context, not at launch. "Provisional" authorization delivers notifications quietly with no prompt: developer.apple.com/documentation/usernotifications/asking-permission-to-use-notifications [S]
  - Moving the ask to a reward moment behind an in-app soft ask doubled opt-in from 25% to 50%: medium.com/flaregames-blog/encouraging-mobile-gamers-to-opt-in-for-push-notifications-3dde706bc8c7 [M]
  - Habit-framed copy gave +5% opt-ins: blog.duolingo.com/putting-in-work-the-habit-of-language-learning/ [M]
  - Games average 20.6% iOS opt-in: onesignal.com/mobile-app-benchmarks-2024 [M]
- **Reminders**
  - Optimized reminder copy gave new users +2.2% D1 and +2.0% D7 retention; fresh templates beat repeated ones: research.duolingo.com/papers/yancey.kdd20.pdf [S]
  - Duolingo schedules the next reminder 23.5 hours after the last session, which beats a user-chosen time. It sends one per missed day, up to 7, and days 3–4 are decisive: subclub.com/episode/how-to-time-reactivation-campaigns-for-maximum-impact-jackson-shuttleworth-duolingo [M]
  - A 10 pm "streak saver" is perceived as positive: lennysnewsletter.com/p/behind-the-product-duolingo-streaks [M]
- **Streaks** (same Duolingo interview [M])
  - 2 free freezes at streak start was "one of our biggest wins".
  - 2 freezes beat 1, and 3 were no better.
  - A streak takes about 7 days to lock in.
  - Changing the button copy to "Commit to my goal" was a "massive win".
  - Earning back a lost streak worked better than paying to repair it.
- **More streak evidence**
  - Allowing 2 equipped freezes gave +0.38% DAU; a streak animation gave +1.7% D7 for new learners: blog.duolingo.com/how-duolingo-streak-builds-habit/ [M]
  - Highlighting a broken streak lowers engagement, and a repair option softens that: doi.org/10.1093/jcr/ucac029 [S]
- **Sharing**: 40% of LinkedIn's daily players arrive via someone's share, and 80% of a day's players return the next day: linkedin.com/pulse/hello-tango-introducing-our-newest-daily-logic-game-somasundaram-6zszf [S]
- **Widget**: users retain "far better", controlled for commitment, but no number is given. It works best promoted after a lesson: blog.duolingo.com/widget-feature/ [M]

## 4. Recommendations (by impact and effort)
1. **One tap from practice into case 1** (D1 high, effort low)
   - The practice results screen gets one primary button, "Next case: Het glas Bordeaux →"; the world map becomes a text link.
   - Merge the part splash, briefing and new-clue-type modals into one card on the board: Van Dam's line, the one new clue type, [Start]. The code is the chain from startCampaignCase to showPartSplash, showBriefing and Board.showIntro in app.js (around lines 386–406).
   - Keep the full part splash from part II onwards.
   - Target: at least 60% of new players solve case 1.
2. **Make cases 1–3 near-certain wins** (D1 high, effort low to medium)
   - Log start, solve and abandon for each case.
   - Targets: 90% or more of case-1 starters solve it, and 70% or more for cases 2–3.
   - Give a free "Stuck?" hint after about 60 seconds of idling in cases 1–3, outside the 3-per-day allowance.
3. **Reminder soft ask after the first campaign win** (D1 and D7 high, effort low)
   - Copy: "Want a nudge tomorrow? One reminder a day when your new case is ready." [Remind me] [Not now]
   - Only [Remind me] triggers the iOS prompt.
   - Offer it again after the first daily case and on streak day 2: at most 3 times, never twice in one session.
   - Keep @capacitor/local-notifications on 7.x (now 7.0.7). From 8.3.0, schedule() requests permission by itself: capacitorjs.com/docs/apis/local-notifications [S]
   - Provisional authorization would need a small native patch.
4. **Schedule a series, not one notification** (D7 high, effort low)
   - scheduleReminder() (app.js around line 755) plans one notification and only replans when the app opens. A player who lapses gets one nudge, then silence.
   - Plan days 1, 2, 3, 5 and 7 at once, keeping the usual-hour logic, and cancel them on open.
   - Add a 21:30 streak saver when the streak is 2 or more and today's case is still open.
   - Rotate 5–8 texts that name the case or a suspect. Stop after day 7.
5. **A streak from day 1 with two free days** (D7 medium-high, effort low)
   - New players start with 0 free days (progress.js around line 102). Grant 2 when the streak starts.
   - After the first daily case, show "Commit to 7 days, unlock a gift world" with [Commit to my goal] [Maybe later].
   - Earn-back: solving today and tomorrow restores a lost streak.
   - Show a "Day 1" animation with a haptic.
6. **End every win with tomorrow** (D1 medium, effort low)
   - The results screen shows: "Case closed", the streak, "Next daily case in 7 h 12 m", [Next case], and [Share] with a spoiler-free emoji grid.
7. **Daily case card on the map from session 1** (effort low): "Today's case · Streak 0 days · PLAY" (Whodoku), plus an arrow while it waits (Tiny Crimes).
8. **Widget later** (D7 medium, effort high, needs native WidgetKit). Offer it after a solve.

## What NOT to do
- No cold notification prompt at first launch (Apple [S]).
- No account wall, paywall or ATT prompt before case 1.
- No rating prompt after case 1 (Enigmic [M]); ask after a 3-day streak.
- Don't highlight broken streaks, and don't give 3 or more free days (JCR [S], Duolingo [M]).
- Don't lengthen the practice case; make the first cases easier instead.
- No reminders after day 7, and don't benchmark yourself against 40/20/10.
