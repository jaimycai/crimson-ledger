import Foundation
import ActivityKit

// The data of one Live Activity: a case that is open ("dossier open", DI-1) or just solved ("Zaak gesloten", DI-2).
// This file belongs to both targets: the app (LiveActivityPlugin starts, updates and ends the activity) and the widget
// extension (CrimsonLiveActivity draws it). Every text arrives already translated from the game (app.js), so the
// extension has no strings of its own. Together the fixed and the changing part stay far below Apple's 4 KB limit.
@available(iOS 16.1, *)
struct CaseActivityAttributes: ActivityAttributes {
    enum Phase: String, Codable, Hashable {
        case open     // the case is being played: the clock runs by itself (Text(timerInterval:))
        case closed   // solved: the stamp, the time; stays on the Lock Screen for 20 minutes
    }

    struct ContentState: Codable, Hashable {
        var phase: Phase
        var placed: Int           // suspects on the board
        var total: Int            // suspects in the case
        var progressText: String  // "3 van 5 verdachten geplaatst"
        var startedAt: Date       // wall-clock start of the case clock (Board.startTime)
        var showClock: Bool       // false in the quiet mode (Settings › clock during a case off)
        var timeText: String      // closed: "08:41"
        var resultText: String    // closed: "Opgelost in 08:41"
    }

    var caseId: String      // Board.resumeId(): "c:landhuis-1:6", "d:…", "w:…"
    var kind: String        // campaign | daily | weekly | archive
    var label: String       // short: "Zaak 7", "Week 45", "Vandaag"
    var title: String       // "Het testament"
    var world: String       // "Het Landhuis"
    var icon: String        // the world's emoji, "🏚️"
    var tapText: String     // "Tik om verder te spelen"
    var closedText: String  // "Zaak gesloten"
}
