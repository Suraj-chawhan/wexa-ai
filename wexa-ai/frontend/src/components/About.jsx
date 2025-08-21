import React from "react";

export default function About() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "2rem",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        animation: "fadeIn 0.4s ease-in-out",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "1rem",
          background: "linear-gradient(90deg, #4f46e5, #9333ea)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        About Us
      </h1>
      <p
        style={{
          fontSize: "1rem",
          color: "#374151",
          lineHeight: "1.6",
        }}
      >
        Welcome to <b style={{ color: "#4f46e5" }}>Wexa</b>. Our mission is to
        build powerful and simple solutions for modern web applications.
      </p>
    </div>
  );
}
