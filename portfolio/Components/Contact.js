"use client";
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #444",
  backgroundColor: "#222",
  color: "#fff",
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      const items = formRef.current.querySelectorAll(".form-item");

      gsap.from(items, {
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%", // when form top hits 80% of viewport
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Message sent!");
        setForm({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div id="contact" style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#111" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#fff" }}>Contact Me</h2>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
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
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Your Name"
          required
          style={inputStyle}
        />
        <input
          className="form-item"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Your Email"
          required
          style={inputStyle}
        />
        <textarea
          className="form-item"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your Message"
          required
          rows={5}
          style={inputStyle}
        />
        <button
          type="submit"
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
      </form>
    </div>
  );
}
