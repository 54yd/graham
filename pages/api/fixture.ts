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
import {createReadStream} from 'fs';
//Core Constants
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


//Other Helpers
const ffprobeAsync = promisify(ffmpeg.ffprobe);

async function getVideoInfo(videoFile) {
  try {
    const info = await ffprobeAsync(videoFile);
    console.log(`=== VIDEO INFO ===\n`,info);
    return info
  } catch (err) {
    console.error(err);
  }
}

//This needs for setStartTime Format (HH:MM:SS.ms) * this is not Date type, string.
function formatForSeq(milliseconds:number):string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  const ms = (milliseconds % 1000).toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${ms}`;
}



// copy and referred from https://github.com/hoangvvo/next-connect
const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(expressWrapper(cors()))

router.get( async (req, res) => {
  let { input } = req.body;
  console.log("This message will be displayed in the terminal");
  //DEV
  input = `00:00:03,
  00:00:06,`

  //refered fromx https://github.com/vercel/next.js/discussions/37886
  //@ts-ignore
  middleware(req,res, async () =>{

    try {
      //@ts-ignore
      let videoFile = req.file?.path;
      videoFile = "input/input.mp4"
      const outputDir = 'output/';

      if (!videoFile) {
        res.status(400).send('No video file was uploaded.');
        return;
      }

      let inputRanges = input
        .split('\n')
        .map((r:string) => r.trim().replace(',', ''))
        .map((r:string) => {
          const [hour, minute, second] = r.split(':');
          return new Date(1970, 0, 1, Number(hour), Number(minute), Number(second));
        });
  
    
      // OPEN VIDEO

      const fileInfo = await getVideoInfo(videoFile)
      const fileTotalDuration = fileInfo.format.duration * 1000;

      console.log(" ---- input duration ---- \n",fileTotalDuration)
      const zeroUnixTime = new Date(1970, 0, 1, Number(0), Number(0), Number(0))
      const fileTotalDurationUnixTime= new Date ( Number( fileTotalDuration + zeroUnixTime.getTime()) )

      console.log(" ---- input ---- \n",inputRanges)
      // make index[0] should have 00:00:00 for first cutting
      inputRanges.unshift(new Date(1970, 0, 1, Number(0), Number(0), Number(0)))
      inputRanges.push(fileTotalDurationUnixTime)

      console.log(" ---- head and tail added input ---- \n",inputRanges)
      for (let i = 0; i < inputRanges.length-1; i++) {
        console.log(" ---- open video ---- \n")
        const video = await ffmpeg(videoFile);
        
        const start = inputRanges[i];
        const end = inputRanges[i + 1] 
        
        let startMSTime :number = 0;
        if (start) startMSTime = start.getTime()-zeroUnixTime.getTime()
        
        let endMSTime :number = 0;
        if (end) endMSTime = end.getTime()-zeroUnixTime.getTime()
        
        // if in index[last], skip the process because it is start[last] ---to--- end[last_next=out_of_bound] input.
        const startSeqTime: string = formatForSeq(startMSTime);
        const durationSeq : string = formatForSeq(endMSTime - startMSTime);

        //throw Error(duration)
        let clipClone = await video.clone()
        const clip = await video.setStartTime(startSeqTime).setDuration(durationSeq);
  
        console.log(` ---- LOOP ${i} ---- `)
        console.log(" ---- clip ---- ",startSeqTime)
        console.log(" ---- video ---- ",durationSeq)

        let outputFilename = `clip-${i}.mp4`;
        let outputPath = `${outputDir}${outputFilename}`;
  
        clip.save(outputPath)
        //await promisify(clip.saveToFile).bind(clip, outputPath)();
        console.log(" ---- for break ---- \n")
      }
      console.log(" ---- for all break ---- \n")

      
      console.log(" ---- ARCHIVE ---- \n")
      const archive = archiver('zip', { zlib: { level: 9 } });
      //ERROR
      archive.on('error', function(err) {
        res.status(500).send({error: err.message});
      });
      //END
      archive.on('end', ()=>{
        console.log('Archive wrote %d bytes', archive.pointer());
      });
      //PIPE
      archive.pipe(res);

      archive.directory(outputDir, false);
      await archive.finalize()

      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename=archive.zip');

//      const zipFile = 'output.zip';
//      const zipPath = `${outputDir}${zipFile}`;

//      const readStream = createReadStream(zipPath);
//      await readStream.pipe(res);
      // await Promise.all([unlinkAsync(videoFile), unlinkAsync(zipFile), unlinkAsync(outputDir)]);
      
      res.status(200).end()
      
    } catch (err) {
      console.error(err);
      res.status(500).send(`Internal Server Error ${err}`);
    }

  })
  
});

// create a handler from router with custom
// onError and onNoMatch
export default router.handler({
  onError: (err, req, res) => {
    //@ts-ignore
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});