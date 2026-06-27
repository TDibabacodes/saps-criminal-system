import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.code}>404</h1>
        <p style={styles.message}>Page not found</p>
        <p style={styles.sub}>The page you're looking for doesn't exist.</p>
        <button style={styles.btn} onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh", display: "flex",
    alignItems: "center", justifyContent: "center"
  },
  card: {
    background: "white", padding: "60px 40px", borderRadius: "8px",
    textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  code:    { fontSize: "80px", fontWeight: "800", color: "#1a237e", margin: 0 },
  message: { fontSize: "24px", fontWeight: "600", margin: "8px 0" },
  sub:     { color: "#666", marginBottom: "24px" },
  btn: {
    padding: "12px 32px", background: "#1565c0", color: "white",
    border: "none", borderRadius: "4px", cursor: "pointer",
    fontWeight: "600", fontSize: "16px"
  },
};