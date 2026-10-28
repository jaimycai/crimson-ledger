// Gemaakt door build-web-daily.js uit app.js (getDailySeed, getDayNumber) en campaign.js (starsFor). Niet met de hand bewerken.
const DagLogica = {
  getDailySeed() {
    const now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  },
  getDayNumber() {
    // Dagen sinds 1 jan 2026
    const start = new Date(2026, 0, 1);
    const now = new Date();
    return Math.floor((now - start) / 86400000) + 1;
  },
  starsFor(hintsUsed, attempts) {
    if (hintsUsed === 0 && attempts === 0) return 3;
    if (hintsUsed === 0 || attempts === 0) return 2;
    return 1;
  }
};
