import React, { useState, useEffect } from "react";

const API =process.env.REACT_APP_API_URL

export default function AgentDashboard({ token }) {
  const [tickets, setTickets] = useState([]);
  const [reply, setReply] = useState({});

  // Fetch tickets needing human response
  const fetchTickets = async () => {
    const res = await fetch(`${API}/api/human/tickets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTickets(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const sendReply = async (id) => {
    if (!reply[id]) return alert("Reply cannot be empty!");

    const res = await fetch(`${API}/api/tickets/${id}/human-reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reply: reply[id] }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTickets(tickets.filter(t => t._id !== id));
      setReply({ ...reply, [id]: "" });
    } else {
      alert("Failed to send reply");
    }
  };

  return (
    <div style={styles.card}>
      <h2>🎧 Human Agent Panel</h2>
      {tickets.length === 0 && <div>No tickets require your attention</div>}

      {tickets.map((t) => (
        <div key={t._id} style={styles.ticket}>
          <b>{t.title}</b> <span style={{ opacity: 0.6 }}>({t.status})</span>
          <p>{t.description}</p>
          {t.draft && (
            <div style={styles.draft}>
              <b>Bot Suggestion:</b> {t.draft}
            </div>
          )}
          <textarea
            style={{ ...styles.input, height: 70 }}
            placeholder="Write response..."
            value={reply[t._id] || ""}
            onChange={(e) => setReply({ ...reply, [t._id]: e.target.value })}
          />
          <button style={styles.btn} onClick={() => sendReply(t._id)}>
            ✅ Resolve
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    background: "#fff",
  },
  ticket: {
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    background: "#fafafa",
  },
  draft: { padding: 8, background: "#f0f0f0", borderRadius: 6, margin: "6px 0" },
  input: { padding: 10, width: "100%", border: "1px solid #ccc", borderRadius: 8, marginTop: 6 },
  btn: {
    padding: "8px 12px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 6,
  },
};
