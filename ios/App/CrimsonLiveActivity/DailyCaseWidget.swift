import WidgetKit
import SwiftUI
import UIKit

// Home Screen and Lock Screen widget "Zaak van vandaag" (November 2026): today's daily case (the world's seal in its own
// colours, the title, the world) with the line "Speel de zaak van vandaag", the streak, and a tap that opens the app on
// the daily case (crimsonledger://daily, handled by DailyWidgetPlugin and App.bindWidget).
//
// The cases come from DailyCases.json, made at build time by build-widget.js with the game's own code (App.dailyCase,
// Themes, Progress and the language packs), because the extension cannot run the game's JavaScript. The file covers
// two days back to 400 days ahead; after that the widget counts on with the same rotation (world = day % 24,
// title = day % 30) when the build confirmed that rule. The streak, "solved today" and the language picked in the app
// come from the app through the shared keychain item (WidgetSharedState); without it the widget shows the case only.
//
// Sizes: small and medium on the Home Screen (also StandBy), rectangular on the Lock Screen. Paper in light mode,
// the dark "vault" of the Live Activity in dark mode (DESIGN.md). Titles in Playfair Display (Typeface, shared with
// the Live Activity). The extension targets iOS 16.1; everything newer sits behind #available.

// MARK: - Data from the build

struct DailyCaseData: Decodable {
    struct World: Decodable {
        let id: String
        let icon: String
        let accent: String   // themes.js map.accent: the colour of the world's banner on the world map
        let ring: String     // themes.js map.ring
    }
    struct Lang: Decodable {
        let locale: String           // I18n.LANGS, e.g. "nl-NL", "ar-u-nu-latn"
        let dir: String              // ltr | rtl
        let worlds: [[String]]       // per world: [title, short], in THEMES order
        let titles: [String]         // DAILY_TITLES, translated
        let ui: [String: String]     // the widget's fixed texts (WIDGET_TEKST in build-widget.js)
    }
    let version: String
    let epoch: String        // day 1 of App.getDayNumber
    let rotation: Bool       // every day in `days` follows world = n % worlds, title = n % titles
    let first: String        // the first day in `days`, yyyy-MM-dd
    let days: [[Int]]        // per day from `first`: [world index, title index]
    let worlds: [World]
    let langs: [String: Lang]

    static func bundled() -> DailyCaseData? {
        guard let url = Bundle.main.url(forResource: "DailyCases", withExtension: "json"),
              let data = try? Data(contentsOf: url) else { return nil }
        return try? JSONDecoder().decode(DailyCaseData.self, from: data)
    }
}

struct DailyCaseTexts {
    let name, description, play, solved, tomorrow: String
    private let streakFormat: String

    init(_ ui: [String: String]) {
        // only when DailyCases.json is missing or broken; the build always brings all 20 languages
        name = ui["name"] ?? "Today’s case"
        description = ui["description"] ?? "A new case every day, with your streak."
        play = ui["play"] ?? "Play today’s case"
        solved = ui["solved"] ?? "Solved today"
        tomorrow = ui["tomorrow"] ?? "A new case tomorrow"
        streakFormat = ui["streak"] ?? "Streak: {0}"
    }

    func streak(_ n: Int) -> String { streakFormat.replacingOccurrences(of: "{0}", with: "\(n)") }
}

struct DailyCaseEntry: TimelineEntry {
    let date: Date
    let title: String?     // nil: no case known for this day, the widget only invites to play
    let world: String
    let worldShort: String
    let icon: String
    let accent: Color
    let ring: Color
    let streak: Int        // 0: no living streak to show
    let solved: Bool       // today's daily case is solved
    let dateText: String   // "zondag 15 november", in the widget's language
    let rtl: Bool
    let text: DailyCaseTexts
}

enum DailyCaseStore {
    static var data: DailyCaseData? = DailyCaseData.bundled()

    // The language as App.init picks it: the one chosen in the app, else the first supported device language
    // (Traditional Chinese is skipped, as in I18n.detect), else English.
    static func language(app: String?) -> String {
        guard let langs = data?.langs else { return "en" }
        if let a = app, langs[a] != nil { return a }
        for tag in Locale.preferredLanguages {
            let t = tag.lowercased()
            let code = String(t.prefix { $0 != "-" && $0 != "_" })
            if code == "zh" && (t.contains("hant") || t.contains("-tw") || t.contains("-hk") || t.contains("-mo")) { continue }
            if langs[code] != nil { return code }
        }
        return "en"
    }

