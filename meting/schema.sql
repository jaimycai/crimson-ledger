-- One row per (day, event, detail, number, platform, language, version) with a counter.
-- No user id, no device id, no IP address, no timestamp finer than the day.
CREATE TABLE IF NOT EXISTS tel (
  day TEXT NOT NULL, e TEXT NOT NULL, a TEXT NOT NULL, n INTEGER NOT NULL,
  p TEXT NOT NULL, l TEXT NOT NULL, v TEXT NOT NULL, c INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, e, a, n, p, l, v)
);

-- Feedback from Settings → "Wat kan beter?" (1.3.1): the text the player typed, with the day, platform, language and
-- app version. No user id, no IP address. The Worker accepts at most 300 messages a day.
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT, day TEXT NOT NULL, p TEXT NOT NULL, l TEXT NOT NULL, v TEXT NOT NULL, t TEXT NOT NULL
);
