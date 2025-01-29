import React, { useState } from 'react';
import Quiz from './components/Quiz';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div className="App">
      <h1>Quiz App</h1>
      {isLoggedIn ? (
        <>
          <p>Selamat datang, {username}!</p>
          <button onClick={handleLogout}>Logout</button>
          <Quiz />
        </>
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;