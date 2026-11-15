import Foundation
import Security

// What the widget "Zaak van vandaag" knows about the player: the streak, whether today's daily case is solved, and the
// language chosen in the app. This file belongs to both targets: the app writes the state (DailyWidgetPlugin, from the
// values the game keeps in Capacitor Preferences), the widget extension reads it (DailyCaseWidget).
//
// The two processes share one keychain item through the access group in App.entitlements and
// CrimsonLiveActivity.entitlements ($(AppIdentifierPrefix)nl.crimsonledger.shared). That needs no App Group, no new
// App ID capability and no new provisioning profile: every profile of the team already allows "<team>.*" for
// keychain-access-groups (checked 15-11-2026 on "Crimson Ledger App Store" and "Crimson Ledger Live Activity App Store").
// The shared group is the first and only keychain-access-groups entry in both targets, so it is also the default group
// for new items: the code never names the team prefix. Nothing secret is stored; the item is not synchronised.
struct WidgetSharedState: Codable, Equatable {
    var streak: Int = 0         // App.streak.count
    var last: String? = nil     // App.streak.lastDate, as yyyy-MM-dd
    var freezes: Int = 0        // Progress.freezes(): free days that keep a streak over one missed day
    var done: String? = nil     // crimson-board-daily-done (the day the daily case was solved), as yyyy-MM-dd
    var lang: String? = nil     // crimson-lang, the language picked in the app's settings (nil: the device language)

    static let widgetKind = "nl.crimsonledger.daily"
    static let openURL = URL(string: "crimsonledger://daily")!   // CFBundleURLTypes in App/Info.plist

    private static let service = "nl.crimsonledger.widget"
    private static let account = "state"
    private static var base: [String: Any] {
        [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecAttrAccount as String: account]
    }

    static func read() -> WidgetSharedState? {
        var query = base
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne
        var item: CFTypeRef?
        guard SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess, let data = item as? Data else { return nil }
        return try? JSONDecoder().decode(WidgetSharedState.self, from: data)
    }

    // The widget reads while the phone is locked, so the item stays readable after the first unlock.
    @discardableResult
    func write() -> Bool {
        guard let data = try? JSONEncoder().encode(self) else { return false }
        let attributes: [String: Any] = [kSecValueData as String: data, kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock]
        var status = SecItemUpdate(Self.base as CFDictionary, attributes as CFDictionary)
        if status == errSecItemNotFound {
            status = SecItemAdd(Self.base.merging(attributes) { $1 } as CFDictionary, nil)
        }
        return status == errSecSuccess
    }
}

// Days as the game writes them (Progress.dayKey: yyyy-MM-dd in the local time zone), always in the Gregorian calendar
// like JavaScript, also on a phone set to the Buddhist or Japanese calendar.
enum DayKey {
    static var calendar: Calendar {
        var c = Calendar(identifier: .gregorian)
        c.timeZone = .current
        return c
    }

    static func of(_ date: Date, calendar: Calendar = DayKey.calendar) -> String {
        let c = calendar.dateComponents([.year, .month, .day], from: date)
        return String(format: "%04d-%02d-%02d", c.year ?? 0, c.month ?? 0, c.day ?? 0)
    }

    // yyyy-MM-dd → that day at noon (as Progress.dateOf), or nil
    static func date(_ key: String, calendar: Calendar = DayKey.calendar) -> Date? {
        let p = key.split(separator: "-").compactMap { Int($0) }
        guard p.count == 3 else { return nil }
        return calendar.date(from: DateComponents(year: p[0], month: p[1], day: p[2], hour: 12))
    }

    // JavaScript's Date.toDateString(), "Sun Nov 15 2026" (App.streak.lastDate, crimson-board-daily-done) → yyyy-MM-dd
    static func fromJS(_ text: String?) -> String? {
        guard let text = text, !text.isEmpty else { return nil }
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US_POSIX")
        f.calendar = calendar
        f.timeZone = calendar.timeZone
        f.dateFormat = "EEE MMM dd yyyy"
        guard let d = f.date(from: text) else { return nil }
        return of(d)
    }
}
