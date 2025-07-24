"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #444",
  backgroundColor: "#222",
  color: "#fff",
};

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll(".form-item");
      gsap.from(items, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    }
  }, []);

  const handleSend = async () => {
    const payload = { name, email, message };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NODE_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        alert("❌ Failed to send message: " + (data?.error || "Unknown error"));
      }
    } catch (err) {
      alert("❌ Network error: " + err.message);
    }
  };

  return (
    <div
      id="contact"
      ref={containerRef}
      style={{
        padding: "40px 20px",
        textAlign: "center",
        backgroundColor: "#111",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#fff" }}>
        Contact Me
      </h2>

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          className="form-item"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Your Name"
          required
          style={inputStyle}
        />
        <input
          className="form-item"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Your Email"
          required
          style={inputStyle}
        />
        <textarea
          className="form-item"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your Message"
          required
          rows={5}
          style={inputStyle}
        />
        <button
          onClick={handleSend}
          className="form-item"
          style={{
            padding: "12px",
            backgroundColor: "#6A0DAD",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
