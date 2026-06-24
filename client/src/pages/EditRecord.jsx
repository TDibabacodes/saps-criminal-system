import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function EditRecord() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [offences, setOffences] = useState([]);
  const [form, setForm]         = useState({
    offence_id: "", sentence: "",
    issued_at: "", issued_by: "", issue_date: ""
  });
  const [success, setSuccess]         = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]         = useState(true);

  // Load offences dropdown and the existing record data
  useEffect(() => {
    // Load offences for the dropdown
    API.get("/records/offences").then((res) => setOffences(res.data));

    // Load the existing record data to pre-fill the form
    API.get("/records/" + id)
      .then((res) => {
        const rec = res.data;
        setForm({
          offence_id: rec.offence_id,
          sentence:   rec.sentence,
          issued_at:  rec.issued_at,
          issued_by:  rec.issued_by,
          issue_date: rec.issue_date?.split("T")[0] || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setServerError("Failed to load record");
        setLoading(false);
      });
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setServerError("");
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
      setServerError(validationError);
      return;
    }

    try {
      await API.put("/records/" + id, form);
      setSuccess("Record updated successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Update failed");
    }
  }

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Criminal Record</h2>

        {serverError && <div style={styles.errorBanner}>{serverError}</div>}
        {success     && <div style={styles.successBanner}>{success}</div>}

        <form onSubmit={handleSubmit} noValidate>

          {/* Offence dropdown */}
          <div style={styles.row}>
            <label style={styles.label}>Offence</label>
            <select
              name="offence_id"
              value={form.offence_id}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Offence</option>
              {offences.map((o) => (
                <option key={o.offence_id} value={o.offence_id}>
                  {o.offence_name}
                </option>
              ))}
            </select>
          </div>

          {/* Sentence */}
          <div style={styles.row}>
            <label style={styles.label}>Sentence (years)</label>
            <input
              name="sentence"
              type="number"
              min="0"
              step="0.5"
              value={form.sentence}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Issued At */}
          <div style={styles.row}>
            <label style={styles.label}>Issued At</label>
            <input
              name="issued_at"
              value={form.issued_at}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Issued By */}
          <div style={styles.row}>
            <label style={styles.label}>Issued By</label>
            <input
              name="issued_by"
              value={form.issued_by}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Issue Date */}
          <div style={styles.row}>
            <label style={styles.label}>Issue Date</label>
            <input
              name="issue_date"
              type="date"
              value={form.issue_date}
              onChange={handleChange}
              style={styles.input}
            />
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
  row: { display: "flex", alignItems: "center", marginBottom: "16px", gap: "16px" },
  label: { width: "130px", fontWeight: "500", color: "#333", fontSize: "14px" },
  input: {
    flex: 1, padding: "9px 12px", border: "1px solid #ccc",
    borderRadius: "4px", fontSize: "14px", boxSizing: "border-box"
  },
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