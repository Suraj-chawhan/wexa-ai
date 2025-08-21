import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home as HomeIcon, UserPlus, LogIn, Info, Phone } from "lucide-react";

/* ============================
   Inline style objects
   ============================ */
const navBarStyle = {
  background: "linear-gradient(90deg, #4f46e5, #9333ea)",
  color: "white",
  boxShadow: "0 6px 18px rgba(16, 24, 40, 0.25)",
  position: "sticky",
  top: 0,
  zIndex: 1200,
};
const navContainerStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "0.8rem 1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
};
const logoStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontWeight: 700,
  textDecoration: "none",
  color: "white",
  fontSize: 18,
  letterSpacing: 0.3,
};
const desktopLinksStyle = {
  display: "flex",
  gap: 20,
  alignItems: "center",
};
const linkBase = {
  textDecoration: "none",
  color: "white",
  fontSize: 15,
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 8,
  transition: "background 160ms, opacity 160ms, transform 160ms",
};
const ctaStyle = {
  ...linkBase,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.06)",
  fontWeight: 600,
};
const mobileButtonStyle = {
  background: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
  padding: 8,
  borderRadius: 8,
};
const overlayStyle = (open) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.48)",
  opacity: open ? 1 : 0,
  pointerEvents: open ? "auto" : "none",
  transition: "opacity 240ms ease",
  zIndex: 1000,
});
const sidebarStyle = (open) => ({
  position: "fixed",
  top: 0,
  right: 0,
  height: "100vh",
  width: "33.3333vw",
  maxWidth: 420,
  minWidth: 260,
  background: "#0b1220",
  color: "white",
  padding: "1.6rem 1.2rem",
  display: "flex",
  flexDirection: "column",
  gap: 18,
  transform: open ? "translateX(0)" : "translateX(120%)",
  transition: "transform 280ms cubic-bezier(.2,.9,.25,1)",
  boxShadow: "-18px 0 48px rgba(2,6,23,0.6)",
  zIndex: 1100,
});

/* ============================
   Desktop & Mobile Nav
   ============================ */
function DesktopNav({ user }) {
  return (
    <div style={desktopLinksStyle}>
      <Link to="/about" className="nav-link" style={linkBase}>
        <Info size={16} /> About
      </Link>
      <Link to="/contact" className="nav-link" style={linkBase}>
        <Phone size={16} /> Contact
      </Link>
      {!user && (
        <Link to="/signup" className="nav-cta" style={ctaStyle}>
          <UserPlus size={16} /> Signup
        </Link>
      )}
      {!user && (
        <Link to="/signin" className="nav-cta" style={linkBase}>
          <LogIn size={16} /> Signin
        </Link>
      )}
    </div>
  );
}

function MobileNav({ user, open, setOpen }) {
  return (
    <>
      <div style={overlayStyle(open)} onClick={() => setOpen(false)} />
      <aside style={sidebarStyle(open)} aria-hidden={!open}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" onClick={() => setOpen(false)} style={logoStyle}>
            <HomeIcon size={18} /> <span>Wexa</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={mobileButtonStyle}
          >
            <X size={22} />
          </button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          <Link to="/about" onClick={() => setOpen(false)} style={{ ...linkBase, color: "white" }}>
            <Info size={18} /> About
          </Link>
          <Link to="/contact" onClick={() => setOpen(false)} style={{ ...linkBase, color: "white" }}>
            <Phone size={18} /> Contact
          </Link>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />
          {!user && (
            <Link to="/signup" onClick={() => setOpen(false)} style={{ ...ctaStyle, background: "#ffffff12" }}>
              <UserPlus size={16} /> Signup
            </Link>
          )}
          {!user && (
            <Link to="/signin" onClick={() => setOpen(false)} style={{ ...linkBase, background: "transparent" }}>
              <LogIn size={16} /> Signin
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}

/* ============================
   Navbar Component
   ============================ */
export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [menuOpen, setMenuOpen] = useState(false);

  // disable scroll when menu open + ESC close
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav style={navBarStyle}>
        <div style={navContainerStyle}>
          <Link to="/" style={logoStyle}>
            <HomeIcon size={18} /> <span>Wexa</span>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: "none" }}>
            <DesktopNav user={user} />
          </div>

          {/* Mobile Toggle (Menu / X) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={mobileButtonStyle}
            className="mobile-toggle"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <MobileNav user={user} open={menuOpen} setOpen={setMenuOpen} />

      <style>
        {`
          @media (min-width: 768px) {
            .desktop-nav { display: block !important; }
            .mobile-toggle { display: none !important; }
          }
          .nav-link:hover, .nav-cta:hover {
            background: rgba(255,255,255,0.06);
            transform: translateY(-1px);
            opacity: 0.95;
          }
        `}
      </style>
    </>
  );
}
