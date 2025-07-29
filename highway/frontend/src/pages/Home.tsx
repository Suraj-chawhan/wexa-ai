import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = ({ user, setUser }: { user: any; setUser: any }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const navigate = useNavigate();

  const token = user?.token;
  const userId = user?.userId;

  const handleCreateNote = async () => {
    if (!newNote.trim()) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Correct usage
        },
        body: JSON.stringify({ content: newNote }),
      });

      if (!res.ok) throw new Error("Failed to create note");
      const newOne = await res.json();
      setNotes((prev) => [...prev, newOne]);
      setNewNote("");
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Correct usage
        },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null); // clear session
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchNotes = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Correct usage
          },
        });

        const data = await res.json();
        setNotes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch failed", err);
        setNotes([]);
      }
    };

    fetchNotes();
  }, [user, navigate, userId, token]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <span className="logo">📒 Notes</span>
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <div className="user-card">
        <h2>Welcome, {user?.name || "User"}</h2>
        <p>Email: {user?.email}</p>
      </div>

      <div className="note-input-form">
        <textarea
          placeholder="Write your note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button onClick={handleCreateNote} disabled={!newNote.trim()}>
          Add Note
        </button>
      </div>

      <div className="notes-section">
        <h3>Your Notes</h3>
        {notes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="note-card">
              <span>{note.content}</span>
              <button onClick={() => handleDeleteNote(note._id)}>🗑️</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
