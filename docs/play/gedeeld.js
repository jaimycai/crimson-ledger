// Gemaakt door build-web-daily.js uit app.js (getDailySeed, getDayNumber) en campaign.js (starsFor). Niet met de hand bewerken.
const DagLogica = {
  getDailySeed(now = new Date()) {
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  },
  getDayNumber(now = new Date()) {
    // Dagen sinds 1 jan 2026 (een ander tijdstip meegeven kan: de meldingen noemen de zaak van die dag)
    const start = new Date(2026, 0, 1);
    return Math.floor((now - start) / 86400000) + 1;
  },
  starsFor(hintsUsed, attempts) {
    if (hintsUsed === 0 && attempts === 0) return 3;
    if (hintsUsed === 0 || attempts === 0) return 2;
    return 1;
  }
};
