"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("me", JSON.stringify({ username: data.username, number: data.number }));
      router.push("/");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign In</h2>
        <input placeholder="Number" value={number} onChange={(e) => setNumber(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
}
