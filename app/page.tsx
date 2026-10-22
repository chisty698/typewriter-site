"use client";

import { useEffect, useRef, useState } from "react";
import { Special_Elite } from "next/font/google";

const typewriter = Special_Elite({ weight: "400", subsets: ["latin"] });
const rows = ["1234567890", "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export default function Home() {
  const [text, setText] = useState("");
  const [pressed, setPressed] = useState<string | null>(null);
  const paperRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (paperRef.current) {
      paperRef.current.scrollTop = paperRef.current.scrollHeight;
    }
  }, [text]);

  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/beach.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black/20 z-0" />

      <main
        className={`${typewriter.className} relative z-10 min-h-screen flex flex-col items-center py-8 px-4`}
      >
        <div
          ref={paperRef}
          className="w-full max-w-xl h-60 bg-amber-50 text-stone-800 text-lg p-6 overflow-y-auto whitespace-pre-wrap shadow-lg rounded-t-sm"
        >
          {text || <span className="text-stone-400">Start typing...</span>}
          <span className="animate-pulse">|</span>
        </div>

        <div className="w-full max-w-xl bg-stone-900 rounded-b-3xl p-5 flex flex-col items-center gap-3 shadow-2xl">
          {rows.map((row) => (
            <div key={row} className="flex gap-2">
              {row.split("").map((k) => (
                <div
                  key={k}
                  className={`w-10 h-10 rounded-full border-4 border-stone-500 flex items-center justify-center text-sm transition-all duration-75 ${
                    pressed === k
                      ? "bg-amber-300 text-stone-900 translate-y-1 shadow-none"
                      : "bg-stone-200 text-stone-800 shadow-[0_4px_0_#78716c]"
                  }`}
                >
                  {k}
                </div>
              ))}
            </div>
          ))}
          <div
            className={`w-64 h-9 rounded-md border-4 border-stone-500 transition-all duration-75 ${
              pressed === " "
                ? "bg-amber-300 translate-y-1"
                : "bg-stone-200 shadow-[0_4px_0_#78716c]"
            }`}
          />
        </div>
      </main>
    </>
  );
}