    static func texts(_ code: String) -> DailyCaseTexts { DailyCaseTexts(data?.langs[code]?.ui ?? [:]) }

    // [world, title] of the daily case on `date`: from the table, or by the rotation after (or before) it
    static func caseIndex(on date: Date, calendar cal: Calendar = DayKey.calendar) -> (world: Int, title: Int)? {
        guard let d = data, let first = DayKey.date(d.first, calendar: cal) else { return nil }
        let day = cal.startOfDay(for: date)
        let i = cal.dateComponents([.day], from: cal.startOfDay(for: first), to: day).day ?? -1
        if i >= 0, i < d.days.count, d.days[i].count == 2 { return (d.days[i][0], d.days[i][1]) }
        guard d.rotation, let epoch = DayKey.date(d.epoch, calendar: cal), let titles = d.langs["nl"]?.titles.count,
              titles > 0, !d.worlds.isEmpty else { return nil }
        let n = (cal.dateComponents([.day], from: cal.startOfDay(for: epoch), to: day).day ?? 0) + 1
        let mod = { (a: Int, m: Int) in ((a % m) + m) % m }
        return (mod(n, d.worlds.count), mod(n, titles))
    }

    static func entry(for date: Date, state: WidgetSharedState?) -> DailyCaseEntry {
        let cal = DayKey.calendar
        let code = language(app: state?.lang)
        let lang = data?.langs[code]
        var title: String?, world = "", short = "", icon = "", accent = Ledger.crimson, ring = Ledger.gold
        if let d = data, let lang = lang, let c = caseIndex(on: date, calendar: cal),
           c.world < d.worlds.count, c.world < lang.worlds.count, c.title < lang.titles.count {
            title = lang.titles[c.title]
            world = lang.worlds[c.world].first ?? ""
            short = lang.worlds[c.world].last ?? world
            icon = d.worlds[c.world].icon
            accent = Color(hex: d.worlds[c.world].accent) ?? accent
            ring = Color(hex: d.worlds[c.world].ring) ?? ring
        }
        // the streak lives as in App.streakAlive: played today or yesterday, or the day before with a free day left
        let today = DayKey.of(date, calendar: cal)
        let ago = { (n: Int) in DayKey.of(cal.date(byAdding: .day, value: -n, to: date) ?? date, calendar: cal) }
        var streak = 0
        if let s = state, s.streak > 0, let last = s.last,
           last == today || last == ago(1) || (last == ago(2) && s.freezes > 0) { streak = s.streak }
        let f = DateFormatter()
        f.locale = Locale(identifier: lang?.locale ?? "en-GB")
        f.calendar = cal
        f.timeZone = cal.timeZone
        f.setLocalizedDateFormatFromTemplate("EEEEdMMMM")
        return DailyCaseEntry(date: date, title: title, world: world, worldShort: short, icon: icon, accent: accent, ring: ring,
                              streak: streak, solved: state?.done == today, dateText: f.string(from: date),
                              rtl: lang?.dir == "rtl", text: DailyCaseTexts(lang?.ui ?? [:]))
    }
}

// MARK: - Timeline

struct DailyCaseProvider: TimelineProvider {
    func placeholder(in context: Context) -> DailyCaseEntry { DailyCaseStore.entry(for: Date(), state: nil) }

    func getSnapshot(in context: Context, completion: @escaping (DailyCaseEntry) -> Void) {
        completion(DailyCaseStore.entry(for: Date(), state: WidgetSharedState.read()))
    }

    // Now, and every midnight of the next three days: a new case each day, and "solved" or the streak run out by
    // themselves. The app asks for a reload when the player's state changes (DailyWidgetPlugin).
    func getTimeline(in context: Context, completion: @escaping (Timeline<DailyCaseEntry>) -> Void) {
        let state = WidgetSharedState.read(), now = Date(), cal = DayKey.calendar
        var dates = [now], day = cal.startOfDay(for: now)
        for _ in 0..<3 {
            guard let next = cal.date(byAdding: .day, value: 1, to: day) else { break }
            day = next
            dates.append(day)
        }
        completion(Timeline(entries: dates.map { DailyCaseStore.entry(for: $0, state: state) }, policy: .atEnd))
    }
}

