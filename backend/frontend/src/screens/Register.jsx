// Register.jsx (simple companion page referenced by the "Create one" link)
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    if (!form.email || !form.password) return setErrors({ submit: "All fields are required" });
    // TODO: call real register API
    await new Promise((r) => setTimeout(r, 700));
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl text-white font-semibold mb-2">Create account</h2>
          <p className="text-sm text-gray-300 mb-6">Register to get started</p>

          {errors.submit && <div className="text-red-300 mb-3">{errors.submit}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange}
              className="w-full rounded-md bg-gray-900/60 border border-gray-700 px-3 py-2 text-white" />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
              className="w-full rounded-md bg-gray-900/60 border border-gray-700 px-3 py-2 text-white" />
            <button className="w-full py-2 rounded-md bg-indigo-500 text-white">Create account</button>
          </form>

          <div className="mt-4 text-sm text-gray-300">
            Already have an account? <Link to="/login" className="text-indigo-300 underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
