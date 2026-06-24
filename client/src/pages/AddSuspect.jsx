import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { validateSAID } from "../utils/saIdValidator";

export default function AddSuspect() {
  const [form, setForm]           = useState({ id_number: "", first_name: "", last_name: "" });
  const [errors, setErrors]       = useState({});
  const [success, setSuccess]     = useState("");
  const [serverError, setServerError] = useState("");
  const [addedSuspect, setAddedSuspect] = useState(null);
  const navigate = useNavigate();

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

    // Run validation first
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await API.post("/suspects", form);
      setAddedSuspect(res.data.suspect);
      setSuccess("Adding new record is successful");
      setForm({ id_number: "", first_name: "", last_name: "" });
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to add suspect");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Record New Suspect</h2>

        {serverError && <div style={styles.errorBanner}>{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>

          {/* ID Number field */}
          <div style={styles.row}>
            <label style={styles.label}>Suspect ID</label>
            <div style={styles.inputWrap}>
              <input
                name="id_number"
                placeholder="ID Number"
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

          {/* First Name field */}
          <div style={styles.row}>
            <label style={styles.label}>First Name</label>
            <div style={styles.inputWrap}>
              <input
                name="first_name"
                placeholder="First Name"
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

          {/* Last Name field */}
          <div style={styles.row}>
            <label style={styles.label}>Last Name</label>
            <div style={styles.inputWrap}>
              <input
                name="last_name"
                placeholder="Last Name"
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

          <button type="submit" style={styles.btn}>Submit</button>
        </form>

        {/* Success message + button to add criminal record */}
        {success && (
          <div style={styles.successBanner}>
            <span>{success}</span>
            <button
              style={styles.addRecordBtn}
              onClick={() => navigate("/add-record/" + addedSuspect.suspect_id)}
            >
              Add Criminal Record
            </button>
          </div>
        )}
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
    color: "#222", borderBottom: "1px solid #eee", paddingBottom: "12px"
  },
  row: { display: "flex", alignItems: "flex-start", marginBottom: "16px", gap: "16px" },
  label: { width: "120px", paddingTop: "10px", fontWeight: "500", color: "#333" },
  inputWrap: { flex: 1 },
  input: {
    width: "100%", padding: "9px 12px", border: "1px solid #ccc",
    borderRadius: "4px", fontSize: "14px", boxSizing: "border-box"
  },
  fieldError: { color: "#e53935", fontSize: "12px", marginTop: "4px", display: "block" },
  btn: {
    background: "#1565c0", color: "white", border: "none",
    padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontWeight: "600"
  },
  successBanner: {
    background: "#e8f5e9", color: "#2e7d32", padding: "12px 16px",
    borderRadius: "4px", marginTop: "16px", display: "flex",
    alignItems: "center", justifyContent: "space-between"
  },
  errorBanner: {
    background: "#ffebee", color: "#c62828", padding: "12px 16px",
    borderRadius: "4px", marginBottom: "16px"
  },
  addRecordBtn: {
    background: "#1b5e20", color: "white", border: "none",
    padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "13px"
  },
};