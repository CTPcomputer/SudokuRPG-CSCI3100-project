import React,{useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LeaderBoard from './components/HomePage/LeaderBoard';
import Instructions from './components/HomePage/Instructions';
import Settings from './components/HomePage/Settings';
import Game from './components/Game/Game';
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';
import ForgotPassword from './components/Authentication/ForgotPassword';
import VerifyEmail from './components/Authentication/VerifyEmail';
import ResetPassword from './components/Authentication/ResetPassword';


function App() {
  const rootPage = localStorage.getItem('user') === null ? <Login /> : <HomePage />;
  return (
    <BrowserRouter>
            <Routes>
          <Route path="/" element={rootPage} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
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

