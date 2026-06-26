import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const PAGE_SIZE = 10; // records per page

export default function Dashboard() {
  const [suspects, setSuspects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [tab, setTab]           = useState("suspects");
  const [loading, setLoading]   = useState(true);
  const navigate                = useNavigate();

  // Search and pagination state
  const [suspectSearch, setSuspectSearch] = useState("");
  const [managerSearch, setManagerSearch] = useState("");
  const [suspectPage, setSuspectPage]     = useState(1);
  const [managerPage, setManagerPage]     = useState(1);
  const [suspectSort, setSuspectSort]     = useState({ col: "total_offences", dir: "desc" });

  useEffect(() => {
    Promise.all([
      API.get("/suspects"),
      API.get("/managers"),
    ]).then(([suspectRes, managerRes]) => {
      setSuspects(suspectRes.data);
      setManagers(managerRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // ── Filter suspects ──
  const filteredSuspects = suspects
    .filter((s) =>
      s.id_number.includes(suspectSearch) ||
      s.first_name.toLowerCase().includes(suspectSearch.toLowerCase()) ||
      s.last_name.toLowerCase().includes(suspectSearch.toLowerCase())
    )
    .sort((a, b) => {
      const dir = suspectSort.dir === "asc" ? 1 : -1;
      if (suspectSort.col === "total_offences") {
        return (a.total_offences - b.total_offences) * dir;
      }
      return a[suspectSort.col]?.localeCompare(b[suspectSort.col]) * dir;
    });

  const totalSuspectPages = Math.ceil(filteredSuspects.length / PAGE_SIZE);
  const pagedSuspects     = filteredSuspects.slice(
    (suspectPage - 1) * PAGE_SIZE,
    suspectPage * PAGE_SIZE
  );

  // ── Filter managers ──
  const filteredManagers = managers.filter((m) =>
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(managerSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(managerSearch.toLowerCase())
  );

  const totalManagerPages = Math.ceil(filteredManagers.length / PAGE_SIZE);
  const pagedManagers     = filteredManagers.slice(
    (managerPage - 1) * PAGE_SIZE,
    managerPage * PAGE_SIZE
  );

  function toggleSort(col) {
    setSuspectSort((prev) => ({
      col,
      dir: prev.col === col && prev.dir === "asc" ? "desc" : "asc",
    }));
    setSuspectPage(1);
  }

  function SortIcon({ col }) {
    if (suspectSort.col !== col) return <span style={{ color: "#aaa" }}> ↕</span>;
    return <span> {suspectSort.dir === "asc" ? "↑" : "↓"}</span>;
  }

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>;

  return (
    <div>
      <h2 style={styles.pageTitle}>Dashboard</h2>

      {/* ── Stats Row ── */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{suspects.length}</span>
          <span style={styles.statLabel}>Total Suspects</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>
            {suspects.reduce((sum, s) => sum + parseInt(s.total_offences), 0)}
          </span>
          <span style={styles.statLabel}>Total Records</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{managers.length}</span>
          <span style={styles.statLabel}>Case Managers</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>
            {managers.reduce((sum, m) => sum + parseInt(m.case_count), 0)}
          </span>
          <span style={styles.statLabel}>Cases Assigned</span>
        </div>
      </div>

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
          All Suspects ({suspects.length})
        </button>
        <button
          onClick={() => setTab("managers")}
          style={{
            ...styles.tabBtn,
            background: tab === "managers" ? "#1565c0" : "white",
            color:      tab === "managers" ? "white"   : "#1565c0",
          }}
        >
          Case Managers ({managers.length})
        </button>
      </div>

      {/* ── Suspects Tab ── */}
      {tab === "suspects" && (
        <div style={styles.tableWrap}>

          {/* Search bar */}
          <div style={styles.tableToolbar}>
            <input
              placeholder="Search by name or ID..."
              value={suspectSearch}
              onChange={(e) => { setSuspectSearch(e.target.value); setSuspectPage(1); }}
              style={styles.searchInput}
            />
            <span style={styles.resultCount}>
              Showing {pagedSuspects.length} of {filteredSuspects.length} suspects
            </span>
          </div>

          <div style={styles.scrollWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => toggleSort("id_number")}>
                    ID Number <SortIcon col="id_number" />
                  </th>
                  <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => toggleSort("first_name")}>
                    First Name <SortIcon col="first_name" />
                  </th>
                  <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => toggleSort("last_name")}>
                    Last Name <SortIcon col="last_name" />
                  </th>
                  <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => toggleSort("total_offences")}>
                    Offences <SortIcon col="total_offences" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedSuspects.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={styles.empty}>No suspects found</td>
                  </tr>
                ) : (
                  pagedSuspects.map((s, i) => (
                    <tr key={s.suspect_id} style={styles.tr}>
                      <td style={styles.td}>
                        {(suspectPage - 1) * PAGE_SIZE + i + 1}
                      </td>
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

          {/* Pagination */}
          {totalSuspectPages > 1 && (
            <Pagination
              page={suspectPage}
              total={totalSuspectPages}
              onChange={setSuspectPage}
            />
          )}
        </div>
      )}

      {/* ── Managers Tab ── */}
      {tab === "managers" && (
        <div style={styles.tableWrap}>

          {/* Search bar */}
          <div style={styles.tableToolbar}>
            <input
              placeholder="Search by name or email..."
              value={managerSearch}
              onChange={(e) => { setManagerSearch(e.target.value); setManagerPage(1); }}
              style={styles.searchInput}
            />
            <span style={styles.resultCount}>
              Showing {pagedManagers.length} of {filteredManagers.length} managers
            </span>
          </div>

          <div style={styles.scrollWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Manager Name", "Email", "Cases", "Action"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedManagers.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={styles.empty}>No managers found</td>
                  </tr>
                ) : (
                  pagedManagers.map((m) => (
                    <tr key={m.manager_id} style={styles.tr}>
                      <td style={styles.td}>{m.first_name} {m.last_name}</td>
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

          {/* Pagination */}
          {totalManagerPages > 1 && (
            <Pagination
              page={managerPage}
              total={totalManagerPages}
              onChange={setManagerPage}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── Pagination Component ──
function Pagination({ page, total, onChange }) {
  return (
    <div style={styles.pagination}>
      <button
        style={styles.pageBtn}
        disabled={page === 1}
        onClick={() => onChange(1)}
      >
        «
      </button>
      <button
        style={styles.pageBtn}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>

      {Array.from({ length: total }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === total || Math.abs(p - page) <= 1)
        .reduce((acc, p, i, arr) => {
          if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
          acc.push(p);
          return acc;
        }, [])
        .map((p, i) =>
          p === "..." ? (
            <span key={i} style={{ padding: "0 6px", color: "#999" }}>...</span>
          ) : (
            <button
              key={p}
              style={{
                ...styles.pageBtn,
                background: p === page ? "#1565c0" : "white",
                color:      p === page ? "white"   : "#333",
                fontWeight: p === page ? "700"     : "400",
              }}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          )
        )}

      <button
        style={styles.pageBtn}
        disabled={page === total}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
      <button
        style={styles.pageBtn}
        disabled={page === total}
        onClick={() => onChange(total)}
      >
        »
      </button>
    </div>
  );
}

const styles = {
  pageTitle: { color: "#1a237e", marginBottom: "20px" },
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px", marginBottom: "24px"
  },
  statCard: {
    background: "white", border: "1px solid #ddd", borderRadius: "8px",
    padding: "16px", display: "flex", flexDirection: "column",
    alignItems: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
  },
  statNumber: { fontSize: "32px", fontWeight: "800", color: "#1565c0" },
  statLabel:  { fontSize: "13px", color: "#666", marginTop: "4px" },
  tabRow: { display: "flex", marginBottom: "20px", flexWrap: "wrap", gap: "8px" },
  tabBtn: {
    padding: "10px 28px", cursor: "pointer", fontWeight: "600",
    border: "1px solid #1565c0", fontSize: "14px",
  },
  tableWrap: {
    background: "white", borderRadius: "6px", overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #ddd"
  },
  tableToolbar: {
    padding: "14px 16px", display: "flex", gap: "12px",
    alignItems: "center", borderBottom: "1px solid #eee",
    flexWrap: "wrap"
  },
  searchInput: {
    padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px",
    fontSize: "14px", width: "250px", maxWidth: "100%"
  },
  resultCount: { color: "#666", fontSize: "13px" },
  scrollWrap: { overflowX: "auto", WebkitOverflowScrolling: "touch" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "500px" },
  th: {
    background: "#e8eaf6", padding: "12px 16px", textAlign: "left",
    borderBottom: "2px solid #c5cae9", fontWeight: "600",
    fontSize: "14px", whiteSpace: "nowrap"
  },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "12px 16px", fontSize: "14px", whiteSpace: "nowrap" },
  empty: { padding: "30px", textAlign: "center", color: "#999", fontSize: "14px" },
  badge: {
    padding: "3px 12px", borderRadius: "12px",
    fontWeight: "700", fontSize: "13px", display: "inline-block"
  },
  viewBtn: {
    padding: "6px 16px", background: "#1565c0", color: "white",
    border: "none", borderRadius: "4px", cursor: "pointer",
    fontWeight: "600", fontSize: "13px"
  },
  pagination: {
    display: "flex", justifyContent: "center", alignItems: "center",
    gap: "4px", padding: "16px"
  },
  pageBtn: {
    padding: "6px 12px", border: "1px solid #ddd", borderRadius: "4px",
    cursor: "pointer", background: "white", fontSize: "14px",
    color: "#333", minWidth: "36px"
  },
};