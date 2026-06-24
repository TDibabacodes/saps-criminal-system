import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Home() {
  const [query, setQuery]       = useState("");
  const [result, setResult]     = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const res = await API.get("/suspects/search?id_number=" + query.trim());
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>Search Criminal Record</h2>

      {/* ── Search Bar ── */}
      <form onSubmit={handleSearch} style={styles.searchRow}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by ID"
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchBtn} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* ── Not Found Message ── */}
      {notFound && (
        <div style={styles.notFound}>
          <span>No criminal record found for <strong>{query}</strong></span>
          <button
            style={styles.newRecordBtn}
            onClick={() => navigate("/add-suspect")}
          >
            + New Suspect
          </button>
        </div>
      )}

      {/* ── Results: Suspect + Records ── */}
      {result && (
        <div style={styles.resultsGrid}>

          {/* Left side: suspect personal details */}
          <div style={styles.suspectCard}>
            <h3 style={styles.cardTitle}>Suspect Details</h3>
            <InfoRow label="Suspect No" value={result.suspect.suspect_id} />
            <InfoRow label="ID Number"  value={result.suspect.id_number} />
            <InfoRow label="First Name" value={result.suspect.first_name} />
            <InfoRow label="Last Name"  value={result.suspect.last_name} />

            <div style={styles.editRow}>
              <span style={{ fontWeight: "600", fontSize: "14px" }}>Edit Suspect</span>
              <button
                style={styles.editIconBtn}
                onClick={() => {
                  localStorage.setItem("editSuspect", JSON.stringify(result.suspect));
                  navigate("/edit-suspect/" + result.suspect.suspect_id);
                }}
              >
                ✏️
              </button>
            </div>
          </div>

          {/* Right side: criminal records table */}
          <div style={styles.recordsCard}>
            <h3 style={styles.cardTitle}>Criminal Records</h3>

            {result.records.length === 0 ? (
              <p style={{ color: "#666", fontSize: "14px" }}>
                No criminal records found for this suspect.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {["Record ID", "Offence", "Sentence", "Issued At",
                        "Issued By", "Date Issued", "Manager", "Edit"].map((h) => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.records.map((r) => (
                      <tr key={r.record_id} style={styles.tr}>
                        <td style={styles.td}>{r.record_id}</td>
                        <td style={styles.td}>{r.offence_name}</td>
                        <td style={styles.td}>{r.sentence} yrs</td>
                        <td style={styles.td}>{r.issued_at}</td>
                        <td style={styles.td}>{r.issued_by}</td>
                        <td style={styles.td}>
                          {r.issue_date?.split("T")[0]}
                        </td>
                        <td style={styles.td}>
                          {r.manager_first
                            ? `${r.manager_first} ${r.manager_last}`
                            : "—"}
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.editIconBtn}
                            onClick={() => {
                              localStorage.setItem("editRecord", JSON.stringify(r));
                              navigate("/edit-record/" + r.record_id);
                            }}
                          >
                            ✏️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Button to add another record for this suspect */}
            <button
              style={styles.newRecordBtn}
              onClick={() => navigate("/add-record/" + result.suspect.suspect_id)}
            >
              + New Criminal Record
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

// Small helper component for the suspect detail rows
function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
      <span style={{ width: "100px", color: "#666", fontSize: "14px" }}>{label}</span>
      <span style={{ fontWeight: "500", fontSize: "14px" }}>{value}</span>
    </div>
  );
}

const styles = {
  pageTitle: { color: "#1a237e", marginBottom: "20px" },
  searchRow: { display: "flex", gap: "8px", marginBottom: "20px" },
  searchInput: {
    padding: "9px 14px", border: "1px solid #ccc",
    borderRadius: "4px", width: "300px", fontSize: "14px"
  },
  searchBtn: {
    padding: "9px 24px", background: "#1565c0", color: "white",
    border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600"
  },
  notFound: {
    background: "#fff3e0", border: "1px solid #ffe0b2",
    padding: "14px 20px", borderRadius: "4px",
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: "20px"
  },
  resultsGrid: {
    display: "grid", gridTemplateColumns: "260px 1fr", gap: "20px"
  },
  suspectCard: {
    background: "white", border: "1px solid #ddd",
    padding: "20px", borderRadius: "6px", height: "fit-content",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  },
  recordsCard: {
    background: "white", border: "1px solid #ddd",
    padding: "20px", borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  },
  cardTitle: {
    margin: "0 0 16px", fontSize: "15px",
    color: "#1a237e", borderBottom: "1px solid #eee", paddingBottom: "10px"
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "16px" },
  th: {
    background: "#e8eaf6", padding: "9px 10px",
    textAlign: "left", borderBottom: "2px solid #c5cae9", whiteSpace: "nowrap"
  },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "9px 10px", whiteSpace: "nowrap" },
  editRow: {
    display: "flex", alignItems: "center",
    gap: "8px", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #eee"
  },
  editIconBtn: {
    background: "none", border: "none", cursor: "pointer", fontSize: "16px"
  },
  newRecordBtn: {
    background: "#388e3c", color: "white", border: "none",
    padding: "8px 16px", borderRadius: "4px",
    cursor: "pointer", fontWeight: "600", fontSize: "13px"
  },
};