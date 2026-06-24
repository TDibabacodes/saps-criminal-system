import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [form, setForm]       = useState({ username: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token",    res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role",     res.data.role);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>SAPS Login</h2>
        <p style={styles.sub}>
          South African Police Service
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            style={styles.input}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            style={styles.input}
            required
          />

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.registerLink}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#1a237e", fontWeight: "600" }}>
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh", display: "flex",
    alignItems: "center", justifyContent: "center",
    background: "#e8eaf6"
  },
  card: {
  background: "white", padding: "40px", borderRadius: "8px",
  width: "90%", maxWidth: "380px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
},
  title: { textAlign: "center", color: "#1a237e", marginBottom: "4px" },
  sub: {
    textAlign: "center", color: "#666",
    fontSize: "13px", marginBottom: "24px"
  },
  label: {
    display: "block", fontWeight: "600",
    marginBottom: "4px", color: "#333"
  },
  input: {
    width: "100%", padding: "10px", marginBottom: "16px",
    border: "1px solid #ccc", borderRadius: "4px",
    fontSize: "14px", boxSizing: "border-box"
  },
  btn: {
    width: "100%", padding: "12px", background: "#1a237e",
    color: "white", border: "none", borderRadius: "4px",
    fontSize: "16px", cursor: "pointer", fontWeight: "600"
  },
  error: {
    background: "#ffebee", color: "#c62828", padding: "10px",
    borderRadius: "4px", marginBottom: "16px", fontSize: "14px"
  },
  registerLink: {
    textAlign: "center", marginTop: "20px",
    fontSize: "14px", color: "#666"
  },
};