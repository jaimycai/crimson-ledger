import WidgetKit
import SwiftUI
import ActivityKit
import UIKit
import CoreText

// Widget extension with one Live Activity: the open case ("dossier open") and its end ("Zaak gesloten").
// Design: docs/onderzoek/DYNAMIC-ISLAND-2026-11.md (DI-1, DI-2) and the prototype, section 8.
// The island is always black; the Lock Screen card is a dark, slightly see-through ledger card so the wallpaper
// shows through (glass) and the cream text stays readable in light and dark.
// Apple ignores animation modifiers here: the clock ticks by itself and an update fades/rolls with the system timing.

@main
struct CrimsonLiveActivityBundle: WidgetBundle {
    var body: some Widget {
        CaseLiveActivity()
    }
}

// Colors of the app (DESIGN.md): crimson, gold, paper and ink; the "vault" shades for dark surfaces.
enum Palette {
    static let crimson = Color(red: 0x8B / 255, green: 0x2E / 255, blue: 0x1C / 255)      // #8B2E1C
    static let gold = Color(red: 0xB8 / 255, green: 0x95 / 255, blue: 0x5C / 255)         // #B8955C
    static let goldLight = Color(red: 0xD4 / 255, green: 0xB0 / 255, blue: 0x74 / 255)    // #D4B074, the clock
    static let paper = Color(red: 0xFA / 255, green: 0xF5 / 255, blue: 0xEF / 255)        // #FAF5EF
    static let muted = Color(red: 0xC9 / 255, green: 0xB7 / 255, blue: 0xA4 / 255)        // #C9B7A4
    static let vault = Color(red: 0x14 / 255, green: 0x0B / 255, blue: 0x08 / 255)        // #140B08
}

// Titles in Playfair Display when the extension could load it (the same file as the app, assets/fonts, registered
// through UIAppFonts); otherwise the system serif.
enum Typeface {
    static let playfair = "PlayfairDisplay-Regular"
    static let hasPlayfair = UIFont(name: playfair, size: 12) != nil

    static func title(_ size: CGFloat) -> Font {
        guard hasPlayfair else { return .system(size: size, weight: .bold, design: .serif) }
        // variable font: ask for weight 700 on the wght axis
        let wght = 0x77676874   // 'wght'
        let descriptor = UIFontDescriptor(name: playfair, size: size)
            .addingAttributes([UIFontDescriptor.AttributeName(rawValue: kCTFontVariationAttribute as String): [wght: 700]])
        return Font(UIFont(descriptor: descriptor, size: size) as CTFont)
    }
}

struct CaseLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: CaseActivityAttributes.self) { context in
            LockScreenCard(attributes: context.attributes, state: context.state)
                .activityBackgroundTint(Palette.vault.opacity(0.82))
                .activitySystemActionForegroundColor(Palette.goldLight)
        } dynamicIsland: { context in
            let a = context.attributes, s = context.state
            return DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    WorldBadge(icon: a.icon, closed: s.phase == .closed, size: 44)
                        .padding(.leading, 4)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    ClockOrCount(state: s, size: 24, width: 86)
                        .padding(.trailing, 4)
                }
                // the centre sits under the camera and is narrow: title and world; the long progress line goes below
                DynamicIslandExpandedRegion(.center) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(a.title)
                            .font(Typeface.title(18))
                            .foregroundStyle(Palette.paper)
                            .lineLimit(1)
                            .minimumScaleFactor(0.8)
                        Text(s.phase == .closed ? s.resultText : a.world)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundStyle(Palette.muted)
                            .lineLimit(1)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(spacing: 7) {
                        if s.phase == .closed {
                            HStack {
                                Stamp(text: a.closedText, size: 13)
                                Spacer(minLength: 8)
                                Text(a.world).lineLimit(1)
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundStyle(Palette.muted)
                            }
                        } else {
                            ProgressBar(placed: s.placed, total: s.total, height: 7)
                            HStack(spacing: 8) {
                                Text(s.progressText)
                                    .foregroundStyle(Palette.paper)
                                    .lineLimit(1)
                                    .layoutPriority(1)
                                    .contentTransition(.opacity)
                                Spacer(minLength: 0)
                                Text(a.tapText)
                                    .foregroundStyle(Palette.muted)
                                    .lineLimit(1)
                            }
                            .font(.system(size: 12, weight: .medium))
                        }
                    }
                    .padding(.horizontal, 4)
                    .padding(.top, 6)
                }
            } compactLeading: {
                // iOS 27, island in landscape: only a symbol that fits a 28 pt circle, and nothing on the right
                LimitedWidth(full: HStack(spacing: 4) {
                    Image(systemName: s.phase == .closed ? "checkmark.seal.fill" : "magnifyingglass")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(Palette.goldLight)
                    Text(a.label)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(Palette.paper)
                        .lineLimit(1)
                }
                .padding(.leading, 2), narrow: ProgressRing(placed: s.placed, total: s.total, closed: s.phase == .closed))
            } compactTrailing: {
                LimitedWidth(full: ClockOrCount(state: s, size: 14, width: 46).padding(.trailing, 2), narrow: EmptyView())
            } minimal: {
                ProgressRing(placed: s.placed, total: s.total, closed: s.phase == .closed)
            }
            .keylineTint(Palette.gold)
        }
    }
}

// Picks the narrow variant when iOS 27 says the island has no room to grow (landscape). Older systems and
// compilers before the iOS 27 SDK (Swift 6.4) always get the full variant.
struct LimitedWidth<Full: View, Narrow: View>: View {
    let full: Full
    let narrow: Narrow

