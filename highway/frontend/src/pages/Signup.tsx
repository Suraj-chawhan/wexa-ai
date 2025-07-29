import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = ({ setUser }: { setUser: any }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    try {
      
      const checkRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/check-email?email=${encodeURIComponent(email)}`);
      const checkData = await checkRes.json();

      if (checkData.exists) {
        setError("User already exists. Please sign in.");
        return;
      }
      
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, email }),
      });

      if (!res.ok) throw new Error("Failed to send OTP");
      setStep("otp");
      setError("");
    } catch {
      setError("Could not send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!data.token) throw new Error("OTP failed");

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate("/");
    } catch {
      setError("Invalid or expired OTP");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <h1>Sign Up</h1>
        <p>Sign up to enjoy the features of HD</p>
        <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
          {step === "form" ? (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  max={new Date().toISOString().split("T")[0]} // Prevent future dates
                  onChange={(e) => setDob(e.target.value)}
                />
                {dob && (
                  <small style={{ color: "gray" }}>
                    Selected DOB: {new Date(dob).toLocaleDateString()}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="button" onClick={handleSendOtp}>
                Get OTP
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button type="button" onClick={handleVerifyOtp}>
                Verify & Sign Up
              </button>
            </>
          )}
        </form>

        {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

        <div className="signup-footer">
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </div>

      <div className="signup-right">
        <img src="/blue.jpg" alt="Signup Visual" />
      </div>
    </div>
  );
};

export default Signup;
