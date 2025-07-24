"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import gsap from "gsap";
import Image from "next/image";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      if (menuRef.current) menuRef.current.style.display = "flex";
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(menuRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          if (menuRef.current) menuRef.current.style.display = "none";
        },
      });
    }
  }, [isOpen]);

  const navLinks = ["#hero", "#skills", "#ai", "#projects", "#contact"];

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "rgba(0, 0, 0, 0.9)",
        borderBottom: "1px solid #333",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Image src="/logo1.png" width={100} height={25} alt="Logo" />

      {/* Hamburger / Close Icon */}
      <div
        onClick={toggleMenu}
        className="hamburger-icon"
        style={{
          color: "#fff",
          fontSize: "1.8rem",
          cursor: "pointer",
          zIndex: 1001,
          display: "block",
        }}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile Navigation */}
      <ul
        ref={menuRef}
        className="mobile-nav"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "250px",
          background: "#111",
          flexDirection: "column",
          gap: "2rem",
          padding: "3rem 1.5rem",
          display: "none",
          transform: "translateX(100%)",
          zIndex: 1000,
          listStyle: "none",
        }}
      >
        {navLinks.map((href, idx) => (
          <li key={idx}>
            <a
              href={href}
              onClick={() => setIsOpen(false)}
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "1.2rem",
                fontWeight: "500",
              }}
            >
              {href.replace("#", "").charAt(0).toUpperCase() + href.replace("#", "").slice(1)}
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop Navigation */}
      <ul
        className="desktop-nav"
        style={{
          display: "flex",
          gap: "1.5rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
          color: "#fff",
        }}
      >
        {navLinks.map((href, idx) => (
          <li key={idx} className="nav-link">
            <a
              href={href}
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              {href.replace("#", "").charAt(0).toUpperCase() + href.replace("#", "").slice(1)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
