// src/components/UserDashboard.jsx
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Trash2 } from "lucide-react";
import gsap from "gsap";
import "./UserDashboard.css";


const API =process.env.REACT_APP_API_URL

export default function UserDashboard({ token }) {
  const [tickets, setTickets] = useState([]);
  const [audits, setAudits] = useState({});
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({ title: "", description: "" });
  const [posting, setPosting] = useState(false);
  const ticketsRef = useRef([]);

  // ✅ Reset refs every render
  ticketsRef.current = [];

  const fetchTicketsAndAudits = async () => {
    setLoading(true);
    try {
      const tR = await fetch(`${API}/api/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const t = await tR.json();
      setTickets(Array.isArray(t) ? t : []);

      const aR = await fetch(`${API}/api/audits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const a = await aR.json();
      const grouped = (Array.isArray(a) ? a : []).reduce((acc, log) => {
        const id = log.ticketId?._id || log.ticketId;
        acc[id] = acc[id] || [];
        acc[id].push(log);
        return acc;
      }, {});
      setAudits(grouped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketsAndAudits();
  }, [token]);

  // ✅ Animate tickets after DOM updates
  useLayoutEffect(() => {
    if (tickets.length) {
      const elements = ticketsRef.current.filter(Boolean);
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" }
        );
      }
    }
  }, [tickets]);

  const handlePostTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`${API}/api/tickets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
      });
      const created = await res.json();
      setTickets((prev) => [created, ...prev]); // will trigger animation
      setNewTicket({ title: "", description: "" });
      await fetchTicketsAndAudits();
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteTicket = async (id, index) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      const el = ticketsRef.current[index];
      if (el) {
        gsap.to(el, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          onComplete: async () => {
            await fetch(`${API}/api/tickets/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            setTickets((prev) => prev.filter((p) => p._id !== id));
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="ud-loading">Loading...</div>;

  return (
    <div className="ud-container">
      <h2 className="ud-title">🙋 User Dashboard</h2>

      <div className="ud-card ud-shadow">
        <h3>Create New Ticket</h3>
        <input
          value={newTicket.title}
          onChange={(e) =>
            setNewTicket((s) => ({ ...s, title: e.target.value }))
          }
          placeholder="Title"
        />
        <textarea
          value={newTicket.description}
          onChange={(e) =>
            setNewTicket((s) => ({ ...s, description: e.target.value }))
          }
          placeholder="Description"
          rows={4}
        />
        <div className="ud-actions-row">
          <button onClick={handlePostTicket} disabled={posting}>
            {posting ? "Posting..." : "➕ Submit Ticket"}
          </button>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="ud-empty">No tickets yet</div>
      ) : null}

      <div className="ud-tickets">
        {tickets.map((t, i) => (
          <div
            key={t._id}
            ref={(el) => ticketsRef.current[i] = el}
            className="ud-ticket ud-shadow"
          >
            <div className="ud-ticket-header">
              <div className="ud-title-block">
                <div className="ud-ticket-title">{t.title}</div>
                <div className="ud-ticket-desc small">{t.description}</div>
              </div>

              <div className="ud-actions">
                <span className={`ud-status ${t.status}`}>
                  {t.status.replace("_", " ")}
                </span>
                <Trash2
                  size={18}
                  className="ud-delete"
                  onClick={() => handleDeleteTicket(t._id, i)}
                />
              </div>
            </div>

            <div className="ud-audit">
              <h4>Workflow Logs</h4>
              {audits[t._id]?.length > 0 ? (
                audits[t._id].map((a) => (
                  <div key={a._id} className="ud-log">
                    <small>
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleString()
                        : "-"}{" "}
                      — <b>{a.action}</b> :{" "}
                      {a.meta?.draft ||
                        (a.meta?.usedKbTitles
                          ? a.meta.usedKbTitles.join(", ")
                          : JSON.stringify(a.meta))}
                    </small>
                  </div>
                ))
              ) : (
                <small>No logs yet</small>
              )}
            </div>

            {t.status === "resolved" && (
              <div className="ud-resolved">✅ Resolved</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
