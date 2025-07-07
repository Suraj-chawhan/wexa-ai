"use client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Model from "./Model.jsx";
import { Lipsync } from "wawa-lipsync";

const lipsyncManager = new Lipsync();

function RotatingStars() {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.001;
      ref.current.rotation.y += 0.001;
    }
  });
  return (
    <group ref={ref}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

export default function CharacterCanvas() {
  const audioRef = useRef(null);
  const [viseme, setViseme] = useState("");
  const [isListening, setIsListening] = useState(false);
  const rafId = useRef(null);

  const analyzeAudio = () => {
    lipsyncManager.processAudio();
    setViseme(lipsyncManager.viseme);
    rafId.current = requestAnimationFrame(analyzeAudio);
  };

  const stop = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const handleSTT = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("SpeechRecognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = async (e) => {
      const text = e.results[0][0].transcript;
      console.log("User said:", text);

      const res1 = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      
      const res2= await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: res1}),
      });
      
      
      const blob = await res2.blob();
      const audioUrl = URL.createObjectURL(blob);

      const audio = audioRef.current;
      audio.src = audioUrl;
      lipsyncManager.connectAudio(audio);
      audio.play();
      analyzeAudio();
    };

    recognition.onerror = (err) => {
      console.error("STT Error:", err);
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>🎙️ Speak to AI Avatar</h1>

      <Canvas style={{ height: "60vh", borderRadius: "12px" }} camera={{ position: [0, 2, 5] }}>
        <ambientLight intensity={4} />
        <spotLight 
      angle={0.4} intensity={60} color="purple" />
        <spotLight  angle={0.4} intensity={60} color="green" />
        <spotLight  angle={0.3} intensity={60} color="white" />
        <spotLight position={[0, -3, 0]} angle={0.2} intensity={60} color="cyan" />
        <directionalLight position={[2, 4, 2]} intensity={5} />
        <OrbitControls />
        <RotatingStars />
        <Model viseme={viseme} />
      </Canvas>

      <button
        onClick={handleSTT}
        style={{
          marginTop: "25px",
          padding: "12px 24px",
          fontSize: "1rem",
          fontWeight: "bold",
          backgroundColor: "#6A0DAD",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        🎤 {isListening ? "Listening..." : "Speak to AI"}
      </button>

      <audio ref={audioRef} crossOrigin="anonymous" onEnded={stop} />
    </div>
  );
}
