import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs/promises";
import path from "path";

// Helper function to promisify ffmpeg command
const processSegment = (
  videoPath: string,
  startTime: string,
  duration: number | null,
  outputPath: string
) =>
  new Promise<void>((resolve, reject) => {
    const command = ffmpeg(videoPath)
      .setStartTime(startTime)
      .output(outputPath);
    if (duration !== null) command.setDuration(duration);

    command
      .on("end", () => resolve())
      .on("error", (error) => reject(error))
      .run();
  });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const input = formData.get("input")?.toString() || "";
  const videoFile = formData.get("video") as File;

  if (!videoFile) {
    return NextResponse.json(
      { error: "No video file uploaded" },
      { status: 400 }
    );
  }

  // Convert video file to buffer and write to disk
  const buffer = await videoFile.arrayBuffer();
  const videoFilePath = `uploads/${uuidv4()}_${videoFile.name}`;
  await fs.writeFile(videoFilePath, Buffer.from(buffer));

  try {
    const outputDir = "output";
    await fs.mkdir(outputDir, { recursive: true });

    const timestamps = input.split(",").map((time) => time.trim());
    const segments = [];
    let startTime = "00:00:00";

    for (let i = 0; i <= timestamps.length; i++) {
      const endTime = timestamps[i] || null;
      const duration = endTime
        ? (new Date(`1970-01-01T${endTime}Z`).getTime() -
            new Date(`1970-01-01T${startTime}Z`).getTime()) /
          1000
        : null;

      const segmentOutput = path.join(
        outputDir,
        `segment_${i}_${uuidv4()}.mp4`
      );
      await processSegment(videoFilePath, startTime, duration, segmentOutput);
      segments.push(segmentOutput);

      startTime = endTime || startTime; // Update startTime for the next segment
    }

    await fs.unlink(videoFilePath); // Clean up uploaded file

    return NextResponse.json({ segments }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Video processing error" },
      { status: 500 }
    );
  }
}
