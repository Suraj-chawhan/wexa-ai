"use client";
import React, { useEffect, useRef } from "react";
import { FaRobot, FaSpotify, FaCloudDownloadAlt, FaImage } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    icon: <FaRobot size={36} />,
    title: "AI Chatbot Webapp",
    description: "An intelligent chatbot interface powered by modern NLP APIs and Web Speech integration.",
  },
  {
    icon: <FaSpotify size={36} />,
    title: "Spotify Clone",
    description: "A sleek music streaming UI replicating Spotify, built with React and Tailwind CSS.",
  },
  {
    icon: <FaCloudDownloadAlt size={36} />,
    title: "App Downloader",
    description: "Web app for browsing and downloading Android apps with search & filtering.",
  },
  {
    icon: <FaImage size={36} />,
    title: "Image Classifier",
    description: "A deep learning CNN-based image classifier with file upload and result preview.",
  },
];

export default function Projects() {
  const containerRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray(".project-card");

    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: "power3.out",
        delay: i * 0.1,
      });
    });
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      style={{
        background: "#0a0a0a",
        color: "#fff",
        padding: "5rem 2rem",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          fontSize: "2.5rem",
          color: "#6A0DAD",
        }}
      >
        Projects
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            icon={project.icon}
            title={project.title}
            description={project.description}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ icon, title, description }) {
  return (
    <div
      className="project-card"
      style={{
        background: "#1a1a1a",
        padding: "2rem",
        borderRadius: "1rem",
        border: "1px solid #333",
        boxShadow: "0 0 10px rgba(0,0,0,0.4)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        textAlign: "center",
      }}
    >
      <div style={{ color: "#6A0DAD", marginBottom: "1rem" }}>{icon}</div>
      <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "#fff" }}>{title}</h3>
      <p style={{ color: "#ccc", fontSize: "0.95rem", lineHeight: "1.5" }}>{description}</p>
    </div>
  );
}
