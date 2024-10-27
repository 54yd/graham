# 🎬 Movie Auto Cutter
<img width="685" alt="Screenshot 2024-10-28 at 8 12 05" src="https://github.com/user-attachments/assets/4fd49acf-5395-4e25-85e8-b24e4d0d5111">

**Movie Auto Cutter** is a versatile tool for quickly and easily segmenting videos based on timestamps or subtitle files, designed for both **local use** and **ready-to-deploy** on platforms like Vercel. Simply **upload** a video, **provide timestamps or subtitles**, and let Movie Auto Cutter handle the editing – no complex software required! 

Built with accessibility and ease-of-use in mind, this app is perfect for language learning, educational video editing, AI training, and more.

This Project uses NextJS15 so 'npm run dev' or 'npm run build && npm run start' is valid (I also put build file as zip in Release)

---

## ✨ Key Features
- **📂 Local and Cloud-Ready Deployment**  
  This app is fully compatible with Vercel and other cloud platforms. After deployment, simply run `npm run start` to get going!

- **⏩ Fast and Efficient Auto-Cutting**  
  Forget about complex editing workflows. Just paste your timestamps or upload an SRT file, and Movie Auto Cutter will automatically segment the video for you.

- **🎓 Ideal for AI and Educational Use Cases**  
  Generate vast datasets quickly, create targeted educational clips, or practice pronunciation with easy playback of specific segments.

---

## 📊 Results: Example Segmented Data

**The following segmented video data are based on SRT files, generated using a separate transcription application. These segments demonstrate how Movie Auto Cutter can be used to create precise, language and topic-focused video excerpts. The approach appears straightforward and doesn't require a complex audio signal processing algorithm, making it quite fast. It can easily integrate and synergize with AI transcription apps for further extension!

- **[TED Talk: "Secrets of success in 8 words, 3 minutes" | Richard St. John](https://www.youtube.com/watch?v=Y6bbMQXQ180&list=PL7K8c1thIRHu3QeqHUJqefWeLs-PahLl5&index=2)**



https://github.com/user-attachments/assets/7daf6219-1856-45a7-8002-5a5c477b89bc




https://github.com/user-attachments/assets/c2a30fe9-8c6f-4905-832d-61a9ed19f8cb




- **[Alien (1986) | 20th Century Fox]**


https://github.com/user-attachments/assets/34813e9c-1dfd-4089-a186-1636c028b14c



https://github.com/user-attachments/assets/c4b7390a-11e6-4a91-87d1-df7c54e73111



https://github.com/user-attachments/assets/975800ea-fbd0-4f14-909f-645d1ce7e765

> **Disclaimer**: All media content is used here for academic and non-commercial purposes only. Please ensure that you respect copyright laws and seek permission as necessary for any public usage. "Alien" is the property of 20th Century Fox.


---

## 📜 Background & Motivation

1. **Language Learning & Pronunciation Practice**  
   🗣️ Repeatedly replay specific phrases or sentences to help with mastering pronunciation by aligning subtitle segments with video clips.

2. **Quick Educational Video Editing**  
   📚 Effortlessly cut out the essential parts of lectures or lessons, saving time and providing focused content for review. No professional software needed! I expect to keep using this tool in graduate school and beyond.

3. **High-Volume Dataset Generation for AI Fine-Tuning**  
   🤖 For training AI models in video and audio generation, automatically extract refined data for specific characters, expressions, or voice segments, making it easier to create large and precise datasets.

---

## 🛠️ Usage Instructions

### Running the App
1. **Deploy or Run Locally**  
   - To run on Vercel or a similar cloud platform, build the app and start it with:
     ```bash
     npm run start
     ```

2. **Navigate to the Main Page**  
   - The main interface lets you upload a video, add subtitle files, and enter timestamps.

### Step-by-Step Guide (Page Instructions)

1. **Upload Video File**  
   - Click **Upload Video File** and select your `.mp4` file. This is the video from which segments will be extracted.
   
2. **Optional: Upload an SRT File**  
   - Optionally, upload a `.srt` subtitle file for the video. This allows the app to match segments based on subtitle timings, making it easier to clip specific sections.
   
3. **Enter Timestamps Manually**  
   - If you don’t have an SRT file, you can enter timestamps directly in the **Enter Timestamps** field. List each timestamp on a new line, using the format `00:00:03` (HH:MM:SS).
   
4. **Choose Save Directory**  
   - You can specify a save directory for segmented files using the **Select or Enter Save Directory** option. You can select a common path from the dropdown or enter a custom path.
   
5. **Start Processing**  
   - Click **Send** to start cutting. While the app processes, you’ll see a “Processing…” message, and the button will be disabled until all segments are complete.
   
6. **View Completion Status**  
   - Once done, the app will show a “Processing Complete!” message, and you can find the segmented files in the specified directory.

---

## 🎓 AI and Educational Use Cases

#### AI Training with Minimal Effort 🎥🤖
For developers and researchers working on training AI models in **video and audio generation**, Movie Auto Cutter offers a streamlined, no-fuss way to create large datasets from video clips without needing complex editing tools like Adobe Premiere Pro. With **text-based timestamps** or subtitle files, you can quickly extract and organize data, making it simple to train models on specific characters, emotions, facial expressions, or vocal nuances.

- **High-Volume Data Generation**  
  Instead of manually editing and saving each segment, you can automate the cutting process. This is especially useful when you need to produce datasets containing hundreds or thousands of short clips.

- **Consistency & Precision**  
  By using text-based timestamps, the app ensures consistent start and end times for each clip. This accuracy is crucial for models that rely on precise timing, such as lip-syncing in character animation or aligning audio with video.

- **Targeted Training Data**  
  This tool can be a game-changer in fine-tuning models to recognize or generate particular patterns. For instance, you could use it to cut out only segments where a specific person speaks or to create a dataset of facial expressions for emotion-detection models.

With Movie Auto Cutter, AI developers can quickly produce structured, text-defined video and audio datasets, saving hours of editing time and making it easy to experiment and iterate on training datasets.

---

## 🚀 Future Planned Features
Movie Auto Cutter has an ambitious roadmap to make video editing even more powerful and automated:

- **🤖 Whisper AI Integration**  
  Automatically transcribe videos with Whisper AI, creating subtitles on the fly.

- **📝 Content-Based Summarization**  
  Enable intelligent auto-cutting based on topic importance, e.g., condense a 60-minute lecture into a 10-minute summary, or extract highlights from sports games.

---

## 🔮 Ultimate Goal
The ultimate vision for Movie Auto Cutter is to evolve into a **Computer Vision security application** that can automatically identify and extract important parts from hours of surveillance footage or interview recordings. Designed with applications in both **public safety** and **private security**, this tool could greatly aid in finding and analyzing key moments in video footage.

---

> ⚡ **Quick Tip:** This app was built with flexibility in mind. You can paste timestamps, upload SRTs, or even integrate it with advanced transcription tools as they’re released – making it a valuable resource for students, researchers, language learners, and AI engineers alike.

---

Hope this helps in making Movie Auto Cutter accessible and engaging for all users! 😊
