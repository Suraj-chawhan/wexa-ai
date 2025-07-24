"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Lipsync } from "wawa-lipsync";
import gsap from "gsap";

import Model from "../../Components/Model.js";
import SkillSection from "../../Components/Skills.js";
import RotatingStars from "../../Components/RotatingStar.js";
import GameDesk from "../../Components/GameDesk.js";
import Navbar from "../../Components/Navbar.js";
import Projects from "../../Components/ProjectSection.js";
import Contact from "../../Components/Contact.js";

const lipsyncManager = new Lipsync();


export default function Fireball(){
const { scene } = useGLTF('/fireball_vfx.glb');
const ref=useRef();


  const [direction, setDirection] = useState(1); // 1 = left, -1 = right
  const [phase, setPhase] = useState("left"); // left → center → right → center
  const speed = 0.01; // adjust speed
  const maxRotation = Math.PI / 4; // 45 degrees in radians

  useFrame(() => {
    if (!ref.current) return;

    const y = ref.current.rotation.y;

    if (phase === "left") {
      if (y < maxRotation) {
        ref.current.rotation.y += speed;
      } else {
        setPhase("centerFromLeft");
      }
    } else if (phase === "centerFromLeft") {
      if (y > 0) {
        ref.current.rotation.y -= speed;
      } else {
        setPhase("right");
      }
    } else if (phase === "right") {
      if (y > -maxRotation) {
        ref.current.rotation.y -= speed;
      } else {
        setPhase("centerFromRight");
      }
    } else if (phase === "centerFromRight") {
      if (y < 0) {
        ref.current.rotation.y += speed;
      } else {
        setPhase("left");
      }
    }
  });

return <primitive object={scene} position={[0.4,0,3]} ref={ref} rotation={[1,0,0]} />;
}






export default function CharacterCanvas() {
  const audioRef = useRef(null);
  const [viseme, setViseme] = useState("");
  const [isListening, setIsListening] = useState(false);
  const rafId = useRef(null);
  const headingRef = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.fromTo(
        headingRef.current?.children || [],
        { x: "20px", opacity: 0 },
        {
          x: "0px",
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          delay: 2,
        }
      );
    }
  }, []);

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

      const res1 = await fetch("https://portfolio-backend-node.vercel.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const responseText = await res1.text();

      const res2 = await fetch("https://portfolio-backend-node-5dkf.vercel.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: responseText }),
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
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>
      <Navbar />

      <section id="hero" style={{ position: "relative", height: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Canvas style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <RotatingStars />
          <GameDesk />
          <ambientLight intensity={2} />
          <spotLight position={[-5, 5, 5]} angle={0.4} intensity={3} color="#6A0DAD" castShadow />
          <spotLight position={[5, 5, 5]} angle={0.4} intensity={3} color="#00FFFF" castShadow />
        </Canvas>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff", padding: "2rem" }} ref={headingRef}>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Hi, I&apos;m Suraj Chawhan</h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto" }}>
            I’m a passionate developer creating innovative AI and interactive 3D experiences.
          </p>
        </div>
      </section>

      <SkillSection />
      <Projects />

      <section id="ai" style={{ padding: "40px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", color: "white", marginBottom: "10px" }}>Talk to my Ai Assistant</h2>
        <Canvas style={{ height: "60vh", borderRadius: "12px" }} camera={{ position: [0, 2, 5] }}>
          <ambientLight intensity={4} />
          <spotLight angle={0.4} intensity={60} color="purple" position={[-2, 5, 5]} />
          <spotLight angle={0.4} intensity={60} color="blue" position={[2, 5, 5]} />
          <directionalLight position={[2, 4, 2]} intensity={5} />
          <RotatingStars />
      <Fireball/>
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
      </section>

      <Contact />
    </div>
  );
}
