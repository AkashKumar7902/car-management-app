// src/components/Layout/Navbar.js
import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Car Management App
          </Typography>
          <Link
            href={`${process.env.REACT_APP_API_BASE_URL}/api/docs/index.html`}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            underline="none"
            sx={{ marginRight: 2 }}
          >
            API Docs
          </Link>
          {user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/cars">
                My Cars
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/signup">
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
