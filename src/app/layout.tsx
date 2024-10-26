import "@/styles/globals.css";

export const metadata = {
  title: "Movie Auto Cutter",
  description:
    "Upload a video, optionally add an SRT file, and provide timestamps to cut your video automatically.",
};

import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