struct DailyCaseWidget: Widget {
    var body: some WidgetConfiguration {
        let text = DailyCaseStore.texts(DailyCaseStore.language(app: WidgetSharedState.read()?.lang))
        return StaticConfiguration(kind: WidgetSharedState.widgetKind, provider: DailyCaseProvider()) { entry in
            DailyCaseWidgetView(entry: entry)
        }
        .configurationDisplayName(text.name)
        .description(text.description)
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular])
    }
}

// MARK: - Views

// Paper (the app) and vault (the Live Activity, video) from DESIGN.md
enum Ledger {
    static let paper = Color(red: 0xFA / 255, green: 0xF5 / 255, blue: 0xEF / 255)       // #FAF5EF
    static let paper2 = Color(red: 0xF3 / 255, green: 0xED / 255, blue: 0xE3 / 255)      // #F3EDE3
    static let ink = Color(red: 0x2C / 255, green: 0x18 / 255, blue: 0x10 / 255)         // #2C1810
    static let ink2 = Color(red: 0x5A / 255, green: 0x3E / 255, blue: 0x2B / 255)        // #5A3E2B
    static let inkLight = Color(red: 0x6B / 255, green: 0x54 / 255, blue: 0x45 / 255)    // #6B5445
    static let crimson = Color(red: 0x8B / 255, green: 0x2E / 255, blue: 0x1C / 255)     // #8B2E1C
    static let gold = Color(red: 0xB8 / 255, green: 0x95 / 255, blue: 0x5C / 255)        // #B8955C
    static let vault = Color(red: 0x14 / 255, green: 0x0B / 255, blue: 0x08 / 255)       // #140B08
    static let vault2 = Color(red: 0x2A / 255, green: 0x18 / 255, blue: 0x10 / 255)      // #2A1810
    static let cream = Color(red: 0xFA / 255, green: 0xF5 / 255, blue: 0xEF / 255)       // #FAF5EF
    static let muted = Color(red: 0xC9 / 255, green: 0xB7 / 255, blue: 0xA4 / 255)       // #C9B7A4
    static let goldBright = Color(red: 0xE8 / 255, green: 0xBE / 255, blue: 0x78 / 255)  // #E8BE78
    static let red = Color(red: 0xC4 / 255, green: 0x3E / 255, blue: 0x26 / 255)         // #C43E26

    struct Tones {
        let text, text2, muted, accent, onAccent, rule, chip: Color
    }
    static func tones(_ scheme: ColorScheme) -> Tones {
        scheme == .dark
            ? Tones(text: cream, text2: cream.opacity(0.86), muted: muted, accent: red, onAccent: cream, rule: goldBright.opacity(0.35), chip: cream.opacity(0.1))
            : Tones(text: ink, text2: ink2, muted: inkLight, accent: crimson, onAccent: paper, rule: gold.opacity(0.45), chip: crimson.opacity(0.08))
    }
}

struct DailyCaseWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: DailyCaseEntry

    var body: some View {
        DailyCaseContent(entry: entry, family: family)
            .widgetURL(WidgetSharedState.openURL)
            .ledgerContainer(family)
    }
}

// The content of one size, without the container background (DailyCaseBackground), so a snapshot can draw it too.
struct DailyCaseContent: View {
    let entry: DailyCaseEntry
    let family: WidgetFamily

    var body: some View {
        Group {
            switch family {
            case .systemMedium: DailyCaseMedium(entry: entry)
            case .accessoryRectangular: DailyCaseRectangular(entry: entry)
            default: DailyCaseSmall(entry: entry)
            }
        }
        .environment(\.layoutDirection, entry.rtl ? .rightToLeft : .leftToRight)
    }
}

// Paper with a gold double rule like a ledger page; in dark mode the vault with a warm glow.
struct DailyCaseBackground: View {
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        ZStack {
            if scheme == .dark {
                RadialGradient(colors: [Ledger.vault2, Ledger.vault], center: .topLeading, startRadius: 10, endRadius: 320)
            } else {
                LinearGradient(colors: [Ledger.paper, Ledger.paper2], startPoint: .top, endPoint: .bottom)
            }
            ContainerRelativeShape()
                .inset(by: 5)
                .strokeBorder(Ledger.tones(scheme).rule, lineWidth: 0.75)
        }
    }
}

