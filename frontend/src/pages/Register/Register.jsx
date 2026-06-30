import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    role: "Farmer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await register(form);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-brand">
          <div className="brand-icon">🌿</div>
          <div>
            <h2>AgriAI</h2>
            <p>Farm Intelligence Platform</p>
          </div>
        </div>

        <h1>Create account</h1>
        <p className="auth-subtitle">
          Start using AI-powered crop disease detection and farm intelligence.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Full Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              maxLength={72}
              required
            />
          </label>

          <label>
            <span>Phone</span>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Location</span>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, State, Country"
            />
          </label>

          <label>
            <span>Role</span>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="Farmer">Farmer</option>
              <option value="Researcher">Researcher</option>
              <option value="Agriculture Officer">Agriculture Officer</option>
            </select>
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;