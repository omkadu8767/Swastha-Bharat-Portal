import { useState } from 'react';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import Header from './Header';

const Register = () => {
  const { login } = useAuth();
  const host = "http://localhost:5000";
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${host}/api/auth/createuser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const json = await response.json();
    if (json.success) {
      login(json.authToken);
      navigate('/');
      toast.success("SignUp Successfull", { position: "top-right", autoClose: 2000 });
    } else {
      toast.error("Please fill all the fields or Credentials Already Used, Try to Login", { position: "top-right", autoClose: 2000 });
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 px-4 py-10">
        <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4 text-center">Register</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-slate-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
                value={credentials.name}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-slate-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="name@company.com"
                required
                value={credentials.email}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-slate-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                minLength={5}
                required
                value={credentials.password}
                onChange={onChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Create an account
            </button>
            <div className="text-sm text-slate-400 text-center">
              Already have an account?{" "}
              <RouterLink to="/login" className="text-emerald-400 hover:underline">Login here</RouterLink>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;