import { ImageResponse } from "next/og";

export function MarkIcon(size: number) {
  const dot = Math.max(4, Math.round(size * 0.16));
  const barWidth = Math.max(6, Math.round(size * 0.22));
  const barHeight = Math.max(1, Math.round(size * 0.035));
  const gap = Math.max(2, Math.round(size * 0.06));

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: "#07080c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: dot,
            height: dot,
            borderRadius: dot,
            background: "#7c5cff",
            display: "flex",
          }}
        />
        <div
          style={{
            width: barWidth,
            height: barHeight,
            background: "#7c5cff",
            marginLeft: gap,
            marginRight: gap,
            display: "flex",
          }}
        />
        <div
          style={{
            width: dot,
            height: dot,
            borderRadius: dot,
            background: "#7c5cff",
            display: "flex",
          }}
        />
      </div>
    ),
    { width: size, height: size },
  );
}
