"use client";
import { useState } from "react";
import { Card, Input, Button, Typography, Select } from "antd";
import { SendOutlined, FolderOpenOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [srtFile, setSrtFile] = useState<File | null>(null);
  const [timestamps, setTimestamps] = useState("");
  const [saveDirectory, setSaveDirectory] = useState<string>("");
  const [status, setStatus] = useState<string>(""); // Track processing status
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // Track if processing

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSrtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSrtFile(e.target.files[0]);
  };

  const handleDirectorySelect = (value: string) => {
    setSaveDirectory(value);
  };

  const handleSubmit = async () => {
    if (!file || (!timestamps && !srtFile)) {
      alert("Please upload a video file and provide timestamps.");
      return;
    }

    setIsProcessing(true); // Disable button
    setStatus("Processing..."); // Show status message

    const formData = new FormData();
    formData.append("video", file);
    formData.append("input", timestamps);
    formData.append("saveDirectory", saveDirectory);
    if (srtFile) formData.append("srtFile", srtFile);

    const response = await fetch("/api/videocut", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Segments:", data.segments);
      setStatus("Processing Complete!");
    } else {
      console.error("Error:", await response.json());
      setStatus("Processing failed.");
    }

    setIsProcessing(false); // Re-enable button
  };

  return (
    <div className="container p-4 mx-auto">
      <Card className="w-full max-w-2xl mx-auto" bordered>
        <Title level={3}>Movie Auto Cutter</Title>
        <Text>
          Upload a video, optionally add an SRT file, and provide timestamps to
          cut your video automatically.
        </Text>

        <div className="mt-4 space-y-6">
          <div className="mb-4">
            <Text>Upload Video File</Text>
            <Input type="file" accept="video/mp4" onChange={handleFileChange} />
          </div>

          <div className="mb-4">
            <Text>Upload SRT File (Optional)</Text>
            <Input type="file" accept=".srt" onChange={handleSrtFileChange} />
          </div>

          <div className="mb-4">
            <Text>Enter Timestamps</Text>
            <Input.TextArea
              placeholder="Enter timestamps (one per line, e.g., 00:00:03,00:00:06)"
              value={timestamps}
              onChange={(e) => setTimestamps(e.target.value)}
              rows={4}
            />
          </div>

          <div className="mb-4">
            <Text>Select or Enter Save Directory</Text>
            <Select
              placeholder="Select directory or type path"
              style={{ width: "100%" }}
              onChange={handleDirectorySelect}
              value={saveDirectory}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: 8 }}>
                    <Input
                      placeholder="Enter custom path"
                      value={saveDirectory}
                      onChange={(e) => setSaveDirectory(e.target.value)}
                      prefix={<FolderOpenOutlined />}
                    />
                  </div>
                </>
              )}
            >
              <Option value="~/Downloads">~/Downloads</Option>
              <Option value="~/Documents">~/Documents</Option>
              <Option value="/var/tmp">/var/tmp</Option>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            type="primary"
            block
            icon={<SendOutlined />}
            disabled={isProcessing} // Disable button when processing
          >
            {isProcessing ? "Processing..." : "Send"}
          </Button>

          {/* Display status message */}
          {status && <Text type="secondary">{status}</Text>}
        </div>
      </Card>
    </div>
  );
}
