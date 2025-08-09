"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleRegister = async () => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, number, password })
    });
    if (res.ok) {
      alert("Registered successfully!");
      router.push("/signin");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Number" value={number} onChange={(e) => setNumber(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
        <p>Already have an account? <a href="/signin">Sign in</a></p>
      </div>
    </div>
  );
}
