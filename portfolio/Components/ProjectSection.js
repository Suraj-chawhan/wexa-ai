"use client";
import React, { useEffect, useRef } from "react";
import {
  FaRobot,
  FaSpotify,
  FaCloudDownloadAlt,
  FaImage,
} from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    icon: <FaRobot size={36} />,
    title: "AI Chatbot Webapp",
    description:
      "An intelligent chatbot interface powered by modern NLP APIs and Web Speech integration.",
    url: "https://www.ainzx.com",
  },
  {
    icon: <FaSpotify size={36} />,
    title: "Spotify Clone",
    description:
      "A sleek music streaming UI replicating Spotify, built with React and Tailwind CSS.",
    url: "https://spotify-clone-latest.vercel.app/signin",
  },
  {
    icon: <FaCloudDownloadAlt size={36} />,
    title: "App Downloader",
    description:
      "Web app for browsing and downloading Android apps with search & filtering.",
    url: "https://app-download-webapp.vercel.app/",
  },
  {
    icon: <FaImage size={36} />,
    title: "Image Classifier",
    description:
      "A deep learning CNN-based image classifier with file upload and result preview.",
    url: "https://huggingface.co/spaces/Suraj442917/Image_Prediction",
  },
  {
    icon: <FaRobot size={36} />,
    title: "Multi-Agent React Native App",
    description:
      "A cooperative multi-agent mobile app published on the Play Store.",
    url: "https://play.google.com/store/search?q=Multi Agent",
    isExternal: false,
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
        background: "linear-gradient(120deg, #0f0c29, #302b63, #24243e)",
        color: "#fff",
        padding: "5rem 1.5rem",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          fontSize: "2.5rem",
          fontWeight: "700",
          background: "linear-gradient(to right, #6A0DAD, #00FFFF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Projects
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
            url={project.url}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ icon, title, description, url }) {
  return (
    <div
      className="project-card"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "1rem",
        padding: "2rem",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
      }}
      onClick={() => window.open(url, "_blank")}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 12px 32px rgba(0, 0, 0, 0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 8px 32px rgba(0, 0, 0, 0.3)";
      }}
    >
      <div style={{ color: "#6A0DAD", marginBottom: "1rem" }}>{icon}</div>
      <h3
        style={{
          fontSize: "1.3rem",
          marginBottom: "0.5rem",
          color: "#fff",
        }}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          {title}
        </a>
      </h3>
      <p style={{ color: "#ccc", fontSize: "0.95rem", lineHeight: "1.6" }}>
        {description}
      </p>
    </div>
  );
}
