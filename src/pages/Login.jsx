import React, { useState, useEffect } from 'react';
import { signIn } from '../lib/auth';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) {
      alert(error.message);
    } else {
      navigate('/dashboard', { replace: true });
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
