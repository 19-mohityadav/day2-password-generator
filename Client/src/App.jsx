import { useState, useEffect } from "react";

function App() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
    generatePassword();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/passwords");
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistory([]);
    }
  };

  const generatePassword = () => {
    let chars = "";
    if (includeLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
  };

  const savePassword = async () => {
    try {
      await fetch("/api/passwords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, length }),
      });
      fetchHistory();
    } catch (error) {
      console.error("Error saving password:", error);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  };

  const getStrength = () => {
    if (length < 8) return { text: "Weak", color: "#dc3545" };
    if (length < 12) return { text: "Medium", color: "#ffc107" };
    return { text: "Strong", color: "#28a745" };
  };

  // 🆕 DELETE SINGLE HISTORY ITEM
  const deleteHistory = async (id) => {
    try {
      await fetch(`/api/passwords/${id}`, { method: "DELETE" });
      setHistory((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting password:", error);
    }
  };

  const strength = getStrength();

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        🔐 Password Generator
      </h1>

      <div className="card">
        <h2>Generated Password</h2>

        <div
          style={{
            padding: "20px",
            background: "#f8f9fa",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "20px",
            wordBreak: "break-all",
            marginBottom: "15px",
          }}
        >
          {password}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>Strength: </strong>
          <span style={{ color: strength.color, fontWeight: "bold" }}>
            {strength.text}
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={generatePassword} style={{ flex: 1 }}>
            🔄 Generate
          </button>
          <button
            onClick={copyPassword}
            style={{ flex: 1, backgroundColor: "#007bff" }}
          >
            📋 Copy
          </button>
          <button
            onClick={savePassword}
            style={{ flex: 1, backgroundColor: "#28a745" }}
          >
            💾 Save
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Options</h3>

        <div style={{ marginBottom: "15px" }}>
          <label>Length: {length}</label>
          <input
            type="range"
            min="4"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <label className="option-label">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
            />
            Uppercase
          </label>

          <label className="option-label">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
            />
            Lowercase
          </label>

          <label className="option-label">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
            Numbers
          </label>

          <label className="option-label">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
            Symbols
          </label>
        </div>
      </div>

      {history.length > 0 && (
        <div className="card">
          <h3>History ({history.length})</h3>

          {history
            .slice(-5)
            .reverse()
            .map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  background: "#f8f9fa",
                  borderRadius: "4px",
                  marginBottom: "10px",
                  fontFamily: "monospace",
                }}
              >
                <span>{p.password}</span>

                {/* 🆕 DELETE BUTTON */}
                <button
                  onClick={() => deleteHistory(p.id)}
                  style={{
                    background: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;
