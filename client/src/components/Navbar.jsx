import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate  = useNavigate();
  const token     = localStorage.getItem("token");
  const username  = localStorage.getItem("username");

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

 
  if (!token) return null;

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>SAPS Criminal Records</span>
      <div style={styles.links}>
        <Link to="/"           style={styles.link}>Search</Link>
        <Link to="/add-suspect" style={styles.link}>New Suspect</Link>
        <Link to="/dashboard"  style={styles.link}>Dashboard</Link>
        <span style={styles.user}> {username}</span>
        <button onClick={logout} style={styles.btn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#1a237e", color: "white", padding: "12px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center"
  },
  brand: { fontWeight: "bold", fontSize: "18px" },
  links: { display: "flex", gap: "20px", alignItems: "center" },
  link:  { color: "white", textDecoration: "none", fontWeight: "500" },
  user:  { color: "#90caf9" },
  btn: {
    background: "#ef5350", color: "white", border: "none",
    padding: "6px 14px", borderRadius: "4px", cursor: "pointer"
  },
};