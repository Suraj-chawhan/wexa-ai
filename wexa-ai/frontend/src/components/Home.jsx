import React from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard.jsx";
import AgentDashboard from "./AgentDashboard.jsx";
import UserDashboard from "./UserDashboard.jsx";

export default function Home() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  if (!token) nav("/signin");

  const logout = () => { localStorage.clear(); nav("/signin"); };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <b>{user?.name}</b> ({user?.isAdmin ? "Admin" : user?.isHumanAgent ? "Agent" : "User"})
        </div>
        <button style={styles.btn} onClick={logout}>🚪 Logout</button>
      </div>

      {user?.isAdmin && <AdminDashboard token={token} />}
      {user?.isHumanAgent && <AgentDashboard token={token} />}
      {!user?.isAdmin && !user?.isHumanAgent && <UserDashboard token={token} />}
    </div>
  );
}

const styles = {
  page: { maxWidth: 1000, margin: "20px auto", padding: 20, fontFamily: "Inter, Arial, sans-serif" },
  topBar: { display: "flex", justifyContent: "space-between", marginBottom: 20, paddingBottom: 10, borderBottom: "1px solid #eee" },
  btn: { padding: "8px 12px", background: "#111", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }
};
