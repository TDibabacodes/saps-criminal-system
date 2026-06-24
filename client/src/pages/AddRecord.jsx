import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function AddRecord() {
  const { suspectId } = useParams();
  const navigate      = useNavigate();

  const [offences, setOffences] = useState([]);
  const [form, setForm]         = useState({
    suspect_id: suspectId,
    offence_id: "",
    sentence:   "",
    issued_at:  "",
    issued_by:  "",
    issue_date: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // Load offences from database when page opens
  useEffect(() => {
    API.get("/records/offences")
      .then((res) => setOffences(res.data))
      .catch(() => setError("Failed to load offences"));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function validate() {
    if (!form.offence_id) return "Please select an offence";
    if (!form.sentence)   return "Sentence is required";
    if (!form.issued_at)  return "Issued At is required";
    if (!form.issued_by)  return "Issued By is required";
    if (!form.issue_date) return "Issue Date is required";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await API.post("/records", form);
      navigate("/"); // redirect to search page after saving
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save record");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.header}>
          <span>New Criminal Record</span>
          <button onClick={() => navigate(-1)} style={styles.closeX}>✕</button>
        </div>

        {/* Error message */}
        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Offence dropdown — loaded from database */}
          <Row label="Offence committed">
            <select
              name="offence_id"
              value={form.offence_id}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Criminal Offence</option>
              {offences.map((o) => (
                <option key={o.offence_id} value={o.offence_id}>
                  {o.offence_name}
                </option>
              ))}
            </select>
          </Row>

          {/* Sentence — number only, no letters allowed */}
          <Row label="Sentence (years)">
            <input
              name="sentence"
              type="number"
              min="0"
              step="0.5"
              placeholder="Sentence in Years"
              value={form.sentence}
              onChange={handleChange}
              style={styles.input}
            />
          </Row>

          {/* Issued At */}
          <Row label="Issued At">
            <input
              name="issued_at"
              placeholder="e.g. Pretoria Court"
              value={form.issued_at}
              onChange={handleChange}
              style={styles.input}
            />
          </Row>

          {/* Issued By */}
          <Row label="Issued By">
            <input
              name="issued_by"
              placeholder="e.g. Adv Dali Mpofu"
              value={form.issued_by}
              onChange={handleChange}
              style={styles.input}
            />
          </Row>

          {/* Issue Date — date picker */}
          <Row label="Issue Date">
            <input
              name="issue_date"
              type="date"
              value={form.issue_date}
              onChange={handleChange}
              style={styles.input}
            />
          </Row>

          {/* Buttons */}
          <div style={styles.footer}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.closeBtn}
            >
              Close
            </button>
            <button
              type="submit"
              style={styles.saveBtn}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Reusable row layout for each form field
function Row({ label, children }) {
  return (
    <div style={styles.row}>
      <label style={styles.label}>{label}</label>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
  },
  modal: {
    background: "white", borderRadius: "6px", width: "520px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)", overflow: "hidden"
  },
  header: {
    background: "#1a237e", color: "white", padding: "14px 20px",
    display: "flex", justifyContent: "space-between",
    alignItems: "center", fontWeight: "600"
  },
  closeX: {
    background: "none", border: "none", color: "white",
    fontSize: "18px", cursor: "pointer"
  },
  form: { padding: "20px" },
  row: {
    display: "flex", alignItems: "center",
    marginBottom: "14px", gap: "16px"
  },
  label: { width: "130px", fontWeight: "500", color: "#333", fontSize: "14px" },
  input: {
    width: "100%", padding: "9px 12px", border: "1px solid #ccc",
    borderRadius: "4px", fontSize: "14px", boxSizing: "border-box"
  },
  footer: {
    display: "flex", justifyContent: "flex-end",
    gap: "10px", marginTop: "20px"
  },
  closeBtn: {
    padding: "8px 20px", border: "1px solid #ccc",
    borderRadius: "4px", background: "white", cursor: "pointer"
  },
  saveBtn: {
    padding: "8px 20px", background: "#1565c0", color: "white",
    border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600"
  },
  errorBanner: {
    background: "#ffebee", color: "#c62828",
    padding: "10px 20px", fontSize: "14px"
  },
};