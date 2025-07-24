"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";

import SkillSection from "../../Components/Skills";
import RotatingStars from "../../Components/RotatingStar";
import GameDesk from "../../Components/GameDesk";
import Navbar from "../../Components/Navbar";
import Projects from "../../Components/ProjectSection";
import Contact from "../../Components/Contact";

// ✅ Fireball model preload
function useFireballPreload() {
  useEffect(() => {
    useGLTF.preload("/fireball_vfx.glb");
  }, []);
}

function Fireball({ isSpeaking }) {
  useFireballPreload();
  const { scene } = useGLTF("/fireball_vfx.glb");
  const ref = useRef();
  const directionRef = useRef(1);

  const baseScale = 1;
  const maxScale = 1.5;
  const pulseSpeed = 0.01;

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.01;

    if (isSpeaking) {
      const currentScale = ref.current.scale.x;
      if (currentScale >= maxScale || currentScale <= baseScale) {
        directionRef.current *= -1;
      }
      const scaleChange = directionRef.current * pulseSpeed;
      const newScale = currentScale + scaleChange;
      ref.current.scale.set(newScale, newScale, newScale);
      ref.current.position.y = Math.sin(Date.now() * 0.005) * 0.1;
    } else {
      ref.current.scale.set(baseScale, baseScale, baseScale);
      ref.current.position.y = 0;
    }
  });

  return (
    <primitive
      object={scene}
      ref={ref}
      position={[0.1, 0, 0.2]}
      rotation={[1, 0, 0]}
    />
  );
}

export default function CharacterCanvas() {
  const audioRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const headingRef = useRef();

  useEffect(() => {
    if (headingRef.current?.children) {
      gsap.fromTo(
        headingRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.5,
        }
      );
    }
  }, []);

  const handleSTT = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
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

      try {
        const res1 = await fetch(`${process.env.NEXT_PUBLIC_NODE_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text }),
        });

        const responseText = await res1.text();

        const res2 = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_URL}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: responseText }),
        });

        const blob = await res2.blob();
        const audioUrl = URL.createObjectURL(blob);

        const audio = audioRef.current;
        audio.src = audioUrl;
        audio.play();
        setIsSpeaking(true);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    recognition.onerror = (err) => {
      console.error("STT Error:", err);
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Section */}
      <section id="hero" style={{ position: "relative", height: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Canvas style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <RotatingStars />
          <GameDesk />
          <ambientLight intensity={2} />
          <spotLight position={[-5, 5, 5]} angle={0.4} intensity={3} color="#6A0DAD" castShadow />
          <spotLight position={[5, 5, 5]} angle={0.4} intensity={3} color="#00FFFF" castShadow />
        </Canvas>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff", padding: "2rem" }} ref={headingRef}>
          <h1 className="passAnimation" style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            Hi, I&apos;m Suraj Chawhan
          </h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto" }}>
            I’m a passionate developer creating innovative AI and interactive 3D experiences.
          </p>
        </div>
      </section>

      <SkillSection />
      <Projects />

      {/* AI Assistant */}
      <section id="ai" style={{ padding: "40px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", color: "white", marginBottom: "10px" }}>
          Talk to my AI Assistant
        </h2>

        <Canvas style={{ height: "60vh", borderRadius: "12px" }} camera={{ position: [0, 2, 5] }}>
          <ambientLight intensity={4} />
          <spotLight angle={0.4} intensity={60} color="purple" position={[-2, 5, 5]} />
          <spotLight angle={0.4} intensity={60} color="blue" position={[2, 5, 5]} />
          <directionalLight position={[2, 4, 2]} intensity={5} />
          <RotatingStars />
          <Fireball isSpeaking={isSpeaking} />
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

        <audio ref={audioRef} crossOrigin="anonymous" onEnded={() => setIsSpeaking(false)} />
      </section>

      <Contact />
    </div>
  );
}
