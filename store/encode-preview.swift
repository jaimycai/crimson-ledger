// Maakt van de beelden uit store/make-preview.js één H.264-bestand dat
// App Store Connect als app-preview accepteert (1290×2796, 30 beelden per
// seconde). Gebruik: swift store/encode-preview.swift <map> <uit.mp4> [fps]
import AVFoundation
import CoreGraphics
import Foundation
import ImageIO

struct Frame { let file: String; let t: Double }

let args = CommandLine.arguments
guard args.count >= 3 else { FileHandle.standardError.write("gebruik: encode-preview.swift <map> <uit.mp4> [fps]\n".data(using: .utf8)!); exit(2) }
let dir = URL(fileURLWithPath: args[1])
let out = URL(fileURLWithPath: args[2])
let fps = args.count > 3 ? Int32(args[3]) ?? 30 : 30

let manifestData = try Data(contentsOf: dir.appendingPathComponent("frames.json"))
let manifest = try JSONSerialization.jsonObject(with: manifestData) as! [String: Any]
let width = manifest["width"] as! Int
let height = manifest["height"] as! Int
let raw = manifest["frames"] as! [[String: Any]]
let frames: [Frame] = raw.map { Frame(file: $0["file"] as! String, t: $0["t"] as! Double) }
guard let last = frames.last else { FileHandle.standardError.write("geen beelden\n".data(using: .utf8)!); exit(1) }

try? FileManager.default.removeItem(at: out)
let writer = try AVAssetWriter(outputURL: out, fileType: .mp4)
let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 14_000_000,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoMaxKeyFrameIntervalKey: fps
    ]
]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA),
    kCVPixelBufferWidthKey as String: width,
    kCVPixelBufferHeightKey as String: height
])
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

func image(_ name: String) -> CGImage? {
    let url = dir.appendingPathComponent(name)
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(src, 0, nil)
}

func buffer(_ cg: CGImage) -> CVPixelBuffer? {
    var pb: CVPixelBuffer?
    CVPixelBufferCreate(kCFAllocatorDefault, width, height, kCVPixelFormatType_32BGRA, [
        kCVPixelBufferCGImageCompatibilityKey: true,
        kCVPixelBufferCGBitmapContextCompatibilityKey: true
    ] as CFDictionary, &pb)
    guard let pixel = pb else { return nil }
    CVPixelBufferLockBaseAddress(pixel, [])
    defer { CVPixelBufferUnlockBaseAddress(pixel, []) }
    guard let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pixel), width: width, height: height,
                              bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pixel),
                              space: CGColorSpaceCreateDeviceRGB(),
                              bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)
    else { return nil }
    ctx.setFillColor(CGColor(red: 0, green: 0, blue: 0, alpha: 1))
    ctx.fill(CGRect(x: 0, y: 0, width: width, height: height))
    ctx.draw(cg, in: CGRect(x: 0, y: 0, width: width, height: height))
    return pixel
}

let total = Int((last.t * Double(fps)).rounded()) + 1
var source = 0
var cached: (Int, CVPixelBuffer)? = nil
var written = 0
let queue = DispatchQueue(label: "encode")
let done = DispatchSemaphore(value: 0)

input.requestMediaDataWhenReady(on: queue) {
    while input.isReadyForMoreMediaData {
        if written >= total { input.markAsFinished(); done.signal(); return }
        let t = Double(written) / Double(fps)
        while source + 1 < frames.count && frames[source + 1].t <= t { source += 1 }
        var pixel: CVPixelBuffer? = nil
        if let c = cached, c.0 == source {
            pixel = c.1
        } else if let cg = image(frames[source].file), let b = buffer(cg) {
            cached = (source, b); pixel = b
        } else if let c = cached {
            pixel = c.1
        }
        guard let p = pixel else { written += 1; continue }
        adaptor.append(p, withPresentationTime: CMTime(value: CMTimeValue(written), timescale: fps))
        written += 1
    }
}
done.wait()
writer.finishWriting { done.signal() }
done.wait()
if writer.status == .completed {
    print("klaar: \(out.path) — \(total) beelden, \(String(format: "%.1f", Double(total) / Double(fps))) seconden")
} else {
    FileHandle.standardError.write("mislukt: \(writer.error?.localizedDescription ?? "onbekend")\n".data(using: .utf8)!)
    exit(1)
}
