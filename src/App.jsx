import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Sidebar from "./components/Sidebar";
import StudentPage from "./components/StudentPage";
import LoginPage from './Login/LoginPage.jsx';
import NotFoundPage from "./components/NotFoundPage.jsx";
import "./App.css";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Router> {/* Wrap your entire app with BrowserRouter */}
      <AppContent 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} // Pass it down as a prop
      />
    </Router>
  );
};

const AppContent = ({ toggleSidebar, isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  // Close the sidebar when navigating to login page
  useEffect(() => {
    if (location.pathname === "/login") {
      setIsSidebarOpen(false); // Close sidebar on /login route
    }
  }, [location, setIsSidebarOpen]);

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`content-container ${isSidebarOpen ? "blur" : ""}`}
        style={{
          marginLeft: isSidebarOpen ? "250px" : "0",
        }}
      >
        {/* Show hamburger icon only if the sidebar is not open and we are not on /login */}
        {location.pathname === "/home" && !isSidebarOpen && (
          <IconButton
            onClick={toggleSidebar}
            sx={{
              position: "fixed",
              top: 20,
              left: 50,
              zIndex: 1500,
            }}
          >
            <Menu />
          </IconButton>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<StudentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
