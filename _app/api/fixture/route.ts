import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import archiver from 'archiver';
import { promisify } from 'util';
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { NextResponse } from 'next/server';
import { createRouter, expressWrapper } from "next-connect";
import cors from 'cors';
import fs from 'fs/promises';


export async function POST(req,res) {

const unlinkAsync = fs.unlink;
const upload = multer({ dest: 'uploads/' });
const middleware = upload.single("video")

// const upload = multer({
//   storage: multer.diskStorage({ destination: 'uploads/',
//     filename: (req, file, cb) => {
//       const ext = file.originalname.split('.').pop(); cb(null, `${uuidv4()}.${ext}`);
//     },
//   }),
// });

// copy and refered from https://github.com/hoangvvo/next-connect
const handler = createRouter<NextApiRequest, NextApiResponse>();
handler.use(expressWrapper(cors()))

handler.post( async (req, res) => {
  let { input } = req.body;

  //DEV
  input = `00:00:30
  `

  //refered fromx https://github.com/vercel/next.js/discussions/37886
  //@ts-ignore
  middleware(req,res, async () =>{

    try {
      //@ts-ignore
      const videoFile = req.file?.path;
      if (!videoFile) {
        res.status(400).send('No video file was uploaded.');
        return;
      }

      const outputDir = 'output/';
      const inputRanges = input
        .split('\n')
        .map((r:string) => r.trim().replace(',', ''))
        .map((r:string) => {
          const [hour, minute, second] = r.split(':');
          return new Date(1970, 0, 1, Number(hour), Number(minute), Number(second));
        });
  
      const video = ffmpeg(videoFile);
      for (let i = 0; i < inputRanges.length; i++) {
        const start = inputRanges[i];
        const end = inputRanges[i + 1] || null;
  
        let startTime : number = 0;
        if (start) {
          startTime = start.getMilliseconds()
        }
  
        let endTime : number = 0;
        if (end) {
          endTime = end.getMilliseconds()
        }
  
        const clip = video.clone().setStartTime(startTime).setDuration(endTime - startTime);
  
        const outputFilename = `clip-${i}.mp4`;
        const outputPath = `${outputDir}${outputFilename}`;
  
        await promisify(clip.saveToFile.bind(clip))(outputPath);
      }
  
      res.setHeader('Content-Disposition', 'attachment; filename="output.zip"');
      res.setHeader('Content-Type', 'application/zip');
      const zipFile = 'output.zip';
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });
      archive.pipe(res);
      archive.directory(outputDir, false);
      await promisify(archive.finalize.bind(archive))();
  
      await Promise.all([unlinkAsync(videoFile), unlinkAsync(zipFile), unlinkAsync(outputDir)]);
      res.end();
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }

  })
  
});

}