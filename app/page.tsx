"use client";

import { useEffect, useRef, useState } from "react";
import { Special_Elite } from "next/font/google";

const typewriter = Special_Elite({ weight: "400", subsets: ["latin"] });

// Picture size and key positions (measured on the picture)
const W = 1376;
const H = 768;

const keyPos: Record<string, [number, number]> = {};
"1234567890".split("").forEach((k, i) => {
  keyPos[k] = [485 + i * 37.2, 502];
});
"QWERTYUIOP".split("").forEach((k, i) => {
  keyPos[k] = [501 + i * 37.6, 533];
});
"ASDFGHJKL".split("").forEach((k, i) => {
  keyPos[k] = [508 + i * 38.1, 564];
});
"ZXCVBNM".split("").forEach((k, i) => {
  keyPos[k] = [524 + i * 38.8, 596];
});

export default function Home() {
  const [text, setText] = useState("");
  const [pressed, setPressed] = useState<string | null>(null);
  const [vp, setVp] = useState({ w: 1366, h: 768 });
  const textBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function resize() {
      setVp({ w: window.innerWidth, h: window.innerHeight });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length === 1) {
        e.preventDefault();
        setText((t) => t + e.key);
        setPressed(e.key.toUpperCase());
      } else if (e.key === "Enter") {
        e.preventDefault();
        setText((t) => t + "\n");
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setText((t) => t.slice(0, -1));
      }
    }
    function up() {
      setPressed(null);
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Keep the newest line visible: the paper "scrolls" as you type
  useEffect(() => {
    if (textBoxRef.current) {
      textBoxRef.current.scrollTop = textBoxRef.current.scrollHeight;
    }
  }, [text]);

  // Fill the whole screen with the picture (centered, never stretched)
  const scale = Math.max(vp.w / W, vp.h / H);
  const rw = W * scale;
  const rh = H * scale;
  const left = (vp.w - rw) / 2;
  const top = (vp.h - rh) / 2;

  const spot = pressed && pressed !== " " ? keyPos[pressed] : null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <div style={{ position: "absolute", left, top, width: rw, height: rh }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/typewriter.jpg"
          alt="Typewriter on the beach"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />

        {/* Typed text on the paper */}
        <div
          ref={textBoxRef}
          className={typewriter.className}
          style={{
            position: "absolute",
            left: "40%",
            top: "28%",
            width: "21.8%",
            height: "21.5%",
            overflow: "hidden",
            color: "#3a3a3a",
            fontSize: rw * 0.0095,
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {text}
          <span className="animate-pulse">|</span>
        </div>

        {/* Pressed letter key */}
        {spot && (
          <div
            style={{
              position: "absolute",
              left: `${(spot[0] / W) * 100}%`,
              top: `${(spot[1] / H) * 100}%`,
              width: "2.1%",
              aspectRatio: "1",
              transform: "translate(-50%, -45%) scale(0.92)",
              borderRadius: "50%",
              background: "rgba(255, 190, 70, 0.55)",
              boxShadow: "0 0 10px rgba(255, 190, 70, 0.9)",
            }}
          />
        )}

        {/* Pressed space bar */}
        {pressed === " " && (
          <div
            style={{
              position: "absolute",
              left: `${(697 / W) * 100}%`,
              top: `${(640 / H) * 100}%`,
              width: "26.5%",
              height: "3.4%",
              transform: "translate(-50%, -50%)",
              borderRadius: "6px",
              background: "rgba(255, 190, 70, 0.4)",
            }}
          />
        )}
      </div>
    </div>
  );
}