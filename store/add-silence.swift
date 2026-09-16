// Zet een stille geluidsspoor in een app-preview. App Store Connect weigert een
// video zonder geluidsspoor met "Your app preview contains unsupported or
// corrupted audio", ook als de video bewust stil is.
// Gebruik: swift store/add-silence.swift <in.mp4> <uit.mp4>
import AVFoundation
import Foundation

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("gebruik: add-silence.swift <in.mp4> <uit.mp4>\n".data(using: .utf8)!)
    exit(2)
}
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
let video = AVURLAsset(url: input)
let duration = video.duration
let seconds = CMTimeGetSeconds(duration)

// 1. stil AAC-bestand van dezelfde lengte schrijven
let silence = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("crimson-stilte-\(UUID().uuidString).m4a")
let settings: [String: Any] = [
    AVFormatIDKey: kAudioFormatMPEG4AAC,
    AVSampleRateKey: 44100.0,
    AVNumberOfChannelsKey: 2,
    AVEncoderBitRateKey: 128_000
]
// in een eigen functie, zodat AVAudioFile sluit en het bestand op schijf staat
// voordat het weer ingelezen wordt
func writeSilence(_ url: URL, _ seconds: Double) throws {
    let file = try AVAudioFile(forWriting: url, settings: settings)
    let format = file.processingFormat
    let chunk: AVAudioFrameCount = 44100
    var written = 0.0
    while written < seconds + 0.5 {
        guard let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: chunk) else { break }
        buffer.frameLength = chunk
        if let data = buffer.floatChannelData {
            for channel in 0..<Int(format.channelCount) {
                memset(data[channel], 0, Int(chunk) * MemoryLayout<Float>.size)
            }
        }
        try file.write(from: buffer)
        written += Double(chunk) / format.sampleRate
    }
}
try writeSilence(silence, seconds)
let audio = AVURLAsset(url: silence)
guard audio.tracks(withMediaType: .audio).first != nil else {
    FileHandle.standardError.write("stil geluidsbestand heeft geen spoor: \(silence.path)\n".data(using: .utf8)!)
    exit(1)
}

// 2. beeld en geluid samenvoegen
let composition = AVMutableComposition()
guard let videoTrack = video.tracks(withMediaType: .video).first,
      let compVideo = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid),
      let audioTrack = audio.tracks(withMediaType: .audio).first,
      let compAudio = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)
else {
    FileHandle.standardError.write("spoor niet gevonden\n".data(using: .utf8)!)
    exit(1)
}
let range = CMTimeRange(start: .zero, duration: duration)
try compVideo.insertTimeRange(range, of: videoTrack, at: .zero)
compVideo.preferredTransform = videoTrack.preferredTransform
try compAudio.insertTimeRange(range, of: audioTrack, at: .zero)

// 3. wegschrijven zonder het beeld opnieuw te coderen
try? FileManager.default.removeItem(at: output)
guard let export = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetPassthrough) else {
    FileHandle.standardError.write("export kon niet starten\n".data(using: .utf8)!)
    exit(1)
}
export.outputURL = output
export.outputFileType = .mp4
let done = DispatchSemaphore(value: 0)
export.exportAsynchronously { done.signal() }
done.wait()
try? FileManager.default.removeItem(at: silence)
if export.status == .completed {
    let check = AVURLAsset(url: output)
    let a = check.tracks(withMediaType: .audio).count
    let v = check.tracks(withMediaType: .video).first!
    print("klaar: \(output.lastPathComponent) — \(Int(v.naturalSize.width))x\(Int(v.naturalSize.height)), \(String(format: "%.1f", CMTimeGetSeconds(check.duration)))s, geluidssporen: \(a)")
} else {
    FileHandle.standardError.write("mislukt: \(export.error?.localizedDescription ?? "onbekend")\n".data(using: .utf8)!)
    exit(1)
}
