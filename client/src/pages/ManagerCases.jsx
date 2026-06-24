import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function ManagerCases() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    API.get("/managers/" + id + "/cases")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load cases");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>;
  if (error)   return <p style={{ padding: "30px", color: "red" }}>{error}</p>;

  return (
    <div>

      {/* Back button */}
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back to Dashboard
      </button>

      {/* Manager info */}
      <div style={styles.managerCard}>
        <h2 style={styles.managerName}>
          {data.manager.first_name} {data.manager.last_name}
        </h2>
        <p style={styles.managerEmail}>{data.manager.email}</p>
        <span style={styles.caseCount}>
          {data.cases.length} case{data.cases.length !== 1 ? "s" : ""} assigned
        </span>
      </div>

      {/* Cases table */}
      {data.cases.length === 0 ? (
        <div style={styles.empty}>
          No cases assigned to this manager yet.
        </div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Record ID", "Suspect Name", "ID Number",
                  "Offence", "Sentence", "Issued At", "Issued By", "Date"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.cases.map((c) => (
                <tr key={c.record_id} style={styles.tr}>
                  <td style={styles.td}>{c.record_id}</td>
                  <td style={styles.td}>{c.first_name} {c.last_name}</td>
                  <td style={styles.td}>{c.id_number}</td>
                  <td style={styles.td}>{c.offence_name}</td>
                  <td style={styles.td}>{c.sentence} yrs</td>
                  <td style={styles.td}>{c.issued_at}</td>
                  <td style={styles.td}>{c.issued_by}</td>
                  <td style={styles.td}>{c.issue_date?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  backBtn: {
    background: "none", border: "1px solid #ccc", padding: "8px 16px",
    borderRadius: "4px", cursor: "pointer", marginBottom: "20px",
    fontSize: "14px", color: "#333"
  },
  managerCard: {
    background: "white", border: "1px solid #ddd", borderRadius: "6px",
    padding: "20px", marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  },
  managerName: { margin: "0 0 4px", color: "#1a237e" },
  managerEmail: { margin: "0 0 12px", color: "#666", fontSize: "14px" },
  caseCount: {
    background: "#e3f2fd", color: "#1565c0", padding: "4px 14px",
    borderRadius: "12px", fontWeight: "700", fontSize: "13px"
  },
  tableWrap: {
    background: "white", borderRadius: "6px", overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #ddd"
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    background: "#e8eaf6", padding: "11px 14px", textAlign: "left",
    borderBottom: "2px solid #c5cae9", fontWeight: "600",
    fontSize: "13px", whiteSpace: "nowrap"
  },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "11px 14px", fontSize: "13px", whiteSpace: "nowrap" },
  empty: {
    background: "white", padding: "30px", textAlign: "center",
    color: "#999", borderRadius: "6px", border: "1px solid #ddd"
  },
};