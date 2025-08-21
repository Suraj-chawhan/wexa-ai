import React, { useState, useEffect } from "react";
import { Trash2, PlusCircle } from "lucide-react";

const API =process.env.REACT_APP_API_URL;


export default function AdminDashboard({ token }) {
  const [kb, setKb] = useState([]);
  const [newKB, setNewKB] = useState({ title: "", body: "", tags: "" });

  useEffect(() => {
    (async () => {
      const r = await fetch(`${API}/api/kb`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKb(r.ok ? await r.json() : []);
    })();
  }, [token]);

  const addKB = async () => {
    if (!newKB.title || !newKB.body) return alert("Title and Body are required!");
    const r = await fetch(`${API}/api/kb`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...newKB,
        tags: newKB.tags.split(",").map((s) => s.trim()),
      }),
    });
    if (r.ok) setKb([await r.json(), ...kb]);
    setNewKB({ title: "", body: "", tags: "" });
  };

  const deleteKB = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    const r = await fetch(`${API}/api/kb/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (r.ok) setKb(kb.filter((k) => k._id !== id && k.id !== id));
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📚 Knowledge Base Management</h2>

        {/* Form */}
        <input
          style={styles.input}
          placeholder="Title"
          value={newKB.title}
          onChange={(e) => setNewKB({ ...newKB, title: e.target.value })}
        />
        <textarea
          style={{ ...styles.input, height: 80 }}
          placeholder="Body"
          value={newKB.body}
          onChange={(e) => setNewKB({ ...newKB, body: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Tags (comma separated)"
          value={newKB.tags}
          onChange={(e) => setNewKB({ ...newKB, tags: e.target.value })}
        />

        <button style={styles.btn} onClick={addKB}>
          <PlusCircle size={16} /> Add KB
        </button>
      </div>

      {/* Existing Articles */}
      <div style={styles.card}>
        <h3 style={styles.subheading}>📖 Existing Articles</h3>
        {kb.length === 0 && <div style={styles.empty}>No KB found</div>}
        {kb.map((k) => (
          <div key={k._id || k.id} style={styles.listItem}>
            <div style={{ flex: 1 }}>
              <b style={styles.title}>{k.title}</b>
              <p style={styles.body}>{k.body}</p>
              <small style={styles.tags}>
                {Array.isArray(k.tags) ? k.tags.join(", ") : ""}
              </small>
            </div>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteKB(k._id || k.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: 800,
    margin: "20px auto",
    padding: "0 16px",
    fontFamily: "system-ui, sans-serif",
    color: "#111",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  heading: {
    marginBottom: 12,
    fontSize: "1.4rem",
    fontWeight: "600",
  },
  subheading: {
    marginBottom: 12,
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  input: {
    padding: 10,
    margin: "6px 0",
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: "0.95rem",
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    padding: "10px 16px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "500",
  },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottom: "1px solid #f3f4f6",
    padding: "12px 0",
  },
  title: { fontSize: "1rem", fontWeight: "600" },
  body: { fontSize: "0.9rem", margin: "4px 0" },
  tags: { color: "#6b7280", fontSize: "0.8rem" },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    padding: 4,
    borderRadius: 6,
  },
  empty: { color: "#6b7280", fontSize: "0.9rem" },
};
