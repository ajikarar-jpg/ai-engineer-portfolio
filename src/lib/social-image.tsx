import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const socialSize = { width: 1200, height: 630 };
export const socialContentType = "image/png";
export const socialAlt = `${site.name}, AI engineer. Building AI systems that solve real business problems.`;

export function SocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07080c",
          color: "#f5f7fa",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            color: "#929aaa",
          }}
        >
          AI ENGINEER · SOFTWARE · AUTOMATION
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            lineHeight: 1.05,
            letterSpacing: -1.5,
            maxWidth: 920,
          }}
        >
          Building AI systems that solve real business problems.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#929aaa" }}>{site.name}</div>
      </div>
    ),
    { ...socialSize },
  );
}
