import React from "react";

export default function Contact() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "2rem",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Inter, sans-serif",
        animation: "fadeIn 0.4s ease-in-out",
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
        Contact Us
      </h1>

      <p
        style={{
          fontSize: "1rem",
          color: "#374151",
          lineHeight: "1.6",
          marginBottom: "1rem",
        }}
      >
        We’d love to hear from you! Reach out to us via the details below:
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
          marginTop: "1rem",
        }}
      >
        <p style={{ fontSize: "1rem", color: "#111827" }}>
          📧 <b>Email:</b>{" "}
          <a
            href="mailto:support@wexa.ai"
            style={{ color: "#4f46e5", textDecoration: "none" }}
          >
            support@wexa.ai
          </a>
        </p>
        <p style={{ fontSize: "1rem", color: "#111827" }}>
          📞 <b>Phone:</b> +91 9876543210
        </p>
        <p style={{ fontSize: "1rem", color: "#111827" }}>
          📍 <b>Address:</b> Kolkata, India
        </p>
      </div>
    </div>
  );
}
