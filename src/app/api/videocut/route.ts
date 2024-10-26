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
  duration: number,
  outputPath: string
) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .setStartTime(start)
      .setDuration(duration)
      .output(outputPath)
      .on("end", () => resolve)
      .on("error", () => reject)
      .run();
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
  //@ts-ignore
  await fs.writeFile(videoFilePath, Buffer.from(videoBuffer));

  const maxVideoDuration = await getVideoDuration(videoFilePath);
  let timestamps: string[] = [];

  if (srtFile) {
    const srtBuffer = await srtFile.arrayBuffer();
    const srtContent = Buffer.from(srtBuffer).toString("utf-8");
    const parser = new srtParser2();
    const srtData = parser.fromSrt(srtContent);
    timestamps = srtData.map(
      (entry: any) => `${entry.startTime}-->${entry.endTime}`
    );
  } else {
    const input = formData.get("input")?.toString() || "";
    timestamps = input.split(",").map((time: any) => time.trim());
  }

  const segments: string[] = [];

  for (const timestamp of timestamps) {
    const [start, end] = timestamp.includes("-->")
      ? timestamp.split("-->").map((time) => time.trim())
      : [timestamp, null];

    const formattedStart = formatTimestamp(start);
    const duration = end
      ? (new Date(`1970-01-01T${formatTimestamp(end)}Z`).getTime() -
          new Date(`1970-01-01T${formattedStart}Z`).getTime()) /
        1000
      : null;

    const startInSeconds =
      new Date(`1970-01-01T${formattedStart}Z`).getTime() / 1000;

    if (startInSeconds >= maxVideoDuration) break;

    const segmentOutput = path.join(saveDirectory, `segment_${uuidv4()}.mp4`);
    await processSegment(
      videoFilePath,
      formattedStart,
      duration || maxVideoDuration - startInSeconds,
      segmentOutput
    );
    segments.push(segmentOutput);
  }

  await fs.unlink(videoFilePath);

  // Respond with the segmented file paths to indicate completion
  return NextResponse.json(
    { message: "Processing complete", segments },
    { status: 200 }
  );
}
