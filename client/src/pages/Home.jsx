import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";

const PAGE_SIZE = 5;

export default function Home() {
  const [query, setQuery]       = useState("");
  const [result, setResult]     = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [recordPage, setRecordPage] = useState(1);
  const navigate                = useNavigate();

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setRecordPage(1);
    try {
      const res = await API.get("/suspects/search?id_number=" + query.trim());
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSuspect(suspectId) {
    if (!window.confirm("Are you sure you want to delete this suspect and ALL their records? This cannot be undone.")) return;
    try {
      await API.delete("/suspects/" + suspectId);
      setResult(null);
      setQuery("");
      alert("Suspect deleted successfully");
    } catch (err) {
      alert("Failed to delete suspect");
    }
  }

  async function handleDeleteRecord(recordId) {
    if (!window.confirm("Are you sure you want to delete this criminal record?")) return;
    try {
      await API.delete("/records/" + recordId);
      const res = await API.get("/suspects/search?id_number=" + query.trim());
      setResult(res.data);
    } catch (err) {
      alert("Failed to delete record");
    }
  }

  function handlePrint() {
    window.print();
  }

  // Pagination for records
  const totalRecordPages = result
    ? Math.ceil(result.records.length / PAGE_SIZE)
    : 1;
  const pagedRecords = result
    ? result.records.slice(
        (recordPage - 1) * PAGE_SIZE,
        recordPage * PAGE_SIZE
      )
    : [];

  function statusColor(status) {
    if (status === "Open")    return { background: "#ffebee", color: "#c62828" };
    if (status === "Pending") return { background: "#fff3e0", color: "#e65100" };
    if (status === "Closed")  return { background: "#e8f5e9", color: "#2e7d32" };
    return {};
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>Search Criminal Record</h2>

      {/* ── Search Bar ── */}
      <form onSubmit={handleSearch} style={styles.searchRow}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by ID number"
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchBtn} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {loading && <Spinner />}

      {/* ── Not Found ── */}
      {notFound && (
        <div style={styles.notFound}>
          <span>
            No criminal record found for <strong>{query}</strong>
          </span>
          <button
            style={styles.newRecordBtn}
            onClick={() => navigate("/add-suspect")}
          >
            + New Suspect
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {result && (
        <div style={styles.resultsGrid}>

          {/* ── Suspect Details ── */}
          <div style={styles.suspectCard}>
            <h3 style={styles.cardTitle}>Suspect Details</h3>

            <div style={styles.infoGrid}>
              <InfoRow label="Suspect No" value={result.suspect.suspect_id} />
              <InfoRow label="ID Number"  value={result.suspect.id_number} />
              <InfoRow label="First Name" value={result.suspect.first_name} />
              <InfoRow label="Last Name"  value={result.suspect.last_name} />
              <InfoRow
                label="Added"
                value={new Date(result.suspect.created_at).toLocaleDateString()}
              />
            </div>

            <div style={styles.actionRow}>
              <button
                style={styles.editIconBtn}
                onClick={() => {
                  localStorage.setItem(
                    "editSuspect",
                    JSON.stringify(result.suspect)
                  );
                  navigate("/edit-suspect/" + result.suspect.suspect_id);
                }}
              >
                ✏️ Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDeleteSuspect(result.suspect.suspect_id)}
              >
                🗑️ Delete
              </button>
              <button style={styles.printBtn} onClick={handlePrint}>
                🖨️ Print
              </button>
            </div>
          </div>

          {/* ── Criminal Records ── */}
          <div style={styles.recordsCard}>
            <div style={styles.recordsHeader}>
              <h3 style={{ ...styles.cardTitle, marginBottom: 0, borderBottom: "none" }}>
                Criminal Records ({result.records.length})
              </h3>
              <button
                style={styles.newRecordBtn}
                onClick={() =>
                  navigate("/add-record/" + result.suspect.suspect_id)
                }
              >
                + New Record
              </button>
            </div>

            <div style={{ borderBottom: "1px solid #eee", marginBottom: "16px" }} />

            {result.records.length === 0 ? (
              <p style={{ color: "#666", fontSize: "14px" }}>
                No criminal records found for this suspect.
              </p>
            ) : (
              <>
                {/* Scrollable table */}
                <div style={styles.tableScroll}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        {[
                          "ID", "Offence", "Sentence", "Status",
                          "Issued At", "Issued By", "Date", "Manager", "Actions"
                        ].map((h) => (
                          <th key={h} style={styles.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pagedRecords.map((r) => (
                        <tr key={r.record_id} style={styles.tr}>
                          <td style={styles.td}>{r.record_id}</td>
                          <td style={styles.td}>{r.offence_name}</td>
                          <td style={styles.td}>{r.sentence} yrs</td>
                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.statusBadge,
                                ...statusColor(r.status),
                              }}
                            >
                              {r.status || "Open"}
                            </span>
                          </td>
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
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button
                                style={styles.editIconBtn}
                                onClick={() => {
                                  localStorage.setItem(
                                    "editRecord",
                                    JSON.stringify(r)
                                  );
                                  navigate("/edit-record/" + r.record_id);
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                style={styles.deleteIconBtn}
                                onClick={() => handleDeleteRecord(r.record_id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalRecordPages > 1 && (
                  <div style={styles.pagination}>
                    <button
                      style={styles.pageBtn}
                      disabled={recordPage === 1}
                      onClick={() => setRecordPage(recordPage - 1)}
                    >
                      ‹ Prev
                    </button>
                    <span style={{ fontSize: "14px", color: "#666" }}>
                      Page {recordPage} of {totalRecordPages}
                    </span>
                    <button
                      style={styles.pageBtn}
                      disabled={recordPage === totalRecordPages}
                      onClick={() => setRecordPage(recordPage + 1)}
                    >
                      Next ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
      <span style={{ width: "100px", color: "#666", fontSize: "14px", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontWeight: "500", fontSize: "14px", wordBreak: "break-all" }}>
        {value}
      </span>
    </div>
  );
}

const styles = {
  pageTitle: { color: "#1a237e", marginBottom: "20px" },
  searchRow: {
    display: "flex", gap: "8px",
    marginBottom: "20px", flexWrap: "wrap"
  },
  searchInput: {
    padding: "9px 14px", border: "1px solid #ccc", borderRadius: "4px",
    flex: 1, minWidth: "200px", fontSize: "14px"
  },
  searchBtn: {
    padding: "9px 24px", background: "#1565c0", color: "white",
    border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600"
  },
  notFound: {
    background: "#fff3e0", border: "1px solid #ffe0b2",
    padding: "14px 20px", borderRadius: "4px",
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px", flexWrap: "wrap", gap: "10px"
  },

  // Stack vertically on all screens — clean on mobile and desktop
  resultsGrid: {
    display: "flex", flexDirection: "column", gap: "20px"
  },

  suspectCard: {
    background: "white", border: "1px solid #ddd",
    padding: "20px", borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  },
  recordsCard: {
    background: "white", border: "1px solid #ddd",
    padding: "20px", borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  },
  infoGrid: { marginBottom: "8px" },
  recordsHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: "10px",
    marginBottom: "0"
  },
  cardTitle: {
    margin: "0 0 16px", fontSize: "15px", color: "#1a237e",
    borderBottom: "1px solid #eee", paddingBottom: "10px"
  },

  // Key fix — horizontal scroll on the table only
  tableScroll: {
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    marginBottom: "8px"
  },
  table: {
    width: "100%", borderCollapse: "collapse",
    fontSize: "13px", minWidth: "700px"
  },
  th: {
    background: "#e8eaf6", padding: "9px 10px", textAlign: "left",
    borderBottom: "2px solid #c5cae9", whiteSpace: "nowrap"
  },
  tr:  { borderBottom: "1px solid #eee" },
  td:  { padding: "9px 10px", whiteSpace: "nowrap" },
  actionRow: {
    display: "flex", gap: "8px", marginTop: "16px",
    paddingTop: "12px", borderTop: "1px solid #eee", flexWrap: "wrap"
  },
  editIconBtn: {
    background: "none", border: "1px solid #ccc", cursor: "pointer",
    fontSize: "13px", padding: "4px 10px", borderRadius: "4px"
  },
  deleteBtn: {
    background: "none", border: "1px solid #e53935", cursor: "pointer",
    fontSize: "13px", padding: "4px 10px", borderRadius: "4px", color: "#e53935"
  },
  deleteIconBtn: {
    background: "none", border: "none", cursor: "pointer", fontSize: "16px"
  },
  printBtn: {
    background: "none", border: "1px solid #1565c0", cursor: "pointer",
    fontSize: "13px", padding: "4px 10px", borderRadius: "4px", color: "#1565c0"
  },
  newRecordBtn: {
    background: "#388e3c", color: "white", border: "none",
    padding: "8px 16px", borderRadius: "4px",
    cursor: "pointer", fontWeight: "600", fontSize: "13px"
  },
  statusBadge: {
    padding: "3px 10px", borderRadius: "12px",
    fontWeight: "600", fontSize: "12px", display: "inline-block"
  },
  pagination: {
    display: "flex", justifyContent: "center",
    alignItems: "center", gap: "12px", padding: "16px 0 4px"
  },
  pageBtn: {
    padding: "6px 14px", border: "1px solid #ddd", borderRadius: "4px",
    cursor: "pointer", background: "white", fontSize: "13px"
  },
};