    var body: some View {
        #if compiler(>=6.4)
        if #available(iOS 27.0, *) {
            LimitedWidthIOS27(full: full, narrow: narrow)
        } else {
            full
        }
        #else
        full
        #endif
    }
}

#if compiler(>=6.4)
@available(iOS 27.0, *)
private struct LimitedWidthIOS27<Full: View, Narrow: View>: View {
    @Environment(\.isDynamicIslandLimitedInWidth) private var limited
    let full: Full
    let narrow: Narrow

    var body: some View {
        if limited { narrow } else { full }
    }
}
#endif

// The clock, or the count of placed suspects in the quiet mode (clock off) and after the end.
struct ClockOrCount: View {
    let state: CaseActivityAttributes.ContentState
    let size: CGFloat
    let width: CGFloat   // a timer text takes all the room it gets; this keeps the compact island tight

    var body: some View {
        Group {
            if state.phase == .closed {
                Text(state.timeText)
            } else if state.showClock {
                // runs by itself from the wall-clock start of the case, exactly like Board.startTimer
                Text(timerInterval: state.startedAt...Date.distantFuture, countsDown: false)
                    .multilineTextAlignment(.trailing)
            } else {
                Text("\(state.placed)/\(state.total)")
                    .contentTransition(.numericText())
            }
        }
        .font(.system(size: size, weight: .semibold).monospacedDigit())
        .foregroundStyle(Palette.goldLight)
        .lineLimit(1)
        .minimumScaleFactor(0.6)
        .frame(width: width, alignment: .trailing)
    }
}

// Circle in crimson with the world's emoji; after the end a gold seal.
struct WorldBadge: View {
    let icon: String
    let closed: Bool
    let size: CGFloat

    var body: some View {
        ZStack {
            Circle().fill(Palette.crimson)
            Circle().strokeBorder(Palette.gold, lineWidth: 2)
            if closed {
                Image(systemName: "checkmark.seal.fill")
                    .font(.system(size: size * 0.46, weight: .bold))
                    .foregroundStyle(Palette.goldLight)
            } else if icon.isEmpty {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: size * 0.42, weight: .bold))
                    .foregroundStyle(Palette.paper)
            } else {
                Text(icon).font(.system(size: size * 0.48))
            }
        }
        .frame(width: size, height: size)
    }
}

struct ProgressBar: View {
    let placed: Int
    let total: Int
    let height: CGFloat

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(Palette.paper.opacity(0.16))
                Capsule().fill(LinearGradient(colors: [Palette.gold, Palette.goldLight], startPoint: .leading, endPoint: .trailing))
                    .frame(width: max(height, geo.size.width * fraction))
            }
        }
        .frame(height: height)
    }

    private var fraction: CGFloat { total > 0 ? min(1, CGFloat(placed) / CGFloat(total)) : 0 }
}

// Minimal (two activities at once): a value rather than a logo, as Apple asks; the ring is the share of suspects placed.
struct ProgressRing: View {
    let placed: Int
    let total: Int
    let closed: Bool

    var body: some View {
        ZStack {
            Circle().stroke(Palette.gold.opacity(0.28), lineWidth: 3)
            Circle()
                .trim(from: 0, to: closed ? 1 : (total > 0 ? min(1, CGFloat(placed) / CGFloat(total)) : 0))
                .stroke(Palette.goldLight, style: StrokeStyle(lineWidth: 3, lineCap: .round))
                .rotationEffect(.degrees(-90))
            Image(systemName: closed ? "checkmark" : "magnifyingglass")
                .font(.system(size: 9, weight: .heavy))
                .foregroundStyle(Palette.paper)
        }
        .padding(2)
    }
}

// The "Zaak gesloten" stamp: crimson, capitals, slightly turned, as on the results screen.
struct Stamp: View {
    let text: String
    let size: CGFloat

    var body: some View {
        Text(text.uppercased())
            .font(.system(size: size, weight: .black))
            .tracking(1.2)
            .foregroundStyle(Palette.paper)
            .padding(.horizontal, 9)
            .padding(.vertical, 4)
            .background(RoundedRectangle(cornerRadius: 4).fill(Palette.crimson))
            .overlay(RoundedRectangle(cornerRadius: 4).strokeBorder(Palette.paper.opacity(0.35), lineWidth: 1).padding(2))
            .rotationEffect(.degrees(-4))
            .lineLimit(1)
    }
}

// Lock Screen (and StandBy, Watch Smart Stack on older systems): the same information as the expanded island in a card.
struct LockScreenCard: View {
    let attributes: CaseActivityAttributes
    let state: CaseActivityAttributes.ContentState

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(alignment: .center, spacing: 12) {
                WorldBadge(icon: attributes.icon, closed: state.phase == .closed, size: 46)
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(attributes.label) · \(attributes.world)")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(Palette.goldLight)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                    Text(attributes.title)
                        .font(Typeface.title(21))
                        .foregroundStyle(Palette.paper)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                }
                Spacer(minLength: 6)
                ClockOrCount(state: state, size: 26, width: 84)
            }
            if state.phase == .closed {
                HStack(spacing: 10) {
                    Stamp(text: attributes.closedText, size: 12)
                    Text(state.resultText)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(Palette.muted)
                        .lineLimit(1)
                }
            } else {
                ProgressBar(placed: state.placed, total: state.total, height: 6)
                HStack(spacing: 8) {
                    Text(state.progressText)
                        .foregroundStyle(Palette.paper)
                        .lineLimit(1)
                        .layoutPriority(1)
                    Spacer(minLength: 0)
                    Text(attributes.tapText)
                        .foregroundStyle(Palette.muted)
                        .lineLimit(1)
                }
                .font(.system(size: 12, weight: .medium))
            }
        }
        .padding(16)
    }
}
