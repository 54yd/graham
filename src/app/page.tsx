"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Send } from "lucide-react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [timestamps, setTimestamps] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !timestamps) {
      alert("Please upload a file and provide timestamps.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("input", timestamps);

    const response = await fetch("/api/fixture", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Segments:", data.segments);
    } else {
      console.error("Error:", await response.json());
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Movie Auto Cutter</CardTitle>
          <CardDescription>
            Upload a video and provide timestamps to cut it automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              id="video"
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Textarea
              placeholder="Enter timestamps (one per line, e.g., 00:00:03)"
              value={timestamps}
              onChange={(e) => setTimestamps(e.target.value)}
              rows={4}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            <Send className="w-4 h-4 mr-2" /> Send
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
