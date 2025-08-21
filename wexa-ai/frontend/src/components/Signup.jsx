import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


const API =process.env.REACT_APP_API_URL

export default function Signup() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", isAdmin: false, isHumanAgent: false });

  const signup = async () => {
    try {
      const r = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await r.json();
      if (!r.ok) return alert("Signup failed");
      localStorage.setItem("token", data.token);
      const me = await fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${data.token}` } });
      localStorage.setItem("user", JSON.stringify(await me.json()));
      nav("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div style={{maxWidth:400, margin:"40px auto", padding:24, border:"1px solid #ddd", borderRadius:12}}>
      <h2>Create Account</h2>
      <input style={input} placeholder="Name" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
      <input style={input} placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
      <input style={input} type="password" placeholder="Password" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/>
      <label><input type="checkbox" checked={f.isAdmin} onChange={e=>setF({...f,isAdmin:e.target.checked})}/> Admin</label><br/>
      <label><input type="checkbox" checked={f.isHumanAgent} onChange={e=>setF({...f,isHumanAgent:e.target.checked})}/> Human Agent</label>
      <div style={{marginTop:12}}>
        <button style={btn} onClick={signup}>Signup</button>
        <Link to="/signin"><button style={linkBtn}>Already have an account?</button></Link>
      </div>
    </div>
  );
}

const input = {padding:10, margin:"8px 0", width:"100%", border:"1px solid #ccc", borderRadius:8};
const btn = {padding:"10px 14px", background:"#111", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", marginRight:8};
const linkBtn = {padding:"10px 14px", background:"#fff", border:"1px solid #111", borderRadius:8, cursor:"pointer"};
