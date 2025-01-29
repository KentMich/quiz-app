import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle antara login dan register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi input
    if (!username || !password) {
      setError('Username dan password harus diisi!');
      return;
    }

    if (isLogin) {
      // Proses login
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find((u) => u.username === username && u.password === password);

      if (user) {
        onLogin(username); // Panggil fungsi onLogin dari parent
        setError('');
      } else {
        setError('Username atau password salah!');
      }
    } else {
      // Proses registrasi
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.some((u) => u.username === username);

      if (userExists) {
        setError('Username sudah terdaftar!');
      } else {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        onLogin(username); // Langsung login setelah registrasi
        setError('');
      }
    }
  };

  return (
    <div className="auth">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default Auth;