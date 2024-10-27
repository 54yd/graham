import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import srtParser2 from "srt-parser-2";
import os from "os";

const uploadsDir = path.join(process.cwd(), "uploads");

async function ensureDirExists(directory: string) {
  await fs.mkdir(directory, { recursive: true });
}

const formatTimestamp = (timestamp: string) => timestamp.replace(",", ".");

async function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      if (metadata.format.duration === undefined) {
        return reject(new Error("Duration is undefined"));
      }
      resolve(metadata.format.duration);
    });
  });
}

async function processSegment(
  videoPath: string,
  start: string,
  duration: number | null,
  outputPath: string
) {
  return new Promise<void>((resolve, reject) => {
    const command = ffmpeg(videoPath).setStartTime(start).output(outputPath);

    if (duration !== null) {
      command.setDuration(duration);
    }

    command.on("end", resolve).on("error", reject).run();
  });
}

// Helper function to expand `~` to home directory
function resolvePath(filePath: string) {
  if (filePath.startsWith("~")) {
    return path.join(os.homedir(), filePath.slice(1));
  }
  return path.resolve(filePath);
}

export async function POST(req: NextRequest) {
  await ensureDirExists(uploadsDir);

  const formData = await req.formData();
  const videoFile = formData.get("video") as File;
  const srtFile = formData.get("srtFile") as File | null;
  const saveDirectoryRaw =
    formData.get("saveDirectory")?.toString() || uploadsDir;
  const saveDirectory = resolvePath(saveDirectoryRaw);

  await ensureDirExists(saveDirectory);

  if (!videoFile) {
    return NextResponse.json(
      { error: "No video file uploaded" },
      { status: 400 }
    );
  }

  const videoBuffer = await videoFile.arrayBuffer();
  const videoFilePath = path.join(uploadsDir, `${uuidv4()}_input.mp4`);
  await fs.writeFile(videoFilePath, Buffer.from(videoBuffer));

  const maxVideoDuration = await getVideoDuration(videoFilePath);
  let segments: string[] = [];

  if (srtFile) {
    const srtBuffer = await srtFile.arrayBuffer();
    const srtContent = Buffer.from(srtBuffer).toString("utf-8");
    const parser = new srtParser2();
    const srtData = parser.fromSrt(srtContent);

    for (const entry of srtData) {
      const start = formatTimestamp(entry.startTime);
      const end = formatTimestamp(entry.endTime);

      const startInSeconds = new Date(`1970-01-01T${start}Z`).getTime() / 1000;

      if (startInSeconds >= maxVideoDuration) break;

      const duration =
        (new Date(`1970-01-01T${end}Z`).getTime() -
          new Date(`1970-01-01T${start}Z`).getTime()) /
        1000;

      const effectiveDuration =
        duration > 0 ? duration : maxVideoDuration - startInSeconds;

      const segmentOutput = path.join(saveDirectory, `segment_${uuidv4()}.mp4`);
      await processSegment(
        videoFilePath,
        start,
        effectiveDuration,
        segmentOutput
      );
      segments.push(segmentOutput);
    }
  } else {
    const input = formData.get("input")?.toString() || "";
    const timestamps = input.split(",").map((time: any) => time.trim());

    let startTime = "00:00:00";
    for (let i = 0; i < timestamps.length; i++) {
      const endTime = timestamps[i];
      const duration = endTime
        ? (new Date(`1970-01-01T${formatTimestamp(endTime)}Z`).getTime() -
            new Date(`1970-01-01T${formatTimestamp(startTime)}Z`).getTime()) /
          1000
        : maxVideoDuration -
          new Date(`1970-01-01T${formatTimestamp(startTime)}Z`).getTime() /
            1000;

      const segmentOutput = path.join(saveDirectory, `segment_${uuidv4()}.mp4`);
      await processSegment(
        videoFilePath,
        formatTimestamp(startTime),
        duration,
        segmentOutput
      );
      segments.push(segmentOutput);

      startTime = endTime || startTime;
    }
  }

  // Delete the temporary input file after processing
  await fs.unlink(videoFilePath);

  return NextResponse.json(
    { message: "Processing complete", segments },
    { status: 200 }
  );
}
