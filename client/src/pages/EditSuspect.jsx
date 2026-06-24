import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { validateSAID } from "../utils/saIdValidator";

export default function EditSuspect() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form, setForm]     = useState({ id_number: "", first_name: "", last_name: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load suspect data when page opens
  useEffect(() => {
    API.get("/suspects/" + id)
      .then((res) => {
        setForm({
          id_number:  res.data.id_number,
          first_name: res.data.first_name,
          last_name:  res.data.last_name,
        });
        setLoading(false);
      })
      .catch(() => {
        setServerError("Failed to load suspect");
        setLoading(false);
      });
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSuccess("");
    setServerError("");
  }

  function validate() {
    const errs = {};
    if (!form.id_number.trim()) {
      errs.id_number = "ID Number is required";
    } else {
      const { valid, error } = validateSAID(form.id_number.trim());
      if (!valid) errs.id_number = error;
    }
    if (!form.first_name.trim()) errs.first_name = "First Name is required";
    if (!form.last_name.trim())  errs.last_name  = "Last Name is required";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await API.put("/suspects/" + id, form);
      setSuccess("Suspect updated successfully!");
      // Go back to home after 1.5 seconds
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Update failed");
    }
  }

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Suspect</h2>

        {serverError && <div style={styles.errorBanner}>{serverError}</div>}
        {success     && <div style={styles.successBanner}>{success}</div>}

        <form onSubmit={handleSubmit} noValidate>

          {/* ID Number */}
          <div style={styles.row}>
            <label style={styles.label}>Suspect ID</label>
            <div style={styles.inputWrap}>
              <input
                name="id_number"
                value={form.id_number}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  borderColor: errors.id_number ? "#e53935" : "#ccc"
                }}
              />
              {errors.id_number && (
                <span style={styles.fieldError}>⚠ {errors.id_number}</span>
              )}
            </div>
          </div>

          {/* First Name */}
          <div style={styles.row}>
            <label style={styles.label}>First Name</label>
            <div style={styles.inputWrap}>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  borderColor: errors.first_name ? "#e53935" : "#ccc"
                }}
              />
              {errors.first_name && (
                <span style={styles.fieldError}>⚠ {errors.first_name}</span>
              )}
            </div>
          </div>

          {/* Last Name */}
          <div style={styles.row}>
            <label style={styles.label}>Last Name</label>
            <div style={styles.inputWrap}>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  borderColor: errors.last_name ? "#e53935" : "#ccc"
                }}
              />
              {errors.last_name && (
                <span style={styles.fieldError}>⚠ {errors.last_name}</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button type="submit" style={styles.saveBtn}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", paddingTop: "30px" },
  card: {
    background: "white", border: "1px solid #ddd", borderRadius: "6px",
    padding: "30px", width: "600px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  },
  title: {
    margin: "0 0 24px", fontSize: "18px", fontWeight: "600",
    color: "#1a237e", borderBottom: "1px solid #eee", paddingBottom: "12px"
  },
  row: { display: "flex", alignItems: "flex-start", marginBottom: "16px", gap: "16px" },
  label: { width: "120px", paddingTop: "10px", fontWeight: "500", color: "#333" },
  inputWrap: { flex: 1 },
  input: {
    width: "100%", padding: "9px 12px", border: "1px solid #ccc",
    borderRadius: "4px", fontSize: "14px", boxSizing: "border-box"
  },
  fieldError: { color: "#e53935", fontSize: "12px", marginTop: "4px", display: "block" },
  btnRow: { display: "flex", gap: "12px", marginTop: "8px" },
  saveBtn: {
    padding: "10px 28px", background: "#1565c0", color: "white",
    border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600"
  },
  cancelBtn: {
    padding: "10px 28px", border: "1px solid #ccc",
    borderRadius: "4px", background: "white", cursor: "pointer"
  },
  successBanner: {
    background: "#e8f5e9", color: "#2e7d32", padding: "12px 16px",
    borderRadius: "4px", marginBottom: "16px"
  },
  errorBanner: {
    background: "#ffebee", color: "#c62828", padding: "12px 16px",
    borderRadius: "4px", marginBottom: "16px"
  },
};