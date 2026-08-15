import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const publicDir = path.join(projectRoot, "public");
const pngPath = path.join(publicDir, "og-image.png");
const jpegPath = path.join(publicDir, "og-image.jpg");
const pngSignatureLength = 8;
const pngCriticalChunks = new Set(["IHDR", "PLTE", "IDAT", "IEND", "tRNS", "sRGB"]);
const jpegMetadataMarkers = new Set([0xe1, 0xed, 0xfe]);

function stripPngMetadata(buffer) {
    const chunks = [buffer.subarray(0, pngSignatureLength)];
    let offset = pngSignatureLength;

    while (offset < buffer.length) {
        const length = buffer.readUInt32BE(offset);
        const end = offset + 12 + length;
        const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");

        if (pngCriticalChunks.has(type)) {
            chunks.push(buffer.subarray(offset, end));
        }

        offset = end;
    }

    return Buffer.concat(chunks);
}

function stripJpegMetadata(buffer) {
    const chunks = [buffer.subarray(0, 2)];
    let offset = 2;

    while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) {
            chunks.push(buffer.subarray(offset));
            break;
        }

        const marker = buffer[offset + 1];
        if (marker === 0xda || marker === 0xd9) {
            chunks.push(buffer.subarray(offset));
            break;
        }

        const length = buffer.readUInt16BE(offset + 2);
        const end = offset + 2 + length;

        if (!jpegMetadataMarkers.has(marker)) {
            chunks.push(buffer.subarray(offset, end));
        }

        offset = end;
    }

    return Buffer.concat(chunks);
}

const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "dashly-og-"));
const optimizedPngPath = path.join(temporaryDirectory, "og-image.png");
const temporaryJpegPath = path.join(temporaryDirectory, "og-image.jpg");

try {
    await execFileAsync("sips", [
        "--optimizeColorForSharing",
        pngPath,
        "--out",
        optimizedPngPath,
    ]);
    await fs.writeFile(
        pngPath,
        stripPngMetadata(await fs.readFile(optimizedPngPath)),
    );

    await execFileAsync("sips", [
        "-s",
        "format",
        "jpeg",
        "-s",
        "formatOptions",
        "82",
        pngPath,
        "--out",
        temporaryJpegPath,
    ]);
    await fs.writeFile(
        jpegPath,
        stripJpegMetadata(await fs.readFile(temporaryJpegPath)),
    );
} finally {
    await fs.rm(temporaryDirectory, { recursive: true, force: true });
}
