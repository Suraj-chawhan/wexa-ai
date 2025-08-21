import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar"; // ✅ your navbar component
import Home from "./components/Home";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import About from "./components/About";
import Contact from "./components/Contact";

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main
        style={{
          minHeight: "80vh",
          padding: "1.2rem",
          fontFamily:
            "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
          background: "#f8fafc",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: "#0b1220",
          color: "#cbd5e1",
          textAlign: "center",
          padding: "1rem",
          fontSize: 13,
        }}
      >
        © {new Date().getFullYear()} All rights reserved by @wexa ai
      </footer>
    </BrowserRouter>
  );
}
