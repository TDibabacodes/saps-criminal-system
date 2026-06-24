import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const [form, setForm]       = useState({ username: "", password: "", confirmPassword: "", role: "officer" });
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSuccess("");
    setServerError("");
  }

  function validate() {
    const errs = {};
    if (!form.username.trim())        errs.username = "Username is required";
    else if (form.username.length < 3) errs.username = "Username must be at least 3 characters";

    if (!form.password)               errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";

    if (!form.confirmPassword)        errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
                                      errs.confirmPassword = "Passwords do not match";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", {
        username: form.username,
        password: form.password,
        role:     form.role,
      });
      setSuccess(`Account created for "${form.username}" successfully!`);
      setForm({ username: "", password: "", confirmPassword: "", role: "officer" });

      // Redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.sub}>South African Police Service</p>

        {serverError && <div style={styles.errorBanner}>{serverError}</div>}
        {success     && <div style={styles.successBanner}>✅ {success} Redirecting to login...</div>}

        <form onSubmit={handleSubmit} noValidate>

          {/* Username */}
          <label style={styles.label}>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            style={{
              ...styles.input,
              borderColor: errors.username ? "#e53935" : "#ccc"
            }}
          />
          {errors.username && <span style={styles.fieldError}>⚠ {errors.username}</span>}

          {/* Password */}
          <label style={styles.label}>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password (min 6 characters)"
            style={{
              ...styles.input,
              borderColor: errors.password ? "#e53935" : "#ccc"
            }}
          />
          {errors.password && <span style={styles.fieldError}>⚠ {errors.password}</span>}

          {/* Confirm Password */}
          <label style={styles.label}>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            style={{
              ...styles.input,
              borderColor: errors.confirmPassword ? "#e53935" : "#ccc"
            }}
          />
          {errors.confirmPassword && (
            <span style={styles.fieldError}>⚠ {errors.confirmPassword}</span>
          )}

          {/* Role selector */}
          <label style={styles.label}>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="officer">Officer</option>
            <option value="manager">Manager</option>
          </select>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        {/* Link back to login */}
        <p style={styles.loginLink}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1a237e", fontWeight: "600" }}>
            Login here
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
    width: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  },
  title: { textAlign: "center", color: "#1a237e", marginBottom: "4px" },
  sub: {
    textAlign: "center", color: "#666",
    fontSize: "13px", marginBottom: "24px"
  },
  label: {
    display: "block", fontWeight: "600",
    marginBottom: "4px", color: "#333", marginTop: "14px"
  },
  input: {
    width: "100%", padding: "10px", border: "1px solid #ccc",
    borderRadius: "4px", fontSize: "14px",
    boxSizing: "border-box", marginBottom: "2px"
  },
  fieldError: {
    color: "#e53935", fontSize: "12px",
    marginBottom: "4px", display: "block"
  },
  btn: {
    width: "100%", padding: "12px", background: "#1a237e",
    color: "white", border: "none", borderRadius: "4px",
    fontSize: "16px", cursor: "pointer", fontWeight: "600",
    marginTop: "20px"
  },
  successBanner: {
    background: "#e8f5e9", color: "#2e7d32", padding: "12px",
    borderRadius: "4px", marginBottom: "16px", fontSize: "14px"
  },
  errorBanner: {
    background: "#ffebee", color: "#c62828", padding: "12px",
    borderRadius: "4px", marginBottom: "16px", fontSize: "14px"
  },
  loginLink: {
    textAlign: "center", marginTop: "20px",
    fontSize: "14px", color: "#666"
  },
};