export default function Spinner() {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Loading...</p>
    </div>
  );
}

const styles = {
  container: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "60px"
  },
  spinner: {
    width: "48px", height: "48px",
    border: "5px solid #e8eaf6",
    borderTop: "5px solid #1565c0",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  text: { marginTop: "16px", color: "#666", fontSize: "14px" },
};

// Inject the CSS animation into the page
const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);