import { ImageResponse } from "next/og";

export const alt = "NextWeb Studio — built by Pranshu Dhiman";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#020b18",
        color: "#ffffff",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(46,144,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(46,144,255,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          display: "flex",
          inset: 0,
          position: "absolute",
        }}
      />
      <div
        style={{
          background:
            "radial-gradient(circle, rgba(0,158,255,0.23), rgba(16,217,245,0.06) 34%, transparent 68%)",
          display: "flex",
          height: 540,
          position: "absolute",
          right: -120,
          top: -180,
          width: 540,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "72px 84px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#10d9f5",
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          NextWeb Studio
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 68,
            fontWeight: 750,
            letterSpacing: "-0.05em",
            lineHeight: 1.04,
          }}
        >
          <span>Modern websites.</span>
          <span>Full-stack products.</span>
          <span>AI-powered experiences.</span>
        </div>
        <div
          style={{
            color: "#c7d3e3",
            display: "flex",
            fontSize: 24,
            marginTop: 10,
          }}
        >
          Built by Pranshu Dhiman · Full Stack Developer
        </div>
      </div>
    </div>,
    size,
  );
}
