import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import StockGame from "./StockGame";
import LearnPage from "./Learn";
import FundedPractice from "./FundedPractice";
import { AuthProvider } from "./AuthProvider";
import Login from "./Login";
import Signup from "./Signup";

const YELLOW = '#FFD600';
const BLUE = '#0057B8';

function TopBar() {
  const navigate = useNavigate();
  return (
    <div style={{
      width: "100%",
      background: YELLOW,
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      padding: "18px 0",
      fontWeight: "bold",
      fontSize: "1.2rem",
      color: BLUE,
      letterSpacing: "2px"
    }}>
      <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Home</span>
      <span style={{ cursor: "pointer" }} onClick={() => navigate("/1v1")}>1v1</span>
      <span style={{ cursor: "pointer" }}>Friends</span>
      <span style={{ cursor: "pointer" }} onClick={() => navigate("/learn")}>Learn</span>
  <span style={{ cursor: "pointer" }} onClick={() => navigate("/funded")}>Funded Practice</span>
  <span style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>Login</span>
  <span style={{ cursor: "pointer" }} onClick={() => navigate("/signup")}>Signup</span>
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/1v1" element={<StockGame />} />
        <Route path="/learn" element={<LearnPage />} />
  <Route path="/funded" element={<FundedPractice />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;