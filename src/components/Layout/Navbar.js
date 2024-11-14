// src/components/Layout/Navbar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link>
      <a
        href={`${process.env.REACT_APP_API_BASE_URL}/api/docs/index.html`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginLeft: "10px" }}
      >
        API Docs
      </a>

      {user ? (
        <>
          <Link to="/cars">My Cars</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
