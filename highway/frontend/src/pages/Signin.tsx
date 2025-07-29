import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";

const Signin = ({ setUser }: { setUser: any }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGetOtp = async () => {
    try {
      setError("");

      // ✅ Step 1: Check if user exists
      const checkRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/check-email?email=${encodeURIComponent(email)}`);
      const checkData = await checkRes.json();

      if (!checkRes.ok || !checkData.exists) {
        setError("This email is not registered. Please sign up first.");
        return;
      }

      // ✅ Step 2: Send OTP
      const otpRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!otpRes.ok) throw new Error("Failed to send OTP");
      setOtpEnabled(true);
      setError("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setError("");
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!data.token) throw new Error("Invalid or expired OTP");

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Invalid OTP or server error");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <h1>Sign in</h1>
        <p>Please login to continue to your account.</p>

        <div className="signin-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!otpEnabled && email && (
            <button onClick={handleGetOtp}>Get OTP</button>
          )}

          {otpEnabled && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={handleVerifyOtp}>Verify & Sign in</button>
            </>
          )}

          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        </div>

        <div className="signin-footer">
          Need an account? <a href="/signup">Create one</a>
        </div>
      </div>

      <div className="signin-right">
        <img src="/blue.jpg" alt="Login Visual" />
      </div>
    </div>
  );
};

export default Signin;