extension View {
    // iOS 17 and newer want containerBackground (with system margins); iOS 16 gets the same look with its own padding.
    @ViewBuilder
    func ledgerContainer(_ family: WidgetFamily) -> some View {
        if family == .accessoryRectangular {
            if #available(iOS 17.0, *) { containerBackground(for: .widget) { Color.clear } } else { self }
        } else {
            if #available(iOS 17.0, *) {
                containerBackground(for: .widget) { DailyCaseBackground() }
            } else {
                padding(16).background(DailyCaseBackground())
            }
        }
    }
}

// The world's seal: its map colours (accent with the ring), the emoji in the middle; the same badge as the Live Activity.
struct WorldSeal: View {
    let entry: DailyCaseEntry
    let size: CGFloat

    var body: some View {
        ZStack {
            Circle().fill(LinearGradient(colors: [entry.accent.opacity(0.88), entry.accent], startPoint: .top, endPoint: .bottom))
            Circle().strokeBorder(entry.ring, lineWidth: max(1.5, size * 0.055))
            if entry.icon.isEmpty {
                Image(systemName: "magnifyingglass").font(.system(size: size * 0.42, weight: .bold)).foregroundStyle(Ledger.cream)
            } else {
                Text(entry.icon).font(.system(size: size * 0.5))
            }
        }
        .frame(width: size, height: size)
        .widgetAccentable()
        .accessibilityHidden(true)
    }
}

// The medium widget's banner: the world's colour as on the world map, a ring inside, the emoji large.
struct WorldBanner: View {
    let entry: DailyCaseEntry

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(LinearGradient(colors: [entry.accent.opacity(0.82), entry.accent], startPoint: .top, endPoint: .bottom))
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .inset(by: 5)
                .strokeBorder(entry.ring.opacity(0.85), lineWidth: 1.5)
            if entry.icon.isEmpty {
                Image(systemName: "magnifyingglass").font(.system(size: 34, weight: .bold)).foregroundStyle(Ledger.cream)
            } else {
                Text(entry.icon).font(.system(size: 46))
            }
        }
        .widgetAccentable()
        .accessibilityHidden(true)
    }
}

struct StreakChip: View {
    @Environment(\.colorScheme) private var scheme
    let entry: DailyCaseEntry
    let size: CGFloat

    var body: some View {
        let tone = Ledger.tones(scheme)
        HStack(spacing: 3) {
            Image(systemName: "flame.fill").foregroundStyle(entry.solved ? Ledger.gold : tone.accent)
            Text("\(entry.streak)").foregroundStyle(tone.text).monospacedDigit()
        }
        .font(.system(size: size, weight: .bold))
        .padding(.horizontal, size * 0.6)
        .padding(.vertical, size * 0.3)
        .background(Capsule().fill(tone.chip))
        .environment(\.layoutDirection, .leftToRight)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(entry.text.streak(entry.streak))
    }
}

struct SolvedLine: View {
    @Environment(\.colorScheme) private var scheme
    let entry: DailyCaseEntry
    let size: CGFloat
    let withTomorrow: Bool

    var body: some View {
        let tone = Ledger.tones(scheme)
        HStack(alignment: .center, spacing: 6) {
            Image(systemName: "checkmark.seal.fill").font(.system(size: size * 1.35, weight: .semibold)).foregroundStyle(Ledger.gold)
            VStack(alignment: .leading, spacing: 1) {
                Text(entry.text.solved).font(.system(size: size, weight: .semibold)).foregroundStyle(tone.text2)
                if withTomorrow {
                    Text(entry.text.tomorrow).font(.system(size: size * 0.92, weight: .medium)).foregroundStyle(tone.muted)
                }
            }
            .lineLimit(1)
            .minimumScaleFactor(0.75)
        }
    }
}

struct DailyCaseSmall: View {
    @Environment(\.colorScheme) private var scheme
    let entry: DailyCaseEntry

