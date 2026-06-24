import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate  = useNavigate();
  const token     = localStorage.getItem("token");
  const username  = localStorage.getItem("username");
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  if (!token) return null;

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>🚔 SAPS</span>

      {/* Hamburger button for mobile */}
      <button
        style={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Links — hidden on mobile unless menu is open */}
      <div style={{
        ...styles.links,
        display: menuOpen ? "flex" : "flex",
        flexDirection: window.innerWidth < 600 ? "column" : "row",
        position: window.innerWidth < 600 ? "absolute" : "static",
        top: window.innerWidth < 600 ? "50px" : "auto",
        left: 0,
        right: 0,
        background: window.innerWidth < 600 ? "#1a237e" : "transparent",
        padding: window.innerWidth < 600 ? "12px 20px" : "0",
        display: menuOpen || window.innerWidth >= 600 ? "flex" : "none",
        zIndex: 999,
      }}>
        <Link to="/"            style={styles.link} onClick={() => setMenuOpen(false)}>Search</Link>
        <Link to="/add-suspect" style={styles.link} onClick={() => setMenuOpen(false)}>New Suspect</Link>
        <Link to="/dashboard"   style={styles.link} onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <span style={styles.user}>👤 {username}</span>
        <button onClick={logout} style={styles.btn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#1a237e", color: "white", padding: "12px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    position: "relative", flexWrap: "wrap"
  },
  brand: { fontWeight: "bold", fontSize: "18px" },
  hamburger: {
    background: "none", border: "none", color: "white",
    fontSize: "24px", cursor: "pointer",
    display: window.innerWidth < 600 ? "block" : "none"
  },
  links: { display: "flex", gap: "20px", alignItems: "center" },
  link:  { color: "white", textDecoration: "none", fontWeight: "500", padding: "4px 0" },
  user:  { color: "#90caf9" },
  btn: {
    background: "#ef5350", color: "white", border: "none",
    padding: "6px 14px", borderRadius: "4px", cursor: "pointer"
  },
};