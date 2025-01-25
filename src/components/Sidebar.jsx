
import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
// import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Close Button */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "absolute",
          top: 10,
          left: 150,
        }}
      >
        <Close />
      </IconButton>
      <h3>Menu</h3>
      <ul className="sidebar-list">
        <li>
          <Link to="/dashboard" className="sidebar-link">Students Page</Link>
        </li>
        <li>
          <Link to="/login" className="sidebar-link">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
