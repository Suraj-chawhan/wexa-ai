"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "";
let socket;

export default function ChatPage() {
  const [me, setMe] = useState(null);
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState("sidebar"); // "sidebar" or "chat" for mobile
  const bottomRef = useRef(null);
  const router = useRouter();

  // Detect device width
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  // Load session
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedMe = localStorage.getItem("me");
    if (!savedToken || !savedMe) {
      router.push("/signin");
      return;
    }
    setToken(savedToken);
    setMe(JSON.parse(savedMe));
  }, [router]);

  // Fetch users
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Fetch users error:", err));
  }, [token]);

  // Socket connection
  useEffect(() => {
    if (!token || !me) return;
    socket = io(API);
    socket.on("new-message", (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.meta_msg_id === msg.meta_msg_id);
        return exists ? prev : [...prev, msg];
      });
    });
    return () => socket.disconnect();
  }, [token, me]);

  // Load messages for a user
  const loadMessages = (user) => {
    setActiveUser(user);
    fetch(`${API}/messages/${user.number}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const unique = [];
        data.forEach((m) => {
          if (!unique.some((x) => x.meta_msg_id === m.meta_msg_id)) {
            unique.push(m);
          }
        });
        setMessages(unique);
        if (isMobile) setView("chat");
      })
      .catch((err) => console.error("Fetch messages error:", err));
  };

  // Send a message
  const sendMessage = () => {
    if (!text.trim() || !activeUser) return;
    const tempId = Date.now().toString();
    const newMsg = {
      wa_id: activeUser.number,
      name: activeUser.username || activeUser.number,
      number: me.number,
      content: text,
      timestamp: new Date(),
      status: "sent",
      meta_msg_id: tempId,
    };
    setMessages((prev) => [...prev, newMsg]);
    fetch(`${API}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newMsg),
    }).catch((err) => console.error("Send error:", err));
    setText("");
  };

  const logout = () => {
    localStorage.clear();
    router.push("/signin");
  };

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Inline styles
  const styles = {
    container: { display: "flex", height: "100vh", background: "#f0f0f0" },
    sidebar: {
      width: isMobile ? "100%" : "300px",
      background: "#fff",
      borderRight: "1px solid #ddd",
      display: view === "sidebar" || !isMobile ? "flex" : "none",
      flexDirection: "column",
    },
    sidebarHeader: {
      padding: "15px",
      background: "#075E54",
      color: "white",
      fontWeight: "bold",
      fontSize: "18px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    userList: { flex: 1, overflowY: "auto" },
    userItem: {
      padding: "12px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      borderBottom: "1px solid #eee",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "#ccc",
      marginRight: "10px",
    },
    chatArea: {
      flex: 1,
      display: view === "chat" || !isMobile ? "flex" : "none",
      flexDirection: "column",
    },
    chatHeader: {
      background: "#075E54",
      color: "white",
      padding: "10px 15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    backBtn: {
      background: "transparent",
      border: "none",
      color: "white",
      fontSize: "20px",
      cursor: "pointer",
      marginRight: "10px",
    },
    messageList: {
      flex: 1,
      padding: "15px",
      overflowY: "auto",
      background: "#e5ddd5",
      display: "flex",
      flexDirection: "column",
    },
    msgBubble: (isMine) => ({
      background: isMine ? "#dcf8c6" : "white",
      padding: "10px 14px",
      borderRadius: "8px",
      margin: "5px 0",
      maxWidth: "70%",
      alignSelf: isMine ? "flex-end" : "flex-start",
      boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
    }),
    inputArea: {
      display: "flex",
      padding: "10px",
      borderTop: "1px solid #ccc",
      background: "#f0f0f0",
    },
    input: {
      flex: 1,
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "20px",
      outline: "none",
    },
    sendBtn: {
      background: "#25D366",
      border: "none",
      marginLeft: "8px",
      padding: "0 15px",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logoutBtn: {
      background: "#d9534f",
      border: "none",
      padding: "5px 10px",
      color: "white",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          Chats
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
        <div style={styles.userList}>
          {users.map((u) => (
            <div
              key={u.number}
              style={styles.userItem}
              onClick={() => loadMessages(u)}
            >
              <div style={styles.avatar}></div>
              {u.username || u.number}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={styles.chatArea}>
        <div style={styles.chatHeader}>
          {isMobile && (
            <button style={styles.backBtn} onClick={() => setView("sidebar")}>
              ←
            </button>
          )}
          <div>{activeUser ? activeUser.username || activeUser.number : "Select a chat"}</div>
        </div>
        <div style={styles.messageList}>
          {messages.map((m) => (
            <div
              key={m.meta_msg_id}
              style={styles.msgBubble(m.number === me?.number)}
            >
              {m.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        {activeUser && (
          <div style={styles.inputArea}>
            <input
              style={styles.input}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button style={styles.sendBtn} onClick={sendMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20" height="20" viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
