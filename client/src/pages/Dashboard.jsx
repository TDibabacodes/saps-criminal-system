import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Dashboard() {
  const [suspects, setSuspects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [tab, setTab]           = useState("suspects");
  const [loading, setLoading]   = useState(true);
  const navigate                = useNavigate();

  useEffect(() => {
    // Load both suspects and managers when page opens
    Promise.all([
      API.get("/suspects"),
      API.get("/managers"),
    ]).then(([suspectRes, managerRes]) => {
      setSuspects(suspectRes.data);
      setManagers(managerRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>;

  return (
    <div>
      <h2 style={styles.pageTitle}>Dashboard</h2>

      {/* ── Tab Buttons ── */}
      <div style={styles.tabRow}>
        <button
          onClick={() => setTab("suspects")}
          style={{
            ...styles.tabBtn,
            background: tab === "suspects" ? "#1565c0" : "white",
            color:      tab === "suspects" ? "white"   : "#1565c0",
          }}
        >
          All Suspects
        </button>
        <button
          onClick={() => setTab("managers")}
          style={{
            ...styles.tabBtn,
            background: tab === "managers" ? "#1565c0" : "white",
            color:      tab === "managers" ? "white"   : "#1565c0",
          }}
        >
          Case Managers
        </button>
      </div>

      {/* ── Suspects Tab ── */}
      {tab === "suspects" && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["#", "ID Number", "First Name", "Last Name", "Total Offences"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suspects.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.empty}>No suspects found</td>
                </tr>
              ) : (
                suspects.map((s, i) => (
                  <tr key={s.suspect_id} style={styles.tr}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>{s.id_number}</td>
                    <td style={styles.td}>{s.first_name}</td>
                    <td style={styles.td}>{s.last_name}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: s.total_offences > 2 ? "#ffebee" : "#e8f5e9",
                        color:      s.total_offences > 2 ? "#c62828" : "#2e7d32",
                      }}>
                        {s.total_offences}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Managers Tab ── */}
      {tab === "managers" && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Manager Name", "Email", "Cases Assigned", "Action"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {managers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={styles.empty}>No managers found</td>
                </tr>
              ) : (
                managers.map((m) => (
                  <tr key={m.manager_id} style={styles.tr}>
                    <td style={styles.td}>
                      {m.first_name} {m.last_name}
                    </td>
                    <td style={styles.td}>{m.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: m.case_count > 0 ? "#e3f2fd" : "#f5f5f5",
                        color:      m.case_count > 0 ? "#1565c0" : "#999",
                      }}>
                        {m.case_count}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.viewBtn}
                        onClick={() => navigate("/manager/" + m.manager_id)}
                      >
                        View Cases
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageTitle: { color: "#1a237e", marginBottom: "20px" },
  tabRow: { display: "flex", marginBottom: "20px" },
  tabBtn: {
    padding: "10px 28px", cursor: "pointer", fontWeight: "600",
    border: "1px solid #1565c0", fontSize: "14px",
  },
  tableWrap: {
    background: "white", borderRadius: "6px", overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #ddd"
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    background: "#e8eaf6", padding: "12px 16px",
    textAlign: "left", borderBottom: "2px solid #c5cae9",
    fontWeight: "600", fontSize: "14px"
  },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "12px 16px", fontSize: "14px" },
  empty: {
    padding: "30px", textAlign: "center",
    color: "#999", fontSize: "14px"
  },
  badge: {
    padding: "3px 12px", borderRadius: "12px",
    fontWeight: "700", fontSize: "13px", display: "inline-block"
  },
  viewBtn: {
    padding: "6px 16px", background: "#1565c0", color: "white",
    border: "none", borderRadius: "4px", cursor: "pointer",
    fontWeight: "600", fontSize: "13px"
  },
};