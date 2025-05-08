import React,{useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LeaderBoard from './components/HomePage/LeaderBoard';
import Instructions from './components/HomePage/Instructions';
import Settings from './components/HomePage/Settings';
import Game from './components/Game/Game';
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';


function App() {
  const rootPage = localStorage.getItem('user') === null ? <Login /> : <HomePage />;
  return (
    <BrowserRouter>
            <Routes>
          <Route path="/" element={rootPage} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;