    var body: some View {
        let tone = Ledger.tones(scheme)
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top, spacing: 4) {
                WorldSeal(entry: entry, size: 38)
                Spacer(minLength: 4)
                if entry.streak > 0 { StreakChip(entry: entry, size: 12) }
            }
            Spacer(minLength: 6)
            Text(entry.title ?? entry.text.name)
                .font(Typeface.title(19))
                .foregroundStyle(tone.text)
                .lineLimit(2)
                .minimumScaleFactor(0.7)
                .widgetAccentable()
            if !entry.worldShort.isEmpty {
                Text(entry.worldShort)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(tone.muted)
                    .lineLimit(1)
                    .padding(.top, 2)
            }
            Spacer(minLength: 6)
            if entry.solved {
                SolvedLine(entry: entry, size: 12, withTomorrow: false)
            } else {
                Text(entry.text.play)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(tone.accent)
                    .lineLimit(2)
                    .minimumScaleFactor(0.8)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

struct DailyCaseMedium: View {
    @Environment(\.colorScheme) private var scheme
    let entry: DailyCaseEntry

    var body: some View {
        let tone = Ledger.tones(scheme)
        HStack(spacing: 14) {
            WorldBanner(entry: entry).frame(width: 96)
            VStack(alignment: .leading, spacing: 0) {
                HStack(alignment: .center, spacing: 6) {
                    Text(entry.dateText)
                        .font(.system(size: 11, weight: .semibold))
                        .textCase(.uppercase)
                        .foregroundStyle(tone.accent)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                    Spacer(minLength: 4)
                    if entry.streak > 0 { StreakChip(entry: entry, size: 12) }
                }
                Spacer(minLength: 4)
                Text(entry.title ?? entry.text.name)
                    .font(Typeface.title(22))
                    .foregroundStyle(tone.text)
                    .lineLimit(2)
                    .minimumScaleFactor(0.7)
                    .widgetAccentable()
                if !entry.world.isEmpty {
                    Text(entry.world)
                        .font(.system(size: 12.5, weight: .medium))
                        .foregroundStyle(tone.muted)
                        .lineLimit(1)
                        .minimumScaleFactor(0.85)
                        .padding(.top, 2)
                }
                Spacer(minLength: 8)
                if entry.solved {
                    SolvedLine(entry: entry, size: 12.5, withTomorrow: true)
                } else {
                    Text(entry.text.play)
                        .font(.system(size: 12.5, weight: .semibold))
                        .foregroundStyle(tone.onAccent)
                        .lineLimit(1)
                        .minimumScaleFactor(0.7)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(Capsule().fill(tone.accent))
                        .widgetAccentable()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        }
    }
}

// Lock Screen: the system tints it, so no colours of our own; the title stands out in Playfair.
struct DailyCaseRectangular: View {
    let entry: DailyCaseEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 1) {
            HStack(spacing: 4) {
                Image(systemName: "magnifyingglass").font(.system(size: 11, weight: .bold))
                Text(entry.worldShort.isEmpty ? entry.text.name : entry.worldShort)
                    .font(.system(size: 12, weight: .semibold))
                    .lineLimit(1)
                Spacer(minLength: 2)
                if entry.streak > 0 {
                    HStack(spacing: 2) {
                        Image(systemName: "flame.fill")
                        Text("\(entry.streak)").monospacedDigit()
                    }
                    .font(.system(size: 12, weight: .bold))
                    .environment(\.layoutDirection, .leftToRight)
                    .accessibilityElement(children: .ignore)
                    .accessibilityLabel(entry.text.streak(entry.streak))
                }
            }
            Text(entry.title ?? entry.text.name)
                .font(Typeface.title(17))
                .lineLimit(1)
                .minimumScaleFactor(0.75)
                .widgetAccentable()
            Text(entry.solved ? "✓ " + entry.text.solved : entry.text.play)
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(.secondary)
                .lineLimit(1)
                .minimumScaleFactor(0.8)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

private extension Color {
    // "#8B2E1C" → Color
    init?(hex: String) {
        let s = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        guard s.count == 6, let v = UInt32(s, radix: 16) else { return nil }
        self.init(red: Double((v >> 16) & 0xFF) / 255, green: Double((v >> 8) & 0xFF) / 255, blue: Double(v & 0xFF) / 255)
    }
}
